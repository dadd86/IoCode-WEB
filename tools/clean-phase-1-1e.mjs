import { mkdirSync, rmSync } from "node:fs";

const artifactRoot = "qa-artifacts/devops/phase-1-1e";

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(artifactRoot, {
  recursive: true
});

console.log("qa-artifacts/devops/phase-1-1e limpiado.");