# QA Checklist

## Fase actual

Fase 6 — Performance, Core Web Vitals y 3D avanzado.

Decisión permitida: `GO` únicamente cuando `qa-artifacts/performance/phase-6/summary.json` indique `passed`, `warningCount: 0`, `errorCount: 0`, `blockers.S0: 0` y `blockers.S1: 0` para el código actual.

## Pipeline oficial Docker

```powershell
docker compose --profile assets run --rm assets "npm run prepare:assets:6"
docker compose --profile prod --profile qa down --remove-orphans
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down --remove-orphans
```

## Gate 6.1–6.12

- [ ] `assets` ejecuta la preparación sin herramientas instaladas en Windows.
- [ ] `performance-budgets.json` pasa y mide el `dist/` desplegable sin duplicar `public/`.
- [ ] `glb-repair-report.json` incluye before/after, SHA-256 y backup recuperable.
- [ ] `glb-report.json` y `gltf-validator-report.json` pasan sin cámaras, errores ni warnings.
- [ ] `bundle-report.json` confirma loader inicial ligero, JS inicial bajo presupuesto y Three.js dinámico.
- [ ] `hero3d-runtime-review.json` confirma visibilidad, reduced motion, DPR, pérdida de contexto y dispose.
- [ ] `3d-fallback-runtime-report.json` confirma exactamente los tests runtime esperados, sin flaky.
- [ ] `headers-report.json` cubre HTML, JS, CSS, PNG, WebP, GLB y AVIF si existe.
- [ ] `lighthouse-summary.json` contiene 10 mediciones y cada JSON/HTML referenciado existe.
- [ ] El fallback y el contenido son usables sin WebGL, con reduced motion y con fallo del GLB.
- [ ] `summary.json` agrega todos los artefactos sin ocultar warnings.
- [ ] `docs/PERFORMANCE.md` y `RUN_GUIDE.md` coinciden con este flujo.
- [ ] `qa:logo3d-version:6`: passed.

## Release

- [ ] El árbol Git está limpio y el commit incluye las correcciones validadas.
- [ ] El ZIP se crea mediante el contenedor `release-tools`, nunca con una selección manual de archivos.
- [ ] La inspección del ZIP no contiene `.git`, `.agents`, `.env` reales, `node_modules`, `dist`, `qa-artifacts`, logs ni archivos comprimidos anidados.
- [ ] El entorno productivo aporta HTTPS, redirección HTTP→HTTPS, rollback y monitorización de campo.

Con cualquier casilla obligatoria pendiente, la decisión es `NO-GO`.
