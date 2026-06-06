# Run Guide

GuÃ­a operativa para ejecutar IoCode SOLUTIONS Web en local.

## Requisitos

- Docker Desktop activo.
- PowerShell o terminal compatible.
- Node.js local es opcional.

## Entrar al proyecto

    cd C:\Users\diaz_\OneDrive\cursos\Programas\IoCode-WEB

## Desarrollo

Levantar entorno de desarrollo:

    docker compose up -d dev

Ver logs:

    docker compose logs -f dev

Abrir:

    http://localhost:4321/es/
    http://localhost:4321/en/
    http://localhost:4321/de/

Parar servicios:

    docker compose down --remove-orphans

## ValidaciÃ³n rÃ¡pida

    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod

Resultado esperado:

- `check`: 0 errores, 0 warnings, 0 hints.
- `build`: 29 pÃ¡ginas.
- `audit:prod`: 0 vulnerabilidades.

## QA completo

    docker compose run --rm qa

Este servicio ejecuta:

- versiÃ³n de Node.
- versiÃ³n de npm.
- `npm run qa`.
- `check`.
- `build`.
- `audit:prod`.

## Preview Astro

    docker compose --profile preview up --build preview

Abrir:

    http://localhost:4322/es/

## ProducciÃ³n local

    docker compose --profile prod up --build -d web

Comprobar healthcheck:

    curl.exe -I http://localhost:8080/health

Comprobar pÃ¡ginas principales:

    curl.exe -I http://localhost:8080/es/
    curl.exe -I http://localhost:8080/en/
    curl.exe -I http://localhost:8080/de/

Comprobar Proceso:

    curl.exe -I http://localhost:8080/es/proceso/
    curl.exe -I http://localhost:8080/en/process/
    curl.exe -I http://localhost:8080/de/prozess/

Comprobar sitemap:

    curl.exe -I http://localhost:8080/sitemap.xml

Comprobar 404 real:

    curl.exe -I http://localhost:8080/no-existe/

Comprobar redirect canÃ³nico:

    curl.exe -I http://localhost:8080/es/proceso

Resultado esperado:

- `/health`: 200.
- pÃ¡ginas vÃ¡lidas: 200.
- `/sitemap.xml`: 200.
- `/no-existe/`: 404.
- `/es/proceso`: 308 hacia `/es/proceso/`.

## VerificaciÃ³n de persona fÃ­sica en contacto

LinkedIn y GitHub personales deben aparecer solo en pÃ¡ginas de contacto.

Confirmar que aparecen en contacto:

    docker compose exec dev sh -lc "grep -Hn -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' dist/es/contacto/index.html dist/en/contact/index.html dist/de/kontakt/index.html"

Confirmar que no aparecen fuera de contacto:

    docker compose exec dev sh -lc "find dist -type f -name 'index.html' ! -path '*/contacto/*' ! -path '*/contact/*' ! -path '*/kontakt/*' -exec grep -Hn -e 'Diego' -e 'Diaz' -e 'dadd86' -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' {} + || true"

Resultado esperado del segundo comando:

- sin salida.

## VerificaciÃ³n de documentaciÃ³n

DespuÃ©s de Fase 1.1B:

    powershell -ExecutionPolicy Bypass -File tools\validate-docs-phase-1-1b.ps1

## Limpieza fuerte

Usar solo si necesitas borrar volÃºmenes de dependencias del proyecto:

    docker compose down -v --remove-orphans

En este proyecto no hay base de datos, pero `-v` elimina volÃºmenes Docker. Usarlo con criterio.

## Problemas frecuentes

### PowerShell no reconoce npm

No es necesario instalar npm en Windows si trabajas con Docker.

Usa:

    docker compose exec dev npm run check
    docker compose exec dev npm run build

### El contenedor web sigue mostrando una versiÃ³n vieja

Reconstruye:

    docker compose --profile prod up --build -d web

### La ruta sin slash no redirige

AsegÃºrate de que la imagen de producciÃ³n fue reconstruida despuÃ©s de modificar `Docker/node-static-server.mjs`.

### El contacto no abre correctamente

El formulario usa `mailto:`. Depende del cliente de correo del usuario y de que el email configurado exista.

### HSTS no aparece

Es correcto en local. No actives HSTS hasta tener HTTPS real.