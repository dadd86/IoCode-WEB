import {
  expect,
  test
} from "@playwright/test";

/**
 * Propósito:
 * Comprobar que el Hero3D puede recuperarse y renderizarse en los motores y
 * perfiles principales del proyecto:
 *
 * - Chromium desktop: Chrome de PC.
 * - Chromium mobile: Chrome/Android.
 * - WebKit iPhone: Chrome y Safari sobre iOS.
 * - WebKit iPad: tablet basada en WebKit.
 *
 * Tipos de datos:
 * - LocalizedRoute: portada ES, EN o DE.
 * - RuntimeResult: estado final y medidas del canvas.
 *
 * Parámetros:
 * Los proyectos de navegador se suministran mediante playwright.config.ts.
 *
 * Retorno:
 * No retorna valores. Falla cuando existe un error de página, un asset crítico
 * no se descarga o el Hero no termina en ready/fallback.
 */

type LocalizedRoute = {
  locale: "ES" | "EN" | "DE";
  path: "/es/" | "/en/" | "/de/";
};

type RuntimeResult = {
  state: string | null;
  fallbackReason: string | null;
  logoMode: string | null;
  canvasCount: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasCssWidth: number;
  canvasCssHeight: number;
  viewportWidth: number;
  documentWidth: number;
};

const localizedRoutes:
  readonly LocalizedRoute[] = [
    {
      locale: "ES",
      path: "/es/"
    },
    {
      locale: "EN",
      path: "/en/"
    },
    {
      locale: "DE",
      path: "/de/"
    }
  ];

/**
 * Propósito:
 * Esperar la autocarga del runtime sin emitir eventos de puntero, teclado o
 * foco. La prueba reproduce la entrada normal a Home.
 *
 * Parámetros:
 * - hero: locator raíz del Hero3D.
 *
 * Retorno:
 * Promise<void>.
 *
 * Notas:
 * `data-hero3d-requested=true` demuestra que IntersectionObserver y el
 * programador idle iniciaron la carga por sí solos.
 */
async function waitForAutomaticHeroRuntime(
  hero: import("@playwright/test").Locator
): Promise<void> {
  await expect(hero).toHaveAttribute(
    "data-hero3d-state",
    /^(deferred|loading|ready|fallback)$/,
    {
      timeout: 10_000
    }
  );

  await expect(hero).toHaveAttribute(
    "data-hero3d-requested",
    "true",
    {
      timeout: 8_000
    }
  );

  await expect(hero).toHaveAttribute(
    "data-hero3d-state",
    "ready",
    {
      timeout: 45_000
    }
  );
}

test.describe(
  "Fase 6 - Recuperación cross-platform del Logo3D",
  () => {
    for (
      const localizedRoute
      of localizedRoutes
    ) {
      test(
        `${localizedRoute.locale} carga Logo3D o fallback sin assets rotos`,
        async ({
          page
        }, testInfo) => {
          const pageErrors: string[] = [];
          const criticalRequestFailures:
            string[] = [];

          page.on(
            "pageerror",
            (error) => {
              pageErrors.push(
                error.message
              );
            }
          );

          page.on(
            "requestfailed",
            (request) => {
              const url =
                request.url();

              if (
                url.includes("/_astro/") ||
                url.includes(".glb")
              ) {
                criticalRequestFailures.push(
                  `${request.method()} ${url}: ${
                    request.failure()
                      ?.errorText ??
                    "error desconocido"
                  }`
                );
              }
            }
          );

          await page.emulateMedia({
            reducedMotion:
              "no-preference"
          });

          await page.goto(
            localizedRoute.path,
            {
              waitUntil:
                "domcontentloaded"
            }
          );

          const hero =
            page.locator(
              "[data-hero3d]"
            );

          const stage =
            page.locator(
              "[data-hero-stage]"
            );

          await expect(
            hero
          ).toBeVisible();

          await expect(
            stage
          ).toBeVisible();

          await expect(
            hero
          ).toHaveAttribute(
            "data-hero3d-state",
            /^(deferred|loading|ready|fallback)$/
          );

          await waitForAutomaticHeroRuntime(
            hero
          );

          await expect(
            hero
          ).toHaveAttribute(
            "data-hero3d-state",
            "ready",
            {
              timeout: 45_000
            }
          );

          const runtimeResult =
            await hero.evaluate<
              RuntimeResult,
              HTMLElement
            >((element) => {
              const canvas =
                element.querySelector<
                  HTMLCanvasElement
                >(
                  "[data-hero-viewer] canvas"
                );
              const canvasBounds =
                canvas?.getBoundingClientRect();

              return {
                state:
                  element.dataset
                    .hero3dState ??
                  null,
                fallbackReason:
                  element.dataset
                    .hero3dFallbackReason ??
                  null,
                logoMode:
                  element.dataset
                    .hero3dLogoMode ??
                  null,
                canvasCount:
                  element.querySelectorAll(
                    "[data-hero-viewer] canvas"
                  ).length,
                canvasWidth:
                  canvas?.width ?? 0,
                canvasHeight:
                  canvas?.height ?? 0,
                canvasCssWidth:
                  canvasBounds?.width ?? 0,
                canvasCssHeight:
                  canvasBounds?.height ?? 0,
                viewportWidth:
                  window.innerWidth,
                documentWidth:
                  document
                    .documentElement
                    .scrollWidth
              };
            });

          expect(runtimeResult.state).toBe("ready");
          expect(runtimeResult.logoMode).toBe(
            "source-texture-fidelity"
          );

          expect(
            runtimeResult
              .documentWidth,
            `Existe overflow horizontal en ${localizedRoute.locale}.`
          ).toBeLessThanOrEqual(
            runtimeResult
              .viewportWidth + 1
          );

          expect(
            runtimeResult.canvasCount,
            `No se creó el canvas en ${localizedRoute.locale}.`
          ).toBe(1);

          expect(
            runtimeResult.canvasWidth,
            `El canvas tiene ancho cero en ${localizedRoute.locale}.`
          ).toBeGreaterThan(0);

          expect(
            runtimeResult.canvasHeight,
            `El canvas tiene alto cero en ${localizedRoute.locale}.`
          ).toBeGreaterThan(0);

          const expectedDprLimit =
            testInfo.project.name ===
            "chromium-desktop"
              ? 2
              : 1.5;

          expect(
            runtimeResult.canvasWidth /
              runtimeResult.canvasCssWidth,
            `El DPR horizontal supera el límite en ${localizedRoute.locale}.`
          ).toBeLessThanOrEqual(
            expectedDprLimit + 0.05
          );

          expect(
            runtimeResult.canvasHeight /
              runtimeResult.canvasCssHeight,
            `El DPR vertical supera el límite en ${localizedRoute.locale}.`
          ).toBeLessThanOrEqual(
            expectedDprLimit + 0.05
          );

          await expect(
            page.locator(
              "[data-hero3d].is-three-ready"
            )
          ).toBeVisible();

          expect(
            criticalRequestFailures,
            `Fallaron assets críticos en ${localizedRoute.locale}:\n${criticalRequestFailures.join(
              "\n"
            )}`
          ).toEqual([]);

          expect(
            pageErrors,
            `Se produjeron errores JavaScript en ${localizedRoute.locale}:\n${pageErrors.join(
              "\n"
            )}`
          ).toEqual([]);
        }
      );
    }
  }
);
