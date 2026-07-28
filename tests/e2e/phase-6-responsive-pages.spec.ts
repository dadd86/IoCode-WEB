import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

/**
 * Propósito:
 * Generar evidencia visual reproducible de todas las páginas internas en los
 * tres idiomas y comprobar que la cabecera, el título y el ancho del documento
 * permanecen dentro del viewport.
 *
 * Contexto:
 * Las capturas de dispositivo real mostraron guionado automático y columnas
 * editoriales demasiado estrechas que las pruebas de overflow no detectaban.
 */

type RouteCase = {
  key: string;
  route: string;
};

const screenshotRoot =
  "qa-artifacts/performance/phase-6/responsive-pages";

const routes: RouteCase[] = [
  { key: "es-services", route: "/es/servicios/" },
  { key: "en-services", route: "/en/services/" },
  { key: "de-services", route: "/de/leistungen/" },
  { key: "es-plc", route: "/es/automatizacion-plc/" },
  { key: "en-plc", route: "/en/plc-automation/" },
  { key: "de-plc", route: "/de/sps-automatisierung/" },
  {
    key: "es-robotics",
    route: "/es/robotica-industrial/"
  },
  {
    key: "en-robotics",
    route: "/en/industrial-robotics/"
  },
  {
    key: "de-robotics",
    route: "/de/industrierobotik/"
  },
  { key: "es-company", route: "/es/empresa/" },
  { key: "en-company", route: "/en/company/" },
  { key: "de-company", route: "/de/unternehmen/" },
  { key: "es-projects", route: "/es/proyectos/" },
  { key: "en-projects", route: "/en/projects/" },
  { key: "de-projects", route: "/de/projekte/" },
  { key: "es-skills", route: "/es/habilidades/" },
  { key: "en-skills", route: "/en/skills/" },
  { key: "de-skills", route: "/de/faehigkeiten/" },
  { key: "es-process", route: "/es/proceso/" },
  { key: "en-process", route: "/en/process/" },
  { key: "de-process", route: "/de/prozess/" },
  { key: "es-contact", route: "/es/contacto/" },
  { key: "en-contact", route: "/en/contact/" },
  { key: "de-contact", route: "/de/kontakt/" }
];

const viewports = [
  {
    name: "mobile-390",
    width: 390,
    height: 844
  },
  {
    name: "tablet-768",
    width: 768,
    height: 1024
  },
  {
    name: "desktop-1440",
    width: 1440,
    height: 900
  }
] as const;

test.setTimeout(120_000);

test.describe("Fase 6 - evidencia visual responsive", () => {
  test.beforeAll(() => {
    mkdirSync(screenshotRoot, {
      recursive: true
    });
  });

  for (const viewport of viewports) {
    test(
      `${viewport.name} conserva títulos y cabecera`,
      async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        for (const routeCase of routes) {
          await page.goto(routeCase.route, {
            waitUntil: "domcontentloaded"
          });

          await page.evaluate(async () => {
            if ("fonts" in document) {
              await document.fonts.ready;
            }

            window.scrollTo(0, 0);
          });

          await page.addStyleTag({
            content: `
              *,
              *::before,
              *::after {
                animation: none !important;
                transition: none !important;
                caret-color: transparent !important;
              }
            `
          });

          const heading = page.locator("main h1").first();
          const header = page.locator(".siteHeader");

          await expect(heading).toBeVisible();
          await expect(header).toBeVisible();

          const layout = await page.evaluate(() => {
            const documentElement =
              document.documentElement;
            const headingElement =
              document.querySelector<HTMLElement>(
                "main h1"
              );

            if (!headingElement) {
              throw new Error(
                "No se encontró el H1 de la página."
              );
            }

            const headingRect =
              headingElement.getBoundingClientRect();
            const headingStyles =
              window.getComputedStyle(headingElement);

            return {
              scrollWidth: documentElement.scrollWidth,
              clientWidth: documentElement.clientWidth,
              headingLeft: headingRect.left,
              headingRight: headingRect.right,
              hyphens: headingStyles.hyphens,
              wordBreak: headingStyles.wordBreak
            };
          });

          expect(layout.scrollWidth).toBeLessThanOrEqual(
            layout.clientWidth + 1
          );
          expect(layout.headingLeft).toBeGreaterThanOrEqual(
            0
          );
          expect(layout.headingRight).toBeLessThanOrEqual(
            viewport.width + 1
          );
          expect(layout.hyphens).toBe("none");
          expect(layout.wordBreak).toBe("normal");

          await page.screenshot({
            path:
              `${screenshotRoot}/` +
              `${viewport.name}-${routeCase.key}.png`,
            fullPage: false,
            animations: "disabled",
            scale: "css"
          });
        }
      }
    );
  }
});
