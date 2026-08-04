import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("PageControl expone el contrato ARIA e i18n en las seis rutas", async () => {
  const [component, route, projects, skills, ui] = await Promise.all([
    source("src/components/PageControl.astro"),
    source("src/pages/[locale]/[...slug].astro"),
    source("src/components/ProjectCard.astro"),
    source("src/components/SkillCard.astro"),
    source("src/i18n/ui.ts")
  ]);

  assert.match(component, /role="tablist"/);
  assert.match(component, /role="tab"/);
  assert.match(component, /aria-selected/);
  assert.match(component, /aria-controls/);
  assert.match(projects, /"tabpanel"/);
  assert.match(skills, /"tabpanel"/);
  assert.match(route, /kind="projects"/);
  assert.match(route, /kind="skills"/);
  assert.match(ui, /Ir a página \{current\} de \{total\}/);
  assert.match(ui, /Go to page \{current\} of \{total\}/);
  assert.match(ui, /Zu Seite \{current\} von \{total\} gehen/);
});

test("la interacción es nativa, ligera y respeta movimiento reducido", async () => {
  const [script, styles] = await Promise.all([
    source("src/scripts/page-control.ts"),
    source("src/assets/components.css")
  ]);

  const normalizedScript = script.replaceAll("\r\n", "\n");
  assert.ok(Buffer.byteLength(normalizedScript, "utf8") < 2_048, "el script fuente debe pesar menos de 2 KB");
  assert.match(script, /ArrowLeft/);
  assert.match(script, /ArrowRight/);
  assert.match(script, /Home/);
  assert.match(script, /End/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(styles, /scroll-snap-type:\s*inline mandatory/);
  assert.match(styles, /touch-action:\s*pan-x pan-y/);
  assert.match(styles, /min-width:\s*2\.75rem/);
  assert.match(styles, /min-height:\s*2\.75rem/);
  assert.match(styles, /#22d3ee/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});
