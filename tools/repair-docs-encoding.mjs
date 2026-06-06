import { readFileSync, writeFileSync } from "node:fs";

/**
 * Rutas de documentación inspeccionadas por el matcher estático de Fase 1.1D.
 *
 * Propósito funcional:
 * - reparar mojibake producido por texto UTF-8 interpretado como Windows-1252;
 * - mantener los documentos legibles y compatibles con el escáner de codificación;
 * - evitar tocar HTML generado o código fuente de la aplicación.
 *
 * Relación con Fase 1.1D:
 * - `tools/qa-static-phase-1-1d.mjs` falla si detecta patrones como `Ã`, `Â` o `â`;
 * - esta lista está limitada a los documentos reportados por el matcher.
 *
 * Impacto en matcher:
 * - elimina los falsos negativos de codificación dañada en documentación;
 * - no altera `dist/`, rutas, H1, hreflang, sitemap ni schemas SEO.
 *
 * Riesgo si se modifica mal:
 * - una reparación genérica sobre archivos no afectados podría corromper texto válido;
 * - por eso el alcance está cerrado a los documentos que el matcher reportó.
 */
const documentationFiles = [
  "docs/ARCHITECTURE.md",
  "docs/MAINTENANCE.md",
  "docs/MIGRATION_FROM_STATIC_HTML.md",
  "docs/QA_PHASE_1_1C.md",
  "docs/index.md",
  "README.md",
  "RUN_GUIDE.md"
];

/**
 * Caracteres especiales de Windows-1252 que aparecen cuando bytes UTF-8 se
 * interpretan como texto Windows-1252 antes de volver a guardarse como UTF-8.
 *
 * El caso más común en este proyecto es `aplicaciÃ³n`, pero también puede
 * aparecer puntuación como `â€™` o flechas como `â†’` en documentación técnica.
 */
const windows1252ReverseMap = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f]
]);

const mojibakePattern = /Ã.|Â.|â|â€™|â€œ|â€|�/;

/**
 * Convierte un texto mojibakeado a bytes Windows-1252 y lo decodifica como
 * UTF-8. Si el texto contiene caracteres fuera del rango representable, la
 * conversión se cancela para evitar corrupción silenciosa.
 */
function repairWindows1252Mojibake(text, filePath) {
  const bytes = [];

  for (const character of text) {
    const codePoint = character.codePointAt(0);

    if (codePoint === undefined) {
      throw new Error(`${filePath}: carácter inválido durante reparación.`);
    }

    if (windows1252ReverseMap.has(codePoint)) {
      bytes.push(windows1252ReverseMap.get(codePoint));
      continue;
    }

    if (codePoint <= 0xff) {
      bytes.push(codePoint);
      continue;
    }

    throw new Error(
      `${filePath}: contiene carácter no representable en Windows-1252 antes de reparar: ${character}`
    );
  }

  return Buffer.from(bytes).toString("utf8");
}

for (const filePath of documentationFiles) {
  const originalText = readFileSync(filePath, "utf8");

  if (!mojibakePattern.test(originalText)) {
    console.log(`${filePath}: sin mojibake detectable.`);
    continue;
  }

  const repairedText = repairWindows1252Mojibake(originalText, filePath);

  if (mojibakePattern.test(repairedText)) {
    throw new Error(`${filePath}: la reparación no eliminó todo el mojibake.`);
  }

  writeFileSync(filePath, repairedText, "utf8");
  console.log(`${filePath}: codificación reparada.`);
}