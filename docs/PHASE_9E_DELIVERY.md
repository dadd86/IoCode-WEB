# Entrega Fase 9E — Observabilidad y operaciones

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9E | Matriz de implementación y evidencia de los puntos 9.33–9.40 | Producción, monitorización y recuperación | ES, EN, DE | Configuración, scripts, workflows, tests y runbooks | 2026-08-02 |

| ID | Estado técnico | Evidencia versionada |
|---|---|---|
| 9.33 | Implementado | Cuatro objetivos HTTPS, healthcheck, timeout y umbral en `config/observability.json` y `tools/monitor-production.mjs` |
| 9.34 | Implementado | Resolución A/AAAA/CNAME, cadena/SAN TLS y alertas <=14 días |
| 9.35 | Implementado | `privacy_minimal` de Nginx sin IP, request, referer, user-agent, cookies ni autorización |
| 9.36 | Implementado | Docker `local`, logrotate, timer systemd y poda máxima de 14 días |
| 9.37 | Implementado | Umbrales P1/P2, workflow programado, webhook HTTPS y alerta de fallo de deploy/rollback |
| 9.38 | Implementado | `docs/INCIDENT_RUNBOOK.md` con ciclo completo y autoridad |
| 9.39 | Implementado | `docs/DISASTER_RECOVERY.md`, rollback sin build y ensayo trimestral |
| 9.40 | Implementado | Search Console por defecto; contrato RUM opcional sin cookies ni identificadores |

La implementación puede validarse localmente y en CI sin secretos. La activación operativa exige configurar `ALERT_WEBHOOK_URL`, el proveedor externo de uptime en dos regiones y el DNS/TLS real. Mientras el dominio siga sin resolver, el sign-off de publicación de `RELEASE_SIGNOFF.md` continúa en NO-GO; esto no invalida la finalización del código de 9E.
