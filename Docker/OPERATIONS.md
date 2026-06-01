# Operaciones Docker

## Arranque local

```bash
cp Docker/.env.example Docker/.env
./Docker/scripts/prod.sh
```

## Healthcheck

```bash
curl -fsS http://localhost:8080/healthz
curl -fsS http://localhost:8080/es/
```

## Logs

```bash
docker compose --env-file Docker/.env -f Docker/compose.yml --profile prod logs -f web
```

## Parada

```bash
docker compose --env-file Docker/.env -f Docker/compose.yml --profile prod down
```

## Limpieza segura

No ejecutes `docker system prune -a` sin revisar antes qué imágenes y volúmenes se eliminarán.

Para parar solo este proyecto:

```bash
docker compose --env-file Docker/.env -f Docker/compose.yml --profile prod down
```

## Rollback local

Si una imagen nueva falla:

1. vuelve a la versión anterior del código;
2. reconstruye con `./Docker/scripts/build.sh`;
3. levanta con `./Docker/scripts/prod.sh`;
4. comprueba `/healthz` y `/es/`.
