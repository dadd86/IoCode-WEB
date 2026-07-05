import { expect, test } from "@playwright/test";

test.describe("Fase 6 - Performance Hero3D", () => {
  test("fallback y contenido aparecen aunque WebGL no esté disponible", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "WebGLRenderingContext", {
        value: undefined,
        configurable: true
      });
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    const hero = page.locator("[data-hero3d]");

    await expect(page.locator("main")).toBeVisible();
    await expect(hero).toHaveAttribute("data-fallback", "true");
    await expect(hero).toHaveAttribute("data-hero3d-state", "fallback");
    await expect(hero).toHaveAttribute("data-hero3d-fallback-reason", "webgl-unavailable");
    await expect(page.locator("[data-hero-fallback]")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("[data-hero-viewer] canvas")).toHaveCount(0);
  });

  test("reduced motion no carga escena pesada y mantiene contenido usable", async ({ page }) => {
    await page.emulateMedia({
      reducedMotion: "reduce"
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    const hero = page.locator("[data-hero3d]");

    await expect(page.locator("main")).toBeVisible();
    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("data-fallback", "true");
    await expect(hero).toHaveAttribute("data-hero3d-state", "fallback");
    await expect(hero).toHaveAttribute("data-hero3d-fallback-reason", "prefers-reduced-motion");
    await expect(page.locator("h1")).toBeVisible();

    expect(await page.locator("[data-hero-viewer] canvas").count()).toBe(0);
  });

  test("fallback se activa si el GLB no se puede descargar", async ({ page }) => {
    await page.route("**/*.glb", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    const hero = page.locator("[data-hero3d]");

    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("data-hero3d-state", "deferred");

    await hero.hover();

    await expect(hero).toHaveAttribute("data-fallback", "true", {
      timeout: 15_000
    });

    await expect(hero).toHaveAttribute("data-hero3d-state", "fallback");
    await expect(page.locator("[data-hero-fallback]")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("CTA del hero no queda cortado visualmente", async ({ page }) => {
    await page.setViewportSize({
      width: 1440,
      height: 900
    });

    await page.goto("/de/", {
      waitUntil: "domcontentloaded"
    });

    const viewport = page.viewportSize();

    expect(viewport).not.toBeNull();

    const ctas = page.locator(".buttonGroup a");
    const count = await ctas.count();

    expect(count).toBeGreaterThanOrEqual(2);

    for (let index = 0; index < count; index += 1) {
      const cta = ctas.nth(index);

      await expect(cta).toBeVisible();

      const box = await cta.boundingBox();

      expect(box).not.toBeNull();

      const safeBox = box!;

      expect(safeBox.x).toBeGreaterThanOrEqual(0);
      expect(safeBox.y).toBeGreaterThanOrEqual(0);
      expect(safeBox.x + safeBox.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 2);
      expect(safeBox.y + safeBox.height).toBeLessThanOrEqual((viewport?.height ?? 0) + 2);
    }
  });

  test("no hay overflow horizontal causado por hero 3D", async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1280, height: 720 },
      { width: 1440, height: 900 }
    ]) {
      await page.setViewportSize(viewport);

      await page.goto("/es/", {
        waitUntil: "domcontentloaded"
      });

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });

      expect(hasOverflow).toBe(false);
    }
  });

  test("el 3D no se carga antes de interacción y carga al interactuar con el hero", async ({ page }) => {
    const glbRequests: string[] = [];

    page.on("request", (request) => {
      if (request.url().endsWith(".glb")) {
        glbRequests.push(request.url());
      }
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    const hero = page.locator("[data-hero3d]");
    const placeholder = page.locator("[data-hero-placeholder]");

    await expect(hero).toBeVisible();
    await expect(placeholder).toBeVisible();
    await expect(hero).toHaveAttribute("data-hero3d-state", "deferred");

    await page.waitForTimeout(1500);

    expect(glbRequests).toHaveLength(0);
    expect(await page.locator("[data-hero-viewer] canvas").count()).toBe(0);

    await hero.hover();

    await expect(page.locator("[data-hero-viewer] canvas")).toHaveCount(1, {
      timeout: 15_000
    });

    await expect(hero).toHaveClass(/is-three-ready/, {
      timeout: 15_000
    });

    await expect(hero).toHaveAttribute("data-fallback", "false");
    await expect(hero).toHaveAttribute("data-hero3d-state", "ready");
    expect(glbRequests.length).toBeGreaterThanOrEqual(1);
  });
});