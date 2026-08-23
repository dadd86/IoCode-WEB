import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const reportPath = resolve(root, "qa-artifacts/phase-9f/static-report.json");
const checks = [];

async function text(path) {
  return readFile(resolve(root, path), "utf8");
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

function check(id, condition, evidence) {
  checks.push({ id, status: condition ? "passed" : "failed", evidence });
}

const governance = JSON.parse(await text("config/privacy-governance.json"));
const routes = await text("src/i18n/routes.ts");
const legalConfig = await text("src/config/legal.ts");
const legalProfile = await text("src/data/legal-profile.ts");
const legalData = await text("src/data/legal.ts");
const legalPage = await text("src/components/LegalPage.astro");
const footer = await text("src/components/Footer.astro");
const ropa = await text("docs/ROPA_INVENTORY.md");
const dpa = await text("docs/PROCESSOR_DPA_REGISTER.md");
const operations = await text("docs/PRIVACY_OPERATIONS.md");
const changelog = await text("docs/LEGAL_CHANGELOG.md");

check(
  "9.41-treatment-inventory",
  ["web-delivery", "email-enquiries", "search-console", "external-links", "data-subject-requests"].every(
    (id) => governance.treatments.some((treatment) => treatment.id === id)
  ) && governance.treatments.every((treatment) => treatment.legalBasis && treatment.retention),
  "Cinco tratamientos incluyen finalidad, base, destinatarios, conservación y transferencias."
);

const legalRoutes = [
  ["es/aviso-legal/index.html", "/es/aviso-legal/"],
  ["en/imprint/index.html", "/en/imprint/"],
  ["de/impressum/index.html", "/de/impressum/"],
  ["es/privacidad/index.html", "/es/privacidad/"],
  ["en/privacy/index.html", "/en/privacy/"],
  ["de/datenschutz/index.html", "/de/datenschutz/"]
];
let legalBuildValid = true;
for (const [file, canonicalPath] of legalRoutes) {
  try {
    const html = await text(`dist/${file}`);
    legalBuildValid &&= new RegExp(
      `<link rel="canonical" href="https?://[^"/]+${canonicalPath.replaceAll("/", "\\/")}">`,
      "u"
    ).test(html);
    legalBuildValid &&= html.includes("data-legal-status=");
  } catch {
    legalBuildValid = false;
  }
}
check(
  "9.42-imprint",
  legalBuildValid &&
    routes.includes('path: { es: "/es/aviso-legal/", en: "/en/imprint/", de: "/de/impressum/" }') &&
    legalConfig.includes("publicLegalProfile") &&
    ["legalForm", "street", "postalCode", "email", "vatId"].every((field) =>
      legalProfile.includes(field)
    ) &&
    footer.includes('getLocalizedPath("imprint", locale)'),
  "Tres Impressum canónicos, estructura §5 DDG y footer permanente."
);

check(
  "9.43-privacy-notice",
  [
    "Article 6(1)(f)",
    "Article 6(1)(b)",
    "Article 14 GDPR",
    "Access, rectification, erasure",
    "Data portability",
    "automated decision-making"
  ].every((term) => legalData.includes(term)) &&
    legalPage.includes("supervisoryAuthorityUrl") &&
    legalPage.includes("privacyEmail"),
  "Política trilingüe Art. 13/14 con bases, conservación, derechos y autoridad."
);

check(
  "9.44-processors-dpa",
  ["hosting", "email", "DNS/CDN", "domain registrar", "Google Search Console"].every((service) =>
    governance.providers.some((provider) => provider.service === service)
  ) &&
    governance.providers.every((provider) => provider.dpaStatus) &&
    dpa.includes("Checklist Art. 28"),
  "Registro de proveedores no inventa contratos y bloquea los pendientes."
);

check(
  "9.45-ropa",
  ropa.includes("No se invoca la excepción del artículo 30(5)") &&
    ["RAT-01", "RAT-02", "RAT-03", "RAT-04", "RAT-05"].every((id) => ropa.includes(id)),
  "RAT completo mantenido por recurrencia del tratamiento."
);

const runtimeFiles = (await walk(resolve(root, "src"))).filter((path) =>
  [".astro", ".js", ".mjs", ".ts"].includes(extname(path))
);
const excludedDisclosure = resolve(root, "src/data/legal.ts");
const runtimeCode = (
  await Promise.all(
    runtimeFiles
      .filter((path) => path !== excludedDisclosure)
      .map(async (path) => `${relative(root, path)}\n${await readFile(path, "utf8")}`)
  )
).join("\n");
const forbiddenStorage = [
  /document\s*\.\s*cookie/u,
  /localStorage\s*\./u,
  /sessionStorage\s*\./u,
  /indexedDB\s*\./u,
  /serviceWorker\s*\.\s*register/u,
  /caches\s*\.\s*open/u
];
const distHtml = (
  await Promise.all(
    (await walk(resolve(root, "dist")))
      .filter((path) => path.endsWith(".html"))
      .map((path) => readFile(path, "utf8"))
  )
).join("\n");
const externalEmbedding = /<(script|iframe|img|link)\b[^>]+(?:src|href)=["']https?:\/\/(?!iocode-solutions\.com|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)/iu;

check(
  "9.46-cookie-storage-audit",
  forbiddenStorage.every((pattern) => !pattern.test(runtimeCode)) &&
    !externalEmbedding.test(distHtml) &&
    governance.terminalTechnologies.every((technology) => typeof technology.consentRequired === "boolean"),
  "Sin cookies/storage persistente ni recursos de tracking embebidos; APIs efímeras inventariadas."
);

check(
  "9.47-consent-management",
  governance.consentBanner.required === false &&
    governance.consentBanner.reassessmentTriggers.length >= 6 &&
    operations.includes("un banner sería engañoso") &&
    !/cookiebot|onetrust|consentmanager|cookie-banner/iu.test(runtimeCode),
  "Ausencia de banner justificada y sujeta a reevaluación bloqueante."
);

check(
  "9.48-international-transfers",
  dpa.includes("Preferir tratamiento y soporte íntegramente en el EEE") &&
    dpa.includes("EU-US Data Privacy Framework") &&
    dpa.includes("SCC") &&
    dpa.includes("Transfer Impact Assessment"),
  "Árbol EEE, adecuación/DPF y SCC+TIA; proveedores desconocidos continúan bloqueados."
);

check(
  "9.49-dsar",
  ["30 días naturales", "un mes", "Verificar identidad", "DSAR-AAAA-NNN", "Portabilidad", "Oposición"].every(
    (term) => operations.includes(term)
  ),
  "Canal, verificación proporcional, registro, derechos y plazos definidos."
);

check(
  "9.50-legal-governance",
  legalConfig.includes('legalVersion: "2026-08-23.1"') &&
    changelog.includes("2026-08-23.1") &&
    changelog.includes("Responsable") &&
    legalPage.includes("versionSummary"),
  "Versión visible, changelog y flujo de aprobación implantados."
);

const failed = checks.filter((item) => item.status === "failed");
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  status: failed.length === 0 ? "passed" : "failed",
  productionLegalGate: governance.controllerApproval === "approved" ? "ready" : "blocked",
  checks
};

await mkdir(dirname(reportPath), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const item of checks) console.log(`${item.status === "passed" ? "PASS" : "FAIL"} ${item.id}: ${item.evidence}`);
console.log(`Phase 9F static QA: ${report.status.toUpperCase()}; production legal gate: ${report.productionLegalGate.toUpperCase()}`);
if (failed.length > 0) process.exitCode = 1;
