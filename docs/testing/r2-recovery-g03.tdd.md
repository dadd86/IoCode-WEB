# Evidencia TDD — R2-recovery / G-03

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R2-recovery | Recuperación del gate anti-terceros y del contrato I-03 | Fuentes runtime, formularios y control documental | ES, EN, DE | `tools/doc-validator.js`, fixtures y pruebas Node | 2026-07-29 | RED `c5f30e5`; GREEN `60564f5` |

## Resultado

R1 se reabrió como `EN CURSO — deuda G-03` al comprobarse una cobertura de
6/22 construcciones. La recuperación:

- amplía el contrato a 25/25 construcciones;
- usa lista blanca de `rel` para `<link href>`;
- protege la ausencia de `action` y `formaction`;
- añade `<track src>`;
- valida que el contrato de metadatos coincida exactamente con I-03.

Estado vigente máximo de R1 y R2: `GATE LOCAL OK`. R6 no existe todavía, por lo
que S-02 impide declarar una garantía remota o `Done with evidence`.

## Contrato de metadatos

`docs/document-control.json` declara literalmente seis campos obligatorios:

1. `Bloque`
2. `Descripción`
3. `Ámbito`
4. `Idiomas afectados`
5. `Origen de datos`
6. `Última verificación`

Y un único campo opcional:

- `Commit verificado`

El validador emite `DOC_METADATA_CONTRACT_INVALID` si la configuración añade,
elimina, duplica o renombra cualquiera de esos campos.

## Matriz G-03

| # | Construcción protegida | Código |
|---:|---|---|
| 1 | `<script src>` remoto | `RUNTIME_REMOTE_SCRIPT` |
| 2 | `<img src>` remoto | `RUNTIME_REMOTE_IMAGE` |
| 3 | `<source src>` remoto | `RUNTIME_REMOTE_SOURCE` |
| 4 | `<video src>` remoto | `RUNTIME_REMOTE_VIDEO` |
| 5 | `<audio src>` remoto | `RUNTIME_REMOTE_AUDIO` |
| 6 | `<iframe src>` remoto | `RUNTIME_REMOTE_IFRAME` |
| 7 | `<embed src>` remoto | `RUNTIME_REMOTE_EMBED` |
| 8 | `<object data>` remoto | `RUNTIME_REMOTE_OBJECT` |
| 9 | `<track src>` remoto | `RUNTIME_REMOTE_TRACK` |
| 10 | `srcset` remoto | `RUNTIME_SRCSET` |
| 11 | `<link rel="stylesheet" href>` remoto | `RUNTIME_REMOTE_LINK_STYLESHEET` |
| 12 | `<link rel="preload" href>` remoto | `RUNTIME_REMOTE_LINK_PRELOAD` |
| 13 | `<link rel="prefetch" href>` remoto | `RUNTIME_REMOTE_LINK_PREFETCH` |
| 14 | `<link rel="preconnect" href>` remoto | `RUNTIME_REMOTE_LINK_PRECONNECT` |
| 15 | `<link rel="dns-prefetch" href>` remoto | `RUNTIME_REMOTE_LINK_DNS_PREFETCH` |
| 16 | `<link rel="modulepreload" href>` remoto | `RUNTIME_REMOTE_LINK_MODULEPRELOAD` |
| 17 | `fetch()` remoto | `RUNTIME_REMOTE_FETCH` |
| 18 | `import()` remoto | `RUNTIME_REMOTE_IMPORT` |
| 19 | `XMLHttpRequest.open()` remoto | `RUNTIME_XML_HTTP_REQUEST` |
| 20 | `WebSocket()` remoto | `RUNTIME_WEB_SOCKET` |
| 21 | `EventSource()` remoto | `RUNTIME_EVENT_SOURCE` |
| 22 | CSS `url()` remoto | `RUNTIME_REMOTE_CSS_URL` |
| 23 | CSS `@import` remoto | `RUNTIME_CSS_IMPORT` |
| 24 | `<form action>` presente | `RUNTIME_FORM_ACTION` |
| 25 | `formaction` en `<button>` o `<input>` | `RUNTIME_FORMACTION` |

La prueba de contrato exige los 25 códigos y, adicionalmente, dos hallazgos
`RUNTIME_FORMACTION`: uno para `<button>` y otro para `<input>`.

## Lista blanca de `<link rel>`

Solo activan el gate:

`stylesheet`, `preload`, `prefetch`, `preconnect`, `dns-prefetch` y
`modulepreload`.

Los enlaces informativos `canonical`, `alternate`, `manifest`, `me` y `author`
no activan G-03. El diseño es una lista blanca cerrada; añadir otro `rel` requiere
una prueba RED explícita.

## Ficha G-01 — `<form action>`

- **Qué detecta:** cualquier atributo `action` en `<form>`, local o remoto.
- **Qué NO detecta:** formularios sin `action`; la construcción de `mailto:` en
  JavaScript sin transmisión automática.
- **Falsos positivos posibles:** un `action` decorativo o vacío; se bloquea
  intencionalmente porque debilita la afirmación de privacidad.
- **Falsos negativos conocidos:** HTML construido dinámicamente a partir de
  fragmentos no literales.
- **Allowlist:** ninguna. Esta invariantes no acepta origen permitido.
- **Fixture positivo:** `positive-form-action.astro`.
- **Fixture negativo:** `negative-form-action.astro`.
- **Coste:** escaneo lineal de los archivos runtime.
- **Severidad:** crítica; protege el contrato del formulario client-side sin
  transmisión a servidor propio.

## Ficha G-01 — `formaction`

- **Qué detecta:** cualquier `formaction` en `<button>` o `<input>`.
- **Qué NO detecta:** controles sin ese atributo.
- **Falsos positivos posibles:** valor vacío o ruta local; se bloquea
  intencionalmente por el mismo contrato de privacidad.
- **Falsos negativos conocidos:** controles generados desde cadenas no literales.
- **Allowlist:** ninguna.
- **Fixture positivo:** `positive-formaction.astro`, con botón e input.
- **Fixture negativo:** `negative-formaction.astro`.
- **Coste:** escaneo lineal de los archivos runtime.
- **Severidad:** crítica.

## Ficha G-01 — `<track src>`

- **Qué detecta:** `src` remoto en elementos `<track>`.
- **Qué NO detecta:** rutas locales y elementos sin `src`.
- **Falsos positivos posibles:** un origen remoto autorizado aún no incluido en
  `allowedRuntimeOrigins`.
- **Falsos negativos conocidos:** URL ensamblada dinámicamente.
- **Allowlist:** `allowedRuntimeOrigins`, igual que el resto de cargas remotas.
- **Fixture positivo:** `positive-track-src.astro`.
- **Fixture negativo:** `negative-track-src.astro`.
- **Coste:** escaneo lineal de los archivos runtime.
- **Severidad:** alta.

Los demás contextos comparten los pares
`positive-runtime.astro`/`negative-runtime.astro`,
`positive-runtime.js`/`negative-runtime.js` y
`positive-runtime.css`/`negative-runtime.css`.

## Recorrido RED/GREEN

```text
RED c5f30e5
12 pruebas: 10 PASS, 2 FAIL
- G-03 solo devolvía las seis detecciones anteriores.
- Un contrato de metadatos alterado era aceptado.

GREEN 60564f5
12 pruebas: 12 PASS, 0 FAIL
Cobertura: 98,32 % líneas; 84,03 % ramas; 97,37 % funciones.
Escaneo del corpus y runtime real: 0 errores.
```

## Criterio de cierre

- Las 25 construcciones tienen fixture positivo y contraparte local/informativa
  negativa.
- `form action` y `formaction` no admiten allowlist.
- `<link href>` usa lista blanca de seis valores `rel`.
- El contrato I-03 se comprueba antes de validar documentos.
- `npm run internal:docs:test`, `npm run internal:docs:coverage` y `npm run internal:docs:lint` pasan.
