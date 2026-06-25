import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const phase = "1.1C";
const artifactRoot = "qa-artifacts/seo/phase-1-1c";
const siteUrl = "https://iocode-solutions.com";

const errors = [];
const warnings = [];

const localeGroups = [
  {
    key: "home",
    paths: {
      es: "/es/",
      en: "/en/",
      de: "/de/"
    }
  },
  {
    key: "services",
    paths: {
      es: "/es/servicios/",
      en: "/en/services/",
      de: "/de/leistungen/"
    }
  },
  {
    key: "plc",
    paths: {
      es: "/es/automatizacion-plc/",
      en: "/en/plc-automation/",
      de: "/de/sps-automatisierung/"
    }
  },
  {
    key: "robotics",
    paths: {
      es: "/es/robotica-industrial/",
      en: "/en/industrial-robotics/",
      de: "/de/industrierobotik/"
    }
  },
  {
    key: "about",
    paths: {
      es: "/es/empresa/",
      en: "/en/company/",
      de: "/de/unternehmen/"
    }
  },
  {
    key: "projects",
    paths: {
      es: "/es/proyectos/",
      en: "/en/projects/",
      de: "/de/projekte/"
    }
  },
  {
    key: "skills",
    paths: {
      es: "/es/habilidades/",
      en: "/en/skills/",
      de: "/de/faehigkeiten/"
    }
  },
  {
    key: "process",
    paths: {
      es: "/es/proceso/",
      en: "/en/process/",
      de: "/de/prozess/"
    }
  },
  {
    key: "contact",
    paths: {
      es: "/es/contacto/",
      en: "/en/contact/",
      de: "/de/kontakt/"
    }
  }
];

const locales = ["es", "en", "de"];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function read(file) {
  return readFileSync(file, "utf8");
}

function pathToDistFile(pathname) {
  return `dist${pathname}index.html`.replaceAll("//", "/");
}

function absoluteUrl(pathname) {
  return `${siteUrl}${pathname}`;
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

function extractJsonLdBlocks(html) {
  return Array.from(html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)).map(
    (match) => match[1]
  );
}

function parseJsonLd(file, html) {
  const blocks = extractJsonLdBlocks(html);

  if (blocks.length === 0) {
    fail(`${file}: falta JSON-LD`);
    return [];
  }

  const parsed = [];

  for (const block of blocks) {
    try {
      parsed.push(JSON.parse(block));
    } catch (error) {
      fail(`${file}: JSON-LD inválido: ${error.message}`);
    }
  }

  return parsed;
}

function flattenGraph(jsonLdBlocks) {
  return jsonLdBlocks.flatMap((block) => {
    if (Array.isArray(block["@graph"])) {
      return block["@graph"];
    }

    return [block];
  });
}

function getCanonical(html) {
  const matches = Array.from(html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/g)).map(
    (match) => match[1]
  );

  return matches;
}

function getAlternates(html) {
  const alternates = new Map();

  for (const match of html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g)) {
    alternates.set(match[1], match[2]);
  }

  return alternates;
}

function assertMetadata(file, html) {
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ?? "";
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1]?.trim() ?? "";
  const robots = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/)?.[1]?.trim() ?? "";

  if (title.length < 10) {
    fail(`${file}: title ausente o demasiado corto`);
  }

  if (title.length > 70) {
    warn(`${file}: title largo (${title.length} caracteres)`);
  }

  if (description.length < 50) {
    fail(`${file}: meta description ausente o demasiado corta`);
  }

  if (/noindex/i.test(robots)) {
    fail(`${file}: contiene noindex accidental`);
  }

  if (!/<meta\s+property="og:title"\s+content="[^"]+"/.test(html)) {
    fail(`${file}: falta og:title`);
  }

  if (!/<meta\s+property="og:description"\s+content="[^"]+"/.test(html)) {
    fail(`${file}: falta og:description`);
  }

  if (!/<meta\s+property="og:url"\s+content="https:\/\/iocode-solutions\.com\//.test(html)) {
    fail(`${file}: falta og:url absoluto`);
  }

  if (!/<meta\s+name="twitter:card"\s+content="summary"/.test(html)) {
    fail(`${file}: falta twitter:card summary`);
  }

  return { title, description, robots };
}

function assertStructuredData(file, html, expectedPath) {
  const jsonLdBlocks = parseJsonLd(file, html);
  const graph = flattenGraph(jsonLdBlocks);

  for (const type of ["Organization", "ProfessionalService", "WebSite", "BreadcrumbList", "WebPage"]) {
    if (!graph.some((item) => item["@type"] === type)) {
      fail(`${file}: falta schema ${type}`);
    }
  }

  const breadcrumb = graph.find((item) => item["@type"] === "BreadcrumbList");

  if (breadcrumb) {
    const items = breadcrumb.itemListElement;

    if (!Array.isArray(items) || items.length < 1 || items.length > 2) {
      fail(`${file}: BreadcrumbList debe tener 1 o 2 elementos`);
    }

    const lastItem = items?.[items.length - 1];

    if (lastItem?.item !== absoluteUrl(expectedPath)) {
      fail(`${file}: BreadcrumbList termina en ${lastItem?.item}, esperado ${absoluteUrl(expectedPath)}`);
    }
  }

  const organization = graph.find((item) => item["@type"] === "Organization");

  if (organization?.contactPoint?.email && organization.contactPoint.email !== "contact@iocode-solutions.com") {
    fail(`${file}: ContactPoint email inesperado: ${organization.contactPoint.email}`);
  }
}

function assertHtmlRoute(group, locale, html, file) {
  const expectedPath = group.paths[locale];
  const expectedCanonical = absoluteUrl(expectedPath);

  if (!html.includes(`<html lang="${locale}"`)) {
    fail(`${file}: html lang no coincide con ${locale}`);
  }

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;

  if (h1Count !== 1) {
    fail(`${file}: debe tener exactamente 1 h1; encontrado ${h1Count}`);
  }

  const canonicals = getCanonical(html);

  if (canonicals.length !== 1) {
    fail(`${file}: debe tener exactamente 1 canonical; encontrado ${canonicals.length}`);
  }

  if (canonicals[0] !== expectedCanonical) {
    fail(`${file}: canonical ${canonicals[0]} no coincide con ${expectedCanonical}`);
  }

  const alternates = getAlternates(html);

  for (const alternateLocale of locales) {
    const expectedAlternate = absoluteUrl(group.paths[alternateLocale]);

    if (alternates.get(alternateLocale) !== expectedAlternate) {
      fail(`${file}: hreflang ${alternateLocale} esperado ${expectedAlternate}, recibido ${alternates.get(alternateLocale)}`);
    }
  }

  const expectedDefault = absoluteUrl(group.paths.es);

  if (alternates.get("x-default") !== expectedDefault) {
    fail(`${file}: x-default esperado ${expectedDefault}, recibido ${alternates.get("x-default")}`);
  }

  assertMetadata(file, html);
  assertStructuredData(file, html, expectedPath);

  const imageTags = html.match(/<img\b[^>]*>/g) || [];

  for (const imageTag of imageTags) {
    if (!/\salt="[^"]*"/.test(imageTag)) {
      fail(`${file}: imagen sin alt -> ${imageTag}`);
    }
  }
}

function assertSitemap() {
  const sitemapPath = "dist/sitemap.xml";

  if (!existsSync(sitemapPath)) {
    fail("dist/sitemap.xml no existe");
    return;
  }

  const sitemap = read(sitemapPath);

  if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
    fail("sitemap.xml: falta namespace xhtml");
  }

  if (sitemap.includes("<lastmod>")) {
    fail("sitemap.xml: contiene lastmod dinámico o no verificado. Quitar hasta tener fechas reales por página.");
  }

  if (sitemap.includes("/404.html") || sitemap.includes("/404/")) {
    fail("sitemap.xml: no debe incluir 404 como URL indexable");
  }

  for (const group of localeGroups) {
    for (const locale of locales) {
      const loc = absoluteUrl(group.paths[locale]);

      if (!sitemap.includes(`<loc>${loc}</loc>`)) {
        fail(`sitemap.xml: falta loc ${loc}`);
      }

      for (const alternateLocale of locales) {
        const expectedAlternate = `hreflang="${alternateLocale}" href="${absoluteUrl(group.paths[alternateLocale])}"`;

        if (!sitemap.includes(expectedAlternate)) {
          fail(`sitemap.xml: falta alternate ${expectedAlternate}`);
        }
      }

      const expectedDefault = `hreflang="x-default" href="${absoluteUrl(group.paths.es)}"`;

      if (!sitemap.includes(expectedDefault)) {
        fail(`sitemap.xml: falta ${expectedDefault}`);
      }
    }
  }
}

function assertRobots() {
  const robotsPath = "dist/robots.txt";

  if (!existsSync(robotsPath)) {
    fail("dist/robots.txt no existe");
    return;
  }

  const robots = read(robotsPath);

  if (!robots.includes("User-agent: *")) {
    fail("robots.txt: falta User-agent: *");
  }

  if (!robots.includes("Allow: /")) {
    fail("robots.txt: falta Allow: /");
  }

  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
    fail("robots.txt: falta Sitemap absoluto");
  }

  for (const blocked of ["Disallow: /es", "Disallow: /en", "Disallow: /de", "Disallow: /_astro", "Disallow: /logo"]) {
    if (robots.includes(blocked)) {
      fail(`robots.txt: bloqueo público no permitido: ${blocked}`);
    }
  }
}

function assertNoUnexpectedIndexableHtml() {
  const htmlFiles = walk("dist").filter((file) => file.endsWith(".html"));
  const expectedFiles = new Set(localeGroups.flatMap((group) => locales.map((locale) => pathToDistFile(group.paths[locale]))));
  expectedFiles.add("dist/index.html");
  expectedFiles.add("dist/404.html");

  for (const file of htmlFiles) {
    if (!expectedFiles.has(file)) {
      fail(`${file}: HTML no esperado por matriz SEO. Añadirlo a localeGroups o marcarlo no indexable explícitamente.`);
    }
  }
}

const routeEvidence = [];

for (const group of localeGroups) {
  for (const locale of locales) {
    const file = pathToDistFile(group.paths[locale]);

    if (!existsSync(file)) {
      fail(`Falta archivo de ruta: ${file}`);
      continue;
    }

    const html = read(file);
    assertHtmlRoute(group, locale, html, file);

    routeEvidence.push({
      group: group.key,
      locale,
      path: group.paths[locale],
      file,
      canonical: absoluteUrl(group.paths[locale])
    });
  }
}

assertNoUnexpectedIndexableHtml();
assertSitemap();
assertRobots();

mkdirSync(artifactRoot, { recursive: true });

const summary = {
  phase,
  name: "SEO técnico multilingüe",
  status: errors.length === 0 ? "passed" : "failed",
  generatedAt: new Date().toISOString(),
  routesChecked: routeEvidence.length,
  hreflangGroups: localeGroups.length,
  canonicalErrors: errors.filter((error) => error.includes("canonical")).length,
  metadataErrors: errors.filter((error) => error.includes("title") || error.includes("description") || error.includes("og:") || error.includes("twitter")).length,
  sitemapErrors: errors.filter((error) => error.includes("sitemap")).length,
  robotsErrors: errors.filter((error) => error.includes("robots")).length,
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  routes: routeEvidence
};

writeFileSync(
  join(artifactRoot, "summary.json"),
  JSON.stringify(summary, null, 2),
  "utf-8"
);

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

console.log("QA SEO estático Fase 1.1C superado.");
console.log(`summary.json generado en ${artifactRoot}/summary.json`);