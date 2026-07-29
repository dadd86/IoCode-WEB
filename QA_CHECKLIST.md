# QA Checklist

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Checklist manual y automatizado de Fase 6 | QA visual, 3D, rendimiento y release | ES, EN, DE | Scripts QA, Playwright y `docs/PERFORMANCE.md` | 2026-07-28 |

## Fase actual

Fase 6 — Performance, Core Web Vitals y 3D avanzado.

Decisión permitida: `GO` únicamente cuando `qa-artifacts/performance/phase-6/summary.json` indique `passed`, `warningCount: 0`, `errorCount: 0`, `blockers.S0: 0` y `blockers.S1: 0` para el código actual.

## Pipeline oficial Docker

```powershell
docker compose --profile assets run --rm assets "npm run internal:prepare:assets:6"
docker compose --profile prod --profile qa down --remove-orphans
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down --remove-orphans
```

## Gate 6.1–6.12

- [x] `assets` ejecuta la preparación sin herramientas instaladas en Windows.
- [x] `performance-budgets.json` pasa y mide el `dist/` desplegable sin duplicar `public/`.
- [x] `glb-repair-report.json` incluye before/after, SHA-256 y backup recuperable.
- [x] `glb-report.json` y `gltf-validator-report.json` pasan sin cámaras, errores ni warnings.
- [x] `bundle-report.json` confirma loader inicial ligero, JS inicial bajo presupuesto y Three.js dinámico.
- [x] `hero3d-runtime-review.json` confirma visibilidad, reduced motion, DPR, pérdida de contexto y dispose.
- [x] El Hero solicita el runtime automáticamente al entrar en viewport, sin eventos de puntero, toque o foco.
- [x] La matriz ES/EN/DE de autocarga pasa en Chromium y WebKit con reintentos desactivados.
- [x] El canvas termina en `data-hero3d-logo-mode="source-texture-fidelity"`.
- [x] El GLB contiene una única cara alpha-safe y su imagen embebida coincide con la textura canónica registrada.
- [x] `3d-fallback-runtime-report.json` confirma exactamente los tests runtime esperados, sin flaky.
- [x] `headers-report.json` cubre HTML, JS, CSS, PNG, WebP, GLB y AVIF si existe.
- [x] `lighthouse-summary.json` contiene 10 mediciones y cada JSON/HTML referenciado existe.
- [x] Lighthouse desktop usa la mediana de tres ejecuciones y registra todos los intentos en el resumen.
- [x] El fallback y el contenido son usables sin WebGL, con reduced motion y con fallo del GLB.
- [x] DATA, HMI e IOT son visibles y accionables en WebKit iPhone.
- [x] El menú hamburguesa abre y muestra enlaces en móvil, tablet vertical y tablet horizontal.
- [x] Los H1 internos usan escala fluida, conservan palabras completas y no generan overflow en ES/EN/DE.
- [x] Contacto presenta el formulario como acción principal y cambia a una columna legible en tablet/móvil.
- [x] `internal:qa:responsive-visual:6` genera 72 capturas de páginas internas en móvil, tablet y escritorio.
- [x] Las rutas ES/EN/DE mantienen navegación, SEO y ausencia de overflow.
- [x] `summary.json` agrega todos los artefactos sin ocultar warnings.
- [x] `docs/PERFORMANCE.md` y `docs/RUNBOOK.md` coinciden con este flujo.
- [x] `internal:qa:logo3d-version:6`: passed.
- [ ] Captura de un iPhone físico contrastada con este mismo build.

## Release

- [ ] El árbol Git está limpio y el commit incluye las correcciones validadas.
- [ ] El ZIP se crea mediante el contenedor `release-tools`, nunca con una selección manual de archivos.
- [ ] La inspección del ZIP no contiene `.git`, `.agents`, `.env` reales, `node_modules`, `dist`, `qa-artifacts`, logs ni archivos comprimidos anidados.
- [ ] El entorno productivo aporta HTTPS, redirección HTTP→HTTPS, rollback y monitorización de campo.

Con cualquier casilla obligatoria pendiente, la decisión es `NO-GO`.
