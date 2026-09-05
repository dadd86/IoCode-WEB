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
    const storage = await page.evaluate(async () => {
      const databases =
        "databases" in indexedDB ? await indexedDB.databases() : [];
      const registrations =
        "serviceWorker" in navigator
          ? await navigator.serviceWorker.getRegistrations()
          : [];
      return {
        local: window.localStorage.length,
        session: window.sessionStorage.length,
        indexedDbDatabases: databases.length,
        serviceWorkerRegistrations: registrations.length
      };
    });
    expect(storage, path).toEqual({
      local: 0,
      session: 0,
      indexedDbDatabases: 0,
      serviceWorkerRegistrations: 0
    });
  }
});

test("privacidad expone responsable, contacto, derechos, autoridad y versión", async ({ page }) => {
  await page.goto("/de/datenschutz/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Anbieterkennzeichnung gemäß § 5 DDG", { exact: true })).toBeVisible();
  await expect(page.getByText("Beschwerderecht bei einer Aufsichtsbehörde", { exact: true })).toBeVisible();
  await expect(page.getByText("Rechte der betroffenen Person", { exact: false })).toBeVisible();
  await expect(page.getByText("Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen", { exact: false })).toBeVisible();
  await expect(page.getByText("2026-09-05.3", { exact: true })).toBeVisible();
});

test("impressum expone contacto directo con teléfono verificable", async ({ page }) => {
  await page.goto("/de/impressum/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href^="tel:+4915734353705"]')).toBeVisible();
  await expect(page.getByText("DE461105535", { exact: true })).toBeVisible();
});

test("alias histórico inglés redirige al imprint canónico", async ({ request }) => {
  const response = await request.get("/en/legal-notice/", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/en/imprint/");
});

test("alias públicos de privacidad redirigen a la ruta canónica localizada", async ({ request }) => {
  for (const [alias, canonical] of [
    ["/datenschutz", "/de/datenschutz/"],
    ["/privacy-policy", "/en/privacy/"],
    ["/politica-privacidad", "/es/privacidad/"]
  ] as const) {
    const response = await request.get(alias, { maxRedirects: 0 });
    expect(response.status(), alias).toBe(308);
    expect(response.headers().location, alias).toBe(canonical);
  }
});
