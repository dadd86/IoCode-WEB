# ARCHITECTURE.md

Documentación de arquitectura de IoCode SOLUTIONS Web.

## 1. Propósito

IoCode SOLUTIONS Web es una web profesional orientada a presentar servicios técnicos de:

* desarrollo software;
* automatización PLC;
* robótica industrial;
* Industria 4.0;
* IoT;
* bases de datos;
* proyectos técnicos;
* contacto profesional.

El proyecto nace como portafolio freelancer, pero la arquitectura está preparada para evolucionar hacia una web de empresa sin reescribir la base técnica.

El objetivo arquitectónico principal es evitar una web tipo blog o plantilla genérica. La estructura debe transmitir una identidad técnica profesional, modular y mantenible.

## 2. Estado actual de la arquitectura

La arquitectura actual usa:

```text
Astro + TypeScript + Docker Compose + Three.js + HTML estático generado
```

Estado técnico local conocido:

| Área                      | Estado                                                             |
| ------------------------- | ------------------------------------------------------------------ |
| Docker desarrollo         | Operativo en `http://localhost:4321/es/`                           |
| Docker producción local   | Operativo en `http://localhost:8080/es/`                           |
| Astro check en producción | `0 errors`, `0 warnings`, `0 hints`                                |
| Astro build               | Genera 26 páginas                                                  |
| Healthcheck               | `/health` devuelve `{"status":"ok"}`                               |
| GLB 3D                    | `/logo/3d/iocode_solutions_logo_extruded_3d.glb` devuelve HTTP 200 |
| Auditoría producción      | `npm audit --omit=dev` sin vulnerabilidades conocidas              |

Este estado no equivale por sí solo a publicación real. Antes de publicar debe completarse `QA_CHECKLIST.md`.

## 3. Principios arquitectónicos

La arquitectura se rige por estos principios:

1. **Static-first**

   * Generar HTML estático cuando sea suficiente.
   * Evitar backend innecesario.
   * Reducir superficie de ataque.

2. **SEO internacional real**

   * Usar rutas reales `/es/`, `/en/`, `/de/`.
   * Usar slugs traducidos.
   * Usar `canonical`, `hreflang` y `sitemap.xml`.

3. **Componentes reutilizables**

   * No duplicar header, footer, navegación, botones o cards.
   * Centralizar estructuras repetidas.

4. **Datos centralizados**

   * Rutas, textos, proyectos, habilidades y configuración viven en archivos `src/data` y `src/i18n`.

5. **Separación de responsabilidades**

   * Layout global separado.
   * Componentes visuales separados.
   * Datos separados.
   * Scripts interactivos separados.
   * Documentación separada.

6. **Docker como entorno principal**

   * No depender de Node/npm instalados en Windows.
   * Usar Docker Compose para dev, QA, preview y producción local.

7. **Seguridad por defecto**

   * No secretos en frontend.
   * No `.env` en repositorio o ZIP.
   * No repos privados enlazados.
   * No backend simulado.

8. **Evidencia antes de release**

   * No declarar producción si no pasa QA.
   * No ocultar errores de `astro check`.
   * No eliminar quality gates para “hacer pasar” build.

## 4. Decisión de framework

Se eligió **Astro** porque el proyecto necesita:

* páginas públicas;
* SEO;
* generación estática;
* rutas multidioma;
* componentes reutilizables;
* bajo JavaScript en cliente;
* interactividad puntual para el logo 3D;
* estructura mantenible para crecer hacia web de empresa.

Astro encaja mejor que una SPA pura porque el contenido principal debe ser indexable y estar disponible como HTML.

No se eligió Next.js en esta fase porque actualmente no hay:

* backend;
* autenticación;
* dashboard;
* datos server-side dinámicos;
* panel privado;
* API propia;
* sesiones;
* pagos.

Si en el futuro se añaden esas necesidades, se podrá reevaluar la arquitectura.

## 5. Estructura general del proyecto

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

## 6. Directorios principales

### `src/layouts/`

Contiene layouts globales.

Archivo principal:

```text
src/layouts/BaseLayout.astro
```

Responsabilidades:

* estructura HTML común;
* `<html lang>`;
* `<head>`;
* `title`;
* `meta description`;
* `canonical`;
* `hreflang`;
* Open Graph básico;
* header;
* footer;
* slot de contenido;
* skip link.

No debe contener lógica específica de una página concreta.

### `src/components/`

Contiene componentes reutilizables de UI.

Componentes principales:

```text
Button.astro
CardGrid.astro
ContactForm.astro
Footer.astro
Header.astro
Hero3D.astro
LanguageSwitcher.astro
Navigation.astro
PageHero.astro
ProjectCard.astro
SkillCard.astro
```

Regla: si una estructura se usa en varias páginas o representa una pieza visual estable, debe ser componente.

### `src/data/`

Contiene datos de contenido y configuración.

Archivos esperados:

```text
navigation.ts
pageContent.ts
projects.ts
site.ts
skills.ts
```

Responsabilidades:

* textos de páginas;
* proyectos;
* habilidades;
* configuración global;
* URLs públicas;
* datos que no deberían estar duplicados en componentes.

### `src/i18n/`

Contiene configuración internacional.

Archivos principales:

```text
config.ts
routes.ts
ui.ts
```

Responsabilidades:

* idiomas soportados;
* rutas localizadas;
* slugs traducidos;
* labels de navegación;
* textos UI reutilizables.

### `src/pages/`

Contiene las rutas generadas por Astro.

La arquitectura actual usa una página dinámica:

```text
src/pages/[locale]/[...slug].astro
```

y sitemap:

```text
src/pages/sitemap.xml.ts
```

No se recomienda crear manualmente 24 páginas duplicadas para cada idioma y sección. Eso aumentaría mantenimiento y riesgo de inconsistencia.

### `src/scripts/`

Contiene scripts cliente.

Archivo principal:

```text
src/scripts/hero3d.ts
```

Responsabilidades:

* inicializar Three.js;
* cargar el modelo GLB;
* aplicar material metálico;
* animar rotación;
* aplicar parallax;
* animar luces;
* ajustar cámara para evitar recorte;
* fallback si falla WebGL o modelo;
* limpieza de recursos.

### `src/assets/`

Contiene estilos globales y modulares.

Archivos esperados:

```text
global.css
tokens.css
components.css
pages.css
hero3d.css
```

`global.css` debe importar el resto.

### `public/`

Contiene assets públicos servidos directamente.

Assets principales:

```text
public/logo/iocode-logo.svg
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
public/favicon.svg
public/robots.txt
```

No debe contener carpetas antiguas como:

```text
public/Logo/
public/logo/3D/
```

Docker/Linux distingue mayúsculas y minúsculas. La ruta correcta es:

```text
public/logo/3d/
```

No:

```text
public/logo/3D/
```

### `Docker/`

Contiene Dockerfiles, servidor Node y scripts auxiliares.

Archivos principales:

```text
Docker/Dockerfile
Docker/Dockerfile.dev
Docker/node-static-server.mjs
Docker/scripts/
```

El archivo Compose válido vive en la raíz:

```text
compose.yml
```

No debe usarse:

```text
Docker/compose.yml
Docker/.env
```

## 7. Flujo de renderizado

El flujo conceptual es:

```text
src/i18n/routes.ts
        ↓
getStaticRouteParams()
        ↓
src/pages/[locale]/[...slug].astro
        ↓
pageContent / projects / skills / ui
        ↓
BaseLayout.astro
        ↓
Header + Navigation + LanguageSwitcher + Footer
        ↓
HTML estático generado por Astro
        ↓
dist/
        ↓
Docker/node-static-server.mjs en producción local
```

## 8. Modelo de rutas

La arquitectura usa rutas reales por idioma:

```text
/es/
/en/
/de/
```

Cada página tiene su slug traducido.

Ejemplo:

```text
/es/servicios/
/en/services/
/de/leistungen/
```

La fuente de verdad vive en:

```text
src/i18n/routes.ts
```

Este archivo debe definir:

* `Locale`;
* `RouteKey`;
* `routeAlternates`;
* `navigationRouteKeys`;
* `getLocalizedPath`;
* `getAlternatePaths`;
* `getStaticRouteParams`.

## 9. Tabla `routeAlternates`

`routeAlternates` es una pieza crítica de la arquitectura.

Motivo: no basta con reemplazar `/es/` por `/en/`, porque los slugs cambian por idioma.

Incorrecto:

```text
/es/servicios/
→ /en/servicios/
```

Correcto:

```text
/es/servicios/
→ /en/services/
```

Cada entrada debe contener:

```ts
{
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

Regla: cualquier nueva página debe añadirse primero a `routeAlternates`.

## 10. Páginas generadas

La build actual debe generar 26 páginas.

Rutas principales:

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

/sitemap.xml
```

Si el número de páginas generadas cambia, debe revisarse si fue intencional.

## 11. Layout global

`BaseLayout.astro` debe recibir:

```ts
type Props = {
  locale: Locale;
  routeKey: RouteKey;
  title: string;
  description: string;
};
```

Responsabilidades:

* resolver canonical con `getLocalizedPath(routeKey, locale)`;
* resolver alternates con `getAlternatePaths(routeKey)`;
* imprimir `hreflang`;
* imprimir `x-default`;
* aplicar `<html lang={locale}>`;
* renderizar header;
* renderizar footer;
* renderizar contenido con `<slot />`.

No debe contener datos hardcodeados de una página concreta.

## 12. Header y navegación

### `Header.astro`

Responsabilidades:

* renderizar logo;
* enlazar a la home del idioma actual;
* incluir `Navigation`;
* incluir `LanguageSwitcher`.

No debe duplicar manualmente enlaces.

### `Navigation.astro`

Debe usar datos centralizados desde:

```text
src/data/navigation.ts
```

o directamente desde:

```text
src/i18n/routes.ts
```

Debe marcar la ruta activa usando `activeKey`.

### `LanguageSwitcher.astro`

Debe usar:

```text
getAlternatePaths(activeKey)
```

No debe hacer reemplazos con regex de la URL actual.

Correcto:

```ts
const paths = getAlternatePaths(activeKey);
```

Incorrecto:

```ts
path.replace("/es/", "/en/")
```

## 13. Contenido por idioma

El contenido principal vive en:

```text
src/data/pageContent.ts
```

Este archivo debe tener estructura por idioma y route key:

```ts
pageContent[locale][routeKey]
```

Debe incluir como mínimo:

* `title`;
* `description`;
* `eyebrow`;
* `heading`;
* `intro`;
* `cards` si aplica.

Regla: no duplicar textos grandes dentro de componentes cuando puedan vivir como datos.

## 14. Proyectos

Los proyectos viven en:

```text
src/data/projects.ts
```

Reglas:

* enlazar solo repositorios públicos;
* no enlazar repos privados;
* los casos privados deben aparecer sin URL;
* no prometer producción, seguridad o métricas sin evidencia;
* no incluir datos sensibles;
* no incluir nombres de clientes sin permiso.

Los proyectos deben reforzar el posicionamiento:

```text
software + automatización + datos + IoT + arquitectura
```

## 15. Habilidades

Las habilidades viven en:

```text
src/data/skills.ts
```

Deben reflejar el perfil híbrido:

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

No deben exagerar tecnologías marcadas como básicas o en aprendizaje.

## 16. UI reutilizable

Componentes reutilizables principales:

| Componente          | Uso                          |
| ------------------- | ---------------------------- |
| `Button.astro`      | Botones consistentes         |
| `CardGrid.astro`    | Grids de tarjetas            |
| `PageHero.astro`    | Cabecera de páginas internas |
| `ProjectCard.astro` | Tarjeta de proyecto          |
| `SkillCard.astro`   | Tarjeta de habilidad         |
| `ContactForm.astro` | Contacto                     |
| `Hero3D.astro`      | Hero visual 3D               |

Regla: si cambia la estética de botones, cards o layout común, debe cambiarse en un componente o CSS común, no página por página.

## 17. Hero 3D

El hero 3D se compone de:

```text
src/components/Hero3D.astro
src/scripts/hero3d.ts
src/assets/hero3d.css
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

Requisitos funcionales:

* cargar GLB;
* rotación automática;
* mouse/parallax;
* luces dinámicas;
* material metálico;
* animación de entrada;
* fallback SVG;
* respeto a `prefers-reduced-motion`;
* cámara ajustada para evitar recorte;
* liberación de recursos cuando corresponde.

El asset debe estar en:

```text
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

El navegador debe poder acceder a:

```text
/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

Smoke test:

```powershell
(Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing).StatusCode
```

Resultado esperado:

```text
200
```

## 18. Formulario de contacto

El formulario vive en:

```text
src/components/ContactForm.astro
```

El formulario actual usa `mailto:`.

Implicaciones:

* no envía datos a backend;
* no almacena mensajes;
* no valida en servidor;
* no integra CRM;
* no confirma entrega;
* depende del cliente de correo del usuario.

La UI debe dejar claro que prepara un correo, no que envía a servidor.

No debe pedir:

* contraseñas;
* tokens;
* datos bancarios;
* información sensible.

Si se añade backend real, habrá que rediseñar la arquitectura de seguridad.

## 19. Sitemap

El sitemap vive en:

```text
src/pages/sitemap.xml.ts
```

Debe generarse desde:

```text
src/i18n/routes.ts
```

Regla: no mantener sitemap manual si las rutas ya están en `routeAlternates`.

Validación:

```powershell
(Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing).StatusCode
```

Resultado esperado:

```text
200
```

## 20. Robots.txt

El archivo:

```text
public/robots.txt
```

debe existir y no bloquear todo el sitio salvo decisión explícita.

Debe revisarse antes de publicar.

## 21. Docker

La arquitectura Docker actual usa:

```text
compose.yml
Docker/Dockerfile
Docker/Dockerfile.dev
Docker/node-static-server.mjs
```

### Servicios

| Servicio  | Uso              | Perfil      |
| --------- | ---------------- | ----------- |
| `dev`     | Desarrollo Astro | Sin profile |
| `qa`      | Checks y build   | `qa`        |
| `preview` | Astro preview    | `preview`   |
| `web`     | Producción local | `prod`      |

### Desarrollo

```powershell
docker compose up --build
```

URL:

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

URL:

```text
http://localhost:8080/es/
```

## 22. Servidor Node de producción local

El servidor vive en:

```text
Docker/node-static-server.mjs
```

Responsabilidades:

* servir `dist/`;
* resolver rutas con trailing slash;
* servir assets con MIME correcto;
* servir GLB;
* responder `/health`;
* aplicar cabeceras de seguridad básicas;
* evitar path traversal;
* aplicar caché diferenciada para assets y HTML.

No sustituye necesariamente la configuración final de hosting. En hosting real se deben replicar cabeceras, cache y rutas equivalentes.

## 23. Dev Container

La configuración correcta vive en:

```text
.devcontainer/devcontainer.json
```

No debe vivir en:

```text
Docker/devcontainer/
```

Motivo: VS Code detecta de forma estándar `.devcontainer/devcontainer.json`.

Si VS Code pregunta dónde crear la configuración, elegir:

```text
Add configuration to workspace
```

No elegir:

```text
Add configuration to user data folder
```

Dentro del Dev Container, el workspace debe abrirse en:

```text
/app
```

## 24. CSS y diseño

La estructura de estilos recomendada es:

```text
src/assets/global.css
src/assets/tokens.css
src/assets/components.css
src/assets/pages.css
src/assets/hero3d.css
```

### `tokens.css`

Debe contener variables de diseño:

* colores;
* espaciados;
* radios;
* sombras;
* tipografía base;
* breakpoints si aplica.

### `components.css`

Debe contener estilos reutilizables:

* botones;
* header;
* nav;
* footer;
* cards;
* grids;
* forms;
* tags;
* language switcher.

### `pages.css`

Debe contener composición de páginas.

### `hero3d.css`

Debe contener solo estilos del hero 3D.

Regla: no duplicar estilos de botones o cards por página.

## 25. Seguridad arquitectónica

Estado actual:

* web estática;
* sin backend;
* sin base de datos;
* sin autenticación;
* sin sesiones;
* sin cookies propias;
* sin pagos;
* sin uploads.

Riesgo principal actual:

* publicar archivos sensibles por error;
* enlazar repos privados;
* prometer capacidades que no existen;
* romper rutas SEO;
* publicar assets fuente innecesarios;
* errores en configuración de hosting final;
* dependencias de desarrollo con vulnerabilidades no productivas.

Ver reglas completas en:

```text
SECURITY.md
```

## 26. QA y release

El flujo de release debe incluir:

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

Checklist completo:

```text
QA_CHECKLIST.md
```

No debe considerarse release listo si el QA está incompleto.

## 27. No-go arquitectónicos

No continuar a publicación si ocurre cualquiera:

* `npm run check` falla;
* `npm run build` falla;
* `npm audit --omit=dev` detecta vulnerabilidades productivas sin resolver;
* el GLB devuelve 404;
* el selector de idioma genera slugs incorrectos;
* el formulario promete backend sin backend;
* hay `.env` en el repositorio o ZIP;
* hay `.git/` en el entregable;
* hay `node_modules/` en el ZIP fuente;
* hay `.astro/` en el ZIP fuente;
* hay `public/logo/3D` en vez de `public/logo/3d`;
* la documentación menciona comandos obsoletos como `Docker/compose.yml` o `Docker/.env`;
* se publican repos privados;
* se publica información sensible.

## 28. Cómo añadir una nueva página

Pasos obligatorios:

1. Añadir nueva clave en `RouteKey` dentro de `src/i18n/routes.ts`.
2. Añadir entrada completa en `routeAlternates`.
3. Añadir label por idioma.
4. Añadir slug por idioma.
5. Añadir path por idioma.
6. Añadir contenido en `src/data/pageContent.ts`.
7. Actualizar navegación si la página debe aparecer en menú.
8. Validar build.
9. Validar sitemap.
10. Validar `hreflang`.
11. Validar selector de idioma.

No crear páginas aisladas duplicadas por idioma salvo razón documentada.

## 29. Cómo añadir un nuevo idioma

Pasos obligatorios:

1. Añadir locale en `src/i18n/config.ts`.
2. Añadir labels en `src/i18n/ui.ts`.
3. Añadir rutas en `src/i18n/routes.ts`.
4. Añadir contenido en `src/data/pageContent.ts`.
5. Añadir proyectos en `src/data/projects.ts`.
6. Añadir habilidades en `src/data/skills.ts`.
7. Actualizar `BaseLayout.astro` si hay textos comunes.
8. Actualizar QA de rutas.
9. Revisar traducciones con hablante competente o herramienta profesional.
10. Validar `hreflang` y sitemap.

## 30. Cómo cambiar el logo

SVG principal:

```text
public/logo/iocode-logo.svg
```

Modelo 3D:

```text
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

Después de cambiar el GLB:

1. Ejecutar desarrollo.
2. Ejecutar producción local.
3. Smoke test HTTP del GLB.
4. Revisar visualmente que no se recorta.
5. Revisar fallback.
6. Revisar rendimiento.

## 31. Cómo cambiar navegación

La navegación se controla desde rutas centralizadas.

Archivos relevantes:

```text
src/i18n/routes.ts
src/data/navigation.ts
src/components/Navigation.astro
```

No editar menú página por página.

## 32. Cómo cambiar contenido

Textos de páginas:

```text
src/data/pageContent.ts
```

Proyectos:

```text
src/data/projects.ts
```

Habilidades:

```text
src/data/skills.ts
```

Datos globales:

```text
src/data/site.ts
```

Textos UI comunes:

```text
src/i18n/ui.ts
```

## 33. Futuras evoluciones

La arquitectura permite crecer hacia:

* backend de contacto;
* CRM;
* blog técnico;
* casos de estudio;
* panel privado;
* analítica;
* CI/CD;
* hosting real;
* formularios con validación server-side;
* automatización de Lighthouse/Playwright;
* integración con CMS.

Pero cada evolución debe tener revisión de:

* arquitectura;
* seguridad;
* QA;
* documentación;
* privacidad si hay datos personales;
* despliegue si cambia runtime.

## 34. Decisiones abiertas

| Tema                       | Estado          | Comentario                             |
| -------------------------- | --------------- | -------------------------------------- |
| Hosting final              | Pendiente       | Docker local no sustituye hosting real |
| Backend de contacto        | No implementado | Actualmente `mailto:`                  |
| Analítica                  | No implementada | Revisar privacidad si se añade         |
| CI/CD                      | Pendiente       | Recomendado antes de publicar en serio |
| Pruebas E2E                | Pendiente       | Recomendado Playwright                 |
| Lighthouse                 | Pendiente       | Recomendado antes de release público   |
| Revisión profesional EN/DE | Pendiente       | Recomendado antes de uso comercial     |

## 35. Resumen de arquitectura

La arquitectura actual se resume así:

```text
Astro genera HTML estático multidioma
        ↓
routeAlternates controla rutas SEO
        ↓
BaseLayout centraliza SEO/header/footer
        ↓
Componentes reutilizan UI
        ↓
Datos viven en src/data y src/i18n
        ↓
Three.js solo se usa en Hero3D
        ↓
Docker estandariza dev/QA/preview/prod local
        ↓
QA_CHECKLIST bloquea release si falta evidencia
```

El diseño es adecuado para una web profesional estática con identidad técnica, SEO internacional y base mantenible para crecimiento futuro.

No debe considerarse validado para publicación real hasta completar `QA_CHECKLIST.md` en el entorno final.

```
```
