# Run Guide

Guía operativa de IoCode SOLUTIONS Web. El runtime y todas las validaciones se ejecutan dentro de Docker; Node.js local es opcional y no forma parte del flujo soportado.

## Requisitos

- Docker Desktop activo.
- PowerShell o una terminal compatible con Docker Compose.
- Puertos 4321 y 8080 libres cuando se usen desarrollo y producción local.

## Entrar al proyecto

```powershell
cd C:\Users\diaz_\OneDrive\cursos\Programas\IoCode-WEB
```

## Desarrollo

```powershell
docker compose up -d dev
docker compose logs -f dev
```

Abrir `http://localhost:4321/es/`, `/en/` o `/de/`.

Parar:

```powershell
docker compose down --remove-orphans
```

## Validación rápida

```powershell
docker compose exec dev npm run check
docker compose exec dev npm run build
docker compose exec dev npm run audit:prod
```

Resultado esperado: Astro sin diagnósticos, 29 páginas construidas y cero vulnerabilidades de producción.

## QA general y preview

```powershell
docker compose --profile qa run --rm qa
docker compose --profile preview up --build preview
```

Preview: `http://localhost:4322/es/`.

## Producción local

```powershell
docker compose --profile prod up --build -d web
curl.exe -I http://localhost:8080/health
curl.exe -I http://localhost:8080/es/
curl.exe -I http://localhost:8080/sitemap.xml
curl.exe -I http://localhost:8080/no-existe/
```

Se espera 200 para health, páginas y sitemap; 404 para una ruta inexistente. Una ruta válida sin slash debe redirigir con 308 a su forma canónica.

Parar:

```powershell
docker compose --profile prod down --remove-orphans
```

## Fase 6 — flujo completo

No omitir la preparación de assets ni reutilizar imágenes antiguas después de cambiar código, tests, Docker, CSS o el GLB.

```powershell
docker compose --profile assets run --rm assets "npm run prepare:assets:6"
docker compose --profile prod --profile qa down --remove-orphans
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down --remove-orphans
```

El primer comando puede modificar `public/logo/3d/iocode_solutions_logo_extruded_3d.glb`. Guarda:

- `qa-artifacts/performance/phase-6/glb-repair-report.json`;
- `qa-artifacts/performance/phase-6/iocode_solutions_logo_extruded_3d.before-alpha-repair.glb`.

El pipeline limpia los demás artefactos, conserva esa evidencia before/after, reconstruye producción y genera el resumen final. Consultar [docs/PERFORMANCE.md](docs/PERFORMANCE.md) para presupuestos y criterios.

## Revisar el cierre

```powershell
docker compose --profile release run --rm release-tools "node -e \"const s=require('./qa-artifacts/performance/phase-6/summary.json'); console.log(JSON.stringify(s,null,2))\""
```

Solo hay cierre si el resumen pertenece al código actual y presenta `passed`, cero warnings, cero errores y cero blockers.

## Crear e inspeccionar el ZIP de release

El script exige un resumen verde y un árbol Git limpio. No crea ZIP con cambios sin confirmar.

```powershell
docker compose --profile release run --rm release-tools "sh tools/create-release-zip.sh"
docker compose --profile release run --rm release-tools "npm run inspect:release-zip"
```

Los ZIP se guardan en `releases/` y se excluyen de Git/Docker. El paquete se construye desde `HEAD`; no incluye cambios sin commit, `.agents`, `.git`, `node_modules`, `dist`, `qa-artifacts`, `.env` reales ni ZIP previos.

## HTTPS y producción real

El contenedor local escucha HTTP en 8080. En producción, el proxy/CDN/plataforma debe aportar:

- certificado HTTPS válido;
- redirección HTTP→HTTPS;
- healthcheck;
- rollback al artefacto anterior;
- observación de errores y Core Web Vitals de campo.

Activar `ENABLE_HSTS=true`, `ENABLE_UPGRADE_INSECURE_REQUESTS=true` y `ENABLE_COOP=true` únicamente detrás de HTTPS real y tras verificar la política del dominio.

## TypeScript y VS Code

Si el editor informa módulos o tipos ausentes, abrir `Dev Containers: Reopen in Container`. No reparar el workspace con `npm install` en Windows.

Validación soportada:

```powershell
docker compose run --rm --no-deps dev sh -lc "npm run check && npm run typecheck:src"
```

## Verificación de contacto

Después del build, LinkedIn y GitHub personales deben aparecer solo en las páginas de contacto:

```powershell
docker compose exec dev sh -lc "grep -Hn -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' dist/es/contacto/index.html dist/en/contact/index.html dist/de/kontakt/index.html"
docker compose exec dev sh -lc "find dist -type f -name 'index.html' ! -path '*/contacto/*' ! -path '*/contact/*' ! -path '*/kontakt/*' -exec grep -Hn -e 'Diego' -e 'Diaz' -e 'dadd86' -e 'linkedin.com/in/diegoarmandodiaz' -e 'github.com/dadd86' {} + || true"
```

El segundo comando debe quedar sin salida.

## Limpieza fuerte del proyecto

```powershell
docker compose --profile prod --profile qa --profile assets down --remove-orphans --volumes

docker images --format "{{.Repository}}:{{.Tag}}" |
  Where-Object { $_ -like "iocode-solutions-*" } |
  ForEach-Object { docker image rm $_ -f }

docker builder prune --all --force
docker buildx prune --all --force
```

`--volumes` elimina los volúmenes de dependencias del proyecto. No hay base de datos en este Compose, pero será necesario descargar y reconstruir las dependencias.

La limpieza global siguiente es opcional y destructiva para todos los proyectos Docker del equipo, no solo IoCode. Revisar primero `docker system df` y ejecutarla únicamente si se acepta perder contenedores detenidos, imágenes sin uso, redes sin uso, cachés y volúmenes no conectados:

```powershell
docker system df
docker system prune --all --volumes
```

## Reconstrucción y validación después de Full Clean

```powershell
docker compose --profile assets build --no-cache --pull assets
docker compose --profile assets run --rm assets "npm run prepare:assets:6"

docker compose --profile prod --profile qa build --no-cache --pull web performance-qa
docker compose --profile prod --profile qa up -d web

docker compose --profile prod --profile qa run --rm performance-qa sh -lc "npm run typecheck:src && npm run typecheck:tests"
docker compose --profile prod --profile qa run --rm performance-qa sh -lc "npm run qa:hero3d-cross-platform:6"
docker compose --profile prod --profile qa run --rm performance-qa sh -lc "npm run qa:hero3d-ios:6"
docker compose --profile prod --profile qa run --rm performance-qa sh -lc "npm run qa:services-responsive"
docker compose --profile prod --profile qa run --rm performance-qa sh -lc "npm run qa:responsive-visual:6"
docker compose --profile prod --profile qa run --rm performance-qa
```

El último comando ejecuta el gate completo. No considerar cerrada la fase si falta `qa-artifacts/performance/phase-6/summary.json` o si su estado no es `passed`.

## Problemas frecuentes

### El contenedor muestra una versión vieja

Reconstruir las imágenes; no ejecutar solo `docker compose run` sobre una imagen anterior.

### HSTS no aparece en local

Es correcto: el laboratorio usa HTTP. HSTS solo corresponde detrás de HTTPS real.

### El pipeline no encuentra `glb-repair-report.json`

Ejecutar primero `prepare:assets:6` en el servicio `assets`. No crear el informe manualmente.

### No se crea el ZIP

Comprobar el resumen y `git status --short`. El bloqueo por árbol sucio es intencional: el ZIP solo representa el commit actual.


## Matriz mínima para PC, móvil y tablet

| Perfil | Proyecto Playwright | Criterio |
|---|---|---|
| PC | `chromium-desktop` | Logo completo, autocarga, paneles y navegación desktop |
| Android | `chromium-mobile` | Autocarga sin toque, DPR ≤ 1,5 y sin overflow |
| iPhone | `webkit-iphone` | Logo completo, DATA/HMI/IOT visibles, fallback accesible |
| iPad/tablet | `webkit-ipad` | Autocarga, DPR ≤ 1,5 y menú hamburguesa funcional |

El servicio local se levanta con:

```powershell
docker compose --profile prod up -d --force-recreate web
```
