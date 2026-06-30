import { mkdirSync, rmSync } from "node:fs";

const artifactRoot = "qa-artifacts/accessibility-performance/phase-1-1f";

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(artifactRoot, {
  recursive: true
});

console.log("qa-artifacts/accessibility-performance/phase-1-1f limpiado.");