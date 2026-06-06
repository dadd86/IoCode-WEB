# Migration From Static HTML

Este documento conserva el contexto histÃ³rico de migraciÃ³n.

## Estado actual

La web ya no se mantiene como HTML estÃ¡tico manual.

El estado actual es:

- Astro como generador estÃ¡tico.
- TypeScript.
- rutas ES/EN/DE.
- contenido centralizado en `src/data`.
- SEO tÃ©cnico avanzado.
- Docker Compose desde `compose.yml` en la raÃ­z.
- runtime local con servidor estÃ¡tico Node.

## Objetivo de la migraciÃ³n

La migraciÃ³n buscaba:

- eliminar duplicaciÃ³n manual de HTML.
- centralizar contenido multilingÃ¼e.
- generar sitemap automÃ¡ticamente.
- mejorar SEO tÃ©cnico.
- mejorar mantenibilidad.
- permitir validaciÃ³n con TypeScript y Astro.
- servir producciÃ³n local de forma reproducible con Docker.

## Resultado

Implementado:

- rutas localizadas.
- componentes reutilizables.
- layout base con metadata.
- navegaciÃ³n multilingÃ¼e.
- sitemap avanzado.
- schema JSON-LD.
- headers HTTP en runtime local.
- contacto estÃ¡tico por `mailto`.
- persona fÃ­sica visible solo en contacto.

## Fuente actual de verdad

- Rutas: `src/i18n/routes.ts`.
- Contenido de pÃ¡ginas: `src/data/pageContent.ts`.
- Empresa y SEO estructurado: `src/data/site.ts`.
- Proceso: `src/data/processSections.ts`.
- Home/Servicios fase 1: `src/data/phase1Sections.ts`.
- Runtime: `Docker/node-static-server.mjs`.
- OrquestaciÃ³n local: `compose.yml`.

## ValidaciÃ³n posterior a cambios

    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod

## Nota

Este documento es histÃ³rico. Para ejecutar el proyecto, usar `RUN_GUIDE.md`.