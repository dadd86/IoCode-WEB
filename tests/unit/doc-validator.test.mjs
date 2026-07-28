import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import {
  validateDocument,
  validateProject
} from "../../tools/doc-validator.js";

const fixtureRoot = resolve("tests/fixtures/doc-validator");
const referenceDate = new Date("2026-07-28T00:00:00.000Z");

async function readFixture(name) {
  return readFile(join(fixtureRoot, name), "utf8");
}

test("accepts a controlled document with the exact metadata contract", async () => {
  const findings = validateDocument({
    filePath: join(fixtureRoot, "valid.md"),
    content: await readFixture("valid.md"),
    documentType: "runbook",
    maxAgeDays: 90,
    now: referenceDate,
    packageScripts: {
      check: "astro check"
    }
  });

  assert.deepEqual(findings, []);
});

test("reports mojibake with file and line evidence", async () => {
  const findings = validateDocument({
    filePath: join(fixtureRoot, "invalid-mojibake.md"),
    content: await readFixture("invalid-mojibake.md"),
    documentType: "historical",
    now: referenceDate,
    packageScripts: {}
  });

  assert.ok(
    findings.some(
      ({ code, line }) => code === "DOC_ENCODING_MOJIBAKE" && line === 8
    )
  );
});

test("reports unclosed fences and residual editor attributes", async () => {
  const findings = validateDocument({
    filePath: join(fixtureRoot, "invalid-fence.md"),
    content: await readFixture("invalid-fence.md"),
    documentType: "historical",
    now: referenceDate,
    packageScripts: {}
  });

  assert.ok(findings.some(({ code }) => code === "DOC_FENCE_UNCLOSED"));
  assert.ok(
    findings.some(
      ({ code, line }) => code === "DOC_FENCE_ATTRIBUTE" && line === 10
    )
  );
});

test("reports missing metadata fields and stale verification dates", async () => {
  const findings = validateDocument({
    filePath: join(fixtureRoot, "invalid-metadata.md"),
    content: await readFixture("invalid-metadata.md"),
    documentType: "runbook",
    maxAgeDays: 90,
    now: referenceDate,
    packageScripts: {}
  });

  assert.ok(findings.some(({ code }) => code === "DOC_METADATA_HEADER"));
  assert.ok(findings.some(({ code }) => code === "DOC_METADATA_STALE"));
});

test("reports unknown npm scripts and broken relative links", async () => {
  const findings = validateDocument({
    filePath: join(fixtureRoot, "invalid-command-link.md"),
    content: await readFixture("invalid-command-link.md"),
    documentType: "historical",
    now: referenceDate,
    packageScripts: {
      check: "astro check"
    }
  });

  assert.ok(findings.some(({ code }) => code === "DOC_NPM_SCRIPT_UNKNOWN"));
  assert.ok(findings.some(({ code }) => code === "DOC_RELATIVE_LINK_BROKEN"));
});

test("runtime scan rejects remote loads but ignores informational links", async () => {
  const report = await validateProject({
    configPath: join(fixtureRoot, "runtime.config.json"),
    now: referenceDate
  });

  const runtimeCodes = report.findings
    .filter(({ category }) => category === "runtime")
    .map(({ code }) => code);

  assert.equal(report.status, "failed");
  assert.ok(runtimeCodes.includes("RUNTIME_REMOTE_SCRIPT"));
  assert.ok(runtimeCodes.includes("RUNTIME_REMOTE_FETCH"));
  assert.ok(runtimeCodes.includes("RUNTIME_REMOTE_CSS_URL"));
  assert.ok(!runtimeCodes.includes("RUNTIME_INFORMATIONAL_LINK"));
});

test("CLI writes a parseable structured report and exits non-zero on defects", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "iocode-doc-validator-"));
  const outputPath = join(tempRoot, "report.json");

  try {
    const result = spawnSync(
      process.execPath,
      [
        "tools/doc-validator.js",
        "--config",
        "tests/fixtures/doc-validator/invalid.config.json",
        "--output",
        outputPath,
        "--now",
        "2026-07-28"
      ],
      {
        cwd: resolve("."),
        encoding: "utf8"
      }
    );

    assert.equal(result.status, 1);

    const report = JSON.parse(await readFile(outputPath, "utf8"));
    assert.equal(report.status, "failed");
    assert.ok(report.errorCount >= 1);
    assert.ok(Array.isArray(report.findings));
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

