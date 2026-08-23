import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const read = (path) => readFile(resolve(root, path), "utf8");

test("localized legal routes use the required canonical slugs", async () => {
  const routes = await read("src/i18n/routes.ts");
  assert.match(routes, /\/es\/aviso-legal\//u);
  assert.match(routes, /\/en\/imprint\//u);
  assert.match(routes, /\/de\/impressum\//u);
  assert.match(routes, /\/es\/privacidad\//u);
  assert.match(routes, /\/en\/privacy\//u);
  assert.match(routes, /\/de\/datenschutz\//u);
});

test("production legal approval requires authority and provider disclosures", async () => {
  const config = await read("src/config/legal.ts");
  for (const variable of [
    "PUBLIC_LEGAL_APPROVED",
    "PUBLIC_PRIVACY_APPROVED",
    "PUBLIC_PRIVACY_AUTHORITY_NAME",
    "PUBLIC_PRIVACY_AUTHORITY_URL",
    "PUBLIC_HOSTING_PROVIDER",
    "PUBLIC_EMAIL_PROVIDER",
    "PUBLIC_DNS_PROVIDER",
    "PUBLIC_REGISTRAR_PROVIDER"
  ]) {
    assert.ok(config.includes(variable), `missing gate ${variable}`);
  }
});

test("governance inventory contains treatments, providers and no non-essential terminal storage", async () => {
  const governance = JSON.parse(await read("config/privacy-governance.json"));
  assert.equal(governance.treatments.length, 5);
  assert.equal(governance.providers.length, 5);
  assert.equal(governance.consentBanner.required, false);
  assert.ok(governance.terminalTechnologies.every((item) => "consentRequired" in item));
  assert.ok(
    governance.terminalTechnologies
      .filter((item) => ["HTTP cookies", "localStorage", "sessionStorage", "IndexedDB"].includes(item.technology))
      .every((item) => item.used === false)
  );
});

test("RAT is maintained and DSAR uses the GDPR one-month deadline", async () => {
  const [ropa, operations] = await Promise.all([
    read("docs/ROPA_INVENTORY.md"),
    read("docs/PRIVACY_OPERATIONS.md")
  ]);
  assert.match(ropa, /No se invoca la excepción del artículo 30\(5\)/u);
  assert.match(operations, /30 días naturales/u);
  assert.match(operations, /límite jurídico es un mes/u);
  assert.match(operations, /Verificar identidad de forma proporcional/u);
});

test("verified DPAs and unresolved providers have distinct gate states", async () => {
  const governance = JSON.parse(await read("config/privacy-governance.json"));
  const productionGate = await read("tools/qa-production-config.mjs");
  assert.equal(governance.controllerApproval, "pending");
  const ready = governance.providers.filter((provider) => provider.productionGate === "ready");
  const unresolved = governance.providers.filter((provider) => provider.productionGate !== "ready");
  assert.deepEqual(ready.map((provider) => provider.service), ["hosting", "email"]);
  assert.ok(ready.every((provider) => provider.dpaStatus.startsWith("executed")));
  assert.ok(unresolved.every((provider) => ["blocked", "feature-disabled"].includes(provider.productionGate)));
  assert.match(productionGate, /governance\.controllerApproval !== "approved"/u);
  assert.match(productionGate, /provider\.productionGate !== "ready"/u);
});
