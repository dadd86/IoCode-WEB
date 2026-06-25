import {
  expect,
  test,
  type ConsoleMessage,
  type Page,
  type Request,
  type Response,
  type TestInfo
} from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type RouteType = "home" | "services" | "process" | "contact";

type RouteCase = {
  path: string;
  locale: "es" | "en" | "de";
  type: RouteType;
};


const criticalRoutes: RouteCase[] = [
  { path: "/es/", locale: "es", type: "home" },
  { path: "/es/servicios/", locale: "es", type: "services" },
  { path: "/es/proceso/", locale: "es", type: "process" },
  { path: "/es/contacto/", locale: "es", type: "contact" },
  { path: "/en/", locale: "en", type: "home" },
  { path: "/de/", locale: "de", type: "home" }
];

const artifactRoot = "qa-artifacts/visual/phase-1-1b";

function routeToSlug(route: string): string {
  return route.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "root";
}

function normalizeMessage(message: string): string {
  return message.replace(/\s+/g, " ").trim();
}

function getArtifactDirectory(testInfo: TestInfo): string {
  return join(artifactRoot, testInfo.project.name);
}

type RouteEvidence = {
  response: Awaited<ReturnType<Page["goto"]>>;
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  badResponses: string[];
};

async function openRouteAndCollectEvidence(page: Page, route: RouteCase): Promise<RouteEvidence> {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  const badResponses: string[] = [];

  page.on("console", (message: ConsoleMessage) => {
    if (message.type() === "error") {
      consoleErrors.push(normalizeMessage(message.text()));
    }
  });

  page.on("pageerror", (error: Error) => {
    pageErrors.push(normalizeMessage(error.message));
  });

  page.on("requestfailed", (request: Request) => {
    failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? "unknown"}`);
  });

  page.on("response", (response: Response) => {
    const status = response.status();

    if (status >= 400) {
      badResponses.push(`${status} ${response.url()}`);
    }
  });

  const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });

  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(500);

  return {
    response,
    consoleErrors,
    pageErrors,
    failedRequests,
    badResponses
  };
}

async function expectNoHorizontalOverflow(page: Page, route: string): Promise<void> {
  const overflow = await page.evaluate(() => {
    const documentElement = document.documentElement;
    const body = document.body;

    return {
      clientWidth: documentElement.clientWidth,
      documentScrollWidth: documentElement.scrollWidth,
      bodyScrollWidth: body.scrollWidth,
      overflowingElements: Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .map((element) => {
          const rect = element.getBoundingClientRect();

          return {
            tag: element.tagName.toLowerCase(),
            className: element.className,
            id: element.id,
            left: rect.left,
            right: rect.right,
            width: rect.width
          };
        })
        .filter((item) => item.right > documentElement.clientWidth + 2 || item.left < -2)
        .slice(0, 10)
    };
  });

  expect(
    overflow.documentScrollWidth,
    `${route} no debe tener overflow horizontal. Elementos sospechosos: ${JSON.stringify(overflow.overflowingElements, null, 2)}`
  ).toBeLessThanOrEqual(overflow.clientWidth + 2);

  expect(
    overflow.bodyScrollWidth,
    `${route} body no debe tener overflow horizontal. Elementos sospechosos: ${JSON.stringify(overflow.overflowingElements, null, 2)}`
  ).toBeLessThanOrEqual(overflow.clientWidth + 2);
}

async function expectBaseLayout(page: Page, route: RouteCase): Promise<void> {
  await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
  await expect(page.locator("header.siteHeader")).toBeVisible();
  await expect(page.locator("nav.navbar")).toBeVisible();
  await expect(page.locator("main#contenido")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1").first()).toBeVisible();

  const activeNavigationItems = page.locator('nav a[aria-current="page"]');
  await expect(activeNavigationItems.first(), `${route.path} debe marcar el menú activo`).toBeVisible();

  const logo = page.locator("header .brand__logo");
  await expect(logo, `${route.path} debe mostrar logo en header`).toBeVisible();
}

async function expectHomeVisual(page: Page, route: RouteCase): Promise<void> {
  await expect(page.locator(".hero3d").first(), `${route.path} debe mostrar hero`).toBeVisible();
  await expect(page.locator(".hero3d__scene").first(), `${route.path} debe mostrar escena hero 3D o fallback`).toBeVisible();
  await expect(page.locator(".buttonGroup a").first(), `${route.path} debe mostrar CTA principal`).toBeVisible();

  const panelCount = await page.locator(".hero3d__panel, .hero3d__mobileDock a").count();
  expect(panelCount, `${route.path} debe exponer paneles o dock móvil del hero 3D`).toBeGreaterThan(0);

  const cardCount = await page.locator(".serviceCard, .servicePathCard, .outcomeItem, .evidenceCard").count();
  expect(cardCount, `${route.path} debe mostrar cards/secciones de valor`).toBeGreaterThan(0);
}

async function expectServicesVisual(page: Page, route: RouteCase): Promise<void> {
  await expect(page.locator(".pageHero").first(), `${route.path} debe mostrar pageHero`).toBeVisible();

  const serviceCardCount = await page.locator(".serviceCard").count();
  expect(serviceCardCount, `${route.path} debe mostrar cards de servicios`).toBeGreaterThanOrEqual(3);

  const ctaCount = await page.locator(".button, .servicePathCard a").count();
  expect(ctaCount, `${route.path} debe tener CTAs/enlaces visibles`).toBeGreaterThan(0);
}

async function expectProcessVisual(page: Page, route: RouteCase): Promise<void> {
  await expect(page.locator(".processHero").first(), `${route.path} debe mostrar hero de proceso`).toBeVisible();
  await expect(page.locator(".processMethodCard").first(), `${route.path} debe mostrar tarjeta de método`).toBeVisible();

  const phaseCount = await page.locator(".processPhase").count();
  expect(phaseCount, `${route.path} debe mostrar fases del proceso`).toBeGreaterThanOrEqual(3);

  await expect(page.locator(".processCta").first(), `${route.path} debe mostrar CTA final`).toBeVisible();
}

async function expectContactVisual(page: Page, route: RouteCase): Promise<void> {
  await expect(page.locator(".pageHero").first(), `${route.path} debe mostrar pageHero`).toBeVisible();
  await expect(page.locator(".contactGrid").first(), `${route.path} debe mostrar grid de contacto`).toBeVisible();
  await expect(page.locator(".contactPanel").first(), `${route.path} debe mostrar panel de contacto`).toBeVisible();
  await expect(page.locator("form#contactForm"), `${route.path} debe mostrar formulario`).toBeVisible();

  await expect(page.locator('label[for="nombre"]')).toBeVisible();
  await expect(page.locator('label[for="correo"]')).toBeVisible();
  await expect(page.locator('label[for="tipoProyecto"]')).toBeVisible();
  await expect(page.locator('label[for="mensaje"]')).toBeVisible();

  await expect(page.locator("#nombre")).toBeVisible();
  await expect(page.locator("#correo")).toBeVisible();
  await expect(page.locator("#tipoProyecto")).toBeVisible();
  await expect(page.locator("#mensaje")).toBeVisible();

  await expect(page.locator('button[type="submit"]')).toBeVisible();
}

async function expectRouteSpecificVisual(page: Page, route: RouteCase): Promise<void> {
  if (route.type === "home") {
    await expectHomeVisual(page, route);
    return;
  }

  if (route.type === "services") {
    await expectServicesVisual(page, route);
    return;
  }

  if (route.type === "process") {
    await expectProcessVisual(page, route);
    return;
  }

  await expectContactVisual(page, route);
}

async function writeEvidence(page: Page, route: RouteCase, testInfo: TestInfo): Promise<void> {
  const artifactDirectory = getArtifactDirectory(testInfo);
  mkdirSync(artifactDirectory, { recursive: true });

  const slug = routeToSlug(route.path);
  const screenshotPath = join(artifactDirectory, `${slug}.png`);
  const jsonPath = join(artifactDirectory, `${slug}.json`);

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  const evidence = await page.evaluate(() => ({
    title: document.title,
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    scroll: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight
    },
    h1: document.querySelector("h1")?.textContent?.trim() ?? null,
    activeNavigation: Array.from(document.querySelectorAll('nav a[aria-current="page"]')).map((item) =>
      item.textContent?.trim()
    ),
    visibleButtons: Array.from(document.querySelectorAll("a.button, button")).map((item) =>
      item.textContent?.trim()
    )
  }));

  writeFileSync(jsonPath, JSON.stringify(evidence, null, 2), "utf-8");
}

test.describe("Fase 1.1B - QA visual avanzado", () => {
  for (const route of criticalRoutes) {
    test(`${route.path} estructura visual, consola y captura`, async ({ page }: { page: Page }, testInfo: TestInfo) => {
      await page.goto(route.path);

      await expectBaseLayout(page, route);
      await expectRouteSpecificVisual(page, route);
      await expectAboveTheFoldVisible(page, route);
      await expectNoHorizontalOverflow(page, route.path);
      await writeEvidence(page, route, testInfo);
    });
  }
});

function getAboveTheFoldAnchorSelectors(route: RouteCase): string[] {
  if (route.type === "home") {
    return [".hero3d", ".hero3d__scene", ".buttonGroup a"];
  }

  if (route.type === "services") {
    return [".pageHero", ".serviceCard"];
  }

  if (route.type === "process") {
    return [".processHero", ".processMethodCard"];
  }

  return [".pageHero", ".contactGrid", "form#contactForm"];
}

async function expectAboveTheFoldVisible(page: Page, route: RouteCase): Promise<void> {
  const anchorSelectors = getAboveTheFoldAnchorSelectors(route);

  const aboveTheFold: AboveTheFoldState = await page.evaluate((selectors: string[]) => {
    const viewportHeight = window.innerHeight;

    function getVisibilityInfo(element: Element | null): VisibilityInfo | null {
      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();

      return {
        selector: element.tagName.toLowerCase(),
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        visibleInFirstViewport:
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < viewportHeight
      };
    }

    const header = getVisibilityInfo(document.querySelector("header"));
    const h1 = getVisibilityInfo(document.querySelector("h1"));

    const anchors = selectors.flatMap((selector: string) =>
      Array.from(document.querySelectorAll(selector))
        .map((element: Element) => getVisibilityInfo(element))
        .filter((item: VisibilityInfo | null): item is VisibilityInfo => item !== null)
        .map((item: VisibilityInfo) => ({
          ...item,
          selector
        }))
    );

    return {
      viewportHeight,
      header,
      h1,
      anchors
    };
  }, anchorSelectors);

  expect(
    aboveTheFold.header?.visibleInFirstViewport,
    `${route.path} debe mostrar header en el primer viewport`
  ).toBe(true);

  expect(
    aboveTheFold.h1?.visibleInFirstViewport,
    `${route.path} debe mostrar h1 en el primer viewport`
  ).toBe(true);

  expect(
    aboveTheFold.anchors.some((anchor: VisibilityInfo) => anchor.visibleInFirstViewport),
    `${route.path} debe mostrar contenido principal visible en el primer viewport. Selectores evaluados: ${anchorSelectors.join(", ")}`
  ).toBe(true);
}

type VisibilityInfo = {
  selector: string;
  top: number;
  bottom: number;
  width: number;
  height: number;
  visibleInFirstViewport: boolean;
};

type AboveTheFoldState = {
  viewportHeight: number;
  header: VisibilityInfo | null;
  h1: VisibilityInfo | null;
  anchors: VisibilityInfo[];
};

