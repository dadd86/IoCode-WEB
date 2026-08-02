# Historial y gobernanza legal

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9.50 | Registro público de versiones legales | Impressum, privacidad, RAT, DPA y DSAR | ES, EN, DE | Git, aprobación legal y documentos 9F | 2026-08-02 |

## Versiones

| Versión | Fecha | Responsable | Estado | Cambios |
|---|---|---|---|---|
| 2026-08-02.1 | 2026-08-02 | IoCode SOLUTIONS — propietario legal pendiente de firma | Borrador técnico | Transparencia Art. 13/14, RAT, proveedores/DPA, cookies §25 TDDDG, transferencias y DSAR |
| 2026-08-01.1 | 2026-08-01 | Equipo web | Sustituida | Primera estructura multilingüe de Impressum y privacidad con gate `noindex` |

## Flujo de cambio

1. Abrir cambio con finalidad, base jurídica, idiomas, proveedores y efecto en cookies/transferencias.
2. Actualizar `src/data/legal.ts`, `config/privacy-governance.json`, RAT, registro DPA y este historial.
3. Ejecutar QA 9F y revisión lingüística ES/EN/DE.
4. Obtener aprobación explícita del responsable; incrementar versión y fecha.
5. Desplegar por release inmutable y verificar seis rutas legales y footer.
6. Conservar evidencia privada de aprobación; no guardar firmas, contratos ni identificaciones en Git.

Cambios editoriales sin efecto jurídico incrementan el último componente. Nuevas finalidades, bases, proveedores, transferencias o tecnologías de terminal requieren versión mayor, revisión de privacidad y posible consentimiento.
