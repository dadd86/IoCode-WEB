import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8");

test("sole-proprietor identity has one versioned source without deployment overrides", async () => {
  const [config, profile, productionEnv, legalPage, productionGate] = await Promise.all([
    read("src/config/legal.ts"),
    read("src/data/legal-profile.ts"),
    read(".env.production.example"),
    read("src/components/LegalPage.astro"),
    read("tools/qa-production-config.mjs")
  ]);

  for (const variable of [
    "PUBLIC_LEGAL_NAME", "PUBLIC_LEGAL_BUSINESS_NAME", "PUBLIC_LEGAL_FORM",
    "PUBLIC_LEGAL_STREET", "PUBLIC_LEGAL_POSTAL_CODE", "PUBLIC_LEGAL_CITY",
    "PUBLIC_LEGAL_COUNTRY", "PUBLIC_LEGAL_EMAIL", "PUBLIC_LEGAL_VAT_ID",
    "PUBLIC_LEGAL_APPROVED", "PUBLIC_PRIVACY_APPROVED"
  ]) {
    assert.doesNotMatch(`${config}\n${productionEnv}`, new RegExp(variable, "u"));
  }

  assert.match(config, /\.\.\.publicLegalProfile/u);
  assert.match(profile, /legalForm: "Einzelunternehmen"/u);
  assert.match(profile, /vatId: "DE461105535"/u);
  assert.match(config, /legalVersion: "2026-09-05.3"/u);
  assert.doesNotMatch(`${config}\n${legalPage}`, /legalRepresentative|registerName|registerNumber|contentResponsible/iu);
  assert.doesNotMatch(productionGate, /PUBLIC_LEGAL_VAT_ID/u);
});

test("executed Hetzner and Zoho DPAs are disclosed without overclaiming provider evidence", async () => {
  const [config, governance, legalCopy] = await Promise.all([
    read("src/config/legal.ts"),
    read("config/privacy-governance.json"),
    read("src/data/legal.ts")
  ]);

  assert.doesNotMatch(config, /Hetzner Online GmbH|Zoho Corporation B\.V\.|Germany \(EEA\)/u);
  assert.match(governance, /"provider": "Hetzner Online GmbH"/u);
  assert.match(governance, /"dpaStatus": "executed"/u);
  assert.match(governance, /"provider": "Zoho Corporation B\.V\."/u);
  assert.match(governance, /"dpaStatus": "executed-2026-08-19"/u);
  assert.match(governance, /BSI C5 Type 2/u);
  assert.match(legalCopy, /Article 46\(2\)\(c\) GDPR/u);
  assert.doesNotMatch(`${config}\n${governance}\n${legalCopy}`, /27001:2022/u);
  assert.doesNotMatch(
    legalCopy,
    /IoCode SOLUTIONS (?:está|is|ist) (?:certificada|certified|zertifiziert)/iu
  );
  assert.doesNotMatch(`${config}\n${governance}\n${legalCopy}`, /TÜV Rheinland/iu);
});

test("supervisory authority is resolved to the controller's actual NRW establishment", async () => {
  const [profile, legalCopy, ropa] = await Promise.all([
    read("src/data/legal-profile.ts"),
    read("src/data/legal.ts"),
    read("docs/ROPA_INVENTORY.md")
  ]);

  assert.match(profile, /Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen/u);
  assert.match(profile, /https:\/\/www\.ldi\.nrw\.de/u);
  assert.doesNotMatch(`${profile}\n${legalCopy}\n${ropa}`, /\bX1\b/u);
  assert.match(legalCopy, /supervisory authority/iu);
  assert.match(ropa, /Aachen/u);
});

test("requested short privacy routes redirect to localized canonical pages", async () => {
  const server = await read("Docker/node-static-server.mjs");

  for (const [alias, canonical] of [
    ["/datenschutz", "/de/datenschutz/"],
    ["/privacy-policy", "/en/privacy/"],
    ["/politica-privacidad", "/es/privacidad/"]
  ]) {
    assert.ok(
      server.includes(`["${alias}", "${canonical}"]`),
      `missing redirect ${alias} -> ${canonical}`
    );
  }
});

test("contact UX adds a honeypot and honest mail-client states while remaining backend-free", async () => {
  const [component, ui] = await Promise.all([
    read("src/components/ContactForm.astro"),
    read("src/i18n/ui.ts")
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
  assert.match(deployWorkflow, /actions\/setup-node@v4/u);
  assert.match(deployWorkflow, /node-version: 24/u);
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
