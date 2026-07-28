# Evidencia TDD — R1 Validador Documental

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R1 | Evidencia RED/GREEN del guardián documental y runtime | Documentación, herramientas y pruebas | ES | Programa R0–R8, fixtures, Node test runner y reporte del corpus | 2026-07-28 | Checkpoints `12c4e42`, `f5ea1cb`, `0bc6016`, `0d48131`, `b493b65`; integración pendiente de firma |

Estado: `Done with evidence`.

## Fuente y alcance

Los comportamientos se derivan del programa R0–R8 corregido entregado por el propietario. R1 implementa:

- contrato exacto de metadatos;
- frescura diferenciada por clase documental;
- detección de BOM y mojibake;
- validación estructural de fences Markdown;
- comprobación de scripts npm y enlaces relativos;
- detección contextual de cargas remotas en fuentes runtime;
- salida JSON parseable y código de salida bloqueante.

## Recorrido RED/GREEN

| Tarea | RED demostrado | GREEN demostrado |
|---|---|---|
| Validador inicial | `12c4e42`: `ERR_MODULE_NOT_FOUND` para `tools/doc-validator.js` | `f5ea1cb`: 7/7 pruebas en verde |
| Directorios runtime | `0bc6016`: `EISDIR` al inspeccionar una raíz | `0d48131`: recorrido recursivo y 10/10 pruebas |
| Fences anidados | `b493b65`: falta `DOC_FENCE_NESTED` | Implementación posterior: 10/10 pruebas |

## Especificación comprobada

| # | Garantía | Tipo | Resultado |
|---:|---|---|---|
| 1 | Un documento con los seis campos exactos es aceptado | Unitario | PASS |
| 2 | Mojibake se reporta con archivo y línea | Unitario | PASS |
| 3 | Fences sin cierre, anidados o con atributos residuales se bloquean | Unitario | PASS |
| 4 | Metadatos ausentes, incompletos, vencidos o futuros se bloquean | Unitario | PASS |
| 5 | ADRs e históricos no caducan por antigüedad | Unitario | PASS |
| 6 | Scripts npm inexistentes y enlaces relativos rotos se bloquean | Integración | PASS |
| 7 | Scripts, imágenes, fetch, imports y CSS remotos se detectan por contexto | Integración | PASS |
| 8 | Enlaces informativos y orígenes explícitamente permitidos no generan falsos positivos | Integración | PASS |
| 9 | Raíces runtime se recorren de forma recursiva | Integración | PASS |
| 10 | La CLI escribe JSON y devuelve código 1 cuando existen defectos | Integración CLI | PASS |

## Comandos y resultados

```text
npm run docs:test
```

Resultado: 10 pruebas, 10 PASS, 0 FAIL.

```text
npm run docs:coverage
```

Resultado:

- líneas: 98,36%;
- ramas: 83,81%;
- funciones: 100%.

```text
npm run docs:lint
```

Resultado inicial esperado de R1: `failed`, 71 errores sobre 19 documentos controlados y 42 archivos runtime.

Distribución del inventario inicial:

- 49 `DOC_ENCODING_MOJIBAKE`;
- 18 `DOC_METADATA_MISSING`;
- 3 `DOC_FENCE_NESTED`;
- 1 `DOC_FENCE_ATTRIBUTE`;
- 0 cargas runtime remotas.

El reporte estructurado se genera en `qa-artifacts/documentation/doc-validator.json`, excluido del release. R2 debe reducir este inventario a cero sin desactivar reglas.

## Límites conocidos

- El parser cubre el subconjunto Markdown utilizado por el repositorio; no pretende sustituir un parser CommonMark completo.
- Las cargas runtime construidas dinámicamente mediante concatenación no se resuelven estáticamente.
- La validez jurídica o editorial del contenido no puede automatizarse con este gate.

