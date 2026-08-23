import { expect, test } from "@playwright/test";
import sharp from "sharp";

test.describe("Fase 6 - Performance Hero3D", () => {
  test("autocarga el runtime 3D al entrar en viewport sin interacción", async ({ page }) => {
    test.setTimeout(90_000);

    await page.emulateMedia({
      reducedMotion: "no-preference"
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    const hero = page.locator("[data-hero3d]");

    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("data-hero3d-armed", "true");
    await expect(hero).toHaveAttribute("data-hero3d-requested", "true", {
      timeout: 8_000
    });
    await expect(hero).toHaveAttribute("data-hero3d-state", "ready", {
      timeout: 45_000
    });
    await expect(hero).toHaveAttribute(
      "data-hero3d-logo-mode",
      "source-texture-fidelity"
    );
    await expect(page.locator("[data-hero-viewer] canvas")).toHaveCount(1);
  });

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
    await page.route(/\.glb(?:\?.*)?$/, async (route) => {
      await route.abort("failed");
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    const hero = page.locator("[data-hero3d]");

    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("data-hero3d-requested", "true", {
      timeout: 8_000
    });

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
    test.setTimeout(90_000);

    await page.emulateMedia({
      reducedMotion: "reduce"
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1280, height: 720 },
      { width: 1440, height: 900 }
    ]) {
      await page.setViewportSize(viewport);

      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      });

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });

      expect(hasOverflow).toBe(false);
    }
  });

  test("el 3D carga al estar visible sin bloquear contenido ni navegación", async ({ page }) => {
    test.setTimeout(90_000);

    await page.emulateMedia({
      reducedMotion: "no-preference"
    });

    const glbRequests: string[] = [];
    const gltfErrors: string[] = [];

    page.on("request", (request) => {
      if (new URL(request.url()).pathname.endsWith(".glb")) {
        glbRequests.push(request.url());
      }
    });

    page.on("console", (message) => {
      const text = message.text();

      if (
        message.type() === "error" &&
        (text.includes("THREE.GLTFLoader") || text.includes("Couldn't load texture"))
      ) {
        gltfErrors.push(text);
      }
    });

    page.on("pageerror", (error) => {
      if (
        error.message.includes("THREE.GLTFLoader") ||
        error.message.includes("Couldn't load texture")
      ) {
        gltfErrors.push(error.message);
      }
    });
    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    const hero = page.locator("[data-hero3d]");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(hero).toBeVisible();
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
    expect(gltfErrors).toEqual([]);

    await expect(hero).toHaveAttribute("data-hero3d-animation-state", "running");

    await page.evaluate(() => {
      const stage = document.querySelector<HTMLElement>("[data-hero-stage]");

      if (stage) {
        stage.style.transform = "translateY(-200vh)";
      }
    });

    await expect(hero).toHaveAttribute(
      "data-hero3d-animation-state",
      "paused-offscreen"
    );

    await page.evaluate(() => {
      const stage = document.querySelector<HTMLElement>("[data-hero-stage]");

      stage?.style.removeProperty("transform");
    });

    await expect(hero).toHaveAttribute("data-hero3d-animation-state", "running");
  });

  test("la pérdida de contexto WebGL activa fallback y la restauración reutiliza el canvas", async ({ page }) => {
    test.setTimeout(90_000);

    await page.emulateMedia({
      reducedMotion: "no-preference"
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    const hero = page.locator("[data-hero3d]");
    const canvas = page.locator("[data-hero-viewer] canvas");

    await expect(hero).toHaveAttribute("data-hero3d-state", "ready", {
      timeout: 30_000
    });
    await expect(canvas).toHaveCount(1);

    const defaultPrevented = await canvas.evaluate((element) => {
      const event = new Event("webglcontextlost", {
        bubbles: false,
        cancelable: true
      });

      element.dispatchEvent(event);
      return event.defaultPrevented;
    });

    expect(defaultPrevented).toBe(true);
    await expect(hero).toHaveAttribute("data-hero3d-state", "fallback");
    await expect(hero).toHaveAttribute(
      "data-hero3d-fallback-reason",
      "webgl-context-lost"
    );
    await expect(hero).toHaveAttribute(
      "data-hero3d-animation-state",
      "paused-context-lost"
    );
    await expect(canvas).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();

    await canvas.dispatchEvent("webglcontextrestored");

    await expect(hero).toHaveAttribute("data-hero3d-state", "ready");
    await expect(hero).toHaveAttribute("data-fallback", "false");
    await expect(hero).not.toHaveAttribute(
      "data-hero3d-fallback-reason",
      "webgl-context-lost"
    );
    await expect(canvas).toHaveCount(1);
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
        const ariaLabel = await link.getAttribute("aria-label");
        const accessibleName = (ariaLabel ?? visibleText).replace(/\s+/g, " ").trim();

        expect(accessibleName.length).toBeGreaterThan(0);

        for (const token of visibleText.split(" ").filter(Boolean)) {
          expect(accessibleName).toContain(token);
        }
      }
    }
  });

  test("logo 3D no se renderiza fragmentado ni como rectángulo roto", async ({ page }) => {
    await page.emulateMedia({
      reducedMotion: "no-preference"
    });

    await page.setViewportSize({
      width: 1440,
      height: 900
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    await page.waitForFunction(
      () => {
        const hero = document.querySelector<HTMLElement>("[data-hero3d]");
        const canvas = document.querySelector<HTMLCanvasElement>("[data-hero-viewer] canvas");

        return Boolean(
          hero &&
            canvas &&
            hero.dataset.hero3dState === "ready" &&
            hero.dataset.fallback === "false" &&
            hero.classList.contains("is-three-ready")
        );
      },
      undefined,
      {
        timeout: 30_000
      }
    );

    const canvas = page.locator("[data-hero-viewer] canvas").first();

    await expect(canvas).toBeVisible();

    const screenshot = await canvas.screenshot({
      type: "png"
    });

    const { data, info } = await sharp(screenshot)
      .ensureAlpha()
      .raw()
      .toBuffer({
        resolveWithObject: true
      });

    const sampleWidth = Math.floor(info.width * 0.34);
    const sampleHeight = Math.floor(info.height * 0.52);
    const startX = Math.floor((info.width - sampleWidth) / 2);
    const startY = Math.floor((info.height - sampleHeight) / 2);

    let visiblePixels = 0;
    let cyanPixels = 0;
    let whitePixels = 0;
    let darkCrackPixels = 0;

    for (let y = startY; y < startY + sampleHeight; y += 1) {
      for (let x = startX; x < startX + sampleWidth; x += 1) {
        const index = (y * info.width + x) * info.channels;

        const r = data[index] ?? 0;
        const g = data[index + 1] ?? 0;
        const b = data[index + 2] ?? 0;
        const a = data[index + 3] ?? 255;

        if (a < 20) {
          continue;
        }

        visiblePixels += 1;

        if (b > 120 && g > 90 && r < 120) {
          cyanPixels += 1;
        }

        if (r > 175 && g > 175 && b > 175) {
          whitePixels += 1;
        }

        if (r < 12 && g < 18 && b < 30 && a > 100) {
          darkCrackPixels += 1;
        }
      }
    }

    const total = sampleWidth * sampleHeight;
    const visibleRatio = visiblePixels / total;
    const cyanRatio = cyanPixels / Math.max(visiblePixels, 1);
    const whiteRatio = whitePixels / Math.max(visiblePixels, 1);
    const crackRatio = darkCrackPixels / Math.max(visiblePixels, 1);

    const visual = {
      ok:
        visibleRatio > 0.045 &&
        cyanRatio > 0.025 &&
        whiteRatio > 0.025 &&
        crackRatio < 0.48,
      visibleRatio,
      cyanRatio,
      whiteRatio,
      crackRatio,
      sampleWidth,
      sampleHeight,
      imageWidth: info.width,
      imageHeight: info.height
    };

    expect(visual.ok, JSON.stringify(visual, null, 2)).toBe(true);
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

  test("desktop abre la descripcion del panel al pasar el mouse", async ({ page }) => {
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

    const panel = page.locator('.hero3d__panel[data-panel-id="hmi"]').first();
    const description = panel.locator(".hero3d__panel-description");

    await expect(panel).toBeVisible();

    const before = await description.evaluate((element) => {
      const styles = window.getComputedStyle(element);

      return {
        opacity: Number(styles.opacity),
        maxHeight: Number.parseFloat(styles.maxHeight)
      };
    });

    await panel.hover();

    const after = await description.evaluate((element) => {
      const styles = window.getComputedStyle(element);

      return {
        opacity: Number(styles.opacity),
        maxHeight: Number.parseFloat(styles.maxHeight)
      };
    });

    expect(before.opacity).toBeLessThan(0.1);
    expect(after.opacity).toBeGreaterThan(0.85);
    expect(after.maxHeight).toBeGreaterThan(40);
  });

  test("desktop mantiene el logo 3D con tamaño visual suficiente", async ({ page }) => {
    await page.emulateMedia({
      reducedMotion: "no-preference"
    });

    await page.setViewportSize({
      width: 1440,
      height: 900
    });

    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    await page.waitForFunction(
      () => {
        const hero = document.querySelector<HTMLElement>("[data-hero3d]");
        const canvas = document.querySelector<HTMLCanvasElement>("[data-hero-viewer] canvas");

        return Boolean(
          hero &&
            canvas &&
            hero.dataset.hero3dState === "ready" &&
            hero.dataset.fallback === "false" &&
            hero.classList.contains("is-three-ready")
        );
      },
      undefined,
      {
        timeout: 30_000
      }
    );

    const canvasBox = await page.locator("[data-hero-viewer] canvas").first().boundingBox();
    const logoBox = await page.locator(".hero3d__placeholder img").first().boundingBox();

    expect(canvasBox).not.toBeNull();

    const stage = await page.locator(".hero3d__stage").first().boundingBox();

    expect(stage).not.toBeNull();

    const stageWidth = stage!.width;
    const stageHeight = stage!.height;

    expect(stageWidth).toBeGreaterThan(700);
    expect(stageHeight).toBeGreaterThan(360);

    /*
      Este test no mide geometría exacta del GLB porque el canvas no expone
      caja DOM interna del modelo. La validación visual real sigue en el test
      de píxeles; aquí dejamos bloqueado el tamaño mínimo del contenedor.
    */
    expect(canvasBox!.width).toBeGreaterThan(stageWidth * 0.95);
    expect(canvasBox!.height).toBeGreaterThan(stageHeight * 0.95);

    if (logoBox) {
      expect(logoBox.width).toBeGreaterThan(260);
    }
  });
});
