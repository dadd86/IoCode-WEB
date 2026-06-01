import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, isAbsolute, join, normalize, relative, resolve } from "node:path";

const port = Number(process.env.PORT || 8080);
const rootDir = resolve("dist");

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
  ".ico": "image/x-icon",
  ".glb": "model/gltf-binary",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function setSecurityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "model-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' mailto:"
    ].join("; ")
  );
}

function isAssetPath(pathname) {
  return /\.(css|js|mjs|json|svg|png|jpg|jpeg|webp|ico|glb|xml|txt)$/i.test(pathname);
}

function isInsideRoot(filePath) {
  const relation = relative(rootDir, filePath);

  return relation === "" || (!relation.startsWith("..") && !isAbsolute(relation));
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${port}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const safePath = normalize(decodedPath).replace(/^[/\\]+/, "");

  let filePath = resolve(join(rootDir, safePath));

  if (!isInsideRoot(filePath)) {
    return null;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = resolve(join(filePath, "index.html"));
  }

  if (!existsSync(filePath) && !isAssetPath(safePath)) {
    filePath = resolve(join(rootDir, safePath, "index.html"));
  }

  if (!existsSync(filePath)) {
    filePath = resolve(join(rootDir, "404.html"));
  }

  if (!existsSync(filePath) || !isInsideRoot(filePath)) {
    return null;
  }

  return filePath;
}

const server = createServer((request, response) => {
  setSecurityHeaders(response);

  if (request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }

  const filePath = resolveRequestPath(request.url || "/");

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = extname(filePath);
  const contentType = mimeTypes[extension] || "application/octet-stream";

  if (isAssetPath(filePath)) {
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    response.setHeader("Cache-Control", "no-cache");
  }

  response.writeHead(200, { "Content-Type": contentType });
  createReadStream(filePath).pipe(response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`IoCode SOLUTIONS static server running on http://0.0.0.0:${port}`);
});