# Entrega Fase 9A — Infraestructura, Docker y DevOps

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| A | Matriz de cierre y comandos de aceptación 9.1–9.11 | Producción, CI/CD, DNS/TLS y recuperación | ES, EN, DE | Archivos versionados de Fase 9A y ejecución local | 2026-08-01 |

## Sincronización Git

Rama comprobada: `carmonita`. Se ejecutaron `git fetch origin master` y `git merge origin/master`. Resultado: `Already up to date`, sin conflictos.

## Matriz de cobertura

| ID | Nombre | Estado de implementación | Archivos principales | Evidencia |
|---|---|---|---|---|
| 9.1 | Perfil de producción | Completo en repositorio | `PRODUCTION_PROFILE.md` | Bloque A, estático, tráfico, dominio, región, RTO/RPO y RACI |
| 9.2 | ADR de hosting | Completo | `adr/0006-production-hosting.md` | Comparación y decisión VPS Docker |
| 9.3 | Dominio, DNS y TLS | Configurado; alta externa pendiente | `DNS_TLS.md`, `default.conf`, `validate-dns-tls.mjs` | A/AAAA/CNAME/CAA, SAN, 308 y gate real |
| 9.4 | Configuración por entorno | Completo | `.env*.example`, `environment.ts`, `qa-production-config.mjs` | local/preview/production, noindex y anti-leaks |
| 9.5 | Secretos y accesos | Completo | `SECRETS_ACCESS_INVENTORY.md` | Inventario, scope, owner y rotación sin valores |
| 9.6 | Hardening de entrega | Completo | `node-static-server.mjs`, `default.conf`, `PRODUCTION_OPERATIONS.md` | CSP con hashes, HSTS y matriz de headers |
| 9.7 | Caché/CDN/compresión | Completo | `node-static-server.mjs`, `PRODUCTION_OPERATIONS.md` | HTML revalidable, hash/GLB immutable, Brotli/Gzip |
| 9.8 | Límites de contenedor | Completo | `compose.production.yml`, `compose.yml` | usuario, CPU/RAM/PID, read-only, cap-drop, tmpfs y healthchecks |
| 9.9 | Pipeline CI/CD | Completo | `.github/workflows/*.yml` | install locked, checks, build, audit, QA, package, deploy y smoke |
| 9.10 | Release inmutable | Completo | `Dockerfile`, `create-release-manifest.mjs`, `deploy-release.sh` | SHA, versión, fecha, checksum y digest OCI |
| 9.11 | Rollback técnico | Completo | `rollback-release.sh`, `post-deploy-smoke.sh` | reutiliza digest anterior, sin build, con autorrestauración |

## Verificación local exacta

Prerequisito: Docker Engine/Compose y Node 24 disponibles.

```powershell
npm ci
$env:PUBLIC_DEPLOY_ENV = "production"
$env:PUBLIC_SITE_URL = "https://iocode-solutions.com"
npm run check
npm run internal:typecheck:src
npm run build
npm run internal:qa:config:prod
npm run internal:audit:prod
node --test tests/unit/phase-9a-contract.test.mjs
node tools/doc-validator.js --config docs/document-control.json --output qa-artifacts/documentation/phase-9a.json
```

```powershell
docker compose --profile prod config
docker compose --profile prod build --no-cache web
docker compose --profile prod up -d web
docker compose --profile prod ps
curl.exe -I -H "Accept-Encoding: br" http://localhost:8080/es/
curl.exe -I http://localhost:8080/logo/3d/iocode_solutions_logo_extruded_3d.glb?v=572076acb6cb
docker compose --profile prod down --remove-orphans
```

Para Nginx/TLS se crea `.env.production` desde el ejemplo, se reemplazan todos los marcadores por digests y rutas reales y se ejecuta:

```sh
docker compose --env-file .env.production -f compose.production.yml config --quiet
docker compose --env-file .env.production -f compose.production.yml pull
docker compose --env-file .env.production -f compose.production.yml up -d --wait
docker compose --env-file .env.production -f compose.production.yml exec edge nginx -t
sh tools/post-deploy-smoke.sh https://iocode-solutions.com
EXPECTED_IPV4='<ipv4>' EXPECTED_IPV6='<ipv6>' npm run internal:qa:dns-tls
```

## Resultado de esta estación

Pasaron 4/4 contratos de Fase 9A, 13/13 tests del validador documental, 6/6 tests de paridad, validación documental sin errores, sintaxis JavaScript y prueba del manifiesto. `git diff --check` no detectó errores.

No fue posible ejecutar Docker, Astro build ni `nginx -t` porque esta estación no tiene Docker ni dependencias de proyecto instaladas. El gate DNS/TLS falló correctamente: el dominio no resolvió y no se suministraron `EXPECTED_IPV4/EXPECTED_IPV6`.

## Dictamen

La implementación está completa y es apta para commit/push de revisión. La autorización de despliegue a producción y la declaración “9A validada al 100 %” permanecen bloqueadas hasta que CI pase, se valide Compose/Nginx en Docker y el proveedor publique A/AAAA/CNAME con certificado válido. No se debe confundir código listo para revisión con infraestructura externa activada.
