# Migration From Static HTML

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| Histórico | Contexto conservado de la migración a Astro | Arquitectura histórica | ES, EN, DE | Historial del proyecto | 2026-07-28 |

Este documento conserva el contexto histórico de migración.

## Estado actual

La web ya no se mantiene como HTML estático manual.

El estado actual es:

- Astro como generador estático.
- TypeScript.
- rutas ES/EN/DE.
- contenido centralizado en `src/data`.
- SEO técnico avanzado.
- Docker Compose desde `compose.yml` en la raíz.
- runtime local con servidor estático Node.

## Objetivo de la migración

La migración buscaba:

- eliminar duplicación manual de HTML.
- centralizar contenido multilingüe.
- generar sitemap automáticamente.
- mejorar SEO técnico.
- mejorar mantenibilidad.
- permitir validación con TypeScript y Astro.
- servir producción local de forma reproducible con Docker.

## Resultado

Implementado:

- rutas localizadas.
- componentes reutilizables.
- layout base con metadata.
- navegación multilingüe.
- sitemap avanzado.
- schema JSON-LD.
- headers HTTP en runtime local.
- contacto estático por `mailto`.
- persona física visible solo en contacto.

## Fuente actual de verdad

- Rutas: `src/i18n/routes.ts`.
- Contenido de páginas: `src/data/pageContent.ts`.
- Empresa y SEO estructurado: `src/data/site.ts`.
- Proceso: `src/data/processSections.ts`.
- Home/Servicios fase 1: `src/data/phase1Sections.ts`.
- Runtime: `Docker/node-static-server.mjs`.
- Orquestación local: `compose.yml`.

## Validación posterior a cambios

    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod

## Nota

Este documento es histórico. Para ejecutar el proyecto, usar `docs/RUNBOOK.md`.
