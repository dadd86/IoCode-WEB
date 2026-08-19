import { expect, test } from "@playwright/test";

const routes = [
  "/es/proyectos/",
  "/en/projects/",
  "/de/projekte/"
];

const requiredTexts = [
  "IoCode-WEB",
  "TechWizards",
  "HotelSOL",
  "WoodShops"
];

const forbiddenTexts = [
  "guaranteed",
  "100% secure",
  "testimonial",
  "aggregate rating",
  "AggregateRating",
  "review rating",
  "cliente real",
  "producción certificada",
  "mejora del"
];

test.describe("Fase 2 - Proyectos como evidencia comercial", () => {
  for (const route of routes) {
    test(`${route} muestra proyectos con evidencia comercial`, async ({ page }) => {
      await page.goto(route, {
        waitUntil: "domcontentloaded"
      });

      await expect(page.locator("main")).toBeVisible();

      const cards = page.locator(".projectCard");
      const cardCount = await cards.count();

      expect(cardCount).toBeGreaterThanOrEqual(8);

      const pageText = await page.locator("main").innerText();

      for (const requiredText of requiredTexts) {
        expect(pageText).toContain(requiredText);
      }

      for (const forbiddenText of forbiddenTexts) {
        expect(pageText.toLowerCase()).not.toContain(forbiddenText.toLowerCase());
      }

      for (const card of await cards.all()) {
        await expect(card.locator("h2")).toBeVisible();

        const text = await card.innerText();

        expect(text.length).toBeGreaterThan(300);

        expect(text.toLowerCase()).toMatch(/problem|problema|lösung|solution|solución/);
        expect(text.toLowerCase()).toMatch(/evidence|evidencia|nachweis/);
        expect(text.toLowerCase()).toMatch(/claim|cautela|caution|hinweis/);

        const links = card.locator("a");

        for (const link of await links.all()) {
          const href = await link.getAttribute("href");

          if (href) {
            expect(href.startsWith("https://") || href.startsWith("/")).toBe(true);
          }
        }
      }
    });
  }

  test("las fichas publican canonical, alternates y SoftwareSourceCode", async ({ page }) => {
    await page.goto("/es/proyectos/plataforma-web-industrial-iocode/", {
      waitUntil: "domcontentloaded"
    });

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://iocode-solutions.com/es/proyectos/plataforma-web-industrial-iocode/"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      "https://iocode-solutions.com/en/projects/iocode-industrial-web-platform/"
    );
    await expect(page.locator('.languageSwitcher').first().locator('a[hreflang="en"]')).toHaveAttribute(
      "href",
      "/en/projects/iocode-industrial-web-platform/"
    );
    const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
    expect(structuredData).toContain("SoftwareSourceCode");
  });
});
