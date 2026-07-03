import { expect, test } from "@playwright/test";

const routeCases = [
  {
    route: "/es/contacto/",
    terms: ["contacto", "preparar correo", "copiar email", "qué no enviar"]
  },
  {
    route: "/en/contact/",
    terms: ["contact", "prepare email", "copy email", "what not to send"]
  },
  {
    route: "/de/kontakt/",
    terms: ["kontakt", "e-mail vorbereiten", "e-mail kopieren", "was noch nicht gesendet werden sollte"]
  }
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function expectTextToInclude(haystack: string, needle: string): void {
  const normalizedHaystack = normalizeText(haystack);
  const normalizedNeedle = normalizeText(needle);

  expect(normalizedHaystack.includes(normalizedNeedle)).toBe(true);
}

function expectTextNotToInclude(haystack: string, needle: string): void {
  const normalizedHaystack = normalizeText(haystack);
  const normalizedNeedle = normalizeText(needle);

  expect(normalizedHaystack.includes(normalizedNeedle)).toBe(false);
}

test.describe("Fase 4 - Contacto, conversión y confianza", () => {
  for (const routeCase of routeCases) {
    test(`${routeCase.route} prepara contacto sin datos sensibles`, async ({ page }) => {
      await page.goto(routeCase.route, {
        waitUntil: "domcontentloaded"
      });

      await expect(page.locator("main")).toBeVisible();

      const mainText = await page.locator("main").innerText();

      for (const term of routeCase.terms) {
        expectTextToInclude(mainText, term);
      }

      const form = page.locator("form[data-contact-email]");

      await expect(form).toBeVisible();
      await expect(page.locator("[data-contact-email-link]")).toBeVisible();
      await expect(page.locator("[data-contact-copy]")).toBeVisible();

      await expect(page.locator('input[type="password"]')).toHaveCount(0);
      await expect(page.locator('input[type="file"]')).toHaveCount(0);

      const email = await form.getAttribute("data-contact-email");
      expect(email).toBe("contact@iocode-solutions.com");

      const verificationStatus = await form.getAttribute("data-email-verification-status");
      expect(verificationStatus).toBe("verified");

      await page.locator('input[name="nombre"]').fill("QA Contact");
      await page.locator('input[name="correo"]').fill("qa@example.com");
      await page.locator('select[name="tipoProyecto"]').selectOption({ index: 1 });
      await page.locator('textarea[name="mensaje"]').fill(
        "This is a phase four QA message with enough length to validate the mailto generation without sending sensitive data."
      );

      await form.evaluate((formElement: Element) => {
        const htmlForm = formElement as HTMLFormElement;

        htmlForm.addEventListener(
          "submit",
          (event: Event) => {
            event.preventDefault();
          },
          { once: true }
        );
      });

      await page.locator('button[type="submit"]').click();

      const mailto = await form.getAttribute("data-last-mailto");
      const safeMailto = mailto ?? "";

      expect(mailto).toBeTruthy();
      expect(safeMailto.includes("mailto:contact@iocode-solutions.com")).toBe(true);
      expect(safeMailto.includes("subject=")).toBe(true);
      expect(safeMailto.includes("body=")).toBe(true);

      for (const forbidden of ["password field", "upload file", "attach confidential files"]) {
        expectTextNotToInclude(mainText, forbidden);
      }
    });
  }
});