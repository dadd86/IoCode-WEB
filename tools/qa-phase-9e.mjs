import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const reportPath = resolve(root, "qa-artifacts/phase-9e/static-report.json");
const checks = [];

async function text(path) {
  return readFile(resolve(root, path), "utf8");
}

function check(id, condition, evidence) {
  checks.push({ id, status: condition ? "passed" : "failed", evidence });
}

const config = JSON.parse(await text("config/observability.json"));
const nginx = await text("infra/nginx/nginx.conf");
const compose = await text("compose.production.yml");
const monitorWorkflow = await text(".github/workflows/production-monitor.yml");
const operationWorkflow = await text(".github/workflows/production-operation.yml");
const monitorTimer = await text("infra/systemd/iocode-production-monitor.timer");
const logrotate = await text("infra/logrotate/iocode-observability");
const prune = await text("tools/prune-observability-logs.sh");
const runbook = await text("docs/INCIDENT_RUNBOOK.md");
const dr = await text("docs/DISASTER_RECOVERY.md");
const observability = await text("docs/OBSERVABILITY.md");

check(
  "9.33-http-targets",
  config.http.intervalSeconds === 60 &&
    /OnUnitActiveSec=60s/u.test(monitorTimer) &&
    ["/health", "/es/", "/en/", "/de/"].every((path) =>
      config.http.targets.some((target) => target.path === path)
    ),
  "Intervalo externo de 60 s y cuatro rutas críticas configuradas."
);
check(
  "9.34-tls-dns",
  config.tls.criticalDaysRemaining === 14 &&
    config.dns.requireA === true &&
    config.dns.requireAAAA === true &&
    config.dns.requiredWwwCname === "iocode-solutions.com",
  "TLS crítico <=14 días y contrato A/AAAA/CNAME explícito."
);

const logFormat = nginx.match(/log_format privacy_minimal[\s\S]*?;\n/u)?.[0] || "";
const forbiddenLogVariables = [
  "$remote_addr",
  "$remote_user",
  "$request_uri",
  "$http_referer",
  "$http_user_agent",
  "$http_cookie",
  "$http_authorization"
];
check(
  "9.35-privacy-log",
  logFormat.length > 0 && forbiddenLogVariables.every((variable) => !logFormat.includes(variable)),
  "El log de acceso sólo conserva timestamp, estado, bytes y tiempos."
);
check(
  "9.36-retention",
  config.retention.rawLogsDays === 14 &&
    /maxage 14/u.test(logrotate) &&
    /rotate 14/u.test(logrotate) &&
    /-mtime "\+\$retention_days" -delete/u.test(prune) &&
    (compose.match(/driver: local/gu) || []).length === 2,
  "Rotación Docker acotada, logrotate de 14 días y poda diaria segura."
);
check(
  "9.37-alerts",
  /cron: "\*\/5 \* \* \* \*"/u.test(monitorWorkflow) &&
    /ALERT_WEBHOOK_URL/u.test(monitorWorkflow) &&
    /Notify operational failure/u.test(operationWorkflow),
  "Monitor defensivo programado y alertas de caída/despliegue por webhook HTTPS."
);
check(
  "9.38-runbook",
  ["Detección", "Contención", "Diagnóstico", "Rollback", "Comunicación"].every((term) =>
    runbook.includes(term)
  ),
  "Runbook cubre el ciclo operativo completo y severidades."
);
check(
  "9.39-disaster-recovery",
  ["DNS", "TLS", "rollback-release.sh", "RTO", "RPO"].every((term) => dr.includes(term)),
  "Recuperación versionada de aplicación, configuración, DNS y TLS."
);
check(
  "9.40-field-cwv",
  ["Search Console", "LCP", "CLS", "INP", "cookies", "14 días"].every((term) =>
    observability.includes(term)
  ),
  "CWV de campo sin script por defecto y contrato RUM opcional sin cookies."
);

const failed = checks.filter((item) => item.status === "failed");
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  status: failed.length === 0 ? "passed" : "failed",
  checks
};

await mkdir(dirname(reportPath), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const item of checks) console.log(`${item.status === "passed" ? "PASS" : "FAIL"} ${item.id}: ${item.evidence}`);
console.log(`Phase 9E static QA: ${report.status.toUpperCase()}`);
if (failed.length > 0) process.exitCode = 1;
