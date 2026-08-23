# Operaciones de privacidad y solicitudes de derechos

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9.46/9.47/9.49 | Cookies, consentimiento y procedimiento DSAR | Frontend, correo y operación interna | ES, EN, DE | Código Astro, RGPD y TDDDG | 2026-08-02 |

## Canal y responsabilidad

Canal público: correo versionado en `src/data/legal-profile.ts`, coincidente con el canal del Impressum. El responsable legal es dueño del caso; el responsable técnico sólo localiza datos y preserva seguridad. No se crea portal ni base de datos pública para DSAR.

## Procedimiento DSAR

1. Registrar fecha/hora, canal, derecho solicitado, alcance, responsable y fecha límite. Asignar identificador `DSAR-AAAA-NNN` sin incluir el nombre en el título.
2. Acusar recepción en dos días hábiles e informar del plazo.
3. Verificar identidad de forma proporcional. Usar primero control del buzón, contexto conocido o confirmación desde la dirección implicada. Solicitar documento sólo si existe duda razonable; ocultar datos no necesarios y eliminar la copia al terminar la verificación.
4. Buscar únicamente en buzón empresarial, tickets privados, contratos aplicables, evidencias de incidentes y registros de proveedores pertinentes. El sitio no tiene backend ni perfiles de visitante.
5. Clasificar el derecho: acceso, rectificación, supresión, limitación, portabilidad, oposición o retirada.
6. Revisar derechos de terceros, secretos empresariales y obligaciones de conservación antes de revelar o borrar.
7. Responder de forma clara, segura y gratuita cuando proceda. La meta operativa es 30 días naturales; el límite jurídico es un mes desde la recepción. Si complejidad o volumen justifican extensión, informar dentro del primer mes y documentar hasta dos meses adicionales.
8. Registrar decisión, fuentes consultadas, export/borrado, fecha de respuesta y motivo de cualquier negativa. Informar de reclamación ante autoridad y recurso cuando no se actúe.
9. Cerrar y conservar el expediente mínimo tres años, sujeto a aprobación jurídica; eliminar copias temporales e identidad adicional.

## Derechos y respuesta

| Derecho | Acción operativa |
|---|---|
| Acceso | Confirmar tratamiento, finalidades, categorías, destinatarios, transferencias, conservación, fuente y copia |
| Rectificación | Corregir datos y comunicar a destinatarios cuando proceda |
| Supresión | Borrar salvo obligación o defensa jurídica documentada |
| Limitación | Marcar y bloquear usos no permitidos mientras se resuelve |
| Portabilidad | Entregar datos facilitados en formato estructurado cuando se cumplan los requisitos |
| Oposición | Cesar el tratamiento por interés legítimo salvo motivos imperiosos demostrados |
| Retirada | Cesar el tratamiento basado en consentimiento hacia futuro |

## Auditoría de cookies y almacenamiento

Matriz vigente:

| Tecnología | Uso | Persistencia | Consentimiento |
|---|---|---|---|
| Cookies HTTP/JS | No | Ninguna | No aplica |
| localStorage/sessionStorage | No | Ninguna | No aplica |
| IndexedDB/Cache API persistente | No | Ninguna | No aplica |
| Service worker | No | Ninguna | No aplica |
| Analytics, ads, A/B, píxeles | No | Ninguna | No aplica |
| Detección WebGL/reduced motion | Sí, local y efímera | No se almacena ni transmite | No |

El §25 TDDDG exige consentimiento para almacenar o acceder a información del terminal salvo transmisión o necesidad estricta. Como el release no realiza almacenamiento/acceso no esencial ni integra terceros antes del clic, un banner sería engañoso y no se muestra. La ausencia de banner no es una exención permanente.

## Trigger de reevaluación

Bloquear el release y repetir DPIA/consentimiento si aparece cualquiera de estos elementos: analytics/RUM, widgets o vídeos embebidos, captcha de tercero, píxeles, A/B testing, preferencias persistentes, service worker, login, chat, newsletter, formulario backend o nuevo CDN con scripts.

Fuentes normativas: [§25 TDDDG, texto oficial federal](https://www.gesetze-im-internet.de/ttdsg/__25.html) y [artículos 12–22 RGPD, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj).

Comandos:

```sh
rg -n "document\\.cookie|localStorage|sessionStorage|indexedDB|serviceWorker\\.register|caches\\.open" src public
npm run internal:qa:phase-9f:static
npm run internal:qa:phase-9f:e2e
```
