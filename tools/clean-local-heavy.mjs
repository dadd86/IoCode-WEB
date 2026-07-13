import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { join, resolve } from "node:path";

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

const report = {
  status: "passed",
  removed: [],
  skipped: [],
  warnings: [],
  errors: [],
  generatedAt: new Date().toISOString()
};

function getMountPoints() {
  try {
    const mountInfo = readFileSync("/proc/self/mountinfo", "utf8");

    return new Set(
      mountInfo
        .split("\n")
        .filter(Boolean)
        .map((line) => line.split(" ")[4])
    );
  } catch {
    return new Set();
  }
}

const mountPoints = getMountPoints();

function isMountedPath(path) {
  const absolutePath = resolve(path);
  return mountPoints.has(absolutePath);
}

function removePath(path) {
  if (!existsSync(path)) {
    report.skipped.push({
      path,
      reason: "not_found"
    });
    return;
  }

  if (isMountedPath(path)) {
    report.skipped.push({
      path,
      reason: "mounted_path"
    });
    report.warnings.push(
      `${path}: es un mount Docker dentro del contenedor actual. Ejecuta cleanup con release-tools, no con dev.`
    );
    return;
  }

  try {
    rmSync(path, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 100
    });

    report.removed.push(path);
    console.log(`Removed ${path}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (
      message.includes("Resource busy") ||
      error?.code === "EBUSY" ||
      error?.errno === -4094
    ) {
      report.skipped.push({
        path,
        reason: "resource_busy"
      });
      report.warnings.push(
        `${path}: Resource busy. Probablemente es un volumen Docker montado. Ejecuta cleanup con release-tools.`
      );
      return;
    }

    report.errors.push(`${path}: ${message}`);
  }
}

for (const path of removablePaths) {
  removePath(path);
}

for (const file of readdirSync(".")) {
  if (removableExtensions.some((extension) => file.endsWith(extension))) {
    removePath(file);
  }
}

mkdirSync("qa-artifacts/release", {
  recursive: true
});

report.status = report.errors.length === 0 ? "passed" : "failed";

writeFileSync(
  join("qa-artifacts/release", "clean-local-heavy-report.json"),
  JSON.stringify(report, null, 2),
  "utf8"
);

if (report.errors.length > 0) {
  console.error("Errores clean-local-heavy:");
  report.errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

if (report.warnings.length > 0) {
  console.warn("Warnings clean-local-heavy:");
  report.warnings.forEach((warning) => console.warn(`- ${warning}`));
}

console.log("Local heavy generated files cleaned.");