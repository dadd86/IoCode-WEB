# RUN_GUIDE.md

## Requisitos

- Node.js 20 o superior.
- npm.
- Docker Desktop opcional.
- Visual Studio Code recomendado.

## Ejecucion con npm

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:4321/es/
```

## Build y preview

```bash
npm run check
npm run build
npm run preview
```

## Ejecucion con Docker en PowerShell

```powershell
Copy-Item Docker/.env.example Docker/.env
docker compose -f Docker/compose.yml --env-file Docker/.env --profile dev up --build
```

Abrir:

```text
http://localhost:4321/es/
```

## Produccion local con Nginx

```powershell
docker compose -f Docker/compose.yml --env-file Docker/.env --profile prod up --build
```

Abrir:

```text
http://localhost:8080/es/
```

## Importante

No usar `python -m http.server`. Este proyecto usa Astro y debe ejecutarse con npm o Docker.
