import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync
} from "node:fs";
import { createHash } from "node:crypto";
import { extname, join, relative } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const baseURL = process.env.PERFORMANCE_BASE_URL || "http://web:8080";
const errors = [];

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });
  writeFileSync(join(artifactRoot, name), JSON.stringify(payload, null, 2), "utf8");
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function walk(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return walk(path);
    }

    return entry.isFile() ? [path] : [];
  });
}

function readDeploymentReferences() {
  const htmlPath = "dist/es/index.html";

  if (!existsSync(htmlPath)) {
    errors.push(`${htmlPath}: no existe; ejecuta npm run build antes de validar headers.`);
    return {
      js: null,
      css: null,
      glb: null
    };
  }

  const html = readFileSync(htmlPath, "utf8");
  const js = html.match(/<script[^>]+src="([^"]+\.js(?:\?[^"]*)?)"[^>]*>/)?.[1] ?? null;
  const css = html.match(/<link[^>]+href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/)?.[1] ?? null;
  const glb = html.match(/data-model-url="([^"]+\.glb(?:\?[^"]*)?)"/)?.[1] ?? null;

  if (!js) {
    errors.push(`${htmlPath}: no se encontró un script JS inicial.`);
  }

  if (!css) {
    errors.push(`${htmlPath}: no se encontró una hoja CSS desplegada.`);
  }

  if (!glb) {
    errors.push(`${htmlPath}: no se encontró data-model-url para el GLB.`);
  }

  return {
    js,
    css,
    glb: glb?.replaceAll("&amp;", "&") ?? null
  };
}

const deploymentReferences = readDeploymentReferences();
const avifPath = walk("dist")
  .find((path) => extname(path).toLowerCase() === ".avif");

const checks = [
  ...["/es/", "/en/", "/de/", "/es/servicios/", "/es/contacto/"].map(
    (path) => ({
      path,
      kind: "html",
      expectedContentType: "text/html",
      cachePolicy: "no-cache"
    })
  ),
  {
    path: "/logo/iocode-logo.png",
    kind: "png",
    expectedContentType: "image/png",
    cachePolicy: "public"
  },
  {
    path: "/logo/iocode-logo-512.webp",
    kind: "webp",
    expectedContentType: "image/webp",
    cachePolicy: "public"
  },
  ...(deploymentReferences.js
    ? [
        {
          path: deploymentReferences.js,
          kind: "js",
          expectedContentType: "application/javascript",
          cachePolicy: "immutable",
          requireFingerprint: true,
          requireCompression: true
        }
      ]
    : []),
  ...(deploymentReferences.css
    ? [
        {
          path: deploymentReferences.css,
          kind: "css",
          expectedContentType: "text/css",
          cachePolicy: "immutable",
          requireFingerprint: true,
          requireCompression: true
        }
      ]
    : []),
  ...(deploymentReferences.glb
    ? [
        {
          path: deploymentReferences.glb,
          kind: "glb",
          expectedContentType: "model/gltf-binary",
          cachePolicy: "immutable",
          requireVersionQuery: true
        }
      ]
    : []),
  ...(avifPath
    ? [
        {
          path: `/${relative("dist", avifPath).replaceAll("\\", "/")}`,
          kind: "avif",
          expectedContentType: "image/avif",
          cachePolicy: "public"
        }
      ]
    : [])
];

const results = [];

for (const check of checks) {
  const response = await fetch(new URL(check.path, baseURL), {
    method: "HEAD",
    headers: {
      "Accept-Encoding": "br, gzip"
    }
  });

  const headers = Object.fromEntries(response.headers.entries());
  const pathname = new URL(check.path, baseURL).pathname;
  const result = {
    ...check,
    status: response.status,
    contentType: headers["content-type"] ?? null,
    cacheControl: headers["cache-control"] ?? null,
    contentEncoding: headers["content-encoding"] ?? null,
    etag: headers.etag ?? null,
    vary: headers.vary ?? null
  };

  results.push(result);

  if (!response.ok) {
    errors.push(`${check.path}: status ${response.status}.`);
  }

  if (!String(result.contentType).includes(check.expectedContentType)) {
    errors.push(
      `${check.path}: Content-Type ${result.contentType}; se esperaba ${check.expectedContentType}.`
    );
  }

  if (!String(result.cacheControl).includes(check.cachePolicy)) {
    errors.push(
      `${check.path}: Cache-Control ${result.cacheControl}; debe incluir ${check.cachePolicy}.`
    );
  }

  if (!result.etag) {
    errors.push(`${check.path}: falta ETag.`);
  }

  if (!String(result.vary).includes("Accept-Encoding")) {
    errors.push(`${check.path}: Vary debe incluir Accept-Encoding.`);
  }

  if (
    check.requireFingerprint &&
    !/[._-][A-Za-z0-9_-]{8,}\.(?:js|css)$/.test(pathname)
  ) {
    errors.push(`${check.path}: el asset JS/CSS no tiene fingerprint de build.`);
  }

  if (
    check.requireCompression &&
    !["br", "gzip"].includes(result.contentEncoding)
  ) {
    errors.push(`${check.path}: no se entregó con Brotli o gzip.`);
  }

  if (check.requireVersionQuery && !new URL(check.path, baseURL).searchParams.has("v")) {
    errors.push(`${check.path}: el GLB debe llevar una versión de caché explícita.`);
  }
}

if (deploymentReferences.glb) {
  const glbURL = new URL(deploymentReferences.glb, baseURL);
  const deployedPath = join(
    "dist",
    decodeURIComponent(glbURL.pathname).replace(/^\/+/, "")
  );
  const glbResult = results.find((result) => result.kind === "glb");

  if (!existsSync(deployedPath)) {
    errors.push(`${deployedPath}: no existe para comparar integridad HTTP.`);
  } else {
    const expectedBody = readFileSync(deployedPath);
    const response = await fetch(glbURL, {
      headers: {
        "Accept-Encoding": "identity"
      }
    });
    const actualBody = Buffer.from(await response.arrayBuffer());
    const expectedSha256 = sha256(expectedBody);
    const actualSha256 = sha256(actualBody);
    const expectedCacheVersion = expectedSha256.slice(0, 12);
    const actualCacheVersion = glbURL.searchParams.get("v");
    const integrity = {
      expectedBytes: expectedBody.length,
      actualBytes: actualBody.length,
      expectedSha256,
      actualSha256,
      expectedCacheVersion,
      actualCacheVersion,
      matchesDist:
        expectedBody.length === actualBody.length &&
        expectedSha256 === actualSha256,
      cacheVersionMatches: actualCacheVersion === expectedCacheVersion
    };

    if (glbResult) {
      glbResult.integrity = integrity;
    }

    if (!response.ok) {
      errors.push(`${deploymentReferences.glb}: GET devolvió status ${response.status}.`);
    }

    if (!integrity.matchesDist) {
      errors.push(
        `${deploymentReferences.glb}: el cuerpo HTTP no coincide con ${deployedPath}; ` +
        `SHA-256 esperado ${integrity.expectedSha256}, recibido ${integrity.actualSha256}.`
      );
    }

    if (!integrity.cacheVersionMatches) {
      errors.push(
        `${deploymentReferences.glb}: la versión de caché debe ser ` +
        `${integrity.expectedCacheVersion}, derivada del SHA-256 del GLB.`
      );
    }
  }
}

writeArtifact("headers-report.json", {
  phase: "6",
  check: "headers",
  status: errors.length === 0 ? "passed" : "failed",
  baseURL,
  deploymentReferences,
  results,
  warningCount: 0,
  errorCount: errors.length,
  warnings: [],
  errors,
  generatedAt: new Date().toISOString()
});

if (errors.length > 0) {
  console.error("Errores headers Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Headers Fase 6 validados para HTML, JS, CSS, PNG, WebP, GLB y AVIF si existe.");
