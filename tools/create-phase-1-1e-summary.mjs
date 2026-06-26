import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/devops/phase-1-1e";
const errors = [];
const requireHostSmoke = process.env.REQUIRE_HOST_SMOKE === "true";

function readJsonArtifact(name, required = true) {
  const path = join(artifactRoot, name);

  if (!existsSync(path)) {
    if (required) {
      errors.push(`${path}: artifact requerido no encontrado.`);
    }

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

const docsArtifact = readJsonArtifact("docs.json");
const smokeArtifact = readJsonArtifact("smoke.json");
const hostSmokeArtifact = readJsonArtifact("host-smoke.json", requireHostSmoke);

assertPassed(docsArtifact, "docs.json");
assertPassed(smokeArtifact, "smoke.json");

if (requireHostSmoke) {
  assertPassed(hostSmokeArtifact, "host-smoke.json");
}

const status = errors.length === 0 ? "passed" : "failed";

const summary = {
  phase: "1.1E",
  name: "DevOps y release local",
  status,
  scope:
    "Validación local de documentación, Docker Compose, comandos reales y smoke checks de release local.",
  documentationSync: docsArtifact?.status === "passed" ? "passed" : "failed",
  dockerNetworkSmoke: smokeArtifact?.status === "passed" ? "passed" : "failed",
  hostSmoke:
    hostSmokeArtifact?.status === "passed"
      ? "passed"
      : requireHostSmoke
        ? "failed"
        : "not-required-for-container-gate",
  routes: smokeArtifact?.routes ?? [],
  hostRoutes: hostSmokeArtifact?.routes ?? [],
  artifacts: {
    docs: "qa-artifacts/devops/phase-1-1e/docs.json",
    smoke: "qa-artifacts/devops/phase-1-1e/smoke.json",
    hostSmoke: hostSmokeArtifact
      ? "qa-artifacts/devops/phase-1-1e/host-smoke.json"
      : null
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
  console.error("Errores summary Fase 1.1E:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("summary.json Fase 1.1E generado sin warnings.");