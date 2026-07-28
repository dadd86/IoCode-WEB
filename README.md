# IoCode SOLUTIONS Web

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Entrada breve y verificable al repositorio | Desarrollo, QA y operación local | ES, EN, DE | `package.json`, `compose.yml`, `src/i18n/routes.ts` y build Astro | 2026-07-28 |

Sitio estático multilingüe de IoCode SOLUTIONS para automatización industrial, PLC, robótica, software y datos. Usa Astro 7, TypeScript, Three.js y Docker Compose.

## Estado comprobado

- 9 claves de ruta y 27 rutas localizadas en ES, EN y DE.
- 29 páginas producidas por el build Astro.
- Sin backend, base de datos, login, sesiones ni cookies de aplicación.
- El contacto usa `mailto:` y no almacena mensajes en infraestructura propia.
- R0, R1, R2 y R3 están cerradas con evidencia.
- La Fase 6 visual sigue `NO CERRADA` hasta validar el mismo build en un iPhone físico.

## Inicio rápido

Requisito: Docker Desktop activo.

```powershell
docker compose up -d dev
docker compose logs -f dev
```

Abrir `http://localhost:4321/es/`, `/en/` o `/de/`.

## Puerta local

```powershell
docker compose --profile qa --profile prod run --rm qa
docker compose --profile release run --rm release-tools "npm run docs:test"
docker compose --profile release run --rm release-tools "npm run docs:lint"
```

El primer comando ejecuta `astro check`, build y auditoría de dependencias de producción. El flujo completo de rendimiento y 3D está en [docs/RUNBOOK.md](docs/RUNBOOK.md).

## Producción local

```powershell
docker compose --profile prod up --build -d web
curl.exe -I http://localhost:8080/health
curl.exe -I http://localhost:8080/es/
curl.exe -I http://localhost:8080/no-existe/
```

Se espera `200` en health y páginas, `404` en la ruta inexistente y `308` en rutas válidas sin slash final.

## Configuración pública

Copiar `.env.example` a `.env` solo para overrides locales. Los puertos y controles HTTPS son los únicos valores operables previstos; no guardar secretos en archivos versionados. HSTS, upgrade de contenido inseguro y COOP permanecen desactivados hasta validar HTTPS real.

## Documentación

- [Índice técnico](docs/index.md)
- [Runbook único](docs/RUNBOOK.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Rendimiento y Hero3D](docs/PERFORMANCE.md)
- [Seguridad técnica](SECURITY.md)
- [Checklist QA](QA_CHECKLIST.md)

`master` es la rama de release. El trabajo de remediación se conserva en `codex/baseline-r0`; no se publica ni se mueve el repositorio sin una decisión explícita del propietario.
