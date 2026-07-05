import {
  existsSync,
  mkdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const errors = [];

const assets = [
  {
    path: "public/logo/iocode-logo.png",
    maxBytes: Number(process.env.PHASE6_MAX_IMAGE_BYTES || "350000")
  },
  {
    path: "public/logo/iocode-logo-512.webp",
    maxBytes: Number(process.env.PHASE6_MAX_CRITICAL_LOGO_BYTES || "180000")
  },
  {
    path: "public/logo/iocode-logo-256.webp",
    maxBytes: Number(process.env.PHASE6_MAX_SMALL_LOGO_BYTES || "90000")
  }
];

mkdirSync(artifactRoot, {
  recursive: true
});

const results = assets.map((asset) => {
  if (!existsSync(asset.path)) {
    errors.push(`${asset.path}: asset requerido no existe.`);

    return {
      ...asset,
      exists: false,
      sizeBytes: null,
      passed: false
    };
  }

  const sizeBytes = statSync(asset.path).size;
  const passed = sizeBytes <= asset.maxBytes;

  if (!passed) {
    errors.push(`${asset.path}: ${sizeBytes} bytes supera presupuesto ${asset.maxBytes}.`);
  }

  return {
    ...asset,
    exists: true,
    sizeBytes,
    passed
  };
});

const status = errors.length === 0 ? "passed" : "failed";

writeFileSync(
  join(artifactRoot, "raster-assets-report.json"),
  JSON.stringify(
    {
      phase: "6",
      check: "raster-assets",
      status,
      results,
      warningCount: 0,
      errorCount: errors.length,
      warnings: [],
      errors,
      generatedAt: new Date().toISOString()
    },
    null,
    2
  ),
  "utf8"
);

if (errors.length > 0) {
  console.error("Errores raster assets Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Raster assets Fase 6 validados.");