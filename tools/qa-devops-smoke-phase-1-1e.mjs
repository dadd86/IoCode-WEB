import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/devops/phase-1-1e";
const baseUrl =
  process.env.DEVOPS_BASE_URL ||
  process.env.PLAYWRIGHT_BASE_URL ||
  "http://web:8080";

const maxAttempts = Number(process.env.DEVOPS_SMOKE_MAX_ATTEMPTS || 30);
const delayMs = Number(process.env.DEVOPS_SMOKE_DELAY_MS || 1000);

const errors = [];
const results = [];

const routes = [
  { path: "/health", expectedStatus: 200 },
  { path: "/es/", expectedStatus: 200 },
  { path: "/en/", expectedStatus: 200 },
  { path: "/de/", expectedStatus: 200 },
  { path: "/no-existe/", expectedStatus: 404 }
];

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });

  writeFileSync(
    join(artifactRoot, name),
    JSON.stringify(payload, null, 2),
    "utf8"
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function headWithRetry(route) {
  const url = new URL(route.path, baseUrl).toString();
  let lastError = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000)
      });

      const result = {
        path: route.path,
        url,
        expectedStatus: route.expectedStatus,
        actualStatus: response.status,
        attempt,
        passed: response.status === route.expectedStatus,
        headers: {
          "content-type": response.headers.get("content-type"),
          "cache-control": response.headers.get("cache-control"),
          "content-security-policy": response.headers.get("content-security-policy"),
          "x-content-type-options": response.headers.get("x-content-type-options"),
          "x-frame-options": response.headers.get("x-frame-options")
        }
      };

      if (result.passed) {
        return result;
      }

      lastError = `status ${response.status}, esperado ${route.expectedStatus}`;
    } catch (error) {
      lastError = error.message;
    }

    await sleep(delayMs);
  }

  return {
    path: route.path,
    url,
    expectedStatus: route.expectedStatus,
    actualStatus: null,
    attempt: maxAttempts,
    passed: false,
    error: lastError
  };
}

for (const route of routes) {
  const result = await headWithRetry(route);

  results.push(result);

  if (!result.passed) {
    errors.push(
      `${route.path}: esperado ${route.expectedStatus}, recibido ${result.actualStatus ?? "sin respuesta"} (${result.error ?? "sin detalle"}).`
    );
  }

  if (result.passed && route.path !== "/health") {
    if (!result.headers["content-security-policy"]) {
      errors.push(`${route.path}: falta Content-Security-Policy.`);
    }

    if (result.headers["x-content-type-options"] !== "nosniff") {
      errors.push(`${route.path}: X-Content-Type-Options debe ser nosniff.`);
    }

    if (result.headers["x-frame-options"] !== "DENY") {
      errors.push(`${route.path}: X-Frame-Options debe ser DENY.`);
    }
  }
}

const status = errors.length === 0 ? "passed" : "failed";

writeArtifact("smoke.json", {
  phase: "1.1E",
  check: "devops-smoke",
  status,
  baseUrl,
  maxAttempts,
  delayMs,
  routes: results,
  warningCount: 0,
  errorCount: errors.length,
  warnings: [],
  errors,
  generatedAt: new Date().toISOString()
});

if (errors.length > 0) {
  console.error("Errores smoke Fase 1.1E:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Smoke test Fase 1.1E superado.");