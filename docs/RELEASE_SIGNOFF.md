# Release Sign-Off — Fase 9D

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| 9D | Decisión Go/No-Go previa y posterior al despliegue | QA, HTTP, Lighthouse, dispositivos y release | ES, EN, DE | CI, `qa-artifacts/phase-9d/`, DNS externo y checklist físico | 2026-08-02 | `471d17af8489b499de38504845456145847fcd61` |

## Decisión actual

**NO-GO para publicación en producción.**

El código candidato puede continuar por revisión técnica, pero no existe evidencia externa suficiente para autorizar producción. A 2026-08-02, `iocode-solutions.com` y `www.iocode-solutions.com` no resuelven por DNS desde el entorno de verificación. Por tanto no se pueden certificar TLS, HSTS, redirecciones públicas, cabeceras del edge ni Lighthouse sobre producción.

La Fase 9F añade un segundo bloqueo formal: faltan la dirección postal, forma jurídica, representación y aprobación del responsable, además de los nombres/ubicaciones reales de hosting, email, DNS/CDN y registrar, sus DPA y las garantías de transferencia. El gate conserva las páginas legales en `noindex` y estado draft hasta completar esta evidencia.

## Matriz 9.26–9.32

| ID | Gate | Estado actual | Evidencia o bloqueo |
|---|---|---|---|
| 9.26 | Pre-deploy | PASS local | Astro 115 archivos sin diagnósticos, TypeScript, build 38 páginas y audit 0 vulnerabilidades |
| 9.27 | Smoke post-deploy | PASS contenedor; producción bloqueada | 28/28 Playwright; suite shell ampliada |
| 9.28 | HTTP y seguridad externa | PASS contenedor / NO-GO externo | Contrato local completo; DNS público no resuelve |
| 9.29 | Lighthouse producción | PASS laboratorio / NO-GO externo | 8/8 mediciones locales; sin URL pública accesible |
| 9.30 | Dispositivos físicos | Pendiente | `REAL_DEVICE_TEST_PLAN.md` sin evidencias firmadas |
| 9.31 | Cero flaky | PASS | 42/42 ejecuciones, tres repeticiones, un worker y retries=0 |
| 9.32 | Sign-off | NO-GO | Bloqueantes externos y físicos abiertos |

## Condiciones obligatorias para cambiar a GO

1. Publicar A/AAAA y `www` según `DNS_TLS.md`, esperar propagación y verificar resolución autoritativa.
2. Desplegar exactamente el SHA candidato mediante imagen OCI por digest.
3. Ejecutar `QA_BASE_URL=https://iocode-solutions.com QA_EXPECT_EXTERNAL=true npm run internal:qa:phase-9d:http`.
4. Ejecutar smoke Playwright contra la misma URL sin retries y conservar JSON/HTML.
5. Ejecutar Lighthouse móvil/desktop para ES, EN, DE y `/es/impressum/` con todos los presupuestos en verde.
6. Completar y firmar la matriz física iPhone, iPad y Android sobre el mismo SHA.
7. Confirmar cero incidentes P0/P1, cero CSP violations y rollback disponible al digest anterior.
8. Completar y aprobar todas las variables `PUBLIC_LEGAL_*` y `PUBLIC_PRIVACY_*` sin valores de ejemplo.
9. Identificar proveedores reales, firmar o evaluar DPA Art. 28, revisar subencargados y verificar EEE/adecuación/DPF/SCC+TIA.
10. Ejecutar `npm run internal:qa:phase-9f` y `npm run internal:qa:config:prod` sobre el mismo artefacto aprobado.

## Evidencia ejecutada sobre el candidato local

- `astro check`: 115 archivos, 0 errores, 0 warnings y 0 hints.
- TypeScript de aplicación y Playwright: sin errores.
- Build de producción: 38 páginas.
- Dependencias de producción: 0 vulnerabilidades.
- Contrato HTTP local: CSP, `nosniff`, Brotli/Gzip, MIME JS/CSS/GLB, sitemap-index y redirect legal en verde.
- Smoke multiperfil: 28/28 en Chromium desktop, Chromium móvil, WebKit iPhone y WebKit iPad.
- Gate cero flaky: 42/42, tres repeticiones por motor seleccionado, `workers=1`, `retries=0`.
- Lighthouse laboratorio: 8/8; performance 0,96–1,00, accesibilidad 1,00, buenas prácticas 1,00 y SEO 1,00.
- Lighthouse laboratorio: LCP máximo 1.381,05 ms, CLS máximo 0 y TBT máximo 0 ms.
- Disponibilidad externa: `curl`, resolución DNS y navegador devolvieron `ERR_NAME_NOT_RESOLVED`.

Los datos legales utilizados en el build local fueron valores QA temporales no versionados. No constituyen datos aprobados para producción.

## Autoridad y reversión

Un único fallo de DNS/TLS, status, CSP, navegación, accesibilidad, Core Web Vitals o hardware mantiene `NO-GO`. Tras un GO, cualquier smoke post-deploy fallido activa rollback inmediato al artefacto anterior sin recompilar, siguiendo `PRODUCTION_OPERATIONS.md`.
