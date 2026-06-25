import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/security/phase-1-1d";
const baseUrl =
  process.env.SECURITY_BASE_URL ||
  process.env.PLAYWRIGHT_BASE_URL ||
  "http://web:8080";

const errors = [];
const warnings = [];

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });

  writeFileSync(
    join(artifactRoot, name),
    JSON.stringify(payload, null, 2),
    "utf8"
  );
}

function headerValue(headers, name) {
  return headers.get(name) || "";
}

function assertHeader(headers, name) {
  const value = headerValue(headers, name);

  if (!value) {
    errors.push(`Falta header ${name}.`);
  }

  return value;
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    errors.push(`${label}: falta "${expected}". Valor actual: ${value}`);
  }
}

const targetUrl = new URL("/es/", baseUrl).toString();
const response = await fetch(targetUrl, { method: "GET" });

if (response.status !== 200) {
  errors.push(`${targetUrl}: status esperado 200, recibido ${response.status}.`);
}

const csp = assertHeader(response.headers, "content-security-policy");
const xContentTypeOptions = assertHeader(response.headers, "x-content-type-options");
const xFrameOptions = assertHeader(response.headers, "x-frame-options");
const referrerPolicy = assertHeader(response.headers, "referrer-policy");
const permissionsPolicy = assertHeader(response.headers, "permissions-policy");

assertIncludes(csp, "default-src 'self'", "Content-Security-Policy");
assertIncludes(csp, "base-uri 'self'", "Content-Security-Policy");
assertIncludes(csp, "object-src 'none'", "Content-Security-Policy");
assertIncludes(csp, "frame-ancestors 'none'", "Content-Security-Policy");
assertIncludes(csp, "form-action 'self' mailto:", "Content-Security-Policy");
assertIncludes(csp, "script-src 'self' 'unsafe-inline'", "Content-Security-Policy deuda aceptada");
assertIncludes(csp, "style-src 'self' 'unsafe-inline'", "Content-Security-Policy deuda aceptada");

if (xContentTypeOptions.toLowerCase() !== "nosniff") {
  errors.push(`X-Content-Type-Options debe ser nosniff. Valor actual: ${xContentTypeOptions}`);
}

if (xFrameOptions.toUpperCase() !== "DENY") {
  errors.push(`X-Frame-Options debe ser DENY. Valor actual: ${xFrameOptions}`);
}

if (referrerPolicy !== "strict-origin-when-cross-origin") {
  errors.push(`Referrer-Policy inesperado: ${referrerPolicy}`);
}

for (const directive of [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()"
]) {
  assertIncludes(permissionsPolicy, directive, "Permissions-Policy");
}

const hsts = headerValue(response.headers, "strict-transport-security");

if (targetUrl.startsWith("https://") && !hsts) {
  errors.push("Strict-Transport-Security debe existir en HTTPS.");
}

if (targetUrl.startsWith("http://") && !hsts) {
  warnings.push("HSTS no validado en HTTP local; debe validarse en hosting HTTPS real.");
}

const status = errors.length === 0 ? "passed" : "failed";

writeArtifact("headers.json", {
  phase: "1.1D",
  check: "security-headers",
  status,
  targetUrl,
  headers: {
    "content-security-policy": csp,
    "x-content-type-options": xContentTypeOptions,
    "x-frame-options": xFrameOptions,
    "referrer-policy": referrerPolicy,
    "permissions-policy": permissionsPolicy,
    "strict-transport-security": hsts || null
  },
  hstsValidation: targetUrl.startsWith("https://")
    ? "required"
    : "deferred-until-https-deploy",
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
});

if (warnings.length > 0) {
  console.warn("Warnings headers Fase 1.1D:");

  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("Errores headers Fase 1.1D:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Headers de seguridad Fase 1.1D superados.");