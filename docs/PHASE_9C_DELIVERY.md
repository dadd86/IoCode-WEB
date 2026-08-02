# Entrega Fase 9C — Three.js y rendimiento

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9C | Contrato de producción Hero3D 9.20–9.25 | Three.js, WebGL, GLB, HTTP y Core Web Vitals | ES, EN, DE | `src/scripts/hero3d.ts`, `tools/qa-phase-9c.mjs` y tests Playwright/Lighthouse | 2026-08-02 |

## Matriz de cierre

| ID | Estado | Contrato verificable |
|---|---|---|
| 9.20 | Implementado | GLB 2.0, tamaño, longitud declarada, SHA-256 completo y query con los primeros 12 caracteres |
| 9.21 | Implementado | `model/gltf-binary`, caché immutable anual para URL versionada, cuerpo idéntico y una descarga por documento |
| 9.22 | Implementado | DPR máximo 1,5 touch/tablet y 2 desktop; cámara y canvas recalculados por `ResizeObserver` |
| 9.23 | Implementado | Fallback estático, pérdida/restauración de contexto, desmontaje GPU, canvas idempotente y reduced motion |
| 9.24 | Implementado | Runtime dinámico tras visibilidad/idle, duración publicada en DOM y gates LCP/CLS/TBT de Lighthouse |
| 9.25 | Implementado | Presupuestos bloqueantes para GLB, JS, CSS, raster y chunks iniciales/Three.js |

## Identidad del GLB

- Ruta: `public/logo/3d/iocode_solutions_logo_extruded_3d.glb`.
- Tamaño verificado: 168.812 bytes.
- SHA-256: `572076acb6cb7618e2e8535b2630a6214e9b7f56acdc18edb30cf5f5f29a5951`.
- URL: `/logo/3d/iocode_solutions_logo_extruded_3d.glb?v=572076acb6cb`.
- MIME: `model/gltf-binary`.
- Caché versionada: `public, max-age=31536000, immutable`.
- El GLB no se comprime dinámicamente para evitar alterar o duplicar la transferencia binaria.

## Presupuestos bloqueantes

| Recurso o métrica | Límite |
|---|---:|
| GLB objetivo | 250.000 bytes |
| GLB máximo | 500.000 bytes |
| JS inicial por ruta | 250.000 bytes |
| JS total | 700.000 bytes |
| CSS total | 120.000 bytes |
| Raster individual | 350.000 bytes |
| Loader inicial Hero3D gzip | 5.000 bytes |
| Runtime Three.js gzip | 190.000 bytes |
| LCP laboratorio | 2.500 ms |
| CLS laboratorio | 0,1 |
| TBT laboratorio | 300 ms |

## Verificación

```powershell
npm ci
npm run check
npm run internal:typecheck:src
npm run internal:typecheck:tests
npm run build
npm run internal:qa:phase-9c:static
npm run internal:qa:headers:6
npm run internal:qa:phase-9c:e2e
npm run internal:qa:lighthouse:6
```

Los perfiles automatizados cubren Chromium desktop, Chromium móvil/Android, WebKit iPhone y WebKit iPad. Safari macOS y Firefox se validan mediante la matriz manual de dispositivo real antes de un cambio material de Three.js, driver GPU o modelo. Chrome en iOS usa WebKit, por lo que el perfil WebKit reproduce su motor, pero no sustituye una prueba física.

Core Web Vitals reales requieren datos de campo posteriores al despliegue. Lighthouse constituye un gate de laboratorio; tras publicar se revisan LCP, CLS e INP en Search Console/RUM y se conserva rollback al artefacto anterior.

## Evidencia local del cierre

- Build Astro: 35 páginas.
- GLB: 168.812 bytes y SHA-256 coincidente entre fuente, build y respuesta HTTP.
- JS total: 604.409 bytes; CSS total: 47.635 bytes; raster total: 132.835 bytes.
- Loader Hero3D gzip: 2.346 bytes; runtime Three.js gzip: 151.167 bytes.
- Playwright: 20/20 tests superados en Chromium desktop, Chromium móvil, WebKit iPhone y WebKit iPad.
- Inspección del navegador: activación observada de 1.461 ms, DPR 1,25, un canvas y cero overflow.
- Lighthouse: performance 0,96–1,00; LCP máximo 1.388,32 ms; CLS máximo 0; TBT máximo 0 ms.
- La única advertencia Lighthouse fue un `EPERM` al limpiar su directorio temporal después de generar correctamente todos los reportes; no afecta métricas ni artefacto.
