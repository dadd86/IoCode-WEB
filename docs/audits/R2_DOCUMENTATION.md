# Evidencia R2 — Consolidación documental

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R2 | Evidencia del corpus consolidado y validado | Documentación, arquitectura y operación | ES, EN, DE | Diff R2 y reporte de `docs:lint` | 2026-07-28 | Pendiente de firma |

Estado: `Done with evidence`.

## Resultado

- El inventario inicial de R1 contenía 71 errores: 49 de codificación, 18 metadatos ausentes y 4 fences defectuosos.
- `RUN_GUIDE.md`, `Docker/README.md` y `Docker/OPERATIONS.md` fueron absorbidos por `docs/RUNBOOK.md`.
- `Docker/SECURITY_NOTES.md` fue absorbido por `SECURITY.md`.
- El README raíz quedó por debajo del límite de 80 líneas.
- Arquitectura registra 9 claves, 27 rutas localizadas y 29 páginas construidas.
- PERFORMANCE conserva su historial y diferencia el presupuesto ejecutable legacy del objetivo R8 aún no implementado.
- Cinco ADRs registran static-first, i18n, Hero3D progresivo, CSP con hashes y política de crawlers.

## Puerta

```text
npm run docs:lint
Documentación: passed; 0 errores
```

El reporte estructurado queda en `qa-artifacts/documentation/doc-validator.json` y no forma parte del release.

## Límites

R2 no crea `COMPLIANCE.md`, páginas legales ni `security.txt`: dependen respectivamente de X-LEGAL/R4 y DNS/correo/R5. Tampoco cambia todavía los umbrales ejecutables del GLB previstos para R8.
