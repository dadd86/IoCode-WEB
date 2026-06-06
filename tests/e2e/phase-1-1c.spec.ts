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

test.describe("Fase 1.1C - estructura, responsive y accesibilidad bÃ¡sica", () => {
  for (const route of routes) {
    test(`${route.path} renderiza sin errores crÃ­ticos`, async ({ page }, testInfo) => {
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
      expect(navCurrentCount, `${route.path} debe marcar la pÃ¡gina activa en navegaciÃ³n`).toBeGreaterThanOrEqual(1);

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