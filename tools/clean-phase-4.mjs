import { mkdirSync, rmSync } from "node:fs";

const artifactRoot = "qa-artifacts/contact-conversion/phase-4";

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(artifactRoot, {
  recursive: true
});

console.log("qa-artifacts/contact-conversion/phase-4 limpiado.");