import { expect, test } from "@playwright/test";

test.describe("Fase 9C - Hero3D producción", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  test("descarga un único GLB versionado con MIME, caché e integridad correctos", async ({
    page
  }) => {
    test.setTimeout(90_000);
    const glbRequests: string[] = [];

    page.on("request", (request) => {
      if (new URL(request.url()).pathname.endsWith(".glb")) {
        glbRequests.push(request.url());
      }
    });

    await page.goto("/es/", { waitUntil: "domcontentloaded" });

    const hero = page.locator("[data-hero3d]");
    await expect(hero).toHaveAttribute("data-hero3d-state", "ready", {
      timeout: 45_000
    });

    const modelUrl = await hero.getAttribute("data-model-url");
    expect(modelUrl).toBe(
      "/logo/3d/iocode_solutions_logo_extruded_3d.glb?v=572076acb6cb"
    );

    const response = await page.request.get(modelUrl!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("model/gltf-binary");
    expect(response.headers()["cache-control"]).toBe(
      "public, max-age=31536000, immutable"
    );

    const body = await response.body();
    expect(body.byteLength).toBe(168_812);
    expect(body.subarray(0, 4).toString("ascii")).toBe("glTF");
    expect(glbRequests).toHaveLength(1);
  });

  test("mantiene un canvas, DPR acotado y ausencia de overflow tras resizes y rotación", async ({
    page
  }) => {
    test.setTimeout(90_000);
    await page.goto("/en/", { waitUntil: "domcontentloaded" });

    const hero = page.locator("[data-hero3d]");
    await expect(hero).toHaveAttribute("data-hero3d-state", "ready", {
      timeout: 45_000
    });

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 844, height: 390 },
      { width: 768, height: 1024 },
      { width: 1366, height: 900 }
    ]) {
      await page.setViewportSize(viewport);
      await page.evaluate(() => {
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("orientationchange"));
        return new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      });

      const measurement = await page.evaluate(() => {
        const canvas = document.querySelector<HTMLCanvasElement>(
          "[data-hero-viewer] canvas"
        );
        const bounds = canvas?.getBoundingClientRect();
        const coarse = window.matchMedia(
          "(hover: none) and (pointer: coarse)"
        ).matches;
        const limit = coarse || window.innerWidth < 960 ? 1.5 : 2;

        return {
          canvasCount: document.querySelectorAll(
            "[data-hero-viewer] canvas"
          ).length,
          horizontalOverflow:
            document.documentElement.scrollWidth > window.innerWidth + 2,
          actualDpr:
            canvas && bounds?.width ? canvas.width / bounds.width : 0,
          limit
        };
      });

      expect(measurement.canvasCount).toBe(1);
      expect(measurement.horizontalOverflow).toBe(false);
      expect(measurement.actualDpr).toBeGreaterThan(0);
      expect(measurement.actualDpr).toBeLessThanOrEqual(measurement.limit + 0.05);
    }
  });

  test("recupera el contexto WebGL sin recargar el GLB ni duplicar canvas", async ({
    page
  }) => {
    test.setTimeout(90_000);
    let glbRequestCount = 0;

    page.on("request", (request) => {
      if (new URL(request.url()).pathname.endsWith(".glb")) {
        glbRequestCount += 1;
      }
    });

    await page.goto("/de/", { waitUntil: "domcontentloaded" });

    const hero = page.locator("[data-hero3d]");
    const canvas = page.locator("[data-hero-viewer] canvas");
    await expect(hero).toHaveAttribute("data-hero3d-state", "ready", {
      timeout: 45_000
    });
    await expect(canvas).toHaveCount(1);

    const prevented = await canvas.evaluate((element) => {
      const event = new Event("webglcontextlost", { cancelable: true });
      element.dispatchEvent(event);
      return event.defaultPrevented;
    });

    expect(prevented).toBe(true);
    await expect(hero).toHaveAttribute("data-hero3d-state", "fallback");
    await expect(hero).toHaveAttribute(
      "data-hero3d-animation-state",
      "paused-context-lost"
    );
    await expect(canvas).toHaveCount(1);

    await canvas.dispatchEvent("webglcontextrestored");

    await expect(hero).toHaveAttribute("data-hero3d-state", "ready");
    await expect(hero).toHaveAttribute("data-fallback", "false");
    await expect(canvas).toHaveCount(1);
    expect(glbRequestCount).toBe(1);
  });

  test("activa el runtime de forma diferida sin bloquear el contenido principal", async ({
    page,
    browserName
  }) => {
    test.setTimeout(90_000);
    await page.addInitScript(() => {
      (window as Window & { __heroLongTasks?: number[] }).__heroLongTasks = [];

      try {
        const observer = new PerformanceObserver((list) => {
          const target = window as Window & { __heroLongTasks?: number[] };
          target.__heroLongTasks?.push(
            ...list.getEntries().map((entry) => entry.duration)
          );
        });
        observer.observe({ type: "longtask", buffered: true });
      } catch {
        // WebKit no expone siempre Long Tasks; Lighthouse mantiene el gate TBT.
      }
    });

    await page.goto("/es/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();

    const hero = page.locator("[data-hero3d]");
    await expect(hero).toHaveAttribute("data-hero3d-state", "ready", {
      timeout: 45_000
    });

    const metrics = await hero.evaluate((element) => {
      const target = window as Window & { __heroLongTasks?: number[] };
      return {
        activationMs: Number(
          (element as HTMLElement).dataset.hero3dLoadDuration || "0"
        ),
        estimatedTbtMs: (target.__heroLongTasks ?? []).reduce(
          (total, duration) => total + Math.max(0, duration - 50),
          0
        )
      };
    });

    expect(metrics.activationMs).toBeGreaterThan(0);
    expect(metrics.activationMs).toBeLessThan(10_000);
    if (browserName === "chromium") {
      expect(metrics.estimatedTbtMs).toBeLessThanOrEqual(300);
    }
  });

  test("reduced motion conserva fallback y evita GLB, Three.js y canvas", async ({
    page
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const heavyRequests: string[] = [];

    page.on("request", (request) => {
      const url = request.url();
      if (url.includes(".glb") || /hero3d\.[A-Za-z0-9_-]+\.js/.test(url)) {
        heavyRequests.push(url);
      }
    });

    await page.goto("/es/", { waitUntil: "domcontentloaded" });

    const hero = page.locator("[data-hero3d]");
    await expect(hero).toHaveAttribute("data-hero3d-state", "fallback");
    await expect(hero).toHaveAttribute(
      "data-hero3d-fallback-reason",
      "prefers-reduced-motion"
    );
    await expect(page.locator("[data-hero-fallback]")).toBeVisible();
    await expect(page.locator("[data-hero-viewer] canvas")).toHaveCount(0);
    expect(heavyRequests).toEqual([]);
  });
});
