# Evidencia TDD — PageControl accesible para Proyectos y Habilidades

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| Histórico | Evidencia RED/GREEN del PageControl basado en scroll nativo | UI responsive, accesibilidad, i18n y QA | ES, EN, DE | Código, compilación Astro y Playwright en Docker | 2026-08-04 |

## Alcance y decisiones visuales

- Se integró un PageControl de ocho puntos en Proyectos y otro en Habilidades para las seis rutas localizadas.
- Se mantuvo la paleta azul/cian del sistema. El cian luminoso `#22d3ee` queda reservado para página activa y foco visible.
- El contraste del cian luminoso es 11,04:1 sobre `#050816` y 10,47:1 sobre `#08111f`.
- El desplazamiento táctil usa `overflow-x` y `scroll-snap` nativos. No se añadió ninguna dependencia.
- El controlador TypeScript mide 2.042 bytes normalizados; el JavaScript de producción mide 1.192 bytes sin comprimir y 654 bytes con gzip.

## Ciclo RED → GREEN

| Estado | Evidencia | Resultado |
|---|---|---|
| RED | `35d8249264d3cbdab4cad6a7a3e8c65caf7bba68` | 0/2: faltaban `PageControl.astro` y `page-control.ts` |
| RED de endurecimiento | `fa5b1326707b9eeae1ebda1bebf7fd6410b92db9` | 0/2: la etiqueta ES no incluía «la», el eje de `scroll-snap-type` no era `x` y faltaba el estado visual pulsado |
| GREEN contractual | `node --test tests/unit/page-control-contract.test.mjs` | 2/2 |
| GREEN Astro/TypeScript | `npm run check`, `npm run internal:typecheck:src`, `npm run internal:typecheck:tests` en Docker | 0 errores, 0 advertencias |
| GREEN build y documentación | `npm run build`, `npm run internal:docs:lint` en Docker | 38 páginas; documentación sin errores |
| GREEN funcional y Axe | `tests/e2e/page-control.spec.ts` en cuatro proyectos Playwright | 27 aprobadas, 9 omitidas por matriz intencional |
| GREEN de no regresión | `phase-2-projects.spec.ts` y `phase-3-skills.spec.ts` en cuatro proyectos Playwright | 24/24 |

## Contrato verificado

1. Ocho controles y ocho paneles en cada vista localizada.
2. `tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls` y nombres accesibles localizados.
3. Navegación con Tab, flechas, Inicio, Fin, Enter, Espacio, clic y toque.
4. Sincronización del punto activo después del desplazamiento táctil nativo.
5. Movimiento suave desactivado con `prefers-reduced-motion: reduce`.
6. Sin desbordamiento horizontal del documento.
7. Axe sin hallazgos críticos o serios para WCAG 2.1 A/AA en las 24 combinaciones de ruta y dispositivo.
8. Conservación íntegra de las tarjetas y de la evidencia comercial/técnica preexistente.

## Entorno reproducible

La instalación del host no expone los binarios locales de Astro y TypeScript mediante `npm run`. La verificación canónica se ejecutó con los servicios `qa`, `web` y `browser-qa` de Docker Compose, usando Node 24, Astro 7.1.3 y Playwright 1.60.0.

## Deuda basal fuera de alcance observada

La ejecución adicional de todos los tests unitarios del repositorio conserva cuatro fallos presentes en archivos no modificados por este lote: un contrato de telemetría Nginx en `phase-9e-contract.test.mjs` y tres aserciones históricas de R3.5b que aún esperan 90 scripts, 121 consumidores y un hash anterior. El PageControl, i18n y el validador documental sí pasan sus pruebas unitarias. Esta deuda no se presenta como corregida por este trabajo.
