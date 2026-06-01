# Docker Security Notes

## Secrets

No se deben introducir secretos reales en:

- `Docker/.env`;
- `docker compose` logs;
- Docker build args;
- frontend estático;
- imágenes generadas.

## Contenedor de producción

El servicio `web` sirve únicamente archivos estáticos generados por Astro desde `dist/`.

No hay backend, sesiones, cookies de autenticación ni base de datos dentro de este despliegue Docker.

## Cabeceras

`Docker/nginx/security-headers.conf` define cabeceras conservadoras para sitio estático.

Si en el futuro se integran analíticas, formularios reales, mapas, iframes, APIs externas o pagos, la CSP deberá revisarse explícitamente.
