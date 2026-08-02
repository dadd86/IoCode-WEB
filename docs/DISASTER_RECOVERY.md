# Recuperación ante desastres

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9.39 | Restauración verificable de release, configuración, TLS y DNS | Producción, proveedor DNS, CA y registro OCI | ES, EN, DE | Git, GHCR, exports cifrados y scripts de release | 2026-08-02 |

## Objetivos y fuentes de verdad

RTO objetivo: 60 minutos. RPO objetivo: cero para código/configuración versionada y máximo 24 horas para inventario/export de DNS. El sitio no mantiene base de datos ni formularios en servidor; por ello la recuperación protege artefactos, configuración, zona y claves, no contenido de usuario.

| Activo | Fuente primaria | Copia independiente | Secreto |
|---|---|---|---|
| Código y Nginx | Git remoto por SHA | mirror privado diario | No |
| Imagen de aplicación | GHCR por digest | export OCI cifrado del último y anterior release | No por sí sola |
| Manifiesto/release | directorio inmutable `releases/<SHA>` | bundle cifrado diario | No |
| Zona DNS | proveedor autoritativo | export diario cifrado + checksum | Puede contener topología |
| Certificado/cadena | CA y `/etc/letsencrypt` | backup cifrado con acceso dual | Clave privada: sí |
| Credenciales | gestor de secretos | recuperación protegida del proveedor | Sí |

Los backups se cifran antes de salir del host, se almacenan en una cuenta/región distinta y requieren dos responsables para claves privadas. Nunca se guardan certificados privados, tokens ni exports reales en Git.

## Recuperación del sitio y configuración

1. Declarar P1, congelar deploys y elegir el SHA aprobado desde `release-manifest.json`.
2. Verificar SHA-256 del bundle y digest OCI contra el manifiesto conservado fuera del host.
3. Preparar un host Linux endurecido, Docker Engine/Compose soportados, firewall 80/443 y acceso restringido.
4. Restaurar `compose.production.yml`, `infra/nginx/`, `tools/` y el manifiesto en `/opt/iocode/releases/<SHA>`.
5. Restaurar los archivos TLS con permisos de sólo root y definir `TLS_FULLCHAIN_PATH`/`TLS_PRIVKEY_PATH` sin imprimir valores.
6. Iniciar exactamente la imagen `APP_IMAGE@sha256:...` y el Nginx por digest; no recompilar.
7. Ejecutar healthcheck local, `nginx -t`, smoke HTTPS y `node tools/monitor-production.mjs`.
8. Mover atómicamente `current` sólo tras validación. Si el host original conserva `previous`, preferir `tools/rollback-release.sh`.

## Recuperación TLS

1. Si la clave puede estar comprometida, revocar antes de reutilizar y emitir un par nuevo.
2. Si no existe compromiso y el tiempo exige restauración, recuperar el backup cifrado, validar permisos `0600`, cadena, SAN apex/www y fecha.
3. Ejecutar una renovación en seco con la CA y recargar Nginx sólo si `nginx -t` pasa.
4. Confirmar TLS 1.2/1.3, SNI, HSTS y más de 14 días de vigencia desde una red externa.
5. Destruir de forma segura las copias temporales conforme al procedimiento del gestor de secretos.

## Recuperación DNS

1. Exportar la zona actual antes de cambiarla y comparar serial/records con el backup firmado.
2. Restaurar A, AAAA, `www` CNAME y CAA con TTL 300 durante el incidente.
3. Validar en servidores autoritativos y dos resolvers externos; comprobar DNSSEC si está habilitado.
4. No publicar IP de ejemplo ni desactivar DNSSEC sin plan de DS coordinado con el registrador.
5. Tras 24 horas estables, restaurar TTL normal y generar un nuevo export cifrado.

## Prueba trimestral

La prueba se ejecuta en un host aislado sin cambiar DNS público:

1. Restaurar el penúltimo bundle y su OCI por digest.
2. Usar certificados de laboratorio o un proxy local; nunca copiar la clave de producción si no es imprescindible.
3. Ejecutar Compose, cuatro healthchecks, cabeceras, sitemap, rollback hacia `previous` y monitor con DNS/TLS desactivados.
4. Medir tiempo hasta servicio, confirmar RTO <= 60 min y RPO conforme a la tabla.
5. Registrar fecha, operador, SHA/digest, checksums, resultado y acciones en evidencia sanitizada con retención de 90 días.

Comandos de ensayo local:

```sh
docker compose -f compose.production.yml config
OBSERVABILITY_LOG_ROOT=/tmp/unsafe sh tools/prune-observability-logs.sh
MONITOR_ORIGIN=http://127.0.0.1:8080 MONITOR_DNS_ENABLED=false MONITOR_TLS_ENABLED=false MONITOR_REQUIRE_SECURITY_HEADERS=false node tools/monitor-production.mjs
RELEASE_ROOT=/opt/iocode/releases sh tools/rollback-release.sh
```

El segundo comando debe fallar con código 64: demuestra que la poda rechaza rutas amplias o no autorizadas. El rollback debe usar `previous` sin ejecutar build.
