import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/visual/phase-1-1b";

const projects = ["chromium-desktop", "chromium-mobile"];

const routes = [
  { path: "/es/", slug: "es" },
  { path: "/es/servicios/", slug: "es-servicios" },
  { path: "/es/proceso/", slug: "es-proceso" },
  { path: "/es/contacto/", slug: "es-contacto" },
  { path: "/en/", slug: "en" },
  { path: "/de/", slug: "de" }
];

const evidence = [];
const missingFiles = [];

for (const project of projects) {
  for (const route of routes) {
    const screenshot = join(artifactRoot, project, `${route.slug}.png`);
    const json = join(artifactRoot, project, `${route.slug}.json`);

    if (!existsSync(screenshot)) {
      missingFiles.push(screenshot);
    }

    if (!existsSync(json)) {
      missingFiles.push(json);
    }

    let metadata = null;

    if (existsSync(json)) {
      metadata = JSON.parse(readFileSync(json, "utf-8"));
    }

    evidence.push({
      route: route.path,
      project,
      screenshot,
      json,
      metadata
    });
  }
}

if (missingFiles.length > 0) {
  console.error("Faltan archivos de evidencia visual:");
  for (const file of missingFiles) {
    console.error(`- ${file}`);
  }

  process.exit(1);
}

mkdirSync(artifactRoot, { recursive: true });

const summary = {
  phase: "1.1B",
  name: "QA visual avanzado",
  status: "passed",
  generatedAt: new Date().toISOString(),
  expectedRoutes: routes.map((route) => route.path),
  expectedProjects: projects,
  totalEvidenceEntries: evidence.length,
  totalEvidenceFiles: evidence.length * 2,
  evidence
};

writeFileSync(
  join(artifactRoot, "summary.json"),
  JSON.stringify(summary, null, 2),
  "utf-8"
);

console.log("summary.json generado correctamente.");
console.log(`Evidencias: ${summary.totalEvidenceEntries} entradas / ${summary.totalEvidenceFiles} archivos.`);