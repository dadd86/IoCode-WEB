# Inventario de secretos y accesos

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| A | Catálogo sin valores de credenciales de producción | DNS, VPS, CI, registro, TLS y alertas | ES, EN, DE | GitHub Environments y gestor privado de secretos | 2026-08-01 |

Nunca se escriben valores reales en Git, variables no protegidas, artefactos, logs ni tickets. El responsable técnico revisa accesos trimestralmente y tras cada baja.

| ID | Credencial/acceso | Almacén | Alcance mínimo | Responsable | Rotación/revocación |
|---|---|---|---|---|---|
| SEC-01 | Cuenta del registrador | Gestor privado + MFA físico | Dominio y bloqueo de transferencia | Propietario | Contraseña anual; revocar sesiones al incidente |
| SEC-02 | Token API DNS | GitHub Environment `production` o gestor privado | Solo editar zona IoCode | Production Engineer | 90 días |
| SEC-03 | SSH del VPS | Agente/gestor privado; nunca archivo en repo | Usuario deploy, sin root directo | Production Engineer | 90 días y ante baja |
| SEC-04 | Acceso sudo del VPS | Gestor privado con MFA | Parches, firewall y Certbot | Propietario | 90 días |
| SEC-05 | `GITHUB_TOKEN`/GHCR | Token efímero de Actions | Lectura/escritura de paquete según job | GitHub Actions | Por ejecución |
| SEC-06 | Runner `production` | GitHub Environment con aprobación | Solo repositorio y host de producción | Propietario | Re-registro 90 días |
| SEC-07 | Clave privada TLS | Host `/etc/letsencrypt`, modo 0600 | Nginx local | Certbot/root | Renovación automática; revocar al compromiso |
| SEC-08 | Token de monitorización | Gestor privado/servicio de alertas | Crear eventos del monitor web | Production Engineer | 90 días |
| SEC-09 | Canal de alertas | GitHub Environment `production` | Publicar solo en canal operativo | Propietario | 90 días |

Las variables `NGINX_IMAGE`, `RELEASE_ROOT`, `TLS_FULLCHAIN_PATH` y `TLS_PRIVKEY_PATH` son configuración sensible por contexto, pero no contienen el secreto. Se guardan como variables protegidas del Environment. La clave TLS nunca entra en GitHub Actions: permanece en el host y se monta read-only mediante Compose.
