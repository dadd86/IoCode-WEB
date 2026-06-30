import { createServer } from "node:http";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "playwright";

const artifactRoot = "qa-artifacts/accessibility-performance/phase-1-1f";
const upstreamBaseURL =
  process.env.A11Y_PERF_LIGHTHOUSE_BASE_URL ||
  process.env.LIGHTHOUSE_BASE_URL ||
  "http://web:8080";

const localProxyPort = Number(
  process.env.A11Y_PERF_LIGHTHOUSE_PROXY_PORT || "18081"
);

const auditedBaseURL = `http://127.0.0.1:${localProxyPort}`;

const thresholds = {
  accessibility: Number(process.env.A11Y_PERF_MIN_ACCESSIBILITY || "1"),
  seo: Number(process.env.A11Y_PERF_MIN_SEO || "1"),
  bestPractices: Number(process.env.A11Y_PERF_MIN_BEST_PRACTICES || "0.95")
};

const routes = [
  "/es/",
  "/en/",
  "/de/",
  "/es/servicios/",
  "/en/services/",
  "/de/leistungen/",
  "/es/proceso/",
  "/en/process/",
  "/de/prozess/",
  "/es/contacto/",
  "/en/contact/",
  "/de/kontakt/"
];

const errors = [];
const summary = [];

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, {
    recursive: true
  });

  writeFileSync(
    join(artifactRoot, name),
    JSON.stringify(payload, null, 2),
    "utf8"
  );
}

function sanitizeRoute(route) {
  return route.replaceAll("/", "_") || "_root";
}

function createProxyServer() {
  const server = createServer((request, response) => {
    const targetUrl = new URL(request.url || "/", upstreamBaseURL);

    fetch(targetUrl, {
      method: request.method,
      headers: request.headers
    })
      .then(async (proxyResponse) => {
        response.writeHead(
          proxyResponse.status,
          Object.fromEntries(proxyResponse.headers.entries())
        );

        if (request.method === "HEAD") {
          response.end();
          return;
        }

        const body = Buffer.from(await proxyResponse.arrayBuffer());

        response.end(body);
      })
      .catch((error) => {
        response.writeHead(502, {
          "Content-Type": "text/plain; charset=utf-8"
        });

        response.end(`Proxy error: ${error.message}`);
      });
  });

  return new Promise((resolve) => {
    server.listen(localProxyPort, "127.0.0.1", () => {
      resolve(server);
    });
  });
}

const proxyServer = await createProxyServer();

console.log(
  `Lighthouse 1.1F proxy activo: ${auditedBaseURL} -> ${upstreamBaseURL}`
);

const chromePath = process.env.CHROME_PATH || chromium.executablePath();

console.log(`Lighthouse 1.1F Chrome path: ${chromePath}`);

const chrome = await chromeLauncher.launch({
  chromePath,
  chromeFlags: [
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu"
  ]
});

try {
  for (const route of routes) {
    const url = new URL(route, auditedBaseURL).toString();

    console.log(`Lighthouse 1.1F: ${route}`);

    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"]
    });

    if (!result?.lhr) {
      errors.push(`${route}: Lighthouse no devolvió resultado.`);
      continue;
    }

    const scores = {
      performance: result.lhr.categories.performance?.score ?? null,
      accessibility: result.lhr.categories.accessibility?.score ?? null,
      bestPractices:
        result.lhr.categories["best-practices"]?.score ?? null,
      seo: result.lhr.categories.seo?.score ?? null
    };

    summary.push({
      route,
      url,
      upstreamUrl: new URL(route, upstreamBaseURL).toString(),
      scores
    });

    writeArtifact(`lighthouse${sanitizeRoute(route)}.json`, {
      phase: "1.1F",
      route,
      url,
      upstreamUrl: new URL(route, upstreamBaseURL).toString(),
      scores,
      generatedAt: new Date().toISOString()
    });

    if ((scores.accessibility ?? 0) < thresholds.accessibility) {
      errors.push(
        `${route}: accessibility ${scores.accessibility} < ${thresholds.accessibility}.`
      );
    }

    if ((scores.seo ?? 0) < thresholds.seo) {
      errors.push(`${route}: seo ${scores.seo} < ${thresholds.seo}.`);
    }

    if ((scores.bestPractices ?? 0) < thresholds.bestPractices) {
      errors.push(
        `${route}: best-practices ${scores.bestPractices} < ${thresholds.bestPractices}.`
      );
    }

    if (scores.performance === null) {
      errors.push(`${route}: performance no medido por Lighthouse.`);
    }
  }
} finally {
  chrome.kill();
  proxyServer.close();
}

const status = errors.length === 0 ? "passed" : "failed";

writeArtifact("lighthouse-summary.json", {
  phase: "1.1F",
  check: "lighthouse",
  status,
  thresholds,
  upstreamBaseURL,
  auditedBaseURL,
  routeCount: routes.length,
  summary,
  performancePolicy:
    "Performance Lighthouse se mide y se registra; budgets de assets son el gate bloqueante local de performance en 1.1F.",
  warningCount: 0,
  errorCount: errors.length,
  warnings: [],
  errors,
  generatedAt: new Date().toISOString()
});

if (errors.length > 0) {
  console.error("Errores Lighthouse Fase 1.1F:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Lighthouse Fase 1.1F completado.");