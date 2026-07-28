import { expect, test } from "@playwright/test";

type ElementBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

type MobileHeroLayout = {
  viewportWidth: number;
  documentScrollWidth: number;
  stage: ElementBounds;
  plc: ElementBounds;
  robots: ElementBounds;
  software: ElementBounds;
  dock: ElementBounds;
};

type Rectangle = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/**
 * Propósito:
 * Representar una portada localizada que debe superar las comprobaciones
 * geométricas del Hero3D en WebKit iPhone.
 *
 * Tipos de datos:
 * - label: identificador legible utilizado en el nombre del test.
 * - path: ruta absoluta de la portada localizada.
 *
 * Notas de contexto:
 * Las traducciones pueden modificar la altura de las tarjetas. Por ello, la
 * prueba geométrica debe ejecutarse sobre ES, EN y DE, no únicamente sobre ES.
 */
type LocalizedHomeRoute = {
  label: "ES" | "EN" | "DE";
  path: "/es/" | "/en/" | "/de/";
};

/**
 * Propósito:
 * Definir las portadas multilingües cubiertas por el gate WebKit iPhone.
 *
 * Retorno:
 * Lista inmutable de rutas ES, EN y DE.
 */
const localizedHomeRoutes: readonly LocalizedHomeRoute[] = [
  {
    label: "ES",
    path: "/es/"
  },
  {
    label: "EN",
    path: "/en/"
  },
  {
    label: "DE",
    path: "/de/"
  }
];

/**
 * Propósito:
 * Determinar si dos rectángulos se superponen.
 *
 * Tipos de datos:
 * - Rectangle: coordenadas de los dos rectángulos.
 * - boolean: resultado de la comprobación.
 *
 * Parámetros:
 * first: primer rectángulo.
 * second: segundo rectángulo.
 *
 * Retorno:
 * true cuando existe intersección visual.
 * false cuando las regiones no se solapan.
 *
 * Notas de contexto:
 * Esta función se ejecuta en el proceso de pruebas de Playwright, no dentro
 * de page.evaluate().
 */
function rectanglesOverlap(
  first: Rectangle,
  second: Rectangle
): boolean {
  return !(
    first.right <= second.left ||
    first.left >= second.right ||
    first.bottom <= second.top ||
    first.top >= second.bottom
  );
}

/**
 * Propósito:
 * Obtener las medidas del Hero3D móvil y sus controles primarios dentro del
 * contexto real del navegador ejecutado por Playwright.
 *
 * Tipos de datos:
 * - HTMLElement: elementos HTML encontrados mediante querySelector.
 * - DOMRect: resultado de getBoundingClientRect().
 * - ElementBounds: versión plana y serializable de un DOMRect.
 * - MobileHeroLayout: conjunto de medidas necesarias para validar overflow,
 *   posición de paneles y límites del escenario.
 *
 * Parámetros:
 * No recibe parámetros.
 *
 * Retorno:
 * MobileHeroLayout con:
 * - ancho del viewport;
 * - ancho total del documento;
 * - límites del escenario;
 * - límites de PLC;
 * - límites de ROBOTS;
 * - límites de SOFTWARE;
 * - límites del dock móvil.
 *
 * Excepciones:
 * Lanza Error cuando falta alguno de los elementos obligatorios.
 *
 * Notas de contexto:
 * Esta función se entrega directamente a page.evaluate().
 *
 * Playwright serializa únicamente esta función y la ejecuta dentro del
 * navegador. No puede depender de funciones, constantes o variables
 * declaradas en el ámbito Node.js del archivo de pruebas.
 *
 * Por ese motivo, serializeRectInPage se declara dentro de esta misma función.
 */
function readMobileHeroLayout(): MobileHeroLayout {
  /**
   * Propósito:
   * Convertir un DOMRect en un objeto plano transferible desde el navegador
   * al proceso de Playwright.
   *
   * Tipos de datos:
   * - Entrada: DOMRect.
   * - Salida: ElementBounds.
   *
   * Parámetros:
   * rect: rectángulo calculado por getBoundingClientRect().
   *
   * Retorno:
   * Coordenadas y dimensiones numéricas del elemento.
   *
   * Notas de contexto:
   * Debe permanecer dentro de readMobileHeroLayout para estar disponible en
   * el contexto aislado de page.evaluate().
   */
  const serializeRectInPage = (
    rect: DOMRect
  ): ElementBounds => {
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  };

  const stageElement =
    document.querySelector<HTMLElement>(
      "[data-hero-stage]"
    );

  const plcElement =
    document.querySelector<HTMLElement>(
      '[data-panel-id="plc"]'
    );

  const robotsElement =
    document.querySelector<HTMLElement>(
      '[data-panel-id="robots"]'
    );

  const softwareElement =
    document.querySelector<HTMLElement>(
      '[data-panel-id="software"]'
    );

  const dockElement =
    document.querySelector<HTMLElement>(
      ".hero3d__mobileDock"
    );

  if (
    !stageElement ||
    !plcElement ||
    !robotsElement ||
    !softwareElement ||
    !dockElement
  ) {
    throw new Error(
      "Faltan elementos obligatorios del Hero3D móvil."
    );
  }

  return {
    viewportWidth: window.innerWidth,
    documentScrollWidth:
      document.documentElement.scrollWidth,
    stage: serializeRectInPage(
      stageElement.getBoundingClientRect()
    ),
    plc: serializeRectInPage(
      plcElement.getBoundingClientRect()
    ),
    robots: serializeRectInPage(
      robotsElement.getBoundingClientRect()
    ),
    software: serializeRectInPage(
      softwareElement.getBoundingClientRect()
    ),
    dock: serializeRectInPage(
      dockElement.getBoundingClientRect()
    )
  };
}

test.describe("Fase 6 - Hero3D en WebKit iPhone", () => {
  for (const localizedRoute of localizedHomeRoutes) {
    test(
      `mantiene el logo central libre y no produce overflow en ${localizedRoute.label}`,
      async ({ page }) => {
        /**
         * Propósito:
         * Validar la composición móvil del Hero3D después de permitir que
         * IntersectionObserver y requestIdleCallback activen el runtime sin
         * interacción del usuario.
         *
         * Tipos de datos:
         * - Locator: referencias Playwright al Hero, escenario y dock.
         * - string | null: estados publicados mediante atributos data-*.
         * - MobileHeroLayout: medidas serializables del layout.
         * - Rectangle: región geométrica reservada al logotipo.
         *
         * Parámetros:
         * - page: página WebKit proporcionada por Playwright.
         * - localizedRoute: ruta ES, EN o DE de la iteración actual.
         *
         * Retorno:
         * Promise<void>. El test finaliza correctamente cuando:
         * 1. El Hero queda preparado para la carga diferida.
         * 2. La autocarga solicita el runtime.
         * 3. El estado termina en ready.
         * 4. No existe overflow horizontal.
         * 5. PLC, ROBOTS y SOFTWARE no invaden la zona del logo.
         * 6. El escenario conserva una proporción móvil aceptable.
         * 7. El dock permanece dentro del escenario.
         *
         * Contexto:
         * La validación se repite sobre ES, EN y DE porque las traducciones
         * pueden modificar la altura efectiva de las tarjetas.
         */
        await page.emulateMedia({
          reducedMotion: "no-preference"
        });

        await page.goto(localizedRoute.path, {
          waitUntil: "domcontentloaded"
        });

        const hero = page.locator("[data-hero3d]");
        const stage = page.locator("[data-hero-stage]");
        const mobileDock = page.locator(".hero3d__mobileDock");

        await expect(hero).toBeVisible();
        await expect(stage).toBeVisible();
        await expect(mobileDock).toBeVisible();

        await expect(hero).toHaveAttribute(
          "data-hero3d-state",
          /^(deferred|loading|ready|fallback)$/
        );

        await expect(hero).toHaveAttribute(
          "data-hero3d-armed",
          "true",
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
            timeout: 30_000
          }
        );

        const finalState = await hero.getAttribute(
          "data-hero3d-state"
        );

        expect(
          finalState,
          `El Hero3D de ${localizedRoute.label} debe terminar en ready.`
        ).toBe("ready");

        const layout = await page.evaluate(
          readMobileHeroLayout
        );

        expect(
          layout.documentScrollWidth,
          `La portada ${localizedRoute.label} produce overflow horizontal en iPhone.`
        ).toBeLessThanOrEqual(
          layout.viewportWidth + 1
        );

        expect(
          layout.stage.left,
          `El escenario ${localizedRoute.label} sale por el borde izquierdo.`
        ).toBeGreaterThanOrEqual(0);

        expect(
          layout.stage.right,
          `El escenario ${localizedRoute.label} sale por el borde derecho.`
        ).toBeLessThanOrEqual(
          layout.viewportWidth + 1
        );

        /**
         * Propósito:
         * Reservar la región central donde debe permanecer visible el logo.
         *
         * Contexto:
         * Los valores son proporcionales al escenario y no dependen de un DPR
         * físico ni de una resolución concreta.
         */
        const centralLogoSafetyArea: Rectangle = {
          left:
            layout.stage.left +
            layout.stage.width * 0.31,
          right:
            layout.stage.left +
            layout.stage.width * 0.69,
          top:
            layout.stage.top +
            layout.stage.height * 0.31,
          bottom:
            layout.stage.top +
            layout.stage.height * 0.65
        };

        expect(
          rectanglesOverlap(
            layout.plc,
            centralLogoSafetyArea
          ),
          `El panel PLC invade la zona del logo en ${localizedRoute.label}.`
        ).toBe(false);

        expect(
          rectanglesOverlap(
            layout.robots,
            centralLogoSafetyArea
          ),
          `El panel ROBOTS invade la zona del logo en ${localizedRoute.label}.`
        ).toBe(false);

        expect(
          rectanglesOverlap(
            layout.software,
            centralLogoSafetyArea
          ),
          `El panel SOFTWARE invade la zona del logo en ${localizedRoute.label}.`
        ).toBe(false);

        expect(
          layout.stage.height / layout.stage.width,
          `El escenario móvil de ${localizedRoute.label} es excesivamente alto.`
        ).toBeLessThanOrEqual(1.35);

        expect(
          layout.dock.left,
          `El dock de ${localizedRoute.label} sale por el borde izquierdo.`
        ).toBeGreaterThanOrEqual(
          layout.stage.left - 1
        );

        expect(
          layout.dock.right,
          `El dock de ${localizedRoute.label} sale por el borde derecho.`
        ).toBeLessThanOrEqual(
          layout.stage.right + 1
        );

        expect(
          layout.dock.bottom,
          `El dock de ${localizedRoute.label} sale por la parte inferior.`
        ).toBeLessThanOrEqual(
          layout.stage.bottom + 1
        );
      }
    );
  }

  test("mantiene navegación y enlaces técnicos utilizables", async ({
    page
  }) => {
    await page.goto("/es/", {
      waitUntil: "domcontentloaded"
    });

    const visiblePrimaryPanels = page.locator(
      '.hero3d__panel[data-mobile-visible="true"]'
    );

    const mobileDockLinks = page.locator(
      ".hero3d__mobileDock a"
    );
    const expectedDockPanelIds = [
      "data",
      "hmi",
      "iot"
    ] as const;

    await expect(visiblePrimaryPanels).toHaveCount(3);
    await expect(mobileDockLinks).toHaveCount(3);

    for (const panelId of expectedDockPanelIds) {
      const dockPanel = page.locator(
        `[data-mobile-dock-panel="${panelId}"]`
      );

      await expect(dockPanel).toBeVisible();
      await expect(dockPanel).toHaveCSS(
        "visibility",
        "visible"
      );

      const style = await dockPanel.evaluate(
        (element) => {
          const computedStyle =
            window.getComputedStyle(element);

          return {
            opacity: Number(computedStyle.opacity),
            pointerEvents:
              computedStyle.pointerEvents,
            width:
              element.getBoundingClientRect().width,
            height:
              element.getBoundingClientRect().height
          };
        }
      );

      expect(style.opacity).toBeGreaterThan(0.99);
      expect(style.pointerEvents).not.toBe("none");
      expect(style.width).toBeGreaterThan(0);
      expect(style.height).toBeGreaterThanOrEqual(42);
    }

    for (
      let index = 0;
      index < await visiblePrimaryPanels.count();
      index += 1
    ) {
      await expect(
        visiblePrimaryPanels.nth(index)
      ).toBeVisible();
    }

    for (
      let index = 0;
      index < await mobileDockLinks.count();
      index += 1
    ) {
      const link = mobileDockLinks.nth(index);

      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", /.+/);

      const box = await link.boundingBox();

      expect(box).not.toBeNull();

      if (!box) {
        throw new Error(
          `No fue posible medir el enlace móvil número ${index}.`
        );
      }

      expect(box.height).toBeGreaterThanOrEqual(42);
    }
  });

  test("mantiene fallback accesible cuando WebGL no está disponible", async ({
    page
  }) => {
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

    await expect(hero).toHaveAttribute(
      "data-hero3d-state",
      "fallback"
    );

    await expect(
      page.locator("[data-hero-fallback]")
    ).toBeVisible();

    await expect(
      page.locator(".hero3d__mobileDock")
    ).toBeVisible();

    await expect(
      page.locator("[data-hero-viewer] canvas")
    ).toHaveCount(0);
  });
});
