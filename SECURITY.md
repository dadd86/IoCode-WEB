# Seguridad técnica

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Modelo de amenazas y controles técnicos comprobables | Fuente, dependencias, contenedor y servidor estático | ES, EN, DE | `Docker/Dockerfile`, `Docker/node-static-server.mjs`, `compose.yml` y `package-lock.json` | 2026-07-28 |

Este documento describe seguridad técnica. Los requisitos jurídicos, privacidad e identificación legal pertenecen a `COMPLIANCE.md` cuando R4 disponga de datos revisados.

## Alcance real

El proyecto genera un sitio Astro estático. No tiene backend de aplicación, base de datos, autenticación, sesiones, pagos, subida de archivos ni cookies propias. El formulario crea un enlace `mailto:` y delega el envío al cliente de correo del visitante; el sitio no almacena el mensaje.

## Fronteras y amenazas

| Frontera | Riesgo principal | Control actual |
|---|---|---|
| Fuente y dependencias | paquete vulnerable o secreto versionado | lockfile, `npm ci`, audit de producción y exclusiones Git/Docker |
| Build | artefacto distinto al código revisado | build reproducible en contenedor y release desde `HEAD` limpio |
| Navegador | XSS, framing o carga de terceros | CSP con hashes por HTML, `frame-ancestors 'none'`, sin orígenes runtime remotos |
| Servidor estático | path traversal, MIME o caché incorrecta | resolución dentro de `dist`, allowlist MIME, 404 real y políticas de caché |
| Contenedor | escalada o escritura | usuario no root, filesystem read-only, `tmpfs`, sin capabilities y `no-new-privileges` |
| Despliegue | TLS o headers mal configurados | controles HTTPS desactivados por defecto y validación obligatoria en staging |

## Cabeceras

`Docker/node-static-server.mjs` emite:

- `Content-Security-Policy` con hashes SHA-256 de scripts y estilos inline del HTML servido;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy`;
- `Cross-Origin-Resource-Policy: same-origin`;
- `Origin-Agent-Cluster: ?1`;
- ETag, Last-Modified, Vary y caché según recurso.

`Cross-Origin-Opener-Policy`, HSTS y `upgrade-insecure-requests` son condicionales. Permanecen desactivados en el laboratorio HTTP y solo se habilitan detrás de HTTPS validado.

## CSP

La política efectiva se construye al servir cada HTML. No incluye `unsafe-inline`: calcula hashes para los bloques inline generados por Astro. Si cambia el HTML, los hashes cambian con la respuesta. Los recursos runtime se restringen al propio origen, `data:` o `blob:` según la directiva.

Una modificación de CSP debe repetir el build, los smoke tests y el gate de cabeceras de Fase 6. No se documentarán nonces, WAF o CSP de CDN mientras no existan.

## Contacto y datos sensibles

La UI advierte en ES, EN y DE que no se envíen contraseñas, tokens, datos bancarios ni información sensible. El correo configurado debe verificarse externamente antes de publicar; su presencia en fuente no demuestra recepción.

Los enlaces personales de verificación técnica se limitan a:

- `/es/contacto/`;
- `/en/contact/`;
- `/de/kontakt/`.

## Secretos

No versionar ni incluir en un release:

- `.env` real, tokens, contraseñas o claves privadas;
- credenciales cloud o claves de API;
- dumps, backups, logs sensibles o directorios de credenciales;
- `.git`, `.agents`, `node_modules`, `dist` o `qa-artifacts`.

Las variables públicas actuales controlan puertos y cabeceras; no son un almacén de secretos.

## Dependencias

```powershell
docker compose --profile qa --profile prod run --rm qa
```

El gate ejecuta `npm ci`, Astro check, build y `npm audit --omit=dev`. No usar `npm audit fix --force` sin analizar cambios rompientes.

## Divulgación de vulnerabilidades

R5 publicará el canal conforme a RFC 9116 únicamente después de confirmar DNS y recepción del correo. Hasta entonces no existe un `security.txt` operativo y este archivo no inventa un canal alternativo. Los detalles de una vulnerabilidad no deben abrirse en un issue público.

## No-go

No publicar si:

- fallan check, build, auditoría, health o rutas canónicas;
- aparecen secretos o datos personales fuera del alcance definido;
- CSP contiene `unsafe-inline` o desaparecen cabeceras base;
- se activa HSTS sin HTTPS real validado;
- el artefacto contiene archivos excluidos;
- se declara un canal de seguridad que no recibe mensajes.

## Límites

Esta revisión no certifica cumplimiento legal, disponibilidad del dominio ni entrega de correo. Tampoco afirma que exista WAF, monitorización de producción, firma de artefactos o proceso de respuesta a incidentes; esas capacidades pertenecen a fases posteriores.
