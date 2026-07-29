import { existsSync } from "node:fs";
import {
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile
} from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const REQUIRED_METADATA_FIELDS = [
  "Bloque",
  "Descripción",
  "Ámbito",
  "Idiomas afectados",
  "Origen de datos",
  "Última verificación"
];

const OPTIONAL_METADATA_FIELDS = [
  "Commit verificado"
];

const MOJIBAKE_PATTERNS = [
  /\uFFFD/u,
  /Ã[\u0080-\u00BF]/u,
  /Â[\u0080-\u00BF]/u,
  /â[\u0080-\u00BF]{1,2}/u,
  /ï»¿/u,
  /ðŸ/u
];

const RUNTIME_EXTENSIONS = new Set([
  ".astro",
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".mjs",
  ".ts",
  ".tsx"
]);

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/u, "")
    .replace(/\|$/u, "")
    .split("|")
    .map((cell) => cell.trim());
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split(/\r?\n/u).length;
}

function finding({
  category = "documentation",
  code,
  file,
  line = 1,
  message
}) {
  return {
    severity: "error",
    category,
    code,
    file,
    line,
    message
  };
}

function parseMetadata(filePath, content, findings) {
  const lines = content.split(/\r?\n/u);
  const headerIndex = lines.findIndex(
    (line) =>
      line.trim().startsWith("|") &&
      splitTableRow(line).includes("Bloque")
  );

  if (headerIndex === -1) {
    findings.push(
      finding({
        code: "DOC_METADATA_MISSING",
        file: filePath,
        line: 1,
        message: "Falta la tabla de metadatos obligatoria."
      })
    );
    return {};
  }

  const headers = splitTableRow(lines[headerIndex]);
  const requiredPrefix = headers.slice(0, REQUIRED_METADATA_FIELDS.length);

  if (
    requiredPrefix.length !== REQUIRED_METADATA_FIELDS.length ||
    requiredPrefix.some(
      (header, index) => header !== REQUIRED_METADATA_FIELDS[index]
    )
  ) {
    findings.push(
      finding({
        code: "DOC_METADATA_HEADER",
        file: filePath,
        line: headerIndex + 1,
        message:
          "La cabecera debe conservar el contrato exacto: " +
          REQUIRED_METADATA_FIELDS.join(" | ") +
          "."
      })
    );
  }

  const dataLine = lines[headerIndex + 2] ?? "";
  const values = splitTableRow(dataLine);
  const metadata = Object.fromEntries(
    headers.map((header, index) => [header, values[index] ?? ""])
  );

  for (const field of REQUIRED_METADATA_FIELDS) {
    if (!metadata[field]) {
      findings.push(
        finding({
          code: "DOC_METADATA_VALUE",
          file: filePath,
          line: headerIndex + 3,
          message: `El campo de metadatos "${field}" está vacío o ausente.`
        })
      );
    }
  }

  return metadata;
}

function validateFreshness({
  filePath,
  metadata,
  documentType,
  maxAgeDays,
  now,
  findings
}) {
  if (
    documentType === "adr" ||
    documentType === "historical" ||
    documentType === "changelog" ||
    !maxAgeDays
  ) {
    return;
  }

  const dateText = metadata["Última verificación"];
  if (!dateText) {
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/u.test(dateText)) {
    findings.push(
      finding({
        code: "DOC_METADATA_DATE",
        file: filePath,
        message:
          'El campo "Última verificación" debe usar el formato YYYY-MM-DD.'
      })
    );
    return;
  }

  const verifiedAt = new Date(`${dateText}T00:00:00.000Z`);
  const ageDays = Math.floor(
    (now.getTime() - verifiedAt.getTime()) / 86_400_000
  );

  if (Number.isNaN(ageDays) || ageDays < 0) {
    findings.push(
      finding({
        code: "DOC_METADATA_DATE",
        file: filePath,
        message: "La fecha de verificación es inválida o está en el futuro."
      })
    );
    return;
  }

  if (ageDays > maxAgeDays) {
    findings.push(
      finding({
        code: "DOC_METADATA_STALE",
        file: filePath,
        message: `La verificación tiene ${ageDays} días y supera el máximo de ${maxAgeDays}.`
      })
    );
  }
}

function validateEncoding(filePath, content, findings) {
  if (content.charCodeAt(0) === 0xfeff) {
    findings.push(
      finding({
        code: "DOC_ENCODING_BOM",
        file: filePath,
        message: "El documento contiene BOM UTF-8."
      })
    );
  }

  content.split(/\r?\n/u).forEach((line, index) => {
    if (MOJIBAKE_PATTERNS.some((pattern) => pattern.test(line))) {
      findings.push(
        finding({
          code: "DOC_ENCODING_MOJIBAKE",
          file: filePath,
          line: index + 1,
          message: "Se detectó una secuencia compatible con mojibake."
        })
      );
    }
  });
}

function validateFences(filePath, content, findings) {
  const lines = content.split(/\r?\n/u);
  let openFenceLine = null;

  lines.forEach((line, index) => {
    if (!/^\s*```/u.test(line)) {
      return;
    }

    if (/\bid\s*=/u.test(line)) {
      findings.push(
        finding({
          code: "DOC_FENCE_ATTRIBUTE",
          file: filePath,
          line: index + 1,
          message: "El fence contiene un atributo residual de edición."
        })
      );
    }

    if (openFenceLine === null) {
      openFenceLine = index + 1;
      return;
    }

    if (/^\s*```\s*$/u.test(line)) {
      openFenceLine = null;
      return;
    }

    findings.push(
      finding({
        code: "DOC_FENCE_NESTED",
        file: filePath,
        line: index + 1,
        message:
          "Se encontró un nuevo fence con lenguaje o atributos antes de cerrar el bloque anterior."
      })
    );
  });

  if (openFenceLine !== null) {
    findings.push(
      finding({
        code: "DOC_FENCE_UNCLOSED",
        file: filePath,
        line: openFenceLine,
        message: "Existe un bloque de código Markdown sin cierre válido."
      })
    );
  }
}

function validateNpmScripts(
  filePath,
  content,
  packageScripts,
  findings
) {
  const commandPattern = /\bnpm\s+run\s+([a-zA-Z0-9_.:-]+)/gu;

  for (const match of content.matchAll(commandPattern)) {
    const scriptName = match[1];
    if (!Object.hasOwn(packageScripts, scriptName)) {
      findings.push(
        finding({
          code: "DOC_NPM_SCRIPT_UNKNOWN",
          file: filePath,
          line: lineNumberAt(content, match.index),
          message: `El script npm "${scriptName}" no existe en package.json.`
        })
      );
    }
  }
}

function normalizeMarkdownTarget(rawTarget) {
  const withoutAngles = rawTarget.trim().replace(/^<|>$/gu, "");
  const target = withoutAngles.includes(" ")
    ? withoutAngles.split(/\s+/u)[0]
    : withoutAngles;

  return target.split("#")[0].split("?")[0];
}

function validateRelativeLinks(filePath, content, findings) {
  const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/gu;

  for (const match of content.matchAll(linkPattern)) {
    const rawTarget = match[1];
    const target = normalizeMarkdownTarget(rawTarget);

    if (
      !target ||
      target.startsWith("#") ||
      target.startsWith("/") ||
      /^[a-z][a-z0-9+.-]*:/iu.test(target)
    ) {
      continue;
    }

    let decodedTarget = target;
    try {
      decodedTarget = decodeURIComponent(target);
    } catch {
      // The existence check below reports malformed or unresolved targets.
    }

    const resolvedTarget = resolve(dirname(filePath), decodedTarget);
    if (!existsSync(resolvedTarget)) {
      findings.push(
        finding({
          code: "DOC_RELATIVE_LINK_BROKEN",
          file: filePath,
          line: lineNumberAt(content, match.index),
          message: `El enlace relativo no resuelve: ${rawTarget}.`
        })
      );
    }
  }
}

export function validateDocument({
  filePath,
  content,
  documentType = "document",
  maxAgeDays,
  now = new Date(),
  packageScripts = {}
}) {
  const findings = [];

  validateEncoding(filePath, content, findings);
  validateFences(filePath, content, findings);
  const metadata = parseMetadata(filePath, content, findings);
  validateFreshness({
    filePath,
    metadata,
    documentType,
    maxAgeDays,
    now,
    findings
  });
  validateNpmScripts(filePath, content, packageScripts, findings);
  validateRelativeLinks(filePath, content, findings);

  return findings;
}

function isAllowedRemoteUrl(rawUrl, allowedOrigins) {
  try {
    const normalizedUrl = rawUrl.startsWith("//")
      ? `https:${rawUrl}`
      : rawUrl;
    const origin = new URL(normalizedUrl).origin;
    return allowedOrigins.includes(origin);
  } catch {
    return false;
  }
}

function collectPatternMatches(content, code, pattern) {
  return [...content.matchAll(pattern)].map((match) => ({
    code,
    index: match.index,
    url: match.at(-1)
  }));
}

function readQuotedAttribute(tag, attribute) {
  const pattern = new RegExp(
    `\\b${attribute}\\s*=\\s*["']([^"']+)["']`,
    "iu"
  );
  return tag.match(pattern);
}

function collectTagAttributeMatches(
  content,
  {
    tagNames,
    attribute,
    code,
    remoteOnly = true,
    allowlistEligible = true
  }
) {
  const tags = tagNames.join("|");
  const tagPattern = new RegExp(`<(?:${tags})\\b[^>]*>`, "giu");
  const matches = [];

  for (const tagMatch of content.matchAll(tagPattern)) {
    const attributeMatch = readQuotedAttribute(tagMatch[0], attribute);
    if (!attributeMatch) {
      continue;
    }

    const value = attributeMatch[1].trim();
    const isRemote = /^(?:https?:)?\/\//iu.test(value);
    if (!value || (remoteOnly && !isRemote)) {
      continue;
    }

    matches.push({
      code,
      index: tagMatch.index + attributeMatch.index,
      url: value,
      allowlistEligible
    });
  }

  return matches;
}

function collectLinkMatches(content) {
  const loadRelations = new Map([
    ["stylesheet", "RUNTIME_REMOTE_LINK_STYLESHEET"],
    ["preload", "RUNTIME_REMOTE_LINK_PRELOAD"],
    ["prefetch", "RUNTIME_REMOTE_LINK_PREFETCH"],
    ["preconnect", "RUNTIME_REMOTE_LINK_PRECONNECT"],
    ["dns-prefetch", "RUNTIME_REMOTE_LINK_DNS_PREFETCH"],
    ["modulepreload", "RUNTIME_REMOTE_LINK_MODULEPRELOAD"]
  ]);
  const matches = [];

  for (const tagMatch of content.matchAll(/<link\b[^>]*>/giu)) {
    const relMatch = readQuotedAttribute(tagMatch[0], "rel");
    const hrefMatch = readQuotedAttribute(tagMatch[0], "href");
    if (!relMatch || !hrefMatch) {
      continue;
    }

    const href = hrefMatch[1].trim();
    if (!/^(?:https?:)?\/\//iu.test(href)) {
      continue;
    }

    const relations = relMatch[1].toLowerCase().split(/\s+/u);
    for (const relation of relations) {
      const code = loadRelations.get(relation);
      if (!code) {
        continue;
      }

      matches.push({
        code,
        index: tagMatch.index + hrefMatch.index,
        url: href
      });
    }
  }

  return matches;
}

function collectSrcsetMatches(content) {
  const matches = [];

  for (const tagMatch of content.matchAll(/<(?:img|source)\b[^>]*>/giu)) {
    const srcsetMatch = readQuotedAttribute(tagMatch[0], "srcset");
    if (!srcsetMatch) {
      continue;
    }

    for (const candidate of srcsetMatch[1].split(",")) {
      const url = candidate.trim().split(/\s+/u)[0];
      if (!/^(?:https?:)?\/\//iu.test(url)) {
        continue;
      }

      matches.push({
        code: "RUNTIME_SRCSET",
        index: tagMatch.index + srcsetMatch.index,
        url
      });
    }
  }

  return matches;
}

function collectXmlHttpRequestMatches(content) {
  const matches = [];
  const declarationPattern =
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*new\s+XMLHttpRequest\s*\(\s*\)/gu;

  for (const declaration of content.matchAll(declarationPattern)) {
    const variableName = declaration[1].replace(
      /[.*+?^${}()|[\]\\]/gu,
      "\\$&"
    );
    const openPattern = new RegExp(
      `\\b${variableName}\\.open\\s*\\(\\s*["'][A-Z]+["']\\s*,\\s*["']((?:https?:)?//[^"']+)["']`,
      "giu"
    );

    for (const openMatch of content.matchAll(openPattern)) {
      matches.push({
        code: "RUNTIME_XML_HTTP_REQUEST",
        index: openMatch.index,
        url: openMatch[1]
      });
    }
  }

  return matches;
}

function collectRuntimeMatches(content) {
  const tagRules = [
    [["script"], "src", "RUNTIME_REMOTE_SCRIPT"],
    [["img"], "src", "RUNTIME_REMOTE_IMAGE"],
    [["source"], "src", "RUNTIME_REMOTE_SOURCE"],
    [["video"], "src", "RUNTIME_REMOTE_VIDEO"],
    [["audio"], "src", "RUNTIME_REMOTE_AUDIO"],
    [["iframe"], "src", "RUNTIME_REMOTE_IFRAME"],
    [["embed"], "src", "RUNTIME_REMOTE_EMBED"],
    [["object"], "data", "RUNTIME_REMOTE_OBJECT"],
    [["track"], "src", "RUNTIME_REMOTE_TRACK"]
  ];
  const matches = tagRules.flatMap(([tagNames, attribute, code]) =>
    collectTagAttributeMatches(content, {
      tagNames,
      attribute,
      code
    })
  );

  matches.push(
    ...collectLinkMatches(content),
    ...collectSrcsetMatches(content),
    ...collectTagAttributeMatches(content, {
      tagNames: ["form"],
      attribute: "action",
      code: "RUNTIME_FORM_ACTION",
      remoteOnly: false,
      allowlistEligible: false
    }),
    ...collectTagAttributeMatches(content, {
      tagNames: ["button", "input"],
      attribute: "formaction",
      code: "RUNTIME_FORMACTION",
      remoteOnly: false,
      allowlistEligible: false
    }),
    ...collectPatternMatches(
      content,
      "RUNTIME_REMOTE_FETCH",
      /\bfetch\s*\(\s*["']((?:https?:)?\/\/[^"']+)["']/giu
    ),
    ...collectPatternMatches(
      content,
      "RUNTIME_REMOTE_IMPORT",
      /\bimport\s*\(\s*["']((?:https?:)?\/\/[^"']+)["']/giu
    ),
    ...collectXmlHttpRequestMatches(content),
    ...collectPatternMatches(
      content,
      "RUNTIME_WEB_SOCKET",
      /\bnew\s+WebSocket\s*\(\s*["']((?:wss?|https?):\/\/[^"']+)["']/giu
    ),
    ...collectPatternMatches(
      content,
      "RUNTIME_EVENT_SOURCE",
      /\bnew\s+EventSource\s*\(\s*["']((?:https?:)?\/\/[^"']+)["']/giu
    ),
    ...collectPatternMatches(
      content,
      "RUNTIME_REMOTE_CSS_URL",
      /\burl\s*\(\s*["']?((?:https?:)?\/\/[^"')\s]+)["']?\s*\)/giu
    ),
    ...collectPatternMatches(
      content,
      "RUNTIME_CSS_IMPORT",
      /@import\s+(?:url\(\s*)?["']((?:https?:)?\/\/[^"']+)["']\s*\)?/giu
    )
  );

  return matches;
}

async function validateRuntimeSource({
  filePath,
  allowedOrigins,
  findings
}) {
  if (!existsSync(filePath)) {
    findings.push(
      finding({
        category: "runtime",
        code: "RUNTIME_FILE_MISSING",
        file: filePath,
        message: "El archivo configurado para inspección runtime no existe."
      })
    );
    return;
  }

  const content = await readFile(filePath, "utf8");
  for (const match of collectRuntimeMatches(content)) {
    if (
      match.allowlistEligible !== false &&
      isAllowedRemoteUrl(match.url, allowedOrigins)
    ) {
      continue;
    }

    findings.push(
      finding({
        category: "runtime",
        code: match.code,
        file: filePath,
        line: lineNumberAt(content, match.index),
        message: `Carga remota en runtime no permitida: ${match.url}.`
      })
    );
  }
}

function validateMetadataContract(config, configPath, findings) {
  if (!config.metadataContract) {
    return;
  }

  const requiredFields = config.metadataContract.requiredFields ?? [];
  const optionalFields = config.metadataContract.optionalFields ?? [];
  const requiredMatches =
    requiredFields.length === REQUIRED_METADATA_FIELDS.length &&
    requiredFields.every(
      (field, index) => field === REQUIRED_METADATA_FIELDS[index]
    );
  const optionalMatches =
    optionalFields.length === OPTIONAL_METADATA_FIELDS.length &&
    optionalFields.every(
      (field, index) => field === OPTIONAL_METADATA_FIELDS[index]
    );

  if (!requiredMatches || !optionalMatches) {
    findings.push(
      finding({
        code: "DOC_METADATA_CONTRACT_INVALID",
        file: configPath,
        message:
          "El contrato debe declarar los seis campos exactos de I-03 y el campo opcional Commit verificado."
      })
    );
  }
}

function resolveFrom(basePath, targetPath) {
  return isAbsolute(targetPath) ? targetPath : resolve(basePath, targetPath);
}

async function collectRuntimeFiles(sourcePath) {
  if (!existsSync(sourcePath)) {
    return [sourcePath];
  }

  const sourceStat = await stat(sourcePath);
  if (sourceStat.isFile()) {
    return [sourcePath];
  }

  if (!sourceStat.isDirectory()) {
    return [];
  }

  const entries = await readdir(sourcePath, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(sourcePath, entry.name);
      if (entry.isDirectory()) {
        return collectRuntimeFiles(entryPath);
      }

      const extensionIndex = entry.name.lastIndexOf(".");
      const extension =
        extensionIndex === -1 ? "" : entry.name.slice(extensionIndex);

      return entry.isFile() && RUNTIME_EXTENSIONS.has(extension)
        ? [entryPath]
        : [];
    })
  );

  return nestedFiles.flat();
}

export async function validateProject({
  configPath,
  now = new Date()
}) {
  const absoluteConfigPath = resolve(configPath);
  const configRoot = dirname(absoluteConfigPath);
  const config = JSON.parse(await readFile(absoluteConfigPath, "utf8"));
  const packageJsonPath = config.packageJson
    ? resolveFrom(configRoot, config.packageJson)
    : resolve("package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
  const packageScripts = packageJson.scripts ?? {};
  const findings = [];

  validateMetadataContract(config, absoluteConfigPath, findings);

  for (const document of config.documents ?? []) {
    const filePath = resolveFrom(configRoot, document.path);

    if (!existsSync(filePath)) {
      findings.push(
        finding({
          code: "DOC_FILE_MISSING",
          file: filePath,
          message: "El documento controlado no existe."
        })
      );
      continue;
    }

    findings.push(
      ...validateDocument({
        filePath,
        content: await readFile(filePath, "utf8"),
        documentType: document.type,
        maxAgeDays: document.maxAgeDays,
        now,
        packageScripts
      })
    );
  }

  const runtimeFiles = [];
  for (const runtimeSource of config.runtimeSources ?? []) {
    runtimeFiles.push(
      ...(await collectRuntimeFiles(resolveFrom(configRoot, runtimeSource)))
    );
  }

  for (const runtimeFile of runtimeFiles) {
    await validateRuntimeSource({
      filePath: runtimeFile,
      allowedOrigins: config.allowedRuntimeOrigins ?? [],
      findings
    });
  }

  return {
    schemaVersion: 1,
    check: "documentation-integrity",
    status: findings.length === 0 ? "passed" : "failed",
    config: absoluteConfigPath,
    checkedDocuments: (config.documents ?? []).length,
    checkedRuntimeSources: runtimeFiles.length,
    warningCount: 0,
    errorCount: findings.length,
    findings,
    generatedAt: now.toISOString()
  };
}

function parseArguments(argv) {
  const options = {
    config: "docs/document-control.json",
    output: "qa-artifacts/documentation/doc-validator.json",
    now: undefined
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--config") {
      options.config = argv[index + 1];
      index += 1;
    } else if (argument === "--output") {
      options.output = argv[index + 1];
      index += 1;
    } else if (argument === "--now") {
      options.now = argv[index + 1];
      index += 1;
    }
  }

  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const now = options.now
    ? new Date(`${options.now}T00:00:00.000Z`)
    : new Date();
  const report = await validateProject({
    configPath: options.config,
    now
  });
  const outputPath = resolve(options.output);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(
    `Documentación: ${report.status}; ${report.errorCount} errores; reporte ${outputPath}`
  );
  process.exitCode = report.status === "passed" ? 0 : 1;
}

const isDirectExecution =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  await main();
}
