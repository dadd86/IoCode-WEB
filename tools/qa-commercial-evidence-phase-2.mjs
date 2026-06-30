import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const artifactRoot = "qa-artifacts/commercial-evidence/phase-2";
const sourcePath = "src/data/projects.ts";

mkdirSync(artifactRoot, { recursive: true });

const requiredLocales = ["es", "en", "de"];

const requiredFields = [
  "slug",
  "title",
  "type",
  "summary",
  "problem",
  "solution",
  "technicalRole",
  "businessValue",
  "technologies",
  "capabilities",
  "status",
  "evidenceLevel",
  "claimLevel",
  "caution",
  "publicLinks",
  "featured"
];

const expectedProjectSlugs = [
  "techwizards",
  "neuronaprediccion",
  "maceta-inteligente",
  "hotelsol",
  "odoo-erp-deployment",
  "openldap-docker",
  "ad-wsus",
  "java-mvc-dao-javafx"
];

const forbiddenClaims = [
  "garantizado",
  "guaranteed",
  "garantiert",
  "100% seguro",
  "100% secure",
  "producción certificada",
  "certified production",
  "cliente real",
  "real client",
  "mejora del",
  "reduced by",
  "aumentó",
  "increased by",
  "testimonial",
  "testimonio",
  "aggregateRating",
  "AggregateRating",
  "review",
  "rating"
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

    if (localeProjects.length < expectedProjectSlugs.length) {
      modelErrors.push(
        `${locale}: debe tener al menos ${expectedProjectSlugs.length} proyectos, tiene ${localeProjects.length}.`
      );
    }

    const slugs = localeProjects.map((project) => project.slug);

    for (const expectedSlug of expectedProjectSlugs) {
      if (!slugs.includes(expectedSlug)) {
        modelErrors.push(`${locale}: falta el proyecto ${expectedSlug}.`);
      }
    }

    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);

    for (const duplicateSlug of duplicateSlugs) {
      modelErrors.push(`${locale}: slug duplicado ${duplicateSlug}.`);
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

      for (const forbiddenClaim of forbiddenClaims) {
        if (searchableText.toLowerCase().includes(forbiddenClaim.toLowerCase())) {
          claimsErrors.push(`${locale}/${project.title}: claim prohibido detectado: ${forbiddenClaim}.`);
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

if (!pageSource.includes("ItemList") || !pageSource.includes("CreativeWork")) {
  seoErrors.push("La página de proyectos debe incluir structured data prudente ItemList/CreativeWork.");
}

for (const forbiddenSeo of ["AggregateRating", "Review", "testimonial", "ratingValue"]) {
  if (
    source?.includes(forbiddenSeo) ||
    pageSource.includes(forbiddenSeo) ||
    cardSource.includes(forbiddenSeo)
  ) {
    seoErrors.push(`Structured/content SEO contiene elemento no permitido: ${forbiddenSeo}.`);
  }
}

const modelArtifact = writeArtifact("content-model.json", modelErrors, {
  checkedFile: sourcePath,
  requiredProjectSlugs: expectedProjectSlugs
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
  checkedFiles: ["src/pages/[locale]/[...slug].astro", "src/components/ProjectCard.astro"]
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