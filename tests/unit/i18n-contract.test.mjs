import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import test from "node:test";
import ts from "typescript";

const root = resolve(".");
const uiPath = join(root, "src", "i18n", "ui.ts");
const componentRoots = [join(root, "src", "components"), join(root, "src", "layouts")];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function unwrapExpression(expression) {
  if (ts.isSatisfiesExpression(expression) || ts.isAsExpression(expression) || ts.isParenthesizedExpression(expression)) {
    return unwrapExpression(expression.expression);
  }
  return expression;
}

function localizedKeys(source) {
  const sourceFile = ts.createSourceFile(uiPath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let uiObject;

  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === "ui" && declaration.initializer) {
        uiObject = unwrapExpression(declaration.initializer);
      }
    }
  });

  assert.ok(uiObject && ts.isObjectLiteralExpression(uiObject), "ui debe ser un objeto literal tipado");
  const result = new Map();

  for (const localeProperty of uiObject.properties) {
    if (!ts.isPropertyAssignment(localeProperty)) continue;
    const locale = localeProperty.name.getText(sourceFile).replace(/["']/gu, "");
    const localeObject = unwrapExpression(localeProperty.initializer);
    assert.ok(ts.isObjectLiteralExpression(localeObject), `${locale} debe ser un objeto literal`);
    result.set(locale, localeObject.properties
      .filter(ts.isPropertyAssignment)
      .map((property) => property.name.getText(sourceFile).replace(/["']/gu, "")));
  }

  return result;
}

test("el diccionario UI tiene paridad exacta ES/EN/DE", async () => {
  const keys = localizedKeys(await readFile(uiPath, "utf8"));
  assert.deepEqual([...keys.keys()].sort(), ["de", "en", "es"]);
  const expected = [...keys.get("es")].sort();
  assert.deepEqual([...keys.get("en")].sort(), expected);
  assert.deepEqual([...keys.get("de")].sort(), expected);
});

test("los componentes no contienen microcopy española fuera del diccionario", async () => {
  const forbidden = /["'`](?:[^"'`\r\n]*\b(?:diagnóstico|trazabilidad|automatización|robótica|solución|página|navegación|privacidad|política|aviso legal|volver al inicio|solicitar propuesta|ver proyectos|preparar correo|selecciona una opción)\b[^"'`\r\n]*)["'`]/iu;
  const files = (await Promise.all(componentRoots.map(walk))).flat().filter((file) => file.endsWith(".astro"));

  for (const file of files) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, forbidden, `${file} contiene microcopy española hardcoded`);
  }
});

test("el resumen del Hero usa una clave localizada", async () => {
  const source = await readFile(join(root, "src", "components", "HomeHero.astro"), "utf8");
  assert.match(source, /labels\.homeSummaryKicker/u);
  assert.doesNotMatch(source, /IT\/OT\s*·\s*Diagnóstico/u);
});
