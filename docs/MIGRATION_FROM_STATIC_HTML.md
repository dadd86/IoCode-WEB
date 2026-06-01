# MIGRATION_FROM_STATIC_HTML.md

Guía de migración desde HTML estático hacia la arquitectura Astro actual de IoCode SOLUTIONS Web.

## 1. Propósito

Este documento explica cómo se migró el proyecto IoCode SOLUTIONS Web desde una estructura HTML/CSS/JavaScript estática hacia una arquitectura profesional basada en:

```text
Astro + TypeScript + Docker Compose + Three.js + rutas multidioma reales
```

La migración busca resolver problemas de mantenibilidad, SEO, reutilización de componentes, consistencia visual, documentación, QA y preparación futura para una web de empresa.

## 2. Estado de partida

La versión inicial era una web estática basada en archivos sueltos:

```text
index.html
servicios.html
proyectos.html
habilidades.html
proceso.html
contacto.html
automatizacion-plc.html
robotica-industrial.html
css/
js/
Logo/
```

Esta estructura podía funcionar para una web pequeña, pero presentaba límites importantes para el objetivo actual del proyecto.

## 3. Problemas de la arquitectura anterior

### 3.1 Duplicación de navegación

El header, el menú, el logo, el footer y los botones podían terminar repetidos en cada página.

Riesgo:

```text
Cambiar una opción del menú obliga a editar muchos archivos.
```

Consecuencia:

* inconsistencias visuales;
* enlaces rotos;
* mayor probabilidad de errores;
* mantenimiento más lento.

### 3.2 Internacionalización limitada

La solución anterior basada en cambiar textos con JavaScript o `localStorage` no era suficiente para SEO internacional serio.

Problema:

```text
/es/servicios/
```

no puede convertirse correctamente en:

```text
/en/services/
```

solo reemplazando el prefijo `/es/` por `/en/`.

### 3.3 SEO débil

Una web que cambia textos solo en cliente no ofrece la misma calidad SEO que una web con rutas reales por idioma.

Faltaban garantías fuertes para:

* `canonical`;
* `hreflang`;
* `sitemap.xml`;
* slugs traducidos;
* páginas indexables por idioma.

### 3.4 Reutilización insuficiente

La versión HTML plana podía tener clases CSS compartidas, pero no componentes reales.

Faltaban componentes como:

* `Button`;
* `Header`;
* `Footer`;
* `Navigation`;
* `LanguageSwitcher`;
* `ProjectCard`;
* `SkillCard`;
* `PageHero`;
* `Hero3D`.

### 3.5 Escalabilidad limitada

Para una web de freelancer simple, HTML plano puede bastar. Para una web que debe evolucionar a página de empresa, la duplicación y falta de estructura empiezan a ser un riesgo.

### 3.6 Documentación inconsistente

La documentación anterior podía mencionar comandos obsoletos como:

```text
python -m http.server
Docker/compose.yml
Docker/.env
```

pero la arquitectura actual usa:

```text
Astro
Docker Compose en raíz
Dev Container
Node runtime local
```

## 4. Objetivo de la migración

La migración busca conseguir:

```text
web profesional + SEO multidioma + componentes reutilizables + Docker + QA + documentación coherente
```

Objetivos concretos:

* separar páginas por idioma con rutas reales;
* evitar duplicar header/footer/nav;
* centralizar rutas;
* centralizar contenido;
* usar componentes reutilizables;
* mantener estética consistente;
* integrar logo 3D;
* usar Docker como entorno principal;
* documentar ejecución, seguridad, arquitectura y QA;
* preparar el proyecto para crecer.

## 5. Arquitectura destino

La arquitectura destino es:

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

## 6. Decisión principal: Astro

Se adopta Astro porque el proyecto necesita:

* HTML estático;
* buen SEO;
* rutas reales;
* layout común;
* componentes reutilizables;
* interactividad puntual;
* bajo JavaScript en cliente;
* facilidad de despliegue;
* mantenimiento claro.

Astro permite generar páginas estáticas y mantener una estructura moderna sin convertir la web en una SPA innecesaria.

## 7. De páginas HTML duplicadas a rutas generadas

### Antes

```text
index.html
servicios.html
proyectos.html
habilidades.html
contacto.html
```

### Ahora

```text
src/pages/[locale]/[...slug].astro
```

La generación de rutas se controla desde:

```text
src/i18n/routes.ts
```

Esto evita crear manualmente tres versiones físicas de cada página.

## 8. De URLs planas a rutas multidioma reales

### Antes

Posibles URLs:

```text
index.html
servicios.html
contacto.html
```

### Ahora

```text
/es/
/en/
/de/

/es/servicios/
/en/services/
/de/leistungen/

/es/contacto/
/en/contact/
/de/kontakt/
```

La web ya no depende de cambiar texto en cliente. Cada idioma tiene una ruta propia.

## 9. De cambio de idioma básico a `routeAlternates`

La pieza central de la nueva arquitectura es:

```text
src/i18n/routes.ts
```

con:

```text
routeAlternates
```

Ejemplo:

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

Esto evita errores como:

```text
/en/servicios/
```

y permite generar correctamente:

```text
/en/services/
```

## 10. De menú duplicado a navegación centralizada

### Antes

El menú podía repetirse en cada HTML.

### Ahora

La navegación se genera desde:

```text
src/i18n/routes.ts
src/data/navigation.ts
src/components/Navigation.astro
```

El header se gestiona desde:

```text
src/components/Header.astro
```

El layout global desde:

```text
src/layouts/BaseLayout.astro
```

Resultado:

```text
Cambiar un enlace del menú se hace una vez.
```

## 11. De estilos dispersos a CSS modular

### Antes

```text
css/
```

con riesgo de crecer sin estructura clara.

### Ahora

```text
src/assets/global.css
src/assets/tokens.css
src/assets/components.css
src/assets/pages.css
src/assets/hero3d.css
```

Responsabilidades:

| Archivo          | Uso                                      |
| ---------------- | ---------------------------------------- |
| `tokens.css`     | Variables de diseño                      |
| `components.css` | Botones, cards, nav, footer, formularios |
| `pages.css`      | Layouts de páginas                       |
| `hero3d.css`     | Estilos del hero 3D                      |
| `global.css`     | Punto de entrada de estilos              |

## 12. De botones repetidos a componente `Button`

### Antes

Botones definidos manualmente en cada página.

### Ahora

```text
src/components/Button.astro
```

Beneficio:

* estética consistente;
* menos duplicación;
* cambios centralizados;
* menor riesgo de inconsistencias.

## 13. De contenido embebido a datos centralizados

### Antes

Los textos vivían directamente dentro de cada HTML.

### Ahora

Contenido principal:

```text
src/data/pageContent.ts
```

Textos UI:

```text
src/i18n/ui.ts
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

Esto permite mantener contenido por idioma y reducir duplicación.

## 14. De logo disperso a assets normalizados

### Antes

```text
Logo/
public/Logo/
public/logo/3D/
```

### Ahora

Rutas finales:

```text
public/logo/iocode-logo.svg
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

Regla importante:

```text
Docker/Linux distingue mayúsculas y minúsculas.
```

Correcto:

```text
public/logo/3d/
```

Incorrecto:

```text
public/logo/3D/
```

## 15. De banner estático a Hero 3D

### Antes

Banner visual estático o con efectos CSS/JS simples.

### Ahora

```text
src/components/Hero3D.astro
src/scripts/hero3d.ts
src/assets/hero3d.css
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

El hero 3D debe incluir:

* rotación automática;
* mouse/parallax;
* luces dinámicas;
* material metálico;
* animación de entrada;
* fallback SVG;
* respeto a `prefers-reduced-motion`;
* cámara ajustada para no recortar el logo.

## 16. De ejecución con servidor simple a Docker Compose

### Antes

Posible ejecución:

```text
python -m http.server
```

### Ahora

Desarrollo:

```powershell
docker compose up --build
```

QA:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

Producción local:

```powershell
docker compose --profile prod up --build web
```

El Compose válido vive en la raíz:

```text
compose.yml
```

No en:

```text
Docker/compose.yml
```

## 17. De producción local Nginx a servidor Node local

En la arquitectura actual, producción local usa:

```text
Docker/node-static-server.mjs
```

Responsabilidades:

* servir `dist/`;
* responder `/health`;
* servir GLB;
* aplicar headers de seguridad;
* evitar path traversal;
* manejar rutas estáticas;
* aplicar caché razonable.

Esto no implica que el hosting final tenga que usar Node. Es una solución local reproducible para validar el build.

## 18. De entorno local manual a Dev Container

### Antes

Dependencia del entorno local de Windows.

### Ahora

Configuración esperada:

```text
.devcontainer/devcontainer.json
```

Esto permite que VS Code use el entorno Docker del proyecto.

Ruta obsoleta:

```text
Docker/devcontainer/
```

Si VS Code pregunta dónde crear configuración, elegir:

```text
Add configuration to workspace
```

## 19. Archivos que se deben eliminar de la versión antigua

Eliminar si existen:

```text
index.html
servicios.html
proyectos.html
habilidades.html
proceso.html
contacto.html
automatizacion-plc.html
robotica-industrial.html
css/
js/
Logo/
public/Logo/
public/logo/3D/
Docker/compose.yml
Docker/.env
Docker/devcontainer/
```

También eliminar del entregable:

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
Skills/
```

No borrar:

```text
package-lock.json
.env.example
public/logo/iocode-logo.svg
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

## 20. Mapa de migración archivo por archivo

| HTML antiguo               | Arquitectura nueva                                                          |
| -------------------------- | --------------------------------------------------------------------------- |
| `index.html`               | `routeKey: home` en `src/pages/[locale]/[...slug].astro` + `pageContent.ts` |
| `servicios.html`           | `routeKey: services` + `pageContent.ts`                                     |
| `automatizacion-plc.html`  | `routeKey: plc` + `pageContent.ts`                                          |
| `robotica-industrial.html` | `routeKey: robotics` + `pageContent.ts`                                     |
| `proyectos.html`           | `routeKey: projects` + `projects.ts`                                        |
| `habilidades.html`         | `routeKey: skills` + `skills.ts`                                            |
| `proceso.html`             | `routeKey: process` + `pageContent.ts`                                      |
| `contacto.html`            | `routeKey: contact` + `ContactForm.astro`                                   |
| Header repetido            | `Header.astro`                                                              |
| Menú repetido              | `Navigation.astro` + `routes.ts`                                            |
| Selector idioma básico     | `LanguageSwitcher.astro` + `routeAlternates`                                |
| Footer repetido            | `Footer.astro`                                                              |
| Botones repetidos          | `Button.astro`                                                              |
| Cards repetidas            | `CardGrid.astro`, `ProjectCard.astro`, `SkillCard.astro`                    |
| JS del logo 3D             | `src/scripts/hero3d.ts`                                                     |
| CSS global antiguo         | `src/assets/*.css`                                                          |

## 21. Pasos recomendados de migración

### Paso 1: Congelar la versión antigua

Guardar una copia de referencia, pero no mezclarla con el proyecto Astro.

No dejar HTML antiguo activo en la raíz.

### Paso 2: Crear estructura Astro

Validar que existan:

```text
astro.config.mjs
package.json
package-lock.json
tsconfig.json
src/
public/
```

### Paso 3: Migrar assets finales

Mover:

```text
Logo/logo_iocode_solutions_vectorizado_recortado.svg
→ public/logo/iocode-logo.svg
```

Mover:

```text
Logo/3D/iocode_solutions_logo_extruded_3d.glb
→ public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

Eliminar fuentes innecesarias de producción.

### Paso 4: Crear rutas i18n

Crear o actualizar:

```text
src/i18n/config.ts
src/i18n/routes.ts
src/i18n/ui.ts
```

Asegurar:

```text
/es/
/en/
/de/
```

y slugs traducidos.

### Paso 5: Migrar contenido

Mover textos a:

```text
src/data/pageContent.ts
src/data/projects.ts
src/data/skills.ts
```

No dejar páginas con contenido hardcodeado innecesario.

### Paso 6: Crear componentes

Crear componentes reutilizables:

```text
Header.astro
Footer.astro
Navigation.astro
LanguageSwitcher.astro
Button.astro
PageHero.astro
CardGrid.astro
ProjectCard.astro
SkillCard.astro
ContactForm.astro
Hero3D.astro
```

### Paso 7: Crear layout

Crear:

```text
src/layouts/BaseLayout.astro
```

con:

* `lang`;
* `canonical`;
* `hreflang`;
* header;
* footer;
* slot.

### Paso 8: Crear generación dinámica

Crear:

```text
src/pages/[locale]/[...slug].astro
```

usando:

```text
getStaticRouteParams()
```

### Paso 9: Crear Docker

Mantener:

```text
compose.yml
Docker/Dockerfile
Docker/Dockerfile.dev
Docker/node-static-server.mjs
```

### Paso 10: Reescribir documentación

Actualizar:

```text
README.md
RUN_GUIDE.md
SECURITY.md
QA_CHECKLIST.md
docs/ARCHITECTURE.md
docs/I18N.md
docs/MAINTENANCE.md
docs/MIGRATION_FROM_STATIC_HTML.md
```

## 22. Validación tras migración

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

Rutas principales:

```powershell
(Invoke-WebRequest "http://localhost:8080/es/" -UseBasicParsing).StatusCode
(Invoke-WebRequest "http://localhost:8080/en/" -UseBasicParsing).StatusCode
(Invoke-WebRequest "http://localhost:8080/de/" -UseBasicParsing).StatusCode
```

Resultado esperado:

```text
200
```

## 23. Validación de rutas migradas

Probar:

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

## 24. Validación del selector de idioma

Probar manualmente:

| Origen                | Acción | Esperado                   |
| --------------------- | ------ | -------------------------- |
| `/es/servicios/`      | EN     | `/en/services/`            |
| `/es/servicios/`      | DE     | `/de/leistungen/`          |
| `/en/plc-automation/` | ES     | `/es/automatizacion-plc/`  |
| `/en/plc-automation/` | DE     | `/de/sps-automatisierung/` |
| `/de/kontakt/`        | ES     | `/es/contacto/`            |
| `/de/kontakt/`        | EN     | `/en/contact/`             |

No aceptar rutas mixtas como:

```text
/en/servicios/
/de/contacto/
```

## 25. Validación de SEO tras migración

En cada página importante revisar:

* `title`;
* `meta description`;
* `canonical`;
* `hreflang es`;
* `hreflang en`;
* `hreflang de`;
* `hreflang x-default`;
* `html lang`;
* sitemap.

No publicar si `canonical` apunta siempre a español o si `hreflang` no apunta a la página equivalente.

## 26. Validación del logo 3D tras migración

Comprobar HTTP:

```powershell
(Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing).StatusCode
```

Debe devolver:

```text
200
```

Comprobar visualmente:

* carga;
* gira;
* no se recorta;
* responde al mouse;
* tiene material metálico;
* tiene luces dinámicas;
* no bloquea el contenido;
* tiene fallback si falla.

## 27. Validación de formulario tras migración

El formulario debe seguir usando `mailto:` mientras no exista backend.

Debe mostrar claramente:

```text
Este formulario prepara un correo en tu cliente de email; no envía datos a un servidor.
```

No debe mostrar:

```text
Mensaje enviado correctamente
Solicitud guardada
Formulario enviado
```

si no hay backend real.

## 28. Riesgos de migración

| Riesgo                           | Impacto                           | Mitigación                                                            |
| -------------------------------- | --------------------------------- | --------------------------------------------------------------------- |
| Rutas antiguas quedan publicadas | SEO duplicado o roto              | Eliminar HTML antiguo y definir redirecciones si ya había publicación |
| Slugs mal traducidos             | Selector de idioma roto           | Usar `routeAlternates`                                                |
| Assets con mayúsculas            | 404 en Docker/Linux               | Usar `public/logo/3d`                                                 |
| Documentación vieja              | Errores operativos                | Actualizar docs raíz y `docs/`                                        |
| `.env` publicado                 | Riesgo de secretos                | Mantener `.env` fuera de Git/ZIP                                      |
| `node_modules` en ZIP            | Entregable pesado e inconsistente | Excluir                                                               |
| Formulario mal descrito          | Expectativa falsa                 | Documentar `mailto:`                                                  |
| Traducciones incompletas         | Mala calidad profesional          | Revisar `en` y `de`                                                   |

## 29. No-go de migración

No considerar la migración cerrada si:

* quedan HTML antiguos activos en la raíz;
* queda `css/` o `js/` antiguo como fuente principal;
* se usa `Docker/compose.yml`;
* se usa `Docker/.env`;
* falta `routeAlternates`;
* el selector de idioma usa reemplazo simple de URL;
* falta contenido en `en` o `de`;
* el GLB devuelve 404;
* `astro check` falla;
* `astro build` falla;
* `npm audit --omit=dev` detecta vulnerabilidades productivas sin resolver;
* la documentación sigue mencionando comandos antiguos;
* hay `.env`, `.git`, `node_modules` o `.astro` en el entregable fuente.

## 30. Checklist de cierre de migración

```text
[ ] HTML antiguo eliminado de la raíz
[ ] CSS antiguo migrado a src/assets
[ ] JS antiguo migrado o eliminado
[ ] Logo SVG en public/logo/iocode-logo.svg
[ ] GLB en public/logo/3d/
[ ] public/Logo eliminado
[ ] public/logo/3D eliminado
[ ] routeAlternates completo
[ ] pageContent completo
[ ] projects completo
[ ] skills completo
[ ] ui completo
[ ] BaseLayout activo
[ ] Header/Footer reutilizables
[ ] Navigation reutilizable
[ ] LanguageSwitcher usa getAlternatePaths
[ ] sitemap generado desde rutas
[ ] robots.txt revisado
[ ] Docker Compose en raíz
[ ] Docker/.env no usado
[ ] Dev Container en .devcontainer/
[ ] QA pasa
[ ] Prod local pasa
[ ] GLB HTTP 200
[ ] Revisión visual completada
[ ] Docs actualizadas
```

## 31. Resultado esperado

Después de la migración, el proyecto debe poder ejecutarse así:

```powershell
docker compose up --build
```

QA:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

Producción local:

```powershell
docker compose --profile prod up --build web
```

Y la web debe estar disponible en:

```text
http://localhost:4321/es/
http://localhost:8080/es/
```

## 32. Conclusión

La migración desde HTML estático a Astro no es solo un cambio de framework. Es una mejora estructural para conseguir:

```text
mantenibilidad + SEO internacional + componentes reutilizables + Docker + QA + seguridad documental
```

La versión migrada debe mantener una arquitectura clara:

```text
rutas en src/i18n
contenido en src/data
UI en src/components
estilos en src/assets
assets finales en public/logo
ejecución en Docker Compose raíz
documentación en README/RUN_GUIDE/SECURITY/QA/docs
```

No debe considerarse cerrada hasta que `QA_CHECKLIST.md` esté completado con evidencia.

```
```
