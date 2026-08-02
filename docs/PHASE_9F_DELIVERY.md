# Entrega Fase 9F — Cumplimiento legal y privacidad

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9F | Implementación y estado 9.41–9.50 | Legal público, privacidad y gobernanza | ES, EN, DE | Código, pruebas, RGPD, DDG y TDDDG | 2026-08-02 |

| ID | Implementación | Estado de publicación |
|---|---|---|
| 9.41 | RAT exhaustivo y JSON de gobernanza | Completo; proveedores reales pendientes |
| 9.42 | Impressum ES `/aviso-legal/`, EN `/imprint/`, DE `/impressum/` y alias histórico | Estructura completa; dirección/forma/representación pendientes de aprobación |
| 9.43 | Política Art. 13/14 en tres idiomas | Completa técnicamente; revisión jurídica pendiente |
| 9.44 | Registro DPA Art. 28 y checklist | Bloqueado hasta seleccionar y firmar proveedores |
| 9.45 | RAT Art. 30 mantenido; no se invoca exención | Completo |
| 9.46 | Matriz y scanner de cookies/storage | Completo |
| 9.47 | Justificación de ausencia de banner | Completa para el release actual |
| 9.48 | Árbol de decisión EEE/adecuación/DPF/SCC-TIA | Bloqueado hasta verificar ubicaciones reales |
| 9.49 | Procedimiento DSAR con meta 30 días | Completo |
| 9.50 | Versión pública y changelog | Completo; firma del propietario pendiente |

El repositorio impide convertir campos desconocidos en afirmaciones legales. El build local muestra estado draft y `noindex`; el gate de producción exige aprobación, identidad, dirección, forma jurídica, representante y disclosures reales de hosting, email, DNS/CDN y registrar.

Referencias primarias: [§5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html), [§25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html), [RGPD](https://eur-lex.europa.eu/eli/reg/2016/679/oj) y [reglas de transferencias de la Comisión Europea](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/obligations/what-rules-apply-if-my-organisation-transfers-data-outside-eu_en).
