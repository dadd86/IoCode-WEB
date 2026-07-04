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

    const firstCta = page.locator(".buttonGroup a").first();

    await expect(firstCta).toBeVisible();

    const box = await firstCta.boundingBox();

    expect(box).not.toBeNull();
    expect((box?.y ?? -1) >= 0).toBe(true);
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