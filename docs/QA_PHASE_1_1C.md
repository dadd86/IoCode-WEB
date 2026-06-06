# Fase 1.1C - QA visual, accesibilidad y Lighthouse

## Objetivo

Validar que la web no solo compila, sino que tambiÃ©n conserva calidad visual, semÃ¡ntica, accesibilidad bÃ¡sica, SEO renderizado y rendimiento mÃ­nimo medible.

## Alcance

PÃ¡ginas crÃ­ticas:

- `/es/`, `/en/`, `/de/`
- `/es/servicios/`, `/en/services/`, `/de/leistungen/`
- `/es/proceso/`, `/en/process/`, `/de/prozess/`
- `/es/contacto/`, `/en/contact/`, `/de/kontakt/`

## Capas de validaciÃ³n

1. `astro check`.
2. `astro build`.
3. `audit:prod`.
4. QA estÃ¡tico sobre `dist`.
5. Smoke test HTTP sobre producciÃ³n local.
6. Playwright desktop y mÃ³vil.
7. Axe para violaciones crÃ­ticas/serias.
8. Lighthouse con umbrales conservadores.

## Ejecutar

    powershell -ExecutionPolicy Bypass -File tools\validate-phase-1-1c.ps1

## Umbrales Lighthouse iniciales

- performance: 0.50
- accessibility: 0.90
- best-practices: 0.85
- seo: 0.90

Estos umbrales son conservadores porque la web incluye escena 3D. Se pueden endurecer despuÃ©s de optimizar assets, JS y carga del modelo GLB.

## Criterios de cierre

- `check`: 0 errores.
- `build`: 29 pÃ¡ginas.
- `audit:prod`: 0 vulnerabilidades.
- QA estÃ¡tico sin errores.
- Playwright sin errores.
- Axe sin violaciones crÃ­ticas o serias.
- Lighthouse por encima de umbrales.
- Smoke test correcto.
- Contacto muestra persona fÃ­sica solo en pÃ¡ginas de contacto.
- Sin overflow horizontal detectado en rutas crÃ­ticas.
- Un solo h1 por pÃ¡gina.

## Pendiente manual

Aunque esta fase automatiza una parte importante, antes de publicar siguen siendo necesarias:

- revisiÃ³n visual humana en navegador real;
- revisiÃ³n mÃ³vil real;
- prueba de formulario con cliente de correo;
- revisiÃ³n de consola DevTools;
- Lighthouse en dominio pÃºblico;
- validaciÃ³n de correo real;
- Search Console tras publicaciÃ³n.