import { mkdir, writeFile } from "node:fs/promises";
import lighthouse from "lighthouse";
import { chromium } from "playwright";

const baseURL = process.env.LIGHTHOUSE_BASE_URL || "http://localhost:8080";

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

const thresholds = {
  performance: Number(process.env.LH_MIN_PERFORMANCE || "0.50"),
  accessibility: Number(process.env.LH_MIN_ACCESSIBILITY || "0.90"),
  "best-practices": Number(process.env.LH_MIN_BEST_PRACTICES || "0.85"),
  seo: Number(process.env.LH_MIN_SEO || "0.90")
};

const remoteDebuggingPort = Number(process.env.CHROME_REMOTE_DEBUGGING_PORT || "9222");

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

await mkdir("qa-artifacts/lighthouse", { recursive: true });

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

  for (const route of routes) {
    const url = new URL(route, baseURL).toString();

    const result = await lighthouse(url, {
      port: remoteDebuggingPort,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      formFactor: "desktop",
      screenEmulation: {
        disabled: true
      },
      throttlingMethod: "provided"
    });

    if (!result) {
      throw new Error(`Lighthouse did not return a result for ${url}`);
    }

    const routeSummary = {
      route,
      url,
      scores: {
        performance: scoreOf(result, "performance"),
        accessibility: scoreOf(result, "accessibility"),
        "best-practices": scoreOf(result, "best-practices"),
        seo: scoreOf(result, "seo")
      }
    };

    summary.push(routeSummary);

    await writeFile(
      `qa-artifacts/lighthouse/${route.replaceAll("/", "_") || "root"}.json`,
      JSON.stringify(result.lhr, null, 2),
      "utf8"
    );

    for (const [category, minScore] of Object.entries(thresholds)) {
      const score = routeSummary.scores[category];

      if (score < minScore) {
        throw new Error(
          `${url} failed Lighthouse ${category}: ${score} < ${minScore}`
        );
      }
    }
  }

  await writeFile(
    "qa-artifacts/lighthouse-summary.json",
    JSON.stringify({ thresholds, summary }, null, 2),
    "utf8"
  );

  console.log("Lighthouse Fase 1.1C completado.");
  console.table(
    summary.map((item) => ({
      route: item.route,
      performance: item.scores.performance,
      accessibility: item.scores.accessibility,
      bestPractices: item.scores["best-practices"],
      seo: item.scores.seo
    }))
  );
} finally {
  await browser.close();
}