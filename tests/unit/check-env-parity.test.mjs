import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

import {
  PUBLIC_ENV_DEFAULTS,
  parseComposeInterpolations,
  parseDotEnv,
  validateEnvParity
} from "../../tools/check-env-parity.js";

const fixtures = resolve("tests/fixtures/env-parity");

test("parsea .env e ignora comentarios y variables internas", () => {
  const parsed = parseDotEnv(`
    # operador
    ASTRO_DEV_PORT=4321
    ENABLE_HSTS="false"
    NODE_ENV=development
  `);

  assert.equal(parsed.get("ASTRO_DEV_PORT"), "4321");
  assert.equal(parsed.get("ENABLE_HSTS"), "false");
  assert.equal(parsed.get("NODE_ENV"), "development");
});

test("extrae interpolaciones y fallbacks de Compose", () => {
  const parsed = parseComposeInterpolations(`
    ports:
      - "\${WEB_PORT:-8080}:8080"
    environment:
      ENABLE_COOP: "\${ENABLE_COOP:-false}"
  `);

  assert.deepEqual(parsed.get("WEB_PORT"), ["8080"]);
  assert.deepEqual(parsed.get("ENABLE_COOP"), ["false"]);
});

test("confirma paridad completa de las seis variables públicas", async () => {
  const report = await validateEnvParity({
    envPath: join(fixtures, "valid.env"),
    composePath: join(fixtures, "valid-compose.yml")
  });

  assert.equal(report.status, "passed");
  assert.equal(report.checkedVariables.length, 6);
  assert.deepEqual(report.findings, []);
  assert.deepEqual(
    Object.keys(PUBLIC_ENV_DEFAULTS).sort(),
    [
      "ASTRO_DEV_PORT",
      "ASTRO_PREVIEW_PORT",
      "ENABLE_COOP",
      "ENABLE_HSTS",
      "ENABLE_UPGRADE_INSECURE_REQUESTS",
      "WEB_PORT"
    ]
  );
});

test("ignora variables internas fuera de la allowlist", async () => {
  const report = await validateEnvParity({
    envPath: join(fixtures, "valid.env"),
    composePath: join(fixtures, "valid-compose.yml"),
    allowlist: {
      ENABLE_HSTS: "false"
    }
  });

  assert.equal(report.status, "passed");
  assert.deepEqual(report.checkedVariables, ["ENABLE_HSTS"]);
});

test("bloquea ausencias, literales duros y fallbacks inseguros", async () => {
  const report = await validateEnvParity({
    envPath: join(fixtures, "invalid.env"),
    composePath: join(fixtures, "invalid-compose.yml")
  });
  const codes = report.findings.map(({ code }) => code);

  assert.equal(report.status, "failed");
  assert.ok(codes.includes("ENV_PUBLIC_MISSING"));
  assert.ok(codes.includes("COMPOSE_INTERPOLATION_MISSING"));
  assert.ok(codes.includes("ENV_DEFAULT_MISMATCH"));
  assert.ok(codes.includes("COMPOSE_DEFAULT_MISMATCH"));
});

test("la CLI devuelve JSON y código 1 ante divergencias", async () => {
  const outputDir = await mkdtemp(join(tmpdir(), "env-parity-"));
  const outputPath = join(outputDir, "report.json");

  try {
    const result = spawnSync(
      process.execPath,
      [
        "tools/check-env-parity.js",
        "--env",
        join(fixtures, "invalid.env"),
        "--compose",
        join(fixtures, "invalid-compose.yml"),
        "--output",
        outputPath
      ],
      { cwd: resolve("."), encoding: "utf8" }
    );

    assert.equal(result.status, 1);
    const report = JSON.parse(await readFile(outputPath, "utf8"));
    assert.equal(report.status, "failed");
    assert.ok(report.findings.length >= 4);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
