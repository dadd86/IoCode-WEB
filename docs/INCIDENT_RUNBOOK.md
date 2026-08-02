# Runbook de incidentes operativos

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9.38 | Respuesta reproducible a indisponibilidad, degradación, DNS, TLS y despliegue | Producción y proveedores operativos | ES, EN, DE | Alertas, releases inmutables, `config/observability.json` y `tools/rollback-release.sh` | 2026-08-02 |

## Severidad y autoridad

| Nivel | Ejemplo | Acuse | Mitigación objetivo | Autoridad |
|---|---|---:|---:|---|
| P0 | Compromiso de claves, pérdida irreversible o riesgo para personas | inmediato | inmediata | Responsable + seguridad/privacidad |
| P1 | Sitio caído, DNS/TLS inválido, deploy roto o 5xx sostenido | 5 min | 15 min | Responsable de producción |
| P2 | Latencia, 4xx o CWV degradados sin caída total | 30 min | mismo día hábil | Responsable o suplente |
| P3 | Mejora preventiva sin impacto | 1 día hábil | planificación | Equipo web |

El responsable de producción puede detener despliegues y ejecutar rollback. Cambios de DNS, revocación TLS, comunicación legal o declaración de brecha requieren además al propietario correspondiente. Nunca se copian secretos, IP, cabeceras o requests a tickets o chats.

## 1. Detección

1. Registrar hora UTC, señal, severidad propuesta, release activo y fuente de la alerta.
2. Confirmar desde una segunda red/región: `curl`, resolución autoritativa y monitor externo.
3. Abrir un incidente con identificador `INC-AAAA-MM-DD-NNN`; no incluir datos de visitantes.
4. Acusar P1 en cinco minutos y nombrar Incident Commander, operador y comunicador. Una persona puede asumir varios roles en incidentes pequeños, pero las decisiones quedan registradas.

## 2. Contención

1. Congelar deploys y cambios DNS no relacionados.
2. Si la alarma aparece después de un release, preparar el rollback inmutable sin recompilar.
3. Si es TLS, mantener HTTP redirigido sólo cuando exista un certificado válido; no desactivar la validación ni HSTS como atajo.
4. Si es DNS, reducir cambios a la zona afectada y conservar el último export firmado.
5. Si hay indicio de secreto expuesto, revocarlo, rotarlo y escalar como P0. No pegar el valor en el incidente.

## 3. Diagnóstico

Ejecutar desde una red externa y guardar sólo salida sanitizada:

```sh
dig +short A iocode-solutions.com
dig +short AAAA iocode-solutions.com
dig +short CNAME www.iocode-solutions.com
curl -fsS --max-time 10 -D - -o /dev/null https://iocode-solutions.com/es/
openssl s_client -connect iocode-solutions.com:443 -servername iocode-solutions.com </dev/null
docker compose -f /opt/iocode/releases/current/compose.production.yml ps
docker compose -f /opt/iocode/releases/current/compose.production.yml logs --since 15m --tail 200
```

La salida de contenedores sólo debe contener timestamp, estado, bytes y tiempos. Si aparece cualquier dato prohibido, detener la exportación, restringir acceso, eliminar copias no necesarias y abrir tarea de privacidad.

## 4. Rollback técnico

Usar la release `previous` ya desplegada. No ejecutar `npm install`, `npm run build` ni crear imágenes durante el incidente.

```sh
export RELEASE_ROOT=/opt/iocode/releases
sh /opt/iocode/releases/current/tools/rollback-release.sh
curl -fsS https://iocode-solutions.com/health
curl -fsS -o /dev/null https://iocode-solutions.com/es/
curl -fsS -o /dev/null https://iocode-solutions.com/en/
curl -fsS -o /dev/null https://iocode-solutions.com/de/
```

Si el rollback falla, no borrar `current` ni `previous`: aplicar `docs/DISASTER_RECOVERY.md` desde el bundle verificado. Para DNS/TLS, restaurar la zona/certificado conforme a ese documento y repetir el monitor completo.

## 5. Comunicación

- Inicio: “Investigamos una incidencia de disponibilidad en IoCode Solutions desde HH:MM UTC. Próxima actualización en 30 minutos.”
- Actualización: impacto por idioma/ruta, mitigación aplicada y siguiente hito; nunca causa especulativa ni datos personales.
- Resolución: hora de restauración, duración, rutas validadas, release activo y seguimiento previsto.
- P0/P1: actualización cada 30 minutos aunque no haya cambios.

El comunicador actualiza el canal interno y, si existe impacto público superior a 15 minutos, la página de estado. Las comunicaciones sobre una posible brecha se coordinan con privacidad; el equipo técnico no declara por sí solo obligaciones regulatorias.

## 6. Cierre y aprendizaje

1. Exigir dos ejecuciones consecutivas del monitor en verde y 15 minutos sin nueva alerta.
2. Registrar causa confirmada, línea temporal, decisiones, release final y acciones con propietario/fecha.
3. Realizar revisión sin culpa en 48 horas para P0/P1.
4. Borrar evidencia cruda a los 14 días; conservar sólo métricas agregadas y el informe sanitizado necesario.
5. Convertir toda acción preventiva repetible en test, alerta o cambio de runbook.
