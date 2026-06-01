# Docker · IoCode SOLUTIONS Web

## Estado

Configuración Docker completa para el sitio Astro estático de IoCode SOLUTIONS.

Incluye contenedores para:

- desarrollo local con Astro Dev Server;
- QA/build/audit en contenedor;
- preview Astro;
- runtime estático con Nginx no privilegiado.

## Requisitos

- Docker Engine.
- Docker Compose v2.
- Archivo `package.json` válido en la raíz del proyecto.
- Proyecto Astro con `npm run check`, `npm run build` y `npm run audit:prod`.

## Preparación

Desde la raíz del proyecto:

```bash
cp Docker/.env.example Docker/.env
```

No escribas secretos reales en `Docker/.env`. Este sitio es estático; no necesita credenciales para ejecutarse.

## Desarrollo

```bash
./Docker/scripts/dev.sh
```

Abrir:

```text
http://localhost:4321/es/
```

Equivalente sin script:

```bash
docker compose --env-file Docker/.env -f Docker/compose.yml --profile dev up --build dev
```

## QA en contenedor

```bash
./Docker/scripts/qa.sh
```

Ejecuta:

```text
npm install
npm run check
npm run build
npm run audit:prod
```

## Preview Astro

```bash
./Docker/scripts/preview.sh
```

Abrir:

```text
http://localhost:4322/es/
```

## Producción local con Nginx

```bash
./Docker/scripts/prod.sh
```

Abrir:

```text
http://localhost:8080/es/
```

## Build de imagen de producción

```bash
./Docker/scripts/build.sh
```

## Servicios definidos

| Servicio | Perfil | Puerto | Uso |
|---|---:|---:|---|
| `dev` | `dev` | `4321` | Desarrollo con hot reload |
| `qa` | `qa` | N/A | Check/build/audit |
| `preview` | `preview` | `4322` | Preview de Astro |
| `web` | `prod` | `8080` | Runtime Nginx estático |

## Seguridad aplicada

El contenedor `web` usa:

- imagen Nginx no privilegiada;
- puerto interno `8080`;
- `read_only: true`;
- `tmpfs` para rutas temporales;
- `cap_drop: [ALL]`;
- `no-new-privileges`;
- cabeceras HTTP básicas de seguridad;
- healthcheck HTTP.

## Limitaciones

Esta configuración no sustituye una validación de producción real. Antes de publicar:

- ejecuta `qa`;
- ejecuta `prod`;
- revisa consola del navegador;
- revisa que el `.glb` cargue sin 404;
- prueba `/es/`, `/en/`, `/de/`;
- confirma que `.git`, `.env`, ZIPs internos y assets fuente no entran en el deploy.
