# Fase 6 — Performance, Core Web Vitals y 3D avanzado

La Fase 6 valida que Three.js, el GLB, imágenes, JavaScript y entrega estática no perjudiquen UX, SEO, accesibilidad ni mantenibilidad.

## Estado de cierre

La Fase 6 solo se puede cerrar cuando el pipeline completo termina dentro de Docker sin errores, sin tests flaky y con `summary.json` generado.

## Comando oficial

```powershell
docker compose --profile prod --profile qa down --remove-orphans
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down --remove-orphans