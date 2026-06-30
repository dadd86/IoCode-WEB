import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { extname, join, relative } from "node:path";

const artifactRoot = "qa-artifacts/accessibility-performance/phase-1-1f";
const distRoot = "dist";
const errors = [];

const budgets = {
  maxJsBytes: Number(process.env.A11Y_PERF_MAX_JS_BYTES || "700000"),
  maxCssBytes: Number(process.env.A11Y_PERF_MAX_CSS_BYTES || "120000"),
  maxGlbBytes: Number(process.env.A11Y_PERF_MAX_GLB_BYTES || "8000000"),
  maxImageBytes: Number(process.env.A11Y_PERF_MAX_IMAGE_BYTES || "2000000")
};

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });

  writeFileSync(
    join(artifactRoot, name),
    JSON.stringify(payload, null, 2),
    "utf8"
  );
}

function walk(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      entries.push(...walk(path));
      continue;
    }

    if (entry.isFile()) {
      entries.push(path);
    }
  }

  return entries;
}

const files = walk(distRoot).map((filePath) => {
  const size = statSync(filePath).size;
  const extension = extname(filePath).toLowerCase();
  const relativePath = relative(process.cwd(), filePath).replaceAll("\\", "/");

  return {
    path: relativePath,
    extension,
    size
  };
});

const grouped = {
  js: files.filter((file) => file.extension === ".js"),
  css: files.filter((file) => file.extension === ".css"),
  glb: files.filter((file) => file.extension === ".glb"),
  images: files.filter((file) => [".png", ".jpg", ".jpeg", ".webp"].includes(file.extension))
};

for (const file of grouped.js) {
  if (file.size > budgets.maxJsBytes) {
    errors.push(`${file.path}: JS ${file.size} bytes supera budget ${budgets.maxJsBytes}.`);
  }
}

for (const file of grouped.css) {
  if (file.size > budgets.maxCssBytes) {
    errors.push(`${file.path}: CSS ${file.size} bytes supera budget ${budgets.maxCssBytes}.`);
  }
}

for (const file of grouped.glb) {
  if (file.size > budgets.maxGlbBytes) {
    errors.push(`${file.path}: GLB ${file.size} bytes supera budget ${budgets.maxGlbBytes}.`);
  }
}

for (const file of grouped.images) {
  if (file.size > budgets.maxImageBytes) {
    errors.push(`${file.path}: imagen ${file.size} bytes supera budget ${budgets.maxImageBytes}.`);
  }
}

const totals = {
  jsBytes: grouped.js.reduce((total, file) => total + file.size, 0),
  cssBytes: grouped.css.reduce((total, file) => total + file.size, 0),
  glbBytes: grouped.glb.reduce((total, file) => total + file.size, 0),
  imageBytes: grouped.images.reduce((total, file) => total + file.size, 0)
};

const status = errors.length === 0 ? "passed" : "failed";

writeArtifact("asset-budgets.json", {
  phase: "1.1F",
  check: "asset-budgets",
  status,
  budgets,
  totals,
  largestFiles: files.sort((a, b) => b.size - a.size).slice(0, 20),
  warningCount: 0,
  errorCount: errors.length,
  warnings: [],
  errors,
  generatedAt: new Date().toISOString()
});

if (errors.length > 0) {
  console.error("Errores budgets Fase 1.1F:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Budgets de assets Fase 1.1F superados.");