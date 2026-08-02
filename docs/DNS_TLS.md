# Dominio, DNS y TLS de producción

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| A | Contrato de publicación, canonicalización y certificado | DNS público, Nginx y TLS | ES, EN, DE | `infra/nginx/`, `tools/validate-dns-tls.mjs` y proveedor DNS | 2026-08-01 |

## Zona requerida

| Nombre | Tipo | Valor | TTL | Condición |
|---|---|---|---:|---|
| `@` | A | IPv4 pública reservada del VPS (`EXPECTED_IPV4`) | 300 durante alta; después 3600 | Obligatorio |
| `@` | AAAA | IPv6 pública reservada del VPS (`EXPECTED_IPV6`) | 300 durante alta; después 3600 | Obligatorio; firewall y host deben aceptar 80/443 por IPv6 |
| `www` | CNAME | `iocode-solutions.com.` | 3600 | Obligatorio |
| `@` | CAA | `0 issue "letsencrypt.org"` | 3600 | Recomendado para limitar la CA |

No se publican IP de ejemplo. El proveedor DNS es la fuente de verdad y sus valores reales se guardan en el inventario privado.

## TLS y redirecciones

El certificado SAN cubre `iocode-solutions.com` y `www.iocode-solutions.com`. Certbot en el host renueva automáticamente y recarga Nginx tras una renovación válida. Solo se permiten TLS 1.2/1.3. HTTP redirige 308 al apex HTTPS; `www` HTTPS redirige 308 al apex conservando ruta y query. HSTS se emite únicamente en HTTPS y se activará en preload solo tras 30 días sin incidentes y una revisión separada.

## Procedimiento de alta

1. Reservar IPv4/IPv6, abrir TCP 80/443 y cerrar el puerto 8080 al exterior.
2. Crear A, AAAA, CNAME y CAA; esperar propagación.
3. Emitir el certificado para ambos nombres y probar renovación en seco.
4. Ejecutar `EXPECTED_IPV4=x EXPECTED_IPV6=y npm run internal:qa:dns-tls` desde una red externa.
5. Desplegar y ejecutar `sh tools/post-deploy-smoke.sh`.

## Estado observado

La consulta realizada el 2026-08-01 desde el entorno de trabajo no obtuvo A ni CNAME. Por tanto, la activación DNS/TLS queda pendiente de credenciales e IP del proveedor; el repositorio contiene la configuración y el gate que impedirá declarar el servicio activo antes de tiempo.
