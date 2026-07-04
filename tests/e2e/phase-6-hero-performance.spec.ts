import { expect, test } from "@playwright/test";

test.describe("Fase 6 - Performance Hero3D", () => {
  test("fallback y contenido aparecen aunque WebGL no esté disponible", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "WebGLRenderingContext", {
        value: undefined
      });
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("[data-hero3d]")).toHaveAttribute("data-fallback", "true");
    await expect(page.locator("[data-hero-fallback]")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("reduced motion no carga escena pesada y mantiene contenido usable", async ({ page }) => {
    await page.emulateMedia({
      reducedMotion: "reduce"
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("[data-hero3d]")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();

    const webglCanvasCount = await page.locator("[data-hero-viewer] canvas").count();

    expect(webglCanvasCount).toBe(0);
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
});