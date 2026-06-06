import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const warnings = [];

const requiredFiles = [
  "dist/es/index.html",
  "dist/en/index.html",
  "dist/de/index.html",
  "dist/es/servicios/index.html",
  "dist/en/services/index.html",
  "dist/de/leistungen/index.html",
  "dist/es/proceso/index.html",
  "dist/en/process/index.html",
  "dist/de/prozess/index.html",
  "dist/es/contacto/index.html",
  "dist/en/contact/index.html",
  "dist/de/kontakt/index.html",
  "dist/sitemap.xml",
  "dist/robots.txt",
  "dist/404.html"
];

const contactFiles = new Set([
  "dist/es/contacto/index.html",
  "dist/en/contact/index.html",
  "dist/de/kontakt/index.html"
]);

const forbiddenOutsideContact = [
  "Diego",
  "Diaz",
  "dadd86",
  "linkedin.com/in/diegoarmandodiaz",
  "github.com/dadd86"
];

function read(file) {
  return readFileSync(file, "utf8");
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function walk(directory) {
  const result = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      result.push(...walk(fullPath));
    } else {
      result.push(fullPath.replaceAll("\\", "/"));
    }
  }

  return result;
}

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Falta archivo requerido: ${file}`);
  }
}

if (existsSync("dist")) {
  const htmlFiles = walk("dist").filter((file) => file.endsWith(".html"));

  for (const file of htmlFiles) {
    const html = read(file);

    const h1Count = (html.match(/<h1[\s>]/g) || []).length;

    if (h1Count !== 1) {
      fail(`${file}: debe tener exactamente 1 h1; encontrado ${h1Count}`);
    }

    if (!/<html\s+lang="(es|en|de)"/.test(html)) {
      fail(`${file}: falta lang vÃ¡lido en html`);
    }

    if (!/<title>[^<]{10,}<\/title>/.test(html)) {
      fail(`${file}: title ausente o demasiado corto`);
    }

    if (!/<meta\s+name="description"\s+content="[^"]{50,}"/.test(html)) {
      fail(`${file}: meta description ausente o demasiado corta`);
    }

    if (!/<link\s+rel="canonical"\s+href="https:\/\/iocode-solutions\.com\//.test(html)) {
      fail(`${file}: canonical ausente o invÃ¡lido`);
    }

    for (const hreflang of ["es", "en", "de", "x-default"]) {
      if (!html.includes(`hreflang="${hreflang}"`)) {
        fail(`${file}: falta hreflang ${hreflang}`);
      }
    }

    if (!html.includes('"@type":"Organization"')) {
      fail(`${file}: falta schema Organization`);
    }

    if (!html.includes('"@type":"ProfessionalService"')) {
      fail(`${file}: falta schema ProfessionalService`);
    }

    if (!html.includes('"@type":"BreadcrumbList"')) {
      fail(`${file}: falta schema BreadcrumbList`);
    }

    if (!contactFiles.has(file)) {
      for (const forbidden of forbiddenOutsideContact) {
        if (html.includes(forbidden)) {
          fail(`${file}: contiene dato personal fuera de contacto: ${forbidden}`);
        }
      }
    }

    const imageTags = html.match(/<img\b[^>]*>/g) || [];

    for (const imageTag of imageTags) {
      if (!/\salt="[^"]*"/.test(imageTag)) {
        fail(`${file}: imagen sin alt -> ${imageTag}`);
      }
    }

    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || "";

    if (title.length > 70) {
      warn(`${file}: title largo (${title.length} caracteres)`);
    }
  }

  for (const file of contactFiles) {
    if (!existsSync(file)) {
      continue;
    }

    const html = read(file);

    for (const required of [
      "linkedin.com/in/diegoarmandodiaz",
      "github.com/dadd86",
      "contactForm",
      "aria-describedby",
      "mailto:"
    ]) {
      if (!html.includes(required)) {
        fail(`${file}: falta ${required}`);
      }
    }
  }
}

if (existsSync("dist/sitemap.xml")) {
  const sitemap = read("dist/sitemap.xml");

  for (const expected of [
    "xmlns:xhtml",
    "hreflang=\"es\"",
    "hreflang=\"en\"",
    "hreflang=\"de\"",
    "hreflang=\"x-default\"",
    "<lastmod>"
  ]) {
    if (!sitemap.includes(expected)) {
      fail(`sitemap.xml: falta ${expected}`);
    }
  }
}

if (warnings.length > 0) {
  console.warn("Warnings Fase 1.1C:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("Errores Fase 1.1C:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("QA estÃ¡tico Fase 1.1C superado.");