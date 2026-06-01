# QA_CHECKLIST.md

Checklist de validación para IoCode SOLUTIONS Web.

Este documento debe completarse antes de publicar, entregar, empaquetar o considerar estable una nueva versión del proyecto.

## Estado del documento

| Campo                     | Valor                                        |
| ------------------------- | -------------------------------------------- |
| Proyecto                  | IoCode SOLUTIONS Web                         |
| Stack                     | Astro + TypeScript + Docker + Three.js       |
| Tipo                      | Web estática multidioma                      |
| Entorno principal         | Docker Compose                               |
| Compose válido            | `compose.yml` en la raíz                     |
| Servidor producción local | `Docker/node-static-server.mjs`              |
| Última revisión           | Pendiente de actualizar por quien ejecute QA |
| Responsable QA            | Pendiente                                    |
| Resultado final           | PENDING                                      |

## Convenciones de estado

Usar solo estos valores:

```text
PASS
FAIL
N/A
PENDING
```

No marcar `PASS` si la prueba no se ha ejecutado.

---

## 1. Pre-flight del entorno

| Prueba                     | Comando / revisión                          | Resultado esperado     | Estado  |
| -------------------------- | ------------------------------------------- | ---------------------- | ------- |
| Docker Desktop activo      | `docker --version`                          | Muestra versión        | PENDING |
| Docker Compose activo      | `docker compose version`                    | Muestra versión        | PENDING |
| Ubicación correcta         | `Get-Location`                              | Ruta raíz del proyecto | PENDING |
| Compose en raíz            | `Test-Path compose.yml`                     | `True`                 | PENDING |
| `package.json` existe      | `Test-Path package.json`                    | `True`                 | PENDING |
| `package-lock.json` existe | `Test-Path package-lock.json`               | `True`                 | PENDING |
| Config Astro existe        | `Test-Path astro.config.mjs`                | `True`                 | PENDING |
| TypeScript config existe   | `Test-Path tsconfig.json`                   | `True`                 | PENDING |
| Código fuente existe       | `Test-Path src`                             | `True`                 | PENDING |
| Assets públicos existen    | `Test-Path public`                          | `True`                 | PENDING |
| Docker folder existe       | `Test-Path Docker`                          | `True`                 | PENDING |
| Dev Container existe       | `Test-Path .devcontainer/devcontainer.json` | `True`                 | PENDING |

---

## 2. Estructura crítica del proyecto

| Ruta                                                   | Resultado esperado                           | Estado  |
| ------------------------------------------------------ | -------------------------------------------- | ------- |
| `compose.yml`                                          | Existe en la raíz                            | PENDING |
| `Docker/Dockerfile`                                    | Existe                                       | PENDING |
| `Docker/Dockerfile.dev`                                | Existe                                       | PENDING |
| `Docker/node-static-server.mjs`                        | Existe                                       | PENDING |
| `.devcontainer/devcontainer.json`                      | Existe                                       | PENDING |
| `Docker/devcontainer/`                                 | No existe                                    | PENDING |
| `public/logo/iocode-logo.svg`                          | Existe                                       | PENDING |
| `public/logo/3d/iocode_solutions_logo_extruded_3d.glb` | Existe                                       | PENDING |
| `public/logo/3D/`                                      | No existe                                    | PENDING |
| `public/Logo/`                                         | No existe                                    | PENDING |
| `.env.example`                                         | Existe                                       | PENDING |
| `.env`                                                 | No debe estar en repositorio ni ZIP          | PENDING |
| `.git/`                                                | No debe estar en ZIP                         | PENDING |
| `node_modules/`                                        | No debe estar en ZIP                         | PENDING |
| `.astro/`                                              | No debe estar en ZIP                         | PENDING |
| `dist/`                                                | No debe estar en ZIP salvo entrega explícita | PENDING |
| `Skills/`                                              | No debe estar en ZIP ni deploy               | PENDING |
| ZIPs internos                                          | No deben estar incluidos                     | PENDING |

Comandos rápidos:

```powershell
Test-Path compose.yml
Test-Path Docker/Dockerfile
Test-Path Docker/Dockerfile.dev
Test-Path Docker/node-static-server.mjs
Test-Path .devcontainer/devcontainer.json
Test-Path public/logo/iocode-logo.svg
Test-Path public/logo/3d/iocode_solutions_logo_extruded_3d.glb
Test-Path public/logo/3D
Test-Path public/Logo
Test-Path .env
Test-Path .git
Test-Path node_modules
Test-Path .astro
Test-Path dist
Test-Path Skills
```

Para un ZIP fuente limpio, deben devolver `False`:

```text
public/logo/3D
public/Logo
.env
.git
node_modules
.astro
dist
Skills
```

---

## 3. Docker Compose

| Prueba                         | Comando                                                               | Resultado esperado              | Estado  |
| ------------------------------ | --------------------------------------------------------------------- | ------------------------------- | ------- |
| Config base válida             | `docker compose config`                                               | Sin errores                     | PENDING |
| Config con perfiles válida     | `docker compose --profile qa --profile preview --profile prod config` | Sin errores                     | PENDING |
| Servicio `dev` por defecto     | Revisar `compose.yml`                                                 | `dev` no tiene `profiles`       | PENDING |
| Servicio `qa` con profile      | Revisar `compose.yml`                                                 | `qa` usa profile `qa`           | PENDING |
| Servicio `preview` con profile | Revisar `compose.yml`                                                 | `preview` usa profile `preview` | PENDING |
| Servicio `web` con profile     | Revisar `compose.yml`                                                 | `web` usa profile `prod`        | PENDING |
| Node en contenedor             | `docker compose run --rm dev node --version`                          | Muestra versión                 | PENDING |
| npm en contenedor              | `docker compose run --rm dev npm --version`                           | Muestra versión                 | PENDING |

---

## 4. Desarrollo local

Ejecutar:

```powershell
docker compose up --build
```

| Prueba               | URL / revisión              | Resultado esperado           | Estado  |
| -------------------- | --------------------------- | ---------------------------- | ------- |
| Servidor dev arranca | Logs                        | Astro listo en puerto `4321` | PENDING |
| Home ES dev          | `http://localhost:4321/es/` | Carga                        | PENDING |
| Home EN dev          | `http://localhost:4321/en/` | Carga                        | PENDING |
| Home DE dev          | `http://localhost:4321/de/` | Carga                        | PENDING |
| Hot reload           | Editar CSS/texto            | Navegador actualiza          | PENDING |
| Sin errores terminal | Terminal Docker             | Sin errores críticos         | PENDING |
| Sin errores consola  | DevTools navegador          | Sin errores críticos         | PENDING |

Abrir:

```powershell
Start-Process "http://localhost:4321/es/"
```

---

## 5. QA automatizado

Ejecutar siempre reconstruyendo QA cuando haya dudas de caché:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

| Prueba               | Resultado esperado                  | Estado  |
| -------------------- | ----------------------------------- | ------- |
| `node --version`     | Muestra versión                     | PENDING |
| `npm --version`      | Muestra versión                     | PENDING |
| `npm run check`      | `0 errors`, `0 warnings`, `0 hints` | PENDING |
| `npm run build`      | Build completo                      | PENDING |
| Páginas generadas    | 26 páginas                          | PENDING |
| `npm run audit:prod` | `found 0 vulnerabilities`           | PENDING |
| Salida final QA      | Sin errores                         | PENDING |

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

Si QA falla con errores antiguos pero producción pasa, reconstruir:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

---

## 6. Producción local

Ejecutar:

```powershell
docker compose --profile prod up --build web
```

| Prueba         | URL / comando                                    | Resultado esperado               | Estado  |
| -------------- | ------------------------------------------------ | -------------------------------- | ------- |
| Build prod     | Logs                                             | `npm run check` pasa             | PENDING |
| Astro build    | Logs                                             | 26 páginas generadas             | PENDING |
| Servidor local | Logs                                             | `running on http://0.0.0.0:8080` | PENDING |
| Home ES prod   | `http://localhost:8080/es/`                      | Carga                            | PENDING |
| Home EN prod   | `http://localhost:8080/en/`                      | Carga                            | PENDING |
| Home DE prod   | `http://localhost:8080/de/`                      | Carga                            | PENDING |
| Healthcheck    | `http://localhost:8080/health`                   | `{"status":"ok"}`                | PENDING |
| GLB 3D         | `/logo/3d/iocode_solutions_logo_extruded_3d.glb` | HTTP 200                         | PENDING |
| Sitemap        | `/sitemap.xml`                                   | HTTP 200                         | PENDING |
| Robots         | `/robots.txt`                                    | HTTP 200                         | PENDING |

Comandos:

```powershell
Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing | Select-Object -ExpandProperty Content
```

```powershell
(Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing).StatusCode
```

```powershell
(Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing).StatusCode
```

```powershell
(Invoke-WebRequest "http://localhost:8080/robots.txt" -UseBasicParsing).StatusCode
```

---

## 7. Rutas multidioma

Validar en desarrollo y producción local.

| Ruta                       | Resultado esperado  | Estado  |
| -------------------------- | ------------------- | ------- |
| `/es/`                     | Home español        | PENDING |
| `/en/`                     | Home inglés         | PENDING |
| `/de/`                     | Home alemán         | PENDING |
| `/es/servicios/`           | Servicios español   | PENDING |
| `/en/services/`            | Services inglés     | PENDING |
| `/de/leistungen/`          | Leistungen alemán   | PENDING |
| `/es/automatizacion-plc/`  | PLC español         | PENDING |
| `/en/plc-automation/`      | PLC inglés          | PENDING |
| `/de/sps-automatisierung/` | SPS alemán          | PENDING |
| `/es/robotica-industrial/` | Robótica español    | PENDING |
| `/en/industrial-robotics/` | Robotics inglés     | PENDING |
| `/de/industrierobotik/`    | Robotik alemán      | PENDING |
| `/es/proyectos/`           | Proyectos español   | PENDING |
| `/en/projects/`            | Projects inglés     | PENDING |
| `/de/projekte/`            | Projekte alemán     | PENDING |
| `/es/habilidades/`         | Habilidades español | PENDING |
| `/en/skills/`              | Skills inglés       | PENDING |
| `/de/faehigkeiten/`        | Fähigkeiten alemán  | PENDING |
| `/es/proceso/`             | Proceso español     | PENDING |
| `/en/process/`             | Process inglés      | PENDING |
| `/de/prozess/`             | Prozess alemán      | PENDING |
| `/es/contacto/`            | Contacto español    | PENDING |
| `/en/contact/`             | Contact inglés      | PENDING |
| `/de/kontakt/`             | Kontakt alemán      | PENDING |

Comandos de ejemplo:

```powershell
(Invoke-WebRequest "http://localhost:8080/es/" -UseBasicParsing).StatusCode
(Invoke-WebRequest "http://localhost:8080/en/" -UseBasicParsing).StatusCode
(Invoke-WebRequest "http://localhost:8080/de/" -UseBasicParsing).StatusCode
(Invoke-WebRequest "http://localhost:8080/es/servicios/" -UseBasicParsing).StatusCode
(Invoke-WebRequest "http://localhost:8080/en/services/" -UseBasicParsing).StatusCode
(Invoke-WebRequest "http://localhost:8080/de/leistungen/" -UseBasicParsing).StatusCode
```

Resultado esperado:

```text
200
```

---

## 8. Selector de idioma

Validar manualmente en navegador.

| Página de origen        | Acción   | Resultado esperado              | Estado  |
| ----------------------- | -------- | ------------------------------- | ------- |
| `/es/`                  | Click EN | Va a `/en/`                     | PENDING |
| `/es/`                  | Click DE | Va a `/de/`                     | PENDING |
| `/es/servicios/`        | Click EN | Va a `/en/services/`            | PENDING |
| `/es/servicios/`        | Click DE | Va a `/de/leistungen/`          | PENDING |
| `/en/plc-automation/`   | Click ES | Va a `/es/automatizacion-plc/`  | PENDING |
| `/en/plc-automation/`   | Click DE | Va a `/de/sps-automatisierung/` | PENDING |
| `/de/industrierobotik/` | Click ES | Va a `/es/robotica-industrial/` | PENDING |
| `/de/industrierobotik/` | Click EN | Va a `/en/industrial-robotics/` | PENDING |
| `/de/kontakt/`          | Click ES | Va a `/es/contacto/`            | PENDING |
| `/de/kontakt/`          | Click EN | Va a `/en/contact/`             | PENDING |

No aceptar como válido un selector que genere rutas incorrectas como:

```text
/en/servicios/
/de/servicios/
```

El selector debe usar las equivalencias de:

```text
src/i18n/routes.ts
```

---

## 9. SEO técnico

| Prueba                   | Resultado esperado                | Estado  |
| ------------------------ | --------------------------------- | ------- |
| `title`                  | Único y descriptivo por página    | PENDING |
| `meta description`       | Existe por página                 | PENDING |
| `canonical`              | Apunta a la ruta actual           | PENDING |
| `hreflang es`            | Apunta a equivalente español      | PENDING |
| `hreflang en`            | Apunta a equivalente inglés       | PENDING |
| `hreflang de`            | Apunta a equivalente alemán       | PENDING |
| `hreflang x-default`     | Apunta a español                  | PENDING |
| `sitemap.xml`            | Existe y devuelve HTTP 200        | PENDING |
| `robots.txt`             | Existe y no bloquea todo el sitio | PENDING |
| Rutas con trailing slash | Consistentes                      | PENDING |
| Slugs traducidos         | Correctos por idioma              | PENDING |

Validar sitemap:

```powershell
(Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing).StatusCode
```

Resultado esperado:

```text
200
```

Revisión manual recomendada en navegador:

```text
View Source
Buscar: canonical
Buscar: hreflang
Buscar: description
```

---

## 10. Logo 3D

| Prueba               | Resultado esperado           | Estado  |
| -------------------- | ---------------------------- | ------- |
| GLB HTTP             | Status 200                   | PENDING |
| Canvas visible       | Se renderiza en home         | PENDING |
| Rotación automática  | El logo gira                 | PENDING |
| Mouse/parallax       | Reacciona al mouse           | PENDING |
| Luces dinámicas      | Brillos cambian suavemente   | PENDING |
| Material metálico    | Apariencia metálica          | PENDING |
| Animación de entrada | Aparece suavemente           | PENDING |
| No recorte           | El logo no se corta al girar | PENDING |
| Fallback SVG         | Visible si falla 3D/WebGL    | PENDING |
| Reduced motion       | No fuerza animación excesiva | PENDING |
| Consola navegador    | Sin errores Three.js         | PENDING |
| Network              | GLB sin 404                  | PENDING |

Comando HTTP:

```powershell
(Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing).StatusCode
```

Resultado esperado:

```text
200
```

Comprobar casing:

```powershell
Test-Path public\logo\3d\iocode_solutions_logo_extruded_3d.glb
Test-Path public\logo\3D
```

Resultado esperado:

```text
True
False
```

---

## 11. Responsive y UI

Probar manualmente en navegador con DevTools.

| Prueba       | Resultado esperado          | Estado  |
| ------------ | --------------------------- | ------- |
| 360px ancho  | Sin scroll horizontal       | PENDING |
| 390px ancho  | Layout legible              | PENDING |
| 768px ancho  | Layout tablet correcto      | PENDING |
| 1024px ancho | Layout desktop correcto     | PENDING |
| 1440px ancho | Layout amplio correcto      | PENDING |
| Header       | No se rompe                 | PENDING |
| Navegación   | Visible y usable            | PENDING |
| Logo header  | Visible                     | PENDING |
| Footer       | Visible y consistente       | PENDING |
| Cards        | No se desbordan             | PENDING |
| Botones      | Estilo consistente          | PENDING |
| Hero 3D      | No tapa texto ni navegación | PENDING |
| Contacto     | Formulario usable en móvil  | PENDING |

---

## 12. Accesibilidad básica

| Prueba                 | Resultado esperado                   | Estado  |
| ---------------------- | ------------------------------------ | ------- |
| Navegación con teclado | Tab recorre elementos interactivos   | PENDING |
| Foco visible           | Se ve claramente                     | PENDING |
| Skip link              | Permite saltar al contenido          | PENDING |
| Headings               | Jerarquía lógica                     | PENDING |
| Links                  | Texto comprensible                   | PENDING |
| Botones                | Tienen texto accesible               | PENDING |
| Imágenes decorativas   | `alt=""` si aplica                   | PENDING |
| Logo                   | `alt` correcto cuando es informativo | PENDING |
| Contraste              | Texto legible                        | PENDING |
| Form labels            | Inputs tienen label asociado         | PENDING |
| Reduced motion         | Respeta preferencias de movimiento   | PENDING |
| Idioma HTML            | `<html lang>` correcto por idioma    | PENDING |

---

## 13. Contacto

| Prueba                   | Resultado esperado                   | Estado  |
| ------------------------ | ------------------------------------ | ------- |
| Formulario visible       | Sí                                   | PENDING |
| Campos requeridos        | Nombre, correo, tipo, mensaje        | PENDING |
| Validación HTML          | Funciona                             | PENDING |
| Submit válido            | Abre cliente de correo con `mailto:` | PENDING |
| Submit inválido          | No prepara correo                    | PENDING |
| Aviso de datos sensibles | Visible                              | PENDING |
| No backend               | La UI no afirma envío a servidor     | PENDING |
| Email                    | Correcto                             | PENDING |
| LinkedIn                 | Abre perfil público                  | PENDING |
| GitHub                   | Abre GitHub público                  | PENDING |
| Enlaces externos         | Usan `rel="noopener noreferrer"`     | PENDING |

No aceptar textos como:

```text
Mensaje enviado
Registro creado
Solicitud guardada
```

si no existe backend real.

---

## 14. Seguridad

| Prueba          | Resultado esperado                                    | Estado  |
| --------------- | ----------------------------------------------------- | ------- |
| `.env`          | No incluido                                           | PENDING |
| `.git/`         | No incluido                                           | PENDING |
| `node_modules/` | No incluido en ZIP                                    | PENDING |
| `.astro/`       | No incluido en ZIP                                    | PENDING |
| `dist/`         | No incluido salvo entrega explícita                   | PENDING |
| ZIPs internos   | No incluidos                                          | PENDING |
| Repos privados  | No enlazados                                          | PENDING |
| Secrets         | No hay secretos en frontend                           | PENDING |
| Assets fuente   | No incluidos innecesariamente                         | PENDING |
| CSP             | Existe en servidor Node                               | PENDING |
| Healthcheck     | Funciona                                              | PENDING |
| Audit prod      | Sin vulnerabilidades productivas                      | PENDING |
| Docker prod     | `read_only`, `tmpfs`, `cap_drop`, `no-new-privileges` | PENDING |

Comando productivo:

```powershell
docker compose run --rm dev npm audit --omit=dev
```

Resultado esperado:

```text
found 0 vulnerabilities
```

No ejecutar automáticamente:

```powershell
npm audit fix --force
```

---

## 15. Servidor Node de producción local

| Prueba         | Resultado esperado                           | Estado  |
| -------------- | -------------------------------------------- | ------- |
| `/health`      | Devuelve JSON `{"status":"ok"}`              | PENDING |
| Rutas HTML     | Sirve `index.html` correcto                  | PENDING |
| Assets CSS/JS  | Sirve con MIME correcto                      | PENDING |
| GLB            | MIME `model/gltf-binary` o descarga correcta | PENDING |
| 404            | No expone rutas internas                     | PENDING |
| Path traversal | No permite salir de `dist/`                  | PENDING |
| Headers        | Seguridad básica aplicada                    | PENDING |
| Cache assets   | Assets con cache control                     | PENDING |
| Cache HTML     | HTML sin cache agresiva                      | PENDING |

---

## 16. Contenido y posicionamiento

| Prueba         | Resultado esperado                                 | Estado  |
| -------------- | -------------------------------------------------- | ------- |
| Home           | Comunica software + PLC + robótica + Industria 4.0 | PENDING |
| Servicios      | No parece blog genérico                            | PENDING |
| PLC            | Tiene página dedicada                              | PENDING |
| Robótica       | Tiene página dedicada                              | PENDING |
| Habilidades    | Refleja perfil híbrido industrial/software         | PENDING |
| Proyectos      | No enlaza repos privados                           | PENDING |
| Casos privados | Presentados sin datos sensibles                    | PENDING |
| LinkedIn       | Enlace correcto                                    | PENDING |
| Textos ES      | Correctos                                          | PENDING |
| Textos EN      | Revisados                                          | PENDING |
| Textos DE      | Revisados                                          | PENDING |

Las traducciones en inglés y alemán deben revisarse antes de una publicación comercial seria.

---

## 17. Documentación

| Archivo                | Resultado esperado                                | Estado  |
| ---------------------- | ------------------------------------------------- | ------- |
| `README.md`            | Describe arquitectura y comandos actuales         | PENDING |
| `RUN_GUIDE.md`         | Explica ejecución Docker actual                   | PENDING |
| `SECURITY.md`          | Política vigente sin claims excesivos             | PENDING |
| `QA_CHECKLIST.md`      | Checklist ejecutable                              | PENDING |
| `docs/ARCHITECTURE.md` | Astro + routeAlternates + componentes             | PENDING |
| `docs/I18N.md`         | Rutas traducidas y hreflang                       | PENDING |
| `docs/MAINTENANCE.md`  | Datos centralizados y mantenimiento               | PENDING |
| `Docker/README.md`     | Sin referencias obsoletas a `Docker/.env` o Nginx | PENDING |
| `.env.example`         | Sin secretos                                      | PENDING |
| `.gitignore`           | Ignora secretos y generados                       | PENDING |
| `.dockerignore`        | Excluye archivos innecesarios                     | PENDING |

---

## 18. Dev Container

| Prueba                            | Resultado esperado                           | Estado  |
| --------------------------------- | -------------------------------------------- | ------- |
| `.devcontainer/devcontainer.json` | Existe                                       | PENDING |
| VS Code                           | Puede reabrir en contenedor                  | PENDING |
| Terminal interna                  | Abre en `/app`                               | PENDING |
| `node --version`                  | Funciona dentro del contenedor               | PENDING |
| `npm --version`                   | Funciona dentro del contenedor               | PENDING |
| `npm run check`                   | Funciona dentro del contenedor               | PENDING |
| VS Code TS                        | No marca falsos errores por falta de `three` | PENDING |
| `Docker/devcontainer/`            | No existe o no se usa                        | PENDING |

---

## 19. Compatibilidad Windows + Docker/Linux

| Prueba             | Resultado esperado                         | Estado  |
| ------------------ | ------------------------------------------ | ------- |
| Rutas de assets    | Minúsculas consistentes                    | PENDING |
| `public/logo/3d`   | Existe                                     | PENDING |
| `public/logo/3D`   | No existe                                  | PENDING |
| Scripts PowerShell | Funcionan                                  | PENDING |
| Scripts `.sh`      | No rompen Linux/macOS                      | PENDING |
| Fin de línea       | No causa errores                           | PENDING |
| `.dockerignore`    | No excluye `package.json`, `src`, `public` | PENDING |
| Compose context    | `context: .`                               | PENDING |

---

## 20. Rendimiento básico

| Prueba      | Resultado esperado             | Estado  |
| ----------- | ------------------------------ | ------- |
| Build Astro | Sin warnings críticos          | PENDING |
| Logo GLB    | Peso razonable                 | PENDING |
| Imágenes    | Optimizadas                    | PENDING |
| CSS         | No excesivo                    | PENDING |
| JS          | Solo necesario                 | PENDING |
| Three.js    | No bloquea contenido principal | PENDING |
| Fallback    | Existe si WebGL falla          | PENDING |
| Mobile      | No se congela por animación    | PENDING |

No marcar rendimiento como `PASS` sin revisar navegador y, preferiblemente, Lighthouse o herramienta equivalente.

---

## 21. Flujo completo antes de release

Ejecutar en este orden:

```powershell
docker compose down -v
docker compose up --build
```

En otra terminal:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

Después:

```powershell
docker compose --profile prod up --build web
```

Smoke tests:

```powershell
Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/sitemap.xml" -UseBasicParsing
Invoke-WebRequest "http://localhost:8080/robots.txt" -UseBasicParsing
```

Revisión visual:

```text
http://localhost:8080/es/
http://localhost:8080/en/
http://localhost:8080/de/
```

---

## 22. No-go conditions

Marcar release como `FAIL` si ocurre cualquiera de estas condiciones:

* `docker compose config` falla.
* `docker compose --profile qa run --rm qa` falla.
* `npm run check` tiene errores.
* `npm run build` falla.
* `npm audit --omit=dev` detecta vulnerabilidades productivas sin resolver.
* El GLB devuelve 404.
* El selector de idioma no conserva equivalencia de página.
* El formulario promete backend sin backend real.
* Hay enlaces a repos privados.
* Hay `.env`, `.git`, `node_modules`, `.astro` o ZIPs internos en el entregable.
* Hay `public/logo/3D` en vez de `public/logo/3d`.
* Hay documentación con comandos obsoletos como `Docker/compose.yml` o `Docker/.env`.
* El logo 3D impide usar la página.
* La web no ha sido revisada visualmente en navegador.
* Las rutas `/es/`, `/en/`, `/de/` no funcionan.
* El contenido contiene información privada o sensible.
* No existe una forma clara de reproducir la ejecución local.

---

## 23. Resultado final

Completar después de ejecutar la validación:

```text
Resultado final: PENDING
Responsable:
Fecha:
Entorno:
Navegadores probados:
Resoluciones probadas:
Notas:
```

## 24. Registro de incidencias

| ID     | Severidad | Descripción                     | Estado  | Responsable | Notas             |
| ------ | --------- | ------------------------------- | ------- | ----------- | ----------------- |
| QA-001 | PENDING   | Pendiente de ejecución completa | PENDING | Pendiente   | Completar tras QA |

## 25. Criterio de aprobación

El proyecto puede considerarse listo para entrega local solo si:

```text
Pre-flight: PASS
Docker Compose: PASS
QA automatizado: PASS
Producción local: PASS
Rutas multidioma: PASS
Selector de idioma: PASS
SEO técnico: PASS
Logo 3D: PASS o fallback aceptado documentado
Contacto: PASS
Seguridad: PASS
Documentación: PASS
Revisión visual: PASS
```

Si alguna sección crítica queda en `FAIL`, el release queda bloqueado.

Si alguna sección queda en `PENDING`, no afirmar que el proyecto está 100% validado.

```
```
