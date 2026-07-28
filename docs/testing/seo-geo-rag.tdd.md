# Evidencia TDD — SEO, GEO, schema y rendimiento inicial

Fecha: 2026-07-25  
Rama: `codex/seo-geo-rag`

## Fuente y alcance

No se recibió un archivo de plan. Las jornadas se derivaron del encargo SEO/GEO y de la evidencia del repositorio.

## Jornadas verificadas

1. Como motor de búsqueda o sistema RAG, quiero recibir metadatos, entidades y relaciones coherentes para interpretar y citar cada página.
2. Como usuario, quiero ver la misma ruta de navegación que declara el JSON-LD para que el marcado coincida con el contenido visible.
3. Como crawler de búsqueda o IA, quiero una política explícita de acceso que no dependa de interpretar únicamente el grupo comodín.
4. Como visitante, quiero que el hero 3D no bloquee el primer render y se cargue automáticamente al entrar en viewport, sin exigir interacción.

## Ciclo RED → GREEN

| Tarea | RED | GREEN | Garantía |
|---|---|---|---|
| Metadatos, schema, breadcrumbs y bots | `node tools/qa-geo-schema.mjs` produjo `GEO QA FAIL (273 hallazgos)` sobre el `dist` previo | El mismo comando produjo `GEO QA PASS: 27 páginas...` | Las 27 URLs localizadas incluyen metadatos sociales, grafo JSON-LD, tipos de página, breadcrumbs visibles y políticas explícitas de bots |
| Carga inicial del Hero3D | La prueba heredada esperaba `deferred` y una interacción, en conflicto con la autocarga requerida | La prueba focalizada exige `data-hero3d-requested="true"` y `ready` sin eventos del usuario | El runtime usa visibilidad + periodo idle con timeout de seguridad; el 3D llega a `ready` sin hover, toque ni foco |

## Especificación de pruebas

| # | Qué queda garantizado | Evidencia | Tipo | Resultado |
|---|---|---|---|---|
| 1 | Las 27 páginas localizadas conservan canonical, `hreflang`, metadata y estructura SEO válida | `tools/qa-static-phase-1-1c.mjs` | Integración estática | PASS |
| 2 | `Organization.logo` es un `ImageObject` 512×512 y no se publica `sameAs: []` | `tools/qa-geo-schema.mjs` | Integración estática | PASS |
| 3 | `AboutPage`, `CollectionPage` y `ContactPage` se aplican según la intención de ruta | `tools/qa-geo-schema.mjs` | Integración estática | PASS |
| 4 | Las landings PLC y robótica enlazan `WebPage.mainEntity` con una entidad `Service` | `tools/qa-geo-schema.mjs` | Integración estática | PASS |
| 5 | Los breadcrumbs visibles y `BreadcrumbList` coinciden, sin breadcrumb redundante en home | `tools/qa-geo-schema.mjs`, `tests/e2e/phase-1-1c.spec.ts` | Integración + E2E | PASS, 15/15 |
| 6 | Los bots de búsqueda, recuperación y mejora de modelos tienen reglas explícitas | `tools/qa-geo-schema.mjs` | Integración estática | PASS |
| 7 | El runtime 3D autocarga sin interacción y conserva fallback, pérdida de contexto, layout y fidelidad del logo | `tests/e2e/phase-6-hero-performance.spec.ts` | E2E | PASS, 13/13 |
| 8 | Los presupuestos de Lighthouse se cumplen en 5 rutas, escritorio y móvil | `qa-artifacts/performance/phase-6/lighthouse-summary.json` | Rendimiento sintético | PASS, 10/10 |

## Rendimiento antes y después

La línea base histórica falló en las tres portadas: performance 0,51–0,71 y TBT 2.436–12.275 ms. Esas cifras correspondían a la estrategia anterior de carga por interacción. La medición Docker final de la corrección por visibilidad + periodo idle obtuvo:

- performance: 0,96–1,00;
- LCP: 1.202–1.355 ms;
- CLS: 0;
- TBT: 0–47 ms;
- SEO y accesibilidad Lighthouse: 1,00 en las diez mediciones.

## Cobertura y límites

- La validación estática cubre el 100 % de las 27 páginas indexables generadas.
- La suite de runtime cubre los 13 escenarios definidos para el Hero3D.
- No se generó cobertura de líneas porque el repositorio usa validadores de artefactos y Playwright, no un runner unitario instrumentado.
- La medición es de laboratorio local; no sustituye CrUX, INP de campo ni Search Console.
- `iocode-solutions.com` devuelve NXDOMAIN en la fecha de la prueba. No fue posible validar rastreo, indexación, WAF/CDN ni Rich Results sobre producción.
- No se inventaron perfiles corporativos, reseñas, estadísticas ni credenciales. La ampliación de contenido con datos primarios sigue pendiente de evidencia aportada por la empresa.

## Checkpoints

- `c188859` — prueba RED para metadata GEO y schema.
- `0cde12e` — evidencia histórica de la estrategia por interacción, ya sustituida.
- `26aea8d` — evidencia histórica previa a la corrección de autocarga.

Si los commits se reorganizan, esta tabla conserva la evidencia RED/GREEN del trabajo.
