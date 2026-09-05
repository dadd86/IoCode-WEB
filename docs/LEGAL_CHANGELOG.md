# Historial y gobernanza legal

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9.50 | Registro público de versiones legales | Impressum, privacidad, RAT, DPA y DSAR | ES, EN, DE | Git, aprobación legal y documentos 9F | 2026-09-05 |

## Versiones

| Versión | Fecha | Responsable | Estado | Cambios |
|---|---|---|---|---|
| 2026-09-05.3 | 2026-09-05 | Diego Armando Diaz Devia (IoCode SOLUTIONS) — aprobado | Publicado | Normalización nominal: `providerName` fijado a "Diego Armando Diaz Devia" (sin tilde) alineado con la identificación oficial declarada; se propaga automáticamente a `businessDesignationText` y `contactPerson.name` por interpolación, sin duplicar el nombre en el código. Reconciliación contractual: el proveedor de correo se corrige a `Zoho Corporation B.V.` (entidad neerlandesa) en `src/data/legal.ts`, `config/privacy-governance.json`, `docs/PROCESSOR_DPA_REGISTER.md`, `docs/ROPA_INVENTORY.md`, `ARCHITECTURE-ES/EN.md` y el test de contrato; el país acompañante se corrige de Alemania a Países Bajos/UE en las tres versiones lingüísticas, ya que "B.V." es una forma jurídica neerlandesa y no alemana. |
| 2026-09-05.2 | 2026-09-05 | Diego Armando Díaz Devia (IoCode SOLUTIONS) — aprobado | Sustituida | Editorial: `businessDesignationText` interpola `providerName`/`businessName` desde `legal-profile.ts` en vez de repetir el nombre manualmente en cada idioma; redacción del apartado de hosting distingue el procesamiento transitorio TCP/HTTP (IP, user-agent) de lo que la aplicación realmente conserva en logs (timestamp, estado HTTP, bytes, duración, máx. 14 días); JSON-LD separa la dirección de notificación §5 DDG (Hamburg, solo `Organization`) del establecimiento real (Aachen, NRW, usado en `ProfessionalService`/`Service`/`Person`) para no declarar el buzón como sede física; `tests/e2e/phase-9f-legal-privacy.spec.ts` sincronizado con la página sin tabla y la versión vigente; ADR-0009 marcado `Superseded`; `docs/index.md` y `docs/SECRETS_ACCESS_INVENTORY.md` purgados de referencias a variables `PUBLIC_LEGAL_*` |
| 2026-09-05.1 | 2026-09-05 | Diego Armando Díaz Devia (IoCode SOLUTIONS) — aprobado | Sustituida | Autoridad de control resuelta a LDI NRW por el establecimiento real en Aachen (NRW); dirección de servicio corregida a `c/o IP-Management #11289`; teléfono publicado; se elimina el gate de aprobación por variables de entorno (`PUBLIC_LEGAL_APPROVED`/`PUBLIC_PRIVACY_APPROVED`) y la tabla pública de proveedores pendientes; DNS/CDN y registrador quedan fuera de alcance por no tratar datos de visitantes; se retira la sección Art. 14 RGPD (no aplica a esta web) y la sección especulativa de Search Console; controllerApproval pasa a `approved` en `config/privacy-governance.json` |
| 2026-08-23.1 | 2026-08-23 | IoCode SOLUTIONS — propietario legal pendiente de firma | Sustituida | Einzelunternehmen; retirada de representación/registro y § 18(2) MStV; DPA ejecutados de Hetzner y Zoho; retención de correo alineada con el ciclo del encargado; autoridad X1 pendiente |
| 2026-08-05.1 | 2026-08-05 | IoCode SOLUTIONS — propietario legal pendiente de firma | Borrador técnico | Autoridad de Hamburgo corregida, evidencia ISO/IEC 27001:2022 atribuida sólo a Hetzner y alias públicos hacia las políticas canónicas |
| 2026-08-04.1 | 2026-08-04 | IoCode SOLUTIONS — propietario legal pendiente de firma | Borrador técnico | Dirección y USt-IdNr. de Hamburg, hosting Hetzner pendiente de DPA y transparencia de Clipboard API/contacto local |
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
