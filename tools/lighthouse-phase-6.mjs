import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { ReportGenerator } from "lighthouse/report/generator/report-generator.js";

const artifactRoot = "qa-artifacts/performance/phase-6";
const lighthouseRoot = join(artifactRoot, "lighthouse");
const baseURL = process.env.LIGHTHOUSE_BASE_URL || "http://web:8080";

const routes = [
  "/es/",
  "/en/",
  "/de/",
  "/es/servicios/",
  "/es/contacto/"
];

const thresholds = {
  desktopPerformance: Number(process.env.PHASE6_MIN_LIGHTHOUSE_DESKTOP || "0.90"),
  mobilePerformance: Number(process.env.PHASE6_MIN_LIGHTHOUSE_MOBILE || "0.75"),
  maxLcpMs: Number(process.env.PHASE6_MAX_LCP_MS || "2500"),
  maxCls: Number(process.env.PHASE6_MAX_CLS || "0.1"),
  maxTbtMs: Number(process.env.PHASE6_MAX_TBT_MS || "300")
};

const errors = [];
const warnings = [];
const results = [];

mkdirSync(lighthouseRoot, {
  recursive: true
});

function slugify(value) {
  return value
    .replace(/^\/+|\/+$/g, "")
    .replaceAll("/", "-")
    .replace(/[^a-zA-Z0-9-]/g, "-") || "root";
}

function getNumericAudit(lhr, auditId) {
  return lhr.audits?.[auditId]?.numericValue ?? null;
}

function getScore(lhr, category) {
  return lhr.categories?.[category]?.score ?? null;
}

function createDesktopConfig() {
  return {
    extends: "lighthouse:default",
    settings: {
      formFactor: "desktop",
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      },
      throttlingMethod: "simulate"
    }
  };
}

function createMobileConfig() {
  return {
    extends: "lighthouse:default",
    settings: {
      formFactor: "mobile",
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        disabled: false
      },
      throttlingMethod: "simulate"
    }
  };
}

function validateResult(result) {
  const {
    route,
    profile,
    performance,
    largestContentfulPaint,
    cumulativeLayoutShift,
    totalBlockingTime
  } = result;

  const minPerformance =
    profile === "desktop"
      ? thresholds.desktopPerformance
      : thresholds.mobilePerformance;

  if (performance === null || performance < minPerformance) {
    errors.push(
      `${profile} ${route}: performance ${performance} menor que presupuesto ${minPerformance}.`
    );
  }

  if (largestContentfulPaint !== null && largestContentfulPaint > thresholds.maxLcpMs) {
    errors.push(
      `${profile} ${route}: LCP ${largestContentfulPaint}ms supera ${thresholds.maxLcpMs}ms.`
    );
  }

  if (cumulativeLayoutShift !== null && cumulativeLayoutShift > thresholds.maxCls) {
    errors.push(
      `${profile} ${route}: CLS ${cumulativeLayoutShift} supera ${thresholds.maxCls}.`
    );
  }

  if (totalBlockingTime !== null && totalBlockingTime > thresholds.maxTbtMs) {
    errors.push(
      `${profile} ${route}: TBT ${totalBlockingTime}ms supera ${thresholds.maxTbtMs}ms.`
    );
  }
}

const chrome = await chromeLauncher.launch({
  chromeFlags: [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage"
  ]
});

try {
  for (const route of routes) {
    for (const profile of ["desktop", "mobile"]) {
      const url = new URL(route, baseURL).toString();
      const config = profile === "desktop" ? createDesktopConfig() : createMobileConfig();

      const runnerResult = await lighthouse(
        url,
        {
          port: chrome.port,
          output: ["json", "html"],
          logLevel: "error",
          onlyCategories: ["performance", "accessibility", "best-practices", "seo"]
        },
        config
      );

      if (!runnerResult?.lhr) {
        errors.push(`${profile} ${route}: Lighthouse no generó LHR.`);
        continue;
      }

      const { lhr } = runnerResult;
      const slug = `${profile}-${slugify(route)}`;
      const jsonPath = join(lighthouseRoot, `${slug}.json`);
      const htmlPath = join(lighthouseRoot, `${slug}.html`);

      const jsonReport = JSON.stringify(lhr, null, 2);
      const htmlReport = ReportGenerator.generateReport(lhr, "html");

      writeFileSync(jsonPath, jsonReport, "utf8");
      writeFileSync(htmlPath, htmlReport, "utf8");

      const result = {
        route,
        profile,
        requestedUrl: lhr.requestedUrl,
        finalDisplayedUrl: lhr.finalDisplayedUrl,
        performance: getScore(lhr, "performance"),
        accessibility: getScore(lhr, "accessibility"),
        bestPractices: getScore(lhr, "best-practices"),
        seo: getScore(lhr, "seo"),
        largestContentfulPaint: getNumericAudit(lhr, "largest-contentful-paint"),
        cumulativeLayoutShift: getNumericAudit(lhr, "cumulative-layout-shift"),
        totalBlockingTime: getNumericAudit(lhr, "total-blocking-time"),
        speedIndex: getNumericAudit(lhr, "speed-index"),
        reportJson: jsonPath.replaceAll("\\", "/"),
        reportHtml: htmlPath.replaceAll("\\", "/")
      };

      validateResult(result);
      results.push(result);
    }
  }
} finally {
  await chrome.kill();
}

const status = errors.length === 0 ? "passed" : "failed";

writeFileSync(
  join(artifactRoot, "lighthouse-summary.json"),
  JSON.stringify(
    {
      phase: "6",
      check: "lighthouse",
      status,
      baseURL,
      thresholds,
      results,
      warningCount: warnings.length,
      errorCount: errors.length,
      warnings,
      errors,
      generatedAt: new Date().toISOString()
    },
    null,
    2
  ),
  "utf8"
);

if (errors.length > 0) {
  console.error("Errores Lighthouse Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Lighthouse Fase 6 superado.");