import { expect, test } from "@playwright/test";

/**
 * Propósito:
 * Verificar mediante geometría real del DOM que las .servicePathCard de una
 * misma fila (Home y Services, ES/EN/DE) mantienen una composición visual
 * coherente: CTA alineado abajo, bloque de tags anclado justo antes del CTA,
 * y sin desbordamientos, en todos los tamaños responsive soportados.
 *
 * Contexto:
 * .servicePathCard usa `grid-template-rows: auto 1fr auto` (cabecera, tags,
 * botón) y `ul { align-content: flex-end }`, de forma que la fila de tags
 * absorbe la diferencia de altura entre títulos/descripciones y ancla su
 * borde inferior justo antes del CTA, independientemente de cuántas líneas
 * de tags necesite cada card. No se exige altura idéntica entre cards de
 * distinta fila, ni que el tope superior de los tags coincida.
 */

const routes = [
  { url: "/es/", context: "Home", locale: "ES" },
  { url: "/en/", context: "Home", locale: "EN" },
  { url: "/de/", context: "Home", locale: "DE" },
  { url: "/es/servicios/", context: "Services", locale: "ES" },
  { url: "/en/services/", context: "Services", locale: "EN" },
  { url: "/de/leistungen/", context: "Services", locale: "DE" }
] as const;

const viewports = [
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 }
] as const;

type CardGeometry = {
  cardTop: number;
  cardBottom: number;
  cardRight: number;
  buttonTop: number;
  buttonBottom: number;
  ulBottom: number;
};

/**
 * Propósito:
 * Leer la geometría real (getBoundingClientRect) de cada .servicePathCard
 * visible y de su botón/lista de tags.
 *
 * Retorno:
 * Un array de CardGeometry, uno por card, en el orden del DOM.
 *
 * Excepciones:
 * Lanza Error si una card no tiene botón o lista de tags, para que el
 * resultado nunca contenga valores indefinidos.
 */
function readServicePathCards(): CardGeometry[] {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(".servicePathCard")
  );

  return cards.map((card) => {
    const cardRect = card.getBoundingClientRect();
    const button = card.querySelector<HTMLElement>(".button");
    const ul = card.querySelector<HTMLElement>("ul");

    if (!button || !ul) {
      throw new Error("Una .servicePathCard no tiene botón o lista de tags.");
    }

    const buttonRect = button.getBoundingClientRect();
    const ulRect = ul.getBoundingClientRect();

    return {
      cardTop: cardRect.top,
      cardBottom: cardRect.bottom,
      cardRight: cardRect.right,
      buttonTop: buttonRect.top,
      buttonBottom: buttonRect.bottom,
      ulBottom: ulRect.bottom
    };
  });
}

/**
 * Propósito:
 * Agrupar cards por fila visual, usando la coordenada superior de cada card
 * con una tolerancia de 2px.
 */
function groupByRow(cards: CardGeometry[]): CardGeometry[][] {
  const rows: CardGeometry[][] = [];

  for (const card of cards) {
    const row = rows.find(
      (candidate) => Math.abs(candidate[0]!.cardTop - card.cardTop) < 2
    );

    if (row) {
      row.push(card);
    } else {
      rows.push([card]);
    }
  }

  return rows;
}

const ALIGNMENT_TOLERANCE_PX = 2;

for (const route of routes) {
  test.describe(`servicePathCard alignment - ${route.context} ${route.locale}`, () => {
    for (const viewport of viewports) {
      test(`${viewport.name}px mantiene composición coherente`, async ({
        page
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        // "load" (not "domcontentloaded") avoids measuring the header logo
        // before its CSS width clamp resolves against its intrinsic size —
        // a transient state that produces spurious horizontal-overflow
        // readings unrelated to servicePathCard.
        await page.goto(route.url, { waitUntil: "load" });

        const cards = page.locator(".servicePathCard");

        await expect(cards.first()).toBeVisible();

        const geometry = await page.evaluate(readServicePathCards);

        expect(geometry.length).toBeGreaterThan(0);

        const hasHorizontalOverflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth + 1
        );

        expect(
          hasHorizontalOverflow,
          `Overflow horizontal en ${route.url} a ${viewport.name}px`
        ).toBe(false);

        for (const [index, card] of geometry.entries()) {
          expect(
            card.ulBottom,
            `Los tags de la card ${index} sobresalen de la card en ${route.url} a ${viewport.name}px`
          ).toBeLessThanOrEqual(card.cardBottom + 1);

          expect(
            card.buttonBottom,
            `El botón de la card ${index} sobresale de la card en ${route.url} a ${viewport.name}px`
          ).toBeLessThanOrEqual(card.cardBottom + 1);
        }

        const rows = groupByRow(geometry);

        for (const [rowIndex, row] of rows.entries()) {
          if (row.length < 2) {
            // Una sola card por fila (móvil): no aplica alineación cruzada.
            continue;
          }

          const buttonBottoms = row.map((card) => card.buttonBottom);
          const buttonDelta =
            Math.max(...buttonBottoms) - Math.min(...buttonBottoms);

          expect(
            buttonDelta,
            `CTA no alineado en fila ${rowIndex} de ${route.url} a ${viewport.name}px`
          ).toBeLessThanOrEqual(ALIGNMENT_TOLERANCE_PX);

          const ulBottoms = row.map((card) => card.ulBottom);
          const ulDelta = Math.max(...ulBottoms) - Math.min(...ulBottoms);

          expect(
            ulDelta,
            `Bloque de tags no alineado en fila ${rowIndex} de ${route.url} a ${viewport.name}px`
          ).toBeLessThanOrEqual(ALIGNMENT_TOLERANCE_PX);

          const gaps = row.map((card) => card.buttonTop - card.ulBottom);
          const gapDelta = Math.max(...gaps) - Math.min(...gaps);

          expect(
            gapDelta,
            `Separación tags→CTA inconsistente en fila ${rowIndex} de ${route.url} a ${viewport.name}px`
          ).toBeLessThanOrEqual(ALIGNMENT_TOLERANCE_PX);
        }
      });
    }
  });
}
