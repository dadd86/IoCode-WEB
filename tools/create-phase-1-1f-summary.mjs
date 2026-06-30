import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/accessibility-performance/phase-1-1f";
const errors = [];

function readJsonArtifact(name) {
  const path = join(artifactRoot, name);

  if (!existsSync(path)) {
    errors.push(`${path}: artifact requerido no encontrado.`);
    return null;
  }

  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${path}: JSON inválido. ${error.message}`);
    return null;
  }
}

function assertPassed(artifact, name) {
  if (!artifact) {
    return;
  }

  if (artifact.status !== "passed") {
    errors.push(`${name}: status esperado passed, recibido ${artifact.status}.`);
  }

  if (artifact.warningCount !== 0) {
    errors.push(`${name}: warningCount debe ser 0, recibido ${artifact.warningCount}.`);
  }

  if (artifact.errorCount !== 0) {
    errors.push(`${name}: errorCount debe ser 0, recibido ${artifact.errorCount}.`);
  }
}

const assetBudgets = readJsonArtifact("asset-budgets.json");
const lighthouseSummary = readJsonArtifact("lighthouse-summary.json");

assertPassed(assetBudgets, "asset-budgets.json");
assertPassed(lighthouseSummary, "lighthouse-summary.json");

const playwrightResultsPath = "qa-artifacts/playwright-results.json";

if (!existsSync(playwrightResultsPath)) {
  errors.push(`${playwrightResultsPath}: resultado Playwright requerido no encontrado.`);
} else {
  const playwrightResults = JSON.parse(readFileSync(playwrightResultsPath, "utf8"));

  if (playwrightResults.stats?.unexpected > 0) {
    errors.push(`Playwright unexpected failures: ${playwrightResults.stats.unexpected}.`);
  }

  if (playwrightResults.stats?.expected <= 0) {
    errors.push("Playwright no reportó tests expected.");
  }
}

const status = errors.length === 0 ? "passed" : "failed";

const summary = {
  phase: "1.1F",
  name: "Accesibilidad y performance avanzada",
  status,
  scope:
    "Validación local de navegación por teclado, axe, semántica, mobile, consola, budgets de assets y Lighthouse local.",
  playwright: errors.some((error) => error.includes("Playwright")) ? "failed" : "passed",
  assetBudgets: assetBudgets?.status === "passed" ? "passed" : "failed",
  lighthouse: lighthouseSummary?.status === "passed" ? "passed" : "failed",
  artifacts: {
    playwrightResults: "qa-artifacts/playwright-results.json",
    assetBudgets: "qa-artifacts/accessibility-performance/phase-1-1f/asset-budgets.json",
    lighthouseSummary: "qa-artifacts/accessibility-performance/phase-1-1f/lighthouse-summary.json"
  },
  warningCount: 0,
  errorCount: errors.length,
  warnings: [],
  errors,
  generatedAt: new Date().toISOString()
};

mkdirSync(artifactRoot, { recursive: true });

writeFileSync(
  join(artifactRoot, "summary.json"),
  JSON.stringify(summary, null, 2),
  "utf8"
);

if (errors.length > 0) {
  console.error("Errores summary Fase 1.1F:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("summary.json Fase 1.1F generado sin warnings.");