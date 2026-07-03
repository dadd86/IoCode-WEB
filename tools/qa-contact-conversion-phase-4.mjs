import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const artifactRoot = "qa-artifacts/contact-conversion/phase-4";
mkdirSync(artifactRoot, { recursive: true });

const requiredLocales = ["es", "en", "de"];
const contactDataPath = "src/data/contact.ts";
const sitePath = "src/data/site.ts";
const componentPath = "src/components/ContactForm.astro";
const routePath = "src/i18n/routes.ts";

function writeArtifact(name, errors, extra = {}) {
  const artifact = {
    phase: "4",
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

async function loadTsModule(sourcePath, tempName) {
  const source = readFileSync(sourcePath, "utf8");

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: false
    }
  });

  const tempModulePath = join(artifactRoot, tempName);
  writeFileSync(tempModulePath, transpiled.outputText);

  return import(`${pathToFileURL(tempModulePath).href}?t=${Date.now()}`);
}

const contactConfigErrors = [];
const mailtoErrors = [];
const privacyErrors = [];
const apiContractErrors = [];
const routesErrors = [];

let contactModule;
let siteModule;

try {
  contactModule = await loadTsModule(contactDataPath, "_contact.phase-4.mjs");
} catch (error) {
  contactConfigErrors.push(`${contactDataPath}: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  siteModule = await loadTsModule(sitePath, "_site.phase-4.mjs");
} catch (error) {
  contactConfigErrors.push(`${sitePath}: ${error instanceof Error ? error.message : String(error)}`);
}

const componentSource = existsSync(componentPath) ? readFileSync(componentPath, "utf8") : "";
const routesSource = existsSync(routePath) ? readFileSync(routePath, "utf8") : "";

if (!componentSource) {
  contactConfigErrors.push(`${componentPath}: archivo no encontrado.`);
}

if (contactModule && siteModule) {
  const {
    contactContent,
    contactTopics,
    contactEmailVerification,
    contactApiContractDraft
  } = contactModule;

  const siteEmail = siteModule.siteConfig?.email;

  if (!siteEmail) {
    contactConfigErrors.push("siteConfig.email no está definido.");
  }

  if (contactEmailVerification?.address !== siteEmail) {
    contactConfigErrors.push("contactEmailVerification.address debe coincidir con siteConfig.email.");
  }

  if (contactEmailVerification?.status !== "verified") {
    contactConfigErrors.push(
      "Email real no verificado. Crea/verifica el buzón y cambia contactEmailVerification.status a \"verified\"."
    );
  }

  if (!contactEmailVerification?.evidence || contactEmailVerification.evidence.length < 20) {
    contactConfigErrors.push("Debe existir evidencia textual de verificación del buzón.");
  }

  for (const locale of requiredLocales) {
    const content = contactContent?.[locale];
    const topics = contactTopics?.[locale];

    if (!content) {
      contactConfigErrors.push(`${locale}: contactContent faltante.`);
      continue;
    }

    for (const field of [
      "acceptedProjectsTitle",
      "whatToSendTitle",
      "doNotSendTitle",
      "responseExpectationTitle",
      "fallbackTitle",
      "fallbackText",
      "copyEmailLabel",
      "copyEmailSuccess",
      "mailtoSubjectPrefix"
    ]) {
      if (!content[field] || String(content[field]).trim().length < 5) {
        contactConfigErrors.push(`${locale}: ${field} no está definido correctamente.`);
      }
    }

    for (const listField of ["acceptedProjects", "whatToSend", "doNotSend"]) {
      if (!Array.isArray(content[listField]) || content[listField].length < 3) {
        contactConfigErrors.push(`${locale}: ${listField} debe tener al menos 3 elementos.`);
      }
    }

    if (!content.responseExpectation || content.responseExpectation.length < 60) {
      contactConfigErrors.push(`${locale}: responseExpectation debe explicar qué ocurre después.`);
    }

    if (!Array.isArray(topics) || topics.length < 6) {
      contactConfigErrors.push(`${locale}: contactTopics debe tener al menos 6 opciones.`);
    }
  }

  if (!contactApiContractDraft) {
    apiContractErrors.push("contactApiContractDraft no existe.");
  } else {
    if (contactApiContractDraft.method !== "POST") {
      apiContractErrors.push("El contrato futuro debe ser POST.");
    }

    if (contactApiContractDraft.path !== "/api/contact") {
      apiContractErrors.push("El contrato futuro debe usar /api/contact.");
    }

    if (contactApiContractDraft.implemented !== false) {
      apiContractErrors.push("La API no debe estar implementada en Fase 4 mínima.");
    }

    for (const requiredField of ["name", "email", "topic", "message", "language", "consent", "website"]) {
      if (!contactApiContractDraft.requestBody?.[requiredField]) {
        apiContractErrors.push(`Contrato API: falta requestBody.${requiredField}.`);
      }
    }

    if (!Array.isArray(contactApiContractDraft.securityNotes) || contactApiContractDraft.securityNotes.length < 5) {
      apiContractErrors.push("Contrato API: faltan notas de seguridad suficientes.");
    }
  }
}

for (const requiredToken of [
  "data-contact-email",
  "data-contact-copy",
  "data-copy-status",
  "data-last-mailto",
  "mailto:",
  "encodeURIComponent",
  "navigator.clipboard",
  "reportValidity"
]) {
  if (!componentSource.includes(requiredToken)) {
    mailtoErrors.push(`${componentPath}: falta ${requiredToken}.`);
  }
}

for (const forbiddenInput of [
  'type="password"',
  'type="file"',
  'name="password"',
  'name="token"',
  'name="secret"',
  'name="credential"'
]) {
  if (componentSource.includes(forbiddenInput)) {
    privacyErrors.push(`${componentPath}: campo peligroso detectado: ${forbiddenInput}.`);
  }
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const contactDataSourceNormalized = normalizeText(readFileSync(contactDataPath, "utf8"));

for (const privacyTerm of [
  "contraseñas",
  "tokens",
  "credenciales",
  "passwörter",
  "zugangsdaten",
  "passwords",
  "credentials"
]) {
  if (!contactDataSourceNormalized.includes(normalizeText(privacyTerm))) {
    privacyErrors.push(`${contactDataPath}: falta microcopy de privacidad: ${privacyTerm}.`);
  }
}

for (const apiPath of [
  "src/pages/api/contact.ts",
  "src/pages/api/contact.js",
  "src/pages/api/contact/index.ts",
  "src/pages/api/contact/index.js"
]) {
  if (existsSync(apiPath)) {
    apiContractErrors.push(`La API real no debe existir todavía: ${apiPath}.`);
  }
}

for (const requiredRoute of ["/es/contacto/", "/en/contact/", "/de/kontakt/"]) {
  if (!routesSource.includes(requiredRoute)) {
    routesErrors.push(`Ruta requerida no encontrada: ${requiredRoute}.`);
  }
}

const artifacts = [
  writeArtifact("contact-config.json", contactConfigErrors, {
    checkedFiles: [contactDataPath, sitePath]
  }),
  writeArtifact("mailto-review.json", mailtoErrors, {
    checkedFile: componentPath
  }),
  writeArtifact("privacy-review.json", privacyErrors, {
    checkedFiles: [contactDataPath, componentPath]
  }),
  writeArtifact("api-contract-draft.json", apiContractErrors, {
    checkedFile: contactDataPath
  }),
  writeArtifact("routes.json", routesErrors, {
    checkedFile: routePath
  })
];

const allErrors = artifacts.flatMap((artifact) => artifact.errors);

if (allErrors.length > 0) {
  console.error("Errores Fase 4:");
  for (const error of allErrors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("QA contacto Fase 4 superado.");