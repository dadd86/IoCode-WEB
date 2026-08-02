import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { ReportGenerator } from "lighthouse/report/generator/report-generator.js";

const artifactRoot =
  process.env.LIGHTHOUSE_ARTIFACT_ROOT || "qa-artifacts/performance/phase-6";
const lighthouseRoot = join(artifactRoot, "lighthouse");
const baseURL = process.env.LIGHTHOUSE_BASE_URL || "http://web:8080";

const routes = process.env.LIGHTHOUSE_ROUTES
  ? process.env.LIGHTHOUSE_ROUTES.split(",").map((route) => route.trim()).filter(Boolean)
  : ["/es/", "/en/", "/de/", "/es/servicios/", "/es/contacto/"];

const thresholds = {
  desktopPerformance: Number(process.env.PHASE6_MIN_LIGHTHOUSE_DESKTOP || "0.90"),
  mobilePerformance: Number(process.env.PHASE6_MIN_LIGHTHOUSE_MOBILE || "0.75"),
  minAccessibility: Number(process.env.LIGHTHOUSE_MIN_ACCESSIBILITY || "1"),
  minBestPractices: Number(process.env.LIGHTHOUSE_MIN_BEST_PRACTICES || "0.95"),
  minSeo: Number(process.env.LIGHTHOUSE_MIN_SEO || "1"),
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
  return (
    value
      .replace(/^\/+|\/+$/g, "")
      .replaceAll("/", "-")
      .replace(/[^a-zA-Z0-9-]/g, "-") || "root"
  );
}

function getNumericAudit(lhr, auditId) {
  return lhr.audits?.[auditId]?.numericValue ?? null;
}

function getScore(lhr, category) {
  return lhr.categories?.[category]?.score ?? null;
}

function getAuditScore(lhr, auditId) {
  return lhr.audits?.[auditId]?.score ?? null;
}

function getAuditScoreDisplayMode(lhr, auditId) {
  return lhr.audits?.[auditId]?.scoreDisplayMode ?? null;
}

function getLcpElement(lhr) {
  const audit = lhr.audits?.["largest-contentful-paint-element"];
  const item = audit?.details?.items?.[0];

  if (!item) {
    return null;
  }

  return {
    nodeLabel: item.node?.nodeLabel ?? null,
    selector: item.node?.selector ?? null,
    snippet: item.node?.snippet ?? null,
    boundingRect: item.node?.boundingRect ?? null
  };
}

function resolveChromePath() {
  const directCandidates = [
    process.env.CHROME_PATH,
    "/usr/local/bin/chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ].filter(Boolean);

  for (const candidate of directCandidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  const playwrightRoot = "/ms-playwright";

  if (existsSync(playwrightRoot)) {
    for (const entry of readdirSync(playwrightRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const candidates = [
        join(playwrightRoot, entry.name, "chrome-linux", "chrome"),
        join(playwrightRoot, entry.name, "chrome-linux64", "chrome")
      ];

      for (const candidate of candidates) {
        if (existsSync(candidate)) {
          return candidate;
        }
      }
    }
  }

  throw new Error(
    "No se encontró Chrome/Chromium. Define CHROME_PATH o verifica /ms-playwright."
  );
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

function getValidationErrors(result) {
  const resultErrors = [];
  const {
    route,
    profile,
    performance,
    largestContentfulPaint,
    cumulativeLayoutShift,
    totalBlockingTime,
    lcpElement
  } = result;

  const minPerformance =
    profile === "desktop"
      ? thresholds.desktopPerformance
      : thresholds.mobilePerformance;

  if (performance === null || performance < minPerformance) {
    resultErrors.push(
      `${profile} ${route}: performance ${performance} menor que presupuesto ${minPerformance}.`
    );
  }

  for (const category of [
    ["accessibility", result.accessibility, thresholds.minAccessibility],
    ["best-practices", result.bestPractices, thresholds.minBestPractices],
    ["seo", result.seo, thresholds.minSeo]
  ]) {
    const [label, score, minimum] = category;
    if (score === null || score < minimum) {
      resultErrors.push(
        `${profile} ${route}: ${label} ${score} menor que presupuesto ${minimum}.`
      );
    }
  }

  if (largestContentfulPaint !== null && largestContentfulPaint > thresholds.maxLcpMs) {
    resultErrors.push(
      `${profile} ${route}: LCP ${largestContentfulPaint}ms supera ${thresholds.maxLcpMs}ms. Elemento LCP: ${JSON.stringify(lcpElement)}`
    );
  }

  if (cumulativeLayoutShift !== null && cumulativeLayoutShift > thresholds.maxCls) {
    resultErrors.push(
      `${profile} ${route}: CLS ${cumulativeLayoutShift} supera ${thresholds.maxCls}.`
    );
  }

  if (totalBlockingTime !== null && totalBlockingTime > thresholds.maxTbtMs) {
    resultErrors.push(
      `${profile} ${route}: TBT ${totalBlockingTime}ms supera ${thresholds.maxTbtMs}ms.`
    );
  }
  const requiredAuditScores = [
    {
      id: "errors-in-console",
      label: "Browser console errors"
    },
    {
      id: "inspector-issues",
      label: "Chrome DevTools issues"
    },
    {
      id: "uses-text-compression",
      label: "Text compression"
    },
    {
      id: "label-content-name-mismatch",
      label: "Accessible name contiene el texto visible"
    }
  ];

  for (const audit of requiredAuditScores) {
    const score = result.auditScores?.[audit.id];
    const scoreDisplayMode = result.auditScoreDisplayModes?.[audit.id];
    const isNotApplicable =
      score === null && scoreDisplayMode === "notApplicable";

    if (score !== 1 && !isNotApplicable) {
      resultErrors.push(
        `${route} ${profile}: ${audit.label} no pasó. Audit ${audit.id} score=${score}, scoreDisplayMode=${scoreDisplayMode}.`
      );
    }
  }

  return resultErrors;
}

function createResult(lhr, route, profile) {
  return {
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
    lcpElement: getLcpElement(lhr),
    auditScores: {
      "errors-in-console": getAuditScore(lhr, "errors-in-console"),
      "inspector-issues": getAuditScore(lhr, "inspector-issues"),
      "uses-text-compression": getAuditScore(lhr, "uses-text-compression"),
      "label-content-name-mismatch": getAuditScore(lhr, "label-content-name-mismatch")
    },
    auditScoreDisplayModes: {
      "errors-in-console": getAuditScoreDisplayMode(lhr, "errors-in-console"),
      "inspector-issues": getAuditScoreDisplayMode(lhr, "inspector-issues"),
      "uses-text-compression": getAuditScoreDisplayMode(lhr, "uses-text-compression"),
      "label-content-name-mismatch": getAuditScoreDisplayMode(
        lhr,
        "label-content-name-mismatch"
      )
    }
  };
}

function selectMedianAttempt(attempts) {
  const ordered = [...attempts].sort((left, right) => {
    const leftPerformance = left.result.performance ?? -1;
    const rightPerformance = right.result.performance ?? -1;

    if (leftPerformance !== rightPerformance) {
      return leftPerformance - rightPerformance;
    }

    return (
      (right.result.totalBlockingTime ?? Number.POSITIVE_INFINITY) -
      (left.result.totalBlockingTime ?? Number.POSITIVE_INFINITY)
    );
  });

  return ordered[Math.floor(ordered.length / 2)];
}

let chrome = null;

try {
  const chromePath = resolveChromePath();

  console.log(`Lighthouse Fase 6 Chrome path: ${chromePath}`);

  chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-sync"
    ]
  });

  for (const route of routes) {
    for (const profile of ["desktop", "mobile"]) {
      const url = new URL(route, baseURL).toString();
      const config = profile === "desktop" ? createDesktopConfig() : createMobileConfig();
      const expectedAttempts = profile === "desktop" ? 3 : 1;
      const attempts = [];

      for (let attempt = 1; attempt <= expectedAttempts; attempt += 1) {
        console.log(
          `Lighthouse Fase 6: ${profile} ${route} (${attempt}/${expectedAttempts})`
        );

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
          errors.push(
            `${profile} ${route}: Lighthouse no generó LHR en el intento ${attempt}.`
          );
          continue;
        }

        attempts.push({
          attempt,
          lhr: runnerResult.lhr,
          result: createResult(runnerResult.lhr, route, profile)
        });
      }

      if (attempts.length !== expectedAttempts) {
        errors.push(
          `${profile} ${route}: se esperaban ${expectedAttempts} intentos Lighthouse y se recibieron ${attempts.length}.`
        );
      }

      if (attempts.length === 0) {
        continue;
      }

      const selectedAttempt = selectMedianAttempt(attempts);
      const { lhr } = selectedAttempt;
      const slug = `${profile}-${slugify(route)}`;
      const jsonPath = join(lighthouseRoot, `${slug}.json`);
      const htmlPath = join(lighthouseRoot, `${slug}.html`);

      writeFileSync(jsonPath, JSON.stringify(lhr, null, 2), "utf8");
      writeFileSync(htmlPath, ReportGenerator.generateReport(lhr, "html"), "utf8");

      const result = {
        ...selectedAttempt.result,
        reportJson: jsonPath.replaceAll("\\", "/"),
        reportHtml: htmlPath.replaceAll("\\", "/"),
        expectedAttempts,
        selectedAttempt: selectedAttempt.attempt,
        selectionMethod:
          expectedAttempts === 1
            ? "single-run"
            : "median-performance-score-with-tbt-tiebreak",
        attempts: attempts.map(({ attempt, result: attemptResult }) => ({
          attempt,
          performance: attemptResult.performance,
          largestContentfulPaint: attemptResult.largestContentfulPaint,
          cumulativeLayoutShift: attemptResult.cumulativeLayoutShift,
          totalBlockingTime: attemptResult.totalBlockingTime,
          speedIndex: attemptResult.speedIndex
        }))
      };

      errors.push(...getValidationErrors(result));
      results.push(result);
    }
  }
} catch (error) {
  errors.push(`Lighthouse Fase 6 falló: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  if (chrome) {
    try {
      chrome.kill();
    } catch (error) {
      warnings.push(
        `Chrome terminó, pero no se pudo limpiar su directorio temporal: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

if (results.length !== routes.length * 2) {
  errors.push(
    `Lighthouse Fase 6 incompleto: se esperaban ${routes.length * 2} mediciones, recibidas ${results.length}.`
  );
}

const status = errors.length === 0 ? "passed" : "failed";

writeFileSync(
  join(artifactRoot, "lighthouse-summary.json"),
  JSON.stringify(
    {
      phase: process.env.LIGHTHOUSE_PHASE || "6",
      check: process.env.LIGHTHOUSE_CHECK || "lighthouse",
      status,
      baseURL,
      thresholds,
      expectedMeasurements: routes.length * 2,
      actualMeasurements: results.length,
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
