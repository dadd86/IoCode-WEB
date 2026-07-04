# Performance — Fase 6

## Objetivo

Validar que Three.js, el GLB, imágenes, JS y entrega estática no perjudiquen UX, SEO, accesibilidad ni mantenibilidad.

## Comando Docker oficial

```powershell
docker compose --profile prod --profile qa down --remove-orphans
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down