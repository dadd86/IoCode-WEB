import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile
} from "node:fs/promises";
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
  assert.ok(findings.some(({ code }) => code === "DOC_FENCE_NESTED"));
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

test("reports absent metadata, BOM and invalid or future dates", () => {
  const missingMetadata = validateDocument({
    filePath: join(fixtureRoot, "missing.md"),
    content: "# Sin tabla\n",
    documentType: "runbook",
    maxAgeDays: 90,
    now: referenceDate,
    packageScripts: {}
  });
  assert.ok(
    missingMetadata.some(({ code }) => code === "DOC_METADATA_MISSING")
  );

  const invalidDate = validateDocument({
    filePath: join(fixtureRoot, "invalid-date.md"),
    content:
      "\uFEFF# Fecha inválida\n\n" +
      "| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |\n" +
      "|---|---|---|---|---|---|\n" +
      "| R1 | Fixture | Docs | ES | Test | mañana |\n",
    documentType: "runbook",
    maxAgeDays: 90,
    now: referenceDate,
    packageScripts: {}
  });
  assert.ok(invalidDate.some(({ code }) => code === "DOC_ENCODING_BOM"));
  assert.ok(invalidDate.some(({ code }) => code === "DOC_METADATA_DATE"));

  const futureDate = validateDocument({
    filePath: join(fixtureRoot, "future-date.md"),
    content:
      "# Fecha futura\n\n" +
      "| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |\n" +
      "|---|---|---|---|---|---|\n" +
      "| R1 | Fixture | Docs | ES | Test | 2026-08-01 |\n",
    documentType: "runbook",
    maxAgeDays: 90,
    now: referenceDate,
    packageScripts: {}
  });
  assert.ok(futureDate.some(({ code }) => code === "DOC_METADATA_DATE"));
});

test("ADRs and historical documents do not expire", async () => {
  const findings = validateDocument({
    filePath: join(fixtureRoot, "invalid-metadata.md"),
    content: (await readFixture("invalid-metadata.md")).replace(
      "| Bloque | Descripción | Ámbito | Idiomas afectados | Última verificación |",
      "| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |"
    ).replace(
      "| R1 | Fixture inválido | Documentación | ES | 2025-01-01 |",
      "| R1 | Fixture válido | Documentación | ES | Test | 2025-01-01 |"
    ),
    documentType: "adr",
    maxAgeDays: 1,
    now: referenceDate,
    packageScripts: {}
  });

  assert.deepEqual(findings, []);
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

test("tool scan rejects unknown literal npm scripts in PowerShell and JavaScript", async () => {
  const report = await validateProject({
    configPath: join(fixtureRoot, "tooling.config.json"),
    now: referenceDate
  });
  const toolFindings = report.findings.filter(
    ({ category }) => category === "tooling"
  );

  assert.equal(report.status, "failed");
  assert.equal(toolFindings.length, 2);
  assert.ok(
    toolFindings.some(
      ({ code, file }) =>
        code === "TOOL_NPM_SCRIPT_UNKNOWN" &&
        file.endsWith("positive-unknown.ps1")
    )
  );
  assert.ok(
    toolFindings.some(
      ({ code, file }) =>
        code === "TOOL_NPM_SCRIPT_UNKNOWN" &&
        file.endsWith("positive-unknown.mjs")
    )
  );
  assert.ok(
    toolFindings.every(
      ({ file }) =>
        !file.endsWith("negative-known.ps1") &&
        !file.endsWith("negative-known.mjs")
    )
  );
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

test("G-03 detects 25 load constructions and ignores informational contexts", async () => {
  const report = await validateProject({
    configPath: join(fixtureRoot, "g03.config.json"),
    now: referenceDate
  });
  const runtimeFindings = report.findings.filter(
    ({ category }) => category === "runtime"
  );
  const runtimeCodes = [...new Set(
    runtimeFindings.map(({ code }) => code)
  )].sort();
  const expectedCodes = [
    "RUNTIME_CSS_IMPORT",
    "RUNTIME_REMOTE_CSS_URL",
    "RUNTIME_EVENT_SOURCE",
    "RUNTIME_FORM_ACTION",
    "RUNTIME_FORMACTION",
    "RUNTIME_REMOTE_AUDIO",
    "RUNTIME_REMOTE_EMBED",
    "RUNTIME_REMOTE_IFRAME",
    "RUNTIME_REMOTE_IMAGE",
    "RUNTIME_REMOTE_FETCH",
    "RUNTIME_REMOTE_IMPORT",
    "RUNTIME_REMOTE_LINK_DNS_PREFETCH",
    "RUNTIME_REMOTE_LINK_MODULEPRELOAD",
    "RUNTIME_REMOTE_LINK_PREFETCH",
    "RUNTIME_REMOTE_LINK_PRECONNECT",
    "RUNTIME_REMOTE_LINK_PRELOAD",
    "RUNTIME_REMOTE_LINK_STYLESHEET",
    "RUNTIME_REMOTE_OBJECT",
    "RUNTIME_REMOTE_SCRIPT",
    "RUNTIME_REMOTE_SOURCE",
    "RUNTIME_REMOTE_TRACK",
    "RUNTIME_REMOTE_VIDEO",
    "RUNTIME_SRCSET",
    "RUNTIME_WEB_SOCKET",
    "RUNTIME_XML_HTTP_REQUEST"
  ].sort();

  assert.equal(report.status, "failed");
  assert.deepEqual(runtimeCodes, expectedCodes);
  assert.equal(expectedCodes.length, 25);
  assert.equal(
    runtimeFindings.filter(({ code }) => code === "RUNTIME_FORMACTION").length,
    2
  );
  assert.ok(
    runtimeFindings.every(({ file }) => !file.includes("negative-"))
  );
});

test("rejects a metadata contract that diverges from I-03", async () => {
  const report = await validateProject({
    configPath: join(fixtureRoot, "invalid-contract.config.json"),
    now: referenceDate
  });

  assert.equal(report.status, "failed");
  assert.ok(
    report.findings.some(
      ({ code }) => code === "DOC_METADATA_CONTRACT_INVALID"
    )
  );
});

test("allowed runtime origins pass and missing configured files are reported", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "iocode-doc-project-"));

  try {
    await mkdir(join(tempRoot, "runtime"), { recursive: true });
    await writeFile(
      join(tempRoot, "valid.md"),
      await readFixture("valid.md"),
      "utf8"
    );
    await writeFile(
      join(tempRoot, "runtime", "allowed.astro"),
      '<script src="https://assets.example.com/runtime.js"></script>\n',
      "utf8"
    );
    await writeFile(
      join(tempRoot, "config.json"),
      JSON.stringify({
        packageJson: resolve("package.json"),
        documents: [
          { path: "valid.md", type: "runbook", maxAgeDays: 90 },
          { path: "missing.md", type: "historical" }
        ],
        runtimeSources: [
          "runtime/allowed.astro",
          "runtime/missing.astro"
        ],
        allowedRuntimeOrigins: ["https://assets.example.com"]
      }),
      "utf8"
    );

    const report = await validateProject({
      configPath: join(tempRoot, "config.json"),
      now: referenceDate
    });

    assert.equal(report.status, "failed");
    assert.ok(
      report.findings.some(({ code }) => code === "DOC_FILE_MISSING")
    );
    assert.ok(
      report.findings.some(({ code }) => code === "RUNTIME_FILE_MISSING")
    );
    assert.ok(
      !report.findings.some(({ code }) => code === "RUNTIME_REMOTE_SCRIPT")
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
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
