# ADR-0002 — i18n mediante claves y rutas localizadas

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Fuente única para alternates, navegación y generación estática | Routing, SEO e internacionalización | ES, EN, DE | `src/i18n/config.ts` y `src/i18n/routes.ts` | 2026-08-01 |

Estado: Accepted.

## Contexto

Las rutas visibles difieren por idioma y deben permanecer alineadas con canonical, hreflang, navegación y sitemap.

## Decisión

Las 11 claves semánticas de `routeAlternates` son la fuente única. Nueve claves comerciales producen 27 rutas y dos claves legales producen 6 rutas. En total existen 33 rutas localizadas para ES, EN y DE.

## Consecuencias

No se duplican mapas de URL en componentes. Añadir un idioma o una página exige actualizar la fuente, el contenido y las pruebas de alternates en una misma entrega.
