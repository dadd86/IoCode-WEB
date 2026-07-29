# Evidencia R3 — Contrato de entorno

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R3 | Evidencia RED/GREEN de paridad entre `.env.example` y Compose | Configuración Docker y servidor estático | ES, EN, DE | Fixtures, Node test runner y `docker compose config` | 2026-07-29 | RED `c5a9268`; GREEN unitario `76e8544`; integración `3f8233d` |

## Corrección de estado — 2026-07-29

La declaración histórica `Done with evidence` se conserva debajo, pero se rebaja
retroactivamente por S-02: R6 no existe y la comprobación disponible sigue siendo
local. Estado vigente máximo: `GATE LOCAL OK`.

Estado: `Done with evidence`.

## Allowlist pública

- `ASTRO_DEV_PORT=4321`;
- `ASTRO_PREVIEW_PORT=4322`;
- `WEB_PORT=8080`;
- `ENABLE_HSTS=false`;
- `ENABLE_COOP=false`;
- `ENABLE_UPGRADE_INSECURE_REQUESTS=false`.

`NODE_ENV`, `PORT`, telemetría y polling pertenecen al funcionamiento interno de los contenedores y quedan fuera de la comparación pública.

## Recorrido TDD

1. `c5a9268` demuestra RED por ausencia de `tools/check-env-parity.js`.
2. `76e8544` implementa el parser y deja 6/6 pruebas unitarias en verde.
3. La primera ejecución contra el repositorio detectó 6 divergencias reales.
4. `.env.example` y `compose.yml` se alinearon con fallbacks seguros.

## Resultado

```text
npm run env:test
6 pruebas, 6 PASS, 0 FAIL

npm run env:check
Paridad de entorno: passed; 6 variables; 0 errores
```

Cobertura: 97,99 % de líneas, 90,91 % de ramas y 85,71 % de funciones.

`docker compose --profile prod config` resolvió los tres controles de seguridad a `false` y los puertos a 4321, 4322 y 8080 sin alterar las variables internas.

## Límites

El checker valida presencia, interpolación y fallback de la allowlist. No valida secretos ni la disponibilidad de puertos. Activar controles HTTPS continúa condicionado a una prueba real de TLS.
