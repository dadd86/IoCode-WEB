import { mkdirSync, rmSync } from "node:fs";

const artifactRoot = "qa-artifacts/security/phase-1-1d";

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(artifactRoot, {
  recursive: true
});

console.log("qa-artifacts/security/phase-1-1d limpiado.");
