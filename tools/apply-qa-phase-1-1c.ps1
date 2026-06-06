$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  $directory = Split-Path -Parent $Path

  if ($directory -and -not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

function Add-TextIfMissing {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Needle,
    [Parameter(Mandatory = $true)][string]$ContentToAppend
  )

  $content = Get-Content $Path -Raw

  if ($content -notlike "*$Needle*") {
    Add-Content -Path $Path -Value $ContentToAppend
  }
}

Write-Utf8NoBom "src/components/Navigation.astro" @'
---
import { navigationRouteKeys, routeAlternates } from "../i18n/routes";
import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

type Props = {
  locale: Locale;
  activeKey: RouteKey;
};

const { locale, activeKey } = Astro.props as Props;
---

<ul class="navLinks">
  {navigationRouteKeys.map((routeKey) => {
    const item = routeAlternates[routeKey];
    const isActive = item.key === activeKey;

    return (
      <li>
        <a
          href={item.path[locale]}
          class:list={{ "is-active": isActive }}
          aria-current={isActive ? "page" : undefined}
        >
          {item.label[locale]}
        </a>
      </li>
    );
  })}
</ul>
'@

Write-Utf8NoBom "src/components/Header.astro" @'
---
import Navigation from "./Navigation.astro";
import LanguageSwitcher from "./LanguageSwitcher.astro";
import { siteConfig } from "../data/site";
import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

type Props = { locale: Locale; activeKey: RouteKey };
const { locale, activeKey } = Astro.props;

const navLabel: Record<Locale, string> = {
  es: "Navegación principal",
  en: "Main navigation",
  de: "Hauptnavigation"
};

const brandLabel: Record<Locale, string> = {
  es: "Ir al inicio de IoCode SOLUTIONS",
  en: "Go to IoCode SOLUTIONS home",
  de: "Zur Startseite von IoCode SOLUTIONS"
};
---

<header class="siteHeader">
  <nav class="navbar container" aria-label={navLabel[locale]}>
    <a class="brand" href={`/${locale}/`} aria-label={brandLabel[locale]}>
      <img class="brand__logo" src={siteConfig.logoPath} alt={siteConfig.name} />
    </a>
    <Navigation locale={locale} activeKey={activeKey} />
    <LanguageSwitcher locale={locale} activeKey={activeKey} />
  </nav>
</header>
'@

Write-Utf8NoBom "src/components/LanguageSwitcher.astro" @'
---
import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";
import { getAlternatePaths } from "../i18n/routes";

type Props = { locale: Locale; activeKey: RouteKey };
const { locale, activeKey } = Astro.props;
const paths = getAlternatePaths(activeKey);

const label: Record<Locale, string> = {
  es: "Selector de idioma",
  en: "Language selector",
  de: "Sprachauswahl"
};

const linkLabels: Record<Locale, Record<Locale, string>> = {
  es: {
    es: "Ver esta página en español",
    en: "Ver esta página en inglés",
    de: "Ver esta página en alemán"
  },
  en: {
    es: "View this page in Spanish",
    en: "View this page in English",
    de: "View this page in German"
  },
  de: {
    es: "Diese Seite auf Spanisch anzeigen",
    en: "Diese Seite auf Englisch anzeigen",
    de: "Diese Seite auf Deutsch anzeigen"
  }
};
---

<div class="languageSwitcher" aria-label={label[locale]}>
  <a
    class:list={{ "is-active": locale === "es" }}
    href={paths.es}
    hreflang="es"
    lang="es"
    aria-label={linkLabels[locale].es}
    aria-current={locale === "es" ? "true" : undefined}
  >
    ES
  </a>
  <a
    class:list={{ "is-active": locale === "en" }}
    href={paths.en}
    hreflang="en"
    lang="en"
    aria-label={linkLabels[locale].en}
    aria-current={locale === "en" ? "true" : undefined}
  >
    EN
  </a>
  <a
    class:list={{ "is-active": locale === "de" }}
    href={paths.de}
    hreflang="de"
    lang="de"
    aria-label={linkLabels[locale].de}
    aria-current={locale === "de" ? "true" : undefined}
  >
    DE
  </a>
</div>
'@

Write-Utf8NoBom "src/components/ContactForm.astro" @'
---
import { siteConfig } from "../data/site";
import type { Locale } from "../i18n/config";
import { ui } from "../i18n/ui";

type Props = {
  locale: Locale;
};

const { locale } = Astro.props as Props;
const labels = ui[locale];
const contactPerson = siteConfig.contactPerson;

const options: Record<Locale, string[]> = {
  es: [
    "Automatización PLC / HMI",
    "Robótica industrial",
    "Industria 4.0 / IoT",
    "Software industrial",
    "ERP / bases de datos",
    "Soporte técnico",
    "Otro"
  ],
  en: [
    "PLC / HMI automation",
    "Industrial robotics",
    "Industry 4.0 / IoT",
    "Industrial software",
    "ERP / databases",
    "Technical support",
    "Other"
  ],
  de: [
    "SPS / HMI-Automatisierung",
    "Industrierobotik",
    "Industrie 4.0 / IoT",
    "Industriesoftware",
    "ERP / Datenbanken",
    "Technischer Support",
    "Andere"
  ]
};

const contactCopy: Record<
  Locale,
  {
    companyTitle: string;
    personEyebrow: string;
    personTitle: string;
    profileNote: string;
    emailLabel: string;
  }
> = {
  es: {
    companyTitle: "Contacto empresarial",
    personEyebrow: "Persona de contacto",
    personTitle: "Quién está detrás de IoCode SOLUTIONS",
    profileNote:
      "Los enlaces externos permiten verificar experiencia profesional, proyectos técnicos y trayectoria pública.",
    emailLabel: "Correo"
  },
  en: {
    companyTitle: "Business contact",
    personEyebrow: "Contact person",
    personTitle: "Who is behind IoCode SOLUTIONS",
    profileNote:
      "The external links help verify professional experience, technical projects and public track record.",
    emailLabel: "Email"
  },
  de: {
    companyTitle: "Geschäftlicher Kontakt",
    personEyebrow: "Ansprechpartner",
    personTitle: "Wer hinter IoCode SOLUTIONS steht",
    profileNote:
      "Die externen Links helfen dabei, Berufserfahrung, technische Projekte und den öffentlichen Werdegang zu prüfen.",
    emailLabel: "E-Mail"
  }
};

const copy = contactCopy[locale];
const noteId = `contact-note-${locale}`;
---

<div class="contactGrid">
  <aside class="contactPanel">
    <img class="contactPanel__logo" src={siteConfig.logoPath} alt={siteConfig.name} />

    <div class="contactPanel__section">
      <p class="eyebrow">{copy.companyTitle}</p>
      <h2>{siteConfig.name}</h2>
      <p>{siteConfig.businessDescription[locale]}</p>
    </div>

    <div class="contactLinks" aria-label={copy.emailLabel}>
      <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
    </div>

    <article class="contactPersonCard" aria-labelledby="contactPersonTitle">
      <p class="eyebrow">{copy.personEyebrow}</p>
      <h3 id="contactPersonTitle">{copy.personTitle}</h3>

      <p class="contactPersonCard__name">{contactPerson.name}</p>
      <p class="contactPersonCard__role">{contactPerson.role[locale]}</p>
      <p>{contactPerson.description[locale]}</p>

      <p class="contactPersonCard__note">{copy.profileNote}</p>

      <div class="contactSocialLinks">
        <a
          href={contactPerson.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          {labels.linkedin}
        </a>
        <a
          href={contactPerson.links.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          {labels.github}
        </a>
      </div>
    </article>
  </aside>

  <form
    class="contactForm"
    id="contactForm"
    data-contact-email={siteConfig.email}
    aria-describedby={noteId}
  >
    <p class="formNote" id={noteId}>{labels.contactNote}</p>

    <label for="nombre">{labels.contactName}</label>
    <input class="input" id="nombre" type="text" name="nombre" autocomplete="name" required />

    <label for="correo">{labels.contactEmail}</label>
    <input class="input" id="correo" type="email" name="correo" autocomplete="email" required />

    <label for="tipoProyecto">{labels.contactProjectType}</label>
    <select class="input" id="tipoProyecto" name="tipoProyecto" required>
      <option value="">{labels.selectOption}</option>
      {options[locale].map((option) => <option value={option}>{option}</option>)}
    </select>

    <label for="mensaje">{labels.contactMessage}</label>
    <textarea class="input" id="mensaje" name="mensaje" rows="6" required></textarea>

    <button class="button button--primary button--full" type="submit">{labels.contactSubmit}</button>
  </form>
</div>

<script>
  const form = document.querySelector<HTMLFormElement>("[data-contact-email]");

  if (form) {
    form.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const email = form.dataset.contactEmail;

      if (!email) {
        console.error("Contact email is not configured.");
        return;
      }

      const data = new FormData(form);
      const projectType = String(data.get("tipoProyecto") || "Proyecto");
      const subject = encodeURIComponent(`IoCode SOLUTIONS - ${projectType}`);

      const body = encodeURIComponent([
        `Nombre: ${String(data.get("nombre") || "")}`,
        `Correo: ${String(data.get("correo") || "")}`,
        `Tipo: ${projectType}`,
        "",
        String(data.get("mensaje") || "")
      ].join("\n"));

      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    });
  }
</script>
'@

Add-TextIfMissing "src/assets/global.css" "phase-1-1c-reduced-motion" @'

/* phase-1-1c-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
'@

Write-Utf8NoBom "Docker/Dockerfile.browser-qa" @'
# syntax=docker/dockerfile:1.7

ARG PLAYWRIGHT_VERSION=1.56.1
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

WORKDIR /app

ENV CI=1 \
    ASTRO_TELEMETRY_DISABLED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    PLAYWRIGHT_BASE_URL=http://web:8080 \
    LIGHTHOUSE_BASE_URL=http://web:8080

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi \
  && npm install --no-save @playwright/test@${PLAYWRIGHT_VERSION} axe-core@^4.10.0 lighthouse@^12.2.0 playwright@${PLAYWRIGHT_VERSION}

COPY . .

CMD ["npm", "run", "qa:phase-1-1c"]
'@

Write-Utf8NoBom "playwright.config.ts" @'
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: {
    timeout: 7_500
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["json", { outputFile: "qa-artifacts/playwright-results.json" }],
    ["html", { outputFolder: "qa-artifacts/playwright-report", open: "never" }]
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 900 }
      }
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 5"]
      }
    }
  ]
});
'@

Write-Utf8NoBom "tests/e2e/phase-1-1c.spec.ts" @'
import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

const routes = [
  { path: "/es/", locale: "es", type: "general" },
  { path: "/en/", locale: "en", type: "general" },
  { path: "/de/", locale: "de", type: "general" },
  { path: "/es/servicios/", locale: "es", type: "general" },
  { path: "/en/services/", locale: "en", type: "general" },
  { path: "/de/leistungen/", locale: "de", type: "general" },
  { path: "/es/proceso/", locale: "es", type: "general" },
  { path: "/en/process/", locale: "en", type: "general" },
  { path: "/de/prozess/", locale: "de", type: "general" },
  { path: "/es/contacto/", locale: "es", type: "contact" },
  { path: "/en/contact/", locale: "en", type: "contact" },
  { path: "/de/kontakt/", locale: "de", type: "contact" }
] as const;

const nonContactForbidden = [
  "Diego",
  "Diaz",
  "dadd86",
  "linkedin.com/in/diegoarmandodiaz",
  "github.com/dadd86"
];

function formatAxeViolations(violations: Array<Record<string, unknown>>): string {
  return violations
    .map((violation) => {
      const nodes = Array.isArray(violation.nodes)
        ? violation.nodes
            .slice(0, 3)
            .map((node) => {
              const target = Array.isArray((node as { target?: unknown }).target)
                ? (node as { target: string[] }).target.join(", ")
                : "unknown target";

              return `    - ${target}`;
            })
            .join("\n")
        : "    - unknown target";

      return [
        `${String(violation.id)} (${String(violation.impact)})`,
        String(violation.description),
        nodes
      ].join("\n");
    })
    .join("\n\n");
}

async function openChecked(page: Page, path: string): Promise<string[]> {
  const runtimeErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    runtimeErrors.push(error.message);
  });

  const response = await page.goto(path, { waitUntil: "networkidle" });

  expect(response?.status(), `${path} debe responder 200`).toBe(200);

  await page.waitForTimeout(300);

  return runtimeErrors;
}

async function getCriticalA11yViolations(page: Page) {
  await page.addScriptTag({ content: axe.source });

  const results = await page.evaluate(async () => {
    return await (window as unknown as {
      axe: {
        run: (
          root: Document,
          options: Record<string, unknown>
        ) => Promise<{ violations: Array<Record<string, unknown>> }>;
      };
    }).axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]
      },
      resultTypes: ["violations"]
    });
  });

  return results.violations.filter((violation) =>
    ["critical", "serious"].includes(String(violation.impact))
  );
}

test.describe("Fase 1.1C - estructura, responsive y accesibilidad básica", () => {
  for (const route of routes) {
    test(`${route.path} renderiza sin errores críticos`, async ({ page }, testInfo) => {
      const runtimeErrors = await openChecked(page, route.path);

      expect(runtimeErrors, runtimeErrors.join("\n")).toEqual([]);

      await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
      await expect(page.locator("main#contenido")).toBeVisible();

      const h1Count = await page.locator("h1").count();
      expect(h1Count, `${route.path} debe tener exactamente un h1`).toBe(1);

      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);

      const hasHorizontalOverflow = await page.evaluate(() => {
        const documentElement = document.documentElement;
        return documentElement.scrollWidth > documentElement.clientWidth + 2;
      });

      expect(hasHorizontalOverflow, `${route.path} no debe tener overflow horizontal`).toBe(false);

      const navCurrentCount = await page.locator('nav a[aria-current="page"]').count();
      expect(navCurrentCount, `${route.path} debe marcar la página activa en navegación`).toBeGreaterThanOrEqual(1);

      if (route.type !== "contact") {
        const bodyText = await page.locator("body").innerText();

        for (const forbidden of nonContactForbidden) {
          expect(bodyText.includes(forbidden), `${forbidden} no debe aparecer fuera de contacto`).toBe(false);
        }
      }

      if (testInfo.project.name === "chromium-desktop") {
        const violations = await getCriticalA11yViolations(page);
        expect(violations, formatAxeViolations(violations)).toHaveLength(0);
      }
    });
  }

  test("skip link es el primer elemento enfocable", async ({ page }) => {
    await openChecked(page, "/es/");

    await page.keyboard.press("Tab");

    await expect(page.locator(".skipLink")).toBeFocused();
  });

  test("contacto tiene labels, nota de privacidad y enlaces verificables", async ({ page }) => {
    await openChecked(page, "/es/contacto/");

    await expect(page.locator("form#contactForm")).toBeVisible();
    await expect(page.locator("form#contactForm")).toHaveAttribute("aria-describedby", /contact-note-/);

    await expect(page.locator('label[for="nombre"]')).toBeVisible();
    await expect(page.locator('label[for="correo"]')).toBeVisible();
    await expect(page.locator('label[for="tipoProyecto"]')).toBeVisible();
    await expect(page.locator('label[for="mensaje"]')).toBeVisible();

    await expect(page.locator("#nombre")).toHaveAttribute("required", "");
    await expect(page.locator("#correo")).toHaveAttribute("required", "");
    await expect(page.locator("#tipoProyecto")).toHaveAttribute("required", "");
    await expect(page.locator("#mensaje")).toHaveAttribute("required", "");

    await expect(page.locator('a[href*="linkedin.com/in/diegoarmandodiaz"]')).toBeVisible();
    await expect(page.locator('a[href*="github.com/dadd86"]')).toBeVisible();
  });

  test("language switcher conserva rutas localizadas", async ({ page }) => {
    await openChecked(page, "/es/proceso/");

    await expect(page.locator('.languageSwitcher a[hreflang="es"]')).toHaveAttribute("href", "/es/proceso/");
    await expect(page.locator('.languageSwitcher a[hreflang="en"]')).toHaveAttribute("href", "/en/process/");
    await expect(page.locator('.languageSwitcher a[hreflang="de"]')).toHaveAttribute("href", "/de/prozess/");
  });
});
'@

Write-Utf8NoBom "tools/lighthouse-phase-1-1c.mjs" @'
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
'@

Write-Utf8NoBom "tools/qa-static-phase-1-1c.mjs" @'
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const warnings = [];

const requiredFiles = [
  "dist/es/index.html",
  "dist/en/index.html",
  "dist/de/index.html",
  "dist/es/servicios/index.html",
  "dist/en/services/index.html",
  "dist/de/leistungen/index.html",
  "dist/es/proceso/index.html",
  "dist/en/process/index.html",
  "dist/de/prozess/index.html",
  "dist/es/contacto/index.html",
  "dist/en/contact/index.html",
  "dist/de/kontakt/index.html",
  "dist/sitemap.xml",
  "dist/robots.txt",
  "dist/404.html"
];

const contactFiles = new Set([
  "dist/es/contacto/index.html",
  "dist/en/contact/index.html",
  "dist/de/kontakt/index.html"
]);

const forbiddenOutsideContact = [
  "Diego",
  "Diaz",
  "dadd86",
  "linkedin.com/in/diegoarmandodiaz",
  "github.com/dadd86"
];

function read(file) {
  return readFileSync(file, "utf8");
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function walk(directory) {
  const result = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      result.push(...walk(fullPath));
    } else {
      result.push(fullPath.replaceAll("\\", "/"));
    }
  }

  return result;
}

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Falta archivo requerido: ${file}`);
  }
}

if (existsSync("dist")) {
  const htmlFiles = walk("dist").filter((file) => file.endsWith(".html"));

  for (const file of htmlFiles) {
    const html = read(file);

    const h1Count = (html.match(/<h1[\s>]/g) || []).length;

    if (h1Count !== 1) {
      fail(`${file}: debe tener exactamente 1 h1; encontrado ${h1Count}`);
    }

    if (!/<html\s+lang="(es|en|de)"/.test(html)) {
      fail(`${file}: falta lang válido en html`);
    }

    if (!/<title>[^<]{10,}<\/title>/.test(html)) {
      fail(`${file}: title ausente o demasiado corto`);
    }

    if (!/<meta\s+name="description"\s+content="[^"]{50,}"/.test(html)) {
      fail(`${file}: meta description ausente o demasiado corta`);
    }

    if (!/<link\s+rel="canonical"\s+href="https:\/\/iocode-solutions\.com\//.test(html)) {
      fail(`${file}: canonical ausente o inválido`);
    }

    for (const hreflang of ["es", "en", "de", "x-default"]) {
      if (!html.includes(`hreflang="${hreflang}"`)) {
        fail(`${file}: falta hreflang ${hreflang}`);
      }
    }

    if (!html.includes('"@type":"Organization"')) {
      fail(`${file}: falta schema Organization`);
    }

    if (!html.includes('"@type":"ProfessionalService"')) {
      fail(`${file}: falta schema ProfessionalService`);
    }

    if (!html.includes('"@type":"BreadcrumbList"')) {
      fail(`${file}: falta schema BreadcrumbList`);
    }

    if (!contactFiles.has(file)) {
      for (const forbidden of forbiddenOutsideContact) {
        if (html.includes(forbidden)) {
          fail(`${file}: contiene dato personal fuera de contacto: ${forbidden}`);
        }
      }
    }

    const imageTags = html.match(/<img\b[^>]*>/g) || [];

    for (const imageTag of imageTags) {
      if (!/\salt="[^"]*"/.test(imageTag)) {
        fail(`${file}: imagen sin alt -> ${imageTag}`);
      }
    }

    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || "";

    if (title.length > 70) {
      warn(`${file}: title largo (${title.length} caracteres)`);
    }
  }

  for (const file of contactFiles) {
    if (!existsSync(file)) {
      continue;
    }

    const html = read(file);

    for (const required of [
      "linkedin.com/in/diegoarmandodiaz",
      "github.com/dadd86",
      "contactForm",
      "aria-describedby",
      "mailto:"
    ]) {
      if (!html.includes(required)) {
        fail(`${file}: falta ${required}`);
      }
    }
  }
}

if (existsSync("dist/sitemap.xml")) {
  const sitemap = read("dist/sitemap.xml");

  for (const expected of [
    "xmlns:xhtml",
    "hreflang=\"es\"",
    "hreflang=\"en\"",
    "hreflang=\"de\"",
    "hreflang=\"x-default\"",
    "<lastmod>"
  ]) {
    if (!sitemap.includes(expected)) {
      fail(`sitemap.xml: falta ${expected}`);
    }
  }
}

if (warnings.length > 0) {
  console.warn("Warnings Fase 1.1C:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("Errores Fase 1.1C:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("QA estático Fase 1.1C superado.");
'@

Write-Utf8NoBom "tools/validate-phase-1-1c.ps1" @'
$ErrorActionPreference = "Stop"

Write-Host "Fase 1.1C - validación técnica, visual automatizada, accesibilidad y Lighthouse" -ForegroundColor Cyan

docker compose up -d dev

docker compose exec dev npm run check
docker compose exec dev npm run build
docker compose exec dev npm run audit:prod
docker compose exec dev npm run qa:static

docker compose --profile prod up --build -d web

$urls = @(
  "http://localhost:8080/health",
  "http://localhost:8080/es/",
  "http://localhost:8080/en/",
  "http://localhost:8080/de/",
  "http://localhost:8080/es/proceso/",
  "http://localhost:8080/en/process/",
  "http://localhost:8080/de/prozess/",
  "http://localhost:8080/es/contacto/",
  "http://localhost:8080/en/contact/",
  "http://localhost:8080/de/kontakt/",
  "http://localhost:8080/sitemap.xml",
  "http://localhost:8080/robots.txt",
  "http://localhost:8080/no-existe/",
  "http://localhost:8080/es/proceso"
)

foreach ($url in $urls) {
  Write-Host "HEAD $url" -ForegroundColor DarkCyan
  curl.exe -I $url
}

docker compose --profile prod --profile qa run --rm browser-qa

Write-Host "Fase 1.1C validada. Revisa qa-artifacts si algún test genera reporte." -ForegroundColor Green
'@

Write-Utf8NoBom "docs/QA_PHASE_1_1C.md" @'
# Fase 1.1C - QA visual, accesibilidad y Lighthouse

## Objetivo

Validar que la web no solo compila, sino que también conserva calidad visual, semántica, accesibilidad básica, SEO renderizado y rendimiento mínimo medible.

## Alcance

Páginas críticas:

- `/es/`, `/en/`, `/de/`
- `/es/servicios/`, `/en/services/`, `/de/leistungen/`
- `/es/proceso/`, `/en/process/`, `/de/prozess/`
- `/es/contacto/`, `/en/contact/`, `/de/kontakt/`

## Capas de validación

1. `astro check`.
2. `astro build`.
3. `audit:prod`.
4. QA estático sobre `dist`.
5. Smoke test HTTP sobre producción local.
6. Playwright desktop y móvil.
7. Axe para violaciones críticas/serias.
8. Lighthouse con umbrales conservadores.

## Ejecutar

    powershell -ExecutionPolicy Bypass -File tools\validate-phase-1-1c.ps1

## Umbrales Lighthouse iniciales

- performance: 0.50
- accessibility: 0.90
- best-practices: 0.85
- seo: 0.90

Estos umbrales son conservadores porque la web incluye escena 3D. Se pueden endurecer después de optimizar assets, JS y carga del modelo GLB.

## Criterios de cierre

- `check`: 0 errores.
- `build`: 29 páginas.
- `audit:prod`: 0 vulnerabilidades.
- QA estático sin errores.
- Playwright sin errores.
- Axe sin violaciones críticas o serias.
- Lighthouse por encima de umbrales.
- Smoke test correcto.
- Contacto muestra persona física solo en páginas de contacto.
- Sin overflow horizontal detectado en rutas críticas.
- Un solo h1 por página.

## Pendiente manual

Aunque esta fase automatiza una parte importante, antes de publicar siguen siendo necesarias:

- revisión visual humana en navegador real;
- revisión móvil real;
- prueba de formulario con cliente de correo;
- revisión de consola DevTools;
- Lighthouse en dominio público;
- validación de correo real;
- Search Console tras publicación.
'@

$packageJsonPath = "package.json"
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

if (-not $packageJson.scripts.PSObject.Properties.Name.Contains("qa:static")) {
  $packageJson.scripts | Add-Member -NotePropertyName "qa:static" -NotePropertyValue "node tools/qa-static-phase-1-1c.mjs"
}

if (-not $packageJson.scripts.PSObject.Properties.Name.Contains("qa:browser")) {
  $packageJson.scripts | Add-Member -NotePropertyName "qa:browser" -NotePropertyValue "playwright test"
}

if (-not $packageJson.scripts.PSObject.Properties.Name.Contains("qa:lighthouse")) {
  $packageJson.scripts | Add-Member -NotePropertyName "qa:lighthouse" -NotePropertyValue "node tools/lighthouse-phase-1-1c.mjs"
}

if (-not $packageJson.scripts.PSObject.Properties.Name.Contains("qa:phase-1-1c")) {
  $packageJson.scripts | Add-Member -NotePropertyName "qa:phase-1-1c" -NotePropertyValue "npm run build && npm run qa:static && npm run qa:browser && npm run qa:lighthouse"
}

$packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path $packageJsonPath -Encoding utf8

$composePath = "compose.yml"
$compose = Get-Content $composePath -Raw

$browserQaService = @'
  browser-qa:
    container_name: iocode-solutions-browser-qa
    build:
      context: .
      dockerfile: Docker/Dockerfile.browser-qa
    init: true
    environment:
      CI: "1"
      ASTRO_TELEMETRY_DISABLED: "1"
      PLAYWRIGHT_BASE_URL: "http://web:8080"
      LIGHTHOUSE_BASE_URL: "http://web:8080"
      LH_MIN_PERFORMANCE: "0.50"
      LH_MIN_ACCESSIBILITY: "0.90"
      LH_MIN_BEST_PRACTICES: "0.85"
      LH_MIN_SEO: "0.90"
    depends_on:
      web:
        condition: service_healthy
    volumes:
      - ./qa-artifacts:/app/qa-artifacts
    profiles:
      - qa

'@

if ($compose -notmatch "(?m)^\s{2}browser-qa:") {
  $compose = $compose -replace "(?m)^volumes:\s*$", "$browserQaService`r`nvolumes:"
  Write-Utf8NoBom $composePath $compose
}

Add-TextIfMissing ".gitignore" "qa-artifacts/" @'

# Phase 1.1C QA artifacts
qa-artifacts/
playwright-report/
test-results/
'@

Write-Host "Fase 1.1C aplicada: QA visual, accesibilidad básica y Lighthouse configurados." -ForegroundColor Green
Write-Host "Ejecuta ahora: powershell -ExecutionPolicy Bypass -File tools\validate-phase-1-1c.ps1" -ForegroundColor Cyan