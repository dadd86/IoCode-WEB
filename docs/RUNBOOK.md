# Runbook único

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R3.5b | Operación reproducible de desarrollo, QA, producción local y release | Docker, Astro, QA y respuesta operativa | ES, EN, DE | `compose.yml`, `package.json`, `Docker/node-static-server.mjs` y scripts de `tools/` | 2026-07-29 |

Este es el único runbook operativo. Los comandos se ejecutan desde la raíz y usan Docker; Node.js local no forma parte del flujo soportado.

## Entorno de ejecución soportado

| Familia de comando | Se ejecuta en el host | Se ejecuta en contenedor |
|---|---|---|
| `docker compose ...` | Sí; PowerShell/terminal con Docker Desktop | No |
| `git ...` y `curl.exe ...` | Sí, cuando el procedimiento los indique | No |
| Astro, Node.js, npm y Playwright | No; no se presupone `node_modules` local | Sí, mediante el servicio indicado |
| Check, build y audit de aplicación | No | Servicio `qa`, perfiles `qa` + `prod` |
| Validador documental y contratos Node sin navegador | No | Servicio `release-tools`, perfil `release` |
| Fase 6 y GLB | No | Servicios `performance-qa` y `assets` |

Un comando npm aislado en Windows **no es un comando operativo soportado**.
En la verificación R3.5b, el intento directo de `check` no encontró el binario
Astro local; el mismo check pasó dentro de `qa`. Por tanto, R3.5b se valida
exclusivamente con Docker para que el resultado sea reproducible.

`DOC_NPM_SCRIPT_UNKNOWN` y `TOOL_NPM_SCRIPT_UNKNOWN` comprueban que el nombre
citado existe en `package.json`; no demuestran que sea ejecutable en el host,
que sus dependencias estén instaladas ni que su comportamiento sea correcto.
El segundo recorre `tools/` y `Docker/` y reconoce shell literal,
`CMD`/`ENTRYPOINT` exec-array y accesos literales a claves de `scripts`.
La matriz anterior y los gates Docker cubren esa frontera. Esta limitación queda
registrada como deuda del validador, no como capacidad implementada.

## Servicios y puertos

| Servicio | Perfil | Uso | Puerto |
|---|---|---|---:|
| `dev` | base | Astro en desarrollo | 4321 |
| `qa` | `qa` | check, build y audit | sin publicar |
| `preview` | `preview` | preview Astro | 4322 |
| `web` | `prod` | servidor estático local | 8080 |
| `browser-qa` | `qa` | Playwright general | sin publicar |
| `performance-qa` | `qa` | gate Fase 6 | sin publicar |
| `release-tools` | `release` | validadores y empaquetado | sin publicar |
| `assets` | `assets` | preparación del GLB | sin publicar |

## Desarrollo y parada

```powershell
docker compose up -d dev
docker compose logs -f dev
docker compose down --remove-orphans
```

Abrir `http://localhost:4321/es/`, `/en/` o `/de/`.

## Validación rápida

```powershell
docker compose --profile qa --profile prod run --rm qa
docker compose --profile release run --rm release-tools "npm run internal:docs:test"
docker compose --profile release run --rm release-tools "npm run internal:docs:lint"
```

Resultado actual esperado: Astro sin diagnósticos, 29 páginas, cero vulnerabilidades de producción y validador documental en verde.

## Producción local y smoke test

```powershell
docker compose --profile prod up --build -d web
curl.exe -I http://localhost:8080/health
curl.exe -I http://localhost:8080/es/
curl.exe -I http://localhost:8080/en/
curl.exe -I http://localhost:8080/de/
curl.exe -I http://localhost:8080/sitemap.xml
curl.exe -I http://localhost:8080/robots.txt
curl.exe -I http://localhost:8080/no-existe/
curl.exe -I http://localhost:8080/es/proceso
```

Se espera: `200` para health, páginas, sitemap y robots; `404` para la ruta inexistente; `308` para la ruta canónica sin slash. El health usa `Cache-Control: no-store`.

```powershell
docker compose --profile prod logs --tail=100 web
docker compose --profile prod down --remove-orphans
```

## Fase 6: rendimiento y Hero3D

La preparación modifica intencionadamente el GLB y conserva un backup en `qa-artifacts/`.

```powershell
docker compose --profile assets run --rm assets "npm run internal:prepare:assets:6"
docker compose --profile prod --profile qa down --remove-orphans
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down --remove-orphans
```

Consultar [PERFORMANCE.md](PERFORMANCE.md) para presupuestos y límites. La fase continúa `NO CERRADA` aunque el resumen automatizado esté verde mientras falte la captura del mismo build en un iPhone físico.

## Release local

El empaquetado exige resumen verde y árbol Git limpio.

```powershell
docker compose --profile release run --rm release-tools "sh tools/create-release-zip.sh"
docker compose --profile release run --rm release-tools "npm run internal:inspect:release-zip"
```

El ZIP se crea desde `HEAD` y excluye `.git`, `.agents`, `.env`, `node_modules`, `dist`, `qa-artifacts` y comprimidos previos.

## Seguridad de despliegue

El laboratorio usa HTTP. En producción, el proxy, CDN o plataforma debe proporcionar HTTPS válido, redirección HTTP a HTTPS, healthcheck, observabilidad y rollback.

`ENABLE_HSTS`, `ENABLE_UPGRADE_INSECURE_REQUESTS` y `ENABLE_COOP` deben permanecer en `false` hasta validar el dominio por HTTPS. El contenedor `web` opera como usuario no root, con filesystem de solo lectura, `tmpfs`, capabilities eliminadas y `no-new-privileges`.

## Diagnóstico por síntoma

| Síntoma | Comprobación | Recuperación |
|---|---|---|
| Puerto ocupado | Revisar `docker compose ps` y el proceso que usa 4321/4322/8080 | Cambiar solo el puerto publicado en `.env` o liberar el proceso |
| Permiso o volumen | Revisar logs y Docker Desktop | Bajar el proyecto; recrear únicamente los volúmenes de dependencias si es necesario |
| Build fallido | Leer el primer error de `check` o build | Corregir fuente; reconstruir sin reutilizar una imagen antigua |
| Certificado TLS | Comprobar certificado y redirección en el terminador HTTPS | No activar HSTS; restaurar la configuración TLS anterior |
| MIME GLB erróneo | Comprobar `Content-Type` de la URL `.glb` | Configurar `model/gltf-binary` en el servidor o proxy |

## Rollback

En local no existe un registro remoto de imágenes ni datos persistentes. El rollback reproducible consiste en volver al commit o artefacto previamente firmado, reconstruir `web` y repetir los smoke tests. En staging, R7 deberá registrar el identificador anterior y demostrar una recuperación en 15 minutos o menos.

## Limpieza acotada

```powershell
docker compose --profile prod --profile qa --profile assets down --remove-orphans
```

Usar `--volumes` solo si se acepta descargar de nuevo las dependencias. No ejecutar limpiezas Docker globales como parte del runbook normal.
