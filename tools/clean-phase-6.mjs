import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { basename, join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const glbRepairReportName = "glb-repair-report.json";
const glbRepairReportPath = join(artifactRoot, glbRepairReportName);

const legacyBackupNames = [
  "iocode_solutions_logo_extruded_3d.before-alpha-repair.glb",
  "iocode_solutions_logo_extruded_3d.before-billboard-rebuild.glb"
];

function readOptionalFile(path) {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path);
}

function collectPreservedArtifacts() {
  const artifacts = new Map();

  const repairReportContent = readOptionalFile(glbRepairReportPath);

  if (repairReportContent) {
    artifacts.set(glbRepairReportName, repairReportContent);

    try {
      const repairReport = JSON.parse(repairReportContent.toString("utf8"));
      const backupGlb = repairReport?.backupGlb;

      if (typeof backupGlb === "string" && existsSync(backupGlb)) {
        artifacts.set(basename(backupGlb), readFileSync(backupGlb));
      }
    } catch {
      /*
        Si el report está corrupto, no escondemos el problema aquí.
        create-phase-6-summary.mjs lo reportará como JSON inválido.
        Este cleaner solo intenta preservar artifacts recuperables.
      */
    }
  }

  for (const name of legacyBackupNames) {
    const path = join(artifactRoot, name);

    if (existsSync(path)) {
      artifacts.set(name, readFileSync(path));
    }
  }

  return artifacts;
}

const preservedArtifacts = collectPreservedArtifacts();

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(artifactRoot, {
  recursive: true
});

for (const [name, content] of preservedArtifacts) {
  writeFileSync(join(artifactRoot, name), content);
}

console.log(
  `qa-artifacts/performance/phase-6 limpiado; ${preservedArtifacts.size} evidencia(s) de preparación GLB preservada(s).`
);