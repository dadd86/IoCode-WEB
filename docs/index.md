# Índice de documentación

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2-recovery | Mapa del corpus documental controlado | Arquitectura, operación, seguridad y QA | ES, EN, DE | `docs/document-control.json` | 2026-07-29 |

## Entrada y arquitectura

- [README](../README.md): inicio rápido.
- [ARCHITECTURE](ARCHITECTURE.md): límites y magnitudes reales.
- [ADRs](adr/0001-static-first-runtime.md): decisiones estables.
- [I18N](I18N.md): rutas, contenidos y locales.
- [Selección de proyectos](PROJECT_SELECTION.md): criterios, evidencia, alta y retirada.

## Operación y calidad

- [RUNBOOK](RUNBOOK.md): única guía operativa.
- [Perfil de producción](PRODUCTION_PROFILE.md): capacidad, SLO, RTO/RPO y ownership.
- [DNS y TLS](DNS_TLS.md): zona, certificado y canonicalización.
- [Operación de producción](PRODUCTION_OPERATIONS.md): hardening, caché, CI/CD, release y rollback.
- [Inventario de secretos](SECRETS_ACCESS_INVENTORY.md): accesos sin valores confidenciales.
- [Search Console](SEARCH_CONSOLE_CHECKLIST.md): propiedad, sitemap e indexación.
- [Entrega Fase 9B](PHASE_9B_DELIVERY.md): matriz SEO/UI/i18n y gates.
- [Entrega Fase 9C](PHASE_9C_DELIVERY.md): contrato Hero3D, WebGL y presupuestos de rendimiento.
- [PERFORMANCE](PERFORMANCE.md): presupuestos, Hero3D y Fase 6.
- [MAINTENANCE](MAINTENANCE.md): cambios habituales.
- [QA_CHECKLIST](../QA_CHECKLIST.md): gate manual y automatizado.

## Seguridad e historial

- [SECURITY](../SECURITY.md): controles técnicos y límites.
- [ADR-0006](adr/0006-production-hosting.md): elección de VPS Docker frente a hosting administrado.
- [CHANGELOG](../CHANGELOG.md): entregas.
- [Migración](MIGRATION_FROM_STATIC_HTML.md): contexto histórico.
- [Evidencia R0](audits/R0_BASELINE.md) y [evidencia R1](testing/r1-document-validator.tdd.md).
- [Evidencia R2-recovery / G-03](testing/r2-recovery-g03.tdd.md): 25 construcciones y fixtures.
- [Propuesta R3.5b](audits/R3_5B_SCRIPT_DISPOSITION.md): 90 scripts, disposición, consumidores y radio de cambio; no autorizada.

## Archivo excluido del control operativo

- [I18N extensa](archive/I18N.full-2026-07-28.md).
- [Selección de proyectos extensa](archive/PROJECT_SELECTION.full-2026-07-28.md).

`docs/archive/` conserva contexto histórico y está excluido de metadatos y
frescura por `docs/document-control.json`. Los contratos vigentes son los
documentos resumidos enlazados en “Entrada y arquitectura”.

Las rutas legales están implementadas como draft controlado y permanecen `noindex` hasta completar X-LEGAL, la dirección postal y la aprobación del propietario. `security.txt` no se crea hasta demostrar DNS y recepción de correo en R5.
