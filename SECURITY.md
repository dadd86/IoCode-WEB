# SECURITY.md

Política de seguridad para IoCode SOLUTIONS Web.

Este documento define reglas de seguridad, privacidad, secretos, dependencias, Docker, publicación y condiciones de bloqueo antes de publicar o entregar el proyecto.

## Estado de seguridad

Este proyecto es una web estática generada con Astro y servida localmente mediante Docker.

La última validación técnica conocida indica:

| Área                      | Estado                                                                 |
| ------------------------- | ---------------------------------------------------------------------- |
| Docker desarrollo         | Operativo                                                              |
| Docker producción local   | Operativo                                                              |
| Astro check en producción | `0 errors`, `0 warnings`, `0 hints`                                    |
| Astro build               | Genera 26 páginas                                                      |
| Healthcheck               | `/health` devuelve `{"status":"ok"}`                                   |
| GLB 3D                    | `/logo/3d/iocode_solutions_logo_extruded_3d.glb` devuelve HTTP 200     |
| Auditoría producción      | `npm audit --omit=dev` sin vulnerabilidades conocidas                  |
| Auditoría completa        | Puede mostrar vulnerabilidades moderadas en dependencias de desarrollo |

No se debe afirmar que el sitio es completamente seguro o production-ready sin ejecutar el checklist completo de `QA_CHECKLIST.md` y revisar el entorno real de despliegue.

## Alcance

Incluido actualmente:

* Astro.
* TypeScript.
* Three.js.
* Docker Compose.
* Servidor estático Node.
* Formulario `mailto:`.
* Rutas multidioma `/es/`, `/en/`, `/de/`.
* Logo SVG.
* Modelo 3D GLB.
* Sitemap.
* Robots.txt.
* Dev Container.

No incluido actualmente:

* Backend.
* Base de datos.
* Autenticación.
* Autorización.
* Panel de administración.
* Pagos.
* Gestión de sesiones.
* Cookies de tracking propias.
* API privada.
* Subida de archivos.
* CRM.
* SMTP backend.
* Almacenamiento de mensajes.
* Analítica externa confirmada.

Si en el futuro se añade cualquiera de esos elementos, este documento debe revisarse antes de publicar.

## Modelo de amenazas actual

### Activos que deben protegerse

* Código fuente.
* Configuración Docker.
* Assets finales.
* Marca IoCode SOLUTIONS.
* Email de contacto.
* Enlaces públicos a GitHub y LinkedIn.
* Reputación profesional.
* Información profesional publicada.
* Integridad de rutas SEO.
* Integridad del contenido multidioma.
* Ausencia de secretos en frontend.

### Límites de confianza

| Componente            | Confianza                        | Observación                                                   |
| --------------------- | -------------------------------- | ------------------------------------------------------------- |
| Navegador del usuario | No confiable                     | Todo lo enviado desde cliente debe tratarse como no confiable |
| Web estática generada | Pública                          | No debe contener secretos                                     |
| Formulario `mailto:`  | Cliente local del usuario        | No garantiza entrega ni almacenamiento                        |
| Docker local          | Entorno de desarrollo/validación | No equivale a hosting real                                    |
| Servidor Node local   | Solo producción local            | No sustituye configuración de hosting definitivo              |
| GitHub público        | Público                          | No debe contener secretos ni repos privados enlazados         |
| LinkedIn              | Externo                          | Solo enlace público                                           |
| Dev Container         | Entorno de desarrollo            | No debe contener secretos reales                              |

## Principios de seguridad

* No incluir secretos en frontend.
* No incluir `.env` en Git ni en ZIPs.
* No incluir `.git/` en entregables.
* No publicar `node_modules/`.
* No publicar `.astro/`.
* No publicar `dist/` salvo entrega explícita de build.
* No publicar ZIPs internos, backups, dumps ni logs.
* No enlazar repositorios privados.
* No publicar rutas internas ni datos sensibles.
* No presentar el formulario como backend si solo usa `mailto:`.
* No ejecutar `npm audit fix --force` sin revisión.
* No desactivar controles de calidad para conseguir que el build pase.
* No tratar validación visual como validación de seguridad.
* No afirmar cumplimiento legal o normativo sin revisión específica.

## Archivos que no deben publicarse

No deben ir a Git ni a entregables:

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
tmp/
temp/
*.zip
*.rar
*.7z
*.tar
*.tar.gz
Docker/.env
public/Logo/
Logo/
Skills/
```

Sí deben mantenerse:

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
src/
docs/
README.md
RUN_GUIDE.md
SECURITY.md
QA_CHECKLIST.md
```

## Variables de entorno

El proyecto no debe requerir secretos para compilar.

Variables permitidas en `.env.example`:

```env
ASTRO_DEV_PORT=4321
ASTRO_PREVIEW_PORT=4322
WEB_PORT=8080
NODE_ENV=development
ASTRO_TELEMETRY_DISABLED=1
```

No añadir a `.env.example` valores reales como:

```text
tokens
API keys
contraseñas
private keys
client secrets
database URLs privadas
service role keys
credenciales SMTP
credenciales cloud
claves SSH
certificados privados
```

`.env.example` puede versionarse. `.env` no debe versionarse.

## Formulario de contacto

El formulario actual usa `mailto:`.

Implicaciones:

* No envía datos a backend.
* No almacena mensajes.
* No valida datos en servidor.
* No integra CRM.
* No envía confirmación automática.
* No garantiza entrega.
* Depende del cliente de correo del usuario.

La UI no debe afirmar:

```text
Mensaje enviado correctamente
Formulario enviado al servidor
Nos pondremos en contacto automáticamente
Solicitud registrada
```

Texto permitido o equivalente:

```text
Este formulario prepara un correo en tu cliente de email; no envía datos a un servidor.
```

También debe advertir:

```text
No escribas contraseñas, tokens, datos bancarios ni información sensible.
```

Si se implementa backend real en el futuro, será obligatorio añadir:

* Validación server-side.
* Sanitización.
* Rate limiting.
* Protección anti-spam.
* Protección CSRF si aplica.
* Política de privacidad.
* Gestión de consentimiento si aplica.
* Logs redactados.
* Revisión de CORS.
* Revisión de almacenamiento.
* Revisión de retención y borrado.
* Protección contra abuso del endpoint.
* QA de errores y disponibilidad.

## Datos personales

La web puede mostrar datos profesionales públicos como:

* Marca IoCode SOLUTIONS.
* Email de contacto.
* LinkedIn.
* GitHub público.
* Experiencia profesional resumida.
* Habilidades técnicas.
* Proyectos públicos.
* Casos privados descritos sin revelar información sensible.

No debe publicar:

* DNI/NIE/pasaporte.
* Dirección personal.
* Teléfono personal si no se decide explícitamente como dato público.
* Datos de terceros sin permiso.
* Contratos.
* Nóminas.
* Certificados con identificadores sensibles.
* Credenciales.
* Información privada de empresas anteriores.
* Capturas con datos internos.
* Rutas internas.
* Nombres de clientes sin autorización.
* Logs.
* Dumps.
* Backups.

## Repositorios y proyectos

Reglas para proyectos públicos:

* Enlazar solo repositorios públicos.
* No enlazar repositorios privados.
* No publicar tokens.
* No publicar `.env`.
* No publicar credenciales de prueba reutilizables.
* No publicar datos reales de clientes.
* No prometer métricas, producción, seguridad o precisión sin evidencia.

Reglas para casos privados:

* Presentar solo descripción general.
* No incluir URL privada.
* No incluir rutas internas.
* No incluir nombres de clientes sin permiso.
* No incluir capturas con información sensible.
* No publicar código privado.
* No exponer arquitectura interna confidencial.

## Assets

Assets finales permitidos:

```text
public/logo/iocode-logo.svg
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

No publicar assets fuente innecesarios:

```text
*.eps
*.ai
*.psd
*.sketch
PDFs fuente
ZIPs de diseño
carpetas Logo antiguas
public/Logo/
```

Importante: Docker/Linux distingue mayúsculas y minúsculas.

Ruta correcta:

```text
public/logo/3d/iocode_solutions_logo_extruded_3d.glb
```

Ruta incorrecta:

```text
public/logo/3D/iocode_solutions_logo_extruded_3d.glb
```

Si el GLB devuelve `404`, revisar casing de la ruta antes de depurar Three.js.

## Docker

El proyecto usa:

```text
compose.yml
Docker/Dockerfile
Docker/Dockerfile.dev
Docker/node-static-server.mjs
```

No debe depender de:

```text
Docker/compose.yml
Docker/.env
```

### Desarrollo

```powershell
docker compose up --build
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

## Seguridad del contenedor de producción local

El servicio `web` debe mantener controles como:

* `read_only: true`.
* `tmpfs` para `/tmp`.
* `cap_drop: ALL`.
* `security_opt: no-new-privileges:true`.
* Healthcheck activo.
* Puerto expuesto controlado.
* Sin secretos.
* Sin montaje de código fuente en runtime de producción.

El runtime usa Node para servir archivos estáticos. Aunque `npm` está disponible por requisito operativo del proyecto, no debe usarse para instalar paquetes dentro del contenedor de producción en caliente. Las dependencias deben resolverse en build.

## Cabeceras de seguridad

El servidor Node de producción local debe aplicar cabeceras básicas:

```text
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy
```

La CSP debe permitir el funcionamiento del sitio y del modelo 3D, pero no abrir permisos innecesarios.

Directivas esperadas o equivalentes:

```text
default-src 'self'
script-src 'self' 'unsafe-inline'
style-src 'self' 'unsafe-inline'
img-src 'self' data:
font-src 'self' data:
model-src 'self'
connect-src 'self'
frame-ancestors 'none'
base-uri 'self'
form-action 'self' mailto:
```

Notas:

* `'unsafe-inline'` puede ser necesario por scripts/estilos generados o inline actuales. Si se endurece en el futuro, debe probarse con Astro y componentes interactivos.
* Si se añaden scripts externos, analítica, fuentes externas, mapas, embeds o formularios backend, la CSP debe revisarse explícitamente.
* La CSP local no garantiza que el hosting final aplique las mismas cabeceras; debe validarse en el entorno real de publicación.

## Dependencias

Validación productiva:

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

Criterio:

* Vulnerabilidad en dependencias productivas: bloqueo hasta resolver o justificar.
* Vulnerabilidad solo en tooling de desarrollo: documentar, vigilar actualización y no bloquear publicación si `--omit=dev` está limpio.
* Vulnerabilidad explotable en build pipeline o CI: revisar caso por caso.
* Cualquier actualización de dependencias debe ir seguida de QA completo.

## TypeScript y quality gate

No se debe eliminar `npm run check` del flujo para “hacer pasar” producción.

El QA debe incluir:

```powershell
docker compose --profile qa run --rm qa
```

y debe validar:

```text
npm run check
npm run build
npm run audit:prod
```

Si `astro check` falla, el release queda bloqueado.

## Dev Containers

La configuración correcta debe vivir en:

```text
.devcontainer/devcontainer.json
```

Debe evitarse duplicar configuración en:

```text
Docker/devcontainer/
```

`.devcontainer` puede versionarse porque no debe contener secretos.

Si VS Code pregunta dónde crear la configuración, elegir:

```text
Add configuration to workspace
```

No elegir:

```text
Add configuration to user data folder
```

## SEO y rutas multidioma

Las rutas multidioma son parte del contrato público del sitio.

La tabla central vive en:

```text
src/i18n/routes.ts
```

No se debe implementar el cambio de idioma con reemplazos simples del prefijo `/es/`, porque los slugs están traducidos.

Ejemplo correcto:

```text
/es/servicios/
/en/services/
/de/leistungen/
```

Ejemplo incorrecto:

```text
/en/servicios/
```

Cualquier cambio en rutas debe revisar:

* `canonical`.
* `hreflang`.
* `sitemap.xml`.
* Navegación.
* Selector de idioma.
* QA de rutas.
* Redirecciones si el sitio ya estaba publicado.

## Errores y logs

No loguear:

* contraseñas;
* tokens;
* claves;
* cookies;
* URLs privadas con tokens;
* datos personales no necesarios;
* contenido completo de formularios;
* datos bancarios;
* certificados;
* claves privadas.

Actualmente el proyecto no tiene backend ni logs de servidor con datos de usuario, salvo logs técnicos locales de Docker/Node.

Si se añade backend, debe definirse política de logging y redacción.

## Hosting real

Antes de publicar en hosting externo, revisar:

* HTTPS obligatorio.
* Cabeceras de seguridad en hosting real.
* Reglas de caché.
* Redirección de dominio raíz.
* `www` vs no-`www`.
* `sitemap.xml`.
* `robots.txt`.
* `canonical`.
* `hreflang`.
* Política de privacidad si se añaden formularios reales, analítica o cookies.
* Proceso de despliegue.
* Gestión de variables de entorno.
* Rollback.

La validación local con Docker no sustituye validación en el hosting final.

## Reporte de vulnerabilidades

Si se detecta un problema de seguridad:

1. No abrir issue público con secretos.
2. No pegar tokens, `.env`, claves ni datos personales.
3. Documentar pasos de reproducción sin datos sensibles.
4. Clasificar severidad.
5. Corregir en rama separada.
6. Ejecutar QA.
7. Revisar que no se filtren secretos en commits.
8. Revisar el entregable final antes de compartir.

## Severidad interna

Usar esta clasificación:

| Severidad   | Criterio                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------- |
| S0 Critical | Secreto expuesto, ejecución remota, publicación de datos sensibles, takeover, credenciales reales  |
| S1 High     | Enlace privado expuesto, fallo de autorización futuro, ruta insegura, deploy con secretos o `.git` |
| S2 Medium   | CSP débil, dependencia vulnerable de desarrollo, documentación insegura, headers incompletos       |
| S3 Low      | Mejora de hardening, limpieza, advertencia, ajuste documental                                      |

## No-go conditions

No publicar si ocurre cualquiera:

* `docker compose --profile qa run --rm qa` falla.
* `npm run check` tiene errores.
* `npm run build` falla.
* `npm audit --omit=dev` detecta vulnerabilidades productivas sin resolver.
* `.env` está presente en el repositorio o ZIP.
* `.git/` está dentro del entregable.
* `node_modules/` está dentro del ZIP.
* `.astro/` está dentro del ZIP.
* `dist/` se entrega sin intención explícita.
* El GLB devuelve 404.
* El logo 3D rompe la navegación o bloquea render.
* El formulario afirma enviar datos a backend sin backend.
* Hay enlaces a repos privados.
* Hay rutas internas, claves, tokens o secretos.
* Hay documentación que indique comandos obsoletos como `Docker/compose.yml` o `Docker/.env`.
* Hay rutas con mayúsculas incompatibles con Linux, como `public/logo/3D`.
* No se ha revisado visualmente el sitio en navegador.

## Validación mínima antes de publicación

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
```

Verificación manual:

* Navegación ES/EN/DE.
* Selector de idioma con slugs traducidos.
* Logo visible.
* Logo 3D funcional o fallback visible.
* Responsive móvil.
* Formulario `mailto:`.
* Enlaces externos con `rel="noopener noreferrer"`.
* Sin errores en consola.
* Sin assets o archivos sensibles en el entregable.

## Checklist rápido de limpieza

Antes de crear ZIP o subir a repositorio:

```powershell
Test-Path .env
Test-Path .git
Test-Path node_modules
Test-Path .astro
Test-Path dist
Test-Path public\Logo
Test-Path Skills
```

Para un ZIP fuente, el resultado esperado de todos esos comandos es:

```text
False
```

Excepción: `dist/` solo puede estar presente cuando se entrega explícitamente un build estático.

## Cambios que obligan a revisar este documento

Revisar `SECURITY.md` si se añade:

* backend;
* API;
* base de datos;
* autenticación;
* cookies;
* analítica;
* formularios reales;
* subida de archivos;
* pagos;
* panel de administración;
* CRM;
* email SMTP;
* terceros externos;
* tracking;
* hosting definitivo;
* CI/CD;
* variables de entorno con secretos;
* integración con servicios cloud.

```
```
