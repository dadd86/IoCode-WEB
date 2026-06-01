# IoCode SOLUTIONS Web

Sitio web profesional de IoCode SOLUTIONS para presentar servicios de software, automatizacion PLC, robotica industrial, Industria 4.0, proyectos y contacto en espanol, ingles y aleman.

## Stack

- Astro
- TypeScript
- Three.js
- CSS modular
- Docker Compose
- Salida estatica

## Rutas principales

- `/es/`
- `/en/`
- `/de/`
- `/es/servicios/`
- `/en/services/`
- `/de/leistungen/`
- `/es/automatizacion-plc/`
- `/en/plc-automation/`
- `/de/sps-automatisierung/`

## Instalacion local

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:4321/es/
```

## Validacion

```bash
npm run check
npm run build
npm run preview
npm run audit:prod
```

## Docker

```bash
cp Docker/.env.example Docker/.env
docker compose -f Docker/compose.yml --env-file Docker/.env --profile dev up --build
```

Abrir:

```text
http://localhost:4321/es/
```

## Arquitectura

La navegacion, idiomas y slugs no se duplican en cada pagina. Se controlan desde `src/i18n/routes.ts` mediante `routeAlternates`.

El contenido se centraliza en:

- `src/data/pageContent.ts`
- `src/data/projects.ts`
- `src/data/skills.ts`
- `src/data/site.ts`

El layout comun esta en `src/layouts/BaseLayout.astro`.

## Seguridad

No subir `.env`, `.git`, `node_modules`, `dist`, logs, dumps, backups, credenciales ni assets fuente innecesarios.
