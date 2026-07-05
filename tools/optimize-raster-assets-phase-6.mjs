import { mkdirSync, renameSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const artifactRoot = "qa-artifacts/performance/phase-6";
const sourcePng = "public/logo/iocode-logo.png";
const optimizedPngTemp = "public/logo/iocode-logo.optimized.tmp.png";
const webp512 = "public/logo/iocode-logo-512.webp";
const webp256 = "public/logo/iocode-logo-256.webp";

const errors = [];

mkdirSync(artifactRoot, {
  recursive: true
});

async function optimizeLogo() {
  const inputMetadata = await sharp(sourcePng).metadata();

  await sharp(sourcePng)
    .resize({
      width: 512,
      height: 512,
      fit: "contain",
      withoutEnlargement: true
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: true
    })
    .toFile(optimizedPngTemp);

  await sharp(sourcePng)
    .resize({
      width: 512,
      height: 512,
      fit: "contain",
      withoutEnlargement: true
    })
    .webp({
      quality: 82,
      effort: 6
    })
    .toFile(webp512);

  await sharp(sourcePng)
    .resize({
      width: 256,
      height: 256,
      fit: "contain",
      withoutEnlargement: true
    })
    .webp({
      quality: 78,
      effort: 6
    })
    .toFile(webp256);

  renameSync(optimizedPngTemp, sourcePng);

  const outputs = [
    {
      path: sourcePng,
      sizeBytes: statSync(sourcePng).size,
      maxBytes: 350000
    },
    {
      path: webp512,
      sizeBytes: statSync(webp512).size,
      maxBytes: 180000
    },
    {
      path: webp256,
      sizeBytes: statSync(webp256).size,
      maxBytes: 90000
    }
  ];

  for (const output of outputs) {
    if (output.sizeBytes > output.maxBytes) {
      errors.push(
        `${output.path}: ${output.sizeBytes} bytes supera presupuesto ${output.maxBytes}.`
      );
    }
  }

  const report = {
    phase: "6",
    check: "raster-logo-optimization",
    status: errors.length === 0 ? "passed" : "failed",
    input: {
      path: sourcePng,
      width: inputMetadata.width,
      height: inputMetadata.height,
      format: inputMetadata.format
    },
    outputs,
    warningCount: 0,
    errorCount: errors.length,
    warnings: [],
    errors,
    generatedAt: new Date().toISOString()
  };

  writeFileSync(
    join(artifactRoot, "raster-assets-report.json"),
    JSON.stringify(report, null, 2),
    "utf8"
  );

  if (errors.length > 0) {
    console.error("Errores optimización raster Fase 6:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Raster assets Fase 6 optimizados.");
}

await optimizeLogo();