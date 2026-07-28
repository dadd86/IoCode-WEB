# Fase 6 — Performance, Core Web Vitals y 3D avanzado

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Contratos medibles de rendimiento, entrega y fidelidad del Hero3D | Astro, Three.js, GLB, HTTP y Lighthouse | ES, EN, DE | `compose.yml`, scripts Fase 6, GLB actual y artefactos QA locales | 2026-07-28 |

Estado: `Current`. Esta fase solo se considera cerrada cuando el pipeline oficial Docker genera `qa-artifacts/performance/phase-6/summary.json` con `status: passed`, cero errores, cero warnings y cero tests flaky.

## Objetivo y alcance

La Fase 6 demuestra que Three.js, el GLB, las imágenes, el JavaScript y la entrega estática no bloquean el contenido principal ni perjudican de forma relevante UX, SEO, accesibilidad o mantenibilidad.

| Criterio | Evidencia obligatoria |
|---|---|
| 6.1 Herramientas reproducibles | Servicio Docker `assets`; glTF-Transform, glTF Validator, Sharp, ImageMagick, gzip y Brotli disponibles dentro de la imagen |
| 6.2 Presupuestos | `performance-budgets.json` |
| 6.3 GLB | `glb-repair-report.json`, `glb-report.json`, `gltf-validator-report.json` |
| 6.4 Bundle | `bundle-report.json` |
| 6.5 Lazy/defer | Chunk inicial ligero y pruebas runtime |
| 6.6 Pausa y liberación | `hero3d-runtime-review.json` y pruebas Playwright |
| 6.7 HTTP/cache | `headers-report.json` |
| 6.8 Fallback | `3d-fallback-runtime-report.json` |
| 6.9 Lighthouse | `lighthouse-summary.json` y los JSON/HTML bajo `lighthouse/` |
| 6.10 Modos degradados | Pruebas sin WebGL, reduced motion, error de GLB y pérdida de contexto |
| 6.11 Regresión Docker | `npm run qa:phase-6` ejecutado por `performance-qa` |
| 6.12 Documentación | Este documento, `docs/RUNBOOK.md` y `QA_CHECKLIST.md` |

## Flujo oficial, solo Docker

Desde la raíz del repositorio:

```powershell
docker compose --profile assets build --no-cache assets
docker compose --profile assets run --rm assets "npm run prepare:assets:6"
docker compose --profile prod --profile qa build --no-cache web performance-qa
docker compose --profile prod --profile qa up -d web
docker compose --profile prod --profile qa run --rm performance-qa
docker compose --profile prod --profile qa down --remove-orphans
```

No ejecutar Node, npm, Playwright, Lighthouse, Sharp, glTF-Transform ni glTF Validator directamente en Windows. `prepare:assets:6` modifica el GLB del workspace de forma intencionada y deja un backup recuperable dentro de `qa-artifacts/`, que está excluido del release.

## Presupuestos de cierre

| Medida | Límite |
|---|---:|
| GLB ideal | 2.000.000 bytes |
| GLB aceptable | 5.000.000 bytes |
| GLB bloqueante | más de 8.000.000 bytes |
| JS inicial por HTML | 250.000 bytes |
| Loader inicial del Hero3D | 12.000 bytes; 5.000 bytes gzip |
| Chunk Three.js | 190.000 bytes gzip |
| JS desplegado total | 700.000 bytes |
| CSS desplegado total | 120.000 bytes |
| Lighthouse desktop | 0,90 o superior |
| Lighthouse mobile | 0,75 o superior |
| LCP lab | 2.500 ms o inferior |
| CLS lab | 0,1 o inferior |
| TBT lab | 300 ms o inferior |

Los límites viven en `compose.yml` y los scripts fallan si se superan. `performance-budgets.json` mide `dist/` como superficie desplegable; `public/` se usa para comprobar las fuentes requeridas sin duplicar los totales.
- `qa:logo3d-version:6`: la query `?v=` del GLB coincide con el SHA-256 real del archivo actual.

### Contrato real del logo 3D

El archivo `public/logo/3d/iocode_solutions_logo_extruded_3d.glb` verificado en R2 pesa **168.812 bytes**, por debajo del objetivo de R8 de **250.000 bytes**. El programa R8 exige bloquear por encima de **500.000 bytes**.

Los umbrales ejecutables actuales de Fase 6 siguen siendo 2.000.000, 5.000.000 y 8.000.000 bytes en `compose.yml` y en los scripts de QA. Por DYC, el objetivo R8 no se considera aplicado hasta que esos gates cambien y sus pruebas demuestren el bloqueo de 500.000 bytes. Mientras tanto, prevalece la tabla de límites ejecutables anterior para describir el sistema actual.

Lighthouse conserva 10 resultados comparables: portadas ES/EN/DE, Servicios ES
y Contacto ES, cada una en desktop y mobile. Cada resultado desktop se obtiene
de la mediana de tres ejecuciones consecutivas del score de performance, con
TBT como desempate; mobile conserva una ejecución. Todos los intentos quedan
registrados en `lighthouse-summary.json`.

## Decisiones del Hero3D

- El HTML, el H1, los CTA, los enlaces y el fallback existen antes del runtime 3D.
- El loader ligero usa `IntersectionObserver` y programa la carga con `requestIdleCallback`; un timeout máximo de 800 ms evita que Safari, Chrome iOS o Android permanezcan indefinidamente en `deferred`.
- Una comprobación geométrica inmediata usa el mismo margen de precarga de 320 px para cubrir la notificación inicial tardía de `IntersectionObserver` observada en WebKit, sin adelantar la descarga del runtime cuando el Hero sigue lejos del viewport.
- La autocarga no registra ni necesita `pointerenter`, `pointerdown`, `touchstart` o `focusin`.
- Three.js y `GLTFLoader` permanecen en un chunk dinámico y se solicitan automáticamente cuando el Hero entra en la zona próxima al viewport.
- Con `prefers-reduced-motion: reduce` o sin WebGL no se solicita el runtime pesado.
- El render se pausa con reduced motion, pestaña oculta o hero fuera de viewport.
- El DPR se limita a 1,5 en pantallas táctiles/tablet y a 2 en escritorio.
- El GLB contiene una única cara alpha-safe generada desde `public/logo/iocode-logo.png`.
- El runtime sustituye el material PBR importado por `MeshBasicMaterial`, desactiva tone mapping y conserva la textura canónica sin duplicarla como mapa emisivo. La perspectiva, la rotación limitada y el movimiento aportan profundidad sin deformar el logotipo.
- En `pagehide`, error o pérdida de contexto se cancelan listeners/RAF y se liberan geometrías, materiales, texturas y renderer.
- La pérdida de contexto activa un fallback HTML usable.
- El GLB usa en `src/data/site.ts` los primeros 12 caracteres de su SHA-256 como versión de caché. `qa:headers:6` bloquea cualquier binario cuyo parámetro `v` no coincida.
- En viewports de hasta 620 px, PLC y ROBOTS ocupan la franja superior, SOFTWARE permanece por debajo de la zona central y las áreas secundarias se presentan mediante el dock inferior.
- DATA, HMI e IOT usan un dock HTML independiente del canvas, con `z-index` propio y composición WebKit mediante `translateZ(0)` y `backface-visibility`.
- La zona central del logo se valida geométricamente en WebKit iPhone sobre las portadas ES, EN y DE.
- Las posiciones móviles se expresan en porcentajes de píxeles CSS, por lo que el gate de layout no depende del DPR físico.
- `qa:hero3d-ios:6` bloquea la Fase 6 si un panel invade el área del logo, el escenario genera overflow o el dock sale de sus límites.
- El encabezado cambia a un `details/summary` tipo hamburguesa hasta 1280 px, por lo que funciona en móvil y tablet horizontal sin depender de hidratación JavaScript.
- Los H1 internos usan `clamp()`, `text-wrap: balance`, palabras completas y columnas amplias; la prosa usa `text-wrap: pretty` sin cortes silábicos artificiales.
- `qa:responsive-visual:6` conserva 72 capturas (24 rutas internas × móvil/tablet/escritorio) bajo `qa-artifacts/performance/phase-6/responsive-pages/`.

## Estado de verificación del 27-07-2026

Estado de la fase: `NO CERRADA`.

| Verificación | Estado | Evidencia |
|---|---|---|
| `astro check` y build de 29 rutas | PASS | Build de la imagen `web`: 93 archivos, 0 errores, 0 warnings |
| Preparación, validación y versión del GLB | PASS | `prepare:assets:6`, `qa:assets:6`, `qa:logo3d-version:6` |
| Autocarga ES/EN/DE | PASS | 12 casos sin reintentos: Chromium desktop/mobile y WebKit iPhone/iPad |
| Composición iOS y fallback | PASS | 5 casos de `phase-6-hero-ios.spec.ts` |
| Menú hamburguesa móvil/tablet | PASS | 25 casos Chromium y 8 casos focalizados WebKit |
| Responsive interno ES/EN/DE | PASS | 93 casos Chromium/WebKit + 72 capturas visuales |
| Contacto responsive y mailto | PASS | 6 casos funcionales desktop/móvil; formulario primero |
| Fidelidad visual automatizada | PASS | Test de píxeles y capturas claro/oscuro/iPhone |
| Pipeline completo `qa:phase-6` | PASS | Ejecución Docker encadenada finalizada con código `0` |
| Lighthouse completo y `summary.json` final | PASS | 10/10 mediciones; `passed`, 0 warnings y 0 errores |
| iPhone/iPad físicos | NOT TESTED | La evidencia actual usa WebKit automatizado |

La Fase 6 no se puede cerrar hasta contrastar al menos una captura de dispositivo físico con el mismo build y completar los gates de entrega/producción.

## Entrega HTTP y caché

- HTML: `no-cache`.
- JS/CSS con fingerprint: un año e `immutable`.
- GLB con query de versión: un año e `immutable`.
- El cuerpo HTTP del GLB debe coincidir en longitud y SHA-256 con el archivo de `dist`; así se detectan respuestas binarias truncadas, duplicadas o intercaladas.
- PNG, WebP y AVIF si existe: `Content-Type` correcto y caché pública.
- JS/CSS: Brotli o gzip, `ETag` y `Vary: Accept-Encoding`.

El laboratorio Docker usa HTTP de forma intencionada. Por ello, los audits generales de Lighthouse relacionados exclusivamente con HTTPS/redirect HTTP pueden reducir Best Practices en local. Producción debe terminar TLS y redirección HTTP→HTTPS en el proxy, CDN o plataforma; este requisito no se puede demostrar desde el contenedor HTTP aislado.

## Cómo interpretar Lighthouse

Lighthouse es evidencia de laboratorio y sirve como gate de regresión. No demuestra por sí solo Core Web Vitals reales. Tras publicar, se debe observar LCP, CLS e INP de campo mediante la plataforma de hosting, RUM o Search Console y conservar un rollback al artefacto anterior.

## Si el GLB supera presupuesto

1. Confirmar el tamaño y los avisos de glTF Validator.
2. Revisar cámaras/nodos no usados, texturas, resolución, materiales y geometría.
3. Ejecutar la reparación dentro del servicio `assets` y repetir el pipeline completo.
4. No añadir múltiples GLB por dispositivo, WebGPU ni Blender salvo evidencia de una reparación geométrica necesaria.
5. No aceptar más de 5 MB sin registrar justificación, propietario, medición móvil y rollback. Más de 8 MB es NO-GO.

## Condiciones NO-GO

- Falta cualquier artefacto requerido o no coincide el SHA-256 reparado con el GLB actual.
- Hay warnings, errores, tests flaky o fallos inesperados.
- Three.js aparece en el JavaScript crítico inicial.
- El fallback, los enlaces o el contenido fallan sin WebGL/reduced motion.
- JS/CSS/GLB se entregan con MIME o caché incorrectos.
- Falta el backup before-repair, la prueba de pérdida de contexto o una de las diez mediciones Lighthouse.
- El despliegue real no tiene HTTPS, rollback o monitorización posterior.
- El logo 3D se renderiza fragmentado, como rectángulo, con textura rota o con partes ausentes.
- El GLB no fue generado por `tools/repair-glb-phase-6.mjs` en modo `alpha-safe-billboard`.
- `qa:assets:6` no valida `gltf.extras.iocodePhase6LogoMode = alpha-safe-billboard`.
- El test runtime `logo 3D no se renderiza fragmentado ni como rectángulo roto` no pasa.
- El GLB fue regenerado pero `siteConfig.logo3dPath` conserva una query antigua.
- El navegador puede servir un GLB roto desde caché porque la URL del modelo no cambió.
- `qa:hero3d-ios:6` falla en WebKit iPhone sobre cualquiera de las portadas ES, EN y DE.
- PLC, ROBOTS o SOFTWARE invaden la región central del logo.
- El Hero3D móvil produce overflow horizontal.
- La proporción del escenario móvil supera `1.35`.
- DATA, HMI o IOT no son visibles y accionables en el dock.
- El menú hamburguesa no funciona en móvil o tablet.
- No existe una captura física de iPhone que corresponda al mismo build validado por Docker.

## Propiedad y actualización

Responsable: mantenedor del repositorio. Actualizar este documento, `docs/RUNBOOK.md` y `QA_CHECKLIST.md` cuando cambien el GLB, Three.js, el loader, presupuestos, rutas Lighthouse, servidor estático, Dockerfiles o scripts de Fase 6.
