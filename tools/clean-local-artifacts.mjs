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
  "exports",
  "releases"
];

for (const pathToClean of pathsToClean) {
  rmSync(pathToClean, {
    recursive: true,
    force: true
  });

  console.log(`Eliminado si existía: ${pathToClean}`);
}

console.log("Artifacts locales limpiados.");
console.log("Nota: node_modules y .git no se borran aquí por seguridad.");