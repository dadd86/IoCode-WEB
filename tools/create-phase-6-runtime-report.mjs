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

const expectedNames = [
  "fallback y contenido aparecen aunque WebGL no esté disponible",
  "reduced motion no carga escena pesada y mantiene contenido usable",
  "fallback se activa si el GLB no se puede descargar",
  "CTA del hero no queda cortado visualmente",
  "no hay overflow horizontal causado por hero 3D",
  "el 3D carga al estar visible sin bloquear contenido ni navegación",
  "mobile dock usa nombres accesibles que contienen el texto visible",
  "desktop mantiene paneles alrededor del logo sin cubrir el centro"
];

function collectSpecs(suites, collected = []) {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) {
      collected.push(spec);
    }

    collectSpecs(suite.suites, collected);
  }

  return collected;
}

function countByTitle(specs) {
  const counts = new Map();

  for (const spec of specs) {
    counts.set(spec.title, (counts.get(spec.title) ?? 0) + 1);
  }

  return counts;
}

mkdirSync(artifactRoot, {
  recursive: true
});

let report = {
  phase: "6",
  check: "3d-fallback-runtime",
  status: "failed",
  stats: null,
  expectedTestCount: expectedNames.length,
  actualSpecCount: 0,
  expectedNames,
  failedSpecs: [],
  duplicateSpecs: [],
  warningCount: 0,
  errorCount: 0,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
};

if (!existsSync(playwrightResultsPath)) {
  errors.push(`${playwrightResultsPath}: no existe. Playwright no generó resultados; puede haber error de sintaxis, título duplicado o fallo de arranque.`);
} else {
  const results = JSON.parse(readFileSync(playwrightResultsPath, "utf8"));
  const specs = collectSpecs(results.suites);
  const titleCounts = countByTitle(specs);

  const duplicateSpecs = [...titleCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([title]) => title);

  const failedSpecs = specs.filter((spec) =>
    spec.tests?.some((test) =>
      test.results?.some((result) => result.status !== "passed")
    )
  );

  for (const expectedName of expectedNames) {
    if (!specs.some((spec) => spec.title === expectedName)) {
      errors.push(`Falta test runtime esperado: ${expectedName}`);
    }
  }

  if (duplicateSpecs.length > 0) {
    errors.push(`Tests runtime duplicados: ${duplicateSpecs.join(", ")}`);
  }

  if (specs.length !== expectedNames.length) {
    errors.push(`Cantidad de tests runtime inválida: ${specs.length}; se esperaban exactamente ${expectedNames.length}.`);
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

  report = {
    ...report,
    status: errors.length === 0 ? "passed" : "failed",
    stats: results.stats ?? null,
    actualSpecCount: specs.length,
    failedSpecs: failedSpecs.map((spec) => spec.title),
    duplicateSpecs,
    warningCount: warnings.length,
    errorCount: errors.length,
    warnings,
    errors,
    generatedAt: new Date().toISOString()
  };
}

report = {
  ...report,
  status: errors.length === 0 ? "passed" : "failed",
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