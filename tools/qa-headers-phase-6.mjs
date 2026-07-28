import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Propósito:
 * Validar que el contenedor web entregue HTML, JavaScript, CSS, imágenes y GLB
 * con estado HTTP, MIME, caché, compresión e integridad adecuados para Fase 6.
 *
 * Tipos de datos:
 * - string: rutas, URLs y valores de cabeceras.
 * - Buffer: cuerpo binario del GLB.
 * - HeaderCheck: contrato de una comprobación HTTP.
 * - HeaderResult: resultado serializable de una comprobación.
 *
 * Parámetros de entorno:
 * - PERFORMANCE_BASE_URL: origen HTTP que debe validarse.
 *
 * Retorno:
 * El módulo no retorna datos al llamador. Escribe
 * qa-artifacts/performance/phase-6/headers-report.json y termina con código 1
 * cuando existe al menos un error bloqueante.
 *
 * Notas de contexto:
 * La fuente de verdad es el HTML servido por el contenedor web. No se utilizan
 * hashes de un dist local para localizar CSS, JS o GLB, evitando comparar dos
 * builds Docker distintos.
 */

const artifactRoot = "qa-artifacts/performance/phase-6";
const baseURL =
  process.env.PERFORMANCE_BASE_URL ??
  "http://web:8080";
const deploymentEntryPath = "/es/";
const errors = [];

/**
 * @typedef {object} HeaderCheck
 * @property {string} path
 * @property {string} kind
 * @property {string} expectedContentType
 * @property {string} cachePolicy
 * @property {boolean} [requireFingerprint]
 * @property {boolean} [requireCompression]
 * @property {boolean} [requireVersionQuery]
 */

/**
 * @typedef {HeaderCheck & {
 *   status: number,
 *   contentType: string | null,
 *   cacheControl: string | null,
 *   contentEncoding: string | null,
 *   etag: string | null,
 *   vary: string | null,
 *   integrity?: {
 *     status: number,
 *     bytes: number,
 *     sha256: string,
 *     expectedCacheVersion: string,
 *     actualCacheVersion: string | null,
 *     cacheVersionMatches: boolean
 *   }
 * }} HeaderResult
 */

/**
 * Propósito:
 * Escribir un artefacto JSON reproducible de QA.
 *
 * Tipos de datos:
 * - name: string.
 * - payload: valor serializable como JSON.
 *
 * Parámetros:
 * - name: nombre del archivo de salida.
 * - payload: objeto que se guardará.
 *
 * Retorno:
 * void.
 */
function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, {
    recursive: true
  });

  writeFileSync(
    join(artifactRoot, name),
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8"
  );
}

/**
 * Propósito:
 * Calcular el hash SHA-256 de contenido textual o binario.
 *
 * Tipos de datos:
 * - Entrada: string o Buffer.
 * - Salida: string hexadecimal.
 *
 * Parámetros:
 * - value: contenido que se debe procesar.
 *
 * Retorno:
 * Hash hexadecimal SHA-256.
 */
function sha256(value) {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

/**
 * Propósito:
 * Decodificar las entidades HTML más habituales presentes en atributos.
 *
 * Tipos de datos:
 * - Entrada: string o null.
 * - Salida: string o null.
 *
 * Parámetros:
 * - value: valor capturado de un atributo HTML.
 *
 * Retorno:
 * Cadena decodificada o null.
 */
function decodeHtmlAttribute(value) {
  if (!value) {
    return null;
  }

  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'");
}

/**
 * Propósito:
 * Extraer desde el HTML desplegado las referencias reales a CSS, JavaScript,
 * GLB y AVIF.
 *
 * Tipos de datos:
 * - Entrada: string HTML.
 * - Salida: objeto de referencias.
 *
 * Parámetros:
 * - html: documento HTML servido por el contenedor web.
 *
 * Retorno:
 * Objeto con las rutas encontradas o null cuando una referencia no existe.
 *
 * Notas de contexto:
 * La función analiza el HTML HTTP real y evita usar un dist local que podría
 * corresponder a otra compilación Astro.
 */
function extractDeploymentReferences(html) {
  const js =
    html.match(
      /<script[^>]+src="([^"]+\.js(?:\?[^"]*)?)"[^>]*>/i
    )?.[1] ??
    null;

  const css =
    html.match(
      /<link[^>]+href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/i
    )?.[1] ??
    null;

  const glb =
    html.match(
      /data-model-url="([^"]+\.glb(?:\?[^"]*)?)"/i
    )?.[1] ??
    null;

  const avif =
    html.match(
      /(?:src|srcset)="([^"]+\.avif(?:\?[^",\s]*)?)/i
    )?.[1] ??
    null;

  return {
    js: decodeHtmlAttribute(js),
    css: decodeHtmlAttribute(css),
    glb: decodeHtmlAttribute(glb),
    avif: decodeHtmlAttribute(avif)
  };
}

/**
 * Propósito:
 * Leer la portada desplegada y convertirla en la fuente de verdad de assets.
 *
 * Tipos de datos:
 * - Response HTTP.
 * - string HTML.
 * - objeto de cabeceras.
 *
 * Parámetros:
 * No recibe parámetros.
 *
 * Retorno:
 * Promise con URL, status, cabeceras, hash HTML y referencias detectadas.
 */
async function readDeployedPage() {
  const entryURL = new URL(
    deploymentEntryPath,
    baseURL
  );

  const response = await fetch(
    entryURL,
    {
      method: "GET",
      headers: {
        "Accept-Encoding": "br, gzip",
        "Cache-Control": "no-cache"
      }
    }
  );

  const html = await response.text();

  const headers = Object.fromEntries(
    response.headers.entries()
  );

  const references =
    extractDeploymentReferences(html);

  if (!response.ok) {
    errors.push(
      `${deploymentEntryPath}: status ${response.status}; no se pudo inspeccionar el despliegue.`
    );
  }

  if (
    !String(
      headers["content-type"] ?? ""
    ).includes("text/html")
  ) {
    errors.push(
      `${deploymentEntryPath}: Content-Type ${
        headers["content-type"] ??
        "ausente"
      }; se esperaba text/html.`
    );
  }

  if (!references.js) {
    errors.push(
      `${deploymentEntryPath}: el HTML desplegado no contiene un script JavaScript inicial.`
    );
  }

  if (!references.css) {
    errors.push(
      `${deploymentEntryPath}: el HTML desplegado no contiene una hoja CSS.`
    );
  }

  if (!references.glb) {
    errors.push(
      `${deploymentEntryPath}: el HTML desplegado no contiene data-model-url para el GLB.`
    );
  }

  return {
    url: entryURL.toString(),
    status: response.status,
    headers,
    htmlSha256: sha256(html),
    references
  };
}

/**
 * Propósito:
 * Validar una respuesta HEAD contra el contrato HTTP del recurso.
 *
 * Tipos de datos:
 * - HeaderCheck: definición de entrada.
 * - HeaderResult: resultado de salida.
 *
 * Parámetros:
 * - check: definición de la comprobación.
 *
 * Retorno:
 * Promise<HeaderResult>.
 */
async function validateHead(check) {
  const targetURL = new URL(
    check.path,
    baseURL
  );

  const response = await fetch(
    targetURL,
    {
      method: "HEAD",
      headers: {
        "Accept-Encoding": "br, gzip"
      }
    }
  );

  const headers = Object.fromEntries(
    response.headers.entries()
  );

  const result = {
    ...check,
    status: response.status,
    contentType:
      headers["content-type"] ??
      null,
    cacheControl:
      headers["cache-control"] ??
      null,
    contentEncoding:
      headers["content-encoding"] ??
      null,
    etag:
      headers.etag ??
      null,
    vary:
      headers.vary ??
      null
  };

  if (!response.ok) {
    errors.push(
      `${check.path}: status ${response.status}.`
    );
  }

  if (
    !String(
      result.contentType ?? ""
    ).includes(
      check.expectedContentType
    )
  ) {
    errors.push(
      `${check.path}: Content-Type ${
        result.contentType ??
        "ausente"
      }; se esperaba ${
        check.expectedContentType
      }.`
    );
  }

  if (
    !String(
      result.cacheControl ?? ""
    ).includes(
      check.cachePolicy
    )
  ) {
    errors.push(
      `${check.path}: Cache-Control ${
        result.cacheControl ??
        "ausente"
      }; debe incluir ${
        check.cachePolicy
      }.`
    );
  }

  if (!result.etag) {
    errors.push(
      `${check.path}: falta ETag.`
    );
  }

  if (
    !String(
      result.vary ?? ""
    ).includes(
      "Accept-Encoding"
    )
  ) {
    errors.push(
      `${check.path}: Vary debe incluir Accept-Encoding.`
    );
  }

  if (
    check.requireFingerprint &&
    !/[._-][A-Za-z0-9_-]{8,}\.(?:js|css)$/.test(
      targetURL.pathname
    )
  ) {
    errors.push(
      `${check.path}: el asset JS/CSS no tiene fingerprint de build.`
    );
  }

  if (
    check.requireCompression &&
    !["br", "gzip"].includes(
      result.contentEncoding ??
      ""
    )
  ) {
    errors.push(
      `${check.path}: no se entregó con Brotli o gzip.`
    );
  }

  if (
    check.requireVersionQuery &&
    !targetURL.searchParams.has("v")
  ) {
    errors.push(
      `${check.path}: el GLB debe llevar una versión de caché explícita.`
    );
  }

  return result;
}

/**
 * Propósito:
 * Validar el cuerpo binario y la versión de caché del GLB desplegado.
 *
 * Tipos de datos:
 * - glbPath: string o null.
 * - results: HeaderResult[].
 * - body: Buffer.
 *
 * Parámetros:
 * - glbPath: ruta del modelo obtenida desde el HTML HTTP.
 * - results: resultados de cabeceras donde se anexará la integridad.
 *
 * Retorno:
 * Promise<void>.
 *
 * Notas de contexto:
 * La versión `v` debe coincidir con los primeros 12 caracteres del SHA-256
 * del mismo cuerpo binario que recibe el navegador.
 */
async function validateDeployedGlb(
  glbPath,
  results
) {
  if (!glbPath) {
    return;
  }

  const glbURL = new URL(
    glbPath,
    baseURL
  );

  const response = await fetch(
    glbURL,
    {
      headers: {
        "Accept-Encoding": "identity",
        "Cache-Control": "no-cache"
      }
    }
  );

  const body = Buffer.from(
    await response.arrayBuffer()
  );

  const actualSha256 =
    sha256(body);

  const expectedCacheVersion =
    actualSha256.slice(0, 12);

  const actualCacheVersion =
    glbURL.searchParams.get("v");

  const integrity = {
    status: response.status,
    bytes: body.length,
    sha256: actualSha256,
    expectedCacheVersion,
    actualCacheVersion,
    cacheVersionMatches:
      actualCacheVersion ===
      expectedCacheVersion
  };

  const glbResult =
    results.find(
      (result) =>
        result.kind === "glb"
    );

  if (glbResult) {
    glbResult.integrity =
      integrity;
  }

  if (!response.ok) {
    errors.push(
      `${glbPath}: GET devolvió status ${response.status}.`
    );
  }

  if (body.length === 0) {
    errors.push(
      `${glbPath}: el cuerpo GLB desplegado está vacío.`
    );
  }

  if (
    !integrity.cacheVersionMatches
  ) {
    errors.push(
      `${glbPath}: la versión de caché debe ser ${expectedCacheVersion}, derivada del SHA-256 del GLB desplegado.`
    );
  }
}

const deployedPage =
  await readDeployedPage();

const deploymentReferences =
  deployedPage.references;

/** @type {HeaderCheck[]} */
const checks = [
  ...[
    "/es/",
    "/en/",
    "/de/",
    "/es/servicios/",
    "/es/contacto/"
  ].map((path) => ({
    path,
    kind: "html",
    expectedContentType:
      "text/html",
    cachePolicy:
      "no-cache"
  })),

  {
    path:
      "/logo/iocode-logo.png",
    kind:
      "png",
    expectedContentType:
      "image/png",
    cachePolicy:
      "public"
  },

  {
    path:
      "/logo/iocode-logo-512.webp",
    kind:
      "webp",
    expectedContentType:
      "image/webp",
    cachePolicy:
      "public"
  },

  ...(deploymentReferences.js
    ? [
        {
          path:
            deploymentReferences.js,
          kind:
            "js",
          expectedContentType:
            "application/javascript",
          cachePolicy:
            "immutable",
          requireFingerprint:
            true,
          requireCompression:
            true
        }
      ]
    : []),

  ...(deploymentReferences.css
    ? [
        {
          path:
            deploymentReferences.css,
          kind:
            "css",
          expectedContentType:
            "text/css",
          cachePolicy:
            "immutable",
          requireFingerprint:
            true,
          requireCompression:
            true
        }
      ]
    : []),

  ...(deploymentReferences.glb
    ? [
        {
          path:
            deploymentReferences.glb,
          kind:
            "glb",
          expectedContentType:
            "model/gltf-binary",
          cachePolicy:
            "immutable",
          requireVersionQuery:
            true
        }
      ]
    : []),

  ...(deploymentReferences.avif
    ? [
        {
          path:
            deploymentReferences.avif,
          kind:
            "avif",
          expectedContentType:
            "image/avif",
          cachePolicy:
            "public"
        }
      ]
    : [])
];

/** @type {HeaderResult[]} */
const results = [];

for (const check of checks) {
  results.push(
    await validateHead(check)
  );
}

await validateDeployedGlb(
  deploymentReferences.glb,
  results
);

writeArtifact(
  "headers-report.json",
  {
    phase: "6",
    check: "headers",
    status:
      errors.length === 0
        ? "passed"
        : "failed",
    baseURL,
    deploymentEntryPath,
    deployedPage: {
      url:
        deployedPage.url,
      status:
        deployedPage.status,
      headers:
        deployedPage.headers,
      htmlSha256:
        deployedPage.htmlSha256
    },
    deploymentReferences,
    results,
    warningCount: 0,
    errorCount:
      errors.length,
    warnings: [],
    errors,
    generatedAt:
      new Date().toISOString()
  }
);

if (errors.length > 0) {
  console.error(
    "Errores headers Fase 6:"
  );

  for (const error of errors) {
    console.error(
      `- ${error}`
    );
  }

  process.exit(1);
}

console.log(
  "Headers Fase 6 validados contra el HTML y los assets del despliegue web real."
);