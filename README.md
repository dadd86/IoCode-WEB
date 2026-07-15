# IoCode SOLUTIONS Web

Sitio web estático y multilingüe de IoCode SOLUTIONS.

El proyecto usa Astro, TypeScript, Three.js y Docker Compose. La web está orientada a automatización industrial, PLC, robótica, software industrial, datos e Industria 4.0.

## Estado validado localmente

Última fase validada: Fase 1.1A.

Estado comprobado por terminal:

- `npm run check` dentro del contenedor: 0 errores, 0 warnings, 0 hints.
- `npm run build` dentro del contenedor: 29 páginas generadas.
- `npm run audit:prod`: 0 vulnerabilidades de producción.
- Imagen Docker de producción construida correctamente.
- Contenedor `web` iniciado correctamente.
- `/health`: 200 OK.
- `/es/proceso/`, `/en/process/`, `/de/prozess/`: 200 OK.
- `/sitemap.xml`: 200 OK.
- `/no-existe/`: 404 Not Found.
- Rutas sin slash final redirigen con 308.
- Headers HTTP avanzados activos en el servidor estático local.

No se afirma posicionamiento real en Google ni rendimiento Lighthouse todavía. Eso requiere publicación, medición y Search Console.

## Stack

- Astro 6.
- TypeScript.
- Three.js para escena 3D.
- Docker Compose.
- Node.js Alpine para desarrollo y runtime local.
- Sitio estático generado en `dist/`.
- Servidor estático Node en `Docker/node-static-server.mjs`.

## Estructura principal

- `src/`: código fuente Astro, componentes, datos e i18n.
- `src/data/`: contenidos y configuración semántica.
- `src/i18n/`: rutas, locales y UI strings.
- `src/pages/`: páginas Astro y sitemap.
- `src/components/`: componentes visuales y funcionales.
- `src/assets/`: CSS global y componentes.
- `public/`: assets públicos servidos como raíz del sitio.
- `Docker/`: Dockerfiles y servidor estático.
- `docs/`: documentación técnica.
- `compose.yml`: definición actual de servicios Docker.
- `.env.example`: variables locales no sensibles.

## Requisitos

Recomendado:

- Docker Desktop.
- PowerShell en Windows.
- VS Code opcional.
- Node.js local no es obligatorio si trabajas con Docker.

## Inicio rápido con Docker

Desde la raíz del proyecto:

    docker compose up -d dev

Abrir:

    http://localhost:4321/es/
    http://localhost:4321/en/
    http://localhost:4321/de/

## QA local

Desde la raíz:

    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod

O usando el servicio QA:

    docker compose run --rm qa

## Producción local

Construir y levantar producción local:

    docker compose --profile prod up --build -d web

Comprobar:

    curl.exe -I http://localhost:8080/health
    curl.exe -I http://localhost:8080/es/
    curl.exe -I http://localhost:8080/en/
    curl.exe -I http://localhost:8080/de/
    curl.exe -I http://localhost:8080/sitemap.xml
    curl.exe -I http://localhost:8080/no-existe/

Resultados esperados:

- `/health`: 200.
- páginas principales: 200.
- `/sitemap.xml`: 200.
- ruta inexistente: 404.
- ruta sin slash final: 308 hacia la versión con slash.

## Servicios Docker

- `dev`: Astro dev server en puerto 4321.
- `qa`: ejecuta check, build y audit de producción.
- `preview`: build + Astro preview en puerto 4322.
- `web`: runtime estático de producción local en puerto 8080.

## Variables locales

Archivo de ejemplo:

    .env.example

Variables soportadas:

- `ASTRO_DEV_PORT`: puerto local de desarrollo. Por defecto 4321.
- `ASTRO_PREVIEW_PORT`: puerto local de preview. Por defecto 4322.
- `WEB_PORT`: puerto local de producción. Por defecto 8080.
- `ASTRO_TELEMETRY_DISABLED`: desactiva telemetría de Astro.
- `ENABLE_HSTS`: activar solo en despliegue HTTPS real.
- `ENABLE_UPGRADE_INSECURE_REQUESTS`: activar solo en despliegue HTTPS real.

No guardes secretos reales en archivos versionados.

## Seguridad HTTP local

El servidor estático incluye:

- `Content-Security-Policy`.
- `X-Content-Type-Options`.
- `X-Frame-Options`.
- `Referrer-Policy`.
- `Permissions-Policy`.
- `Cross-Origin-Opener-Policy`.
- `Cross-Origin-Resource-Policy`.
- `ETag`.
- `Last-Modified`.
- cache diferenciado para HTML, sitemap, health y assets.
- redirect 308 para rutas canónicas con slash final.

HSTS está desactivado por defecto. No lo actives hasta verificar HTTPS real en el dominio final.

## SEO técnico

Implementado:

- páginas estáticas indexables.
- rutas ES/EN/DE.
- canonical.
- hreflang HTML.
- sitemap XML con hreflang y lastmod.
- robots.txt.
- schema `Organization`.
- schema `ProfessionalService`.
- schema `ContactPoint`.
- schema `OfferCatalog`.
- schema `BreadcrumbList`.
- schema `Person` solo en páginas de contacto.

No se garantiza ranking. La indexación real debe comprobarse con Google Search Console después de publicar.

## Contacto

El formulario es estático y usa `mailto:`. No envía datos a un backend.

Antes de publicar, confirma que el correo configurado en `src/data/site.ts` existe y recibe mensajes.

## Documentación relacionada

- `RUN_GUIDE.md`: guía de ejecución.
- `SECURITY.md`: modelo de seguridad y límites.
- `QA_CHECKLIST.md`: checklist de validación.
- `Docker/README.md`: uso de servicios Docker.
- `Docker/OPERATIONS.md`: runbook operativo.
- `docs/ARCHITECTURE.md`: arquitectura.
- `docs/MAINTENANCE.md`: mantenimiento.
- `docs/I18N.md`: internacionalización.
- `docs/PROJECT_SELECTION.md`: criterios de proyectos.

## No hacer

- No usar comandos antiguos con archivos compose dentro de la carpeta Docker.
- No depender de archivos env dentro de la carpeta Docker.
- No ejecutar `npm audit fix --force` sin revisar impacto.
- No publicar ZIPs con `.git`, `node_modules`, `.astro` o `dist`.
- No afirmar producción real sin validar dominio, HTTPS, Search Console, Lighthouse y correo.


## Desarrollo local
docker compose up -d dev
docker compose logs -f dev

URL:

http://localhost:4321/es/

## Producción local
docker compose --profile prod up -d web
docker compose --profile prod logs -f web

URL:

http://localhost:8080/es/