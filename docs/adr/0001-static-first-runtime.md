# ADR-0001 — Sitio static-first con runtime mínimo

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Decisión de generar HTML estático y servir `dist` sin backend de aplicación | Arquitectura y despliegue | ES, EN, DE | `astro.config.mjs`, `src/pages/` y `Docker/node-static-server.mjs` | 2026-07-28 |

Estado: Accepted.

## Contexto

El sitio publica contenido corporativo multilingüe y un contacto por `mailto:`. No necesita autenticación, persistencia, API ni ejecución del lado servidor.

## Decisión

Astro genera `dist/`; un servidor Node mínimo lo entrega en el contenedor `web`. El contenido principal existe antes de ejecutar JavaScript.

## Consecuencias

La superficie de ataque y operación es pequeña. Funciones futuras que requieran datos o identidad deberán introducir una frontera nueva y revisar este ADR; no se simula persistencia inexistente.
