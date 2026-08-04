import { test, expect } from "@playwright/test";

const routes = {
  es: [
    "/es/", "/es/servicios/", "/es/automatizacion-plc/", "/es/robotica-industrial/",
    "/es/empresa/", "/es/proyectos/", "/es/habilidades/", "/es/proceso/", "/es/contacto/",
    "/es/aviso-legal/", "/es/privacidad/"
  ],
  en: [
    "/en/", "/en/services/", "/en/plc-automation/", "/en/industrial-robotics/",
    "/en/company/", "/en/projects/", "/en/skills/", "/en/process/", "/en/contact/",
    "/en/imprint/", "/en/privacy/"
  ],
  de: [
    "/de/", "/de/leistungen/", "/de/sps-automatisierung/", "/de/industrierobotik/",
    "/de/unternehmen/", "/de/projekte/", "/de/faehigkeiten/", "/de/prozess/", "/de/kontakt/",
    "/de/impressum/", "/de/datenschutz/"
  ]
} as const;

const legalPaths = {
  es: ["/es/aviso-legal/", "/es/privacidad/"],
  en: ["/en/imprint/", "/en/privacy/"],
  de: ["/de/impressum/", "/de/datenschutz/"]
} as const;

for (const locale of ["es", "en", "de"] as const) {
  test(`footer ${locale} mantiene enlaces legales en todas las rutas`, async ({ page }) => {
    for (const path of routes[locale]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const footer = page.locator("footer .footerLegal");
      await expect(footer.locator(`a[href="${legalPaths[locale][0]}"]`), path).toHaveCount(1);
      await expect(footer.locator(`a[href="${legalPaths[locale][1]}"]`), path).toHaveCount(1);
    }
  });
}

test("seis páginas legales son navegables, localizadas y transparentes", async ({ page }) => {
  for (const [locale, paths] of Object.entries(legalPaths)) {
    for (const path of paths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("article.legalPage")).toBeVisible();
      expect(await page.locator('a[href^="mailto:contact@iocode-solutions.com"]').count(), path).toBeGreaterThan(0);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, path).toBeTruthy();
      expect(new URL(canonical || "http://invalid/").pathname, path).toBe(path);
    }
  }
});

test("el release no crea cookies ni almacenamiento web persistente", async ({ page, context }) => {
  for (const path of ["/es/", "/en/contact/", "/de/datenschutz/"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    expect(await context.cookies(), path).toEqual([]);
    const storage = await page.evaluate(() => ({
      local: window.localStorage.length,
      session: window.sessionStorage.length
    }));
    expect(storage, path).toEqual({ local: 0, session: 0 });
  }
});

test("privacidad expone proveedores, autoridad, derechos y versión", async ({ page }) => {
  await page.goto("/de/datenschutz/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByText("Aufsichtsbehörde", { exact: true })).toBeVisible();
  await expect(page.getByText("Betroffenenrechte", { exact: false })).toBeVisible();
  await expect(page.getByText("2026-08-04.1", { exact: true })).toBeVisible();
});

test("alias histórico inglés redirige al imprint canónico", async ({ request }) => {
  const response = await request.get("/en/legal-notice/", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/en/imprint/");
});
