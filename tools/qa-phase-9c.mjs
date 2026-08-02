import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/phase-9c";
const glbPath = "public/logo/3d/iocode_solutions_logo_extruded_3d.glb";
const deployedGlbPath = "dist/logo/3d/iocode_solutions_logo_extruded_3d.glb";
const sitePath = "src/data/site.ts";
const runtimePath = "src/scripts/hero3d.ts";
const loaderPath = "src/scripts/hero3d-loader.ts";
const componentPath = "src/components/Hero3D.astro";
const serverPath = "Docker/node-static-server.mjs";

const MAX_GLB_BYTES = Number(process.env.PHASE9C_MAX_GLB_BYTES || "500000");
const TARGET_GLB_BYTES = Number(process.env.PHASE9C_TARGET_GLB_BYTES || "250000");
const errors = [];
const warnings = [];

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function requireFile(path) {
  if (!existsSync(path)) {
    errors.push(`${path}: archivo obligatorio ausente.`);
    return null;
  }

  return readFileSync(path);
}

const sourceGlb = requireFile(glbPath);
const deployedGlb = requireFile(deployedGlbPath);
const site = requireFile(sitePath)?.toString("utf8") ?? "";
const runtime = requireFile(runtimePath)?.toString("utf8") ?? "";
const loader = requireFile(loaderPath)?.toString("utf8") ?? "";
const component = requireFile(componentPath)?.toString("utf8") ?? "";
const server = requireFile(serverPath)?.toString("utf8") ?? "";

let glb = null;

if (sourceGlb) {
  const hash = sha256(sourceGlb);
  const size = statSync(glbPath).size;
  const magic = sourceGlb.subarray(0, 4).toString("ascii");
  const version = sourceGlb.length >= 8 ? sourceGlb.readUInt32LE(4) : null;
  const declaredLength = sourceGlb.length >= 12 ? sourceGlb.readUInt32LE(8) : null;
  const expectedVersion = hash.slice(0, 12);
  const expectedUrl = `/logo/3d/iocode_solutions_logo_extruded_3d.glb?v=${expectedVersion}`;

  glb = {
    path: glbPath,
    deployedPath: deployedGlbPath,
    size,
    sha256: hash,
    cacheVersion: expectedVersion,
    expectedUrl,
    magic,
    version,
    declaredLength
  };

  if (magic !== "glTF" || version !== 2 || declaredLength !== size) {
    errors.push(
      `${glbPath}: cabecera GLB inválida (magic=${magic}, version=${version}, declaredLength=${declaredLength}, size=${size}).`
    );
  }

  if (size > MAX_GLB_BYTES) {
    errors.push(`${glbPath}: ${size} bytes supera el bloqueo de ${MAX_GLB_BYTES}.`);
  } else if (size > TARGET_GLB_BYTES) {
    warnings.push(`${glbPath}: ${size} bytes supera el objetivo de ${TARGET_GLB_BYTES}.`);
  }

  if (!site.includes(`logo3dPath: "${expectedUrl}"`)) {
    errors.push(`${sitePath}: la query de versión no coincide con SHA-256 ${expectedVersion}.`);
  }

  if (deployedGlb && !sourceGlb.equals(deployedGlb)) {
    errors.push(`${deployedGlbPath}: el binario desplegable no coincide con el asset fuente.`);
  }
}

const contracts = [
  {
    id: "mime",
    passed: server.includes('".glb": "model/gltf-binary"'),
    message: "El servidor debe declarar model/gltf-binary."
  },
  {
    id: "immutable-cache",
    passed:
      server.includes("/\\.glb$/iu.test(pathname)") &&
      server.includes('"public, max-age=31536000, immutable"'),
    message: "El GLB versionado debe usar caché immutable de un año."
  },
  {
    id: "dynamic-runtime",
    passed: loader.includes('import("./hero3d")'),
    message: "Three.js debe permanecer en un import dinámico."
  },
  {
    id: "reduced-motion-before-runtime",
    passed:
      loader.includes('(prefers-reduced-motion: reduce)') &&
      loader.includes('"prefers-reduced-motion"'),
    message: "Reduced motion debe impedir cargar el runtime pesado."
  },
  {
    id: "static-fallback",
    passed:
      component.includes("data-hero-fallback") &&
      component.includes("<LogoImage"),
    message: "El componente debe incluir fallback estático accesible."
  },
  {
    id: "context-lifecycle",
    passed:
      runtime.includes('"webglcontextlost"') &&
      runtime.includes('"webglcontextrestored"') &&
      runtime.includes("state.contextLost"),
    message: "El runtime debe gestionar pérdida y restauración de contexto."
  },
  {
    id: "gpu-disposal",
    passed:
      runtime.includes("mesh.geometry.dispose()") &&
      runtime.includes("texture.dispose()") &&
      runtime.includes("material.dispose()") &&
      runtime.includes("renderer?.dispose()"),
    message: "Geometrías, texturas, materiales y renderer deben liberarse."
  },
  {
    id: "navigation-lifecycle",
    passed:
      runtime.includes('"pagehide"') &&
      runtime.includes("delete host.dataset.hero3dInitialized") &&
      loader.includes('window.addEventListener("pageshow"') &&
      loader.includes("event.persisted"),
    message: "La navegación debe desmontar GPU y rearmar el Hero al volver desde bfcache."
  },
  {
    id: "single-canvas",
    passed:
      runtime.includes('host.dataset.hero3dInitialized === "true"') &&
      runtime.includes("viewer.innerHTML = \"\"") &&
      runtime.includes("viewer.appendChild(renderer.domElement)"),
    message: "La inicialización debe ser idempotente y reemplazar cualquier canvas previo."
  },
  {
    id: "adaptive-dpr",
    passed:
      runtime.includes("const pixelRatioLimit") &&
      runtime.includes("? 1.5") &&
      runtime.includes(": 2"),
    message: "El DPR debe limitarse a 1.5 en touch y 2 en desktop."
  }
];

for (const contract of contracts) {
  if (!contract.passed) {
    errors.push(`${contract.id}: ${contract.message}`);
  }
}

const report = {
  phase: "9C",
  check: "hero3d-production-contract",
  status: errors.length === 0 ? "passed" : "failed",
  budgets: {
    targetGlbBytes: TARGET_GLB_BYTES,
    maxGlbBytes: MAX_GLB_BYTES
  },
  glb,
  contracts,
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
};

mkdirSync(artifactRoot, { recursive: true });
writeFileSync(
  join(artifactRoot, "phase-9c-report.json"),
  JSON.stringify(report, null, 2),
  "utf8"
);

if (errors.length > 0) {
  console.error("Errores Fase 9C:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Fase 9C estática superada: GLB ${glb?.size ?? 0} bytes, SHA-256 ${glb?.sha256 ?? "n/a"}.`
);
