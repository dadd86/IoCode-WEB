# ADR-0004 — CSP con hashes calculados por respuesta

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Evitar `unsafe-inline` sin nonces ni reescritura del build Astro | Seguridad HTTP y runtime | ES, EN, DE | `Docker/node-static-server.mjs` | 2026-07-28 |

Estado: Accepted.

## Contexto

El HTML generado por Astro contiene scripts y estilos inline. Una CSP estática con hashes manuales sería frágil y `unsafe-inline` debilitaría el control.

## Decisión

El servidor lee el HTML, calcula hashes SHA-256 de cada bloque inline y construye `script-src` y `style-src` para esa respuesta. Recursos externos de runtime no se permiten por defecto.

## Consecuencias

El HTML requiere lectura antes de enviar headers. Toda modificación del parser o servidor debe conservar los tests de CSP, MIME, compresión y caché.
