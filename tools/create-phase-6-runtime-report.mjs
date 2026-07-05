import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const playwrightResultsPath = "qa-artifacts/playwright-results.json";
const outputPath = join(artifactRoot, "3d-fallback-runtime-report.json");

const errors = [];
const warnings = [];

function collectSpecs(suites, collected = []) {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) {
      collected.push(spec);
    }

    collectSpecs(suite.suites, collected);
  }

  return collected;
}

mkdirSync(artifactRoot, {
  recursive: true
});

if (!existsSync(playwrightResultsPath)) {
  errors.push(`${playwrightResultsPath}: no existe.`);
} else {
  const results = JSON.parse(readFileSync(playwrightResultsPath, "utf8"));
  const specs = collectSpecs(results.suites);

  const failedSpecs = specs.filter((spec) =>
    spec.tests?.some((test) =>
      test.results?.some((result) => result.status !== "passed")
    )
  );

  const expectedNames = [
    "fallback y contenido aparecen aunque WebGL no esté disponible",
    "reduced motion no carga escena pesada y mantiene contenido usable",
    "fallback se activa si el GLB no se puede descargar",
    "CTA del hero no queda cortado visualmente",
    "no hay overflow horizontal causado por hero 3D",
    "el 3D no se carga antes de interacción y carga al interactuar con el hero"
  ];

  for (const expectedName of expectedNames) {
    if (!specs.some((spec) => spec.title === expectedName)) {
      errors.push(`Falta test runtime esperado: ${expectedName}`);
    }
  }

  if ((results.stats?.unexpected ?? 0) > 0) {
    errors.push(`Playwright unexpected failures: ${results.stats.unexpected}.`);
  }

  if ((results.stats?.flaky ?? 0) > 0) {
    errors.push(`Playwright flaky tests: ${results.stats.flaky}.`);
  }

  if (failedSpecs.length > 0) {
    errors.push(
      `Tests runtime fallidos: ${failedSpecs.map((spec) => spec.title).join(", ")}`
    );
  }

  const report = {
    phase: "6",
    check: "3d-fallback-runtime",
    status: errors.length === 0 ? "passed" : "failed",
    stats: results.stats ?? null,
    expectedTestCount: expectedNames.length,
    actualSpecCount: specs.length,
    expectedNames,
    failedSpecs: failedSpecs.map((spec) => spec.title),
    warningCount: warnings.length,
    errorCount: errors.length,
    warnings,
    errors,
    generatedAt: new Date().toISOString()
  };

  writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf8");

  if (errors.length > 0) {
    console.error("Errores runtime Hero3D Fase 6:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Runtime Hero3D Fase 6 validado.");
}