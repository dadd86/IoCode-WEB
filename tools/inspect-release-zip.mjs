import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";

function findNewestReleaseZip() {
  const releaseDir = "releases";

  if (!existsSync(releaseDir)) {
    return null;
  }

  const candidates = readdirSync(releaseDir)
    .filter((file) => file.endsWith(".zip"))
    .map((file) => join(releaseDir, file))
    .filter((file) => existsSync(file))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);

  return candidates[0] ?? null;
}

const explicitZipPath = process.argv[2];
const zipPath = explicitZipPath || findNewestReleaseZip();

const forbiddenPatterns = [
  /(^|\/)\.git(\/|$)/,
  /(^|\/)\.agents(\/|$)/,
  /(^|\/)node_modules(\/|$)/,
  /(^|\/)dist(\/|$)/,
  /(^|\/)\.astro(\/|$)/,
  /(^|\/)qa-artifacts(\/|$)/,
  /(^|\/)playwright-report(\/|$)/,
  /(^|\/)test-results(\/|$)/,
  /(^|\/)coverage(\/|$)/,
  /(^|\/)logs(\/|$)/,
  /(^|\/)releases(\/|$)/,
  /(^|\/)artifacts(\/|$)/,
  /(^|\/)exports(\/|$)/,
  /\.(log|zip|tar|tgz|rar|7z)$/i,
  /(^|\/)\.env($|\.)/
];

if (!zipPath) {
  console.error("Uso: node tools/inspect-release-zip.mjs <archivo.zip>");
  console.error("No se encontró ningún ZIP en releases/.");
  process.exit(64);
}

if (!existsSync(zipPath)) {
  console.error(`ZIP no existe: ${zipPath}`);
  process.exit(66);
}

const result = spawnSync("unzip", ["-l", zipPath], {
  encoding: "utf8"
});

if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status ?? 1);
}

const entries = result.stdout
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => line.split(/\s+/).at(-1))
  .filter((entry) => entry && entry !== "Name")
  .filter((entry) => !entry.includes("----"));

const forbiddenEntries = entries.filter((entry) => {
  if (entry.endsWith(".env.example")) {
    return false;
  }

  return forbiddenPatterns.some((pattern) => pattern.test(entry));
});

const report = {
  phase: "release",
  check: "release-zip-inspection",
  zip: zipPath,
  file: basename(zipPath),
  status: forbiddenEntries.length === 0 ? "passed" : "failed",
  entryCount: entries.length,
  forbiddenCount: forbiddenEntries.length,
  forbiddenEntries: forbiddenEntries.slice(0, 200),
  generatedAt: new Date().toISOString()
};

mkdirSync("qa-artifacts/release", {
  recursive: true
});

writeFileSync(
  join("qa-artifacts/release", "release-zip-inspection.json"),
  JSON.stringify(report, null, 2),
  "utf8"
);

if (forbiddenEntries.length > 0) {
  console.error("ERROR: ZIP contiene entradas prohibidas:");
  forbiddenEntries.slice(0, 80).forEach((entry) => console.error(`- ${entry}`));
  process.exit(1);
}

console.log(`OK: ZIP de release limpio: ${zipPath}`);
