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

  test("el 3D carga al estar visible sin bloquear contenido ni navegación", async ({ page }) => {
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

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(hero).toBeVisible();
    await expect(placeholder).toBeVisible();

    await expect(page.locator("[data-hero-viewer] canvas")).toHaveCount(1, {
      timeout: 20_000
    });

    await expect(hero).toHaveClass(/is-three-ready/, {
      timeout: 20_000
    });

    const state = await hero.getAttribute("data-hero3d-state");
    const fallback = await hero.getAttribute("data-fallback");
    const fallbackReason = await hero.getAttribute("data-hero3d-fallback-reason");

    expect(state).toBe("ready");
    expect(fallback).toBe("false");
    expect(fallbackReason).toBeNull();
    expect(glbRequests.length).toBeGreaterThanOrEqual(1);
  });

  test("mobile dock usa nombres accesibles que contienen el texto visible", async ({ page }) => {
    await page.emulateMedia({
      reducedMotion: "reduce"
    });

    for (const route of ["/es/", "/de/"]) {
      await page.setViewportSize({
        width: 390,
        height: 844
      });

      await page.goto(route, {
        waitUntil: "domcontentloaded"
      });

      const mobileDockLinks = page.locator(".hero3d__mobileDock a");
      const count = await mobileDockLinks.count();

      expect(count).toBeGreaterThan(0);

      for (let index = 0; index < count; index += 1) {
        const link = mobileDockLinks.nth(index);
        const visibleText = (await link.innerText()).replace(/\s+/g, " ").trim();
        const accessibleName = await link.getAttribute("aria-label");

        expect(accessibleName).not.toBeNull();

        for (const token of visibleText.split(" ").filter(Boolean)) {
          expect(accessibleName ?? "").toContain(token);
        }
      }
    }
  });


  test("desktop mantiene paneles alrededor del logo sin cubrir el centro", async ({ page }) => {
  await page.setViewportSize({
    width: 1440,
    height: 900
  });

  await page.goto("/es/", {
    waitUntil: "domcontentloaded"
  });

  await expect(page.locator(".hero3d__stage")).toBeVisible();
  await expect(page.locator(".hero3d__summary")).toBeVisible();
  await expect(page.locator(".hero3d__headline")).toBeVisible();
  await expect(page.locator(".hero3d__panel")).toHaveCount(6);

  const layout = await page.evaluate(() => {
    const stage = document.querySelector(".hero3d__stage");
    const summary = document.querySelector(".hero3d__summary");
    const headline = document.querySelector(".hero3d__headline");
    const panels = [...document.querySelectorAll(".hero3d__panel")];

    if (!stage || !summary || !headline || panels.length !== 6) {
      return null;
    }

    const toBox = (rect: DOMRect) => ({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      right: rect.right,
      bottom: rect.bottom
    });

    return {
      stage: toBox(stage.getBoundingClientRect()),
      summary: toBox(summary.getBoundingClientRect()),
      headline: toBox(headline.getBoundingClientRect()),
      panels: panels.map((panel) => toBox(panel.getBoundingClientRect()))
    };
  });

  expect(layout).not.toBeNull();

  const stage = layout!.stage;
  const summary = layout!.summary;
  const headline = layout!.headline;

  const centerLeft = stage.x + stage.width * 0.36;
  const centerRight = stage.x + stage.width * 0.64;
  const centerTop = stage.y + stage.height * 0.18;
  const centerBottom = stage.y + stage.height * 0.84;

  for (const panel of layout!.panels) {
    const panelCenterX = panel.x + panel.width / 2;
    const panelCenterY = panel.y + panel.height / 2;

    const isInsideCentralLogoArea =
      panelCenterX > centerLeft &&
      panelCenterX < centerRight &&
      panelCenterY > centerTop &&
      panelCenterY < centerBottom;

    expect(isInsideCentralLogoArea).toBe(false);
  }

  expect(stage.x).toBeGreaterThan(headline.x + headline.width - 32);
  expect(stage.width).toBeGreaterThan(headline.width * 1.15);
  expect(summary.y).toBeGreaterThanOrEqual(stage.y + stage.height - 2);
  expect(headline.height).toBeLessThanOrEqual(260);
});
});