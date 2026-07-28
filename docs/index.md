# Índice de documentación

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Mapa del corpus documental controlado | Arquitectura, operación, seguridad y QA | ES, EN, DE | `docs/document-control.json` | 2026-07-28 |

## Entrada y arquitectura

- [README](../README.md): inicio rápido.
- [ARCHITECTURE](ARCHITECTURE.md): límites y magnitudes reales.
- [ADRs](adr/0001-static-first-runtime.md): decisiones estables.
- [I18N](I18N.md): rutas, contenidos y locales.

## Operación y calidad

- [RUNBOOK](RUNBOOK.md): única guía operativa.
- [PERFORMANCE](PERFORMANCE.md): presupuestos, Hero3D y Fase 6.
- [MAINTENANCE](MAINTENANCE.md): cambios habituales.
- [QA_CHECKLIST](../QA_CHECKLIST.md): gate manual y automatizado.

## Seguridad e historial

- [SECURITY](../SECURITY.md): controles técnicos y límites.
- [CHANGELOG](../CHANGELOG.md): entregas.
- [Migración](MIGRATION_FROM_STATIC_HTML.md): contexto histórico.
- [Evidencia R0](audits/R0_BASELINE.md) y [evidencia R1](testing/r1-document-validator.tdd.md).

`COMPLIANCE.md` y las rutas legales no se publican como verificadas hasta completar X-LEGAL y R4. `security.txt` no se crea hasta demostrar DNS y recepción de correo en R5.
