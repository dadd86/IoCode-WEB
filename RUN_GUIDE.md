# RUN_GUIDE.md

Guía de ejecución local para IoCode SOLUTIONS Web.

Este proyecto se ejecuta principalmente con Docker. No es necesario tener `npm` instalado directamente en Windows si se trabaja desde Docker o desde Dev Container.

## Estado de esta guía

Esta guía aplica a la arquitectura actual del proyecto:

```text
Astro + TypeScript + Docker Compose + Three.js + rutas multidioma SEO
```

Estructura esperada:

```text
IoCode-WEB/
├── compose.yml
├── package.json
├── package-lock.json
├── astro.config.mjs
├── tsconfig.json
├── .env.example
├── .devcontainer/
│   └── devcontainer.json
├── Docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── node-static-server.mjs
│   └── scripts/
├── public/
│   └── logo/
│       ├── iocode-logo.svg
│       └── 3d/
│           └── iocode_solutions_logo_extruded_3d.glb
└── src/
```

No usar comandos antiguos basados en:

```text
Docker/compose.yml
Docker/.env
python -m http.server
```

El Compose válido vive en la raíz:

```text
compose.yml
```

---

## 1. Requisitos

### Obligatorios

* Docker Desktop.
* Docker Compose v2.
* Visual Studio Code recomendado.

### Recomendados

* Extensión de VS Code: Dev Containers.
* Extensión de VS Code: Astro.
* Extensión de VS Code: ESLint.
* Extensión de VS Code: Prettier.

### No obligatorio

No es obligatorio instalar Node.js ni npm en Windows si trabajas con Docker.

Si PowerShell devuelve:

```text
npm : El término 'npm' no se reconoce...
```

no es necesariamente un problema. Usa los comandos `npm` dentro de Docker:

```powershell
docker compose run --rm dev npm --version
docker compose run --rm dev npm run check
```

---

## 2. Comprobar Docker

Desde PowerShell:

```powershell
docker --version
docker compose version
```

Ambos comandos deben devolver versión.

Si fallan:

1. Abrir Docker Desktop.
2. Esperar a que Docker esté en estado `Running`.
3. Volver a ejecutar los comandos.

---

## 3. Comprobar que estás en la raíz correcta

Desde PowerShell:

```powershell
Get-Location
Test-Path compose.yml
Test-Path package.json
Test-Path package-lock.json
Test-Path astro.config.mjs
Test-Path src
Test-Path public
Test-Path Docker
```

Resultado esperado para cada `Test-Path`:

```text
True
```

Si `compose.yml` devuelve `False`, no estás en la raíz correcta del proyecto.

La raíz esperada es similar a:

```text
C:\Users\diaz_\OneDrive\cursos\Programas\IoCode-WEB
```

---

## 4. Desarrollo local con Docker

Levantar el servidor de desarrollo:

```powershell
docker compose up --build
```

Abrir en navegador:

```powershell
Start-Process "http://localhost:4321/es/"
```

También puedes abrir manualmente:

```text
http://localhost:4321/es/
```

El servicio `dev` está definido como servicio por defecto, sin `profiles`, por eso funciona:

```powershell
docker compose up --build
```

No hace falta usar:

```powershell
docker compose --profile dev up --build
```

---

## 5. Producción local con Docker

Levantar producción local:

```powershell
docker compose --profile prod up --build web
```

Abrir:

```powershell
Start-Process "http://localhost:8080/es/"
```

URL:

```text
http://localhost:8080/es/
```

El servicio `web` genera el build de Astro y sirve `dist/` con el servidor Node:

```text
Docker/node-static-server.mjs
```

---

## 6. Preview de Astro

Levantar preview:

```powershell
docker compose --profile preview up --build preview
```

Abrir:

```powershell
Start-Process "http://localhost:4322/es/"
```

URL:

```text
http://localhost:4322/es/
```

---

## 7. QA automatizado

Ejecutar QA completo:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

El servicio QA debe ejecutar:

```text
node --version
npm --version
npm run check
npm run build
npm run audit:prod
```

Resultado esperado:

```text
astro check
0 errors
0 warnings
0 hints

astro build
26 page(s) built

npm audit --omit=dev
found 0 vulnerabilities
```

Si `qa` muestra errores antiguos pero `prod` pasa correctamente, probablemente `qa` está usando una imagen vieja. Reconstruir:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

---

## 8. Validación rápida de producción

Con producción levantada:

```powershell
docker compose --profile prod up --build web
```

En otra terminal, ejecutar:

```powershell
Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing | Select-Object -ExpandProperty Content
```

Resultado esperado:

```json
{"status":"ok"}
```

Validar que el modelo 3D está disponible:

```powershell
(Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing).StatusCode
```

Resultado esperado:

```text
200
```

Validar páginas principales:

```powershell
(Invoke-WebRequest "http://localhost:8080/es/" -UseBasicParsing).StatusCode
(Invoke-WebRequest "http://localhost:8080/en/" -UseBasicParsing).StatusCode
(Invoke-WebRequest "http://localhost:8080/de/" -UseBasicParsing).StatusCode
```

Resultado esperado para todas:

```text
200
```

Validar sitemap:

```powershell
(Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing).StatusCode
```

Resultado esperado:

```text
200
```

---

## 9. Rutas principales

### Home

```text
/es/
/en/
/de/
```

### Servicios

```text
/es/servicios/
/en/services/
/de/leistungen/
```

### PLC

```text
/es/automatizacion-plc/
/en/plc-automation/
/de/sps-automatisierung/
```

### Robótica

```text
/es/robotica-industrial/
/en/industrial-robotics/
/de/industrierobotik/
```

### Proyectos

```text
/es/proyectos/
/en/projects/
/de/projekte/
```

### Habilidades

```text
/es/habilidades/
/en/skills/
/de/faehigkeiten/
```

### Proceso

```text
/es/proceso/
/en/process/
/de/prozess/
```

### Contacto

```text
/es/contacto/
/en/contact/
/de/kontakt/
```

---

## 10. Dev Container en Visual Studio Code

La configuración correcta debe estar en:

```text
.devcontainer/devcontainer.json
```

No debe estar en:

```text
Docker/devcontainer/devcontainer.json
```

Si VS Code muestra la pantalla:

```text
Add Dev Container Configuration Files
```

elige:

```text
Add configuration to workspace
```

No elegir:

```text
Add configuration to user data folder
```

Motivo: la configuración pertenece al proyecto y debe poder compartirse con el repositorio.

### Abrir el proyecto dentro del contenedor

En VS Code:

```text
Ctrl + Shift + P
Dev Containers: Reopen in Container
```

Cuando VS Code abra el workspace dentro del contenedor, la terminal debe estar en:

```text
/app
```

Comprobar:

```bash
node --version
npm --version
npm run check
```

Si VS Code muestra errores como:

```text
No se encuentra el módulo "three"
Archivo 'astro/tsconfigs/strict' no encontrado
```

y estás trabajando con Docker, normalmente significa que VS Code está abierto en Windows y no dentro del contenedor. Reabrir con:

```text
Dev Containers: Reopen in Container
```

---

## 11. Comandos operativos

### Ver contenedores

```powershell
docker compose ps
```

### Validar configuración Compose

```powershell
docker compose config
```

### Validar configuración incluyendo perfiles

```powershell
docker compose --profile qa --profile preview --profile prod config
```

### Ver logs de desarrollo

```powershell
docker compose logs -f dev
```

### Ver logs de producción local

```powershell
docker compose logs -f web
```

### Apagar servicios

```powershell
docker compose down
```

### Apagar y limpiar volúmenes

```powershell
docker compose down -v
```

Usar `down -v` cuando cambien dependencias o cuando el volumen de `node_modules` quede inconsistente.

No borra tu código fuente, pero sí borra volúmenes Docker asociados al proyecto.

---

## 12. Flujo recomendado de trabajo diario

### Desarrollo normal

```powershell
docker compose up --build
```

Abrir:

```text
http://localhost:4321/es/
```

Editar archivos en:

```text
src/
public/
docs/
```

Astro debe recargar automáticamente.

### Antes de cerrar una tarea

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

### Antes de publicar o entregar

```powershell
docker compose down -v
docker compose up --build
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
docker compose --profile prod up --build web
```

Después ejecutar smoke tests:

```powershell
Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing
```

---

## 13. Problemas frecuentes

### Error: `no configuration file provided: not found`

Causa probable: no estás en la raíz del proyecto o falta `compose.yml`.

Comprobar:

```powershell
Test-Path compose.yml
```

Debe devolver:

```text
True
```

Solución:

```powershell
cd C:\Users\diaz_\OneDrive\cursos\Programas\IoCode-WEB
docker compose up --build
```

---

### Error: `no service selected`

Causa probable: estás usando un Compose antiguo donde todos los servicios tenían `profiles`.

En la configuración actual, `dev` no debe tener `profiles`.

Comando correcto:

```powershell
docker compose up --build
```

---

### Error: `couldn't find env file Docker/.env`

Causa: estás usando comandos antiguos.

No usar:

```powershell
docker compose -f Docker/compose.yml --env-file Docker/.env --profile dev up --build
```

Usar:

```powershell
docker compose up --build
```

El proyecto actual usa:

```text
compose.yml
.env.example
```

No depende de:

```text
Docker/compose.yml
Docker/.env
```

---

### Error: `npm : El término 'npm' no se reconoce`

Causa: Windows no tiene npm instalado.

Si trabajas con Docker, no es bloqueo. Ejecuta npm dentro del contenedor:

```powershell
docker compose run --rm dev npm --version
docker compose run --rm dev npm run check
```

O abre VS Code dentro del Dev Container.

---

### Error: VS Code no encuentra `three`

Ejemplo:

```text
No se encuentra el módulo "three"
No se encuentra el módulo "three/addons/loaders/GLTFLoader.js"
No se encuentra el módulo "astro/tsconfigs/strict"
```

Soluciones:

1. Reabrir VS Code dentro del contenedor:

```text
Dev Containers: Reopen in Container
```

2. Si decides trabajar fuera de Docker, instalar dependencias en Windows:

```powershell
npm ci
```

El flujo recomendado para este proyecto es Dev Container.

---

### Error: GLB 3D devuelve 404

Comprobar:

```powershell
Test-Path public\logo\3d\iocode_solutions_logo_extruded_3d.glb
```

Debe devolver:

```text
True
```

Comprobar que no exista esta ruta antigua:

```powershell
Test-Path public\logo\3D
```

Debe devolver:

```text
False
```

Docker/Linux distingue mayúsculas y minúsculas. Esta ruta es correcta:

```text
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

Esta ruta es incorrecta:

```text
public/logo/3D/iocode_solutions_logo_extruded_3d.glb
```

---

### Error: comando pegado

Esto está mal:

```powershell
docker compose psdocker compose ps
```

El comando correcto es:

```powershell
docker compose ps
```

---

## 14. Auditoría de dependencias

Auditoría productiva:

```powershell
docker compose run --rm dev npm audit --omit=dev
```

Resultado esperado:

```text
found 0 vulnerabilities
```

Auditoría completa:

```powershell
docker compose run --rm dev npm audit
```

Puede mostrar vulnerabilidades moderadas en herramientas de desarrollo.

No ejecutar automáticamente:

```powershell
npm audit fix --force
```

Motivo: puede introducir cambios incompatibles.

Criterio:

* Si `npm audit --omit=dev` falla, bloquear publicación hasta corregir o justificar.
* Si solo falla `npm audit` completo por tooling de desarrollo, documentar y revisar actualizaciones controladas.
* No forzar actualizaciones sin volver a ejecutar QA completo.

---

## 15. Archivos que no deben estar en el entregable

Antes de empaquetar, revisar que no existan:

```text
.env
.git/
node_modules/
.astro/
dist/
logs/
backups/
dumps/
*.zip
*.rar
*.7z
*.tar
*.tar.gz
Docker/.env
public/Logo/
Skills/
```

Comprobación rápida en PowerShell:

```powershell
Test-Path .env
Test-Path .git
Test-Path node_modules
Test-Path .astro
Test-Path dist
Test-Path public\Logo
Test-Path Skills
```

Para un ZIP fuente, todos esos deberían ser:

```text
False
```

Excepción: `dist/` solo debe incluirse si se está entregando explícitamente un build estático para hosting sin pipeline.

---

## 16. Checklist mínimo antes de publicar

Ejecutar:

```powershell
docker compose down -v
docker compose up --build
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
docker compose --profile prod up --build web
```

Validar:

```powershell
Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing
```

Revisión manual:

* `/es/`, `/en/`, `/de/` cargan correctamente.
* Selector de idioma conserva página equivalente con slug traducido.
* Logo aparece en todas las páginas.
* Logo 3D carga sin 404.
* Logo 3D no se recorta.
* Existe fallback si falla WebGL.
* Responsive móvil sin scroll horizontal.
* Navegación por teclado razonable.
* Formulario abre `mailto:`.
* El formulario no promete backend.
* Enlaces externos usan `rel="noopener noreferrer"`.
* `canonical` y `hreflang` son correctos.
* No hay `.env`, `.git`, `node_modules`, `.astro`, ZIPs internos ni assets fuente innecesarios.

---

## 17. No-go conditions

No publicar si ocurre cualquiera:

* `npm run check` falla.
* `npm run build` falla.
* `npm audit --omit=dev` detecta vulnerabilidades productivas sin resolver.
* El GLB devuelve 404.
* El selector de idioma no conserva equivalencia de página.
* El formulario promete envío backend sin backend real.
* Hay enlaces a repositorios privados.
* Hay `.env`, `.git`, `node_modules`, `.astro` o ZIPs internos en el entregable.
* Hay rutas con mayúsculas incompatibles con Linux, como `public/logo/3D`.
* La documentación indica comandos obsoletos como `Docker/compose.yml` o `Docker/.env`.
* No se ha validado visualmente en navegador.

```
```
genera el contenido de los siguiente archvios actualizados, teniendo en cuenta los skills y el proyecto: 
docs/ARCHITECTURE.md 
docs/I18N.md 
docs/MAINTENANCE.md 
docs/MIGRATION_FROM_STATIC_HTML.md