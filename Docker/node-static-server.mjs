import { createServer } from "node:http";
import {
  createReadStream,
  existsSync,
  readFileSync,
  statSync
} from "node:fs";
import { createHash } from "node:crypto";
import { createBrotliCompress, createGzip } from "node:zlib";
import { extname, isAbsolute, join, normalize, relative, resolve } from "node:path";

const port = Number(process.env.PORT || 8080);
const rootDir = resolve("dist");

const enableHsts = process.env.ENABLE_HSTS === "true";
const enableUpgradeInsecureRequests = process.env.ENABLE_UPGRADE_INSECURE_REQUESTS === "true";
const enableCoop = process.env.ENABLE_COOP === "true";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".glb": "model/gltf-binary",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function createSha256Source(value) {
  const hash = createHash("sha256").update(value, "utf8").digest("base64");

  return `'sha256-${hash}'`;
}

function extractInlineScriptContents(html) {
  const inlineScripts = [];
  const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;

  for (const match of html.matchAll(scriptPattern)) {
    const attributes = match[1] || "";
    const content = match[2] || "";

    if (/\bsrc\s*=/i.test(attributes)) {
      continue;
    }

    if (content.length === 0) {
      continue;
    }

    inlineScripts.push(content);
  }

  return inlineScripts;
}

function extractInlineStyleContents(html) {
  const inlineStyles = [];
  const stylePattern = /<style\b([^>]*)>([\s\S]*?)<\/style>/gi;

  for (const match of html.matchAll(stylePattern)) {
    const content = match[2] || "";

    if (content.length === 0) {
      continue;
    }

    inlineStyles.push(content);
  }

  return inlineStyles;
}

function createCspHeader(html = "") {
  const scriptHashes = extractInlineScriptContents(html).map(createSha256Source);
  const styleHashes = extractInlineStyleContents(html).map(createSha256Source);

  const cspDirectives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self' mailto:",
    ["script-src", "'self'", ...scriptHashes].join(" "),
    "script-src-attr 'none'",
    ["style-src", "'self'", ...styleHashes].join(" "),
    "style-src-attr 'none'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' blob:",
    "manifest-src 'self'",
    "media-src 'self' blob:",
    "worker-src 'self' blob:"
  ];

  if (enableUpgradeInsecureRequests) {
    cspDirectives.push("upgrade-insecure-requests");
  }

  return cspDirectives.join("; ");
}

function setSecurityHeaders(response, html = "") {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("X-DNS-Prefetch-Control", "off");
  response.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  if (enableCoop) {
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  }

  response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  response.setHeader("Origin-Agent-Cluster", "?1");
  response.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=()"
  );

  if (enableHsts) {
    response.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  response.setHeader("Content-Security-Policy", createCspHeader(html));
}

function isInsideRoot(filePath) {
  const relation = relative(rootDir, filePath);

  return relation === "" || (!relation.startsWith("..") && !isAbsolute(relation));
}

function safeStat(filePath) {
  try {
    return statSync(filePath);
  } catch {
    return null;
  }
}

function isAssetPath(pathname) {
  return /\.(css|js|mjs|json|svg|png|jpg|jpeg|webp|avif|ico|glb|txt)$/i.test(pathname);
}

function isXmlPath(pathname) {
  return /\.xml$/i.test(pathname);
}

function acceptsEncoding(request, encoding) {
  const header = request.headers["accept-encoding"];

  if (typeof header !== "string") {
    return false;
  }

  return header
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .some((value) => value === encoding || value.startsWith(`${encoding};`));
}

function shouldCompressContent(contentType, statusCode) {
  if (statusCode !== 200) {
    return false;
  }

  return (
    contentType.startsWith("text/html") ||
    contentType.startsWith("text/css") ||
    contentType.startsWith("application/javascript") ||
    contentType.startsWith("application/json") ||
    contentType.startsWith("application/xml") ||
    contentType.startsWith("text/plain")
  );
}

function chooseCompression(request, contentType, statusCode) {
  if (!shouldCompressContent(contentType, statusCode)) {
    return null;
  }

  if (acceptsEncoding(request, "br")) {
    return "br";
  }

  if (acceptsEncoding(request, "gzip")) {
    return "gzip";
  }

  return null;
}

function getCacheControl(pathname, statusCode) {
  if (statusCode !== 200) {
    return "no-cache";
  }

  if (pathname === "/health") {
    return "no-store";
  }

  if (pathname.endsWith(".xml") || pathname.endsWith("robots.txt")) {
    return "public, max-age=3600";
  }

  if (pathname.startsWith("/_astro/") || isAssetPath(pathname)) {
    return "public, max-age=31536000, immutable";
  }

  return "no-cache";
}

function buildWeakEtag(stats) {
  return `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
}

function shouldReturnNotModified(request, stats) {
  const etag = buildWeakEtag(stats);
  const ifNoneMatch = request.headers["if-none-match"];
  const ifModifiedSince = request.headers["if-modified-since"];

  if (typeof ifNoneMatch === "string" && ifNoneMatch.split(",").map((value) => value.trim()).includes(etag)) {
    return true;
  }

  if (typeof ifModifiedSince === "string") {
    const since = Date.parse(ifModifiedSince);

    if (!Number.isNaN(since) && stats.mtime.getTime() <= since) {
      return true;
    }
  }

  return false;
}

function parseRequestUrl(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${port}`);

  if (url.pathname.includes("\0")) {
    return null;
  }

  const decodedPath = decodeURIComponent(url.pathname).replaceAll("\\", "/");
  const safePath = normalize(decodedPath).replace(/^[/\\]+/, "");

  return { url, decodedPath, safePath };
}

function resolveRequestPath(requestUrl) {
  const parsed = parseRequestUrl(requestUrl);

  if (!parsed) {
    return null;
  }

  const { url, safePath } = parsed;

  let filePath = resolve(join(rootDir, safePath));
  let statusCode = 200;

  if (!isInsideRoot(filePath)) {
    return null;
  }

  const initialStats = safeStat(filePath);

  if (initialStats?.isDirectory()) {
    if (!url.pathname.endsWith("/")) {
      const redirectUrl = `${url.pathname}/${url.search}`;
      return { redirectUrl, statusCode: 308 };
    }

    filePath = resolve(join(filePath, "index.html"));
  }

  if (!existsSync(filePath) && !isAssetPath(safePath) && !isXmlPath(safePath)) {
    filePath = resolve(join(rootDir, safePath, "index.html"));
  }

  if (!existsSync(filePath)) {
    statusCode = 404;
    filePath = resolve(join(rootDir, "404.html"));
  }

  if (!existsSync(filePath) || !isInsideRoot(filePath)) {
    return null;
  }

  return { filePath, statusCode };
}

function sendPlainText(response, statusCode, message) {
  setSecurityHeaders(response);

  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  response.end(message);
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);

  setSecurityHeaders(response);

  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body)
  });

  response.end(body);
}

const server = createServer((request, response) => {
  if (!request.url) {
    sendPlainText(response, 400, "Bad request");
    return;
  }

  if (!request.method || !["GET", "HEAD"].includes(request.method)) {
    response.setHeader("Allow", "GET, HEAD");
    sendPlainText(response, 405, "Method not allowed");
    return;
  }

  if (request.url === "/health") {
    if (request.method === "HEAD") {
      setSecurityHeaders(response);

      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      });

      response.end();
      return;
    }

    sendJson(response, 200, { status: "ok" });
    return;
  }

  let resolvedPath;

  try {
    resolvedPath = resolveRequestPath(request.url);
  } catch {
    sendPlainText(response, 400, "Bad request");
    return;
  }

  if (!resolvedPath) {
    sendPlainText(response, 404, "Not found");
    return;
  }

  if ("redirectUrl" in resolvedPath) {
    setSecurityHeaders(response);

    response.writeHead(resolvedPath.statusCode, {
      Location: resolvedPath.redirectUrl,
      "Cache-Control": "no-cache"
    });

    response.end();
    return;
  }

  const { filePath, statusCode } = resolvedPath;
  const extension = extname(filePath);
  const contentType = mimeTypes[extension] || "application/octet-stream";
  const stats = statSync(filePath);
  const compression = chooseCompression(request, contentType, statusCode);
  const etag = buildWeakEtag(stats);
  const lastModified = stats.mtime.toUTCString();
  const pathname = new URL(request.url, `http://localhost:${port}`).pathname;
  const isHtml = contentType.startsWith("text/html");

  let html = "";
  let htmlBuffer = null;

  if (isHtml) {
    html = readFileSync(filePath, "utf8");
    htmlBuffer = Buffer.from(html, "utf8");
  }

  setSecurityHeaders(response, html);

  response.setHeader("Cache-Control", getCacheControl(pathname, statusCode));
  response.setHeader("Vary", "Accept-Encoding");
  response.setHeader("ETag", etag);
  response.setHeader("Last-Modified", lastModified);

  if (statusCode === 200 && shouldReturnNotModified(request, stats)) {
    response.writeHead(304);
    response.end();
    return;
  }

  const responseHeaders = {
    "Content-Type": contentType
  };

  if (compression) {
    responseHeaders["Content-Encoding"] = compression;
  } else {
    responseHeaders["Content-Length"] = htmlBuffer ? htmlBuffer.length : stats.size;
  }

  response.writeHead(statusCode, responseHeaders);

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  if (htmlBuffer) {
    if (compression === "br") {
      createBrotliCompress().end(htmlBuffer).pipe(response);
      return;
    }

    if (compression === "gzip") {
      createGzip().end(htmlBuffer).pipe(response);
      return;
    }

    response.end(htmlBuffer);
    return;
  }

  const stream = createReadStream(filePath).on("error", () => {
    if (!response.headersSent) {
      sendPlainText(response, 500, "Internal server error");
      return;
    }

    response.destroy();
  });

  if (compression === "br") {
    stream.pipe(createBrotliCompress()).pipe(response);
    return;
  }

  if (compression === "gzip") {
    stream.pipe(createGzip()).pipe(response);
    return;
  }

  stream.pipe(response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`IoCode SOLUTIONS static server running on http://0.0.0.0:${port}`);
});
