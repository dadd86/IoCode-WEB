# QA Checklist

Checklist de validación para IoCode SOLUTIONS Web.

## Fase actual

Fase 6 — Performance, Core Web Vitals y 3D avanzado.

## Estado

NO-GO hasta que el pipeline completo de Fase 6 termine dentro de Docker sin errores, sin tests flaky y con `summary.json` generado.

## Comando oficial

```powershell
docker compose --profile prod --profile qa down --remove-orphans
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down --remove-orphans