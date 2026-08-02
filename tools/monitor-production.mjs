import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { resolve4, resolve6, resolveCname } from "node:dns/promises";
import { connect } from "node:tls";

const projectRoot = resolve(import.meta.dirname, "..");
const config = JSON.parse(
  await readFile(resolve(projectRoot, "config/observability.json"), "utf8")
);

const origin = process.env.MONITOR_ORIGIN || config.origin;
const artifactPath = resolve(
  projectRoot,
  process.env.MONITOR_ARTIFACT || "qa-artifacts/phase-9e/monitor-report.json"
);
const dnsEnabled = process.env.MONITOR_DNS_ENABLED !== "false";
const tlsEnabled = process.env.MONITOR_TLS_ENABLED !== "false";
const requireSecurityHeaders = process.env.MONITOR_REQUIRE_SECURITY_HEADERS !== "false";
const timeoutMs = Number(process.env.MONITOR_TIMEOUT_MS || config.http.timeoutMs);

function durationMs(startedAt) {
  return Number((performance.now() - startedAt).toFixed(1));
}

function safeMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

async function checkHttpTarget(target) {
  const url = new URL(target.path, origin);
  const startedAt = performance.now();

  try {
    const response = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "User-Agent": "IoCode-Production-Monitor/1.0" }
    });
    const contentType = response.headers.get("content-type") || "";
    const issues = [];

    if (response.status !== 200) issues.push(`status=${response.status}`);
    if (!contentType.toLowerCase().startsWith(target.contentType)) {
      issues.push(`content-type=${contentType || "missing"}`);
    }

    if (requireSecurityHeaders && target.path !== "/health") {
      if (!response.headers.get("content-security-policy")) issues.push("CSP missing");
      if (url.protocol === "https:" && !response.headers.get("strict-transport-security")) {
        issues.push("HSTS missing");
      }
    }

    const elapsed = durationMs(startedAt);
    if (elapsed > config.http.latencyWarningMs) {
      issues.push(`latency=${elapsed}ms>${config.http.latencyWarningMs}ms`);
    }

    await response.body?.cancel();

    return {
      kind: "http",
      target: target.path,
      ok: issues.length === 0,
      status: response.status,
      contentType,
      durationMs: elapsed,
      issues
    };
  } catch (error) {
    return {
      kind: "http",
      target: target.path,
      ok: false,
      durationMs: durationMs(startedAt),
      issues: [safeMessage(error)]
    };
  }
}

async function resolveWithTimeout(resolver, hostname) {
  return new Promise((resolveDns, rejectDns) => {
    const timer = setTimeout(() => rejectDns(new Error("DNS timeout")), timeoutMs);
    resolver(hostname).then(
      (records) => {
        clearTimeout(timer);
        resolveDns(records);
      },
      (error) => {
        clearTimeout(timer);
        rejectDns(error);
      }
    );
  });
}

async function checkDns() {
  const { apex, www, requireA, requireAAAA, requiredWwwCname } = config.dns;
  const issues = [];
  const records = { A: [], AAAA: [], CNAME: [] };

  for (const [type, resolver, hostname] of [
    ["A", resolve4, apex],
    ["AAAA", resolve6, apex],
    ["CNAME", resolveCname, www]
  ]) {
    try {
      records[type] = await resolveWithTimeout(resolver, hostname);
    } catch (error) {
      issues.push(`${type} ${hostname}: ${safeMessage(error)}`);
    }
  }

  if (requireA && records.A.length === 0) issues.push("A record missing");
  if (requireAAAA && records.AAAA.length === 0) issues.push("AAAA record missing");
  const normalizedCnames = records.CNAME.map((value) => value.replace(/\.$/u, ""));
  if (!normalizedCnames.includes(requiredWwwCname)) {
    issues.push(`www CNAME must resolve to ${requiredWwwCname}`);
  }

  return {
    kind: "dns",
    target: apex,
    ok: issues.length === 0,
    records: {
      A: { count: records.A.length },
      AAAA: { count: records.AAAA.length },
      CNAME: normalizedCnames
    },
    issues
  };
}

async function checkTls() {
  const { hostname, port, criticalDaysRemaining, warningDaysRemaining, requiredNames } = config.tls;

  return new Promise((resolveCheck) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolveCheck(result);
    };
    const socket = connect({ host: hostname, port, servername: hostname, rejectUnauthorized: true });

    socket.setTimeout(timeoutMs);
    socket.once("secureConnect", () => {
      const certificate = socket.getPeerCertificate();
      const validToMs = Date.parse(certificate.valid_to);
      const daysRemaining = Number(((validToMs - Date.now()) / 86_400_000).toFixed(1));
      const sans = (certificate.subjectaltname || "")
        .split(",")
        .map((name) => name.trim().replace(/^DNS:/u, ""))
        .filter(Boolean);
      const issues = [];

      if (!Number.isFinite(daysRemaining)) issues.push("certificate expiry is invalid");
      if (daysRemaining <= criticalDaysRemaining) {
        issues.push(`certificate expires in ${daysRemaining} days (critical <= ${criticalDaysRemaining})`);
      }
      for (const name of requiredNames) {
        if (!sans.includes(name)) issues.push(`certificate SAN missing ${name}`);
      }

      socket.end();
      finish({
        kind: "tls",
        target: hostname,
        ok: issues.length === 0,
        daysRemaining,
        warning: daysRemaining <= warningDaysRemaining,
        validTo: Number.isFinite(validToMs) ? new Date(validToMs).toISOString() : null,
        protocol: socket.getProtocol(),
        issues
      });
    });
    socket.once("timeout", () => {
      socket.destroy();
      finish({ kind: "tls", target: hostname, ok: false, issues: ["TLS timeout"] });
    });
    socket.once("error", (error) => {
      finish({ kind: "tls", target: hostname, ok: false, issues: [safeMessage(error)] });
    });
  });
}

const checks = await Promise.all([
  ...config.http.targets.map(checkHttpTarget),
  ...(dnsEnabled ? [checkDns()] : []),
  ...(tlsEnabled ? [checkTls()] : [])
]);
const failures = checks.filter((check) => !check.ok);
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  origin,
  status: failures.length === 0 ? "passed" : "failed",
  checks,
  summary: { total: checks.length, passed: checks.length - failures.length, failed: failures.length }
};

await mkdir(dirname(artifactPath), { recursive: true });
await writeFile(artifactPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(`Production monitor: ${report.status.toUpperCase()} (${report.summary.passed}/${report.summary.total})`);
console.log(`Report: ${artifactPath}`);
for (const failure of failures) {
  console.error(`- ${failure.kind}:${failure.target}: ${failure.issues.join("; ")}`);
}

process.exitCode = failures.length === 0 ? 0 : 1;
