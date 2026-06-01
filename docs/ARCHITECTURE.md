# Arquitectura

## Decision

El proyecto usa Astro para generar HTML estatico con rutas reales por idioma, componentes reutilizables y JavaScript solo donde es necesario.

## Estructura

```text
src/
├── assets
├── components
├── data
├── i18n
├── layouts
├── pages
└── scripts
```

## Layout comun

`BaseLayout.astro` centraliza HTML, metadatos, canonical, hreflang, header, footer y slot de contenido.

## Rutas

`src/pages/[locale]/[...slug].astro` genera todas las paginas estaticas con `getStaticPaths()`.

## I18N

`src/i18n/routes.ts` contiene `routeAlternates`, la tabla unica de rutas equivalentes y slugs traducidos.

## Componentes

- `Header.astro`
- `Navigation.astro`
- `LanguageSwitcher.astro`
- `Footer.astro`
- `Button.astro`
- `Hero3D.astro`
- `ProjectCard.astro`
- `SkillCard.astro`

## No duplicacion

No se copia el menu en cada pagina. Se define una vez en datos y se renderiza con componentes.
