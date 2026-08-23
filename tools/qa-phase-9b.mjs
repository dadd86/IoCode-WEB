import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const siteUrl = "https://iocode-solutions.com";
const deployEnvironment = process.env.PUBLIC_DEPLOY_ENV || "production";
const isProduction = deployEnvironment === "production";
const distRoot = resolve("dist");
const locales = ["es", "en", "de"];
const marketingGroups = [
  ["home", "/es/", "/en/", "/de/"],
  ["services", "/es/servicios/", "/en/services/", "/de/leistungen/"],
  ["plc", "/es/automatizacion-plc/", "/en/plc-automation/", "/de/sps-automatisierung/"],
  ["robotics", "/es/robotica-industrial/", "/en/industrial-robotics/", "/de/industrierobotik/"],
  ["about", "/es/empresa/", "/en/company/", "/de/unternehmen/"],
  ["projects", "/es/proyectos/", "/en/projects/", "/de/projekte/"],
  ["skills", "/es/habilidades/", "/en/skills/", "/de/faehigkeiten/"],
  ["process", "/es/proceso/", "/en/process/", "/de/prozess/"],
  ["contact", "/es/contacto/", "/en/contact/", "/de/kontakt/"]
];
const legalGroups = [
  ["imprint", "/es/aviso-legal/", "/en/imprint/", "/de/impressum/"],
  ["privacy", "/es/privacidad/", "/en/privacy/", "/de/datenschutz/"]
];
const allGroups = [...marketingGroups, ...legalGroups];
const localizedNotFoundPaths = ["/es/404/", "/en/404/", "/de/404/"];
const spanishLeakPattern = /\b(?:diagnóstico|trazabilidad|automatización|robótica|solución|página|navegación|privacidad|política|aviso legal|volver al inicio|solicitar propuesta|ver proyectos|preparar correo|selecciona una opción)\b/iu;
const errors = [];
const evidence = [];

const fail = (message) => errors.push(message);
const absolute = (path) => `${siteUrl}${path}`;
const htmlPath = (path) => join(distRoot, path.replace(/^\//u, ""), "index.html");

function attribute(html, selectorPattern, name) {
  const tag = html.match(selectorPattern)?.[0] || "";
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`, "iu"))?.[1] || "";
}

function assertMetadata(html, path, locale, paths) {
  const canonical = attribute(html, /<link\b[^>]*rel="canonical"[^>]*>/iu, "href");
  if (canonical !== absolute(path)) fail(`${path}: canonical ${canonical || "ausente"}.`);

  for (const [index, hreflang] of [...locales, "x-default"].entries()) {
    const tag = html.match(new RegExp(`<link\\b[^>]*rel="alternate"[^>]*hreflang="${hreflang}"[^>]*>`, "iu"))?.[0] || "";
    const expected = absolute(hreflang === "x-default" ? paths[0] : paths[index]);
    if (attribute(tag, /<link\b[^>]*>/iu, "href") !== expected) fail(`${path}: hreflang ${hreflang} no recíproco.`);
  }

  const expectedSocial = {
    "og:title": "property",
    "og:description": "property",
    "og:image": "property",
    "og:url": "property",
    "og:locale": "property",
    "twitter:card": "name",
    "twitter:title": "name",
    "twitter:description": "name",
    "twitter:image": "name",
    "twitter:url": "name"
  };

  for (const [metadataName, key] of Object.entries(expectedSocial)) {
    const escaped = metadataName.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    const tag = html.match(new RegExp(`<meta\\b[^>]*${key}="${escaped}"[^>]*>`, "iu"))?.[0] || "";
    const content = attribute(tag, /<meta\b[^>]*>/iu, "content");
    if (!content) fail(`${path}: falta ${metadataName}.`);
    if (["og:image", "twitter:image"].includes(metadataName) && !content.startsWith(`${siteUrl}/`)) fail(`${path}: ${metadataName} no es absoluto de producción.`);
    if (["og:url", "twitter:url"].includes(metadataName) && content !== absolute(path)) fail(`${path}: ${metadataName} no coincide con canonical.`);
  }

  if (!new RegExp(`<html\\b[^>]*lang="${locale}"`, "iu").test(html)) fail(`${path}: lang incorrecto.`);
  if (/https?:\/\/(localhost|127\.0\.0\.1|web)(?::\d+)?/iu.test(html)) fail(`${path}: contiene origen de desarrollo.`);

  const legalPaths = [pathsFor("imprint", locale), pathsFor("privacy", locale)];
  for (const legalPath of legalPaths) {
    if (!html.includes(`href="${legalPath}"`)) fail(`${path}: footer sin enlace ${legalPath}.`);
  }
}

function pathsFor(key, locale) {
  const group = allGroups.find(([groupKey]) => groupKey === key);
  return group?.[locales.indexOf(locale) + 1] || "";
}

function renderedText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
    .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&(?:nbsp|copy|amp|lt|gt|quot|#39);/giu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

for (const [groupKey, ...paths] of allGroups) {
  for (const [index, path] of paths.entries()) {
    try {
      const html = await readFile(htmlPath(path), "utf8");
      assertMetadata(html, path, locales[index], paths);
      if (legalGroups.some(([key]) => key === groupKey)) {
        const isComplete = html.includes('data-legal-status="complete"');
        const isNoIndex = /name="robots"\s+content="[^"]*noindex/iu.test(html);
        const hasVisibleDraftNotice = html.includes('class="legalNotice"');
        if (isProduction && !isComplete) fail(`${path}: datos legales incompletos.`);
        if (isProduction && isNoIndex) fail(`${path}: noindex en producción.`);
        if (!isProduction && isComplete) fail(`${path}: estado legal completo fuera de producción.`);
        if (!isProduction && (!isNoIndex || !hasVisibleDraftNotice)) {
          fail(`${path}: preview legal sin noindex o aviso visible.`);
        }
      }
      evidence.push({ group: groupKey, locale: locales[index], path, canonical: absolute(path) });
    } catch (error) {
      fail(`${path}: no se pudo leer ${htmlPath(path)} (${error.message}).`);
    }
  }
}

for (const [locale, path] of [
  ...allGroups.flatMap(([, ...paths]) => paths.map((path, index) => [locales[index], path])),
  ...localizedNotFoundPaths.map((path, index) => [locales[index], path])
]) {
  if (locale === "es") continue;

  try {
    const html = await readFile(htmlPath(path), "utf8");
    const leak = renderedText(html).match(spanishLeakPattern)?.[0];
    if (leak) fail(`${path}: texto español filtrado en ${locale}: «${leak}».`);
  } catch (error) {
    fail(`${path}: auditoría i18n no pudo leer la ruta (${error.message}).`);
  }
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory)) {
    const path = join(directory, entry);
    (await stat(path)).isDirectory() ? files.push(...await walk(path)) : files.push(path);
  }
  return files;
}

for (const file of await walk(distRoot)) {
  if (!/\.(?:html|css|js|mjs|json|xml|txt|svg)$/iu.test(file)) continue;
  const content = await readFile(file, "utf8");
  if (/https?:\/\/(localhost|127\.0\.0\.1|web)(?::\d+)?/iu.test(content)) fail(`${file}: origen de desarrollo filtrado.`);
}

const [sitemap, sitemapIndex, robots] = await Promise.all([
  readFile(join(distRoot, "sitemap.xml"), "utf8"),
  readFile(join(distRoot, "sitemap-index.xml"), "utf8"),
  readFile(join(distRoot, "robots.txt"), "utf8")
]);

if (!sitemap.startsWith("<?xml") || !sitemap.includes("</urlset>")) fail("sitemap.xml no tiene estructura XML completa.");
for (const [, ...paths] of allGroups) for (const path of paths) if (!sitemap.includes(`<loc>${absolute(path)}</loc>`)) fail(`sitemap.xml: falta ${path}.`);
if (!sitemapIndex.includes(`<loc>${siteUrl}/sitemap.xml</loc>`)) fail("sitemap-index.xml no referencia el sitemap de rutas.");
if (isProduction && !robots.includes(`Sitemap: ${siteUrl}/sitemap-index.xml`)) {
  fail("robots.txt no referencia el índice absoluto.");
}
if (!isProduction && (!robots.includes("Disallow: /") || robots.includes("Sitemap:"))) {
  fail("robots.txt de preview debe bloquear rastreo y omitir el sitemap.");
}

const report = {
  schemaVersion: 1,
  phase: "9B",
  deployEnvironment,
  status: errors.length === 0 ? "passed" : "failed",
  marketingRoutesChecked: evidence.filter(({ group }) => marketingGroups.some(([key]) => key === group)).length,
  legalRoutesChecked: evidence.filter(({ group }) => legalGroups.some(([key]) => key === group)).length,
  localizedRoutesLanguageChecked: allGroups.length * locales.length + localizedNotFoundPaths.length,
  errors,
  evidence
};

await mkdir(resolve("qa-artifacts/phase-9b"), { recursive: true });
await writeFile(resolve("qa-artifacts/phase-9b/static-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

if (errors.length > 0) {
  console.error(`Fase 9B: FAILED (${errors.length} errores)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Fase 9B: PASSED; ${report.marketingRoutesChecked} rutas comerciales y ${report.legalRoutesChecked} rutas legales.`);
