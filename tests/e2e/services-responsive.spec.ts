import { expect, test } from "@playwright/test";

/**
 * Propósito:
 * Validar que las páginas de servicios en ES, EN y DE no produzcan overflow,
 * recortes del título ni desplazamiento del mapa visual en diferentes tamaños.
 *
 * Tipos de datos:
 * - Route: ruta relativa localizada.
 * - ViewportDefinition: dimensiones CSS del navegador.
 * - ServicesLayout: medidas numéricas obtenidas del DOM.
 *
 * Contexto:
 * Esta prueba se ejecuta contra la compilación estática servida por Docker.
 */
const routes = [
  "/es/servicios/",
  "/en/services/",
  "/de/leistungen/"
] as const;

const internalPageRoutes = [
  "/es/automatizacion-plc/",
  "/en/plc-automation/",
  "/de/sps-automatisierung/",
  "/es/robotica-industrial/",
  "/en/industrial-robotics/",
  "/de/industrierobotik/",
  "/es/empresa/",
  "/en/company/",
  "/de/unternehmen/",
  "/es/proyectos/",
  "/en/projects/",
  "/de/projekte/",
  "/es/habilidades/",
  "/en/skills/",
  "/de/faehigkeiten/",
  "/es/contacto/",
  "/en/contact/",
  "/de/kontakt/",
  "/es/proceso/",
  "/en/process/",
  "/de/prozess/"
] as const;

const viewports = [
  { name: "mobile-small", width: 360, height: 800 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 }
] as const;

type ServicesLayout = {
  scrollWidth: number;
  clientWidth: number;
  headingLeft: number;
  headingRight: number;
  mapLeft: number;
  mapRight: number;
  viewportWidth: number;
};

/**
 * Propósito:
 * Obtener las medidas relevantes del hero de servicios.
 *
 * Parámetros:
 * No recibe parámetros; consulta el documento cargado en el navegador.
 *
 * Retorno:
 * ServicesLayout cuando los elementos existen.
 *
 * Excepciones:
 * Lanza Error si el título o el mapa no están presentes. De este modo el
 * retorno nunca contiene undefined ni null y TypeScript puede verificarlo.
 */
function readServicesLayout(): ServicesLayout {
  const documentElement = document.documentElement;

  const headingElement = document.querySelector<HTMLElement>(
    ".pageHero--services h1"
  );

  const serviceMapElement = document.querySelector<HTMLElement>(
    ".pageHero__serviceMap"
  );

  if (!headingElement || !serviceMapElement) {
    throw new Error(
      "No se encontraron el título o el mapa del hero de servicios."
    );
  }

  const headingRect = headingElement.getBoundingClientRect();
  const mapRect = serviceMapElement.getBoundingClientRect();

  return {
    scrollWidth: documentElement.scrollWidth,
    clientWidth: documentElement.clientWidth,
    headingLeft: headingRect.left,
    headingRight: headingRect.right,
    mapLeft: mapRect.left,
    mapRight: mapRect.right,
    viewportWidth: window.innerWidth
  };
}

test.describe("Servicios responsive", () => {
  for (const route of routes) {
    for (const viewport of viewports) {
      test(`${route} ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        await page.goto(route, {
          waitUntil: "domcontentloaded"
        });

        const hero = page.locator(".pageHero--services");
        const heading = hero.locator("h1");
        const map = hero.locator(".pageHero__serviceMap");

        await expect(hero).toBeVisible();
        await expect(heading).toBeVisible();
        await expect(map).toBeVisible();

        const layout = await page.evaluate(readServicesLayout);

        expect(
          layout.scrollWidth,
          `Existe overflow horizontal en ${route} con viewport ${viewport.name}`
        ).toBeLessThanOrEqual(layout.clientWidth + 1);

        expect(
          layout.headingLeft,
          `El título sale por el lado izquierdo en ${route} con viewport ${viewport.name}`
        ).toBeGreaterThanOrEqual(0);

        expect(
          layout.headingRight,
          `El título sale por el lado derecho en ${route} con viewport ${viewport.name}`
        ).toBeLessThanOrEqual(layout.viewportWidth + 1);

        expect(
          layout.mapLeft,
          `El mapa sale por el lado izquierdo en ${route} con viewport ${viewport.name}`
        ).toBeGreaterThanOrEqual(0);

        expect(
          layout.mapRight,
          `El mapa sale por el lado derecho en ${route} con viewport ${viewport.name}`
        ).toBeLessThanOrEqual(layout.viewportWidth + 1);
      });
    }
  }
});

test.describe("Navegación responsive", () => {
  const navigationViewports = [
    {
      name: "mobile",
      width: 390,
      height: 844,
      expectsHamburger: true
    },
    {
      name: "tablet-portrait",
      width: 768,
      height: 1024,
      expectsHamburger: true
    },
    {
      name: "tablet-landscape",
      width: 1024,
      height: 768,
      expectsHamburger: true
    },
    {
      name: "tablet-wide",
      width: 1280,
      height: 800,
      expectsHamburger: true
    },
    {
      name: "desktop",
      width: 1366,
      height: 900,
      expectsHamburger: false
    }
  ] as const;

  for (const viewport of navigationViewports) {
    test(
      `menú principal en ${viewport.name}`,
      async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        await page.goto("/es/servicios/", {
          waitUntil: "domcontentloaded"
        });

        const desktopNavigation =
          page.locator(".desktopNavigation");
        const mobileMenu =
          page.locator(".mobileMenu");
        const mobileToggle =
          page.locator(".mobileMenu__toggle");

        if (viewport.expectsHamburger) {
          await expect(desktopNavigation).toBeHidden();
          await expect(mobileMenu).toBeVisible();
          await expect(mobileToggle).toBeVisible();

          await mobileToggle.click();

          await expect(mobileMenu).toHaveAttribute(
            "open",
            ""
          );

          const mobileLinks = page.locator(
            ".navLinks--mobile a"
          );

          await expect(mobileLinks.first()).toBeVisible();
          expect(await mobileLinks.count()).toBeGreaterThan(3);
        } else {
          await expect(desktopNavigation).toBeVisible();
          await expect(mobileMenu).toBeHidden();

          const navigationIntegrity =
            await desktopNavigation.evaluate(
              (element) => {
                const links = Array.from(
                  element.querySelectorAll<HTMLElement>(
                    "a"
                  )
                );

                const rects = links.map((link) =>
                  link.getBoundingClientRect()
                );

                const hasOverlap = rects.some(
                  (rect, index) => {
                    const previousRect =
                      rects[index - 1];

                    return Boolean(
                      previousRect &&
                        rect.left <
                          previousRect.right - 1
                    );
                  }
                );

                const hasClippedLink = links.some(
                  (link) =>
                    link.scrollWidth >
                    link.clientWidth + 1
                );

                return {
                  hasOverlap,
                  hasClippedLink
                };
              }
            );

          expect(navigationIntegrity.hasOverlap).toBe(
            false
          );
          expect(navigationIntegrity.hasClippedLink).toBe(
            false
          );
        }
      }
    );
  }
});

test.describe("Regresión tipográfica de páginas internas", () => {
  const typographyViewports = [
    {
      name: "mobile",
      width: 390,
      height: 844
    },
    {
      name: "tablet",
      width: 768,
      height: 1024
    },
    {
      name: "desktop",
      width: 1440,
      height: 900
    }
  ] as const;

  for (const viewport of typographyViewports) {
    test(
      `títulos completos y proporcionados en ${viewport.name}`,
      async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        for (const route of internalPageRoutes) {
          await page.goto(route, {
            waitUntil: "domcontentloaded"
          });

          const heading = page.locator(
            ".pageHero h1, .processHero h1"
          ).first();

          await expect(heading).toBeVisible();

          const measurements = await heading.evaluate(
            (element) => {
              const headingElement =
                element as HTMLElement;
              const rect =
                headingElement.getBoundingClientRect();
              const styles =
                window.getComputedStyle(headingElement);

              return {
                clientWidth: headingElement.clientWidth,
                scrollWidth: headingElement.scrollWidth,
                left: rect.left,
                right: rect.right,
                fontSize: Number.parseFloat(
                  styles.fontSize
                ),
                hyphens: styles.hyphens,
                wordBreak: styles.wordBreak
              };
            }
          );

          expect(
            measurements.hyphens,
            `El título admite guiones automáticos en ${route}`
          ).toBe("none");

          expect(
            measurements.wordBreak,
            `El título puede cortar palabras en ${route}`
          ).toBe("normal");

          expect(
            measurements.scrollWidth,
            `El título desborda su caja en ${route}`
          ).toBeLessThanOrEqual(
            measurements.clientWidth + 1
          );

          expect(
            measurements.left,
            `El título sale por la izquierda en ${route}`
          ).toBeGreaterThanOrEqual(0);

          expect(
            measurements.right,
            `El título sale por la derecha en ${route}`
          ).toBeLessThanOrEqual(viewport.width + 1);

          const maximumFontSize =
            route.includes("proceso") ||
            route.includes("process") ||
            route.includes("prozess")
              ? viewport.width >= 1200
                ? 86
                : 52
              : viewport.width >= 1200
                ? 72
                : 50;

          expect(
            measurements.fontSize,
            `El título es desproporcionado en ${route}`
          ).toBeLessThanOrEqual(maximumFontSize);

          if (viewport.width >= 720) {
            expect(
              measurements.clientWidth,
              `La columna del título es demasiado estrecha en ${route}`
            ).toBeGreaterThanOrEqual(
              Math.min(680, viewport.width - 96)
            );
          }

          const hasHorizontalOverflow =
            await page.evaluate(
              () =>
                document.documentElement.scrollWidth >
                document.documentElement.clientWidth + 1
            );

          expect(
            hasHorizontalOverflow,
            `Existe overflow horizontal en ${route}`
          ).toBe(false);

          if (
            route.includes("proceso") ||
            route.includes("process") ||
            route.includes("prozess")
          ) {
            const methodHeading = page.locator(
              ".processMethodCard h2"
            );

            await expect(methodHeading).toBeVisible();

            const methodHeadingWidth =
              await methodHeading.evaluate((element) => {
                const headingElement =
                  element as HTMLElement;

                return {
                  clientWidth:
                    headingElement.clientWidth,
                  scrollWidth:
                    headingElement.scrollWidth
                };
              });

            expect(
              methodHeadingWidth.scrollWidth,
              `El título del método se recorta en ${route}`
            ).toBeLessThanOrEqual(
              methodHeadingWidth.clientWidth + 1
            );
          }
        }
      }
    );
  }
});

test.describe("Regresión de contacto y selector de idioma", () => {
  test("contacto usa una columna legible en tablet", async ({
    page
  }) => {
    await page.setViewportSize({
      width: 768,
      height: 1024
    });

    await page.goto("/es/contacto/", {
      waitUntil: "domcontentloaded"
    });

    const grid = page.locator(".contactGrid");
    const panel = page.locator(".contactPanel");
    const form = page.locator(".contactForm");

    await expect(grid).toBeVisible();
    await expect(panel).toBeVisible();
    await expect(form).toBeVisible();

    const layout = await grid.evaluate((element) => {
      const gridElement = element as HTMLElement;
      const styles = window.getComputedStyle(gridElement);
      const panelElement =
        gridElement.querySelector<HTMLElement>(
          ".contactPanel"
        );
      const formElement =
        gridElement.querySelector<HTMLElement>(
          ".contactForm"
        );

      if (!panelElement || !formElement) {
        throw new Error(
          "No se encontraron los paneles de contacto."
        );
      }

      return {
        columns: styles.gridTemplateColumns
          .split(" ")
          .filter(Boolean).length,
        panelWidth:
          panelElement.getBoundingClientRect().width,
        formWidth:
          formElement.getBoundingClientRect().width
      };
    });

    expect(layout.columns).toBe(1);
    expect(layout.panelWidth).toBeGreaterThan(680);
    expect(layout.formWidth).toBeGreaterThan(680);
  });

  test("selector de idioma es compacto en escritorio", async ({
    page
  }) => {
    await page.setViewportSize({
      width: 1440,
      height: 900
    });

    await page.goto("/es/contacto/", {
      waitUntil: "domcontentloaded"
    });

    const switcher = page.locator(
      ".desktopLanguage .languageSwitcher"
    );

    await expect(switcher).toBeVisible();

    const box = await switcher.boundingBox();

    expect(box).not.toBeNull();
    expect(box?.height ?? Number.POSITIVE_INFINITY)
      .toBeLessThanOrEqual(44);
  });
});
