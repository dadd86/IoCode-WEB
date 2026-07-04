import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { extname, join, relative } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const distRoot = "dist";
const publicRoot = "public";
const errors = [];
const warnings = [];

const budgets = {
  maxGlbIdealBytes: Number(process.env.PHASE6_MAX_GLB_IDEAL_BYTES || "2000000"),
  maxGlbAcceptedBytes: Number(process.env.PHASE6_MAX_GLB_ACCEPTED_BYTES || "5000000"),
  maxGlbBlockerBytes: Number(process.env.PHASE6_MAX_GLB_BLOCKER_BYTES || "8000000"),
  maxImageBytes: Number(process.env.PHASE6_MAX_IMAGE_BYTES || "2000000"),
  maxJsInitialBytes: Number(process.env.PHASE6_MAX_JS_INITIAL_BYTES || "250000"),
  maxJsTotalBytes: Number(process.env.PHASE6_MAX_JS_TOTAL_BYTES || "700000"),
  maxCssTotalBytes: Number(process.env.PHASE6_MAX_CSS_TOTAL_BYTES || "120000")
};

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });
  writeFileSync(join(artifactRoot, name), JSON.stringify(payload, null, 2), "utf8");
}

function walk(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(path));
    }

    if (entry.isFile()) {
      files.push(path);
    }
  }

  return files;
}

const files = [...walk(publicRoot), ...walk(distRoot)].map((filePath) => ({
  path: relative(process.cwd(), filePath).replaceAll("\\", "/"),
  extension: extname(filePath).toLowerCase(),
  size: statSync(filePath).size
}));

const jsFiles = files.filter((file) => file.extension === ".js");
const cssFiles = files.filter((file) => file.extension === ".css");
const glbFiles = files.filter((file) => file.extension === ".glb");
const imageFiles = files.filter((file) =>
  [".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"].includes(file.extension)
);

const totals = {
  jsBytes: jsFiles.reduce((total, file) => total + file.size, 0),
  cssBytes: cssFiles.reduce((total, file) => total + file.size, 0),
  glbBytes: glbFiles.reduce((total, file) => total + file.size, 0),
  imageBytes: imageFiles.reduce((total, file) => total + file.size, 0)
};

for (const file of glbFiles) {
  if (file.size > budgets.maxGlbBlockerBytes) {
    errors.push(`${file.path}: GLB ${file.size} bytes supera bloqueo ${budgets.maxGlbBlockerBytes}.`);
  } else if (file.size > budgets.maxGlbAcceptedBytes) {
    errors.push(`${file.path}: GLB ${file.size} bytes supera presupuesto aceptable ${budgets.maxGlbAcceptedBytes}.`);
  } else if (file.size > budgets.maxGlbIdealBytes) {
    warnings.push(`${file.path}: GLB ${file.size} bytes supera objetivo ideal ${budgets.maxGlbIdealBytes}, pero sigue aceptable.`);
  }
}

for (const file of imageFiles) {
  if (file.size > budgets.maxImageBytes) {
    errors.push(`${file.path}: imagen ${file.size} bytes supera presupuesto ${budgets.maxImageBytes}.`);
  }
}

if (totals.jsBytes > budgets.maxJsTotalBytes) {
  errors.push(`JS total ${totals.jsBytes} bytes supera presupuesto ${budgets.maxJsTotalBytes}.`);
}

if (totals.cssBytes > budgets.maxCssTotalBytes) {
  errors.push(`CSS total ${totals.cssBytes} bytes supera presupuesto ${budgets.maxCssTotalBytes}.`);
}

const largestFiles = [...files].sort((a, b) => b.size - a.size).slice(0, 25);
const status = errors.length === 0 ? "passed" : "failed";

writeArtifact("performance-budgets.json", {
  phase: "6",
  check: "performance-budgets",
  status,
  budgets,
  totals,
  largestFiles,
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
});

if (errors.length > 0) {
  console.error("Errores budgets Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Budgets Fase 6 superados.");