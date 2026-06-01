# MAINTENANCE.md

Guía de mantenimiento de IoCode SOLUTIONS Web.

## 1. Propósito

Este documento explica cómo mantener el proyecto IoCode SOLUTIONS Web sin romper su arquitectura, rutas multidioma, SEO, Docker, seguridad ni flujo de QA.

La web está construida con:

```text
Astro + TypeScript + Docker Compose + Three.js + rutas multidioma reales
```

La regla principal de mantenimiento es:

```text
No duplicar lógica ni contenido estructural página por página.
```

La mayoría de cambios deben hacerse en archivos centralizados dentro de:

```text
src/data/
src/i18n/
src/components/
src/assets/
```

## 2. Estado esperado del proyecto

La estructura base esperada es:

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
└── docs/
```

No deben existir en el entregable fuente:

```text
.env
.git/
node_modules/
.astro/
dist/
public/Logo/
public/logo/3D/
Skills/
```

## 3. Comandos base de mantenimiento

### Desarrollo

```powershell
docker compose up --build
```

Abrir:

```text
http://localhost:4321/es/
```

### QA

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

### Producción local

```powershell
docker compose --profile prod up --build web
```

Abrir:

```text
http://localhost:8080/es/
```

### Smoke tests

```powershell
Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing
```

## 4. Qué archivo tocar según el cambio

| Cambio                                                  | Archivo principal                                           |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| Cambiar dominio, email, GitHub, LinkedIn, rutas de logo | `src/data/site.ts`                                          |
| Cambiar navegación o slugs                              | `src/i18n/routes.ts`                                        |
| Cambiar labels cortos de UI                             | `src/i18n/ui.ts`                                            |
| Cambiar textos de páginas                               | `src/data/pageContent.ts`                                   |
| Cambiar proyectos                                       | `src/data/projects.ts`                                      |
| Cambiar habilidades                                     | `src/data/skills.ts`                                        |
| Cambiar layout global                                   | `src/layouts/BaseLayout.astro`                              |
| Cambiar header                                          | `src/components/Header.astro`                               |
| Cambiar footer                                          | `src/components/Footer.astro`                               |
| Cambiar selector de idioma                              | `src/components/LanguageSwitcher.astro`                     |
| Cambiar navegación visual                               | `src/components/Navigation.astro`                           |
| Cambiar botones                                         | `src/components/Button.astro` y `src/assets/components.css` |
| Cambiar tarjetas                                        | `ProjectCard.astro`, `SkillCard.astro`, `CardGrid.astro`    |
| Cambiar hero 3D                                         | `Hero3D.astro`, `hero3d.ts`, `hero3d.css`                   |
| Cambiar estilos globales                                | `src/assets/*.css`                                          |
| Cambiar Docker                                          | `compose.yml`, `Docker/*`                                   |
| Cambiar guía de ejecución                               | `RUN_GUIDE.md`                                              |
| Cambiar seguridad                                       | `SECURITY.md`                                               |
| Cambiar checklist                                       | `QA_CHECKLIST.md`                                           |

## 5. Mantenimiento de rutas

La fuente de verdad de las rutas es:

```text
src/i18n/routes.ts
```

No modificar rutas desde componentes individuales.

### Regla obligatoria

Cada ruta debe existir en todos los idiomas soportados:

```text
es
en
de
```

Ejemplo correcto:

```ts
services: {
  key: "services",
  label: {
    es: "Servicios",
    en: "Services",
    de: "Leistungen"
  },
  slug: {
    es: "servicios",
    en: "services",
    de: "leistungen"
  },
  path: {
    es: "/es/servicios/",
    en: "/en/services/",
    de: "/de/leistungen/"
  }
}
```

### No hacer

No usar reemplazos simples:

```ts
pathname.replace("/es/", "/en/")
```

Eso genera rutas incorrectas cuando los slugs están traducidos.

### Después de cambiar rutas

Ejecutar:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

Validar manualmente:

* navegación;
* selector de idioma;
* canonical;
* hreflang;
* sitemap;
* rutas antiguas si ya estaban publicadas.

Si la web ya estaba publicada, cambiar slugs requiere plan de redirección.

## 6. Mantenimiento de contenido

El contenido de páginas vive en:

```text
src/data/pageContent.ts
```

Debe mantener esta estructura conceptual:

```ts
pageContent[locale][routeKey]
```

Cada página debe tener:

```ts
{
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  cards?: Card[];
}
```

### Reglas

* No dejar contenido en inglés o alemán vacío.
* No mezclar idiomas en una misma página salvo términos técnicos aceptados.
* No duplicar grandes bloques de contenido directamente en componentes.
* No hacer claims exagerados sin evidencia.
* No afirmar que un servicio existe si no se puede explicar o entregar.

### Después de cambiar contenido

Validar:

```powershell
docker compose --profile qa run --rm qa
```

Revisar en navegador:

```text
http://localhost:4321/es/
http://localhost:4321/en/
http://localhost:4321/de/
```

## 7. Mantenimiento de textos UI

Los textos cortos reutilizables viven en:

```text
src/i18n/ui.ts
```

Ejemplos:

* botones;
* labels;
* textos de formulario;
* enlaces;
* mensajes cortos;
* labels de proyectos.

Regla: si un texto aparece en varios componentes, debe vivir en `ui.ts` o en un archivo de datos, no duplicado manualmente.

## 8. Mantenimiento de navegación

Archivos implicados:

```text
src/i18n/routes.ts
src/data/navigation.ts
src/components/Navigation.astro
```

### Para añadir una entrada al menú

1. Añadir la ruta en `routeAlternates`.
2. Añadir la clave en `navigationRouteKeys`.
3. Revisar labels en todos los idiomas.
4. Ejecutar QA.
5. Probar menú en móvil y escritorio.

### Para ocultar una página del menú

No eliminar la ruta si sigue siendo pública. Quitar solo de:

```text
navigationRouteKeys
```

## 9. Mantenimiento del selector de idioma

Archivo:

```text
src/components/LanguageSwitcher.astro
```

Debe usar:

```ts
getAlternatePaths(activeKey)
```

No debe leer la URL actual y hacer reemplazos manuales.

Después de tocarlo, probar al menos:

```text
/es/servicios/ → /en/services/
/es/servicios/ → /de/leistungen/
/en/plc-automation/ → /es/automatizacion-plc/
/de/kontakt/ → /en/contact/
```

## 10. Mantenimiento de SEO

Archivos implicados:

```text
src/layouts/BaseLayout.astro
src/i18n/routes.ts
src/data/pageContent.ts
src/data/site.ts
src/pages/sitemap.xml.ts
public/robots.txt
```

### Revisar cuando cambie una página

* `title`;
* `description`;
* `canonical`;
* `hreflang`;
* sitemap;
* slug;
* `html lang`;
* Open Graph básico.

### Validación rápida

```powershell
docker compose --profile prod up --build web
```

```powershell
Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing
```

En navegador:

```text
View Source → buscar canonical
View Source → buscar hreflang
View Source → buscar description
```

## 11. Mantenimiento de proyectos

Archivo:

```text
src/data/projects.ts
```

### Reglas de proyectos públicos

* Enlazar solo repositorios públicos.
* No enlazar repositorios privados.
* No incluir tokens.
* No incluir rutas privadas.
* No incluir datos de clientes sin permiso.
* No prometer métricas sin evidencia.
* No presentar prototipos como productos finales.

### Reglas de casos privados

* Sin URL privada.
* Sin capturas sensibles.
* Sin nombres de empresas si no hay permiso.
* Sin código privado.
* Sin detalles confidenciales.
* Descripción técnica general.

### Checklist al añadir proyecto

```text
[ ] Existe en es/en/de
[ ] Tiene tecnologías claras
[ ] No contiene secretos
[ ] No enlaza repos privados
[ ] No contiene datos de clientes
[ ] No promete producción sin evidencia
[ ] Refuerza el posicionamiento profesional
```

## 12. Mantenimiento de habilidades

Archivo:

```text
src/data/skills.ts
```

Las habilidades deben reflejar el perfil real:

* PLC;
* HMI;
* robótica industrial;
* comunicaciones industriales;
* Industria 4.0;
* IoT;
* software;
* bases de datos;
* arquitectura;
* herramientas.

### Reglas

* No exagerar nivel de tecnologías básicas.
* No vender como experto algo que solo es aprendizaje.
* Mantener coherencia entre CV, LinkedIn y web.
* Separar habilidades fuertes de habilidades complementarias.
* No convertir la página en una lista genérica de tecnologías.

## 13. Mantenimiento del logo SVG

Ruta:

```text
public/logo/iocode-logo.svg
```

Reglas:

* Mantener nombre estable si no quieres tocar código.
* Optimizar SVG antes de publicar.
* No incluir versiones fuente pesadas en `public`.
* No restaurar carpetas antiguas como `public/Logo/`.

Después de cambiar:

```powershell
docker compose up --build
```

Revisar header y footer.

## 14. Mantenimiento del logo 3D

Ruta correcta:

```text
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

Ruta incorrecta:

```text
public/logo/3D/iocode_solutions_logo_extruded_3d.glb
```

Docker/Linux distingue mayúsculas y minúsculas.

### Después de cambiar el GLB

Ejecutar producción local:

```powershell
docker compose --profile prod up --build web
```

Smoke test:

```powershell
(Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing).StatusCode
```

Resultado esperado:

```text
200
```

Validar visualmente:

* carga sin error;
* no se recorta;
* gira;
* responde al mouse;
* tiene fallback;
* no bloquea navegación;
* no degrada móvil en exceso.

## 15. Mantenimiento del script 3D

Archivo:

```text
src/scripts/hero3d.ts
```

Este archivo debe:

* importar `three`;
* cargar `GLTFLoader`;
* usar `RoomEnvironment`;
* ajustar cámara;
* aplicar material metálico;
* crear luces;
* animar rotación;
* aplicar parallax;
* respetar `prefers-reduced-motion`;
* liberar recursos;
* activar fallback si falla.

### Reglas

* No ignorar errores de TypeScript.
* No usar `any` implícito.
* No eliminar fallback.
* No romper reduced motion.
* No hardcodear rutas si ya vienen de `siteConfig`.
* No asumir que WebGL siempre existe.

Después de modificar:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

## 16. Mantenimiento de estilos

Archivos:

```text
src/assets/global.css
src/assets/tokens.css
src/assets/components.css
src/assets/pages.css
src/assets/hero3d.css
```

### Reglas

* Variables globales en `tokens.css`.
* Componentes reutilizables en `components.css`.
* Composición de páginas en `pages.css`.
* Hero 3D en `hero3d.css`.
* No duplicar estilos de botones por página.
* No usar estilos inline salvo necesidad justificada.
* Revisar responsive tras cambios.

### Después de modificar CSS

Probar:

```text
360px
390px
768px
1024px
1440px
```

Revisar:

* header;
* hero;
* tarjetas;
* formulario;
* footer;
* selector de idioma;
* logo 3D.

## 17. Mantenimiento del formulario

Archivo:

```text
src/components/ContactForm.astro
```

El formulario actual usa:

```text
mailto:
```

### Reglas

* No decir que el mensaje fue enviado al servidor.
* No prometer confirmación automática.
* No pedir información sensible.
* No almacenar datos.
* Mantener aviso de datos sensibles.
* Mantener labels por idioma.
* Mantener validación HTML básica.

Si se añade backend real, revisar:

* `SECURITY.md`;
* política de privacidad;
* rate limiting;
* validación server-side;
* anti-spam;
* logs;
* CORS;
* retención de datos;
* errores y disponibilidad.

## 18. Mantenimiento de Docker

Archivos:

```text
compose.yml
Docker/Dockerfile
Docker/Dockerfile.dev
Docker/node-static-server.mjs
Docker/scripts/
```

### Reglas

* `compose.yml` debe estar en la raíz.
* `dev` debe quedar sin profile para `docker compose up --build`.
* `qa` debe estar en profile `qa`.
* `preview` debe estar en profile `preview`.
* `web` debe estar en profile `prod`.
* No volver a `Docker/compose.yml`.
* No depender de `Docker/.env`.

### Validar cambios Docker

```powershell
docker compose config
docker compose --profile qa --profile preview --profile prod config
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
docker compose --profile prod up --build web
```

## 19. Mantenimiento del servidor Node

Archivo:

```text
Docker/node-static-server.mjs
```

Responsabilidades:

* servir `dist/`;
* responder `/health`;
* aplicar cabeceras de seguridad;
* evitar path traversal;
* servir GLB con MIME correcto;
* manejar rutas con trailing slash;
* aplicar cache razonable.

### No tocar sin validar

Si se modifica, validar:

```powershell
Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/es/" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing
```

## 20. Mantenimiento de Dev Container

Ruta correcta:

```text
.devcontainer/devcontainer.json
```

Ruta obsoleta:

```text
Docker/devcontainer/
```

### Reglas

* Versionar `.devcontainer/devcontainer.json`.
* No incluir secretos.
* No duplicar configuración en `Docker/devcontainer`.
* Mantener `workspaceFolder` como `/app`.
* Mantener referencia a `../compose.yml`.

Si VS Code pregunta dónde crear configuración, elegir:

```text
Add configuration to workspace
```

No:

```text
Add configuration to user data folder
```

## 21. Mantenimiento de dependencias

Archivos:

```text
package.json
package-lock.json
```

### Reglas

* Mantener `package-lock.json`.
* No borrar lockfile sin motivo.
* No ejecutar `npm audit fix --force` sin revisión.
* Las dependencias deben actualizarse con QA completo.
* Si cambia `three`, revisar `hero3d.ts`.
* Si cambia Astro, revisar build, rutas, sitemap y tsconfig.

### Validación

```powershell
docker compose down -v
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
docker compose --profile prod up --build web
```

## 22. Auditoría de seguridad

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

Puede mostrar vulnerabilidades de desarrollo.

Criterio:

* vulnerabilidad productiva: bloquear release;
* vulnerabilidad solo dev: documentar y revisar actualización;
* no usar `--force` sin revalidar todo.

## 23. Mantenimiento de documentación

Archivos raíz:

```text
README.md
RUN_GUIDE.md
SECURITY.md
QA_CHECKLIST.md
```

Docs:

```text
docs/ARCHITECTURE.md
docs/I18N.md
docs/MAINTENANCE.md
```

Actualizar documentación cuando cambie:

* comandos;
* Docker;
* rutas;
* arquitectura;
* seguridad;
* formulario;
* dependencias;
* estructura de carpetas;
* Dev Container;
* proceso QA;
* publicación;
* assets.

No dejar documentación con comandos obsoletos como:

```text
docker compose -f Docker/compose.yml --env-file Docker/.env
```

## 24. Mantenimiento de `.gitignore`

Debe ignorar:

```text
.env
.env.*
node_modules/
dist/
.astro/
logs/
backups/
dumps/
*.zip
*.rar
*.7z
Docker/.env
public/Logo/
Skills/
```

Debe permitir versionar:

```text
.env.example
package.json
package-lock.json
compose.yml
Docker/
public/logo/
src/
docs/
.devcontainer/
```

## 25. Mantenimiento de `.dockerignore`

Debe excluir del contexto Docker:

```text
.git
node_modules
dist
.astro
.env
.env.*
logs
backups
dumps
*.zip
.vscode
.idea
.devcontainer
```

No debe excluir:

```text
package.json
package-lock.json
astro.config.mjs
tsconfig.json
src/
public/
Docker/
```

Si Docker no encuentra `package.json`, revisar `.dockerignore`.

## 26. Antes de crear un ZIP fuente

Ejecutar:

```powershell
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .astro -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item dist -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .env -Force -ErrorAction SilentlyContinue
```

No borrar:

```text
package-lock.json
.env.example
```

Verificar:

```powershell
Test-Path .env
Test-Path .git
Test-Path node_modules
Test-Path .astro
Test-Path dist
Test-Path public\Logo
Test-Path public\logo\3D
Test-Path Skills
```

Para un ZIP fuente limpio, todos deberían devolver:

```text
False
```

## 27. Antes de publicar

Ejecutar:

```powershell
docker compose down -v
docker compose up --build
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
docker compose --profile prod up --build web
```

Smoke tests:

```powershell
Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/robots.txt" -UseBasicParsing
```

Revisar visualmente:

```text
http://localhost:8080/es/
http://localhost:8080/en/
http://localhost:8080/de/
```

## 28. Checklist rápido por tipo de cambio

### Cambio de texto

```text
[ ] Editado en pageContent/ui/projects/skills
[ ] Todos los idiomas actualizados
[ ] Build pasa
[ ] Revisión visual
```

### Cambio de ruta

```text
[ ] routeAlternates actualizado
[ ] navegación revisada
[ ] selector probado
[ ] canonical probado
[ ] hreflang probado
[ ] sitemap probado
[ ] redirección planificada si ya estaba publicada
```

### Cambio de logo

```text
[ ] SVG/GLB en ruta correcta
[ ] Sin public/Logo
[ ] Sin public/logo/3D
[ ] GLB devuelve 200
[ ] Revisión visual
```

### Cambio de Docker

```text
[ ] docker compose config pasa
[ ] qa pasa
[ ] prod pasa
[ ] health responde
[ ] docs actualizadas
```

### Cambio de dependencias

```text
[ ] package-lock actualizado
[ ] qa pasa
[ ] prod pasa
[ ] audit prod pasa
[ ] revisión visual
```

## 29. Errores frecuentes

### VS Code no encuentra `three`

Si trabajas con Docker, abre el proyecto en Dev Container.

```text
Dev Containers: Reopen in Container
```

### Docker no encuentra `package.json`

Revisar:

```powershell
Test-Path package.json
Test-Path .dockerignore
docker compose config
```

### `Docker/.env` no existe

Es correcto. El proyecto actual no debe depender de `Docker/.env`.

Usar:

```powershell
docker compose up --build
```

### `public/logo/3d` da 404

Revisar casing:

```powershell
Test-Path public\logo\3d\iocode_solutions_logo_extruded_3d.glb
Test-Path public\logo\3D
```

Debe ser:

```text
True
False
```

## 30. No-go de mantenimiento

No aceptar un cambio si:

* rompe `npm run check`;
* rompe `npm run build`;
* rompe Docker;
* rompe rutas multidioma;
* rompe selector de idioma;
* genera GLB 404;
* introduce `.env`;
* introduce `.git/` en ZIP;
* introduce `node_modules/` en ZIP;
* enlaza repos privados;
* duplica navegación página por página;
* elimina `routeAlternates`;
* convierte el formulario en una promesa de backend sin backend;
* deja documentación obsoleta.

## 31. Resumen operativo

Para mantener el proyecto sano:

```text
Cambios de contenido → src/data
Cambios de idioma/rutas → src/i18n/routes.ts
Cambios UI reutilizable → src/components + src/assets
Cambios 3D → Hero3D + hero3d.ts + GLB
Cambios Docker → compose.yml + Docker/
Cambios importantes → QA + documentación
```

No publicar ni entregar si `QA_CHECKLIST.md` no está completado.

```
```
