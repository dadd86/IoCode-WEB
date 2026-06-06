$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  $directory = Split-Path -Parent $Path

  if ($directory -and -not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

Write-Utf8NoBom "README.md" @'
# IoCode SOLUTIONS Web

Sitio web estático y multilingüe de IoCode SOLUTIONS.

El proyecto usa Astro, TypeScript, Three.js y Docker Compose. La web está orientada a automatización industrial, PLC, robótica, software industrial, datos e Industria 4.0.

## Estado validado localmente

Última fase validada: Fase 1.1A.

Estado comprobado por terminal:

- `npm run check` dentro del contenedor: 0 errores, 0 warnings, 0 hints.
- `npm run build` dentro del contenedor: 29 páginas generadas.
- `npm run audit:prod`: 0 vulnerabilidades de producción.
- Imagen Docker de producción construida correctamente.
- Contenedor `web` iniciado correctamente.
- `/health`: 200 OK.
- `/es/proceso/`, `/en/process/`, `/de/prozess/`: 200 OK.
- `/sitemap.xml`: 200 OK.
- `/no-existe/`: 404 Not Found.
- Rutas sin slash final redirigen con 308.
- Headers HTTP avanzados activos en el servidor estático local.

No se afirma posicionamiento real en Google ni rendimiento Lighthouse todavía. Eso requiere publicación, medición y Search Console.

## Stack

- Astro 6.
- TypeScript.
- Three.js para escena 3D.
- Docker Compose.
- Node.js Alpine para desarrollo y runtime local.
- Sitio estático generado en `dist/`.
- Servidor estático Node en `Docker/node-static-server.mjs`.

## Estructura principal

- `src/`: código fuente Astro, componentes, datos e i18n.
- `src/data/`: contenidos y configuración semántica.
- `src/i18n/`: rutas, locales y UI strings.
- `src/pages/`: páginas Astro y sitemap.
- `src/components/`: componentes visuales y funcionales.
- `src/assets/`: CSS global y componentes.
- `public/`: assets públicos servidos como raíz del sitio.
- `Docker/`: Dockerfiles y servidor estático.
- `docs/`: documentación técnica.
- `compose.yml`: definición actual de servicios Docker.
- `.env.example`: variables locales no sensibles.

## Requisitos

Recomendado:

- Docker Desktop.
- PowerShell en Windows.
- VS Code opcional.
- Node.js local no es obligatorio si trabajas con Docker.

## Inicio rápido con Docker

Desde la raíz del proyecto:

    docker compose up -d dev

Abrir:

    http://localhost:4321/es/
    http://localhost:4321/en/
    http://localhost:4321/de/

## QA local

Desde la raíz:

    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod

O usando el servicio QA:

    docker compose run --rm qa

## Producción local

Construir y levantar producción local:

    docker compose --profile prod up --build -d web

Comprobar:

    curl.exe -I http://localhost:8080/health
    curl.exe -I http://localhost:8080/es/
    curl.exe -I http://localhost:8080/en/
    curl.exe -I http://localhost:8080/de/
    curl.exe -I http://localhost:8080/sitemap.xml
    curl.exe -I http://localhost:8080/no-existe/

Resultados esperados:

- `/health`: 200.
- páginas principales: 200.
- `/sitemap.xml`: 200.
- ruta inexistente: 404.
- ruta sin slash final: 308 hacia la versión con slash.

## Servicios Docker

- `dev`: Astro dev server en puerto 4321.
- `qa`: ejecuta check, build y audit de producción.
- `preview`: build + Astro preview en puerto 4322.
- `web`: runtime estático de producción local en puerto 8080.

## Variables locales

Archivo de ejemplo:

    .env.example

Variables soportadas:

- `ASTRO_DEV_PORT`: puerto local de desarrollo. Por defecto 4321.
- `ASTRO_PREVIEW_PORT`: puerto local de preview. Por defecto 4322.
- `WEB_PORT`: puerto local de producción. Por defecto 8080.
- `ASTRO_TELEMETRY_DISABLED`: desactiva telemetría de Astro.
- `ENABLE_HSTS`: activar solo en despliegue HTTPS real.
- `ENABLE_UPGRADE_INSECURE_REQUESTS`: activar solo en despliegue HTTPS real.

No guardes secretos reales en archivos versionados.

## Seguridad HTTP local

El servidor estático incluye:

- `Content-Security-Policy`.
- `X-Content-Type-Options`.
- `X-Frame-Options`.
- `Referrer-Policy`.
- `Permissions-Policy`.
- `Cross-Origin-Opener-Policy`.
- `Cross-Origin-Resource-Policy`.
- `ETag`.
- `Last-Modified`.
- cache diferenciado para HTML, sitemap, health y assets.
- redirect 308 para rutas canónicas con slash final.

HSTS está desactivado por defecto. No lo actives hasta verificar HTTPS real en el dominio final.

## SEO técnico

Implementado:

- páginas estáticas indexables.
- rutas ES/EN/DE.
- canonical.
- hreflang HTML.
- sitemap XML con hreflang y lastmod.
- robots.txt.
- schema `Organization`.
- schema `ProfessionalService`.
- schema `ContactPoint`.
- schema `OfferCatalog`.
- schema `BreadcrumbList`.
- schema `Person` solo en páginas de contacto.

No se garantiza ranking. La indexación real debe comprobarse con Google Search Console después de publicar.

## Contacto

El formulario es estático y usa `mailto:`. No envía datos a un backend.

Antes de publicar, confirma que el correo configurado en `src/data/site.ts` existe y recibe mensajes.

## Documentación relacionada

- `RUN_GUIDE.md`: guía de ejecución.
- `SECURITY.md`: modelo de seguridad y límites.
- `QA_CHECKLIST.md`: checklist de validación.
- `Docker/README.md`: uso de servicios Docker.
- `Docker/OPERATIONS.md`: runbook operativo.
- `docs/ARCHITECTURE.md`: arquitectura.
- `docs/MAINTENANCE.md`: mantenimiento.
- `docs/I18N.md`: internacionalización.
- `docs/PROJECT_SELECTION.md`: criterios de proyectos.

## No hacer

- No usar comandos antiguos con archivos compose dentro de la carpeta Docker.
- No depender de archivos env dentro de la carpeta Docker.
- No ejecutar `npm audit fix --force` sin revisar impacto.
- No publicar ZIPs con `.git`, `node_modules`, `.astro` o `dist`.
- No afirmar producción real sin validar dominio, HTTPS, Search Console, Lighthouse y correo.
'@

Write-Utf8NoBom "RUN_GUIDE.md" @'
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
'@

Write-Utf8NoBom "Docker/README.md" @'
# Docker

Documentación de Docker para IoCode SOLUTIONS Web.

## Servicios

El archivo actual de orquestación está en la raíz del proyecto:

    compose.yml

Servicios definidos:

- `dev`: servidor de desarrollo Astro.
- `qa`: validación automatizada local.
- `preview`: build + Astro preview.
- `web`: producción local con servidor estático Node.

## Desarrollo

    docker compose up -d dev

URL:

    http://localhost:4321/es/

## QA

    docker compose run --rm qa

Ejecuta:

- `npm run check`.
- `npm run build`.
- `npm run audit:prod`.

## Preview

    docker compose --profile preview up --build preview

URL:

    http://localhost:4322/es/

## Producción local

    docker compose --profile prod up --build -d web

URL:

    http://localhost:8080/es/

Healthcheck:

    http://localhost:8080/health

## Volúmenes

- `iocode_node_modules`: dependencias dentro de Docker.
- `iocode_astro_cache`: caché de Astro.

## Puertos

- desarrollo: 4321 por defecto.
- preview: 4322 por defecto.
- producción local: 8080 por defecto.

Se pueden sobrescribir con `.env` local no versionado o variables de entorno.

## Seguridad del contenedor web

El servicio `web` usa:

- usuario no root en runtime.
- filesystem read-only.
- `tmpfs` para `/tmp`.
- `no-new-privileges`.
- `cap_drop: ALL`.
- healthcheck HTTP.
- servidor estático con cabeceras de seguridad.

## HSTS

Variables disponibles:

- `ENABLE_HSTS`.
- `ENABLE_UPGRADE_INSECURE_REQUESTS`.

Mantener en `false` en local. Activar solo cuando el dominio final funcione por HTTPS.

## Build pipeline

El Dockerfile de producción ejecuta:

- instalación determinista con `npm ci`.
- `npm run check`.
- `npm run build`.
- copia de `dist` al runtime.
- arranque de `Docker/node-static-server.mjs`.

Si `check` o `build` fallan, la imagen de producción no se construye.

## No-go operativo

No publicar si:

- `npm run check` falla.
- `npm run build` falla.
- `npm run audit:prod` reporta vulnerabilidades.
- `/health` no responde 200.
- `/no-existe/` no responde 404.
- rutas sin slash no redirigen con 308.
- el correo de contacto no existe.
'@

Write-Utf8NoBom "Docker/OPERATIONS.md" @'
# Operations Runbook

Runbook operativo para producción local y validación de release.

## Levantar desarrollo

    docker compose up -d dev

Logs:

    docker compose logs -f dev

## Ejecutar QA

    docker compose run --rm qa

## Levantar producción local

    docker compose --profile prod up --build -d web

## Healthcheck

    curl.exe -I http://localhost:8080/health

Esperado:

- 200 OK.
- `Cache-Control: no-store`.
- JSON `{"status":"ok"}` en petición GET.

## Smoke tests

    curl.exe -I http://localhost:8080/es/
    curl.exe -I http://localhost:8080/en/
    curl.exe -I http://localhost:8080/de/
    curl.exe -I http://localhost:8080/es/proceso/
    curl.exe -I http://localhost:8080/en/process/
    curl.exe -I http://localhost:8080/de/prozess/
    curl.exe -I http://localhost:8080/sitemap.xml
    curl.exe -I http://localhost:8080/robots.txt
    curl.exe -I http://localhost:8080/no-existe/
    curl.exe -I http://localhost:8080/es/proceso

Esperado:

- páginas válidas: 200.
- sitemap y robots: 200.
- ruta inexistente: 404.
- ruta sin slash: 308.

## Revisar headers

    curl.exe -I http://localhost:8080/es/proceso/

Headers esperados:

- `Content-Security-Policy`.
- `X-Content-Type-Options: nosniff`.
- `X-Frame-Options: DENY`.
- `Referrer-Policy`.
- `Permissions-Policy`.
- `Cross-Origin-Opener-Policy`.
- `Cross-Origin-Resource-Policy`.
- `ETag`.
- `Last-Modified`.

## Logs de producción

    docker compose logs --tail=100 web

## Estado de contenedores

    docker compose ps

## Apagar producción local

    docker compose --profile prod down

## Reconstrucción limpia

    docker compose --profile prod build --no-cache web
    docker compose --profile prod up -d web

## Limpieza de volúmenes

Solo si se necesita reiniciar dependencias del entorno:

    docker compose down -v --remove-orphans

## Activación de HSTS

No activar en local.

Condiciones mínimas para activarlo:

- dominio final configurado.
- HTTPS real funcionando.
- redirección HTTP a HTTPS validada por hosting o proxy.
- no hay subdominios sin HTTPS si se usa `includeSubDomains`.

Después de validar HTTPS real:

    ENABLE_HSTS=true
    ENABLE_UPGRADE_INSECURE_REQUESTS=true

## Rollback local

Si una imagen nueva falla:

1. Revisar logs.
2. Corregir código o configuración.
3. Reconstruir `web`.
4. Repetir smoke tests.

No hay base de datos ni migraciones en esta fase.
'@

Write-Utf8NoBom "Docker/SECURITY_NOTES.md" @'
# Docker Security Notes

Notas de seguridad para el entorno Docker local.

## Modelo actual

El proyecto genera un sitio estático con Astro. El contenedor `web` sirve `dist` con un servidor Node minimalista.

No hay base de datos, sesiones, autenticación, cookies de sesión ni backend de formularios en esta fase.

## Controles activos

Runtime de producción local:

- usuario no root.
- filesystem read-only.
- `tmpfs` en `/tmp`.
- `no-new-privileges`.
- capacidades Linux eliminadas.
- healthcheck local.
- cabeceras HTTP de seguridad.
- cache control explícito.
- ETag y Last-Modified.
- 404 real.
- redirect 308 para rutas canónicas.

## CSP

La CSP actual mantiene `unsafe-inline` para scripts y estilos porque el sitio Astro actual genera y usa inline code.

Deuda futura:

- reducir scripts inline.
- evaluar hashes o nonces si el hosting lo permite.
- revisar compatibilidad del formulario `mailto`.
- revisar impacto en la escena 3D.

## HSTS

No activar en local. Activar solo después de validar HTTPS real en producción.

## Secretos

No guardar secretos en:

- repositorio.
- documentación.
- Docker build args.
- frontend.
- `public`.
- `dist`.
- logs.

## Contacto

El formulario usa `mailto:` y no envía datos a servidor.

Aun así, la UI advierte no escribir:

- contraseñas.
- tokens.
- datos bancarios.
- información sensible.

## No-go

No publicar si:

- el correo de contacto no existe.
- aparecen secretos en el repositorio.
- `audit:prod` reporta vulnerabilidades.
- el servidor no devuelve 404 real.
- el healthcheck falla.
- las cabeceras principales desaparecen.
'@

Write-Utf8NoBom "SECURITY.md" @'
# Security

Documento de seguridad para IoCode SOLUTIONS Web.

## Alcance

Esta revisión aplica al estado actual del proyecto:

- sitio estático Astro.
- Docker local.
- servidor estático Node.
- formulario `mailto`.
- sin base de datos.
- sin login.
- sin sesiones.
- sin API propia.
- sin cookies de aplicación.
- sin pagos.
- sin subida de archivos.

## Datos tratados

El sitio puede exponer o preparar datos de contacto mediante cliente de correo del usuario:

- nombre.
- email.
- tipo de proyecto.
- mensaje.

El sitio no almacena estos datos en servidor propio en esta fase.

## Controles implementados

Servidor estático:

- CSP.
- `X-Content-Type-Options`.
- `X-Frame-Options`.
- `Referrer-Policy`.
- `Permissions-Policy`.
- `Cross-Origin-Opener-Policy`.
- `Cross-Origin-Resource-Policy`.
- `Origin-Agent-Cluster`.
- ETag.
- Last-Modified.
- 404 real.
- redirect 308 para rutas canónicas.
- healthcheck sin cache.

Docker runtime:

- usuario no root.
- filesystem read-only.
- sin capabilities Linux.
- no-new-privileges.
- tmpfs para `/tmp`.

## CSP actual

La política permite inline scripts y estilos por compatibilidad con el sitio estático actual.

Riesgo residual:

- `unsafe-inline` reduce la protección frente a XSS si se introducen superficies de inyección en el futuro.

Aceptación temporal:

- no hay entrada de usuario renderizada en HTML del servidor.
- no hay backend.
- no hay almacenamiento de mensajes.
- el formulario solo prepara un `mailto:`.

Mejora futura:

- eliminar inline scripts donde sea viable.
- evaluar hashes o nonces.
- separar JS de componentes interactivos.

## HSTS

HSTS está desactivado por defecto.

Motivo:

- el entorno local usa HTTP.
- HSTS debe activarse solo en dominio final con HTTPS real validado.

## Dependencias

Validación actual:

    docker compose exec dev npm run audit:prod

Estado esperado:

- `found 0 vulnerabilities`.

No usar `npm audit fix --force` sin revisar cambios rompientes.

## Secretos

No versionar:

- tokens.
- contraseñas.
- claves privadas.
- dumps.
- backups.
- `.env` con valores reales.
- credenciales cloud.
- claves de API.

## Validaciones recomendadas

Buscar posibles secretos:

    docker compose exec dev sh -lc "find src docs Docker public -type f -maxdepth 10 | xargs grep -n -e 'password' -e 'token' -e 'secret' -e 'api_key' -e 'private_key' -e 'BEGIN RSA' -e 'BEGIN PRIVATE' || true"

Validar persona física solo en contacto:

    docker compose exec dev sh -lc "find dist -type f -name 'index.html' ! -path '*/contacto/*' ! -path '*/contact/*' ! -path '*/kontakt/*' -exec grep -Hn -e 'Diego' -e 'Diaz' -e 'dadd86' -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' {} + || true"

Resultado esperado:

- sin salida.

## No-go para publicar

No publicar si:

- `check` falla.
- `build` falla.
- `audit:prod` reporta vulnerabilidades.
- `/health` no devuelve 200.
- rutas inexistentes no devuelven 404.
- aparece información personal fuera de contacto.
- el correo de contacto no existe.
- hay secretos en el repositorio.
- HSTS se activa sin HTTPS real validado.

## Limitaciones

Este documento no certifica cumplimiento legal ni cumplimiento normativo. Solo describe controles técnicos revisados localmente.
'@

Write-Utf8NoBom "QA_CHECKLIST.md" @'
# QA Checklist

Checklist de validación para IoCode SOLUTIONS Web.

## Estado actual

Fases cerradas técnicamente:

- Fase 0.
- Fase 1.
- Fase 1.1A.

Fase actual:

- Fase 1.1B: documentación y runbooks.

## Gate técnico obligatorio

Ejecutar:

    docker compose up -d dev
    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod
    docker compose --profile prod up --build -d web

Criterio:

- `check`: 0 errores, 0 warnings, 0 hints.
- `build`: 29 páginas.
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

- páginas válidas: 200.
- sitemap: 200.
- robots: 200.
- health: 200.
- ruta inexistente: 404.

## Redirect canónico

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

## SEO técnico

Validar sitemap:

    docker compose exec dev sh -lc "grep -n -e 'xhtml:link' -e 'hreflang' -e 'lastmod' -e 'x-default' dist/sitemap.xml | head -40"

Validar schema:

    docker compose exec dev sh -lc "grep -n -e 'BreadcrumbList' -e 'OfferCatalog' -e 'ContactPoint' -e 'ProfessionalService' -e 'Organization' dist/es/proceso/index.html | head -20"

## Persona física solo en contacto

Debe aparecer en contacto:

    docker compose exec dev sh -lc "grep -Hn -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' dist/es/contacto/index.html dist/en/contact/index.html dist/de/kontakt/index.html"

No debe aparecer fuera de contacto:

    docker compose exec dev sh -lc "find dist -type f -name 'index.html' ! -path '*/contacto/*' ! -path '*/contact/*' ! -path '*/kontakt/*' -exec grep -Hn -e 'Diego' -e 'Diaz' -e 'dadd86' -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' {} + || true"

Esperado:

- primer comando: coincidencias en las 3 páginas de contacto.
- segundo comando: sin salida.

## Checklist visual manual

Pendiente antes de publicación real:

- Home ES/EN/DE en desktop.
- Home ES/EN/DE en móvil.
- Servicios ES/EN/DE.
- Proceso ES/EN/DE.
- Contacto ES/EN/DE.
- Menú responsive.
- Language switcher.
- Formulario.
- CTA visibles.
- Sin overflow horizontal.
- Sin errores de consola.
- Escena 3D con fallback si falla.

## Accesibilidad mínima

Pendiente de validación manual:

- navegación por teclado.
- foco visible.
- contraste suficiente.
- labels de formulario.
- orden lógico de encabezados.
- tamaño de targets en móvil.
- texto alternativo de logos e imágenes.
- reduced motion para animación o 3D si aplica.

## Performance

Pendiente antes de producción real:

- Lighthouse mobile.
- Lighthouse desktop.
- peso JS.
- carga del modelo GLB.
- Core Web Vitals en entorno real.
- comportamiento en móvil de gama media.

## No-go

No avanzar a publicación real si:

- falla `check`, `build` o `audit:prod`.
- hay rutas 404 inesperadas.
- `/no-existe/` no responde 404.
- el correo de contacto no existe.
- hay secretos en el repositorio.
- aparecen datos personales fuera de contacto.
- la documentación vuelve a contener comandos obsoletos.
'@

Write-Utf8NoBom "docs/index.md" @'
# Documentation Index

Índice de documentación técnica.

## Documentos raíz

- `README.md`: visión general del proyecto.
- `RUN_GUIDE.md`: ejecución local, QA y producción local.
- `SECURITY.md`: modelo de seguridad.
- `QA_CHECKLIST.md`: checklist de validación.
- `CHANGELOG.md`: cambios por fase.

## Docker

- `Docker/README.md`: servicios Docker y uso básico.
- `Docker/OPERATIONS.md`: runbook operativo.
- `Docker/SECURITY_NOTES.md`: notas de seguridad Docker.

## Arquitectura y mantenimiento

- `docs/ARCHITECTURE.md`: arquitectura actual.
- `docs/MAINTENANCE.md`: mantenimiento del sitio.
- `docs/I18N.md`: internacionalización.
- `docs/MIGRATION_FROM_STATIC_HTML.md`: nota histórica de migración.
- `docs/PROJECT_SELECTION.md`: criterios de selección de proyectos.

## Estado actual

- Sitio Astro estático.
- Docker Compose desde `compose.yml` en raíz.
- Servidor estático Node para producción local.
- Rutas ES/EN/DE.
- SEO técnico avanzado implementado.
- Seguridad HTTP avanzada local implementada.
- Persona física visible solo en contacto.
'@

Write-Utf8NoBom "docs/ARCHITECTURE.md" @'
# Architecture

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

## Límites actuales

- No hay CMS.
- No hay backend para formularios.
- No hay analytics.
- No hay Lighthouse documentado.
- No hay pruebas Playwright.
- HSTS no activado por defecto.
'@

Write-Utf8NoBom "docs/MAINTENANCE.md" @'
# Maintenance

Guía de mantenimiento del sitio.

## Cambiar datos de empresa

Archivo:

    src/data/site.ts

Revisar después:

- `npm run check`.
- `npm run build`.
- páginas de contacto.
- schema generado.
- sitemap si cambia URL base.

## Cambiar rutas

Archivo principal:

    src/i18n/routes.ts

Después de cambiar rutas:

    docker compose exec dev npm run check
    docker compose exec dev npm run build

Validar:

    docker compose exec dev sh -lc "grep -n 'hreflang' dist/sitemap.xml | head"

## Cambiar contenido de páginas

Archivo:

    src/data/pageContent.ts

Para Home y Servicios también revisar:

    src/data/phase1Sections.ts

Para Proceso revisar:

    src/data/processSections.ts

## Cambiar textos de interfaz

Archivo:

    src/i18n/ui.ts

Validar ES/EN/DE en:

- contacto.
- botones.
- navegación.
- formularios.

## Cambiar navegación

Archivos:

- `src/i18n/routes.ts`.
- `src/components/Navigation.astro`.
- `src/components/LanguageSwitcher.astro`.

No duplicar rutas en otros archivos.

## Cambiar SEO estructurado

Archivo:

    src/layouts/BaseLayout.astro

Datos de soporte:

    src/data/site.ts

Validar:

    docker compose exec dev npm run build
    docker compose exec dev sh -lc "grep -n -e 'BreadcrumbList' -e 'OfferCatalog' -e 'ContactPoint' dist/es/index.html | head"

## Cambiar sitemap

Archivo:

    src/pages/sitemap.xml.ts

Validar:

    docker compose exec dev npm run build
    docker compose exec dev sh -lc "grep -n -e 'xhtml:link' -e 'lastmod' -e 'x-default' dist/sitemap.xml | head -40"

## Cambiar seguridad HTTP

Archivo:

    Docker/node-static-server.mjs

Validar producción local:

    docker compose --profile prod up --build -d web
    curl.exe -I http://localhost:8080/es/

Revisar headers:

- CSP.
- X-Frame-Options.
- X-Content-Type-Options.
- Permissions-Policy.
- COOP.
- CORP.
- ETag.
- Last-Modified.

## Cambiar modelo 3D

Ruta esperada:

    public/logo/3d/iocode_solutions_logo_extruded_3d.glb

Validar:

    curl.exe -I http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb

## Contacto

El email se configura en:

    src/data/site.ts

Antes de publicar:

- confirmar que el buzón existe.
- enviar correo de prueba.
- probar el formulario en navegador real.

## Publicación

Antes de publicar:

    docker compose exec dev npm run check
    docker compose exec dev npm run build
    docker compose exec dev npm run audit:prod
    docker compose --profile prod up --build -d web

Smoke test:

    curl.exe -I http://localhost:8080/health
    curl.exe -I http://localhost:8080/es/
    curl.exe -I http://localhost:8080/sitemap.xml
    curl.exe -I http://localhost:8080/no-existe/

## No hacer

- No introducir secretos en frontend.
- No publicar carpetas `.git`, `node_modules`, `.astro` ni `dist` dentro de un ZIP de código fuente.
- No activar HSTS sin HTTPS real.
- No añadir analytics sin revisar privacidad y consentimiento.
- No duplicar rutas fuera de `src/i18n/routes.ts`.
'@

Write-Utf8NoBom "docs/MIGRATION_FROM_STATIC_HTML.md" @'
# Migration From Static HTML

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

Este documento es histórico. Para ejecutar el proyecto, usar `RUN_GUIDE.md`.
'@

Write-Utf8NoBom "CHANGELOG.md" @'
# Changelog

## Fase 1.1B

Documentación y runbooks actualizados:

- README principal reescrito.
- RUN_GUIDE actualizado.
- Docker README actualizado.
- Docker operations runbook actualizado.
- notas de seguridad Docker actualizadas.
- SECURITY actualizado.
- QA_CHECKLIST actualizado.
- docs index añadido.
- ARCHITECTURE actualizado.
- MAINTENANCE actualizado.
- documento de migración convertido en nota histórica.

Objetivo:

- eliminar instrucciones obsoletas.
- alinear documentación con `compose.yml`.
- documentar `/health`.
- documentar seguridad HTTP avanzada.
- documentar SEO técnico avanzado.
- documentar criterios de cierre de Fase 0, 1 y 1.1A.

## Fase 1.1A

- Página Proceso rediseñada.
- Limpieza semántica de `pageContent.ts`.
- Seguridad HTTP avanzada en servidor estático.
- Sitemap con hreflang y lastmod.
- Schema ampliado con BreadcrumbList, ContactPoint y OfferCatalog.
- Redirect canónico 308 para rutas sin slash.
- 404 real validado.

## Fase 1

- Home y Servicios reforzados con copy CEO/SEO/AI.
- Secciones de valor industrial.
- Mensajes adaptados a español, inglés y alemán.

## Fase 0

- Base multilingüe.
- Rutas localizadas.
- Página Empresa.
- Contacto con persona física verificable.
- Schema base.
'@

Write-Utf8NoBom "tools/validate-docs-phase-1-1b.ps1" @'
$ErrorActionPreference = "Stop"

$forbiddenPatterns = @(
  "Docker/compose\.yml",
  "Docker/\.env",
  "/healthz",
  "healthz",
  "--env-file Docker",
  "compose -f Docker"
)

$includedExtensions = @(".md", ".json", ".yml", ".yaml")
$excludedDirectories = @("\.git\", "\node_modules\", "\dist\", "\.astro\")

$files = Get-ChildItem -Recurse -File | Where-Object {
  $path = $_.FullName
  $extension = $_.Extension.ToLowerInvariant()

  if ($includedExtensions -notcontains $extension) {
    return $false
  }

  foreach ($excluded in $excludedDirectories) {
    if ($path -like "*$excluded*") {
      return $false
    }
  }

  return $true
}

$matches = @()

foreach ($pattern in $forbiddenPatterns) {
  $result = $files | Select-String -Pattern $pattern -AllMatches
  if ($result) {
    $matches += $result
  }
}

if ($matches.Count -gt 0) {
  Write-Host "Se encontraron referencias obsoletas:" -ForegroundColor Red
  $matches | ForEach-Object {
    Write-Host "$($_.Path):$($_.LineNumber): $($_.Line)" -ForegroundColor Yellow
  }
  exit 1
}

$requiredFiles = @(
  "README.md",
  "RUN_GUIDE.md",
  "SECURITY.md",
  "QA_CHECKLIST.md",
  "Docker/README.md",
  "Docker/OPERATIONS.md",
  "Docker/SECURITY_NOTES.md",
  "docs/index.md",
  "docs/ARCHITECTURE.md",
  "docs/MAINTENANCE.md",
  "docs/MIGRATION_FROM_STATIC_HTML.md"
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path $file)) {
    Write-Host "Falta documento requerido: $file" -ForegroundColor Red
    exit 1
  }
}

Write-Host "Documentación Fase 1.1B validada: sin referencias obsoletas bloqueantes." -ForegroundColor Green
'@

Write-Host "Fase 1.1B aplicada: documentación y runbooks actualizados." -ForegroundColor Green
Write-Host "Ejecuta ahora: powershell -ExecutionPolicy Bypass -File tools\validate-docs-phase-1-1b.ps1" -ForegroundColor Cyan