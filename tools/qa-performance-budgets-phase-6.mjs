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
  maxGlbIdealBytes: Number(process.env.PHASE6_MAX_GLB_IDEAL_BYTES || "250000"),
  maxGlbAcceptedBytes: Number(process.env.PHASE6_MAX_GLB_ACCEPTED_BYTES || "500000"),
  maxGlbBlockerBytes: Number(process.env.PHASE6_MAX_GLB_BLOCKER_BYTES || "500000"),
  maxImageBytes: Number(process.env.PHASE6_MAX_IMAGE_BYTES || "350000"),
  maxJsInitialBytes: Number(process.env.PHASE6_MAX_JS_INITIAL_BYTES || "250000"),
  maxJsTotalBytes: Number(process.env.PHASE6_MAX_JS_TOTAL_BYTES || "700000"),
  maxCssTotalBytes: Number(process.env.PHASE6_MAX_CSS_TOTAL_BYTES || "120000"),
  maxCriticalLogoBytes: Number(process.env.PHASE6_MAX_CRITICAL_LOGO_BYTES || "180000"),
  maxSmallLogoBytes: Number(process.env.PHASE6_MAX_SMALL_LOGO_BYTES || "90000")
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

function describeFiles(directory) {
  return walk(directory).map((filePath) => ({
    path: relative(process.cwd(), filePath).replaceAll("\\", "/"),
    extension: extname(filePath).toLowerCase(),
    size: statSync(filePath).size
  }));
}

const sourceFiles = describeFiles(publicRoot);
const deployedFiles = describeFiles(distRoot);

const jsFiles = deployedFiles.filter((file) => file.extension === ".js");
const cssFiles = deployedFiles.filter((file) => file.extension === ".css");
const glbFiles = deployedFiles.filter((file) => file.extension === ".glb");
const imageFiles = deployedFiles.filter((file) =>
  [".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"].includes(file.extension)
);
const requiredRasterAssets = [
  {
    path: "public/logo/iocode-logo.png",
    maxBytes: budgets.maxImageBytes
  },
  {
    path: "public/logo/iocode-logo-512.webp",
    maxBytes: budgets.maxCriticalLogoBytes
  },
  {
    path: "public/logo/iocode-logo-256.webp",
    maxBytes: budgets.maxSmallLogoBytes
  }
];

for (const asset of requiredRasterAssets) {
  const match = sourceFiles.find((file) => file.path === asset.path);

  if (!match) {
    errors.push(`${asset.path}: asset raster optimizado requerido no existe.`);
    continue;
  }

  if (match.size > asset.maxBytes) {
    errors.push(
      `${asset.path}: ${match.size} bytes supera presupuesto ${asset.maxBytes}.`
    );
  }
}

if (
  [...sourceFiles, ...deployedFiles].some((file) =>
    file.path.endsWith(".original.glb")
  )
) {
  errors.push("El proyecto contiene un GLB original pesado .original.glb. Debe estar fuera del ZIP/repo.");
}

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

const largestFiles = [...deployedFiles]
  .sort((a, b) => b.size - a.size)
  .slice(0, 25);
const requiredSourceAssets = requiredRasterAssets.map((asset) => {
  const file = sourceFiles.find((candidate) => candidate.path === asset.path);

  return {
    path: asset.path,
    size: file?.size ?? null,
    maxBytes: asset.maxBytes,
    passed: Boolean(file && file.size <= asset.maxBytes)
  };
});
const status = errors.length === 0 ? "passed" : "failed";

writeArtifact("performance-budgets.json", {
  phase: "6",
  check: "performance-budgets",
  status,
  budgets,
  totals,
  measurementScope: "dist/ desplegable; public/ se usa solo para validar fuentes requeridas",
  requiredSourceAssets,
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
