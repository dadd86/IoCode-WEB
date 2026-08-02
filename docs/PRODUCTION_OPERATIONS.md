# Operación de producción, releases y rollback

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| A | Contrato ejecutable de hardening, caché, pipeline y recuperación | Contenedores, HTTP, CI/CD y releases | ES, EN, DE | `compose.production.yml`, `.github/workflows/`, `infra/nginx/` y `tools/` | 2026-08-01 |

## Entornos

| Entorno | Archivo ejemplo | URL | Indexación | Entrega |
|---|---|---|---|---|
| Local | `.env.example` | `http://localhost:4321` | No | Astro dev |
| Preview | `.env.preview.example` | URL HTTPS efímera | No | Build estático de revisión |
| Producción | `.env.production.example` | `https://iocode-solutions.com` | Sí | OCI por digest |

El build de producción falla si la URL no es HTTPS pública. `qa-production-config.mjs` escanea `dist` y bloquea localhost, `web:8080` o el dominio de ejemplo de preview.

## Matriz de cabeceras

| Cabecera | Valor/estrategia | Capa |
|---|---|---|
| Content-Security-Policy | `default-src 'self'`; hashes SHA-256 de scripts/estilos inline; `object-src 'none'`; `frame-ancestors 'none'`; `upgrade-insecure-requests` | Origen Node |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | Nginx HTTPS |
| X-Content-Type-Options | `nosniff` | Ambas |
| X-Frame-Options | `DENY` | Ambas; defensa heredada adicional a CSP |
| Referrer-Policy | `strict-origin-when-cross-origin` | Ambas |
| Permissions-Policy | cámara, micrófono, geolocalización, pago, USB y serial desactivados | Ambas |
| Cross-Origin-Resource-Policy | `same-origin` | Origen Node |
| X-DNS-Prefetch-Control | `off` | Origen Node |

## Caché y compresión

| Recurso | Cache-Control | Compresión |
|---|---|---|
| HTML y redirects/error | `no-cache, max-age=0, must-revalidate` | Brotli preferido, Gzip fallback |
| `/_astro/*` con hash | `public, max-age=31536000, immutable` | Brotli/Gzip para JS/CSS |
| GLB con `?v=<hash>` | `public, max-age=31536000, immutable` | Sin compresión dinámica |
| GLB sin versión | 1 hora y revalidación | Sin compresión |
| Imágenes/assets sin hash | 7 días + stale-while-revalidate 1 día | Según formato; no recomprimir binarios |
| Sitemap/robots | 1 hora | Brotli/Gzip |
| Health | `no-store` | No necesaria |

## Pipeline y release inmutable

`ci-release.yml` ejecuta checkout del SHA, `npm ci`, Astro check, TypeScript, unit tests, build, gate anti-leaks, sitemap, audit, archivo reproducible, imagen OCI y manifiesto. Un tag `v*` publica GHCR con etiqueta SHA y obtiene su digest. `release-manifest.json` registra versión, SHA completo, fecha del commit, nombre/tamaño/SHA-256 del artefacto y digest OCI.

Producción acepta únicamente `APP_IMAGE` y `NGINX_IMAGE` con `@sha256`. `production-operation.yml` requiere aprobación del Environment y un runner autoalojado etiquetado `production`. El directorio de cada release conserva Compose, Nginx, manifest y referencias; no contiene claves TLS.

## Despliegue y rollback

Despliegue manual equivalente en el runner:

```sh
export APP_IMAGE='ghcr.io/dadd86/iocode-solutions@sha256:<64-hex>'
export NGINX_IMAGE='nginxinc/nginx-unprivileged@sha256:<64-hex>'
export RELEASE_ID='<commit-sha-40>'
export RELEASE_ROOT='/opt/iocode/releases'
export TLS_FULLCHAIN_PATH='/etc/letsencrypt/live/iocode-solutions.com/fullchain.pem'
export TLS_PRIVKEY_PATH='/etc/letsencrypt/live/iocode-solutions.com/privkey.pem'
sh tools/deploy-release.sh
```

Rollback sin recompilación:

```sh
export RELEASE_ROOT='/opt/iocode/releases'
sh tools/rollback-release.sh
```

El rollback lee el puntero `previous`, reutiliza sus dos digests, ejecuta `compose pull/up --wait`, repite los smoke tests y solo después intercambia `current`/`previous`. Objetivo: menos de 15 minutos. Si el smoke falla, se conserva el puntero vigente y se escala al responsable.
