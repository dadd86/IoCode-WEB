import { spawn, spawnSync } from "node:child_process";
import { resolve } from "node:path";

const externalBaseUrl = process.env.LIGHTHOUSE_BASE_URL;
const baseUrl = externalBaseUrl || "http://127.0.0.1:8080";
let server = null;
let status = 1;

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // El proceso puede seguir arrancando.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }
  throw new Error(`El servidor no respondió en ${baseUrl}.`);
}

try {
  if (!externalBaseUrl) {
    server = spawn(process.execPath, [resolve("Docker/node-static-server.mjs")], {
      env: { ...process.env, PORT: "8080" },
      stdio: "inherit"
    });
  }

  await waitForServer();

  const result = spawnSync(process.execPath, ["tools/lighthouse-phase-6.mjs"], {
    env: {
      ...process.env,
      LIGHTHOUSE_BASE_URL: baseUrl,
      LIGHTHOUSE_PHASE: "9D",
      LIGHTHOUSE_CHECK: "production-lighthouse",
      LIGHTHOUSE_ARTIFACT_ROOT: "qa-artifacts/phase-9d/lighthouse",
      LIGHTHOUSE_ROUTES: "/es/,/en/,/de/,/es/impressum/",
      LIGHTHOUSE_MIN_ACCESSIBILITY: "1",
      LIGHTHOUSE_MIN_BEST_PRACTICES: "0.95",
      LIGHTHOUSE_MIN_SEO: "1"
    },
    stdio: "inherit"
  });

  status = result.status ?? 1;
} finally {
  server?.kill("SIGTERM");
}

process.exit(status);
