import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/contact-conversion/phase-4";
const errors = [];

const requiredArtifacts = [
  "contact-config.json",
  "mailto-review.json",
  "privacy-review.json",
  "api-contract-draft.json",
  "routes.json"
];

function readArtifact(name) {
  const path = join(artifactRoot, name);

  if (!existsSync(path)) {
    errors.push(`${path}: artifact requerido no encontrado.`);
    return null;
  }

  return JSON.parse(readFileSync(path, "utf8"));
}

for (const artifactName of requiredArtifacts) {
  const artifact = readArtifact(artifactName);

  if (!artifact) {
    continue;
  }

  if (artifact.status !== "passed") {
    errors.push(`${artifactName} no está passed.`);
  }

  if (artifact.warningCount !== 0) {
    errors.push(`${artifactName} tiene warnings.`);
  }

  if (artifact.errorCount !== 0) {
    errors.push(`${artifactName} tiene errores.`);
  }
}

const playwrightPath = "qa-artifacts/playwright-results.json";

if (!existsSync(playwrightPath)) {
  errors.push(`${playwrightPath}: artifact Playwright no encontrado.`);
} else {
  const playwright = JSON.parse(readFileSync(playwrightPath, "utf8"));

  if ((playwright.stats?.unexpected ?? 0) !== 0) {
    errors.push("Playwright tiene tests inesperados/fallidos.");
  }

  if ((playwright.stats?.flaky ?? 0) !== 0) {
    errors.push("Playwright tiene tests flaky.");
  }
}

const status = errors.length === 0 ? "passed" : "failed";

mkdirSync(artifactRoot, { recursive: true });

writeFileSync(
  join(artifactRoot, "summary.json"),
  JSON.stringify(
    {
      phase: "4",
      name: "Contacto, conversión y confianza",
      status,
      warningCount: 0,
      errorCount: errors.length,
      requiredArtifacts,
      errors,
      generatedAt: new Date().toISOString()
    },
    null,
    2
  )
);

if (errors.length > 0) {
  console.error("Errores summary Fase 4:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("summary.json Fase 4 generado sin warnings.");