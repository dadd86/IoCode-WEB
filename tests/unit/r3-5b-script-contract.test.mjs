import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(".");
const decisionRelativePath =
  "docs/audits/R3_5B_SCRIPT_DISPOSITION.md";
const contractTestRelativePath =
  "tests/unit/r3-5b-script-contract.test.mjs";
const decisionPath = resolve(root, decisionRelativePath);
const packagePath = resolve(root, "package.json");
const expectedHashes = {
  [decisionRelativePath]:
    "D440C23AE3A718D324D6DF736A9C5E04770F9D34FFAD92CD91E34F2A0F480616",
  "docs/archive/I18N.full-2026-07-28.md":
    "D86F34217A91C766326CF4A2F55F9B1A2D3F2BF91A69FD04311B9CD0437047D6",
  "docs/archive/PROJECT_SELECTION.full-2026-07-28.md":
    "36005870F70D7558632685EF2D4AC817BAD589B7EE3A446339DA0AB7D5511A77"
};

function parseDecisionRows(content) {
  return content
    .split(/\r?\n/u)
    .filter((line) => /^\| \d+ \|/u.test(line))
    .map((line) => {
      const cells = line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());
      const scriptMatch = cells[1].match(/^`([^`]+)` = `(.*)`$/u);

      assert.ok(scriptMatch, `Fila de decisión ilegible: ${line}`);

      return {
        index: Number(cells[0]),
        currentName: scriptMatch[1],
        definition: scriptMatch[2].replaceAll("&#32;", " "),
        category: cells[2],
        disposition: cells[3],
        proposedName: cells[4].replaceAll("`", "")
      };
    });
}

function transformDefinition(definition, renameMap) {
  return definition.replace(
    /\bnpm\s+run\s+([a-zA-Z0-9_.:-]+)/gu,
    (invocation, scriptName) =>
      renameMap.has(scriptName)
        ? `npm run ${renameMap.get(scriptName)}`
        : invocation
  );
}

function listOperationalFiles() {
  const output = execFileSync(
    "git",
    [
      "ls-files",
      "--cached",
      "--others",
      "--exclude-standard",
      "-z"
    ],
    {
      cwd: root,
      encoding: "utf8"
    }
  );

  return output
    .split("\0")
    .filter(Boolean)
    .filter((filePath) => !filePath.startsWith("docs/archive/"))
    .filter((filePath) => filePath !== decisionRelativePath)
    .filter((filePath) => filePath !== contractTestRelativePath);
}

async function collectOperationalConsumers() {
  const consumers = [];
  const patterns = [
    {
      kind: "shell-invocation",
      expression: /\bnpm\s+run\s+([a-zA-Z0-9_.:-]+)/gu
    },
    {
      kind: "exec-array",
      expression:
        /["']npm["']\s*,\s*["']run["']\s*,\s*["']([a-zA-Z0-9_.:-]+)["']/gu
    },
    {
      kind: "script-key-access",
      expression:
        /\.scripts(?:\?\.)?\[["']([a-zA-Z0-9_.:-]+)["']\]/gu
    }
  ];

  for (const filePath of listOperationalFiles()) {
    const buffer = await readFile(resolve(root, filePath));
    if (buffer.includes(0)) {
      continue;
    }

    const content = buffer.toString("utf8");
    for (const { kind, expression } of patterns) {
      for (const match of content.matchAll(expression)) {
        consumers.push({
          file: filePath,
          line: content.slice(0, match.index).split(/\r?\n/u).length,
          script: match[1],
          kind
        });
      }
    }
  }

  return consumers;
}

async function sha256(filePath) {
  const content = await readFile(resolve(root, filePath));
  return createHash("sha256").update(content).digest("hex").toUpperCase();
}

const decisionContent = await readFile(decisionPath, "utf8");
const decisionRows = parseDecisionRows(decisionContent);
const renameRows = decisionRows.filter(
  ({ category, disposition }) =>
    (category === "interno" || category === "histórico") &&
    disposition === "mantener"
);
const reservedRows = decisionRows.filter(
  ({ category }) => category === "reservado"
);
const eliminationRows = decisionRows.filter(
  ({ disposition }) => disposition.startsWith("eliminar")
);
const renameMap = new Map(
  renameRows.map(({ currentName, proposedName }) => [
    currentName,
    proposedName
  ])
);

test("R3.5b contract is verified only inside Docker", () => {
  assert.ok(
    existsSync("/.dockerenv"),
    "R3.5b debe verificarse dentro del entorno Docker declarado."
  );
});

test("frozen decision contains the exact authorized scope", () => {
  assert.equal(decisionRows.length, 90);
  assert.equal(renameRows.length, 81);
  assert.equal(reservedRows.length, 4);
  assert.deepEqual(
    reservedRows.map(({ currentName }) => currentName),
    ["dev", "check", "build", "preview"]
  );
  assert.equal(eliminationRows.length, 5);
  assert.deepEqual(
    eliminationRows.map(({ currentName }) => currentName),
    [
      "audit:prod:strict",
      "docker:check",
      "docker:build",
      "docker:audit:prod",
      "docker:validate"
    ]
  );
  assert.doesNotMatch(
    decisionContent,
    /\bnpm\s+run\s+[a-zA-Z0-9_.:-]+/u,
    "El registro congelado no debe convertirse en consumidor operativo."
  );
});

test("package exposes the final 90-name interface without semantic changes", async () => {
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  const scripts = packageJson.scripts ?? {};
  const expectedFinalNames = decisionRows.map(({ currentName, proposedName }) =>
    renameMap.has(currentName) ? proposedName : currentName
  );
  const missingFinalNames = expectedFinalNames.filter(
    (scriptName) => !Object.hasOwn(scripts, scriptName)
  );
  const remainingLegacyNames = renameRows
    .map(({ currentName }) => currentName)
    .filter((scriptName) => Object.hasOwn(scripts, scriptName));
  const definitionMismatches = decisionRows.flatMap(
    ({ currentName, proposedName, definition }) => {
      const finalName = renameMap.has(currentName)
        ? proposedName
        : currentName;
      const expectedDefinition = transformDefinition(definition, renameMap);

      return scripts[finalName] === expectedDefinition
        ? []
        : [
            {
              script: finalName,
              expected: expectedDefinition,
              actual: scripts[finalName]
            }
          ];
    }
  );

  assert.equal(Object.keys(scripts).length, 90);
  assert.deepEqual(missingFinalNames, []);
  assert.deepEqual(remainingLegacyNames, []);
  assert.deepEqual(definitionMismatches, []);
});

test("121 controlled consumers use only final names", async () => {
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  const scripts = packageJson.scripts ?? {};
  const consumers = await collectOperationalConsumers();
  const legacyNames = new Set(renameRows.map(({ currentName }) => currentName));
  const finalNames = new Set(renameRows.map(({ proposedName }) => proposedName));
  const legacyConsumers = consumers.filter(({ script }) =>
    legacyNames.has(script)
  );
  const finalConsumers = consumers.filter(({ script }) =>
    finalNames.has(script)
  );
  const knownConsumers = consumers.filter(({ script }) =>
    Object.hasOwn(scripts, script)
  );
  const knownShellInvocations = knownConsumers.filter(
    ({ kind }) => kind === "shell-invocation"
  );

  assert.deepEqual(legacyConsumers, []);
  assert.equal(finalConsumers.length, 121);
  assert.equal(knownShellInvocations.length, 168);
  assert.equal(knownConsumers.length, 177);
});

test("archive and decision records remain byte-for-byte immutable", async () => {
  const documentControl = JSON.parse(
    await readFile(resolve(root, "docs/document-control.json"), "utf8")
  );

  assert.ok(
    documentControl.excludedDocumentDirectories.includes("archive")
  );

  for (const [filePath, expectedHash] of Object.entries(expectedHashes)) {
    assert.equal(await sha256(filePath), expectedHash, filePath);
  }
});
