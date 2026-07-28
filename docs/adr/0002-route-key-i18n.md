# ADR-0002 — i18n mediante claves y rutas localizadas

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Fuente única para alternates, navegación y generación estática | Routing, SEO e internacionalización | ES, EN, DE | `src/i18n/config.ts` y `src/i18n/routes.ts` | 2026-07-28 |

Estado: Accepted.

## Contexto

Las rutas visibles difieren por idioma y deben permanecer alineadas con canonical, hreflang, navegación y sitemap.

## Decisión

Las 9 claves semánticas de `routeAlternates` son la fuente única. Cada clave define un path para ES, EN y DE, lo que produce 27 rutas localizadas.

## Consecuencias

No se duplican mapas de URL en componentes. Añadir un idioma o una página exige actualizar la fuente, el contenido y las pruebas de alternates en una misma entrega.
