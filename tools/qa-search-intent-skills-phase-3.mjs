import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const artifactRoot = "qa-artifacts/search-intent-skills/phase-3";
const sourcePath = "src/data/skills.ts";

mkdirSync(artifactRoot, { recursive: true });

const requiredLocales = ["es", "en", "de"];

const expectedSkillSlugs = [
  "industrial-automation",
  "industrial-communications",
  "ot-it-security",
  "modern-web-ui",
  "cloud-devsecops",
  "software-mobile",
  "eu-data-governance",
  "performance-qa"
];

const requiredFields = [
  "slug",
  "title",
  "searchIntent",
  "businessProblem",
  "technologies",
  "businessValue",
  "proficiency",
  "level",
  "evidence",
  "useCases",
  "relatedServices",
  "relatedProjects",
  "scope"
];

const forbiddenClaimPatterns = [
  { name: "guaranteed", pattern: /\bguaranteed\b/i },
  { name: "garantizado", pattern: /\bgarantizado\b/i },
  { name: "garantiert", pattern: /\bgarantiert\b/i },
  { name: "100 percent secure", pattern: /100%\s*(secure|seguro|sicher)/i },
  { name: "certified production", pattern: /\b(certified production|producción certificada)\b/i },
  { name: "real client", pattern: /\b(real client|cliente real)\b/i },
  { name: "unverified percent improvement", pattern: /\b(reduced by|increased by|mejora del)\s+\d+%/i },
  { name: "testimonial", pattern: /\b(testimonial|testimonio)\b/i },
  { name: "AggregateRating", pattern: /\bAggregateRating\b/ },
  { name: "ratingValue", pattern: /\bratingValue\b/ },
  { name: "Review schema", pattern: /"@type"\s*:\s*"Review"/ }
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
    phase: "3",
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

async function loadSkillsFromTypescript() {
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

  const tempModulePath = join(artifactRoot, "_skills.phase-3.mjs");

  writeFileSync(tempModulePath, transpiled.outputText);

  const moduleUrl = `${pathToFileURL(tempModulePath).href}?t=${Date.now()}`;
  const module = await import(moduleUrl);

  return {
    skillGroups: module.skillGroups,
    source
  };
}

const modelErrors = [];
const i18nErrors = [];
const claimsErrors = [];
const seoErrors = [];
const routesErrors = [];

let skillGroups;
let source;

try {
  const loaded = await loadSkillsFromTypescript();
  skillGroups = loaded.skillGroups;
  source = loaded.source;
} catch (error) {
  modelErrors.push(error instanceof Error ? error.message : String(error));
}

if (skillGroups) {
  for (const locale of requiredLocales) {
    const localeSkills = skillGroups[locale];

    if (!Array.isArray(localeSkills)) {
      modelErrors.push(`${locale}: skillGroups debe ser array.`);
      continue;
    }

    if (localeSkills.length !== expectedSkillSlugs.length) {
      modelErrors.push(`${locale}: debe tener ${expectedSkillSlugs.length} grupos, tiene ${localeSkills.length}.`);
    }

    const slugs = localeSkills.map((skill) => skill.slug);

    for (const expectedSlug of expectedSkillSlugs) {
      if (!slugs.includes(expectedSlug)) {
        modelErrors.push(`${locale}: falta skill group ${expectedSlug}.`);
      }
    }

    for (const skill of localeSkills) {
      for (const field of requiredFields) {
        if (!(field in skill)) {
          modelErrors.push(`${locale}/${skill.title || "unknown"}: falta ${field}.`);
        }
      }

      for (const field of ["searchIntent", "businessProblem", "businessValue", "evidence", "scope"]) {
        if (typeof skill[field] !== "string" || skill[field].trim().length < 35) {
          modelErrors.push(`${locale}/${skill.title}: ${field} debe ser texto explícito.`);
        }
      }

      if (!Array.isArray(skill.technologies) || skill.technologies.length < 4) {
        modelErrors.push(`${locale}/${skill.title}: technologies debe tener al menos 4 elementos.`);
      }

      if (!Array.isArray(skill.useCases) || skill.useCases.length < 3) {
        modelErrors.push(`${locale}/${skill.title}: useCases debe tener al menos 3 elementos.`);
      }

      if (!Array.isArray(skill.relatedServices) || skill.relatedServices.length < 1) {
        modelErrors.push(`${locale}/${skill.title}: relatedServices debe tener al menos 1 elemento.`);
      }

      // Not every skill needs a related project: professional experience and
      // certificates (checked above via the `evidence` field's minimum
      // length) are legitimate evidence on their own. relatedProjects only
      // needs to be an array — TypeScript's ProjectKey union already
      // guarantees every entry references a real project.
      if (!Array.isArray(skill.relatedProjects)) {
        modelErrors.push(`${locale}/${skill.title}: relatedProjects debe ser un array.`);
      }

      const searchableText = JSON.stringify(skill);

      for (const forbiddenClaim of forbiddenClaimPatterns) {
        if (forbiddenClaim.pattern.test(searchableText)) {
          claimsErrors.push(`${locale}/${skill.title}: claim prohibido detectado: ${forbiddenClaim.name}.`);
        }
      }

      for (const sensitivePattern of sensitivePatterns) {
        if (sensitivePattern.pattern.test(searchableText)) {
          claimsErrors.push(`${locale}/${skill.title}: posible dato sensible detectado: ${sensitivePattern.name}.`);
        }
      }

      const repeatedTechs = skill.technologies.filter(
        (technology, index) => skill.technologies.indexOf(technology) !== index
      );

      if (repeatedTechs.length > 0) {
        seoErrors.push(`${locale}/${skill.title}: tecnologías duplicadas detectadas.`);
      }

     const normalizedSearchableText = searchableText
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const meaningfulTitleWords = skill.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(/[^a-zA-ZäöüÄÖÜß0-9]+/)
        .filter((word) => word.length >= 6)
        .filter(
            (word) =>
                ![
                    "datos",
                    "daten",
                    "data",
                    "datenbanken",
                    "databases",
                    "bases",
                    "systems",
                    "sistemas",
                    "systeme",
                    "software",
                    "industrial",
                    "industrielle",
                    "documentation",
                    "dokumentation",
                    "validierung",
                    "validation",
                    "automation",
                    "automatisierung"
                ].includes(word)
            );

    for (const word of meaningfulTitleWords) {
            const exactWordPattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
            const exactOccurrences = normalizedSearchableText.match(exactWordPattern)?.length ?? 0;

            if (exactOccurrences > 10) {
                seoErrors.push(`${locale}/${skill.title}: posible keyword stuffing con "${word}".`);
            }
        }
    }
  }

  const esTitles = skillGroups.es.map((skill) => skill.title).join(" ");
  const enTitles = skillGroups.en.map((skill) => skill.title).join(" ");
  const deTitles = skillGroups.de.map((skill) => skill.title).join(" ");

  if (esTitles === enTitles || enTitles === deTitles || esTitles === deTitles) {
    i18nErrors.push("Los títulos ES/EN/DE parecen no estar localizados.");
  }

  // Evidence-diversity contract: relatedProjects is locale-independent, so a
  // single locale's array is enough to verify the aggregated capability model
  // does not regress to citing only one or two portfolio projects.
  //
  // The threshold is a SHARE of the portfolio, not a fixed count, and the
  // share is deliberately 0.5 rather than 1.0: the regression this guards
  // against concentrated evidence in 2 of 8 projects (25%), so 50% clears
  // that failure state with a wide margin while staying well short of
  // forcing every skill to cite most/all projects (which would itself
  // incentivize the fabricated associations this contract exists to catch —
  // see Section 16/20 of the portfolio repositioning task). Not every
  // project needs a skill: industrial skills legitimately rely on declared
  // professional experience rather than portfolio code.
  //
  // CURRENT_PORTFOLIO_PROJECT_COUNT must be kept in sync with the number of
  // ProjectKey variants in src/data/projects.ts — it is not derived
  // dynamically, to avoid coupling this skills-only QA script to the
  // projects data model for a single constant.
  const CURRENT_PORTFOLIO_PROJECT_COUNT = 8;
  const MIN_DIVERSE_PROJECT_SHARE = 0.5;

  const allRelatedProjects = skillGroups.es.flatMap((skill) => skill.relatedProjects);
  const uniqueRelatedProjects = new Set(allRelatedProjects);
  const minDiverseProjects = Math.ceil(CURRENT_PORTFOLIO_PROJECT_COUNT * MIN_DIVERSE_PROJECT_SHARE);

  if (uniqueRelatedProjects.size < minDiverseProjects) {
    modelErrors.push(
      `Evidencia de Skills concentrada en muy pocos proyectos (${uniqueRelatedProjects.size} únicos); se esperan al menos ${minDiverseProjects} de los ${CURRENT_PORTFOLIO_PROJECT_COUNT} proyectos del portfolio.`
    );
  }
}

const routeSource = existsSync("src/i18n/routes.ts") ? readFileSync("src/i18n/routes.ts", "utf8") : "";
const pageSource = existsSync("src/pages/[locale]/[...slug].astro")
  ? readFileSync("src/pages/[locale]/[...slug].astro", "utf8")
  : "";
const cardSource = existsSync("src/components/SkillCard.astro")
  ? readFileSync("src/components/SkillCard.astro", "utf8")
  : "";

for (const requiredRoute of ["/es/habilidades/", "/en/skills/", "/de/faehigkeiten/"]) {
  if (!routeSource.includes(requiredRoute)) {
    routesErrors.push(`Ruta requerida no encontrada: ${requiredRoute}.`);
  }
}

for (const requiredCardToken of [
  "skill.businessProblem",
  "skill.businessValue",
  "skill.useCases",
  "skill.relatedServices",
  "skill.relatedProjects",
  "skill.proficiency",
  "skill.evidence",
  "skill.scope"
]) {
  if (!cardSource.includes(requiredCardToken)) {
    routesErrors.push(`SkillCard no muestra ${requiredCardToken}.`);
  }
}

// searchIntent is internal SEO governance metadata, not customer-facing copy:
// it must remain in the data model (for SEO tooling) but must never be
// rendered by SkillCard.
if (cardSource.includes("skill.searchIntent")) {
  routesErrors.push("SkillCard expone skill.searchIntent como copy pública; searchIntent debe permanecer interno.");
}

if (!pageSource.includes("skillStructuredData")) {
  seoErrors.push("La página de habilidades debe incluir skillStructuredData.");
}

if (!pageSource.includes("ItemList") || !pageSource.includes("DefinedTerm")) {
  seoErrors.push("Structured data de skills debe usar DefinedTermSet/DefinedTerm.");
}

for (const forbiddenSeo of forbiddenClaimPatterns) {
  if (forbiddenSeo.pattern.test(source || "") || forbiddenSeo.pattern.test(pageSource) || forbiddenSeo.pattern.test(cardSource)) {
    seoErrors.push(`Contenido/SEO contiene elemento no permitido: ${forbiddenSeo.name}.`);
  }
}

const artifacts = [
  writeArtifact("content-model.json", modelErrors, { checkedFile: sourcePath }),
  writeArtifact("i18n-review.json", i18nErrors, { checkedFile: sourcePath }),
  writeArtifact("claims-review.json", claimsErrors, { checkedFile: sourcePath }),
  writeArtifact("seo-structure.json", seoErrors, {
    checkedFiles: ["src/data/skills.ts", "src/pages/[locale]/[...slug].astro"]
  }),
  writeArtifact("routes.json", routesErrors, {
    checkedFiles: ["src/i18n/routes.ts", "src/components/SkillCard.astro"]
  })
];

const allErrors = artifacts.flatMap((artifact) => artifact.errors);

if (allErrors.length > 0) {
  console.error("Errores Fase 3:");
  for (const error of allErrors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("QA habilidades Fase 3 superado.");
