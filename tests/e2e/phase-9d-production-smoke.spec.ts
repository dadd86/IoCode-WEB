import { expect, test } from "@playwright/test";

const homes = [
  { path: "/es/", locale: "es" },
  { path: "/en/", locale: "en" },
  { path: "/de/", locale: "de" }
] as const;

const internalRoutes = [
  "/es/servicios/",
  "/en/services/",
  "/de/leistungen/",
  "/es/contacto/",
  "/en/contact/",
  "/de/kontakt/"
] as const;

const missingRoutes = [
  { path: "/es/no-existe-9d/", locale: "es" },
  { path: "/en/not-found-9d/", locale: "en" },
  { path: "/de/nicht-gefunden-9d/", locale: "de" }
] as const;

test.describe("Fase 9D - smoke de release", () => {
  test("home ES, EN y DE responde y conserva idioma, header y footer", async ({
    page
  }) => {
    for (const route of homes) {
      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded"
      });

      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
      await expect(page.locator("body > header.siteHeader")).toBeVisible();
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator("body > footer.siteFooter")).toBeVisible();
    }
  });

  test("rutas internas críticas responden 200", async ({ request }) => {
    for (const path of internalRoutes) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toContain("text/html");
    }
  });

  test("404 conserva status real y contenido localizado", async ({ page }) => {
    for (const route of missingRoutes) {
      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded"
      });

      expect(response?.status(), route.path).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
      await expect(
        page.locator(`[data-localized-404="${route.locale}"]`)
      ).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, follow"
      );
    }
  });

  test("header, selector de idioma y footer legal navegan a rutas válidas", async ({
    page
  }) => {
    await page.goto("/es/", { waitUntil: "domcontentloaded" });

    const requiredLinks = [
      "/es/servicios/",
      "/en/",
      "/de/",
      "/es/aviso-legal/",
      "/es/privacidad/"
    ];

    for (const href of requiredLinks) {
      const locator = page.locator(`a[href="${href}"]`);
      expect(await locator.count(), href).toBeGreaterThan(0);
      const response = await page.request.get(href);
      expect(response.status(), href).toBe(200);
    }
  });

  test("contacto ofrece mailto válido sin backend", async ({ page }) => {
    for (const path of ["/es/contacto/", "/en/contact/", "/de/kontakt/"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const mailto = page.locator(
        'a[href^="mailto:contact@iocode-solutions.com"]'
      );
      expect(await mailto.count(), path).toBeGreaterThan(0);
    }
  });

  test("alias /es/impressum/ redirige al aviso legal canónico", async ({
    request
  }) => {
    const response = await request.get("/es/impressum/", {
      maxRedirects: 0
    });

    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("/es/aviso-legal/");
  });

  test("no aparecen errores CSP ni excepciones de página", async ({ page }) => {
    const violations: string[] = [];

    page.on("console", (message) => {
      const text = message.text();
      if (
        message.type() === "error" ||
        /content security policy|refused to/iu.test(text)
      ) {
        violations.push(`${message.type()}: ${text}`);
      }
    });
    page.on("pageerror", (error) => violations.push(`pageerror: ${error.message}`));

    for (const path of ["/es/", "/en/", "/de/", "/es/contacto/"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main h1")).toBeVisible();
    }

    expect(violations).toEqual([]);
  });
});
