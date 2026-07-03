import { mkdirSync, rmSync } from "node:fs";

const artifactRoot = "qa-artifacts/search-intent-skills/phase-3";

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(artifactRoot, {
  recursive: true
});

console.log("qa-artifacts/search-intent-skills/phase-3 limpiado.");