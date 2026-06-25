import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/security/phase-1-1d";
const errors = [];
const warnings = [];

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
    errors.push(`${name}: status esperado "passed", recibido "${artifact.status}".`);
  }

  if (artifact.warningCount > 0) {
    warnings.push(`${name}: contiene ${artifact.warningCount} warning(s).`);
  }

  if (artifact.errorCount > 0) {
    errors.push(`${name}: contiene ${artifact.errorCount} error(es).`);
  }
}

const staticArtifact = readJsonArtifact("static.json");
const headersArtifact = readJsonArtifact("headers.json");
const privacyArtifact = readJsonArtifact("privacy-surface.json");
const releaseArtifact = readJsonArtifact("release-hygiene.json");

assertPassed(staticArtifact, "static.json");
assertPassed(headersArtifact, "headers.json");
assertPassed(privacyArtifact, "privacy-surface.json");
assertPassed(releaseArtifact, "release-hygiene.json");

const emailConfirmed = process.env.EMAIL_CONFIRMED === "true";

if (!emailConfirmed) {
  warnings.push(
    "EMAIL_CONFIRMED no está en true; la recepción real de contact@iocode-solutions.com queda como verificación manual pendiente."
  );
}

const status = errors.length === 0 ? "passed" : "failed";

const summary = {
  phase: "1.1D",
  status,
  scope:
    "Seguridad y privacidad avanzada antes de publicar; no implica seguridad absoluta ni cumplimiento legal garantizado.",
  emailConfirmation: emailConfirmed ? "passed" : "manual-required",
  secretScan: staticArtifact?.checks?.secretRegexScan ? "passed" : "unknown",
  gitleaks: "external-required",
  securityHeaders: headersArtifact?.status === "passed" ? "passed" : "failed",
  privacyMicrocopy: staticArtifact?.checks?.privacyMicrocopy ? "passed" : "unknown",
  externalLinks: privacyArtifact?.checks?.targetBlankRel ? "passed" : "unknown",
  personalDataExposure: staticArtifact?.checks?.personalDataExposure ? "passed" : "unknown",
  releaseArtifactHygiene: releaseArtifact?.status === "passed" ? "passed" : "failed",
  dependencyAuditProd:
    "passed-if-this-summary-was-generated-after-npm-run-audit-prod",
  artifacts: {
    static: "qa-artifacts/security/phase-1-1d/static.json",
    headers: "qa-artifacts/security/phase-1-1d/headers.json",
    privacySurface: "qa-artifacts/security/phase-1-1d/privacy-surface.json",
    releaseHygiene: "qa-artifacts/security/phase-1-1d/release-hygiene.json"
  },
  residualRisks: [
    "HSTS debe validarse en hosting HTTPS real.",
    "La deuda CSP unsafe-inline queda aceptada temporalmente y documentada.",
    "Gitleaks debe ejecutarse como gate externo containerizado.",
    "La confirmación real del email requiere prueba manual de recepción."
  ],
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
};

mkdirSync(artifactRoot, { recursive: true });

writeFileSync(
  join(artifactRoot, "summary.json"),
  JSON.stringify(summary, null, 2),
  "utf8"
);

if (warnings.length > 0) {
  console.warn("Warnings summary Fase 1.1D:");

  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("Errores summary Fase 1.1D:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("summary.json Fase 1.1D generado.");