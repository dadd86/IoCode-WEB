import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/phase-9d";
const config = readFileSync("playwright.config.ts", "utf8");
const reportPath = "qa-artifacts/playwright-results.json";
const errors = [];

if (!/retries:\s*0\b/u.test(config)) {
  errors.push("playwright.config.ts debe fijar retries: 0 sin condición de CI.");
}

if (!/forbidOnly:\s*Boolean\(process\.env\.CI\)/u.test(config)) {
  errors.push("playwright.config.ts debe bloquear test.only en CI.");
}

if (/retries:\s*process\.env\.CI/u.test(config)) {
  errors.push("Se detectó un retry oculto condicionado por CI.");
}

if (!existsSync(reportPath)) {
  errors.push(`${reportPath}: falta el reporte de la repetición smoke.`);
}

const report = existsSync(reportPath)
  ? JSON.parse(readFileSync(reportPath, "utf8"))
  : null;
const executions = [];

function collectSuites(suites = []) {
  for (const suite of suites) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        for (const result of test.results ?? []) {
          executions.push({
            title: spec.title,
            projectName: test.projectName,
            status: result.status,
            retry: result.retry ?? 0,
            duration: result.duration ?? null
          });
        }
      }
    }
    collectSuites(suite.suites ?? []);
  }
}

collectSuites(report?.suites ?? []);

if (executions.length === 0) {
  errors.push("El reporte Playwright no contiene ejecuciones smoke.");
}

for (const execution of executions) {
  if (execution.status !== "passed") {
    errors.push(`${execution.projectName} ${execution.title}: status ${execution.status}.`);
  }
  if (execution.retry !== 0) {
    errors.push(`${execution.projectName} ${execution.title}: retry oculto ${execution.retry}.`);
  }
}

const summary = {
  phase: "9D",
  check: "zero-flaky",
  status: errors.length === 0 ? "passed" : "failed",
  executionCount: executions.length,
  projects: [...new Set(executions.map((execution) => execution.projectName))],
  maxDurationMs: Math.max(0, ...executions.map((execution) => execution.duration ?? 0)),
  executions,
  errorCount: errors.length,
  errors,
  generatedAt: new Date().toISOString()
};

mkdirSync(artifactRoot, { recursive: true });
writeFileSync(
  join(artifactRoot, "zero-flaky-report.json"),
  JSON.stringify(summary, null, 2),
  "utf8"
);

if (errors.length > 0) {
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Gate cero flaky superado: ${executions.length} ejecuciones, retries=0.`);
