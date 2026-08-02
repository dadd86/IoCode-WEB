import { spawn } from "node:child_process";
import { resolve } from "node:path";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const baseUrl = externalBaseUrl || "http://127.0.0.1:8080";
let server = null;

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

function runPlaywright() {
  const cli = resolve("node_modules/playwright/cli.js");
  const requestedArguments = process.argv.slice(2);
  const args = [
    cli,
    "test",
    "phase-9d-production-smoke",
    ...(requestedArguments.length > 0
      ? requestedArguments
      : [
          "--project=chromium-desktop",
          "--project=chromium-mobile",
          "--project=webkit-iphone",
          "--project=webkit-ipad"
        ])
  ];

  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, args, {
      env: {
        ...process.env,
        PLAYWRIGHT_BASE_URL: baseUrl
      },
      stdio: "inherit"
    });

    child.on("error", rejectRun);
    child.on("exit", (code) => {
      if (code === 0) {
        resolveRun();
        return;
      }
      rejectRun(new Error(`Playwright terminó con código ${code}.`));
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
