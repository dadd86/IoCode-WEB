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
const reportPath = join(artifactRoot, "logo3d-cache-version-report.json");

const errors = [];
const warnings = [];

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

mkdirSync(artifactRoot, {
  recursive: true
});

let hash = null;
let version = null;
let expectedUrl = null;
let previousUrl = null;
let updated = false;

try {
  if (!existsSync(glbPath)) {
    throw new Error(`${glbPath}: no existe.`);
  }

  if (!existsSync(siteConfigPath)) {
    throw new Error(`${siteConfigPath}: no existe.`);
  }

  hash = sha256File(glbPath);
  version = hash.slice(0, 12);
  expectedUrl = `/logo/3d/iocode_solutions_logo_extruded_3d.glb?v=${version}`;

  const source = readFileSync(siteConfigPath, "utf8");

  const logo3dPathPattern =
    /logo3dPath:\s*(?:\r?\n\s*)?["'`](\/logo\/3d\/iocode_solutions_logo_extruded_3d\.glb(?:\?v=[^"'`]+)?)["'`]/m;

  const match = source.match(logo3dPathPattern);

  if (!match) {
    throw new Error(`${siteConfigPath}: no se encontró logo3dPath.`);
  }

  previousUrl = match[1];

  const nextSource = source.replace(
    logo3dPathPattern,
    `logo3dPath: "${expectedUrl}"`
  );

  updated = nextSource !== source;

  if (updated) {
    writeFileSync(siteConfigPath, nextSource, "utf8");
  }
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

const report = {
  phase: "6",
  check: "logo3d-cache-version-update",
  status: errors.length === 0 ? "passed" : "failed",
  glbPath,
  siteConfigPath,
  hash,
  version,
  previousUrl,
  expectedUrl,
  updated,
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
};

writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

if (errors.length > 0) {
  console.error("Errores actualizando versión cache GLB:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  updated
    ? `logo3dPath actualizado a ${expectedUrl}`
    : `logo3dPath ya estaba actualizado: ${expectedUrl}`
);