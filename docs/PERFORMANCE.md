## Fase 6 — Performance, Core Web Vitals y 3D avanzado

La Fase 6 no se considera cerrada por build exitoso ni por validaciones parciales.

El cierre requiere ejecutar el pipeline completo dentro de Docker:

```sh
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down --remove-orphans