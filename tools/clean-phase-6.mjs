import { mkdirSync, rmSync } from "node:fs";

const artifactRoot = "qa-artifacts/performance/phase-6";

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(artifactRoot, {
  recursive: true
});

console.log("qa-artifacts/performance/phase-6 limpiado.");