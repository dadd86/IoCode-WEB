import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/security/phase-1-1d";
const errors = [];
const requireGitleaksArtifact = process.env.REQUIRE_GITLEAKS_ARTIFACT === "true";

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
    errors.push(`${name}: status esperado "passed", recibido "${artifact.status}".`);
  }

  if (artifact.warningCount !== 0) {
    errors.push(`${name}: warningCount debe ser 0, recibido ${artifact.warningCount}.`);
  }

  if (artifact.errorCount !== 0) {
    errors.push(`${name}: errorCount debe ser 0, recibido ${artifact.errorCount}.`);
  }
}

const staticArtifact = readJsonArtifact("static.json");
const headersArtifact = readJsonArtifact("headers.json");
const privacyArtifact = readJsonArtifact("privacy-surface.json");
const releaseArtifact = readJsonArtifact("release-hygiene.json");
const gitleaksArtifact = readJsonArtifact("gitleaks.json", requireGitleaksArtifact);

assertPassed(staticArtifact, "static.json");
assertPassed(headersArtifact, "headers.json");
assertPassed(privacyArtifact, "privacy-surface.json");
assertPassed(releaseArtifact, "release-hygiene.json");

if (requireGitleaksArtifact) {
  assertPassed(gitleaksArtifact, "gitleaks.json");
}

const emailConfirmed = process.env.EMAIL_CONFIRMED === "true";

if (!emailConfirmed) {
  errors.push("EMAIL_CONFIRMED debe ser true para cerrar 1.1D.");
}

const status = errors.length === 0 ? "passed" : "failed";

const summary = {
  phase: "1.1D",
  status,
  scope:
    "Seguridad y privacidad avanzada para entorno local validado. No equivale a garantía absoluta ni a certificación legal.",
  emailConfirmation: emailConfirmed ? "passed" : "failed",
  secretScan: staticArtifact?.checks?.secretRegexScan ? "passed" : "unknown",
  gitleaks: gitleaksArtifact?.status === "passed"
    ? "passed"
    : requireGitleaksArtifact
      ? "failed"
      : "external-gate-pending",
  securityHeaders: headersArtifact?.status === "passed" ? "passed" : "failed",
  privacyMicrocopy: staticArtifact?.checks?.privacyMicrocopy ? "passed" : "unknown",
  externalLinks: privacyArtifact?.checks?.targetBlankRel ? "passed" : "unknown",
  personalDataExposure: staticArtifact?.checks?.personalDataExposure ? "passed" : "unknown",
  releaseArtifactHygiene: releaseArtifact?.status === "passed" ? "passed" : "failed",
  dependencyAuditProd:
    "passed-if-this-summary-was-generated-after-npm-run-audit-prod",
  deploymentChecks: {
    hsts: "required-in-https-deployment",
    hstsLocalHttp: "not-applicable",
    strictReleaseZip: "required-only-for-release-artifact"
  },
  artifacts: {
    static: "qa-artifacts/security/phase-1-1d/static.json",
    headers: "qa-artifacts/security/phase-1-1d/headers.json",
    privacySurface: "qa-artifacts/security/phase-1-1d/privacy-surface.json",
    releaseHygiene: "qa-artifacts/security/phase-1-1d/release-hygiene.json",
    gitleaks: gitleaksArtifact
      ? "qa-artifacts/security/phase-1-1d/gitleaks.json"
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
  console.error("Errores summary Fase 1.1D:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("summary.json Fase 1.1D generado sin warnings.");