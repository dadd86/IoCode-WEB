import { rmSync } from "node:fs";

const pathsToClean = [
  "dist",
  ".astro",
  "qa-artifacts",
  "playwright-report",
  "test-results",
  "coverage",
  "logs",
  "artifacts",
  "exports"
];

for (const pathToClean of pathsToClean) {
  rmSync(pathToClean, {
    recursive: true,
    force: true
  });

  console.log(`Eliminado si existía: ${pathToClean}`);
}

console.log("Artifacts locales limpiados.");