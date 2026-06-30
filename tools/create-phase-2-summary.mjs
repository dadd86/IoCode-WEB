import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/commercial-evidence/phase-2";
const errors = [];

const requiredArtifacts = [
  "content-model.json",
  "claims-review.json",
  "privacy-review.json",
  "routes.json",
  "seo-structured-data.json"
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

const status = errors.length === 0 ? "passed" : "failed";

mkdirSync(artifactRoot, { recursive: true });

writeFileSync(
  join(artifactRoot, "summary.json"),
  JSON.stringify(
    {
      phase: "2",
      name: "Proyectos como evidencia comercial",
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
  console.error("Errores summary Fase 2:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("summary.json Fase 2 generado sin warnings.");