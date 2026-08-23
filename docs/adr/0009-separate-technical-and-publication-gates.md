# ADR-0009 — Separar salud técnica y autorización de publicación

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R-PRIVACIDAD / CI | Separación de gate técnico y gate jurídico de publicación | GitHub Actions, release y deploy | ES, EN, DE | Workflows, gate G-01 y bloqueos X-LEGAL | 2026-08-23 |

## Problema

Un único pipeline permanentemente rojo por bloqueos jurídicos esperados deja de ser una señal útil de salud técnica. Silenciar ese fallo o convertirlo en permitido sería peor: podría habilitar un despliegue con la capa legal pendiente.

## Decisión

Se publican dos checks independientes y visibles:

| Check | Severidad | Resultado esperado actual | Responsabilidad |
|---|---|---|---|
| `Technical branch gate` | S0 ante regresión técnica o fuga de privacidad | Verde | Tipos, contratos seleccionados, build, G-01 antes/después del build, QA estática, Playwright, HTTP y auditoría de dependencias |
| `Publication gate - BLOCKED-BY-X-LEGAL` | S0 de release | Rojo mientras X1–X4 o cualquier input obligatorio siga abierto | Configuración de producción, aprobación del responsable, autoridad, proveedores, paquete, imagen y evidencia inmutable |

El gate de publicación no usa `continue-on-error`, no se silencia y conserva código de salida distinto de cero. El workflow de despliegue escucha exclusivamente la finalización exitosa de `Publication gate - BLOCKED-BY-X-LEGAL` sobre `master`; un gate técnico verde nunca basta para desplegar.

## Fuentes de verdad

La identidad pública exigida por §5 DDG se versiona una sola vez en `src/data/legal-profile.ts` y no admite override de despliegue. Las variables GitHub `PUBLIC_*` quedan reservadas para aprobaciones, autoridad competente y disclosures de proveedores que forman parte del gate de publicación.

## Bloqueo actual

X1 autoridad competente, X2 validez de dirección c/o para §5 DDG, X3 determinación BFSG y X4 consulta laboral permanecen abiertos. Mientras no exista determinación y aprobación, el check de publicación debe mostrar `BLOCKED-BY-X-LEGAL` y el despliegue debe quedar inaccesible.

## Consecuencias

- Una regresión técnica vuelve a ser visible porque su check tiene un estado independiente.
- El bloqueo jurídico conserva severidad S0 y visibilidad propia.
- Resolver X-LEGAL exigirá actualizar la gobernanza y después renombrar el check para retirar la etiqueta de bloqueo; no basta con cambiar una condición del workflow.
