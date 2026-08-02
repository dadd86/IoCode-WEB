# Observabilidad y privacidad operativa

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9E | Contrato de salud, alertas, logs, retención y métricas de campo | Producción, edge, DNS, TLS y CI/CD | ES, EN, DE | `config/observability.json`, Nginx, GitHub Actions y Search Console | 2026-08-02 |

## Arquitectura y propiedad

La fuente ejecutable es `config/observability.json`. El timer `iocode-production-monitor.timer` ejecuta el contrato cada 60 segundos en el VPS. El monitor externo principal debe consultar también cada 60 segundos desde al menos dos regiones independientes. GitHub Actions ejecuta el mismo contrato cada cinco minutos como tercera capa; su cron no sustituye al proveedor de uptime porque no garantiza precisión de minuto.

El responsable técnico de producción recibe P1 y coordina la respuesta. El suplente recibe la escalación si no hay acuse en cinco minutos. Los nombres, teléfonos, correos, tokens y URL del webhook se conservan en el gestor de secretos, nunca en Git.

## 9.33 — Uptime HTTP/HTTPS

| Objetivo | Resultado válido | Frecuencia | Timeout | Fallo |
|---|---|---:|---:|---|
| `https://iocode-solutions.com/health` | 200 + `application/json` | 60 s | 10 s | 2 fallos consecutivos |
| `/es/` | 200 + `text/html`, CSP y HSTS | 60 s | 10 s | 2 fallos consecutivos |
| `/en/` | 200 + `text/html`, CSP y HSTS | 60 s | 10 s | 2 fallos consecutivos |
| `/de/` | 200 + `text/html`, CSP y HSTS | 60 s | 10 s | 2 fallos consecutivos |

El monitor no envía query strings, cookies ni identificadores. La ruta `/health` usa `Cache-Control: no-store`. Una latencia superior a 2.000 ms se marca como degradación aunque el estado HTTP sea 200.

## 9.34 — TLS y DNS

El certificado debe validar la cadena pública, cubrir el apex y `www`, usar el nombre SNI correcto y conservar más de 14 días de validez. A 30 días se abre P2 preventivo; a 14 días o menos se abre P1. El DNS debe publicar al menos un A, un AAAA y `www CNAME iocode-solutions.com`. Dos fallos consecutivos de resolución abren P1; un único fallo se revalida desde otra región para descartar un resolver local.

## 9.35 — Logs mínimos

Nginx emite JSON a stdout con sólo:

- `ts`: timestamp ISO 8601;
- `status`: código HTTP;
- `bytes`: bytes de respuesta;
- `request_time`: duración total;
- `upstream_time`: duración del origen.

Quedan prohibidos IP, usuario remoto, método, host, ruta, query, referer, user-agent, cookies, autorización, cuerpos y contenido de `mailto:`. Los healthchecks no generan access log. El error log se limita a nivel `emerg`, reservado a fallos globales de proceso/configuración; así no se conservan errores asociados a requests. Node no registra requests; sólo informa el arranque del proceso y fallos internos sin datos del visitante.

No se afirma anonimización criptográfica: se evita recolectar identificadores desde el origen. Si un proveedor de red conserva IP por necesidad de seguridad, ese tratamiento debe figurar en su contrato, registro de actividades y evaluación del responsable de privacidad.

## 9.36 — Retención

Los logs vivos de contenedor usan el driver `local`, compresión y un máximo de tres archivos de 10 MiB por servicio. Toda exportación a `/var/log/iocode-observability` rota diariamente, se comprime y se elimina a los 14 días. El timer de systemd ejecuta una segunda poda diaria. Las evidencias sanitizadas del monitor se conservan 14 días; sólo métricas agregadas sin identificador pueden conservarse 90 días.

El plazo es un máximo operativo, no una opinión legal. Debe validarlo el responsable del tratamiento. Se basa en minimización y limitación de conservación del [artículo 5 del RGPD](https://eur-lex.europa.eu/eli/reg/2016/679/oj), junto con pruebas periódicas y resiliencia del artículo 32.

## 9.37 — Reglas y canales

| Señal | Umbral | Severidad | Acción inicial |
|---|---|---|---|
| Uptime | 2 fallos consecutivos | P1 | Webhook + GitHub + llamada al on-call |
| TLS | <= 30 días | P2 | Renovar y verificar |
| TLS | <= 14 días | P1 | Renovación inmediata o contención |
| DNS | 2 fallos regionalmente confirmados | P1 | Verificar zona, DNSSEC y proveedor |
| 5xx | >= 2 %, mínimo 20 requests, 5 min | P1 | Diagnóstico y rollback si coincide con release |
| 4xx | >= 15 %, mínimo 100 requests, 15 min | P2 | Revisar rutas/robots sin datos de visitante |
| Latencia | p95 > 2 s durante 5 min | P2 | Revisar edge, origen y saturación |
| Deploy/rollback | 1 fallo | P1 | Congelar cambios y aplicar runbook |

El canal primario es el webhook HTTPS guardado como `ALERT_WEBHOOK_URL`; el secundario son las notificaciones protegidas de GitHub Environment; el terciario es la llamada manual al suplente. Los mensajes sólo incluyen servicio, entorno, severidad, tipo, hora y URL de la ejecución.

## 9.40 — Core Web Vitals de campo

La opción por defecto es Google Search Console: aporta tendencias agregadas de LCP, CLS e INP sin añadir JavaScript, cookies ni un proveedor analítico al sitio. Cada lunes se revisan grupos de URL ES/EN/DE y se abre P2 si una ruta crítica entra en “deficiente” durante siete días; una regresión que coincida con release se compara con Lighthouse y se revierte si afecta conversión o accesibilidad.

RUM propio sólo se habilita mediante ADR y revisión de privacidad si Search Console carece de muestra. El contrato opcional exige muestreo máximo del 5 %, endpoint UE propio, sin cookies, sin almacenamiento local, sin IP persistida, sin URL completa/query y sin identificador estable. Sólo admite locale, clase de ruta, clase de dispositivo y buckets de LCP/CLS/INP. Los eventos crudos se eliminan a los 14 días y los agregados a los 90 días. No se activa en este release.

## Comandos operativos

```sh
node tools/monitor-production.mjs
npm run internal:qa:phase-9e
docker compose -f compose.production.yml config
nginx -t -c /etc/nginx/nginx.conf
logrotate --debug infra/logrotate/iocode-observability
systemd-analyze verify infra/systemd/iocode-observability-prune.service infra/systemd/iocode-observability-prune.timer
systemd-analyze verify infra/systemd/iocode-production-monitor.service infra/systemd/iocode-production-monitor.timer infra/systemd/iocode-production-alert.service
```
