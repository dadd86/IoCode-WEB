import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

const stalePaths = [
  "qa-artifacts/playwright-results.json",
  "qa-artifacts/performance/phase-6/3d-fallback-runtime-report.json"
];

for (const path of stalePaths) {
  rmSync(path, {
    force: true
  });
}

function run(command, args) {
  return spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32"
  });
}

const playwright = run("npx", [
  "playwright",
  "test",
  "tests/e2e/phase-6-hero-performance.spec.ts",
  "--project=chromium-desktop"
]);

const report = run("node", [
  "tools/create-phase-6-runtime-report.mjs"
]);

if (playwright.status !== 0) {
  process.exit(playwright.status ?? 1);
}

if (report.status !== 0) {
  process.exit(report.status ?? 1);
}

process.exit(0);