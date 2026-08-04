# Registro de proveedores, DPA y transferencias

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9.44/9.48 | Due diligence de encargados y transferencias internacionales | Hosting, email, DNS/CDN, registrar y Search Console | ES, EN, DE | Contratos de proveedor y `config/privacy-governance.json` | 2026-08-04 |

## Estado actual

| Servicio | Proveedor | Rol/DPA | Ubicación | Transferencia | Gate |
|---|---|---|---|---|---|
| Hosting | Hetzner Online GmbH | Encargado esperado; aceptación del DPA Art. 28 pendiente | Alemania (EEE) | Tratamiento EEE; revisar subencargados y soporte | Bloqueado hasta evidencia contractual |
| Email | PENDIENTE | Encargado esperado; DPA obligatorio | PENDIENTE | PENDIENTE | Bloqueado |
| DNS/CDN | PENDIENTE | Determinar encargado o responsable independiente | PENDIENTE | PENDIENTE | Bloqueado |
| Registrar | PENDIENTE | Determinar encargado o responsable independiente | PENDIENTE | PENDIENTE | Bloqueado |
| Search Console | PENDIENTE entidad contractual | Evaluar términos/DPA | PENDIENTE | DPF o SCC/TIA por verificar | Desactivado |

La selección de Hetzner y la región alemana proceden del contrato técnico aprobado en este lote; no se marca el DPA como aceptado ni la revisión de subencargados como terminada sin evidencia contractual. Los contratos, anexos, contactos y firmas permanecen en el repositorio privado de cumplimiento.

## Checklist Art. 28

Antes de aprobar un encargado:

1. Identificar entidad legal, servicio, finalidad, tipos de datos e interesados.
2. Obtener DPA escrito que cubra duración, instrucciones, confidencialidad, seguridad, subencargados, derechos, borrado/devolución, auditoría y asistencia en incidentes.
3. Revisar lista y países de subencargados y mecanismo de aviso/cambio.
4. Confirmar medidas técnicas, eliminación, backup, soporte y separación de clientes.
5. Registrar propietario, fecha, versión contractual, renovación y evidencia privada.

## Transferencias fuera del EEE

Orden de decisión:

1. Preferir tratamiento y soporte íntegramente en el EEE.
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
