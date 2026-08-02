import { expect, test } from "@playwright/test";
import axe from "axe-core";

const siteUrl = "https://iocode-solutions.com";
const locales = ["es", "en", "de"] as const;
const routeGroups = [
  ["/es/", "/en/", "/de/"],
  ["/es/servicios/", "/en/services/", "/de/leistungen/"],
  ["/es/automatizacion-plc/", "/en/plc-automation/", "/de/sps-automatisierung/"],
  ["/es/robotica-industrial/", "/en/industrial-robotics/", "/de/industrierobotik/"],
  ["/es/empresa/", "/en/company/", "/de/unternehmen/"],
  ["/es/proyectos/", "/en/projects/", "/de/projekte/"],
  ["/es/habilidades/", "/en/skills/", "/de/faehigkeiten/"],
  ["/es/proceso/", "/en/process/", "/de/prozess/"],
  ["/es/contacto/", "/en/contact/", "/de/kontakt/"]
] as const;

const localizedRoutes = routeGroups.flatMap((paths) =>
  paths.map((path, index) => ({ path, locale: locales[index]!, alternates: paths }))
);

const responsiveRoutes = [
  "/es/",
  "/en/services/",
  "/de/prozess/",
  "/es/contacto/",
  "/en/legal-notice/",
  "/de/datenschutz/"
];

const legalByLocale = {
  es: ["/es/aviso-legal/", "/es/privacidad/"],
  en: ["/en/legal-notice/", "/en/privacy/"],
  de: ["/de/impressum/", "/de/datenschutz/"]
} as const;

test.describe("Fase 9B - SEO técnico recíproco en 27 rutas", () => {
  for (const route of localizedRoutes) {
    test(`${route.path} canonical, hreflang y metadata social`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "chromium-desktop", "Gate SEO único en Chromium desktop.");
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${siteUrl}${route.path}`);

      for (const [index, hreflang] of locales.entries()) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveAttribute(
          "href",
          `${siteUrl}${route.alternates[index]!}`
        );
      }
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        "href",
        `${siteUrl}${route.alternates[0]}`
      );

      for (const property of ["og:title", "og:description", "og:image", "og:url", "og:locale"]) {
        await expect(page.locator(`meta[property="${property}"]`)).toHaveAttribute("content", /.+/u);
      }
      for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:url"]) {
        await expect(page.locator(`meta[name="${name}"]`)).toHaveAttribute("content", /.+/u);
      }
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `${siteUrl}${route.path}`);
      await expect(page.locator('meta[name="twitter:url"]')).toHaveAttribute("content", `${siteUrl}${route.path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/iocode-solutions\.com\//u);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /^https:\/\/iocode-solutions\.com\//u);

      for (const legalPath of legalByLocale[route.locale]) {
        await expect(page.locator(`footer a[href="${legalPath}"]`)).toBeVisible();
      }
    });
  }

  test("sitemap index, sitemap de rutas y robots están alineados", async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-desktop", "Gate de endpoints único.");
    const [indexResponse, sitemapResponse, robotsResponse] = await Promise.all([
      request.get("/sitemap-index.xml"),
      request.get("/sitemap.xml"),
      request.get("/robots.txt")
    ]);
    expect(indexResponse.status()).toBe(200);
    expect(sitemapResponse.status()).toBe(200);
    expect(robotsResponse.status()).toBe(200);
    expect(await indexResponse.text()).toContain(`<loc>${siteUrl}/sitemap.xml</loc>`);
    const sitemap = await sitemapResponse.text();
    for (const { path } of localizedRoutes) expect(sitemap).toContain(`<loc>${siteUrl}${path}</loc>`);
    expect(await robotsResponse.text()).toContain(`Sitemap: ${siteUrl}/sitemap-index.xml`);
  });
});

test.describe("Fase 9B - responsive, interacción y WCAG 2.1 AA", () => {
  for (const route of responsiveRoutes) {
    test(`${route} sin overflow y con landmarks`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => {
        const logo = document.querySelector<HTMLElement>(".brand__logo");
        return logo && logo.getBoundingClientRect().width > 0 && logo.getBoundingClientRect().width < 160;
      });
      await expect(page.locator("body > header.siteHeader")).toHaveCount(1);
      await expect(page.locator("main#contenido")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      const overflow = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .map((element) => ({
            element: `${element.tagName.toLowerCase()}.${element.className}`,
            left: element.getBoundingClientRect().left,
            right: element.getBoundingClientRect().right,
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth
          }))
          .filter(({ left, right, scrollWidth, clientWidth }) => left < -2 || right > viewportWidth + 2 || scrollWidth > clientWidth + 2)
          .slice(0, 12);
        return {
          hasOverflow: document.documentElement.scrollWidth > viewportWidth + 2,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth,
          offenders
        };
      });
      expect(overflow.hasOverflow, JSON.stringify(overflow, null, 2)).toBe(false);
    });
  }

  test("menú móvil funciona por teclado y expone navegación localizada", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "chromium-desktop", "Gate específico para menú responsive.");
    await page.goto("/de/", { waitUntil: "domcontentloaded" });
    const menu = page.locator("details.mobileMenu");
    const toggle = menu.locator("summary");
    await expect(menu).toBeVisible();
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("open", "");
    await expect(menu.locator('.navLinks--mobile a[href="/de/kontakt/"]')).toBeVisible();
  });

  test("formulario móvil prepara mailto sin backend", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "chromium-desktop", "Gate de interacción móvil.");
    await page.goto("/es/contacto/", { waitUntil: "domcontentloaded" });
    await page.locator("#nombre-es").fill("QA Mobile");
    await page.locator("#correo-es").fill("qa@example.com");
    await page.locator("#tipoProyecto-es").selectOption({ index: 1 });
    await page.locator("#mensaje-es").fill("Mensaje de validación accesible con longitud suficiente para el formulario.");
    await page.locator("#contactForm").evaluate((form: HTMLFormElement) => form.addEventListener("submit", (event) => event.preventDefault(), { once: true }));
    await page.locator('#contactForm button[type="submit"]').click();
    await expect(page.locator("#contactForm")).toHaveAttribute("data-last-mailto", /^mailto:contact@iocode-solutions\.com/u);
  });

  test("Axe WCAG 2.1 AA, foco y reduced motion", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-desktop", "Gate Axe completo en desktop.");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/de/datenschutz/", { waitUntil: "domcontentloaded" });
    await page.addScriptTag({ content: axe.source });
    const violations = await page.evaluate(async () => {
      const result = await (window as typeof window & { axe: typeof axe }).axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }
      });
      return result.violations.filter((violation) => ["critical", "serious"].includes(violation.impact || ""));
    });
    expect(violations).toEqual([]);
    await page.keyboard.press("Tab");
    await expect(page.locator(".skipLink")).toBeFocused();
    const reduced = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(reduced).toBe("auto");
  });
});
