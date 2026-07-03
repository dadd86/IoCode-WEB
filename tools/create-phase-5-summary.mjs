import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/ui-accessibility/phase-5";
const screenshotsRoot = join(artifactRoot, "screenshots");
const errors = [];

const requiredArtifacts = [
  "layout-review.json",
  "pages-review.json",
  "form-review.json",
  "keyboard-review.json",
  "accessibility-review.json",
  "responsive-review.json",
  "motion-performance-review.json",
  "screenshots-review.json"
];

function readArtifact(name) {
  const path = join(artifactRoot, name);

  if (!existsSync(path)) {
    errors.push(`${path}: artifact requerido no encontrado.`);
    return null;
  }

  return JSON.parse(readFileSync(path, "utf8"));
}

for (const artifactName of requiredArtifacts) {
  const artifact = readArtifact(artifactName);

  if (!artifact) {
    continue;
  }

  if (artifact.status !== "passed") {
    errors.push(`${artifactName}: status debe ser passed.`);
  }

  if (artifact.warningCount !== 0) {
    errors.push(`${artifactName}: warningCount debe ser 0.`);
  }

  if (artifact.errorCount !== 0) {
    errors.push(`${artifactName}: errorCount debe ser 0.`);
  }

  if ((artifact.blockers?.S0 ?? 0) !== 0) {
    errors.push(`${artifactName}: no puede tener blockers S0.`);
  }

  if ((artifact.blockers?.S1 ?? 0) !== 0) {
    errors.push(`${artifactName}: no puede tener blockers S1.`);
  }
}

const playwrightPath = "qa-artifacts/playwright-results.json";

if (!existsSync(playwrightPath)) {
  errors.push(`${playwrightPath}: artifact Playwright no encontrado.`);
} else {
  const playwright = JSON.parse(readFileSync(playwrightPath, "utf8"));

  if ((playwright.stats?.unexpected ?? 0) !== 0) {
    errors.push("Playwright tiene tests inesperados/fallidos.");
  }

  if ((playwright.stats?.flaky ?? 0) !== 0) {
    errors.push("Playwright tiene tests flaky.");
  }
}

if (!existsSync(screenshotsRoot)) {
  errors.push(`${screenshotsRoot}: carpeta de screenshots no encontrada.`);
} else {
  const screenshots = readdirSync(screenshotsRoot).filter((file) => file.endsWith(".png"));

  if (screenshots.length < 72) {
    errors.push(`screenshots insuficientes: se esperaban al menos 72, encontrados ${screenshots.length}.`);
  }
}

const status = errors.length === 0 ? "passed" : "failed";

mkdirSync(artifactRoot, {
  recursive: true
});

writeFileSync(
  join(artifactRoot, "summary.json"),
  JSON.stringify(
    {
      phase: "5",
      name: "UI/UX responsive y accesibilidad completa",
      status,
      warningCount: 0,
      errorCount: errors.length,
      blockers: {
        S0: errors.length,
        S1: 0
      },
      requiredArtifacts,
      errors,
      generatedAt: new Date().toISOString()
    },
    null,
    2
  )
);

if (errors.length > 0) {
  console.error("Errores summary Fase 5:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("summary.json Fase 5 generado sin warnings.");