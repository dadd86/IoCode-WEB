# Operations Runbook

Runbook operativo para producciÃ³n local y validaciÃ³n de release.

## Levantar desarrollo

    docker compose up -d dev

Logs:

    docker compose logs -f dev

## Ejecutar QA

    docker compose run --rm qa

## Levantar producciÃ³n local

    docker compose --profile prod up --build -d web

## Healthcheck

    curl.exe -I http://localhost:8080/health

Esperado:

- 200 OK.
- `Cache-Control: no-store`.
- JSON `{"status":"ok"}` en peticiÃ³n GET.

## Smoke tests

    curl.exe -I http://localhost:8080/es/
    curl.exe -I http://localhost:8080/en/
    curl.exe -I http://localhost:8080/de/
    curl.exe -I http://localhost:8080/es/proceso/
    curl.exe -I http://localhost:8080/en/process/
    curl.exe -I http://localhost:8080/de/prozess/
    curl.exe -I http://localhost:8080/sitemap.xml
    curl.exe -I http://localhost:8080/robots.txt
    curl.exe -I http://localhost:8080/no-existe/
    curl.exe -I http://localhost:8080/es/proceso

Esperado:

- pÃ¡ginas vÃ¡lidas: 200.
- sitemap y robots: 200.
- ruta inexistente: 404.
- ruta sin slash: 308.

## Revisar headers

    curl.exe -I http://localhost:8080/es/proceso/

Headers esperados:

- `Content-Security-Policy`.
- `X-Content-Type-Options: nosniff`.
- `X-Frame-Options: DENY`.
- `Referrer-Policy`.
- `Permissions-Policy`.
- `Cross-Origin-Opener-Policy`.
- `Cross-Origin-Resource-Policy`.
- `ETag`.
- `Last-Modified`.

## Logs de producciÃ³n

    docker compose logs --tail=100 web

## Estado de contenedores

    docker compose ps

## Apagar producciÃ³n local

    docker compose --profile prod down

## ReconstrucciÃ³n limpia

    docker compose --profile prod build --no-cache web
    docker compose --profile prod up -d web

## Limpieza de volÃºmenes

Solo si se necesita reiniciar dependencias del entorno:

    docker compose down -v --remove-orphans

## ActivaciÃ³n de HSTS

No activar en local.

Condiciones mÃ­nimas para activarlo:

- dominio final configurado.
- HTTPS real funcionando.
- redirecciÃ³n HTTP a HTTPS validada por hosting o proxy.
- no hay subdominios sin HTTPS si se usa `includeSubDomains`.

DespuÃ©s de validar HTTPS real:

    ENABLE_HSTS=true
    ENABLE_UPGRADE_INSECURE_REQUESTS=true

## Rollback local

Si una imagen nueva falla:

1. Revisar logs.
2. Corregir cÃ³digo o configuraciÃ³n.
3. Reconstruir `web`.
4. Repetir smoke tests.

No hay base de datos ni migraciones en esta fase.