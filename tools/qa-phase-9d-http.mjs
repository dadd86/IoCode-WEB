import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const artifactRoot = "qa-artifacts/phase-9d";
const configuredBaseUrl = process.env.QA_BASE_URL;
const baseUrl = configuredBaseUrl || "http://127.0.0.1:8080";
const expectExternal = process.env.QA_EXPECT_EXTERNAL === "true";
const canonicalOrigin = "https://iocode-solutions.com";
const errors = [];
const checks = [];
let server = null;

function record(name, passed, evidence) {
  checks.push({ name, passed, evidence });
  if (!passed) errors.push(`${name}: ${evidence}`);
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // El proceso puede seguir arrancando.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }
  throw new Error(`El servidor no respondió en ${baseUrl}.`);
}

async function request(path, options = {}) {
  return fetch(new URL(path, baseUrl), {
    redirect: "manual",
    ...options
  });
}

try {
  if (!configuredBaseUrl) {
    server = spawn(process.execPath, [resolve("Docker/node-static-server.mjs")], {
      env: { ...process.env, PORT: "8080" },
      stdio: "inherit"
    });
  }

  await waitForServer();

  const home = await request("/es/", {
    headers: { "Accept-Encoding": "br, gzip" }
  });
  const homeHtml = await home.text();
  const csp = home.headers.get("content-security-policy") || "";

  record("home-status", home.status === 200, `status=${home.status}`);
  record(
    "html-compression",
    ["br", "gzip"].includes(home.headers.get("content-encoding") || ""),
    `content-encoding=${home.headers.get("content-encoding")}`
  );
  record(
    "csp",
    csp.includes("default-src 'self'") &&
      csp.includes("object-src 'none'") &&
      csp.includes("frame-ancestors 'none'"),
    csp
  );
  record(
    "nosniff",
    home.headers.get("x-content-type-options") === "nosniff",
    `x-content-type-options=${home.headers.get("x-content-type-options")}`
  );

  const scriptPath = homeHtml.match(/<script[^>]+src="([^"]+\.js)"/u)?.[1];
  const cssPath = homeHtml.match(/<link[^>]+href="([^"]+\.css)"/u)?.[1];
  const glbPath = homeHtml.match(/data-model-url="([^"]+\.glb\?v=[a-f0-9]+)"/u)?.[1];

  for (const asset of [
    { name: "javascript-mime", path: scriptPath, mime: "application/javascript" },
    { name: "css-mime", path: cssPath, mime: "text/css" },
    { name: "glb-mime", path: glbPath, mime: "model/gltf-binary" }
  ]) {
    if (!asset.path) {
      record(asset.name, false, "referencia no encontrada en HTML");
      continue;
    }
    const response = await request(asset.path);
    record(
      asset.name,
      response.status === 200 &&
        (response.headers.get("content-type") || "").includes(asset.mime),
      `status=${response.status} content-type=${response.headers.get("content-type")}`
    );
  }

  const sitemapIndex = await request("/sitemap-index.xml", {
    headers: { "Accept-Encoding": "gzip" }
  });
  const sitemapText = await sitemapIndex.text();
  record(
    "sitemap-index",
    sitemapIndex.status === 200 &&
      (sitemapIndex.headers.get("content-type") || "").includes("application/xml") &&
      sitemapText.includes(`${canonicalOrigin}/sitemap.xml`),
    `status=${sitemapIndex.status} content-type=${sitemapIndex.headers.get("content-type")}`
  );

  const alias = await request("/es/impressum/");
  record(
    "impressum-redirect",
    alias.status === 308 && alias.headers.get("location") === "/es/aviso-legal/",
    `status=${alias.status} location=${alias.headers.get("location")}`
  );

  if (expectExternal) {
    record(
      "external-https-origin",
      new URL(baseUrl).protocol === "https:",
      `baseUrl=${baseUrl}`
    );
    record(
      "hsts",
      (home.headers.get("strict-transport-security") || "").includes("max-age=31536000"),
      `strict-transport-security=${home.headers.get("strict-transport-security")}`
    );

    const httpRedirect = await fetch("http://iocode-solutions.com/es/", {
      redirect: "manual"
    });
    record(
      "http-to-https",
      [301, 302, 307, 308].includes(httpRedirect.status) &&
        httpRedirect.headers.get("location") === `${canonicalOrigin}/es/`,
      `status=${httpRedirect.status} location=${httpRedirect.headers.get("location")}`
    );

    const wwwRedirect = await fetch("https://www.iocode-solutions.com/es/", {
      redirect: "manual"
    });
    record(
      "www-to-apex",
      [301, 302, 307, 308].includes(wwwRedirect.status) &&
        wwwRedirect.headers.get("location") === `${canonicalOrigin}/es/`,
      `status=${wwwRedirect.status} location=${wwwRedirect.headers.get("location")}`
    );
  }
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
} finally {
  server?.kill("SIGTERM");
}

const report = {
  phase: "9D",
  check: "http-security",
  target: baseUrl,
  external: expectExternal,
  status: errors.length === 0 ? "passed" : "failed",
  checks,
  errorCount: errors.length,
  errors,
  generatedAt: new Date().toISOString()
};

mkdirSync(artifactRoot, { recursive: true });
writeFileSync(
  join(artifactRoot, expectExternal ? "http-external-report.json" : "http-local-report.json"),
  JSON.stringify(report, null, 2),
  "utf8"
);

if (errors.length > 0) {
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Contrato HTTP 9D superado contra ${baseUrl}.`);
