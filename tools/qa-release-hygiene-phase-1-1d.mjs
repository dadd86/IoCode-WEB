import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/security/phase-1-1d";
const errors = [];
const warnings = [];

const strictSourceCheck = process.env.QA_STRICT_RELEASE_HYGIENE === "true";

const requiredDockerignoreEntries = [
  ".git",
  "node_modules",
  "dist",
  ".astro",
  "qa-artifacts",
  ".env",
  "*.zip"
];

const forbiddenSourcePaths = [
  ".git",
  "node_modules",
  "dist",
  ".astro",
  "qa-artifacts",
  "playwright-report",
  "test-results",
  ".env",
  "Docker/.env"
];

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });

  writeFileSync(
    join(artifactRoot, name),
    JSON.stringify(payload, null, 2),
    "utf8"
  );
}

function readRequiredFile(path) {
  if (!existsSync(path)) {
    errors.push(`${path}: archivo requerido no encontrado.`);
    return "";
  }

  return readFileSync(path, "utf8");
}

const dockerignore = readRequiredFile(".dockerignore");
const releaseScript = readRequiredFile("tools/create-release-zip.sh");

for (const entry of requiredDockerignoreEntries) {
  if (!dockerignore.includes(entry)) {
    errors.push(`.dockerignore: falta exclusión requerida "${entry}".`);
  }
}

for (const marker of [
  ".git",
  "node_modules",
  "dist",
  ".astro",
  "qa-artifacts",
  ".env"
]) {
  if (!releaseScript.includes(marker)) {
    errors.push(`tools/create-release-zip.sh: falta bloqueo de "${marker}".`);
  }
}

if (strictSourceCheck) {
  for (const path of forbiddenSourcePaths) {
    if (existsSync(path)) {
      errors.push(`${path}: no debe existir en ZIP fuente/release.`);
    }
  }
} else {
  warnings.push(
    "QA_STRICT_RELEASE_HYGIENE no está activo; se validó la política de release, no el árbol fuente completo."
  );
}

const status = errors.length === 0 ? "passed" : "failed";

writeArtifact("release-hygiene.json", {
  phase: "1.1D",
  check: "release-hygiene",
  status,
  strictSourceCheck,
  checkedDockerignoreEntries: requiredDockerignoreEntries,
  forbiddenSourcePaths: strictSourceCheck ? forbiddenSourcePaths : [],
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
});

if (warnings.length > 0) {
  console.warn("Warnings release hygiene Fase 1.1D:");

  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("Errores release hygiene Fase 1.1D:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Higiene de release Fase 1.1D superada.");