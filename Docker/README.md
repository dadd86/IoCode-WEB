# Docker

DocumentaciÃ³n de Docker para IoCode SOLUTIONS Web.

## Servicios

El archivo actual de orquestaciÃ³n estÃ¡ en la raÃ­z del proyecto:

    compose.yml

Servicios definidos:

- `dev`: servidor de desarrollo Astro.
- `qa`: validaciÃ³n automatizada local.
- `preview`: build + Astro preview.
- `web`: producciÃ³n local con servidor estÃ¡tico Node.

## Desarrollo

    docker compose up -d dev

URL:

    http://localhost:4321/es/

## QA

    docker compose run --rm qa

Ejecuta:

- `npm run check`.
- `npm run build`.
- `npm run audit:prod`.

## Preview

    docker compose --profile preview up --build preview

URL:

    http://localhost:4322/es/

## ProducciÃ³n local

    docker compose --profile prod up --build -d web

URL:

    http://localhost:8080/es/

Healthcheck:

    http://localhost:8080/health

## VolÃºmenes

- `iocode_node_modules`: dependencias dentro de Docker.
- `iocode_astro_cache`: cachÃ© de Astro.

## Puertos

- desarrollo: 4321 por defecto.
- preview: 4322 por defecto.
- producciÃ³n local: 8080 por defecto.

Se pueden sobrescribir con `.env` local no versionado o variables de entorno.

## Seguridad del contenedor web

El servicio `web` usa:

- usuario no root en runtime.
- filesystem read-only.
- `tmpfs` para `/tmp`.
- `no-new-privileges`.
- `cap_drop: ALL`.
- healthcheck HTTP.
- servidor estÃ¡tico con cabeceras de seguridad.

## HSTS

Variables disponibles:

- `ENABLE_HSTS`.
- `ENABLE_UPGRADE_INSECURE_REQUESTS`.

Mantener en `false` en local. Activar solo cuando el dominio final funcione por HTTPS.

## Build pipeline

El Dockerfile de producciÃ³n ejecuta:

- instalaciÃ³n determinista con `npm ci`.
- `npm run check`.
- `npm run build`.
- copia de `dist` al runtime.
- arranque de `Docker/node-static-server.mjs`.

Si `check` o `build` fallan, la imagen de producciÃ³n no se construye.

## No-go operativo

No publicar si:

- `npm run check` falla.
- `npm run build` falla.
- `npm run audit:prod` reporta vulnerabilidades.
- `/health` no responde 200.
- `/no-existe/` no responde 404.
- rutas sin slash no redirigen con 308.
- el correo de contacto no existe.