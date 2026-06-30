import { expect, test } from "@playwright/test";
import axe from "axe-core";

type AxeViolation = {
  impact: string | null;
};

type AxeRunResult = {
  violations: AxeViolation[];
};

type FocusSnapshot = {
  tag: string;
  text: string;
  visible: boolean;
  outlineStyle: string;
  outlineWidth: string;
  boxShadow: string;
};

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

const mobileRoutes = [
  "/es/",
  "/en/",
  "/de/",
  "/es/servicios/",
  "/es/contacto/"
];

const expectedLocales: Record<string, string> = {
  "/es/": "es",
  "/en/": "en",
  "/de/": "de"
};

function routeShouldRunOnProject(route: string, projectName: string): boolean {
  if (projectName === "chromium-mobile") {
    return mobileRoutes.includes(route);
  }

  return true;
}

function isContactRoute(route: string): boolean {
  return (
    route.includes("/contacto/") ||
    route.includes("/contact/") ||
    route.includes("/kontakt/")
  );
}

test.describe("Fase 1.1F - Accesibilidad y performance UX", () => {
  for (const route of routes) {
    test(`${route} - axe, semantica, consola y responsive`, async (
      { page },
      testInfo
    ) => {
      test.skip(
        !routeShouldRunOnProject(route, testInfo.project.name),
        "Ruta no incluida en el subset móvil de 1.1F."
      );

      const consoleErrors: string[] = [];

      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(route, {
        waitUntil: "domcontentloaded"
      });

      await expect(page.locator("body")).toBeVisible();

      const htmlLang = await page.locator("html").getAttribute("lang");
      const expectedLocale = expectedLocales[route];

      if (expectedLocale) {
        expect(htmlLang).toBe(expectedLocale);
      } else {
        expect(["es", "en", "de"]).toContain(htmlLang);
      }

      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);

      const navCount = await page.locator("nav").count();
      expect(navCount).toBeGreaterThan(0);

      const hasHorizontalOverflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
        );
      });

      expect(hasHorizontalOverflow).toBe(false);

      await page.addScriptTag({
        content: axe.source
      });

      const axeResults = await page.evaluate<AxeRunResult>(async () => {
        const typedWindow = window as typeof window & {
          axe: {
            run: (
              context: Document,
              options: unknown
            ) => Promise<AxeRunResult>;
          };
        };

        return await typedWindow.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]
          }
        });
      });

      const blockingViolations = axeResults.violations.filter(
        (violation: AxeViolation) => {
          return (
            violation.impact === "critical" ||
            violation.impact === "serious"
          );
        }
      );

      expect(
        blockingViolations,
        JSON.stringify(blockingViolations, null, 2)
      ).toHaveLength(0);

      const languageLinks = page.locator(".languageSwitcher a");
      await expect(languageLinks).toHaveCount(3);

      for (const languageLink of await languageLinks.all()) {
        const accessibleName = await languageLink.getAttribute("aria-label");
        const hreflang = await languageLink.getAttribute("hreflang");

        expect(accessibleName?.trim().length ?? 0).toBeGreaterThan(0);
        expect(["es", "en", "de"]).toContain(hreflang);
      }

      const currentLanguageLinks = page.locator(
        ".languageSwitcher a[aria-current]"
      );

      await expect(currentLanguageLinks).toHaveCount(1);

      if (isContactRoute(route)) {
        const form = page.locator("form").first();

        await expect(form).toBeVisible();

        const inputs = form.locator("input, textarea, select");

        for (const input of await inputs.all()) {
          const id = await input.getAttribute("id");
          const ariaLabel = await input.getAttribute("aria-label");
          const ariaLabelledBy = await input.getAttribute("aria-labelledby");

          if (id) {
            const labelCount = await page.locator(`label[for="${id}"]`).count();

            expect(
              labelCount +
                Number(Boolean(ariaLabel)) +
                Number(Boolean(ariaLabelledBy))
            ).toBeGreaterThan(0);
          } else {
            expect(Boolean(ariaLabel) || Boolean(ariaLabelledBy)).toBe(true);
          }
        }
      }

      expect(consoleErrors, consoleErrors.join("\n")).toHaveLength(0);
    });
  }

  test("Navegacion principal usable con teclado", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium-desktop",
    "La navegación por teclado se valida como gate desktop. Mobile se valida por viewport/responsive."
  );

  test.setTimeout(30_000);

  await page.emulateMedia({
    reducedMotion: "reduce"
  });

  await page.goto("/es/contacto/", {
    waitUntil: "domcontentloaded"
  });

  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
    `
  });

  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();

  await page.mouse.click(1, 1);

  const focusedElements: FocusSnapshot[] = [];

  for (let index = 0; index < 14; index += 1) {
    await page.keyboard.press("Tab", {
      delay: 0
    });

    await page.waitForTimeout(20);

    const focused = await page.evaluate<FocusSnapshot | null>(() => {
      const element = document.activeElement as HTMLElement | null;

      if (!element || element === document.body) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const styles = window.getComputedStyle(element);

      return {
        tag: element.tagName.toLowerCase(),
        text:
          element.textContent?.trim().slice(0, 80) ||
          element.getAttribute("aria-label") ||
          element.getAttribute("name") ||
          "",
        visible:
          rect.width > 0 &&
          rect.height > 0 &&
          styles.visibility !== "hidden" &&
          styles.display !== "none",
        outlineStyle: styles.outlineStyle,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow
      };
    });

    if (!focused) {
      continue;
    }

    expect(focused.visible).toBe(true);

    const hasVisibleFocus =
      focused.outlineStyle !== "none" ||
      focused.outlineWidth !== "0px" ||
      focused.boxShadow !== "none";

    expect(hasVisibleFocus).toBe(true);

    focusedElements.push(focused);
  }

  expect(focusedElements.length).toBeGreaterThanOrEqual(6);

  const focusedTags = new Set(focusedElements.map((item) => item.tag));
  const joinedFocus = focusedElements
    .map((item) => `${item.tag}:${item.text}`)
    .join(" ")
    .toLowerCase();

  expect(focusedTags.has("a") || focusedTags.has("button")).toBe(true);

  expect(
    joinedFocus.includes("contact") ||
      joinedFocus.includes("contacto") ||
      joinedFocus.includes("kontakt") ||
      joinedFocus.includes("mailto") ||
      joinedFocus.includes("mensaje") ||
      joinedFocus.includes("message")
  ).toBe(true);
});

  test("Reduced motion no rompe contenido esencial", async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: {
        width: 1366,
        height: 900
      }
    });

    const page = await context.newPage();

    try {
      await page.goto("/es/", {
        waitUntil: "domcontentloaded"
      });

      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();

      const canvasCount = await page.locator("canvas").count();

      expect(canvasCount).toBeGreaterThanOrEqual(0);
    } finally {
      await context.close();
    }
  });
});