# Run Guide

Guía operativa para ejecutar IoCode SOLUTIONS Web en local.

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

## Validación rápida

    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod

Resultado esperado:

- `check`: 0 errores, 0 warnings, 0 hints.
- `build`: 29 páginas.
- `audit:prod`: 0 vulnerabilidades.

## QA completo

    docker compose run --rm qa

Este servicio ejecuta:

- versión de Node.
- versión de npm.
- `npm run qa`.
- `check`.
- `build`.
- `audit:prod`.

## Preview Astro

    docker compose --profile preview up --build preview

Abrir:

    http://localhost:4322/es/

## Producción local

    docker compose --profile prod up --build -d web

Comprobar healthcheck:

    curl.exe -I http://localhost:8080/health

Comprobar páginas principales:

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

Comprobar redirect canónico:

    curl.exe -I http://localhost:8080/es/proceso

Resultado esperado:

- `/health`: 200.
- páginas válidas: 200.
- `/sitemap.xml`: 200.
- `/no-existe/`: 404.
- `/es/proceso`: 308 hacia `/es/proceso/`.

## Verificación de persona física en contacto

LinkedIn y GitHub personales deben aparecer solo en páginas de contacto.

Confirmar que aparecen en contacto:

    docker compose exec dev sh -lc "grep -Hn -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' dist/es/contacto/index.html dist/en/contact/index.html dist/de/kontakt/index.html"

Confirmar que no aparecen fuera de contacto:

    docker compose exec dev sh -lc "find dist -type f -name 'index.html' ! -path '*/contacto/*' ! -path '*/contact/*' ! -path '*/kontakt/*' -exec grep -Hn -e 'Diego' -e 'Diaz' -e 'dadd86' -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' {} + || true"

Resultado esperado del segundo comando:

- sin salida.

## Verificación de documentación

Después de Fase 1.1B:

    powershell -ExecutionPolicy Bypass -File tools\validate-docs-phase-1-1b.ps1

## Limpieza fuerte

Usar solo si necesitas borrar volúmenes de dependencias del proyecto:

    docker compose down -v --remove-orphans

En este proyecto no hay base de datos, pero `-v` elimina volúmenes Docker. Usarlo con criterio.

## Problemas frecuentes

### PowerShell no reconoce npm

No es necesario instalar npm en Windows si trabajas con Docker.

Usa:

    docker compose exec dev npm run check
    docker compose exec dev npm run build

### El contenedor web sigue mostrando una versión vieja

Reconstruye:

    docker compose --profile prod up --build -d web

### La ruta sin slash no redirige

Asegúrate de que la imagen de producción fue reconstruida después de modificar `Docker/node-static-server.mjs`.

### El contacto no abre correctamente

El formulario usa `mailto:`. Depende del cliente de correo del usuario y de que el email configurado exista.

### HSTS no aparece

Es correcto en local. No actives HSTS hasta tener HTTPS real.

### Ejecutar Fase 6

```powershell
docker compose --profile prod --profile qa down --remove-orphans
docker image rm iocode-solutions-performance-qa:latest -f
docker image rm iocode-solutions-web:latest -f
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down

## TypeScript y VS Code

Este proyecto se valida en Docker. No se debe ejecutar `npm install`, `npm run build`, `npm run check` ni Playwright directamente en Windows host.

Si VS Code muestra errores como:

- `Cannot find name HTMLElement`
- `Cannot find module three`
- `Cannot find type definition file for node`
- `File node_modules/typescript/lib/lib.es2025.full.d.ts not found`

significa que el editor está usando el TypeScript del host o que `node_modules` fue eliminado del host.

Corrección:

1. Abrir el proyecto con `Dev Containers: Reopen in Container`.
2. Validar con comandos Docker:
   ```sh
   docker compose run --rm --no-deps dev sh -lc "npm run check"
   docker compose --profile prod --profile qa run --rm performance-qa



   docker compose --profile prod --profile qa up -d web

   ## Docker Compose — Modos de ejecución

Este proyecto está completamente dockerizado. No se debe ejecutar `npm install`, `npm run dev`, `npm run build` ni Playwright directamente en Windows host.

### Desarrollo local

Arranca solo el contenedor de desarrollo:

```sh
docker compose up -d

Logs:

docker compose logs -f dev

URL:

http://localhost:4321/

Parar:

docker compose down
Producción local

Arranca el servidor estático productivo:

docker compose --profile prod up -d web

URL:

http://localhost:8080/

Logs:

docker compose --profile prod logs -f web

Parar:

docker compose --profile prod down --remove-orphans

## Puertos locales

### Desarrollo Astro
iocode-solutions-dev -> 4321
iocode-solutions-web -> 8080

Para diseño en vivo:

docker compose --profile prod down --remove-orphans
docker compose up -d dev

Abres:

http://localhost:4321/es/

Para producción local:

docker compose down --remove-orphans
docker compose --profile prod up -d web

Abres:

http://localhost:8080/es/

Así evitas confusión de puertos.

## Importante: reconstruir QA después de cambios

Después de modificar código, CSS, scripts, tests o configuración de Fase 6, no basta con ejecutar:

```sh
docker compose --profile prod --profile qa run --rm performance-qa

Primero hay que reconstruir las imágenes:

docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down --remove-orphans

Si no se reconstruye, Docker puede ejecutar una imagen antigua y mostrar resultados que no corresponden al código actual.

Para revisar la web en desarrollo después de apagar QA:

docker compose up -d dev
docker compose logs -f dev

URL de desarrollo:

http://localhost:4321/es/

URL de producción local:

http://localhost:8080/es/

---

# 11. Validación obligatoria final

Después de aplicar las correcciones:

```powershell
docker compose up -d dev
docker compose exec dev npm run check
docker compose exec dev npm run build