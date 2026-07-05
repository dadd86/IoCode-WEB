import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const errors = [];

function readJson(name) {
  const path = join(artifactRoot, name);

  if (!existsSync(path)) {
    errors.push(`${path}: artifact requerido no existe.`);
    return null;
  }

  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${path}: JSON inválido: ${error.message}`);
    return null;
  }
}

function assertPassed(artifact, name) {
  if (!artifact) {
    return;
  }

  if (artifact.status !== "passed") {
    errors.push(`${name}: status ${artifact.status}; se esperaba passed.`);
  }

  if ((artifact.errorCount ?? 0) > 0) {
    errors.push(`${name}: errorCount ${artifact.errorCount}.`);
  }
}

const budgets = readJson("performance-budgets.json");
const glb = readJson("glb-report.json");
const validator = readJson("gltf-validator-report.json");
const bundle = readJson("bundle-report.json");
const headers = readJson("headers-report.json");
const lighthouse = readJson("lighthouse-summary.json");
const raster = readJson("raster-assets-report.json");
if (lighthouse?.results?.length !== 10) {
  errors.push(
    `lighthouse-summary.json: se esperaban 10 mediciones, recibidas ${lighthouse?.results?.length ?? 0}.`
  );
}

for (const result of lighthouse?.results ?? []) {
  if (!result.reportJson || !existsSync(result.reportJson)) {
    errors.push(`Lighthouse reportJson no existe: ${result.reportJson}`);
  }

  if (!result.reportHtml || !existsSync(result.reportHtml)) {
    errors.push(`Lighthouse reportHtml no existe: ${result.reportHtml}`);
  }
}

assertPassed(budgets, "performance-budgets.json");
assertPassed(raster, "raster-assets-report.json");
assertPassed(glb, "glb-report.json");
assertPassed(validator, "gltf-validator-report.json");
assertPassed(bundle, "bundle-report.json");
assertPassed(headers, "headers-report.json");
assertPassed(lighthouse, "lighthouse-summary.json");

const playwrightResultsPath = "qa-artifacts/playwright-results.json";

if (!existsSync(playwrightResultsPath)) {
  errors.push(`${playwrightResultsPath}: resultado Playwright requerido no encontrado.`);
} else {
  const results = JSON.parse(readFileSync(playwrightResultsPath, "utf8"));

  if ((results.stats?.unexpected ?? 0) > 0) {
    errors.push(`Playwright tiene unexpected failures: ${results.stats.unexpected}.`);
  }

  if ((results.stats?.flaky ?? 0) > 0) {
    errors.push(`Playwright tiene tests flaky: ${results.stats.flaky}.`);
  }
}

const status = errors.length === 0 ? "passed" : "failed";

const summary = {
  phase: "6",
  name: "Performance, Core Web Vitals y 3D avanzado",
  status,
  scope:
    "Budgets, GLB, bundle JS, lazy/defer 3D, headers/cache, runtime WebGL/reduced-motion y Lighthouse lab.",
  blockers: {
    S0: 0,
    S1: errors.length
  },
  artifacts: {
    budgets: "qa-artifacts/performance/phase-6/performance-budgets.json",
    glb: "qa-artifacts/performance/phase-6/glb-report.json",
    validator: "qa-artifacts/performance/phase-6/gltf-validator-report.json",
    bundle: "qa-artifacts/performance/phase-6/bundle-report.json",
    headers: "qa-artifacts/performance/phase-6/headers-report.json",
    lighthouse: "qa-artifacts/performance/phase-6/lighthouse-summary.json",
    raster: "qa-artifacts/performance/phase-6/raster-assets-report.json",
    playwright: "qa-artifacts/playwright-results.json"
  },
  warningCount: 0,
  errorCount: errors.length,
  warnings: [],
  errors,
  generatedAt: new Date().toISOString()
};

mkdirSync(artifactRoot, {
  recursive: true
});

writeFileSync(
  join(artifactRoot, "summary.json"),
  JSON.stringify(summary, null, 2),
  "utf8"
);

if (errors.length > 0) {
  console.error("Errores summary Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("summary.json Fase 6 generado sin warnings.");