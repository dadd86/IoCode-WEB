import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const baseURL = process.env.PERFORMANCE_BASE_URL || "http://web:8080";
const errors = [];

const paths = [
  "/es/",
  "/en/",
  "/de/",
  "/es/servicios/",
  "/es/contacto/",
  "/logo/iocode-logo.png",
  "/logo/3d/iocode_solutions_logo_extruded_3d.glb"
];

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });
  writeFileSync(join(artifactRoot, name), JSON.stringify(payload, null, 2), "utf8");
}

const results = [];

for (const path of paths) {
  const response = await fetch(new URL(path, baseURL), {
    method: "HEAD"
  });

  const headers = Object.fromEntries(response.headers.entries());

  results.push({
    path,
    status: response.status,
    contentType: headers["content-type"] ?? null,
    cacheControl: headers["cache-control"] ?? null
  });

  if (!response.ok) {
    errors.push(`${path}: status ${response.status}.`);
  }

  if (path.endsWith(".glb") && !String(headers["content-type"]).includes("model/gltf-binary")) {
    errors.push(`${path}: Content-Type GLB incorrecto: ${headers["content-type"]}`);
  }

  if (path.endsWith(".png") && !String(headers["content-type"]).includes("image/png")) {
    errors.push(`${path}: Content-Type PNG incorrecto: ${headers["content-type"]}`);
  }

  if ((path.endsWith(".glb") || path.endsWith(".png")) && !String(headers["cache-control"]).includes("immutable")) {
    errors.push(`${path}: cache-control debería ser immutable.`);
  }

  if (path.endsWith("/") && !String(headers["cache-control"]).includes("no-cache")) {
    errors.push(`${path}: HTML debería tener cache no-cache.`);
  }
}

writeArtifact("headers-report.json", {
  phase: "6",
  check: "headers",
  status: errors.length === 0 ? "passed" : "failed",
  baseURL,
  results,
  warningCount: 0,
  errorCount: errors.length,
  warnings: [],
  errors,
  generatedAt: new Date().toISOString()
});

if (errors.length > 0) {
  console.error("Errores headers Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Headers Fase 6 validados.");