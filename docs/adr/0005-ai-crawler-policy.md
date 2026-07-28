# ADR-0005 — Política explícita para crawlers de búsqueda e IA

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Mantener descubrimiento público sin afirmar control de uso posterior | SEO, GEO y publicación | ES, EN, DE | `public/robots.txt` y `tools/qa-geo-schema.mjs` | 2026-07-28 |

Estado: Accepted.

## Contexto

El sitio busca descubrimiento y citación pública. `robots.txt` expresa preferencias voluntarias y no es un mecanismo de autorización, privacidad ni protección de propiedad intelectual.

## Decisión

Se permite el rastreo general y se enumeran crawlers de búsqueda, recuperación solicitada y entrenamiento que el gate actual verifica. La política puede cambiar por decisión editorial o legal, pero debe actualizar fuente, pruebas y este ADR.

## Consecuencias

No se afirmará que todos los agentes respetan la política. Datos personales o confidenciales no deben depender de `robots.txt` para quedar protegidos.
