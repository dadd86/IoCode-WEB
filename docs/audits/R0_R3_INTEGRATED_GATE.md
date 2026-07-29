# Puerta integrada R0–R3

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R0–R3 | Resultado integrado y frontera de continuación | Git, documentación, entorno, Astro, dependencias y HTTP local | ES, EN, DE | Terminal Docker, reportes JSON y smoke HTTP | 2026-07-29 | `3290cad`; recuperación R2 posterior a `60564f5` |

## Corrección de estado — 2026-07-29

La declaración histórica `Done with evidence` se conserva debajo, pero se rebaja
retroactivamente por S-02: sin R6 no existe gate remoto que detecte una regresión
posterior. R0–R3 alcanzan como máximo `GATE LOCAL OK`; R4 continúa bloqueada por
X-LEGAL.

Estado: `Done with evidence` hasta R3. R4: `Blocked by X-LEGAL`.

## Resultados automatizados

| Puerta | Resultado |
|---|---|
| Pruebas del validador documental | 12/12 PASS |
| Gate G-03 | 25/25 construcciones con fixtures positivos y negativos |
| Corpus documental | 0 errores |
| Pruebas de paridad de entorno | 6/6 PASS |
| Allowlist pública | 6 variables, 0 divergencias |
| Astro check | 95 archivos, 0 errores, 0 warnings, 0 hints |
| Build | 29 páginas |
| Dependencias de producción | 0 vulnerabilidades |
| Estado del contenedor `web` | healthy |
| Playwright contacto | 6/6 PASS |
| Playwright responsive | 93/93 PASS |
| Budgets, raster, bundle y cabeceras | PASS; no cierra Fase 6 |

## Smoke HTTP

| Recurso | Estado |
|---|---:|
| `/health` | 200 |
| `/es/`, `/en/`, `/de/` | 200 |
| `/sitemap.xml`, `/robots.txt` | 200 |
| `/no-existe/` | 404 |
| `/es/proceso` | 308 |

La respuesta HTML incluye CSP y no contiene `unsafe-inline`.

## Bloqueo R4

El programa exige convergencia con X-LEGAL antes de montar y validar la arquitectura legal de release. Faltan entradas externas que el repositorio no puede inferir:

1. dictamen de compatibilidad laboral para publicar datos personales;
2. datos definitivos y firmados para el Impressum conforme a §5 DDG;
3. determinación formal de alcance o exención BFSG.

Por DYC no se crean `COMPLIANCE.md`, rutas legales ni un estado `REVIEWED` ficticio. R5–R8 permanecen pendientes por sus dependencias explícitas de R4, DNS/correo, CI remoto, hosting, dispositivo físico y sign-off del propietario.
