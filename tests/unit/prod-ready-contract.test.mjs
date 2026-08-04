import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8");

test("Hamburg legal identity is the versioned default without bypassing approval", async () => {
  const [config, productionEnv, dockerfile, productionGate] = await Promise.all([
    read("src/config/legal.ts"),
    read(".env.production.example"),
    read("Docker/Dockerfile"),
    read("tools/qa-production-config.mjs")
  ]);

  for (const source of [config, productionEnv, dockerfile]) {
    assert.match(source, /c\/o IP-Management #11289, Ludwig-Erhard-Straße 18/u);
    assert.match(source, /20459/u);
    assert.match(source, /Hamburg/u);
    assert.match(source, /DE461105535/u);
  }

  assert.match(config, /Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit/u);
  assert.match(config, /https:\/\/datenschutz-hamburg\.de\/service-information\/beschwerde-oder-hinweis-einreichen/u);
  assert.match(config, /legalVersion: "2026-08-04\.1"/u);
  assert.match(productionGate, /PUBLIC_LEGAL_VAT_ID/u);
  assert.match(config, /PUBLIC_LEGAL_APPROVED/u);
  assert.match(config, /PUBLIC_PRIVACY_APPROVED/u);
});

test("Hetzner disclosure is factual and does not invent a TÜV Rheinland certificate", async () => {
  const [config, governance, legalCopy] = await Promise.all([
    read("src/config/legal.ts"),
    read("config/privacy-governance.json"),
    read("src/data/legal.ts")
  ]);

  assert.match(config, /Hetzner Online GmbH/u);
  assert.match(config, /Germany \(EEA\)/u);
  assert.match(governance, /"provider": "Hetzner Online GmbH"/u);
  assert.match(governance, /"dpaStatus": "pending"/u);
  assert.doesNotMatch(`${config}\n${governance}\n${legalCopy}`, /TÜV Rheinland/iu);
});

test("contact UX adds a honeypot and honest mail-client states while remaining backend-free", async () => {
  const [component, ui, legalCopy] = await Promise.all([
    read("src/components/ContactForm.astro"),
    read("src/i18n/ui.ts"),
    read("src/data/legal.ts")
  ]);

  for (const token of [
    'name="website"',
    "data-contact-honeypot",
    "data-contact-status",
    "data-state-sending",
    "data-state-prepared",
    "data-state-error"
  ]) {
    assert.ok(component.includes(token), `missing ${token}`);
  }

  assert.match(ui, /contactSending/u);
  assert.match(ui, /contactPrepared/u);
  assert.match(ui, /contactError/u);
  assert.match(legalCopy, /navigator\.clipboard\.writeText/u);
  assert.doesNotMatch(component, /\baction\s*=/u);
  assert.doesNotMatch(component, /\bfetch\s*\(/u);
  await assert.rejects(access("src/pages/api/contact.ts"));
});

test("custom 500 pages and multi-resolution favicon declarations exist", async () => {
  for (const path of [
    "src/pages/500.astro",
    "src/pages/es/500.astro",
    "src/pages/en/500.astro",
    "src/pages/de/500.astro"
  ]) {
    await access(path);
  }

  const layout = await read("src/layouts/BaseLayout.astro");
  assert.match(layout, /rel="icon"[^>]+sizes="256x256"/u);
  assert.match(layout, /rel="icon"[^>]+sizes="512x512"/u);
  assert.match(layout, /rel="apple-touch-icon"/u);
});

test("master success deploys the immutable image through the protected production runner", async () => {
  const [releaseWorkflow, deployWorkflow] = await Promise.all([
    read(".github/workflows/ci-release.yml"),
    read(".github/workflows/deploy.yml")
  ]);

  assert.match(releaseWorkflow, /github\.ref == 'refs\/heads\/master'/u);
  assert.match(releaseWorkflow, /docker push/u);
  assert.match(deployWorkflow, /workflow_run:/u);
  assert.match(deployWorkflow, /head_branch == 'master'/u);
  assert.match(deployWorkflow, /environment: production/u);
  assert.match(deployWorkflow, /tools\/deploy-release\.sh/u);
  assert.match(deployWorkflow, /docker image prune -f/u);
});

test("production Compose retains non-root hardening, health and bounded logs", async () => {
  const compose = await read("compose.production.yml");
  for (const contract of [
    'user: "1000:1000"',
    "read_only: true",
    "no-new-privileges:true",
    "healthcheck:",
    'max-size: "10m"',
    'max-file: "3"'
  ]) {
    assert.ok(compose.includes(contract), `missing ${contract}`);
  }
});

