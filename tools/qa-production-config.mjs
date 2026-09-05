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

try {
  const governance = JSON.parse(
    await readFile(resolve("config/privacy-governance.json"), "utf8")
  );

  if (governance.controllerApproval !== "approved") {
    findings.push("La gobernanza de privacidad requiere aprobación formal del responsable.");
  }

  for (const provider of governance.providers || []) {
    if (
      provider.productionGate !== "ready" ||
      provider.dpaStatus === "pending" ||
      /PENDING/iu.test(`${provider.provider} ${provider.processingLocation} ${provider.transferMechanism}`)
    ) {
      findings.push(`${provider.service}: DPA, ubicación o transferencia sin verificar.`);
    }
  }
} catch (error) {
  findings.push(`No se pudo validar config/privacy-governance.json: ${error.message}`);
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
  "en/imprint/index.html",
  "de/impressum/index.html",
  "es/privacidad/index.html",
  "en/privacy/index.html",
  "de/datenschutz/index.html"
]) {
  try {
    await readFile(join(root, legalPath), "utf8");
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
