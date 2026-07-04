import { mkdirSync } from "node:fs";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

type ViewportCase = {
  name: string;
  width: number;
  height: number;
};

type RouteCase = {
  key: string;
  route: string;
  contact?: boolean;
  hero?: boolean;
};

const screenshotRoot = "qa-artifacts/ui-accessibility/phase-5/screenshots";

test.setTimeout(90_000);

const viewports: ViewportCase[] = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 720 },
  { name: "desktop-1440", width: 1440, height: 900 }
];

const routes: RouteCase[] = [
  { key: "es-home", route: "/es/", hero: true },
  { key: "en-home", route: "/en/", hero: true },
  { key: "de-home", route: "/de/", hero: true },

  { key: "es-services", route: "/es/servicios/" },
  { key: "en-services", route: "/en/services/" },
  { key: "de-services", route: "/de/leistungen/" },

  { key: "es-process", route: "/es/proceso/" },
  { key: "en-process", route: "/en/process/" },
  { key: "de-process", route: "/de/prozess/" },

  { key: "es-projects", route: "/es/proyectos/" },
  { key: "en-projects", route: "/en/projects/" },
  { key: "de-projects", route: "/de/projekte/" },

  { key: "es-skills", route: "/es/habilidades/" },
  { key: "en-skills", route: "/en/skills/" },
  { key: "de-skills", route: "/de/faehigkeiten/" },

  { key: "es-contact", route: "/es/contacto/", contact: true },
  { key: "en-contact", route: "/en/contact/", contact: true },
  { key: "de-contact", route: "/de/kontakt/", contact: true }
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

function getPrivacyTermForRoute(route: string): string {
  if (route.startsWith("/en/")) {
    return "passwords";
  }

  if (route.startsWith("/de/")) {
    return "passworter";
  }

  return "contrasenas";
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const hasOverflow = await page.evaluate(() => {
    const documentElement = document.documentElement;
    const body = document.body;

    const scrollWidth = Math.max(
      documentElement.scrollWidth,
      body?.scrollWidth ?? 0
    );

    return scrollWidth > window.innerWidth + 2;
  });

  expect(hasOverflow).toBe(false);
}

async function expectLandmarks(page: Page): Promise<void> {
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator("main h1").first()).toBeVisible();

  const emptyLinks = await page.locator("a").evaluateAll((links) =>
    links.filter((link) => {
      const text = link.textContent?.trim() ?? "";
      const ariaLabel = link.getAttribute("aria-label")?.trim() ?? "";
      return text.length === 0 && ariaLabel.length === 0;
    }).length
  );

  expect(emptyLinks).toBe(0);

  const unnamedButtons = await page.locator("button").evaluateAll((buttons) =>
    buttons.filter((button) => {
      const text = button.textContent?.trim() ?? "";
      const ariaLabel = button.getAttribute("aria-label")?.trim() ?? "";
      return text.length === 0 && ariaLabel.length === 0;
    }).length
  );

  expect(unnamedButtons).toBe(0);
}

async function expectKeyboardAccess(page: Page): Promise<void> {
  await page.keyboard.press("Tab");

  const firstFocusedHref = await page.evaluate(() => {
    const activeElement = document.activeElement as HTMLAnchorElement | null;
    return activeElement?.getAttribute("href") ?? "";
  });

  expect(firstFocusedHref).toBe("#contenido");

  const focusVisible = await page.evaluate(() => {
    const activeElement = document.activeElement as HTMLElement | null;

    if (!activeElement) {
      return false;
    }

    const styles = window.getComputedStyle(activeElement);

    return (
      styles.outlineStyle !== "none" ||
      Number.parseFloat(styles.outlineWidth || "0") > 0 ||
      styles.boxShadow !== "none"
    );
  });

  expect(focusVisible).toBe(true);

  await page.keyboard.press("Enter");

  const activeElementId = await page.evaluate(() => document.activeElement?.id ?? "");
  const hashAfterSkip = page.url().split("#")[1] ?? "";

  expect(activeElementId === "contenido" || hashAfterSkip === "contenido").toBe(true);
}

async function expectContactForm(page: Page, route: string): Promise<void> {
  const form = page.locator("form[data-contact-email]");

  await expect(form).toBeVisible();
  await expect(page.locator("[data-contact-email-link]")).toBeVisible();
  await expect(page.locator("[data-contact-copy]")).toBeVisible();

  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  await expect(page.locator('input[type="file"]')).toHaveCount(0);

  const requiredFields = await form.locator("[required]").count();
  expect(requiredFields).toBeGreaterThanOrEqual(4);

  const formText = await form.innerText();
  expectTextToInclude(formText, getPrivacyTermForRoute(route));

  await page.locator('input[name="nombre"]').fill("QA UI");
  await page.locator('input[name="correo"]').fill("qa@example.com");
  await page.locator('select[name="tipoProyecto"]').selectOption({ index: 1 });
  await page.locator('textarea[name="mensaje"]').fill(
    "This is a phase five accessibility QA message with enough length to validate the contact form without sending sensitive data."
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

  expect(safeMailto.includes("mailto:contact@iocode-solutions.com")).toBe(true);
  expect(safeMailto.includes("subject=")).toBe(true);
  expect(safeMailto.includes("body=")).toBe(true);
}

async function expectHeroBehavior(page: Page): Promise<void> {
  const hero = page.locator("[data-hero3d]");

  await expect(hero).toBeVisible();
  await expect(page.locator("[data-hero-viewer]")).toHaveAttribute("aria-hidden", "true");

  const focusableCanvasCount = await page.locator("[data-hero-viewer] canvas[tabindex]").count();
  expect(focusableCanvasCount).toBe(0);

  const heroLinks = await hero.locator("a").count();
  expect(heroLinks).toBeGreaterThan(0);
}

async function waitForStableScreenshotState(page: Page): Promise<void> {
  await page.waitForLoadState("load");

  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    if ("fonts" in document) {
      await document.fonts.ready;
    }
  });

  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
        caret-color: transparent !important;
      }

      html,
      body {
        scroll-behavior: auto !important;
      }
    `
  }).catch(() => undefined);

  await page.waitForTimeout(750);
}

async function captureQaScreenshot(page: Page, path: string): Promise<void> {
  await waitForStableScreenshotState(page);

  const viewport = page.viewportSize() ?? {
    width: 1280,
    height: 720
  };

  const attempts: Array<() => Promise<Buffer>> = [
    async () =>
      page.screenshot({
        path,
        fullPage: false,
        animations: "disabled",
        scale: "css",
        timeout: 20_000
      }),

    async () => {
      await page.waitForTimeout(1_000);

      return page.screenshot({
        path,
        fullPage: false,
        animations: "disabled",
        scale: "css",
        timeout: 20_000
      });
    },

    async () => {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1_000);

      return page.screenshot({
        path,
        fullPage: false,
        animations: "disabled",
        scale: "css",
        timeout: 20_000
      });
    },

    async () => {
      await page.waitForTimeout(1_000);

      return page.locator("main").screenshot({
        path,
        animations: "disabled",
        scale: "css",
        timeout: 20_000
      });
    }
  ];

  let lastError: unknown;

  for (const attempt of attempts) {
    try {
      await attempt();
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

test.describe("Fase 5 - UI/UX responsive y accesibilidad", () => {
  test.beforeAll(() => {
    mkdirSync(screenshotRoot, {
      recursive: true
    });
  });

  for (const viewport of viewports) {
    for (const routeCase of routes) {
      test(`${viewport.name} ${routeCase.route} usable sin S0/S1`, async ({ page }, testInfo: TestInfo) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        await page.goto(routeCase.route, {
          waitUntil: "domcontentloaded"
        });

        await expect(page.locator("main")).toBeVisible();

        await expectNoHorizontalOverflow(page);
        await expectLandmarks(page);

        if (routeCase.hero) {
          await expectHeroBehavior(page);
        }

        if (routeCase.contact) {
          await expectContactForm(page, routeCase.route);
        }

        await captureQaScreenshot(
          page,
          `${screenshotRoot}/${viewport.name}-${routeCase.key}-${testInfo.project.name}.png`
        );
      });
    }
  }

  test("navegación por teclado y skip link funcionan", async ({ page }) => {
    await page.setViewportSize({
      width: 1280,
      height: 720
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    await expectKeyboardAccess(page);

    const navLinks = page.locator("header a");
    const navLinkCount = await navLinks.count();

    expect(navLinkCount).toBeGreaterThanOrEqual(6);

    for (let index = 0; index < Math.min(navLinkCount, 12); index += 1) {
      await page.keyboard.press("Tab");
    }

    const activeTag = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(["A", "BUTTON", "MAIN", "BODY"].includes(activeTag)).toBe(true);
  });

  test("reduced motion no rompe el hero ni la lectura", async ({ page }) => {
    await page.emulateMedia({
      reducedMotion: "reduce"
    });

    await page.setViewportSize({
      width: 1280,
      height: 720
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("[data-hero3d]")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});