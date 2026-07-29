# Evidencia R2 — Consolidación documental

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R2 | Evidencia del corpus consolidado y validado | Documentación, arquitectura y operación | ES, EN, DE | Diff R2, recuperación R2 y reporte de `docs:lint` | 2026-07-29 | `4aee712`; recuperación posterior a `60564f5` |

## Corrección de estado — 2026-07-29

La declaración histórica `Done with evidence` se conserva debajo, pero se rebaja
retroactivamente por S-02: R6 no existe y no hay aún una puerta remota que permita
ese estado. Tras recuperar los entregables documentales omitidos, el estado vigente
máximo es `GATE LOCAL OK`.

Estado: `Done with evidence`.

## Resultado

- El inventario inicial de R1 contenía 71 errores: 49 de codificación, 18 metadatos ausentes y 4 fences defectuosos.
- `RUN_GUIDE.md`, `Docker/README.md` y `Docker/OPERATIONS.md` fueron absorbidos por `docs/RUNBOOK.md`.
- `Docker/SECURITY_NOTES.md` fue absorbido por `SECURITY.md`.
- El README raíz quedó por debajo del límite de 80 líneas.
- Arquitectura registra 9 claves, 27 rutas localizadas y 29 páginas construidas.
- PERFORMANCE conserva su historial y diferencia el presupuesto ejecutable legacy del objetivo R8 aún no implementado.
- Cinco ADRs registran static-first, i18n, Hero3D progresivo, CSP con hashes y política de crawlers.

## Recuperación de entregables — 2026-07-29

| Entregable | Estado | Evidencia |
|---|---|---|
| Regeneración de `CHANGELOG.md` | HECHO | El documento está controlado; `docs:lint` no detecta mojibake, BOM ni estructura inválida. |
| Reducción de `I18N.md` | HECHO | Base 1.027 → pre-recuperación 1.031 (`+4`) → vigente 150 (`-877` frente a base). Conserva contrato de rutas, alta ES/EN/DE y plantilla de clave. |
| Reducción de `PROJECT_SELECTION.md` | HECHO | Base 1.061 → pre-recuperación 1.065 (`+4`) → vigente 176 (`-885` frente a base). Conserva clasificación, criterios, rechazo, alta y retirada. |
| Gate anti-terceros G-03 | HECHO | 25/25 construcciones, pares positivo/negativo y 12/12 pruebas; detalle en `docs/testing/r2-recovery-g03.tdd.md`. |
| Reconstrucción de `docs/index.md` | HECHO | Índice vigente enlaza contratos, evidencia y archivo excluido; `docs:lint` valida sus enlaces. |

El crecimiento previo de `+4` líneas en ambos documentos fue causado exactamente
por la cabecera de metadatos incorporada en R2: cabecera de tabla, separador, fila
de datos y línea en blanco. El indicador de 300 líneas no fue usado como contrato:
el cierre se decidió por la permanencia de los procedimientos y criterios
enumerados en la tabla.

Los originales de 1.031 y 1.065 líneas se conservan en `docs/archive/`. Sus
SHA-256 coinciden con el snapshot previo a R2-recovery. El directorio se declaró
excluido en `docs/document-control.json` antes del traslado.

## Cierre local R2-recovery — 2026-07-29

| Puerta | Resultado |
|---|---|
| Validador documental | 12/12 PASS; G-03 25/25; corpus 0 errores |
| Cobertura documental | 98,32 % líneas; 84,03 % ramas; 97,37 % funciones |
| Astro y tipos | 99 archivos; 0 errores, warnings o hints; tipos de fuente y E2E PASS |
| Build | 29 páginas estáticas |
| Paridad de entorno | 6/6 pruebas; 6 variables; 0 divergencias |
| Dependencias de producción | 0 vulnerabilidades |
| Playwright dirigido | Contacto ES/EN/DE: 6/6 PASS |
| Playwright regresión | Responsive Chromium/iPhone/iPad: 93/93 PASS |
| Presupuestos | Budgets, raster, bundle y cabeceras PASS |
| Contenedor y smoke | `healthy`; rutas principales 200; inexistente 404; canonical 308 |

Resultado contable: R1 y R2 quedan en `GATE LOCAL OK`. Las comprobaciones de
presupuesto de Fase 6 se reutilizaron como gate transversal; no implican ni
documentan el cierre visual de esa fase.

## Puerta

```text
npm run docs:lint
Documentación: passed; 0 errores
```

El reporte estructurado queda en `qa-artifacts/documentation/doc-validator.json` y no forma parte del release.

## Límites

R2 no crea `COMPLIANCE.md`, páginas legales ni `security.txt`: dependen respectivamente de X-LEGAL/R4 y DNS/correo/R5. Tampoco cambia todavía los umbrales ejecutables del GLB previstos para R8.
