import { spawn } from "node:child_process";
import { once } from "node:events";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const server = spawn(process.execPath, [resolve(root, "Docker/node-static-server.mjs")], {
  cwd: root,
  env: { ...process.env, PORT: "8080" },
  stdio: ["ignore", "ignore", "pipe"]
});
let serverError = "";
server.stderr.setEncoding("utf8");
server.stderr.on("data", (chunk) => {
  serverError += chunk;
});

async function waitUntilHealthy() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch("http://127.0.0.1:8080/health", {
        signal: AbortSignal.timeout(500)
      });
      await response.body?.cancel();
      if (response.status === 200) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error(`Local server did not become healthy. ${serverError}`.trim());
}

async function runMonitor(environment) {
  const child = spawn(process.execPath, [resolve(root, "tools/monitor-production.mjs")], {
    cwd: root,
    env: { ...process.env, ...environment },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  const [code] = await once(child, "exit");
  return { code, stdout, stderr };
}

try {
  await waitUntilHealthy();
  const healthy = await runMonitor({
    MONITOR_ORIGIN: "http://127.0.0.1:8080",
    MONITOR_DNS_ENABLED: "false",
    MONITOR_TLS_ENABLED: "false",
    MONITOR_ARTIFACT: "qa-artifacts/phase-9e/monitor-local-healthy.json"
  });
  if (healthy.code !== 0) {
    throw new Error(`Healthy monitor simulation failed.\n${healthy.stdout}${healthy.stderr}`);
  }
  console.log("PASS monitor healthy-service simulation");
} finally {
  if (server.exitCode === null) {
    server.kill();
    await once(server, "exit");
  }
}

const outage = await runMonitor({
  MONITOR_ORIGIN: "http://127.0.0.1:65534",
  MONITOR_DNS_ENABLED: "false",
  MONITOR_TLS_ENABLED: "false",
  MONITOR_REQUIRE_SECURITY_HEADERS: "false",
  MONITOR_TIMEOUT_MS: "1000",
  MONITOR_ARTIFACT: "qa-artifacts/phase-9e/monitor-outage-simulation.json"
});

if (outage.code === 0) {
  throw new Error("Outage monitor simulation was not detected.");
}
if (!outage.stderr.includes("http:/health") && !outage.stderr.includes("http:/es/")) {
  throw new Error(`Outage report did not identify failed HTTP targets.\n${outage.stderr}`);
}

console.log("PASS monitor outage detection (expected non-zero exit)");
