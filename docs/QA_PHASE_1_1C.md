# Fase 1.1C - QA visual, accesibilidad y Lighthouse

## Objetivo

Validar que la web no solo compila, sino que también conserva calidad visual, semántica, accesibilidad básica, SEO renderizado y rendimiento mínimo medible.

## Alcance

Páginas críticas:

- `/es/`, `/en/`, `/de/`
- `/es/servicios/`, `/en/services/`, `/de/leistungen/`
- `/es/proceso/`, `/en/process/`, `/de/prozess/`
- `/es/contacto/`, `/en/contact/`, `/de/kontakt/`

## Capas de validación

1. `astro check`.
2. `astro build`.
3. `audit:prod`.
4. QA estático sobre `dist`.
5. Smoke test HTTP sobre producción local.
6. Playwright desktop y móvil.
7. Axe para violaciones críticas/serias.
8. Lighthouse con umbrales conservadores.

## Ejecutar

    powershell -ExecutionPolicy Bypass -File tools\validate-phase-1-1c.ps1

## Umbrales Lighthouse iniciales

- performance: 0.50
- accessibility: 0.90
- best-practices: 0.85
- seo: 0.90

Estos umbrales son conservadores porque la web incluye escena 3D. Se pueden endurecer después de optimizar assets, JS y carga del modelo GLB.

## Criterios de cierre

- `check`: 0 errores.
- `build`: 29 páginas.
- `audit:prod`: 0 vulnerabilidades.
- QA estático sin errores.
- Playwright sin errores.
- Axe sin violaciones críticas o serias.
- Lighthouse por encima de umbrales.
- Smoke test correcto.
- Contacto muestra persona física solo en páginas de contacto.
- Sin overflow horizontal detectado en rutas críticas.
- Un solo h1 por página.

## Pendiente manual

Aunque esta fase automatiza una parte importante, antes de publicar siguen siendo necesarias:

- revisión visual humana en navegador real;
- revisión móvil real;
- prueba de formulario con cliente de correo;
- revisión de consola DevTools;
- Lighthouse en dominio público;
- validación de correo real;
- Search Console tras publicación.