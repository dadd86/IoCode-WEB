import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import { extname, join, relative } from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const artifactRoot = "qa-artifacts/security/phase-1-1d";
const errors = [];
const warnings = [];

const expectedContactEmail = "contact@iocode-solutions.com";

const contactPages = [
  "dist/es/contacto/index.html",
  "dist/en/contact/index.html",
  "dist/de/kontakt/index.html"
];

const allowedExternalPrefixes = [
  "https://iocode-solutions.com",
  "https://schema.org",
  "http://www.w3.org",
  "https://www.w3.org",
  "http://www.sitemaps.org",
  "https://github.com/dadd86",
  "https://www.linkedin.com/in/diegoarmandodiaz/"
];

const allowedDocumentationUrlPrefixes = [
  "https://jcgt.org/published/"
];

const analyticsOrTrackingPattern =
  /googletagmanager|google-analytics|gtag\(|dataLayer|facebook\.net|connect\.facebook|hotjar|clarity\.ms|youtube\.com\/iframe_api|player\.vimeo|fonts\.googleapis|fonts\.gstatic/i;

const sensitiveFieldPattern =
  /type=["']?(password|file|tel)["']?|name=["']?(password|token|secret|apiKey|api_key|privateKey|private_key|dni|passport|iban|medical|health|financial)["']?/i;

const sensitiveTermsPattern =
  /\b(passwords?|credentials?|contraseñas?|tokens?|secrets?|private|medical|médico|health|salud|financial|financiero|iban|dni|passport|pasaporte)\b/iu;

const allowedSensitiveCopy = [
  "No escribas contraseñas, tokens, datos bancarios ni información sensible.",
  "Do not write passwords, tokens, banking data or sensitive information.",
  "Bitte keine Passwörter, Tokens, Bankdaten oder sensiblen Informationen eingeben.",
  "Do not publish code or sensitive documentation without prior review."
];

function projectPath(relativePath) {
  return join(rootDir, relativePath);
}

function normalizePath(filePath) {
  return relative(rootDir, filePath).replaceAll("\\", "/");
}

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });

  writeFileSync(
    join(artifactRoot, name),
    JSON.stringify(payload, null, 2),
    "utf8"
  );
}

function walk(inputPath) {
  const absolutePath = projectPath(inputPath);

  if (!existsSync(absolutePath)) {
    return [];
  }

  const stats = statSync(absolutePath);

  if (stats.isFile()) {
    return [absolutePath];
  }

  const ignoredDirectories = new Set([
    ".astro",
    ".git",
    "node_modules",
    "playwright-report",
    "qa-artifacts",
    "test-results"
  ]);

  const files = [];

  for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = join(absolutePath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(normalizePath(entryPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function isTextCandidate(filePath) {
  const extension = extname(filePath).toLowerCase();

  return [
    ".astro",
    ".css",
    ".html",
    ".js",
    ".json",
    ".md",
    ".mjs",
    ".ts",
    ".txt",
    ".xml",
    ".yml",
    ".yaml",
    ".svg"
  ].includes(extension);
}

function extractExternalUrls(text) {
  const matches = text.match(/https?:\/\/[^\s"'<>)]*/g) || [];

  return matches.map((url) => url.replace(/[.,;]+$/g, ""));
}

function isAllowedExternalUrl(url) {
  return allowedExternalPrefixes.some((prefix) => url.startsWith(prefix));
}

function isContactPage(path) {
  return (
    path.includes("/contacto/") ||
    path.includes("/contact/") ||
    path.includes("/kontakt/")
  );
}

function scanExternalUrlsAndTracking() {
  const targets = ["dist", "src", "public"];
  const findings = [];

  for (const target of targets) {
    for (const absoluteFilePath of walk(target)) {
      const relativeFilePath = normalizePath(absoluteFilePath);

      if (!isTextCandidate(relativeFilePath)) {
        continue;
      }

      const text = readFileSync(absoluteFilePath, "utf8");

      if (analyticsOrTrackingPattern.test(text)) {
        errors.push(`${relativeFilePath}: posible analytics/tracking/fuente externa no documentada.`);
      }

      for (const url of extractExternalUrls(text)) {
        if (url.startsWith("http://localhost") || url.startsWith("http://web:")) {
          continue;
        }

        const isDocumentationUrl = allowedDocumentationUrlPrefixes.some((prefix) =>
            url.startsWith(prefix)
        );

        if (isDocumentationUrl) {
            warnings.push(
                `${relativeFilePath}: URL documental permitida en bundle generado: ${url}`
        );
            continue;
        }

        if (!isAllowedExternalUrl(url)) {
            findings.push({ file: relativeFilePath, url });
        }
      }
    }
  }

  for (const finding of findings) {
    errors.push(`${finding.file}: URL externa no permitida: ${finding.url}`);
  }
}

function scanTargetBlankRel() {
  for (const absoluteFilePath of walk("dist")) {
    const relativeFilePath = normalizePath(absoluteFilePath);

    if (!relativeFilePath.endsWith(".html")) {
      continue;
    }

    const text = readFileSync(absoluteFilePath, "utf8");
    const anchors = text.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi) || [];

    for (const anchor of anchors) {
      if (!/rel=["'][^"']*\bnoopener\b[^"']*\bnoreferrer\b[^"']*["']/i.test(anchor)) {
        errors.push(`${relativeFilePath}: enlace target="_blank" sin rel="noopener noreferrer": ${anchor}`);
      }
    }
  }
}

function scanSocialScope() {
  const forbiddenOutsideContactPattern =
    /Diego Armando Diaz Devia|Diego Diaz|dadd86|linkedin\.com\/in\/diegoarmandodiaz|github\.com\/dadd86/g;

  for (const absoluteFilePath of walk("dist")) {
    const relativeFilePath = normalizePath(absoluteFilePath);

    if (!relativeFilePath.endsWith("index.html")) {
      continue;
    }

    if (isContactPage(relativeFilePath)) {
      continue;
    }

    const text = readFileSync(absoluteFilePath, "utf8");

    if (forbiddenOutsideContactPattern.test(text)) {
      errors.push(`${relativeFilePath}: datos personales o perfiles sociales aparecen fuera de contacto.`);
    }
  }
}

function scanContactFormMinimization() {
  for (const page of contactPages) {
    if (!existsSync(projectPath(page))) {
      errors.push(`${page}: página de contacto no generada.`);
      continue;
    }

    const html = readFileSync(projectPath(page), "utf8");

    if (!html.includes(`mailto:${expectedContactEmail}`)) {
      errors.push(`${page}: el formulario/contacto no usa el correo público aprobado.`);
    }

    if (sensitiveFieldPattern.test(html)) {
      errors.push(`${page}: formulario contiene campos sensibles o innecesarios.`);
    }
  }
}

function scanSensitiveTerms() {
  const targets = ["src", "public", "dist"];

  for (const target of targets) {
    for (const absoluteFilePath of walk(target)) {
      const relativeFilePath = normalizePath(absoluteFilePath);

      if (!isTextCandidate(relativeFilePath)) {
        continue;
      }

      const text = readFileSync(absoluteFilePath, "utf8");

      if (!sensitiveTermsPattern.test(text)) {
        continue;
      }

      const isAllowedCopy = allowedSensitiveCopy.some((copy) => text.includes(copy));

      if (!isAllowedCopy) {
        warnings.push(`${relativeFilePath}: contiene términos sensibles; revisar si es documentación/microcopy permitida.`);
      }
    }
  }
}

scanExternalUrlsAndTracking();
scanTargetBlankRel();
scanSocialScope();
scanContactFormMinimization();
scanSensitiveTerms();

const status = errors.length === 0 ? "passed" : "failed";

writeArtifact("privacy-surface.json", {
  phase: "1.1D",
  check: "privacy-surface",
  status,
  checks: {
    externalUrls: "checked",
    analyticsTracking: "checked",
    targetBlankRel: "checked",
    socialScope: "checked",
    contactFormMinimization: "checked",
    sensitiveTerms: "checked"
  },
  allowedExternalPrefixes,
  allowedDocumentationUrlPrefixes,
  warningCount: warnings.length,
  errorCount: errors.length,
  warnings,
  errors,
  generatedAt: new Date().toISOString()
});

if (warnings.length > 0) {
  console.warn("Warnings privacidad Fase 1.1D:");

  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("Errores privacidad Fase 1.1D:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Superficie de privacidad Fase 1.1D superada.");