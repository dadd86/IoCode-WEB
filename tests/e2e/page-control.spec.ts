import { expect, test } from "@playwright/test";
import axe from "axe-core";

const routeCases = [
  { route: "/es/proyectos/", label: "Ir a página 1 de 8" },
  { route: "/en/projects/", label: "Go to page 1 of 8" },
  { route: "/de/projekte/", label: "Zu Seite 1 von 8 gehen" },
  { route: "/es/habilidades/", label: "Ir a página 1 de 8" },
  { route: "/en/skills/", label: "Go to page 1 of 8" },
  { route: "/de/faehigkeiten/", label: "Zu Seite 1 von 8 gehen" }
];

test.describe("PageControl accesible y localizado", () => {
  for (const { route, label } of routeCases) {
    test(`${route} expone ocho páginas y pasa Axe`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const control = page.locator("[data-page-control]");
      const tabs = control.getByRole("tab");
      const panels = control.getByRole("tabpanel", { includeHidden: true });

      await expect(control).toHaveCount(1);
      await expect(tabs).toHaveCount(8);
      await expect(panels).toHaveCount(8);
      await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
      await expect(tabs.first()).toHaveAttribute("aria-label", new RegExp(`^${label}`));

      await page.addScriptTag({ content: axe.source });
      const violations = await page.evaluate(async () => {
        const result = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }
        });
        return result.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
      });
      expect(violations).toEqual([]);
    });
  }

  test("teclado, activación directa y panel activo permanecen sincronizados", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-desktop", "Gate de teclado en escritorio");
    await page.goto("/es/proyectos/", { waitUntil: "domcontentloaded" });

    const tabs = page.getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await tabs.nth(2).press("Enter");
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel").first()).toHaveAttribute("id", "maceta-inteligente");
  });

  test("scroll táctil nativo actualiza el punto activo sin desbordar la página", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-mobile", "Gate táctil en Chromium móvil");
    await page.goto("/es/habilidades/", { waitUntil: "domcontentloaded" });

    const viewport = page.locator("[data-page-control-viewport]");
    const tabs = page.getByRole("tab");
    await viewport.evaluate((element) => element.scrollBy({ left: element.clientWidth, behavior: "auto" }));
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await tabs.nth(2).tap();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  });

  test("movimiento reducido desactiva el desplazamiento suave", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-desktop", "Gate de preferencia en escritorio");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/skills/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-page-control-viewport]")).toHaveCSS("scroll-behavior", "auto");
  });
});
