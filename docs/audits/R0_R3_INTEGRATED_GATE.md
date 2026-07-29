# Puerta integrada R0–R3

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R0–R3.5b | Resultado integrado y frontera de continuación | Git, documentación, entorno, Astro, dependencias y HTTP local | ES, EN, DE | Terminal Docker, reportes JSON, contrato R3.5b y smoke HTTP | 2026-07-29 | `33d9695`; recuperación R2 posterior a `60564f5` |

## Corrección de estado — 2026-07-29

La declaración histórica `Done with evidence` se conserva debajo, pero se rebaja
retroactivamente por S-02: sin R6 no existe gate remoto que detecte una regresión
posterior. R0–R3 alcanzan como máximo `GATE LOCAL OK`; R4 continúa bloqueada por
X-LEGAL.

Estado: `GATE LOCAL OK` hasta R3.5b. R4: `Blocked by V2 + X-LEGAL`.

## Resultados automatizados

| Puerta | Resultado |
|---|---|
| Pruebas del validador documental y de herramientas | 13/13 PASS |
| Contrato de renombrado R3.5b | 5/5 PASS dentro de Docker |
| Interfaz npm | 90 → 90 (`Δ 0`); 81 nombres normalizados; 0 eliminaciones |
| Consumidores de los 81 nombres | 114 → 119 (`Δ +5`); 0 nombres anteriores |
| Gate G-03 | 25/25 construcciones con fixtures positivos y negativos |
| Invocaciones npm literales en `tools/` | PASS; 0 nombres desconocidos reales |
| Corpus documental | 27 documentos, 42 fuentes runtime y 61 herramientas; 0 errores |
| Pruebas de paridad de entorno | 6/6 PASS |
| Allowlist pública | 6 variables, 0 divergencias |
| Astro check | 95 → 101 archivos (`Δ +6`), 0 errores, 0 warnings, 0 hints |
| Build | 29 → 29 páginas (`Δ 0`) |
| Dependencias de producción | 0 vulnerabilidades |
| Estado del contenedor `web` | healthy |
| Playwright contacto | 6/6 PASS |
| Playwright responsive | 93/93 PASS |
| Budgets, raster, bundle y cabeceras | PASS; no cierra Fase 6 |

El `Δ +6` de Astro coincide con los seis activos de validación añadidos desde la
puerta anterior: una configuración de fixture, cuatro fixtures de herramientas
y el contrato R3.5b. No representa seis páginas nuevas.

## Cierre R3.5b — 2026-07-29

R3.5b se ejecutó únicamente dentro de Docker porque el host Windows no dispone
de Astro local ejecutable. El límite y la deuda de que el validador comprueba
existencia, pero no ejecutabilidad, quedan declarados en
[`RUNBOOK.md`](../RUNBOOK.md).

Checkpoint RED inicial: `b433b80`. Verificó 81 nombres y expuso 114
consumidores en forma shell. La revisión independiente descubrió dos
invocaciones exec-array en Docker y tres accesos directos a claves de scripts.
El segundo RED `43d219a` reprodujo los cinco puntos ciegos antes de corregirlos.

Checkpoint GREEN: `33d9695`.

| Magnitud | Referencia | Cierre | Delta |
|---|---:|---:|---:|
| Scripts | 90 | 90 | 0 |
| Nombres anteriores de los 81 | 81 | 0 | −81 |
| Nombres finales de los 81 | 0 | 81 | +81 |
| Consumidores afectados | 114 | 119 | +5 |
| Consumidores conocidos por el contrato ampliado | 168 | 174 | +6 |
| Referencias archivadas | 2 | 2 | 0 |
| Archivos del GREEN | 23 previstos | 26 | +3 |

El `Δ +5` del radio afectado se descompone en dos invocaciones Docker
exec-array y tres accesos programáticos a claves. El `Δ +6` del inventario
completo añade además el `CMD` preexistente de `dev`, que no cambia porque es
reservado por convención. El `Δ +3` de archivos son los dos Dockerfiles y el
mensaje operativo de resumen que el escáner literal anterior no cubría.

No se tocaron `dev`, `check`, `build` ni `preview`; tampoco se eliminó ningún
script. Las cinco eliminaciones propuestas conservan autorización separada.
Los dos documentos de `docs/archive/` y el registro fechado de decisión
mantuvieron su SHA-256.

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

Aunque X-LEGAL converja, R4 conserva además un NO-GO técnico hasta cubrir cuatro
caminos del validador: URL remota malformada, `<link>` sin `rel` ni `href`,
directorio runtime anidado y contrato I-03 de igual longitud con campo
incorrecto o desordenado. El detalle está en
[`r1-document-validator.tdd.md`](../testing/r1-document-validator.tdd.md).

Por DYC no se crean `COMPLIANCE.md`, rutas legales ni un estado `REVIEWED` ficticio. R5–R8 permanecen pendientes por sus dependencias explícitas de R4, DNS/correo, CI remoto, hosting, dispositivo físico y sign-off del propietario.

R3.5a queda aceptada como inventario y R3.5b como `GATE LOCAL OK`. Su decisión
fechada e inmutable se conserva en
[`R3_5B_SCRIPT_DISPOSITION.md`](R3_5B_SCRIPT_DISPOSITION.md). El lote
independiente para cinco eliminaciones continúa pendiente de autorización.
