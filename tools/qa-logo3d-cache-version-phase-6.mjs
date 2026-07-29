import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const glbPath = "public/logo/3d/iocode_solutions_logo_extruded_3d.glb";
const siteConfigPath = "src/data/site.ts";
const reportPath = join(artifactRoot, "logo3d-cache-version-qa.json");

const errors = [];
const warnings = [];

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

mkdirSync(artifactRoot, {
  recursive: true
});

let hash = null;
let expectedVersion = null;
let expectedUrl = null;
let actualUrl = null;

try {
  if (!existsSync(glbPath)) {
    throw new Error(`${glbPath}: no existe.`);
  }

  if (!existsSync(siteConfigPath)) {
    throw new Error(`${siteConfigPath}: no existe.`);
  }

  hash = sha256File(glbPath);
  expectedVersion = hash.slice(0, 12);
  expectedUrl = `/logo/3d/iocode_solutions_logo_extruded_3d.glb?v=${expectedVersion}`;

  const source = readFileSync(siteConfigPath, "utf8");

  const match = source.match(
    /logo3dPath:\s*(?:\r?\n\s*)?["'`](\/logo\/3d\/iocode_solutions_logo_extruded_3d\.glb(?:\?v=[^"'`]+)?)["'`]/
  );

  if (!match) {
    throw new Error(`${siteConfigPath}: no se encontró logo3dPath.`);
  }

  actualUrl = match[1];

  if (actualUrl !== expectedUrl) {
    errors.push(
      `logo3dPath no coincide con el SHA del GLB actual. Actual: ${actualUrl}. Esperado: ${expectedUrl}. Ejecuta npm run internal:update:logo3d-version:6 dentro del contenedor assets.`
    );
  }
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

const report = {
  phase: "6",
  check: "logo3d-cache-version-qa",
  status: errors.length === 0 ? "passed" : "failed",
  glbPath,
  siteConfigPath,
  hash,
  expectedVersion,
  expectedUrl,
  actualUrl,
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
};

writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

if (errors.length > 0) {
  console.error("Errores QA versión cache GLB:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Versión cache GLB Fase 6 validada.");