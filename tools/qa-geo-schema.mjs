import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const distDir = "dist";
const siteUrl = "https://iocode-solutions.com";
const errors = [];

const expectedPageTypes = new Map([
  ["/empresa/", "AboutPage"],
  ["/company/", "AboutPage"],
  ["/unternehmen/", "AboutPage"],
  ["/servicios/", "CollectionPage"],
  ["/services/", "CollectionPage"],
  ["/leistungen/", "CollectionPage"],
  ["/proyectos/", "CollectionPage"],
  ["/projects/", "CollectionPage"],
  ["/projekte/", "CollectionPage"],
  ["/habilidades/", "CollectionPage"],
  ["/skills/", "CollectionPage"],
  ["/faehigkeiten/", "CollectionPage"],
  ["/contacto/", "ContactPage"],
  ["/contact/", "ContactPage"],
  ["/kontakt/", "ContactPage"]
]);

const servicePageSegments = [
  "/automatizacion-plc/",
  "/plc-automation/",
  "/sps-automatisierung/",
  "/robotica-industrial/",
  "/industrial-robotics/",
  "/industrierobotik/"
];

function fail(message) {
  errors.push(message);
}

function read(file) {
  return readFileSync(file, "utf8");
}

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const entryPath = path.join(directory, entry);
    return statSync(entryPath).isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function attributeValue(html, elementPattern, attributeName) {
  const match = html.match(elementPattern);
  if (!match) {
    return null;
  }

  return match[0].match(new RegExp(`${attributeName}="([^"]+)"`, "i"))?.[1] ?? null;
}

function jsonLdDocuments(html, file) {
  const documents = [];

  for (const match of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )) {
    try {
      documents.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`${file}: JSON-LD inválido (${error.message})`);
    }
  }

  return documents;
}

function pagePathFromFile(file) {
  const relative = path.relative(distDir, file).replaceAll("\\", "/");
  const withoutIndex = relative.replace(/index\.html$/, "");
  return `/${withoutIndex}`;
}

function includesType(node, expectedType) {
  const nodeTypes = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
  return nodeTypes.includes(expectedType);
}

function assertSocialMetadata(html, file) {
  const expectedImage = `${siteUrl}/logo/iocode-logo.png`;
  const checks = [
    [/ <meta\b[^>]*property="og:image"[^>]*>/i, "og:image", expectedImage],
    [/ <meta\b[^>]*property="og:image:width"[^>]*>/i, "og:image:width", "512"],
    [/ <meta\b[^>]*property="og:image:height"[^>]*>/i, "og:image:height", "512"],
    [/ <meta\b[^>]*property="og:image:alt"[^>]*>/i, "og:image:alt", "IoCode SOLUTIONS"],
    [/ <meta\b[^>]*name="twitter:image"[^>]*>/i, "twitter:image", expectedImage],
    [/ <meta\b[^>]*name="twitter:image:alt"[^>]*>/i, "twitter:image:alt", "IoCode SOLUTIONS"]
  ];

  for (const [pattern, label, expected] of checks) {
    const normalizedPattern = new RegExp(pattern.source.trimStart(), pattern.flags);
    const value = attributeValue(html, normalizedPattern, "content");

    if (value !== expected) {
      fail(`${file}: ${label} esperado ${expected}; recibido ${value ?? "ausente"}`);
    }
  }
}

function assertStructuredData(html, file, pagePath) {
  const documents = jsonLdDocuments(html, file);
  const graphDocument = documents.find(
    (document) =>
      document?.["@context"] === "https://schema.org" && Array.isArray(document?.["@graph"])
  );

  if (!graphDocument) {
    fail(`${file}: falta un documento JSON-LD con @graph`);
    return;
  }

  const graph = graphDocument["@graph"];
  const organization = graph.find((node) => includesType(node, "Organization"));
  const webPage = graph.find((node) =>
    ["WebPage", "AboutPage", "CollectionPage", "ContactPage"].some((type) =>
      includesType(node, type)
    )
  );

  if (!organization) {
    fail(`${file}: falta Organization en @graph`);
  } else {
    if (
      typeof organization.logo !== "object" ||
      organization.logo?.["@type"] !== "ImageObject" ||
      organization.logo?.contentUrl !== `${siteUrl}/logo/iocode-logo.png` ||
      organization.logo?.width !== 512 ||
      organization.logo?.height !== 512
    ) {
      fail(`${file}: Organization.logo debe ser un ImageObject 512x512 verificable`);
    }

    if (Array.isArray(organization.sameAs) && organization.sameAs.length === 0) {
      fail(`${file}: Organization.sameAs no debe declararse como array vacío`);
    }
  }

  if (!webPage) {
    fail(`${file}: falta la entidad de página en @graph`);
  }

  const expectedPageType = [...expectedPageTypes.entries()].find(([segment]) =>
    pagePath.endsWith(segment)
  )?.[1];

  if (expectedPageType && !includesType(webPage, expectedPageType)) {
    fail(`${file}: la entidad de página debe usar @type ${expectedPageType}`);
  }

  const isHome = /^\/(es|en|de)\/$/.test(pagePath);
  const breadcrumbNode = graph.find((node) => includesType(node, "BreadcrumbList"));
  const visibleBreadcrumb = /<nav\b[^>]*data-breadcrumb[^>]*>[\s\S]*?<\/nav>/i.test(html);

  if (isHome) {
    if (breadcrumbNode || visibleBreadcrumb) {
      fail(`${file}: la portada no debe declarar un breadcrumb redundante`);
    }
  } else {
    if (!breadcrumbNode) {
      fail(`${file}: falta BreadcrumbList en @graph`);
    }

    if (!visibleBreadcrumb || !/<li\b[^>]*aria-current="page"/i.test(html)) {
      fail(`${file}: BreadcrumbList debe coincidir con un breadcrumb visible`);
    }
  }

  if (servicePageSegments.some((segment) => pagePath.endsWith(segment))) {
    const service = graph.find((node) => includesType(node, "Service"));

    if (!service || webPage?.mainEntity?.["@id"] !== service?.["@id"]) {
      fail(`${file}: la landing de servicio debe interconectar WebPage.mainEntity y Service`);
    }
  }
}

function assertRobots() {
  const file = path.join(distDir, "robots.txt");

  if (!existsSync(file)) {
    fail(`${file}: archivo ausente`);
    return;
  }

  const robots = read(file);
  const citationAgents = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
    "Perplexity-User",
    "Claude-SearchBot",
    "Claude-User"
  ];
  const trainingAgents = ["GPTBot", "ClaudeBot", "Google-Extended"];

  for (const agent of [...citationAgents, ...trainingAgents]) {
    const group = new RegExp(
      `User-agent:\\s*${agent}\\s*(?:\\r?\\n)+Allow:\\s*/(?:\\s|$)`,
      "i"
    );

    if (!group.test(robots)) {
      fail(`${file}: falta política explícita Allow para ${agent}`);
    }
  }
}

if (!existsSync(distDir)) {
  console.error("GEO QA FAIL: dist no existe; ejecuta el build antes de validar.");
  process.exit(1);
}

const htmlFiles = walk(distDir).filter((file) => {
  const relative = path.relative(distDir, file).replaceAll("\\", "/");
  return file.endsWith(".html") && relative !== "index.html" && relative !== "404.html";
});

for (const file of htmlFiles) {
  const html = read(file);
  const pagePath = pagePathFromFile(file);

  assertSocialMetadata(html, file);
  assertStructuredData(html, file, pagePath);
}

assertRobots();

if (errors.length > 0) {
  console.error(`GEO QA FAIL (${errors.length} hallazgos)`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `GEO QA PASS: ${htmlFiles.length} páginas con metadatos sociales, grafo semántico, breadcrumbs visibles y políticas de bots verificadas.`
);
