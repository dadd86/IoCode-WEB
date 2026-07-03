import { mkdirSync, rmSync } from "node:fs";

const artifactRoot = "qa-artifacts/ui-accessibility/phase-5";

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(`${artifactRoot}/screenshots`, {
  recursive: true
});

console.log("qa-artifacts/ui-accessibility/phase-5 limpiado.");