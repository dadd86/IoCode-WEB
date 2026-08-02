import { spawn } from "node:child_process";
import { resolve } from "node:path";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const baseUrl = externalBaseUrl || "http://127.0.0.1:8080";
let server = null;

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`, {
        signal: AbortSignal.timeout(1000)
      });
      await response.body?.cancel();
      if (response.ok) return;
    } catch {
      // The local static server may still be starting.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }
  throw new Error(`The server did not become healthy at ${baseUrl}.`);
}

function runPlaywright() {
  const cli = resolve("node_modules/playwright/cli.js");
  const requestedArguments = process.argv.slice(2);
  const args = [
    cli,
    "test",
    "tests/e2e/phase-9f-legal-privacy.spec.ts",
    ...(requestedArguments.length > 0
      ? requestedArguments
      : ["--project=chromium-desktop", "--project=webkit-iphone"])
  ];

  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, args, {
      env: { ...process.env, PLAYWRIGHT_BASE_URL: baseUrl },
      stdio: "inherit"
    });
    child.on("error", rejectRun);
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`Playwright exited with code ${code}.`));
    });
  });
}

try {
  if (!externalBaseUrl) {
    server = spawn(process.execPath, [resolve("Docker/node-static-server.mjs")], {
      env: { ...process.env, PORT: "8080" },
      stdio: "inherit"
    });
  }
  await waitForServer();
  await runPlaywright();
} finally {
  server?.kill("SIGTERM");
}
