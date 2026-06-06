import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const errors = [];
const warnings = [];

const expectedContactEmail = "contact@iocode-solutions.com";

const contactPages = [
  {
    locale: "es",
    path: "dist/es/contacto/index.html",
    warning:
      "No escribas contraseñas, tokens, datos bancarios ni información sensible."
  },
  {
    locale: "en",
    path: "dist/en/contact/index.html",
    warning:
      "Do not write passwords, tokens, banking data or sensitive information."
  },
  {
    locale: "de",
    path: "dist/de/kontakt/index.html",
    warning:
      "Bitte keine Passwörter, Tokens, Bankdaten oder sensiblen Informationen eingeben."
  }
];

const textFileExtensions = new Set([
  ".astro",
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
  ".example",
  ".gitignore",
  ".dockerignore"
]);

const binaryFileExtensions = new Set([
  ".avif",
  ".bin",
  ".bmp",
  ".gif",
  ".glb",
  ".ico",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png",
  ".webp",
  ".woff",
  ".woff2",
  ".zip"
]);

function projectPath(relativePath) {
  return join(rootDir, relativePath);
}

function normalizePath(filePath) {
  return relative(rootDir, filePath).replaceAll("\\", "/");
}

function readText(relativePath) {
  const absolutePath = projectPath(relativePath);

  if (!existsSync(absolutePath)) {
    errors.push(`${relativePath}: archivo no encontrado.`);
    return "";
  }

  return readFileSync(absolutePath, "utf8");
}

function assertContains(relativePath, expectedText, label) {
  const text = readText(relativePath);

  if (!text.includes(expectedText)) {
    errors.push(`${relativePath}: falta ${label}.`);
  }
}

function assertNotContains(relativePath, forbiddenPattern, label) {
  const text = readText(relativePath);

  if (forbiddenPattern.test(text)) {
    errors.push(`${relativePath}: contiene ${label}.`);
  }
}

function getExtension(filePath) {
  const fileName = filePath.split(/[\\/]/).pop() || "";
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex === -1) {
    return "";
  }

  return fileName.slice(dotIndex).toLowerCase();
}

function isLikelyTextFile(filePath) {
  const extension = getExtension(filePath);

  if (binaryFileExtensions.has(extension)) {
    return false;
  }

  if (textFileExtensions.has(extension)) {
    return true;
  }

  const fileName = filePath.split(/[\\/]/).pop() || "";

  return [
    "Dockerfile",
    "compose.yml",
    "package.json",
    "package-lock.json",
    ".env.example",
    ".gitignore",
    ".dockerignore"
  ].includes(fileName);
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
    "dist",
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

function scanForCredentialAssignments() {
  const scanTargets = [
    "src",
    "docs",
    "Docker",
    ".env.example",
    "compose.yml",
    "README.md",
    "RUN_GUIDE.md",
    "SECURITY.md",
    ".gitignore",
    ".dockerignore"
  ];

  const credentialAssignmentPattern =
    /\b(password|passwd|pwd|token|secret|api[_-]?key|private[_-]?key|access[_-]?key|client[_-]?secret)\b\s*[:=]\s*["']?([^"'\s#;]+)/gim;

  const privateKeyPattern =
    /-----BEGIN (RSA |DSA |EC |OPENSSH |)?PRIVATE KEY-----/gm;

  const allowedValues = new Set([
    "",
    "0",
    "1",
    "true",
    "false",
    "none",
    "null",
    "undefined",
    "development",
    "production",
    "example",
    "placeholder",
    "changeme",
    "change-me",
    "dummy",
    "redacted",
    "<redacted>",
    "<placeholder>"
  ]);

  for (const target of scanTargets) {
    for (const absoluteFilePath of walk(target)) {
      const relativeFilePath = normalizePath(absoluteFilePath);

      if (!isLikelyTextFile(relativeFilePath)) {
        continue;
      }

      const text = readFileSync(absoluteFilePath, "utf8");

      if (privateKeyPattern.test(text)) {
        errors.push(`${relativeFilePath}: posible clave privada embebida.`);
      }

      credentialAssignmentPattern.lastIndex = 0;

      for (const match of text.matchAll(credentialAssignmentPattern)) {
        const value = String(match[2] || "").trim().replace(/^["']|["']$/g, "");
        const normalizedValue = value.toLowerCase();

        if (allowedValues.has(normalizedValue)) {
          continue;
        }

        if (value.length < 8) {
          continue;
        }

        errors.push(
          `${relativeFilePath}: posible secreto asignado a "${match[1]}".`
        );
      }
    }
  }
}

function scanForMojibake() {
  const scanTargets = [
    "src/components",
    "src/i18n",
    "src/data",
    "docs",
    "README.md",
    "RUN_GUIDE.md",
    "SECURITY.md"
  ];

  const mojibakePattern = /Ã.|Â.|â|â€™|â€œ|â€|�/;

  for (const target of scanTargets) {
    for (const absoluteFilePath of walk(target)) {
      const relativeFilePath = normalizePath(absoluteFilePath);

      if (!isLikelyTextFile(relativeFilePath)) {
        continue;
      }

      const text = readFileSync(absoluteFilePath, "utf8");

      if (mojibakePattern.test(text)) {
        errors.push(`${relativeFilePath}: texto con codificación dañada.`);
      }
    }
  }

  for (const page of contactPages) {
    assertNotContains(
      page.path,
      mojibakePattern,
      "texto visible con codificación dañada"
    );
  }
}

function checkContactEmail() {
  assertContains(
    "src/data/site.ts",
    `email: "${expectedContactEmail}"`,
    "correo empresarial en siteConfig"
  );

  for (const page of contactPages) {
    assertContains(
      page.path,
      `mailto:${expectedContactEmail}`,
      `mailto empresarial en ${page.locale}`
    );

    assertContains(
      page.path,
      `data-contact-email="${expectedContactEmail}"`,
      `data-contact-email empresarial en ${page.locale}`
    );

    assertContains(
      page.path,
      page.warning,
      `advertencia de datos sensibles en ${page.locale}`
    );
  }
}

function checkContactPersonAndSocialScope() {
  const requiredContactMarkers = [
    "Diego Armando Diaz Devia",
    "linkedin.com/in/diegoarmandodiaz",
    "github.com/dadd86",
    '"@type":"Person"'
  ];

  for (const page of contactPages) {
    for (const marker of requiredContactMarkers) {
      assertContains(
        page.path,
        marker,
        `marcador de contacto "${marker}" en ${page.locale}`
      );
    }
  }

  const forbiddenOutsideContactPattern =
    /Diego Armando Diaz Devia|Diego Diaz|dadd86|linkedin\.com\/in\/diegoarmandodiaz|github\.com\/dadd86/g;

  for (const absoluteFilePath of walk("dist")) {
    const relativeFilePath = normalizePath(absoluteFilePath);

    if (!relativeFilePath.endsWith("index.html")) {
      continue;
    }

    if (
      relativeFilePath.includes("/contacto/") ||
      relativeFilePath.includes("/contact/") ||
      relativeFilePath.includes("/kontakt/")
    ) {
      continue;
    }

    const text = readFileSync(absoluteFilePath, "utf8");

    if (forbiddenOutsideContactPattern.test(text)) {
      errors.push(
        `${relativeFilePath}: información personal o enlaces sociales aparecen fuera de contacto.`
      );
    }
  }
}

function checkCspAndDocumentation() {
  const serverFile = "Docker/node-static-server.mjs";
  const securityFile = "SECURITY.md";

  assertContains(
    serverFile,
    "Content-Security-Policy",
    "cabecera Content-Security-Policy"
  );

  assertContains(
    serverFile,
    "default-src 'self'",
    "CSP default-src self"
  );

  assertContains(
    serverFile,
    "object-src 'none'",
    "CSP object-src none"
  );

  assertContains(
    serverFile,
    "frame-ancestors 'none'",
    "CSP frame-ancestors none"
  );

  assertContains(
    serverFile,
    "script-src 'self' 'unsafe-inline'",
    "deuda CSP script-src unsafe-inline explícita"
  );

  assertContains(
    serverFile,
    "style-src 'self' 'unsafe-inline'",
    "deuda CSP style-src unsafe-inline explícita"
  );

  assertContains(
    securityFile,
    "unsafe-inline",
    "documentación de deuda CSP unsafe-inline"
  );

  assertContains(
    securityFile,
    "Deuda aceptada temporalmente",
    "aceptación temporal documentada de CSP"
  );
}

function checkDockerReleaseGuards() {
  assertContains(
    "compose.yml",
    "read_only: true",
    "filesystem read-only en servicio web"
  );

  assertContains(
    "compose.yml",
    "no-new-privileges:true",
    "no-new-privileges en servicio web"
  );

  assertContains(
    "compose.yml",
    "cap_drop:",
    "cap_drop en servicio web"
  );

  assertContains(
    "Docker/Dockerfile",
    "USER node",
    "usuario no root en runtime"
  );

  assertContains(
    ".dockerignore",
    ".env",
    "exclusión de .env en Docker context"
  );

  assertContains(
    ".dockerignore",
    ".git",
    "exclusión de .git en Docker context"
  );
}

checkContactEmail();
checkContactPersonAndSocialScope();
checkCspAndDocumentation();
checkDockerReleaseGuards();
scanForCredentialAssignments();
scanForMojibake();

if (warnings.length > 0) {
  console.warn("Warnings Fase 1.1D:");

  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("Errores Fase 1.1D:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("QA estático Fase 1.1D superado.");