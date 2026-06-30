import { mkdirSync, rmSync } from "node:fs";

const artifactRoot = "qa-artifacts/commercial-evidence/phase-2";

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(artifactRoot, {
  recursive: true
});

console.log("qa-artifacts/commercial-evidence/phase-2 limpiado.");