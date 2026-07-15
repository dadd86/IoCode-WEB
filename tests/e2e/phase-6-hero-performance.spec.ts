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
    await page.emulateMedia({
      reducedMotion: "reduce"
    });

    await page.setViewportSize({
      width: 1440,
      height: 900
    });

    await page.goto("/de/", {
      waitUntil: "domcontentloaded"
    });

    await expect(page.locator(".hero3d__summary")).toBeVisible();
    await expect(page.locator(".hero3d__actions")).toBeVisible();

    const result = await page.evaluate(() => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      const summary = document.querySelector(".hero3d__summary");
      const actions = document.querySelector(".hero3d__actions");
      const ctas = [...document.querySelectorAll(".hero3d__summary .hero3d__actions a")];

      if (!summary || !actions || ctas.length < 2) {
        return {
          ok: false,
          reason: "No se encontraron los CTAs esperados del hero.",
          viewport,
          ctas: [],
          clipped: []
        };
      }

      const ctaBoxes = ctas.map((cta) => {
        const rect = cta.getBoundingClientRect();

        return {
          text: cta.textContent?.replace(/\s+/g, " ").trim() ?? "",
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          right: rect.right,
          bottom: rect.bottom
        };
      });

      const clipped = ctaBoxes.filter((box) => {
        return (
          box.width <= 0 ||
          box.height <= 0 ||
          box.x < -1 ||
          box.y < -1 ||
          box.right > viewport.width + 2 ||
          box.bottom > viewport.height + 2
        );
      });

      return {
        ok: clipped.length === 0,
        reason: clipped.length === 0 ? null : "Uno o más CTAs están cortados.",
        viewport,
        ctas: ctaBoxes,
        clipped
      };
    });

    expect(result.ok, JSON.stringify(result, null, 2)).toBe(true);
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
    await page.emulateMedia({
      reducedMotion: "no-preference"
    });

    const glbRequests: string[] = [];

    page.on("request", (request) => {
      if (request.url().endsWith(".glb")) {
        glbRequests.push(request.url());
      }
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("[data-hero3d]")).toBeVisible();
    await expect(page.locator("[data-hero-placeholder]")).toBeVisible();

    await page.waitForFunction(
      () => {
        const hero = document.querySelector<HTMLElement>("[data-hero3d]");
        const canvas = document.querySelector("[data-hero-viewer] canvas");

        return Boolean(
          hero &&
            canvas &&
            hero.dataset.hero3dState === "ready" &&
            hero.dataset.fallback === "false" &&
            hero.classList.contains("is-three-ready") &&
            !hero.dataset.hero3dFallbackReason
        );
      },
      undefined,
      {
        timeout: 30_000
      }
    );

    const state = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>("[data-hero3d]");

      return {
        hero3dState: hero?.dataset.hero3dState ?? null,
        fallback: hero?.dataset.fallback ?? null,
        fallbackReason: hero?.dataset.hero3dFallbackReason ?? null,
        canvasCount: document.querySelectorAll("[data-hero-viewer] canvas").length
      };
    });

    expect(state.hero3dState).toBe("ready");
    expect(state.fallback).toBe("false");
    expect(state.fallbackReason).toBeNull();
    expect(state.canvasCount).toBe(1);
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
    await page.emulateMedia({
      reducedMotion: "reduce"
    });

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

    const centerLeft = stage.x + stage.width * 0.34;
    const centerRight = stage.x + stage.width * 0.66;
    const centerTop = stage.y + stage.height * 0.18;
    const centerBottom = stage.y + stage.height * 0.84;

    for (const panel of layout!.panels) {
      expect(panel.width).toBeGreaterThan(130);
      expect(panel.height).toBeGreaterThan(48);

      const panelCenterX = panel.x + panel.width / 2;
      const panelCenterY = panel.y + panel.height / 2;

      const isInsideCentralLogoArea =
        panelCenterX > centerLeft &&
        panelCenterX < centerRight &&
        panelCenterY > centerTop &&
        panelCenterY < centerBottom;

      expect(isInsideCentralLogoArea).toBe(false);
    }

    expect(stage.x).toBeGreaterThan(headline.x + headline.width - 24);
    expect(stage.width).toBeGreaterThan(headline.width * 1.02);
    expect(summary.y).toBeGreaterThanOrEqual(stage.y + stage.height - 2);
    expect(headline.height).toBeLessThanOrEqual(235);
  });
});