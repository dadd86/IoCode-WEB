import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { gzipSync, brotliCompressSync } from "node:zlib";
import { extname, join, relative } from "node:path";
import { readFileSync } from "node:fs";

const artifactRoot = "qa-artifacts/performance/phase-6";
const distRoot = "dist";
const errors = [];
const warnings = [];

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });
  writeFileSync(join(artifactRoot, name), JSON.stringify(payload, null, 2), "utf8");
}

function walk(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return walk(path);
    }

    return entry.isFile() ? [path] : [];
  });
}

const files = walk(distRoot)
  .filter((file) => [".js", ".css"].includes(extname(file).toLowerCase()))
  .map((file) => {
    const content = readFileSyncSafe(file);
    return {
      path: relative(process.cwd(), file).replaceAll("\\", "/"),
      extension: extname(file).toLowerCase(),
      bytes: statSync(file).size,
      gzipBytes: gzipSync(content).length,
      brotliBytes: brotliCompressSync(content).length,
      containsThree:
        content.includes("THREE") ||
        content.includes("WebGLRenderer") ||
        content.includes("GLTFLoader") ||
        content.includes("three")
    };
  });

function readFileSyncSafe(path) {
  return Buffer.from(readFileSync(path));
}

const jsFiles = files.filter((file) => file.extension === ".js");
const threeChunks = jsFiles.filter((file) => file.containsThree);

if (threeChunks.length === 0) {
  warnings.push("No se detectó chunk de Three.js por heurística. Revisar manualmente si el bundle está minificado.");
}

if (threeChunks.length > 0) {
  const largestThreeChunk = [...threeChunks].sort((a, b) => b.bytes - a.bytes)[0];

  if (!largestThreeChunk.path.includes("_astro/")) {
    errors.push(`Chunk Three.js inesperado fuera de _astro: ${largestThreeChunk.path}`);
  }
}

const htmlFiles = walk(distRoot)
  .filter((file) => extname(file).toLowerCase() === ".html")
  .map((file) => ({
    path: relative(process.cwd(), file).replaceAll("\\", "/"),
    content: readFileSync(file, "utf8")
  }));

const initialScriptReferences = htmlFiles.flatMap((file) => {
  const matches = [...file.content.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*>/g)];

  return matches.map((match) => ({
    html: file.path,
    src: match[1]
  }));
});

const threeChunkNames = threeChunks.map((chunk) => chunk.path.split("/").pop()).filter(Boolean);

const criticalThreeReferences = initialScriptReferences.filter((reference) =>
  threeChunkNames.some((chunkName) => reference.src.includes(chunkName))
);

if (criticalThreeReferences.length > 0) {
  errors.push(
    `Three.js aparece referenciado como script inicial en HTML: ${JSON.stringify(criticalThreeReferences)}`
  );
}


writeArtifact("bundle-report.json", {
  phase: "6",
  check: "bundle-report",
  status: errors.length === 0 ? "passed" : "failed",
  files,
  jsTotalBytes: jsFiles.reduce((total, file) => total + file.bytes, 0),
  threeChunks,
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  initialScriptReferences,
  criticalThreeReferences,
  generatedAt: new Date().toISOString()
});


if (errors.length > 0) {
  console.error("Errores bundle Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Bundle Fase 6 analizado.");