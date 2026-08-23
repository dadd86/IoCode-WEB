# Registro de proveedores, DPA y transferencias

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9.44/9.48 | Due diligence de encargados y transferencias internacionales | Hosting, email, DNS/CDN, registrar y Search Console | ES, EN, DE | Contratos de proveedor y `config/privacy-governance.json` | 2026-08-23 |

## Estado actual

| Servicio | Proveedor | Rol/DPA | Ubicación | Transferencia | Gate |
|---|---|---|---|---|---|
| Hosting | Hetzner Online GmbH | Encargado; DPA Art. 28 ejecutado | Alemania (EEE) | Hosting EEE; subencargados sujetos al contrato | Listo respecto de DPA; aprobación global sigue bloqueada |
| Email | Zoho Corporation GmbH | Encargado; DPA firmado el 19.08.2026 | Datos en centros del EEE | Schedule 2: acceso del grupo desde India para soporte y depuración; § 5.2 obliga a Zoho a garantizar base válida | Listo respecto de DPA; aprobación global sigue bloqueada |
| DNS/CDN | PENDIENTE | Determinar encargado o responsable independiente | PENDIENTE | PENDIENTE | Bloqueado |
| Registrar | PENDIENTE | Determinar encargado o responsable independiente | PENDIENTE | PENDIENTE | Bloqueado |
| Search Console | PENDIENTE entidad contractual | Evaluar términos/DPA | PENDIENTE | DPF o SCC/TIA por verificar | Desactivado |

La selección de Hetzner y la región alemana proceden del contrato técnico. El DPA de Hetzner está ejecutado; la evidencia contractual refiere ISO 27001, § 8a BSI-KritisV y BSI C5 Type 2 sin atribuir una versión de ISO que el contrato no sustenta. El DPA de Zoho está firmado y documenta almacenamiento en el EEE, además del acceso posible desde India descrito arriba. Estas evidencias corresponden a los proveedores y no certifican a IoCode SOLUTIONS. Contratos, anexos, contactos y firmas permanecen en el repositorio privado de cumplimiento.

## Checklist Art. 28

Antes de aprobar un encargado:

1. Identificar entidad legal, servicio, finalidad, tipos de datos e interesados.
2. Obtener DPA escrito que cubra duración, instrucciones, confidencialidad, seguridad, subencargados, derechos, borrado/devolución, auditoría y asistencia en incidentes.
3. Revisar lista y países de subencargados y mecanismo de aviso/cambio.
4. Confirmar medidas técnicas, eliminación, backup, soporte y separación de clientes.
5. Registrar propietario, fecha, versión contractual, renovación y evidencia privada.

## Transferencias fuera del EEE

Orden de decisión:

1. Preferir tratamiento y soporte íntegramente en el EEE cuando sea viable, sin presentarlo como condición absoluta ni ocultar accesos de soporte fuera del EEE.
2. Si existe decisión de adecuación, verificar que cubra al país, sector y entidad concreta.
3. Para Estados Unidos, comprobar la participación activa de la entidad receptora en el EU-US Data Privacy Framework y el alcance de datos cubiertos.
4. Si no hay adecuación aplicable, ejecutar SCC vigentes, Transfer Impact Assessment y medidas suplementarias antes del primer dato.
5. Bloquear el proveedor si no puede demostrarse una garantía válida o derechos efectivos.

La Comisión Europea explica que una adecuación permite flujos equiparables a los intra-UE; sin ella deben aplicarse garantías como SCC y derechos exigibles: <https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/obligations/what-rules-apply-if-my-organisation-transfers-data-outside-eu_en>.

## Evidencia mínima por proveedor

- DPA y términos con fecha/versión.
- Región contratada y ubicación real de datos, logs, backups y soporte.
- Subencargados y aviso de cambios.
- Mecanismo de transferencia y TIA cuando proceda.
- Contacto de incidentes y plazos de notificación.
- Evidencia de borrado al terminar el servicio.
- Revisión anual y ante cambios materiales.
