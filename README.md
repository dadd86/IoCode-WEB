# IoCode SOLUTIONS Web

Sitio web estÃ¡tico y multilingÃ¼e de IoCode SOLUTIONS.

El proyecto usa Astro, TypeScript, Three.js y Docker Compose. La web estÃ¡ orientada a automatizaciÃ³n industrial, PLC, robÃ³tica, software industrial, datos e Industria 4.0.

## Estado validado localmente

Ãšltima fase validada: Fase 1.1A.

Estado comprobado por terminal:

- `npm run check` dentro del contenedor: 0 errores, 0 warnings, 0 hints.
- `npm run build` dentro del contenedor: 29 pÃ¡ginas generadas.
- `npm run audit:prod`: 0 vulnerabilidades de producciÃ³n.
- Imagen Docker de producciÃ³n construida correctamente.
- Contenedor `web` iniciado correctamente.
- `/health`: 200 OK.
- `/es/proceso/`, `/en/process/`, `/de/prozess/`: 200 OK.
- `/sitemap.xml`: 200 OK.
- `/no-existe/`: 404 Not Found.
- Rutas sin slash final redirigen con 308.
- Headers HTTP avanzados activos en el servidor estÃ¡tico local.

No se afirma posicionamiento real en Google ni rendimiento Lighthouse todavÃ­a. Eso requiere publicaciÃ³n, mediciÃ³n y Search Console.

## Stack

- Astro 6.
- TypeScript.
- Three.js para escena 3D.
- Docker Compose.
- Node.js Alpine para desarrollo y runtime local.
- Sitio estÃ¡tico generado en `dist/`.
- Servidor estÃ¡tico Node en `Docker/node-static-server.mjs`.

## Estructura principal

- `src/`: cÃ³digo fuente Astro, componentes, datos e i18n.
- `src/data/`: contenidos y configuraciÃ³n semÃ¡ntica.
- `src/i18n/`: rutas, locales y UI strings.
- `src/pages/`: pÃ¡ginas Astro y sitemap.
- `src/components/`: componentes visuales y funcionales.
- `src/assets/`: CSS global y componentes.
- `public/`: assets pÃºblicos servidos como raÃ­z del sitio.
- `Docker/`: Dockerfiles y servidor estÃ¡tico.
- `docs/`: documentaciÃ³n tÃ©cnica.
- `compose.yml`: definiciÃ³n actual de servicios Docker.
- `.env.example`: variables locales no sensibles.

## Requisitos

Recomendado:

- Docker Desktop.
- PowerShell en Windows.
- VS Code opcional.
- Node.js local no es obligatorio si trabajas con Docker.

## Inicio rÃ¡pido con Docker

Desde la raÃ­z del proyecto:

    docker compose up -d dev

Abrir:

    http://localhost:4321/es/
    http://localhost:4321/en/
    http://localhost:4321/de/

## QA local

Desde la raÃ­z:

    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod

O usando el servicio QA:

    docker compose run --rm qa

## ProducciÃ³n local

Construir y levantar producciÃ³n local:

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
- pÃ¡ginas principales: 200.
- `/sitemap.xml`: 200.
- ruta inexistente: 404.
- ruta sin slash final: 308 hacia la versiÃ³n con slash.

## Servicios Docker

- `dev`: Astro dev server en puerto 4321.
- `qa`: ejecuta check, build y audit de producciÃ³n.
- `preview`: build + Astro preview en puerto 4322.
- `web`: runtime estÃ¡tico de producciÃ³n local en puerto 8080.

## Variables locales

Archivo de ejemplo:

    .env.example

Variables soportadas:

- `ASTRO_DEV_PORT`: puerto local de desarrollo. Por defecto 4321.
- `ASTRO_PREVIEW_PORT`: puerto local de preview. Por defecto 4322.
- `WEB_PORT`: puerto local de producciÃ³n. Por defecto 8080.
- `ASTRO_TELEMETRY_DISABLED`: desactiva telemetrÃ­a de Astro.
- `ENABLE_HSTS`: activar solo en despliegue HTTPS real.
- `ENABLE_UPGRADE_INSECURE_REQUESTS`: activar solo en despliegue HTTPS real.

No guardes secretos reales en archivos versionados.

## Seguridad HTTP local

El servidor estÃ¡tico incluye:

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
- redirect 308 para rutas canÃ³nicas con slash final.

HSTS estÃ¡ desactivado por defecto. No lo actives hasta verificar HTTPS real en el dominio final.

## SEO tÃ©cnico

Implementado:

- pÃ¡ginas estÃ¡ticas indexables.
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
- schema `Person` solo en pÃ¡ginas de contacto.

No se garantiza ranking. La indexaciÃ³n real debe comprobarse con Google Search Console despuÃ©s de publicar.

## Contacto

El formulario es estÃ¡tico y usa `mailto:`. No envÃ­a datos a un backend.

Antes de publicar, confirma que el correo configurado en `src/data/site.ts` existe y recibe mensajes.

## DocumentaciÃ³n relacionada

- `RUN_GUIDE.md`: guÃ­a de ejecuciÃ³n.
- `SECURITY.md`: modelo de seguridad y lÃ­mites.
- `QA_CHECKLIST.md`: checklist de validaciÃ³n.
- `Docker/README.md`: uso de servicios Docker.
- `Docker/OPERATIONS.md`: runbook operativo.
- `docs/ARCHITECTURE.md`: arquitectura.
- `docs/MAINTENANCE.md`: mantenimiento.
- `docs/I18N.md`: internacionalizaciÃ³n.
- `docs/PROJECT_SELECTION.md`: criterios de proyectos.

## No hacer

- No usar comandos antiguos con archivos compose dentro de la carpeta Docker.
- No depender de archivos env dentro de la carpeta Docker.
- No ejecutar `npm audit fix --force` sin revisar impacto.
- No publicar ZIPs con `.git`, `node_modules`, `.astro` o `dist`.
- No afirmar producciÃ³n real sin validar dominio, HTTPS, Search Console, Lighthouse y correo.