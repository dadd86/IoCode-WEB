# Registro de actividades de tratamiento (RAT / ROPA)

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9.41/9.45 | Inventario y registro conforme al artículo 30 RGPD | Sitio, infraestructura, correo y derechos | ES, EN, DE | `config/privacy-governance.json`, Nginx y componentes Astro | 2026-08-23 |

## Decisión sobre aplicabilidad

IoCode SOLUTIONS mantiene un RAT completo. No se invoca la excepción del artículo 30(5): aunque la organización pueda tener menos de 250 personas, la publicación del sitio, los logs técnicos y la gestión de correo son actividades recurrentes y no meramente ocasionales. El registro también facilita demostrar responsabilidad proactiva.

Responsable: persona física que opera como `Einzelunternehmen`; IoCode SOLUTIONS es el nombre comercial. La identidad y dirección de servicio son datos públicos del aviso. Canal operativo: `PUBLIC_PRIVACY_EMAIL`. La autoridad competente no se deduce de la dirección de servicio: X1 permanece pendiente por la diferencia entre residencia y dirección de servicio. X1, X2 y la aprobación formal mantienen bloqueada la publicación definitiva.

## RAT-01 — Entrega del sitio y seguridad

| Campo | Contenido |
|---|---|
| Interesados | Visitantes del sitio |
| Datos | IP y conexión en tránsito; el log de aplicación conserva timestamp, estado HTTP, bytes y tiempos |
| Finalidad | Entrega, disponibilidad, seguridad y diagnóstico |
| Base | Art. 6.1.f RGPD; interés legítimo en operación segura |
| Destinatarios | Hosting y DNS/CDN, cuando se seleccione |
| Transferencia | Bloqueada hasta verificar ubicación y garantía |
| Conservación | Logs mínimos: máximo 14 días; evidencia de incidente mientras sea necesaria y documentada |
| Medidas | TLS, CSP, logs sin identificadores, filesystem read-only, mínimos privilegios, release inmutable |

## RAT-02 — Consultas por correo

| Campo | Contenido |
|---|---|
| Interesados | Prospectos, clientes, proveedores y contactos profesionales |
| Datos | Nombre, email, tipo de proyecto, mensaje y metadatos del correo |
| Finalidad | Respuesta, medidas precontractuales, contrato y comunicación empresarial |
| Base | Art. 6.1.b o 6.1.f RGPD según contexto |
| Destinatarios | Zoho Corporation GmbH como encargado y personal autorizado |
| Transferencia | Datos almacenados en el EEE; Schedule 2 permite acceso del grupo desde India para soporte y depuración; § 5.2 del DPA obliga a Zoho a garantizar base válida |
| Conservación | El responsable elimina u organiza mensajes cuando dejan de ser necesarios; tras borrado activo, el ciclo ordinario de Zoho puede tardar hasta seis meses y los backups hasta tres meses adicionales; plazos legales aplicables si existe contrato |
| Medidas | `mailto:` local, sin backend ni base de datos, minimización de campos y acceso restringido al buzón |

## RAT-03 — Google Search Console

| Campo | Contenido |
|---|---|
| Estado | Desactivado hasta DNS, entidad contractual, términos y transferencias verificados |
| Interesados | Visitantes representados en agregados y usuarios autorizados de la cuenta |
| Datos | Métricas agregadas de búsqueda, indexación y Core Web Vitals; datos de cuenta |
| Finalidad | SEO técnico, indexación y rendimiento de campo |
| Base | Art. 6.1.f, sujeto a evaluación final de interés legítimo |
| Destinatario | Entidad de Google que resulte contratante |
| Conservación | Retención del proveedor; exportación sólo si es necesaria |
| Medidas | Sin Analytics, Tag Manager, píxeles, cookies ni script cliente de Google |

## RAT-04 — Enlaces externos

| Campo | Contenido |
|---|---|
| Interesados | Personas que activan enlaces a GitHub o LinkedIn |
| Datos | Datos de conexión transmitidos por el navegador después del clic |
| Finalidad | Acceder a perfiles profesionales y código público |
| Base | Navegación solicitada por la persona; el tercero aplica su propio aviso |
| Medidas | Sin widgets, iframes, preconnect, píxeles ni requests previos al clic |

## RAT-05 — Solicitudes de derechos

| Campo | Contenido |
|---|---|
| Interesados | Solicitantes y representantes autorizados |
| Datos | Identidad/contacto, alcance, evidencia proporcional y registro de respuesta |
| Finalidad | Verificar, atender y demostrar el cumplimiento de los artículos 12–22 |
| Base | Art. 6.1.c RGPD en relación con las obligaciones de derechos |
| Destinatarios | Responsable y asesor jurídico/privacidad sólo cuando sea necesario |
| Conservación | Tres años después del cierre, sujeto a revisión jurídica del responsable |
| Medidas | Registro separado, acceso mínimo, entrega cifrada cuando proceda y eliminación de copias de identidad |

## Revisión

El responsable revisa este RAT trimestralmente y antes de nuevos proveedores, analytics, almacenamiento del navegador, formularios backend, newsletter o transferencias fuera del EEE. Cada cambio se registra en `LEGAL_CHANGELOG.md`.

Fuente normativa: [artículo 30 RGPD, texto oficial EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj).
