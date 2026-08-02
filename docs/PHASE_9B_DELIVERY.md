# Entrega Fase 9B — UI, Astro, SEO e i18n

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| A | Matriz de implementación y gates 9.12–9.19 | Astro, SEO, responsive, accesibilidad y legal | ES, EN, DE | `src/`, `tests/e2e/phase-9b-production.spec.ts` y `tools/qa-phase-9b.mjs` | 2026-08-01 |

## Matriz

| ID | Estado | Evidencia |
|---|---|---|
| 9.12 | Implementado | Dominio exacto exigido en producción y gate anti-localhost |
| 9.13 | Implementado | 27 rutas comerciales, canonical único, ES/EN/DE/x-default recíprocos |
| 9.14 | Implementado | `sitemap-index.xml`, `sitemap.xml` y robots por entorno |
| 9.15 | Implementado | OG y Twitter completos, URL e imagen absolutas |
| 9.16 | Implementado | `SEARCH_CONSOLE_CHECKLIST.md` |
| 9.17 | Implementado y validado | CSS responsive, footer adaptable, menú nativo y test mailto/overflow en móvil, tablet y escritorio |
| 9.18 | Implementado y validado | lang, landmarks, foco, Axe WCAG 2.1 AA y reduced motion en Chromium y WebKit |
| 9.19 | Implementación técnica completa; datos externos pendientes | 6 rutas legales, footer permanente y gate de perfil legal |

Las 27 rutas comerciales originales permanecen estables. Se añaden seis rutas legales localizadas, dando 33 rutas indexables únicamente cuando el perfil legal está completo.

## Evidencia de validación local

- Astro check: 105 archivos, 0 errores, 0 advertencias y 0 hints.
- TypeScript de aplicación y tests: sin errores.
- Build de producción: 35 páginas HTML.
- Gate SEO estático: 27 rutas comerciales y 6 legales verificadas.
- Playwright: Chromium escritorio 35 tests, Chromium móvil 8, WebKit iPhone 8 y WebKit iPad 8; 59 ejecuciones superadas sin fallos. Los skips restantes corresponden a casos limitados deliberadamente por perfil.
- Axe: WCAG 2.1 A/AA, foco visible y movimiento reducido sin incumplimientos en las rutas representativas.
- Dependencias de producción: 0 vulnerabilidades reportadas.
- Validación documental y `git diff --check`: sin errores.

## Contrato legal de publicación

El repositorio no contiene calle ni código postal verificados. Producción exige `PUBLIC_LEGAL_APPROVED=true`, `PUBLIC_LEGAL_NAME`, `PUBLIC_LEGAL_STREET`, `PUBLIC_LEGAL_POSTAL_CODE`, `PUBLIC_LEGAL_CITY`, `PUBLIC_LEGAL_COUNTRY` y `PUBLIC_LEGAL_EMAIL`. Si falta alguno, las páginas legales emiten `noindex`, muestran estado draft y `qa-production-config.mjs` falla. No se inventan datos ni se declara asesoramiento jurídico.

La estructura se basa en la identificación exigida por [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html) y la información al interesado de [artículo 13 RGPD](https://eur-lex.europa.eu/eli/reg/2016/679/2016-05-04/eng). El propietario debe validar contenido, actividad, registros, identificación fiscal, autoridad competente y plazos reales antes de publicación.

## Comandos de aceptación

```powershell
npm ci
$env:PUBLIC_DEPLOY_ENV = "production"
$env:PUBLIC_SITE_URL = "https://iocode-solutions.com"
$env:PUBLIC_LEGAL_APPROVED = "true"
$env:PUBLIC_LEGAL_NAME = "<nombre aprobado>"
$env:PUBLIC_LEGAL_STREET = "<calle y número>"
$env:PUBLIC_LEGAL_POSTAL_CODE = "<código postal>"
$env:PUBLIC_LEGAL_CITY = "Aachen"
$env:PUBLIC_LEGAL_COUNTRY = "Germany"
$env:PUBLIC_LEGAL_EMAIL = "contact@iocode-solutions.com"
npm run check
npm run internal:typecheck:src
npm run build
npm run internal:qa:config:prod
npm run internal:qa:phase-9b:static
npm run internal:qa:phase-9b:e2e
npm run internal:qa:lighthouse:6
```

```powershell
curl.exe -I http://localhost:8080/sitemap-index.xml
curl.exe -I http://localhost:8080/sitemap.xml
curl.exe -I http://localhost:8080/robots.txt
```

## Criterio de cierre

9B solo puede declararse validada al 100 % cuando: los datos legales estén aprobados, Astro check/build pasen, el reporte estático confirme 27+6 rutas, Playwright/Axe pase en cuatro perfiles, Lighthouse cumpla los presupuestos y el árbol contenga exclusivamente cambios revisados de 9A/9B.
