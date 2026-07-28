# Architecture

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Arquitectura implementada y magnitudes del build | Astro, i18n, 3D, Docker y runtime HTTP | ES, EN, DE | Fuente del repositorio y build Docker de R0 | 2026-07-28 |

Arquitectura actual de IoCode SOLUTIONS Web.

## Tipo de aplicación

Sitio estático multilingüe generado con Astro.

No hay backend propio, base de datos, autenticación ni API de aplicación en esta fase.

## Capas

## 1. Contenido y configuración

- `src/data/site.ts`: entidad empresarial, contacto, servicios, schema y datos SEO.
- `src/data/pageContent.ts`: contenido base por ruta e idioma.
- `src/data/phase1Sections.ts`: secciones CEO/SEO/AI de Home y Servicios.
- `src/data/processSections.ts`: contenido especializado de la página Proceso.
- `src/data/projects.ts`: proyectos y casos.
- `src/data/skills.ts`: habilidades.

## 2. Internacionalización

- `src/i18n/config.ts`: locales soportados.
- `src/i18n/routes.ts`: rutas localizadas.
- `src/i18n/ui.ts`: textos de interfaz.

Locales actuales:

- `es`.
- `en`.
- `de`.

## 3. Rendering

- `src/pages/[locale]/[...slug].astro`: renderiza páginas localizadas.
- `src/pages/index.astro`: entrada raíz.
- `src/pages/404.astro`: error estático.
- `src/pages/sitemap.xml.ts`: sitemap XML avanzado.

## 4. Layout y componentes

- `src/layouts/BaseLayout.astro`: HTML base, SEO, schema, header y footer.
- `src/components/Header.astro`: navegación.
- `src/components/Navigation.astro`: rutas principales.
- `src/components/LanguageSwitcher.astro`: alternancia de idiomas.
- `src/components/BusinessValueSections.astro`: secciones CEO/SEO.
- `src/components/ProcessMethod.astro`: página Proceso.
- `src/components/ContactForm.astro`: contacto estático con `mailto`.
- `src/components/Hero3D.astro`: escena 3D y fallback.

## 5. Estilos

- `src/assets/global.css`.
- `src/assets/components.css`.

## 6. Build

Astro genera `dist/`.

Comando:

    docker compose exec dev npm run build

## 7. Runtime local de producción

- `Docker/Dockerfile`: build multi-stage.
- `Docker/node-static-server.mjs`: servidor estático Node.
- servicio `web` en `compose.yml`.

## Rutas principales

La fuente `src/i18n/routes.ts` declara exactamente **9 claves de ruta**. Cada clave tiene una variante en los 3 locales, por lo que existen **27 rutas localizadas**. El build comprobado genera **29 páginas HTML**: las 27 localizadas, la entrada raíz y la página 404.

Español:

- `/es/`
- `/es/servicios/`
- `/es/automatizacion-plc/`
- `/es/robotica-industrial/`
- `/es/empresa/`
- `/es/proyectos/`
- `/es/habilidades/`
- `/es/proceso/`
- `/es/contacto/`

Inglés:

- `/en/`
- `/en/services/`
- `/en/plc-automation/`
- `/en/industrial-robotics/`
- `/en/company/`
- `/en/projects/`
- `/en/skills/`
- `/en/process/`
- `/en/contact/`

Alemán:

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
- Person solo en páginas de contacto.

## Seguridad

Implementado en runtime local:

- headers HTTP avanzados.
- 404 real.
- redirect 308 para rutas canónicas.
- cache control diferenciado.
- ETag y Last-Modified.
- contenedor no root.
- filesystem read-only.

## Decisiones arquitectónicas

- Static-first: reduce superficie de backend.
- Docker-first: evita depender de Node/npm local en Windows.
- Multilingüe por rutas: mejora claridad SEO y mantenimiento.
- Contacto por `mailto`: evita almacenar datos personales en esta fase.
- Persona física solo en contacto: equilibrio entre marca empresarial y confianza.

Las decisiones estables se registran en [adr/](adr/); el código y las pruebas siguen siendo la fuente ejecutable.

## Límites actuales

- No hay CMS.
- No hay backend para formularios.
- No hay analytics.
- Lighthouse y Playwright existen como validación local de laboratorio; no aportan métricas de campo ni una prueba de dispositivo físico.
- HSTS no activado por defecto.
