import { expect, test } from "@playwright/test";

const routeCases = [
  {
    route: "/es/habilidades/",
    requiredTerms: ["PLC", "OPC UA", "Docker", "ERP"],
    requiredLocalizedTerms: ["automatización", "datos", "tecnologías"]
  },
  {
    route: "/en/skills/",
    requiredTerms: ["PLC", "OPC UA", "Docker", "ERP"],
    requiredLocalizedTerms: ["automation", "data", "technologies"]
  },
  {
    route: "/de/faehigkeiten/",
    requiredTerms: ["SPS", "OPC UA", "Docker", "ERP"],
    requiredLocalizedTerms: ["automatisierung", "daten", "technologien"]
  }
];

const forbiddenTexts = [
  "guaranteed",
  "100% secure",
  "testimonial",
  "AggregateRating",
  "review rating",
  "cliente real",
  "producción certificada",
  "mejora del"
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function expectTextToInclude(haystack: string, needle: string): void {
  expect(normalizeText(haystack).includes(normalizeText(needle))).toBe(true);
}

function expectTextNotToInclude(haystack: string, needle: string): void {
  expect(normalizeText(haystack).includes(normalizeText(needle))).toBe(false);
}

test.describe("Fase 3 - Habilidades por intención de búsqueda", () => {
  for (const routeCase of routeCases) {
    test(`${routeCase.route} muestra matriz de habilidades orientada a valor`, async ({ page }) => {
      await page.goto(routeCase.route, {
        waitUntil: "domcontentloaded"
      });

      await expect(page.locator("main")).toBeVisible();

      const cards = page.locator(".skillBlock");
      const cardCount = await cards.count();

      expect(cardCount).toBeGreaterThanOrEqual(8);

      const pageText = await page.locator("main").innerText();

      for (const term of routeCase.requiredTerms) {
        expectTextToInclude(pageText, term);
      }

      for (const term of routeCase.requiredLocalizedTerms) {
        expectTextToInclude(pageText, term);
      }

      for (const forbiddenText of forbiddenTexts) {
        expectTextNotToInclude(pageText, forbiddenText);
      }

      for (const card of await cards.all()) {
        await expect(card.locator("h2")).toBeVisible();
        await expect(card.locator(".skillEvidence")).toBeVisible();
        await expect(card.locator(".skillUseCases")).toBeVisible();
        await expect(card.locator(".skillLinks").first()).toBeVisible();

        const text = await card.innerText();

        expect(text.length).toBeGreaterThan(450);

        const links = card.locator("a");

        for (const link of await links.all()) {
          const href = await link.getAttribute("href");

          expect(href).toBeTruthy();

          if (href) {
            expect(href.startsWith("/") || href.startsWith("https://")).toBe(true);
          }
        }
      }
    });
  }
});