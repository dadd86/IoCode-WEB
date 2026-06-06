# Architecture

Arquitectura actual de IoCode SOLUTIONS Web.

## Tipo de aplicaciÃ³n

Sitio estÃ¡tico multilingÃ¼e generado con Astro.

No hay backend propio, base de datos, autenticaciÃ³n ni API de aplicaciÃ³n en esta fase.

## Capas

## 1. Contenido y configuraciÃ³n

- `src/data/site.ts`: entidad empresarial, contacto, servicios, schema y datos SEO.
- `src/data/pageContent.ts`: contenido base por ruta e idioma.
- `src/data/phase1Sections.ts`: secciones CEO/SEO/AI de Home y Servicios.
- `src/data/processSections.ts`: contenido especializado de la pÃ¡gina Proceso.
- `src/data/projects.ts`: proyectos y casos.
- `src/data/skills.ts`: habilidades.

## 2. InternacionalizaciÃ³n

- `src/i18n/config.ts`: locales soportados.
- `src/i18n/routes.ts`: rutas localizadas.
- `src/i18n/ui.ts`: textos de interfaz.

Locales actuales:

- `es`.
- `en`.
- `de`.

## 3. Rendering

- `src/pages/[locale]/[...slug].astro`: renderiza pÃ¡ginas localizadas.
- `src/pages/index.astro`: entrada raÃ­z.
- `src/pages/404.astro`: error estÃ¡tico.
- `src/pages/sitemap.xml.ts`: sitemap XML avanzado.

## 4. Layout y componentes

- `src/layouts/BaseLayout.astro`: HTML base, SEO, schema, header y footer.
- `src/components/Header.astro`: navegaciÃ³n.
- `src/components/Navigation.astro`: rutas principales.
- `src/components/LanguageSwitcher.astro`: alternancia de idiomas.
- `src/components/BusinessValueSections.astro`: secciones CEO/SEO.
- `src/components/ProcessMethod.astro`: pÃ¡gina Proceso.
- `src/components/ContactForm.astro`: contacto estÃ¡tico con `mailto`.
- `src/components/Hero3D.astro`: escena 3D y fallback.

## 5. Estilos

- `src/assets/global.css`.
- `src/assets/components.css`.

## 6. Build

Astro genera `dist/`.

Comando:

    docker compose exec dev npm run build

## 7. Runtime local de producciÃ³n

- `Docker/Dockerfile`: build multi-stage.
- `Docker/node-static-server.mjs`: servidor estÃ¡tico Node.
- servicio `web` en `compose.yml`.

## Rutas principales

EspaÃ±ol:

- `/es/`
- `/es/servicios/`
- `/es/automatizacion-plc/`
- `/es/robotica-industrial/`
- `/es/empresa/`
- `/es/proyectos/`
- `/es/habilidades/`
- `/es/proceso/`
- `/es/contacto/`

InglÃ©s:

- `/en/`
- `/en/services/`
- `/en/plc-automation/`
- `/en/industrial-robotics/`
- `/en/company/`
- `/en/projects/`
- `/en/skills/`
- `/en/process/`
- `/en/contact/`

AlemÃ¡n:

- `/de/`
- `/de/leistungen/`
- `/de/sps-automatisierung/`
- `/de/industrierobotik/`
- `/de/unternehmen/`
- `/de/projekte/`
- `/de/faehigkeiten/`
- `/de/prozess/`
- `/de/kontakt/`

## SEO y AI

Implementado:

- canonical.
- hreflang HTML.
- sitemap con alternates.
- sitemap con lastmod.
- robots.
- metadata Open Graph.
- Twitter summary card.
- JSON-LD con Organization, ProfessionalService, ContactPoint, OfferCatalog, BreadcrumbList y WebPage.
- Person solo en pÃ¡ginas de contacto.

## Seguridad

Implementado en runtime local:

- headers HTTP avanzados.
- 404 real.
- redirect 308 para rutas canÃ³nicas.
- cache control diferenciado.
- ETag y Last-Modified.
- contenedor no root.
- filesystem read-only.

## Decisiones arquitectÃ³nicas

- Static-first: reduce superficie de backend.
- Docker-first: evita depender de Node/npm local en Windows.
- MultilingÃ¼e por rutas: mejora claridad SEO y mantenimiento.
- Contacto por `mailto`: evita almacenar datos personales en esta fase.
- Persona fÃ­sica solo en contacto: equilibrio entre marca empresarial y confianza.

## LÃ­mites actuales

- No hay CMS.
- No hay backend para formularios.
- No hay analytics.
- No hay Lighthouse documentado.
- No hay pruebas Playwright.
- HSTS no activado por defecto.