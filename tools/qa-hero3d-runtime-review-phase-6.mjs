import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const runtimePath = "src/scripts/hero3d.ts";
const loaderPath = "src/scripts/hero3d-loader.ts";
const cssPath = "src/assets/hero3d.css";

const runtime = readFileSync(runtimePath, "utf8");
const loader = readFileSync(loaderPath, "utf8");
const css = readFileSync(cssPath, "utf8");

const checks = [
  {
    id: "lazy-dynamic-import",
    requirement: "Three.js se carga mediante import dinámico fuera del bundle crítico.",
    evidence: loaderPath,
    passed: /import\(\s*["']\.\/hero3d["']\s*\)/.test(loader)
  },
  {
    id: "visible-before-load",
    requirement: "El loader usa IntersectionObserver antes de solicitar el runtime pesado.",
    evidence: loaderPath,
    passed:
      loader.includes("IntersectionObserver") &&
      loader.includes("observer.unobserve(host)") &&
      loader.includes("controller?.scheduleVisibleLoad()")
  },
  {
    id: "automatic-idle-load",
    requirement:
      "El runtime se solicita automáticamente al entrar en viewport mediante requestIdleCallback y timeout, sin exigir interacción.",
    evidence: loaderPath,
    passed:
      loader.includes("requestIdleCallback") &&
      loader.includes("scheduleVisibleLoad") &&
      loader.includes("window.setTimeout") &&
      !loader.includes('host.addEventListener(\n    "pointerenter"') &&
      !loader.includes('host.addEventListener(\n    "pointerdown"') &&
      !loader.includes('host.addEventListener(\n    "touchstart"') &&
      !loader.includes('host.addEventListener(\n    "focusin"')
  },
  {
    id: "reduced-motion-before-load",
    requirement: "prefers-reduced-motion evita cargar la escena pesada.",
    evidence: loaderPath,
    passed:
      /matchMedia\(\s*"\(prefers-reduced-motion: reduce\)"\s*\)/s.test(
        loader
      ) &&
      /activateFallback\(\s*host,\s*"prefers-reduced-motion"\s*\)/s.test(
        loader
      )
  },
  {
    id: "dpr-limit",
    requirement: "El devicePixelRatio queda limitado a 1.5 en touch/tablet y a 2 en desktop.",
    evidence: runtimePath,
    passed:
      runtime.includes("const pixelRatioLimit") &&
      runtime.includes("? 1.5") &&
      runtime.includes(": 2") &&
      runtime.includes("pixelRatioLimit")
  },
  {
    id: "source-texture-fidelity",
    requirement:
      "El logo usa la textura fuente en un material sin iluminación ni tone mapping.",
    evidence: runtimePath,
    passed:
      runtime.includes("new THREE.MeshBasicMaterial") &&
      runtime.includes("THREE.NoToneMapping") &&
      runtime.includes('"source-texture-fidelity"') &&
      !runtime.includes("RoomEnvironment")
  },
  {
    id: "document-visibility-pause",
    requirement: "La animación se pausa cuando el documento queda oculto.",
    evidence: runtimePath,
    passed:
      runtime.includes('"visibilitychange"') &&
      runtime.includes('document.visibilityState === "visible"') &&
      runtime.includes("paused-document-hidden")
  },
  {
    id: "offscreen-pause",
    requirement: "La animación se pausa cuando el hero sale del viewport.",
    evidence: runtimePath,
    passed:
      runtime.includes("state.intersectionObserver = new IntersectionObserver") &&
      runtime.includes("paused-offscreen") &&
      runtime.includes('stopAnimation("paused-offscreen")')
  },
  {
    id: "dynamic-reduced-motion-pause",
    requirement: "Un cambio dinámico a reduced-motion pausa la animación.",
    evidence: runtimePath,
    passed:
      runtime.includes("reducedMotionQuery.addEventListener") &&
      runtime.includes("paused-reduced-motion")
  },
  {
    id: "webgl-context-loss",
    requirement: "La pérdida y restauración del contexto WebGL se capturan sin crear otro canvas.",
    evidence: runtimePath,
    passed:
      runtime.includes('"webglcontextlost"') &&
      runtime.includes('"webglcontextrestored"') &&
      runtime.includes("event.preventDefault()") &&
      runtime.includes('"webgl-context-lost"') &&
      runtime.includes("state.contextLost = false")
  },
  {
    id: "resource-disposal",
    requirement: "Geometrías, materiales, texturas y renderer se liberan.",
    evidence: runtimePath,
    passed:
      runtime.includes("mesh.geometry.dispose()") &&
      runtime.includes("texture.dispose()") &&
      runtime.includes("material.dispose()") &&
      runtime.includes("renderer?.dispose()")
  },
  {
    id: "page-lifecycle-cleanup",
    requirement: "El runtime se desmonta en pagehide y se rearma al volver desde bfcache.",
    evidence: runtimePath,
    passed:
      runtime.includes('"pagehide"') &&
      runtime.includes("disposeRuntime(") &&
      loader.includes('window.addEventListener("pageshow"') &&
      loader.includes("event.persisted")
  },
  {
    id: "panel-hover-description",
    requirement: "Los paneles flotantes abren su descripción en hover, focus-visible o estado activo.",
    evidence: cssPath,
    passed:
      css.includes(".hero3d__panel:hover .hero3d__panel-description") &&
      css.includes('.hero3d__panel[data-active="true"] .hero3d__panel-description') &&
      css.includes("max-height: 6.4rem")
  },
  {
    id: "ios-secondary-panel-composition",
    requirement:
      "DATA, HMI e IOT se mantienen en una capa táctil visible por encima del canvas en móvil.",
    evidence: cssPath,
    passed:
      css.includes(".hero3d__mobileDock") &&
      css.includes("z-index: 12") &&
      css.includes("-webkit-transform: translateZ(0)") &&
      css.includes("-webkit-backface-visibility: hidden")
  },
];

const errors = checks
  .filter((check) => !check.passed)
  .map((check) => `${check.id}: ${check.requirement}`);

const report = {
  phase: "6",
  check: "hero3d-runtime-review",
  status: errors.length === 0 ? "passed" : "failed",
  files: [loaderPath, runtimePath, cssPath],
  checks,
  warningCount: 0,
  errorCount: errors.length,
  warnings: [],
  errors,
  generatedAt: new Date().toISOString()
};

mkdirSync(artifactRoot, {
  recursive: true
});

writeFileSync(
  join(artifactRoot, "hero3d-runtime-review.json"),
  JSON.stringify(report, null, 2),
  "utf8"
);

if (errors.length > 0) {
  console.error("Errores de revisión runtime Hero3D Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Revisión estática Hero3D Fase 6 validada.");
