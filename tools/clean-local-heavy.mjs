import { existsSync, readdirSync, rmSync } from "node:fs";

const removablePaths = [
  "node_modules",
  "dist",
  ".astro",
  ".cache",
  ".output",
  "qa-artifacts",
  "playwright-report",
  "test-results",
  "lighthouse-report",
  "coverage",
  "reports",
  "logs",
  "releases",
  "artifacts",
  "exports"
];

const removableExtensions = [
  ".zip",
  ".tar",
  ".tar.gz",
  ".tgz",
  ".rar",
  ".7z"
];

for (const path of removablePaths) {
  if (existsSync(path)) {
    rmSync(path, {
      recursive: true,
      force: true
    });

    console.log(`Removed ${path}`);
  }
}

for (const file of readdirSync(".")) {
  if (removableExtensions.some((extension) => file.endsWith(extension))) {
    rmSync(file, {
      force: true
    });

    console.log(`Removed ${file}`);
  }
}

console.log("Local heavy generated files cleaned.");
