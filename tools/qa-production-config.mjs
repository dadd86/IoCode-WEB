import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const root = resolve(process.argv[2] || "dist");
const forbiddenPatterns = [
  /https?:\/\/localhost(?::\d+)?/iu,
  /https?:\/\/127\.0\.0\.1(?::\d+)?/iu,
  /https?:\/\/web(?::\d+)?/iu,
  /preview\.example\.net/iu
];
const textExtensions = new Set([".html", ".css", ".js", ".mjs", ".json", ".xml", ".txt", ".svg"]);
const findings = [];
const requiredLegalVariables = [
  "PUBLIC_LEGAL_APPROVED",
  "PUBLIC_LEGAL_NAME",
  "PUBLIC_LEGAL_STREET",
  "PUBLIC_LEGAL_POSTAL_CODE",
  "PUBLIC_LEGAL_CITY",
  "PUBLIC_LEGAL_COUNTRY",
  "PUBLIC_LEGAL_EMAIL"
];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      await walk(path);
    } else if (textExtensions.has(extname(entry.name).toLowerCase())) {
      const content = await readFile(path, "utf8");

      for (const pattern of forbiddenPatterns) {
        if (pattern.test(content)) {
          findings.push(`${path}: contiene ${pattern}`);
        }
      }
    }
  }
}

if (process.env.PUBLIC_DEPLOY_ENV !== "production") {
  findings.push("PUBLIC_DEPLOY_ENV debe ser production para este gate.");
}

for (const variable of requiredLegalVariables) {
  const configuredValue = process.env[variable]?.trim() || "";
  if (
    !configuredValue ||
    /REPLACE_WITH|DRAFT|PENDING/iu.test(configuredValue) ||
    (variable === "PUBLIC_LEGAL_APPROVED" && configuredValue !== "true")
  ) {
    findings.push(`${variable} debe contener el dato legal aprobado para producción.`);
  }
}

const siteUrl = process.env.PUBLIC_SITE_URL || "";

try {
  const parsed = new URL(siteUrl);
  if (parsed.protocol !== "https:" || parsed.hostname !== "iocode-solutions.com") {
    findings.push("PUBLIC_SITE_URL debe ser https://iocode-solutions.com.");
  }
} catch {
  findings.push("PUBLIC_SITE_URL no es una URL válida.");
}

await walk(root);

for (const legalPath of [
  "es/aviso-legal/index.html",
  "en/legal-notice/index.html",
  "de/impressum/index.html",
  "es/privacidad/index.html",
  "en/privacy/index.html",
  "de/datenschutz/index.html"
]) {
  try {
    const html = await readFile(join(root, legalPath), "utf8");
    if (!html.includes('data-legal-status="complete"') || /noindex/iu.test(html)) {
      findings.push(`${legalPath}: perfil legal incompleto o noindex en build de producción.`);
    }
  } catch {
    findings.push(`${legalPath}: falta la página legal.`);
  }
}

if (findings.length > 0) {
  console.error("Gate de configuración de producción: FAILED");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Gate de configuración de producción: PASSED; no hay URLs de desarrollo en dist.");
