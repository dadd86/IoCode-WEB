# Evidencia TDD — R1 Validador Documental

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R1 | Evidencia RED/GREEN del guardián documental y runtime | Documentación, herramientas y pruebas | ES | Programa R0–R8, fixtures, Node test runner y reporte del corpus | 2026-07-29 | B1 estructurado: RED `0cfb56c`, GREEN `ab6132a`; historial anterior conservado debajo |

## Corrección de estado — 2026-07-29

La declaración histórica `Done with evidence` se conserva debajo, pero se rebaja
retroactivamente por S-02 porque R6 aún no existe. R1 se reabrió además como
`EN CURSO — deuda G-03` al comprobarse que protegía 6 de 22 construcciones. La
recuperación amplió el contrato a 25 y dejó 25/25 con fixtures positivos y
negativos. Estado vigente máximo tras esa corrección: `GATE LOCAL OK`.

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
| Fences anidados | `b493b65`: falta `DOC_FENCE_NESTED` | `50fc0ba`: detección activa y 10/10 pruebas |

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

## Ampliación R2-recovery

El contrato original de seis contextos resultó insuficiente frente a G-03. La
recuperación registrada en
[`r2-recovery-g03.tdd.md`](r2-recovery-g03.tdd.md) amplía el gate a 25
construcciones, añade los tres pares de fixtures solicitados y eleva la suite a
12 pruebas. La tabla anterior se conserva como evidencia del alcance histórico,
no como inventario vigente.

## Ampliación B1 previa a R3.5b

El inventario R3.5a demostró que `DOC_NPM_SCRIPT_UNKNOWN` solo protegía
documentos controlados y dejaba fuera `tools/`. El RED `393a538` fijó el defecto:
12/13 pruebas pasaron y la invocación inexistente en herramientas no fue
detectada. El GREEN `38d7da4` añadió `toolSources`, recorrido recursivo de
PowerShell/JavaScript/TypeScript/shell y `TOOL_NPM_SCRIPT_UNKNOWN`.

Resultado vigente: 13/13 PASS, 98,45% de líneas, 84,87% de ramas y 97,56% de
funciones. El corpus real pasa con cero errores tras corregir las dos
invocaciones de `qa:static` a `qa:static:1.1c`. La ficha G-01 y los fixtures
positivos/negativos están registrados en
[`R3_5B_SCRIPT_DISPOSITION.md`](../audits/R3_5B_SCRIPT_DISPOSITION.md).

## Ampliación B1 estructurada posterior a R3.5b

La ficha B1 anterior es un registro histórico congelado del gate literal. La
revisión de R3.5b demostró que no cubría dos formas reales de consumidor y se
amplió mediante un nuevo ciclo RED/GREEN.

### Ficha G-01 — consumidores npm estructurados

| Campo | Contrato vigente |
|---|---|
| Qué detecta | Nombres literales inexistentes en tres formas: shell `npm run`, Docker exec-array en `CMD`/`ENTRYPOINT` y acceso `scripts?.["nombre"]` o `scripts["nombre"]` |
| Fuentes | Recorrido recursivo de `tools/` y `Docker/`; extensiones de herramientas más `Dockerfile` y `Dockerfile.*` |
| Qué no detecta | Nombres calculados dinámicamente, concatenaciones, variables usadas como clave o wrappers indirectos sin nombre literal |
| Falsos positivos conocidos | Comentarios o ejemplos literales dentro de las fuentes controladas también se consideran consumidores y deben mantenerse coherentes |
| Allowlist | Ninguna por nombre; la autoridad única continúa siendo `package.json` |
| Fixture positivo Docker | `Dockerfile.positive-unknown` aporta un `CMD` y un `ENTRYPOINT` inexistentes y produce dos hallazgos |
| Fixture negativo Docker | `Dockerfile.negative-known` usa dos nombres existentes y no produce hallazgos |
| Fixture positivo programático | `positive-programmatic.mjs` accede a una clave inexistente y produce un hallazgo |
| Fixture negativo programático | `negative-programmatic.mjs` accede a una clave existente y no produce hallazgos |
| Severidad | Bloqueante antes de renombrar o eliminar scripts |

El RED `0cfb56c` ejecutó el objetivo completo: 12/13 pruebas pasaron y el caso
B1 encontró 2 hallazgos frente a los 5 esperados. El GREEN `ab6132a` dejó
13/13 PASS y `docs:lint` sin errores sobre 27 documentos, 42 fuentes runtime y
76 fuentes de herramientas. El delta `61 → 76` (`Δ +15`) corresponde a cuatro
Dockerfiles y once scripts o módulos bajo `Docker/`.

Los dos fixtures negativos introducen tres referencias conocidas: dos a
nombres finales normalizados y una al reservado `dev`. El contrato R3.5b pasa
por ello de 119 a 121 referencias finales controladas (`Δ +2`) y de 174 a 177
consumidores conocidos (`Δ +3`), sin cambiar el radio real de 119 del cierre.

Cobertura antes → después:

- líneas: 98,45% → 98,08% (`Δ −0,37 pp`);
- ramas: 84,87% → 85,26% (`Δ +0,39 pp`);
- funciones: 97,56% → 95,35% (`Δ −2,21 pp`).

Las tres métricas permanecen por encima del 80%. La ejecución prueba detección
estática y existencia; no demuestra ejecutabilidad, dependencias ni resultado
funcional del comando.

## Condición dura antes de R4

R4 no puede arrancar hasta que existan y pasen cuatro fixtures adicionales:

1. URL malformada en `isAllowedRemoteUrl`;
2. `<link>` sin `rel` ni `href`;
3. directorio runtime anidado;
4. tabla I-03 de igual longitud con campo incorrecto o en orden incorrecto.

La cobertura 84,87% de ramas no sustituye estos casos. R1 conserva
`GATE LOCAL OK` porque G-03 cubre 25/25 construcciones, pero esta deuda es un
bloqueo de entrada a R4, no una nota diferible.

## Comandos y resultados

```text
npm run internal:docs:test
```

Resultado: 10 pruebas, 10 PASS, 0 FAIL.

```text
npm run internal:docs:coverage
```

Resultado:

- líneas: 98,36%;
- ramas: 83,81%;
- funciones: 100%.

```text
npm run internal:docs:lint
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
