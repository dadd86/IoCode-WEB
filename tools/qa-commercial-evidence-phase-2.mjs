import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const artifactRoot = "qa-artifacts/commercial-evidence/phase-2";
const sourcePath = "src/data/projects.ts";

mkdirSync(artifactRoot, { recursive: true });

const requiredLocales = ["es", "en", "de"];

const requiredFields = [
  "key",
  "slug",
  "path",
  "title",
  "type",
  "summary",
  "problem",
  "solution",
  "technicalRole",
  "businessValue",
  "evidenceSummary",
  "technologies",
  "capabilities",
  "evidenceLevel",
  "claimLevel",
  "caution",
  "publicLinks",
  "featured",
  "seoTitle",
  "seoDescription",
  "keywords",
  "schemaType",
  "imageAlt"
];

const expectedProjectKeys = [
  "iocode-web",
  "techwizards",
  "hotelsol",
  "woodshops",
  "vehicle-rental",
  "the-javengers",
  "coworking-database",
  "break-boxes-game"
];

const forbiddenClaimPatterns = [
  {
    name: "garantizado",
    pattern: /\bgarantizado\b/i
  },
  {
    name: "guaranteed",
    pattern: /\bguaranteed\b/i
  },
  {
    name: "garantiert",
    pattern: /\bgarantiert\b/i
  },
  {
    name: "100% seguro",
    pattern: /100%\s*seguro/i
  },
  {
    name: "100% secure",
    pattern: /100%\s*secure/i
  },
  {
    name: "producción certificada",
    pattern: /\bproducci[oó]n\s+certificada\b/i
  },
  {
    name: "certified production",
    pattern: /\bcertified\s+production\b/i
  },
  {
    name: "cliente real",
    pattern: /\bcliente\s+real\b/i
  },
  {
    name: "real client",
    pattern: /\breal\s+client\b/i
  },
  {
    name: "mejora porcentual no probada",
    pattern: /\bmejor(a|ó)\s+del\s+\d+%/i
  },
  {
    name: "reduced by percent",
    pattern: /\breduced\s+by\s+\d+%/i
  },
  {
    name: "increased by percent",
    pattern: /\bincreased\s+by\s+\d+%/i
  },
  {
    name: "testimonial",
    pattern: /\btestimonial\b/i
  },
  {
    name: "testimonio",
    pattern: /\btestimonio\b/i
  },
  {
    name: "AggregateRating schema",
    pattern: /\bAggregateRating\b/
  },
  {
    name: "ratingValue schema",
    pattern: /\bratingValue\b/
  },
  {
    name: "reviewRating schema",
    pattern: /\breviewRating\b/
  },
  {
    name: "fake review phrase",
    pattern: /\breview\s+rating\b/i
  },
  {
    name: "aggregate rating phrase",
    pattern: /\baggregate\s+rating\b/i
  }
];

const sensitivePatterns = [
  {
    name: "possible-secret",
    pattern: /(password|passwd|pwd|token|secret|api[_-]?key|private[_-]?key)\s*[:=]/i
  },
  {
    name: "private-ip",
    pattern: /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})\b/
  },
  {
    name: "local-domain",
    pattern: /\b[a-z0-9-]+\.local\b/i
  }
];

function writeArtifact(name, errors, extra = {}) {
  const artifact = {
    phase: "2",
    status: errors.length === 0 ? "passed" : "failed",
    warningCount: 0,
    errorCount: errors.length,
    errors,
    generatedAt: new Date().toISOString(),
    ...extra
  };

  writeFileSync(join(artifactRoot, name), JSON.stringify(artifact, null, 2));

  return artifact;
}

async function loadProjectsFromTypescript() {
  if (!existsSync(sourcePath)) {
    throw new Error(`${sourcePath} no existe.`);
  }

  const source = readFileSync(sourcePath, "utf8");

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: false
    }
  });

  const tempModulePath = join(artifactRoot, "_projects.phase-2.mjs");

  writeFileSync(tempModulePath, transpiled.outputText);

  const moduleUrl = `${pathToFileURL(tempModulePath).href}?t=${Date.now()}`;
  const module = await import(moduleUrl);

  return {
    projects: module.projects,
    source
  };
}

const modelErrors = [];
const claimsErrors = [];
const privacyErrors = [];
const routesErrors = [];
const seoErrors = [];

let projects;
let source;

try {
  const loaded = await loadProjectsFromTypescript();
  projects = loaded.projects;
  source = loaded.source;
} catch (error) {
  modelErrors.push(error instanceof Error ? error.message : String(error));
}

if (projects) {
  for (const locale of requiredLocales) {
    const localeProjects = projects[locale];

    if (!Array.isArray(localeProjects)) {
      modelErrors.push(`${locale}: projects debe ser array.`);
      continue;
    }

    if (localeProjects.length !== expectedProjectKeys.length) {
      modelErrors.push(
        `${locale}: debe tener ${expectedProjectKeys.length} proyectos, tiene ${localeProjects.length}.`
      );
    }

    const keys = localeProjects.map((project) => project.key);
    const slugs = localeProjects.map((project) => project.slug);
    const paths = localeProjects.map((project) => project.path);

    for (const expectedKey of expectedProjectKeys) {
      if (!keys.includes(expectedKey)) {
        modelErrors.push(`${locale}: falta el proyecto ${expectedKey}.`);
      }
    }

    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);

    for (const duplicateSlug of duplicateSlugs) {
      modelErrors.push(`${locale}: slug duplicado ${duplicateSlug}.`);
    }

    const duplicatePaths = paths.filter((path, index) => paths.indexOf(path) !== index);
    for (const duplicatePath of duplicatePaths) {
      modelErrors.push(`${locale}: ruta duplicada ${duplicatePath}.`);
    }

    for (const project of localeProjects) {
      for (const field of requiredFields) {
        if (!(field in project)) {
          modelErrors.push(`${locale}/${project.title || "unknown"}: falta ${field}.`);
        }
      }

      for (const field of ["summary", "problem", "solution", "technicalRole", "businessValue", "caution"]) {
        if (typeof project[field] !== "string" || project[field].trim().length < 20) {
          modelErrors.push(`${locale}/${project.title}: ${field} debe ser texto explícito.`);
        }
      }

      if (project.seoTitle.length > 60) {
        modelErrors.push(`${locale}/${project.title}: seoTitle supera 60 caracteres.`);
      }

      if (project.seoDescription.length > 155) {
        modelErrors.push(`${locale}/${project.title}: seoDescription supera 155 caracteres.`);
      }

      if (!project.path.startsWith(`/${locale}/`) || !project.path.endsWith(`/${project.slug}/`)) {
        modelErrors.push(`${locale}/${project.title}: path y slug localizados no coinciden.`);
      }

      if (!Array.isArray(project.technologies) || project.technologies.length < 2) {
        modelErrors.push(`${locale}/${project.title}: technologies debe tener al menos 2 elementos.`);
      }

      if (!Array.isArray(project.capabilities) || project.capabilities.length < 1) {
        modelErrors.push(`${locale}/${project.title}: capabilities debe tener al menos 1 elemento.`);
      }

      if (!Array.isArray(project.publicLinks)) {
        modelErrors.push(`${locale}/${project.title}: publicLinks debe ser array.`);
      }

      const searchableText = JSON.stringify(project);

      for (const forbiddenClaim of forbiddenClaimPatterns) {
        if (forbiddenClaim.pattern.test(searchableText)) {
          claimsErrors.push(
            `${locale}/${project.title}: claim prohibido detectado: ${forbiddenClaim.name}.`
          );
        }
      }

      for (const sensitivePattern of sensitivePatterns) {
        if (sensitivePattern.pattern.test(searchableText)) {
          privacyErrors.push(`${locale}/${project.title}: posible dato sensible detectado: ${sensitivePattern.name}.`);
        }
      }

      if (
        project.claimLevel === "verified" &&
        (!Array.isArray(project.publicLinks) || project.publicLinks.length === 0)
      ) {
        claimsErrors.push(`${locale}/${project.title}: claimLevel verified requiere evidencia pública.`);
      }

      for (const link of project.publicLinks || []) {
        if (!link.href.startsWith("https://")) {
          privacyErrors.push(`${locale}/${project.title}: publicLinks solo debe usar HTTPS.`);
        }

        if (link.href.includes("github.com") && link.type !== "repository") {
          claimsErrors.push(`${locale}/${project.title}: enlace GitHub debe usar type repository.`);
        }
      }

      if (
        project.evidenceLevel === "private-project" &&
        Array.isArray(project.publicLinks) &&
        project.publicLinks.length > 0
      ) {
        privacyErrors.push(`${locale}/${project.title}: proyecto privado no debe publicar enlaces.`);
      }
    }
  }
}

const routeSource = existsSync("src/i18n/routes.ts") ? readFileSync("src/i18n/routes.ts", "utf8") : "";
const pageSource = existsSync("src/pages/[locale]/[...slug].astro")
  ? readFileSync("src/pages/[locale]/[...slug].astro", "utf8")
  : "";
const cardSource = existsSync("src/components/ProjectCard.astro")
  ? readFileSync("src/components/ProjectCard.astro", "utf8")
  : "";

for (const requiredRoute of ["/es/proyectos/", "/en/projects/", "/de/projekte/"]) {
  if (!routeSource.includes(requiredRoute)) {
    routesErrors.push(`Ruta requerida no encontrada: ${requiredRoute}.`);
  }
}

if (!cardSource.includes("project.problem")) {
  routesErrors.push("ProjectCard no muestra project.problem.");
}

if (!cardSource.includes("project.solution")) {
  routesErrors.push("ProjectCard no muestra project.solution.");
}

if (!cardSource.includes("project.technicalRole")) {
  routesErrors.push("ProjectCard no muestra project.technicalRole.");
}

if (!cardSource.includes("project.businessValue")) {
  routesErrors.push("ProjectCard no muestra project.businessValue.");
}

if (!cardSource.includes("project.evidenceLevel")) {
  routesErrors.push("ProjectCard no muestra project.evidenceLevel.");
}

if (!cardSource.includes("project.claimLevel")) {
  routesErrors.push("ProjectCard no muestra project.claimLevel.");
}

if (!pageSource.includes("ItemList") || !pageSource.includes("project.schemaType")) {
  seoErrors.push("La página de proyectos debe incluir ItemList y el tipo SoftwareSourceCode del modelo.");
}

const detailPageSource = existsSync("src/pages/[locale]/[section]/[project].astro")
  ? readFileSync("src/pages/[locale]/[section]/[project].astro", "utf8")
  : "";

if (!detailPageSource.includes("project.schemaType") || !detailPageSource.includes("getProjectAlternatePaths")) {
  seoErrors.push("Las fichas localizadas deben publicar SoftwareSourceCode y alternates recíprocos.");
}

const sitemapSource = existsSync("src/pages/sitemap.xml.ts")
  ? readFileSync("src/pages/sitemap.xml.ts", "utf8")
  : "";

if (!sitemapSource.includes("getProjectAlternatePaths") || !sitemapSource.includes("projects.es")) {
  seoErrors.push("El sitemap debe incluir cada ficha de proyecto y sus alternates localizados.");
}

const forbiddenSeoPatterns = [
  {
    name: "AggregateRating",
    pattern: /\bAggregateRating\b/
  },
  {
    name: "Review schema",
    pattern: /"@type"\s*:\s*"Review"/
  },
  {
    name: "testimonial",
    pattern: /\btestimonial\b/i
  },
  {
    name: "testimonio",
    pattern: /\btestimonio\b/i
  },
  {
    name: "ratingValue",
    pattern: /\bratingValue\b/
  },
  {
    name: "reviewRating",
    pattern: /\breviewRating\b/
  }
];

for (const forbiddenSeo of forbiddenSeoPatterns) {
  if (
    forbiddenSeo.pattern.test(source || "") ||
    forbiddenSeo.pattern.test(pageSource) ||
    forbiddenSeo.pattern.test(cardSource)
  ) {
    seoErrors.push(`Structured/content SEO contiene elemento no permitido: ${forbiddenSeo.name}.`);
  }
}

const modelArtifact = writeArtifact("content-model.json", modelErrors, {
  checkedFile: sourcePath,
  requiredProjectKeys: expectedProjectKeys
});

const claimsArtifact = writeArtifact("claims-review.json", claimsErrors, {
  checkedFile: sourcePath
});

const privacyArtifact = writeArtifact("privacy-review.json", privacyErrors, {
  checkedFile: sourcePath
});

const routesArtifact = writeArtifact("routes.json", routesErrors, {
  checkedFiles: ["src/i18n/routes.ts", "src/components/ProjectCard.astro"]
});

const seoArtifact = writeArtifact("seo-structured-data.json", seoErrors, {
  checkedFiles: [
    "src/pages/[locale]/[...slug].astro",
    "src/pages/[locale]/[section]/[project].astro",
    "src/pages/sitemap.xml.ts",
    "src/components/ProjectCard.astro"
  ]
});

const allErrors = [
  ...modelArtifact.errors,
  ...claimsArtifact.errors,
  ...privacyArtifact.errors,
  ...routesArtifact.errors,
  ...seoArtifact.errors
];

if (allErrors.length > 0) {
  console.error("Errores Fase 2:");
  for (const error of allErrors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("QA comercial Fase 2 superado.");
