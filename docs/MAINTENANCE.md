# Maintenance

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Mantenimiento por tipo de cambio | Contenido, rutas, SEO, seguridad y 3D | ES, EN, DE | Fuente Astro, Compose y servidor estático | 2026-07-28 |

Guía de mantenimiento del sitio.

## Cambiar datos de empresa

Archivo:

    src/data/site.ts

Revisar después:

- `npm run check`.
- `npm run build`.
- páginas de contacto.
- schema generado.
- sitemap si cambia URL base.

## Cambiar rutas

Archivo principal:

    src/i18n/routes.ts

Después de cambiar rutas:

    docker compose exec dev npm run check
    docker compose exec dev npm run build

Validar:

    docker compose exec dev sh -lc "grep -n 'hreflang' dist/sitemap.xml | head"

## Cambiar contenido de páginas

Archivo:

    src/data/pageContent.ts

Para Home y Servicios también revisar:

    src/data/phase1Sections.ts

Para Proceso revisar:

    src/data/processSections.ts

## Cambiar textos de interfaz

Archivo:

    src/i18n/ui.ts

Validar ES/EN/DE en:

- contacto.
- botones.
- navegación.
- formularios.

## Cambiar navegación

Archivos:

- `src/i18n/routes.ts`.
- `src/components/Navigation.astro`.
- `src/components/LanguageSwitcher.astro`.

No duplicar rutas en otros archivos.

## Cambiar SEO estructurado

Archivo:

    src/layouts/BaseLayout.astro

Datos de soporte:

    src/data/site.ts

Validar:

    docker compose exec dev npm run build
    docker compose exec dev sh -lc "grep -n -e 'BreadcrumbList' -e 'OfferCatalog' -e 'ContactPoint' dist/es/index.html | head"

## Cambiar sitemap

Archivo:

    src/pages/sitemap.xml.ts

Validar:

    docker compose exec dev npm run build
    docker compose exec dev sh -lc "grep -n -e 'xhtml:link' -e 'lastmod' -e 'x-default' dist/sitemap.xml | head -40"

## Cambiar seguridad HTTP

Archivo:

    Docker/node-static-server.mjs

Validar producción local:

    docker compose --profile prod up --build -d web
    curl.exe -I http://localhost:8080/es/

Revisar headers:

- CSP.
- X-Frame-Options.
- X-Content-Type-Options.
- Permissions-Policy.
- COOP.
- CORP.
- ETag.
- Last-Modified.

## Cambiar modelo 3D

Ruta esperada:

    public/logo/3d/iocode_solutions_logo_extruded_3d.glb

Validar:

    curl.exe -I http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb

## Contacto

El email se configura en:

    src/data/site.ts

Antes de publicar:

- confirmar que el buzón existe.
- enviar correo de prueba.
- probar el formulario en navegador real.

## Publicación

Antes de publicar:

    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod
    docker compose --profile prod up --build -d web

Smoke test:

    curl.exe -I http://localhost:8080/health
    curl.exe -I http://localhost:8080/es/
    curl.exe -I http://localhost:8080/sitemap.xml
    curl.exe -I http://localhost:8080/no-existe/

## No hacer

- No introducir secretos en frontend.
- No publicar carpetas `.git`, `node_modules`, `.astro` ni `dist` dentro de un ZIP de código fuente.
- No activar HSTS sin HTTPS real.
- No añadir analytics sin revisar privacidad y consentimiento.
- No duplicar rutas fuera de `src/i18n/routes.ts`.
