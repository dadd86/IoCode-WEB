# IoCode SOLUTIONS Web

Web profesional de IoCode SOLUTIONS construida con Astro, TypeScript, Docker y rutas multidioma reales para SEO.

El proyecto presenta servicios técnicos de desarrollo software, automatización PLC, robótica industrial, Industria 4.0, proyectos profesionales y contacto comercial. Está pensado inicialmente como portafolio freelancer, pero con una arquitectura preparada para evolucionar a web de empresa.

## Estado actual

Estado técnico local según la última validación conocida:

| Área                      | Estado                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Docker desarrollo         | Operativo en `http://localhost:4321/es/`                                                                     |
| Docker producción local   | Operativo en `http://localhost:8080/es/`                                                                     |
| Astro check en producción | `0 errors`, `0 warnings`, `0 hints`                                                                          |
| Astro build               | Genera 26 páginas                                                                                            |
| Healthcheck               | `http://localhost:8080/health` devuelve `{"status":"ok"}`                                                    |
| Logo 3D GLB               | `http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb` devuelve `200`                         |
| Auditoría producción      | `npm audit --omit=dev` sin vulnerabilidades conocidas                                                        |
| Auditoría completa        | Puede mostrar vulnerabilidades moderadas en dependencias de desarrollo de `@astrojs/check` / language server |

> Importante: estos resultados validan el entorno local observado. Antes de publicar en un hosting real, debe completarse `QA_CHECKLIST.md`, incluyendo revisión visual, responsive, SEO y seguridad del entregable.

## Stack

* Astro
* TypeScript
* Three.js
* Docker Compose
* Node.js dentro de contenedores
* Servidor estático Node para producción local
* HTML estático generado
* CSS modular
* Rutas multidioma reales

## Objetivo del proyecto

La web debe comunicar un perfil técnico diferencial:

```text
PLC + Robótica + Industria 4.0 + Software + Datos
```

Áreas principales:

* Automatización PLC.
* Robótica industrial.
* Industria 4.0 e IoT.
* Desarrollo web.
* Backend y bases de datos.
* Aplicaciones y herramientas técnicas.
* Proyectos públicos y casos privados presentados de forma segura.
* Contacto profesional.

## Idiomas soportados

La web usa rutas indexables por idioma:

```text
/es/
/en/
/de/
```

Las páginas usan slugs traducidos:

```text
/es/servicios/
/en/services/
/de/leistungen/

/es/automatizacion-plc/
/en/plc-automation/
/de/sps-automatisierung/

/es/robotica-industrial/
/en/industrial-robotics/
/de/industrierobotik/

/es/proyectos/
/en/projects/
/de/projekte/

/es/habilidades/
/en/skills/
/de/faehigkeiten/

/es/proceso/
/en/process/
/de/prozess/

/es/contacto/
/en/contact/
/de/kontakt/
```

Las equivalencias de rutas se controlan desde:

```text
src/i18n/routes.ts
```

No se debe resolver el cambio de idioma con reemplazos simples como cambiar `/es/` por `/en/`, porque los slugs están traducidos. El selector de idioma debe usar la tabla central de rutas equivalentes.

## Arquitectura

```text
IoCode-WEB/
├── compose.yml
├── package.json
├── package-lock.json
├── astro.config.mjs
├── tsconfig.json
├── .dockerignore
├── .gitignore
├── .env.example
├── .devcontainer/
│   └── devcontainer.json
├── Docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── node-static-server.mjs
│   └── scripts/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── logo/
│       ├── iocode-logo.svg
│       └── 3d/
│           └── iocode_solutions_logo_extruded_3d.glb
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── i18n/
│   ├── layouts/
│   ├── pages/
│   └── scripts/
├── docs/
├── README.md
├── RUN_GUIDE.md
├── SECURITY.md
└── QA_CHECKLIST.md
```

## Componentes principales

| Archivo                                 | Responsabilidad                                                  |
| --------------------------------------- | ---------------------------------------------------------------- |
| `src/layouts/BaseLayout.astro`          | Layout común, SEO, canonical, hreflang, header y footer          |
| `src/components/Header.astro`           | Cabecera global                                                  |
| `src/components/Navigation.astro`       | Navegación principal                                             |
| `src/components/LanguageSwitcher.astro` | Cambio de idioma usando `routeAlternates`                        |
| `src/components/Hero3D.astro`           | Contenedor visual del logo 3D                                    |
| `src/scripts/hero3d.ts`                 | Three.js, rotación, luces, material metálico, parallax, fallback |
| `src/components/ContactForm.astro`      | Formulario estático basado en `mailto:`                          |
| `src/data/pageContent.ts`               | Contenido principal por idioma                                   |
| `src/data/projects.ts`                  | Proyectos y casos privados/publicables                           |
| `src/data/skills.ts`                    | Habilidades técnicas                                             |
| `src/i18n/routes.ts`                    | Rutas, slugs traducidos y equivalencias SEO                      |
| `src/i18n/ui.ts`                        | Textos UI reutilizables                                          |
| `src/pages/[locale]/[...slug].astro`    | Generación dinámica de páginas estáticas                         |
| `src/pages/sitemap.xml.ts`              | Sitemap generado desde rutas reales                              |
| `Docker/node-static-server.mjs`         | Servidor estático de producción local                            |

## Requisitos

Para el flujo recomendado:

* Docker Desktop.
* Docker Compose v2.
* Visual Studio Code.
* Extensión Dev Containers recomendada.

No es obligatorio tener `npm` instalado en Windows si se trabaja con Docker o Dev Container.

Comprobar Docker:

```powershell
docker --version
docker compose version
```

## Desarrollo con Docker

Desde la raíz del proyecto:

```powershell
docker compose up --build
```

Abrir:

```powershell
Start-Process "http://localhost:4321/es/"
```

O manualmente:

```text
http://localhost:4321/es/
```

El servicio `dev` no usa profile. Por eso este comando funciona directamente:

```powershell
docker compose up --build
```

## Producción local con Docker

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

## QA con Docker

Cuando se cambie código, Docker, dependencias, rutas, contenido o documentación:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

El QA debe ejecutar:

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

Si `qa` muestra errores antiguos pero `prod` pasa, probablemente `qa` está usando una imagen vieja. Reconstruir con:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

## Preview de Astro

```powershell
docker compose --profile preview up --build preview
```

Abrir:

```text
http://localhost:4322/es/
```

## Dev Container

La configuración correcta debe estar en:

```text
.devcontainer/devcontainer.json
```

No debe vivir en:

```text
Docker/devcontainer/devcontainer.json
```

En VS Code, si aparece la pantalla “Add Dev Container Configuration Files”, elegir:

```text
Add configuration to workspace
```

No elegir:

```text
Add configuration to user data folder
```

Motivo: la configuración pertenece al proyecto y debe poder compartirse con el repositorio.

Para abrir el proyecto dentro del contenedor:

```text
Ctrl + Shift + P
Dev Containers: Reopen in Container
```

Dentro del contenedor, la terminal debe abrir en:

```text
/app
```

Comprobar:

```bash
node --version
npm --version
npm run check
```

## Comandos útiles

Ver contenedores:

```powershell
docker compose ps
```

Validar configuración Compose:

```powershell
docker compose config
```

Ver configuración incluyendo perfiles:

```powershell
docker compose --profile qa --profile preview --profile prod config
```

Ver logs de desarrollo:

```powershell
docker compose logs -f dev
```

Apagar servicios:

```powershell
docker compose down
```

Apagar y borrar volúmenes del proyecto:

```powershell
docker compose down -v
```

Usar `down -v` solo cuando quieras regenerar dependencias o cachés Docker. No borra tu código, pero borra volúmenes Docker asociados al proyecto.

## Smoke tests de producción local

Con producción local levantada:

```powershell
Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing | Select-Object -ExpandProperty Content
```

Resultado esperado:

```json
{"status":"ok"}
```

Validar logo 3D:

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

Resultado esperado:

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

## Rutas principales

```text
/es/
/en/
/de/

/es/servicios/
/en/services/
/de/leistungen/

/es/automatizacion-plc/
/en/plc-automation/
/de/sps-automatisierung/

/es/robotica-industrial/
/en/industrial-robotics/
/de/industrierobotik/

/es/proyectos/
/en/projects/
/de/projekte/

/es/habilidades/
/en/skills/
/de/faehigkeiten/

/es/proceso/
/en/process/
/de/prozess/

/es/contacto/
/en/contact/
/de/kontakt/
```

## Formulario de contacto

El formulario actual usa `mailto:`.

Implicaciones:

* No envía datos a backend.
* No almacena mensajes.
* No valida datos en servidor.
* No integra CRM.
* No confirma recepción automática.
* No debe pedir contraseñas, tokens, datos bancarios ni información sensible.

Si se implementa un backend en el futuro, será obligatorio revisar `SECURITY.md` y actualizar la arquitectura.

## Seguridad básica

El proyecto no debe contener secretos.

No publicar:

```text
.env
.env.*
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

Sí mantener:

```text
.env.example
package.json
package-lock.json
compose.yml
Docker/Dockerfile
Docker/Dockerfile.dev
Docker/node-static-server.mjs
public/logo/iocode-logo.svg
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

Importante: Docker/Linux distingue mayúsculas y minúsculas. La ruta correcta del modelo 3D es:

```text
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

No usar:

```text
public/logo/3D/
```

## Auditoría de dependencias

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

Puede mostrar vulnerabilidades moderadas en dependencias de desarrollo relacionadas con `@astrojs/check` / language server.

No ejecutar automáticamente:

```powershell
npm audit fix --force
```

Motivo: puede introducir cambios incompatibles.

Criterio recomendado:

* Vulnerabilidad en dependencias productivas: bloquear release hasta resolver o justificar.
* Vulnerabilidad solo en tooling de desarrollo: documentar, vigilar actualización y no bloquear publicación si `--omit=dev` está limpio.
* Vulnerabilidad explotable en CI/build: analizar caso por caso.

## Problemas frecuentes

### `no configuration file provided: not found`

Causa probable: no estás en la raíz del proyecto o falta `compose.yml`.

Verificar:

```powershell
Test-Path compose.yml
```

Debe devolver:

```text
True
```

### `no service selected`

Causa probable: todos los servicios estaban detrás de profiles o se está usando un Compose antiguo.

El proyecto actual debe tener `dev` sin `profiles`, para que funcione:

```powershell
docker compose up --build
```

### `couldn't find env file Docker/.env`

Causa: comandos antiguos.

El proyecto actual no requiere `Docker/.env`.

Usar:

```powershell
docker compose up --build
```

No usar:

```powershell
docker compose -f Docker/compose.yml --env-file Docker/.env ...
```

### VS Code no encuentra `three` o `astro/tsconfigs/strict`

Si trabajas con Docker, abre VS Code dentro del Dev Container:

```text
Dev Containers: Reopen in Container
```

Si trabajas sin Dev Container, necesitarás instalar dependencias localmente:

```powershell
npm ci
```

Para este proyecto se recomienda Docker/Dev Container.

### `npm` no existe en PowerShell

No es un problema si usas Docker. Ejecuta comandos `npm` dentro del contenedor:

```powershell
docker compose run --rm dev npm --version
docker compose run --rm dev npm run check
```

### Comando mal pegado

Esto está mal:

```powershell
docker compose psdocker compose ps
```

El correcto es:

```powershell
docker compose ps
```

## Qué no usar

No usar:

```powershell
python -m http.server
```

No usar:

```powershell
docker compose -f Docker/compose.yml --env-file Docker/.env ...
```

No usar:

```powershell
npm audit fix --force
```

sin análisis previo.

## Antes de publicar

Ejecutar:

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
```

Y revisar manualmente:

* Navegación ES/EN/DE.
* Selector de idioma con slugs traducidos.
* Logo visible en todas las páginas.
* Logo 3D sin recorte.
* Fallback del logo si WebGL falla.
* Responsive móvil.
* Accesibilidad básica con teclado.
* Formulario `mailto:`.
* Enlaces externos con `rel="noopener noreferrer"`.
* `canonical`, `hreflang`, `sitemap.xml` y `robots.txt`.
* Ausencia de `.env`, `.git`, `node_modules`, `.astro`, ZIPs internos y assets fuente innecesarios.

## No-go conditions

No publicar si ocurre cualquiera:

* `npm run check` falla.
* `npm run build` falla.
* `npm audit --omit=dev` detecta vulnerabilidades productivas sin resolver.
* El GLB devuelve 404.
* El selector de idioma no conserva equivalencia de página.
* El logo no aparece en todas las páginas.
* El formulario promete backend sin backend.
* Hay `.env`, `.git`, `node_modules`, `.astro` o ZIPs internos en el entregable.
* Hay enlaces a repos privados.
* Hay rutas con mayúsculas incompatibles con Linux, como `public/logo/3D`.
* La documentación indica comandos obsoletos.
* No se ha revisado visualmente el sitio en navegador.

## Mantenimiento

Cambiar rutas:

```text
src/i18n/routes.ts
```

Cambiar textos principales:

```text
src/data/pageContent.ts
```

Cambiar proyectos:

```text
src/data/projects.ts
```

Cambiar habilidades:

```text
src/data/skills.ts
```

Cambiar datos globales del sitio:

```text
src/data/site.ts
```

Cambiar logo SVG:

```text
public/logo/iocode-logo.svg
```

Cambiar modelo 3D:

```text
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

## Documentación relacionada

* `RUN_GUIDE.md`: ejecución local, Docker, VS Code y troubleshooting.
* `SECURITY.md`: seguridad, privacidad, secretos, auditorías y no-go conditions.
* `QA_CHECKLIST.md`: checklist de validación antes de publicar.
* `docs/ARCHITECTURE.md`: arquitectura Astro, componentes y datos.
* `docs/I18N.md`: rutas multidioma, slugs traducidos y hreflang.
* `docs/MAINTENANCE.md`: mantenimiento de contenido, rutas, proyectos y habilidades.

```
```
genera el contenido de los siguiente archvios actualizados, teniendo en cuenta los skills y el proyecto: 
README.md 
RUN_GUIDE.md 