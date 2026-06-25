import { createServer, request } from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import lighthouse from "lighthouse";
import { chromium } from "playwright";

const upstreamBaseURL =
  process.env.LIGHTHOUSE_UPSTREAM_BASE_URL ||
  process.env.LIGHTHOUSE_BASE_URL ||
  "http://web:8080";

const localProxyPort = Number(process.env.LIGHTHOUSE_LOCAL_PROXY_PORT || "18080");

const auditedBaseURL =
  process.env.LIGHTHOUSE_AUDIT_BASE_URL ||
  `http://127.0.0.1:${localProxyPort}`;

const remoteDebuggingPort = Number(process.env.CHROME_REMOTE_DEBUGGING_PORT || "9222");

const blockingThresholds = {
  seo: Number(process.env.LH_MIN_SEO || "1")
};

const reportOnlyThresholds = {
  performance: Number(process.env.LH_MIN_PERFORMANCE || "0.50"),
  accessibility: Number(process.env.LH_MIN_ACCESSIBILITY || "0.90"),
  "best-practices": Number(process.env.LH_MIN_BEST_PRACTICES || "0.85")
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

async function startLocalProxy() {
  const upstream = new URL(upstreamBaseURL);

  const server = createServer((clientRequest, clientResponse) => {
    const targetUrl = new URL(clientRequest.url || "/", upstream);

    const proxyRequest = request(
      targetUrl,
      {
        method: clientRequest.method,
        headers: {
          ...clientRequest.headers,
          host: upstream.host
        }
      },
      (proxyResponse) => {
        clientResponse.writeHead(proxyResponse.statusCode || 500, proxyResponse.headers);
        proxyResponse.pipe(clientResponse);
      }
    );

    proxyRequest.on("error", (error) => {
      clientResponse.writeHead(502, {
        "content-type": "text/plain; charset=utf-8"
      });

      clientResponse.end(`Lighthouse local proxy error: ${error.message}`);
    });

    clientRequest.pipe(proxyRequest);
  });

  await new Promise((resolve) => {
    server.listen(localProxyPort, "127.0.0.1", resolve);
  });

  console.log(`Lighthouse proxy activo: ${auditedBaseURL} -> ${upstreamBaseURL}`);

  return server;
}

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function waitForChrome() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 15_000) {
    try {
      const response = await fetch(`http://127.0.0.1:${remoteDebuggingPort}/json/version`);

      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw new Error("Chromium remote debugging port did not become available.");
}

function scoreOf(result, category) {
  const score = result?.lhr?.categories?.[category]?.score;

  if (typeof score !== "number") {
    return 0;
  }

  return score;
}

function artifactNameFromRoute(route) {
  const normalized = route.replaceAll("/", "_");

  if (normalized === "_") {
    return "root";
  }

  return normalized;
}

function printRouteScores(routeSummary) {
  console.log(
    [
      `OK ${routeSummary.route}`,
      `performance=${routeSummary.scores.performance}`,
      `accessibility=${routeSummary.scores.accessibility}`,
      `best-practices=${routeSummary.scores["best-practices"]}`,
      `seo=${routeSummary.scores.seo}`
    ].join(" | ")
  );
}

await mkdir("qa-artifacts/lighthouse", { recursive: true });

const proxyServer = await startLocalProxy();

const browser = await chromium.launch({
  headless: true,
  args: [
    `--remote-debugging-port=${remoteDebuggingPort}`,
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu"
  ]
});

try {
  await waitForChrome();

  const summary = [];

  for (const [index, route] of routes.entries()) {
    const url = new URL(route, auditedBaseURL).toString();

    console.log(`[${index + 1}/${routes.length}] Ejecutando Lighthouse: ${route}`);

    const startedAt = Date.now();

    const result = await lighthouse(url, {
      port: remoteDebuggingPort,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      formFactor: "desktop",
      screenEmulation: {
        disabled: true
      },
      throttlingMethod: "provided",
      maxWaitForLoad: 45_000
    });

    if (!result) {
      throw new Error(`Lighthouse did not return a result for ${url}`);
    }

    const routeSummary = {
      route,
      url,
      upstreamUrl: new URL(route, upstreamBaseURL).toString(),
      durationMs: Date.now() - startedAt,
      scores: {
        performance: scoreOf(result, "performance"),
        accessibility: scoreOf(result, "accessibility"),
        "best-practices": scoreOf(result, "best-practices"),
        seo: scoreOf(result, "seo")
      }
    };

    summary.push(routeSummary);

    await writeFile(
      `qa-artifacts/lighthouse/${artifactNameFromRoute(route)}.json`,
      JSON.stringify(result.lhr, null, 2),
      "utf8"
    );

    for (const [category, minScore] of Object.entries(blockingThresholds)) {
      const score = routeSummary.scores[category];

      if (score < minScore) {
        throw new Error(`${url} failed Lighthouse ${category}: ${score} < ${minScore}`);
      }
    }

    for (const [category, minScore] of Object.entries(reportOnlyThresholds)) {
      const score = routeSummary.scores[category];

      if (score < minScore) {
        console.warn(`[report-only] ${url} Lighthouse ${category}: ${score} < ${minScore}`);
      }
    }

    printRouteScores(routeSummary);
  }

  await writeFile(
    "qa-artifacts/lighthouse-summary.json",
    JSON.stringify(
      {
        blockingThresholds,
        reportOnlyThresholds,
        upstreamBaseURL,
        auditedBaseURL,
        routeCount: summary.length,
        summary
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("Lighthouse Fase 1.1C completado.");
  console.table(
    summary.map((item) => ({
      route: item.route,
      performance: item.scores.performance,
      accessibility: item.scores.accessibility,
      bestPractices: item.scores["best-practices"],
      seo: item.scores.seo,
      durationMs: item.durationMs
    }))
  );
} finally {
  await browser.close();
  await closeServer(proxyServer);
}