import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const errors = [];
const warnings = [];

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

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
const repair = readJson("glb-repair-report.json");
const glb = readJson("glb-report.json");
const validator = readJson("gltf-validator-report.json");
const bundle = readJson("bundle-report.json");
const headers = readJson("headers-report.json");
const lighthouse = readJson("lighthouse-summary.json");
const raster = readJson("raster-assets-report.json");
const runtime = readJson("3d-fallback-runtime-report.json");
const runtimeReview = readJson("hero3d-runtime-review.json");
const logo3dVersion = readJson("logo3d-cache-version-qa.json");
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
assertPassed(repair, "glb-repair-report.json");
assertPassed(raster, "raster-assets-report.json");
assertPassed(runtime, "3d-fallback-runtime-report.json");
assertPassed(runtimeReview, "hero3d-runtime-review.json");
assertPassed(logo3dVersion, "logo3d-cache-version-qa.json");
if ((runtime?.expectedTestCount ?? 0) < 9) {
  errors.push(
    `3d-fallback-runtime-report.json: expectedTestCount ${runtime?.expectedTestCount ?? 0}; se esperaban al menos 9 tests runtime para Fase 6.`
  );
}

if ((runtime?.actualSpecCount ?? 0) < 9) {
  errors.push(
    `3d-fallback-runtime-report.json: actualSpecCount ${runtime?.actualSpecCount ?? 0}; se esperaban al menos 9 tests runtime ejecutados.`
  );
}
assertPassed(glb, "glb-report.json");
assertPassed(validator, "gltf-validator-report.json");
assertPassed(bundle, "bundle-report.json");
assertPassed(headers, "headers-report.json");
assertPassed(lighthouse, "lighthouse-summary.json");

const glbPath = "public/logo/3d/iocode_solutions_logo_extruded_3d.glb";

if (!existsSync(glbPath)) {
  errors.push(`${glbPath}: GLB final no existe.`);
} else if (repair?.after?.sha256 !== sha256File(glbPath)) {
  errors.push(
    "glb-repair-report.json: el SHA-256 after no coincide con el GLB final actual. Ejecuta prepare:assets:6 dentro de Docker."
  );
}

if (!repair?.backupGlb || !existsSync(repair.backupGlb)) {
  errors.push("glb-repair-report.json: falta el backup recuperable before-repair.");
}

const artifactsWithWarnings = [
  ["performance-budgets.json", budgets],
  ["glb-repair-report.json", repair],
  ["glb-report.json", glb],
  ["gltf-validator-report.json", validator],
  ["bundle-report.json", bundle],
  ["headers-report.json", headers],
  ["lighthouse-summary.json", lighthouse],
  ["raster-assets-report.json", raster],
  ["hero3d-runtime-review.json", runtimeReview],
  ["logo3d-cache-version-qa.json", logo3dVersion],
  ["3d-fallback-runtime-report.json", runtime]
];

for (const [name, artifact] of artifactsWithWarnings) {
  if ((artifact?.warningCount ?? 0) === 0) {
    continue;
  }

  const artifactWarnings = artifact?.warnings ?? [];

  if (artifactWarnings.length === 0) {
    warnings.push(`${name}: warningCount ${artifact.warningCount}.`);
  } else {
    warnings.push(...artifactWarnings.map((warning) => `${name}: ${warning}`));
  }

  errors.push(`${name}: contiene ${artifact.warningCount} warning(s); el cierre exige cero.`);
}

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
    repair: "qa-artifacts/performance/phase-6/glb-repair-report.json",
    glb: "qa-artifacts/performance/phase-6/glb-report.json",
    validator: "qa-artifacts/performance/phase-6/gltf-validator-report.json",
    bundle: "qa-artifacts/performance/phase-6/bundle-report.json",
    headers: "qa-artifacts/performance/phase-6/headers-report.json",
    lighthouse: "qa-artifacts/performance/phase-6/lighthouse-summary.json",
    raster: "qa-artifacts/performance/phase-6/raster-assets-report.json",
    runtimeReview: "qa-artifacts/performance/phase-6/hero3d-runtime-review.json",
    runtime: "qa-artifacts/performance/phase-6/3d-fallback-runtime-report.json",
    logo3dVersion: "qa-artifacts/performance/phase-6/logo3d-cache-version-qa.json",
    playwright: "qa-artifacts/playwright-results.json"
  },
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
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

console.log("summary.json Fase 6 generado con evidencia completa y sin warnings.");
