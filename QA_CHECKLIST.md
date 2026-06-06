# QA Checklist

Checklist de validaciÃ³n para IoCode SOLUTIONS Web.

## Estado actual

Fases cerradas tÃ©cnicamente:

- Fase 0.
- Fase 1.
- Fase 1.1A.

Fase actual:

- Fase 1.1B: documentaciÃ³n y runbooks.

## Gate tÃ©cnico obligatorio

Ejecutar:

    docker compose up -d dev
    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod
    docker compose --profile prod up --build -d web

Criterio:

- `check`: 0 errores, 0 warnings, 0 hints.
- `build`: 29 pÃ¡ginas.
- `audit:prod`: 0 vulnerabilidades.
- imagen web construida.
- contenedor web iniciado.

## Smoke test HTTP

    curl.exe -I http://localhost:8080/health
    curl.exe -I http://localhost:8080/es/
    curl.exe -I http://localhost:8080/en/
    curl.exe -I http://localhost:8080/de/
    curl.exe -I http://localhost:8080/es/servicios/
    curl.exe -I http://localhost:8080/en/services/
    curl.exe -I http://localhost:8080/de/leistungen/
    curl.exe -I http://localhost:8080/es/proceso/
    curl.exe -I http://localhost:8080/en/process/
    curl.exe -I http://localhost:8080/de/prozess/
    curl.exe -I http://localhost:8080/es/contacto/
    curl.exe -I http://localhost:8080/en/contact/
    curl.exe -I http://localhost:8080/de/kontakt/
    curl.exe -I http://localhost:8080/sitemap.xml
    curl.exe -I http://localhost:8080/robots.txt
    curl.exe -I http://localhost:8080/no-existe/

Esperado:

- pÃ¡ginas vÃ¡lidas: 200.
- sitemap: 200.
- robots: 200.
- health: 200.
- ruta inexistente: 404.

## Redirect canÃ³nico

    curl.exe -I http://localhost:8080/es/proceso

Esperado:

- 308.
- Location hacia `/es/proceso/`.

## Headers HTTP

Validar:

    curl.exe -I http://localhost:8080/es/proceso/

Deben aparecer:

- `Content-Security-Policy`.
- `X-Content-Type-Options`.
- `X-Frame-Options`.
- `Referrer-Policy`.
- `Permissions-Policy`.
- `Cross-Origin-Opener-Policy`.
- `Cross-Origin-Resource-Policy`.
- `ETag`.
- `Last-Modified`.

## SEO tÃ©cnico

Validar sitemap:

    docker compose exec dev sh -lc "grep -n -e 'xhtml:link' -e 'hreflang' -e 'lastmod' -e 'x-default' dist/sitemap.xml | head -40"

Validar schema:

    docker compose exec dev sh -lc "grep -n -e 'BreadcrumbList' -e 'OfferCatalog' -e 'ContactPoint' -e 'ProfessionalService' -e 'Organization' dist/es/proceso/index.html | head -20"

## Persona fÃ­sica solo en contacto

Debe aparecer en contacto:

    docker compose exec dev sh -lc "grep -Hn -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' dist/es/contacto/index.html dist/en/contact/index.html dist/de/kontakt/index.html"

No debe aparecer fuera de contacto:

    docker compose exec dev sh -lc "find dist -type f -name 'index.html' ! -path '*/contacto/*' ! -path '*/contact/*' ! -path '*/kontakt/*' -exec grep -Hn -e 'Diego' -e 'Diaz' -e 'dadd86' -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' {} + || true"

Esperado:

- primer comando: coincidencias en las 3 pÃ¡ginas de contacto.
- segundo comando: sin salida.

## Checklist visual manual

Pendiente antes de publicaciÃ³n real:

- Home ES/EN/DE en desktop.
- Home ES/EN/DE en mÃ³vil.
- Servicios ES/EN/DE.
- Proceso ES/EN/DE.
- Contacto ES/EN/DE.
- MenÃº responsive.
- Language switcher.
- Formulario.
- CTA visibles.
- Sin overflow horizontal.
- Sin errores de consola.
- Escena 3D con fallback si falla.

## Accesibilidad mÃ­nima

Pendiente de validaciÃ³n manual:

- navegaciÃ³n por teclado.
- foco visible.
- contraste suficiente.
- labels de formulario.
- orden lÃ³gico de encabezados.
- tamaÃ±o de targets en mÃ³vil.
- texto alternativo de logos e imÃ¡genes.
- reduced motion para animaciÃ³n o 3D si aplica.

## Performance

Pendiente antes de producciÃ³n real:

- Lighthouse mobile.
- Lighthouse desktop.
- peso JS.
- carga del modelo GLB.
- Core Web Vitals en entorno real.
- comportamiento en mÃ³vil de gama media.

## No-go

No avanzar a publicaciÃ³n real si:

- falla `check`, `build` o `audit:prod`.
- hay rutas 404 inesperadas.
- `/no-existe/` no responde 404.
- el correo de contacto no existe.
- hay secretos en el repositorio.
- aparecen datos personales fuera de contacto.
- la documentaciÃ³n vuelve a contener comandos obsoletos.