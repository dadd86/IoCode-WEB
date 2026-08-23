import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { extname, join, relative } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const distRoot = "dist";

const errors = [];
const warnings = [];

const budgets = {
  maxJsInitialBytes: Number(
    process.env.PHASE6_MAX_JS_INITIAL_BYTES || "250000"
  ),
  maxInitialHeroLoaderBytes: Number(
    process.env.PHASE6_MAX_HERO_LOADER_INITIAL_BYTES || "12000"
  ),
  maxInitialHeroLoaderGzipBytes: Number(
    process.env.PHASE6_MAX_HERO_LOADER_INITIAL_GZIP_BYTES || "5000"
  ),
  maxThreeRuntimeGzipBytes: Number(
    process.env.PHASE6_MAX_THREE_RUNTIME_GZIP_BYTES || "190000"
  ),
  maxJsTotalBytes: Number(process.env.PHASE6_MAX_JS_TOTAL_BYTES || "700000")
};

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, {
    recursive: true
  });

  writeFileSync(join(artifactRoot, name), JSON.stringify(payload, null, 2), "utf8");
}

function walk(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, {
    withFileTypes: true
  }).flatMap((entry) => {
    const filePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return walk(filePath);
    }

    return entry.isFile() ? [filePath] : [];
  });
}

function normalizePath(filePath) {
  return relative(process.cwd(), filePath).replaceAll("\\", "/");
}

function readBuffer(filePath) {
  return readFileSync(filePath);
}

function readText(filePath) {
  return readFileSync(filePath, "utf8");
}

function toDistPathFromSrc(src) {
  const cleanSrc = src.split("?")[0].split("#")[0].replace(/^\/+/, "");

  if (cleanSrc.startsWith("_astro/")) {
    return `dist/${cleanSrc}`;
  }

  if (cleanSrc.startsWith("dist/")) {
    return cleanSrc;
  }

  return `dist/${cleanSrc}`;
}

function hasHeavyThreeRuntime(content) {
  const heavyPatterns = [
    /\bWebGLRenderer\b/,
    /\bGLTFLoader\b/,
    /\bMeshoptDecoder\b/,
    /\bRoomEnvironment\b/,
    /\bPerspectiveCamera\b/,
    /\bHemisphereLight\b/,
    /\bSpotLight\b/,
    /\bPointLight\b/,
    /\bPMREMGenerator\b/,
    /\bBufferGeometry\b/,
    /\bMeshStandardMaterial\b/,
    /\bSRGBColorSpace\b/
  ];

  return heavyPatterns.some((pattern) => pattern.test(content));
}

function isAllowedHeroInitialLoader(file) {
  const pathLooksLikeAstroHeroLoader =
    file.path.includes("/Hero3D.astro_astro_type_script_") ||
    file.path.includes("Hero3D.astro_astro_type_script_");

  const containsDynamicHeroImport =
    file.content.includes("import(") && file.content.includes("hero3d");

  const hasOnlyCapabilityProbe =
    file.content.includes("WebGLRenderingContext") &&
    !file.content.includes("WebGLRenderer") &&
    !file.content.includes("GLTFLoader");

  return (
    pathLooksLikeAstroHeroLoader &&
    containsDynamicHeroImport &&
    hasOnlyCapabilityProbe &&
    !file.containsHeavyThreeRuntime
  );
}

const files = walk(distRoot)
  .filter((filePath) => [".js", ".css"].includes(extname(filePath).toLowerCase()))
  .map((filePath) => {
    const contentBuffer = readBuffer(filePath);
    const content = contentBuffer.toString("utf8");
    const gzipBytes = gzipSync(contentBuffer).length;
    const brotliBytes = brotliCompressSync(contentBuffer).length;

    return {
      path: normalizePath(filePath),
      extension: extname(filePath).toLowerCase(),
      bytes: statSync(filePath).size,
      gzipBytes,
      brotliBytes,
      content,
      containsHeavyThreeRuntime: hasHeavyThreeRuntime(content)
    };
  });

const jsFiles = files.filter((file) => file.extension === ".js");
const cssFiles = files.filter((file) => file.extension === ".css");

const jsTotalBytes = jsFiles.reduce((total, file) => total + file.bytes, 0);
const cssTotalBytes = cssFiles.reduce((total, file) => total + file.bytes, 0);

if (jsTotalBytes > budgets.maxJsTotalBytes) {
  errors.push(
    `JS total ${jsTotalBytes} bytes supera presupuesto ${budgets.maxJsTotalBytes}.`
  );
}

const htmlFiles = walk(distRoot)
  .filter((filePath) => extname(filePath).toLowerCase() === ".html")
  .map((filePath) => ({
    path: normalizePath(filePath),
    content: readText(filePath)
  }));

const initialScriptReferences = htmlFiles.flatMap((file) => {
  const matches = [...file.content.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*>/g)];

  return matches.map((match) => {
    const src = match[1];
    const distPath = toDistPathFromSrc(src);
    const matchedFile = jsFiles.find((candidate) => candidate.path === distPath);

    return {
      html: file.path,
      src,
      distPath,
      found: Boolean(matchedFile),
      bytes: matchedFile?.bytes ?? null,
      gzipBytes: matchedFile?.gzipBytes ?? null,
      containsHeavyThreeRuntime: matchedFile?.containsHeavyThreeRuntime ?? false,
      isAllowedHeroInitialLoader: matchedFile
        ? isAllowedHeroInitialLoader(matchedFile)
        : false
    };
  });
});

const missingInitialScripts = initialScriptReferences.filter((reference) => !reference.found);

for (const reference of missingInitialScripts) {
  errors.push(
    `${reference.html}: script inicial no existe en dist: ${reference.src}`
  );
}

const routeInitialJs = htmlFiles.map((htmlFile) => {
  const references = initialScriptReferences.filter(
    (reference) => reference.html === htmlFile.path && reference.found
  );
  const uniqueDistPaths = [...new Set(references.map((reference) => reference.distPath))];
  const bytes = uniqueDistPaths.reduce((total, distPath) => {
    return total + (jsFiles.find((file) => file.path === distPath)?.bytes ?? 0);
  }, 0);

  return {
    html: htmlFile.path,
    scripts: uniqueDistPaths,
    bytes,
    passed: bytes <= budgets.maxJsInitialBytes
  };
});

for (const route of routeInitialJs) {
  if (!route.passed) {
    errors.push(
      `${route.html}: JS inicial ${route.bytes} bytes supera presupuesto ${budgets.maxJsInitialBytes}.`
    );
  }
}

const initialHeavyThreeReferences = initialScriptReferences.filter(
  (reference) =>
    reference.found &&
    reference.containsHeavyThreeRuntime &&
    !reference.isAllowedHeroInitialLoader
);

if (initialHeavyThreeReferences.length > 0) {
  errors.push(
    `Three.js pesado aparece en scripts iniciales HTML: ${JSON.stringify(
      initialHeavyThreeReferences
    )}`
  );
}

const initialHeroLoaderReferences = initialScriptReferences.filter(
  (reference) => reference.isAllowedHeroInitialLoader
);

for (const reference of initialHeroLoaderReferences) {
  if ((reference.bytes ?? 0) > budgets.maxInitialHeroLoaderBytes) {
    errors.push(
      `${reference.distPath}: loader inicial Hero3D ${reference.bytes} bytes supera presupuesto ${budgets.maxInitialHeroLoaderBytes}.`
    );
  }

  if ((reference.gzipBytes ?? 0) > budgets.maxInitialHeroLoaderGzipBytes) {
    errors.push(
      `${reference.distPath}: loader inicial Hero3D gzip ${reference.gzipBytes} bytes supera presupuesto ${budgets.maxInitialHeroLoaderGzipBytes}.`
    );
  }
}

const threeRuntimeChunks = jsFiles.filter((file) => file.containsHeavyThreeRuntime);

if (threeRuntimeChunks.length === 0) {
  errors.push(
    "No se detectó chunk runtime pesado de Three.js. Esto puede indicar que el Hero3D no se empaquetó o que la heurística quedó obsoleta."
  );
}

for (const chunk of threeRuntimeChunks) {
  if (chunk.gzipBytes > budgets.maxThreeRuntimeGzipBytes) {
    errors.push(
      `${chunk.path}: chunk Three.js gzip ${chunk.gzipBytes} bytes supera presupuesto ${budgets.maxThreeRuntimeGzipBytes}.`
    );
  }
}

const initialScriptDistPaths = new Set(
  initialScriptReferences
    .filter((reference) => reference.found)
    .map((reference) => reference.distPath)
);

const heavyRuntimeInInitialHtml = threeRuntimeChunks.filter((chunk) =>
  initialScriptDistPaths.has(chunk.path)
);

if (heavyRuntimeInInitialHtml.length > 0) {
  errors.push(
    `Chunk pesado Hero3D/Three aparece en HTML inicial: ${JSON.stringify(
      heavyRuntimeInInitialHtml.map((chunk) => chunk.path)
    )}`
  );
}

const publicReportFiles = files.map(({ content, ...file }) => file);

writeArtifact("bundle-report.json", {
  phase: "6",
  check: "bundle-report",
  status: errors.length === 0 ? "passed" : "failed",
  budgets,
  files: publicReportFiles,
  jsTotalBytes,
  cssTotalBytes,
  threeRuntimeChunks: threeRuntimeChunks.map(({ content, ...file }) => file),
  initialScriptReferences,
  routeInitialJs,
  initialHeroLoaderReferences,
  initialHeavyThreeReferences,
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
});

if (errors.length > 0) {
  console.error("Errores bundle Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Bundle Fase 6 analizado.");
