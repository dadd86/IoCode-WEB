# ADR-0007 — Veracidad de mensajes de commit

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R-PRIVACIDAD / trazabilidad | Registro de divergencia entre mensaje y diff | Historial Git | No aplica | `git show --stat`, `git diff-tree` y contenido de `.gitignore` | 2026-08-23 | `14e70ef` |

## Hallazgo

El mensaje del commit `14e70ef` afirma que actualiza `.gitignore`, pero el fichero no forma parte de su diff. El cambio observado consiste en normalización de finales de línea en diez ficheros. No existe evidencia de la modificación de exclusiones descrita por el mensaje.

## Decisión

No se reescribe ni se maquilla el commit. La divergencia se conserva como deuda de trazabilidad y se documenta aquí, del mismo modo que los defectos de descripción tratados en R2. Los mensajes futuros deben describir únicamente cambios demostrables por el diff y los resultados de validación no deben confundirse con contenido modificado.

## Consecuencia

El historial mantiene su SHA y su procedencia, pero quien lo audite dispone de una corrección versionada. Este ADR no convierte el cambio ausente en realizado; el blindaje real de `.gitignore` pertenece al lote R-PRIVACIDAD posterior.
