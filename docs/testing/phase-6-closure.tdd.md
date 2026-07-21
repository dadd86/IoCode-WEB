# Evidencia TDD — cierre de Fase 6

Fecha: 2026-07-18  
Alcance: ciclo de vida del Hero 3D, fallback WebGL, presupuestos, caché y evidencia de cierre.

## RED

Se añadió primero la revisión ejecutable `qa:hero3d-review:6` y se ejecutó dentro de Docker contra el runtime existente. El control falló porque todavía no estaban cubiertos cinco comportamientos requeridos:

- pausa cuando el documento queda oculto;
- pausa cuando el Hero sale del viewport;
- reacción a un cambio dinámico de `prefers-reduced-motion`;
- fallback y liberación ante pérdida del contexto WebGL;
- desmontaje durante `pagehide`.

La prueba E2E de pérdida de contexto se añadió antes de la implementación y tampoco podía pasar con el runtime anterior.

La reconstrucción limpia también expuso dependencias transitivas obsoletas del CLI de glTF Transform. Al activar después `strict-allow-scripts`, la compilación falló inicialmente por scripts de `fsevents` no clasificados, demostrando que el control bloquea elementos no revisados.

## GREEN

Se implementó un ciclo de vida idempotente para el runtime, con estados observables, pausa/reanudación, liberación de geometrías, materiales, texturas, targets, PMREM y renderer, además de fallback estable por pérdida de contexto.

Resultado de la cadena oficial Docker después de la corrección:

- Astro: 89 archivos, 0 errores, 0 advertencias y 0 indicaciones;
- TypeScript de aplicación y pruebas: aprobado;
- Playwright: 9/9, 0 omitidas, 0 inesperadas y 0 inestables;
- revisión estática Hero 3D: 10/10 controles aprobados;
- Lighthouse: 10/10 mediciones aprobadas;
- resumen estricto: `passed`, 0 errores y 0 advertencias.

El CLI redundante se retiró, el grafo quedó en 475 paquetes auditados, `esbuild` y `sharp` se aprobaron por versión, `fsevents` se denegó y las imágenes web/QA se reconstruyeron sin avisos npm ni vulnerabilidades.

## REFACTOR

Se centralizó la limpieza en `disposeRuntime`, se eliminó la cámara sin uso del GLB, se hizo idempotente la preparación del modelo y se endurecieron los informes para rechazar advertencias, evidencia ausente, hashes incoherentes o recuentos E2E incompletos.

## Cobertura y límites

El proyecto no dispone de un medidor de cobertura unitaria aplicable a WebGL. La cobertura de riesgo se demuestra mediante pruebas de navegador, revisión estática ejecutable, validación GLB, presupuestos, cabeceras y Lighthouse. TLS, redirección HTTP→HTTPS y datos de campo deben comprobarse en la infraestructura real de producción.

## Reapertura — corrupción del GLB durante la entrega HTTP

Fecha: 2026-07-19  
Estado: corregido localmente, Fase 6 abierta hasta confirmación visual del usuario.

### RED

La captura real mostró el logo como superficies blancas aunque los controles anteriores indicaban `passed`. La inspección en Chromium registró `THREE.GLTFLoader: Couldn't load texture blob:...`.

Se añadió una comprobación de integridad a `qa:headers:6` antes de modificar el servidor. Ejecutada dentro del contenedor `assets`, falló por la diferencia entre el GLB construido y el recibido por HTTP:

- SHA-256 esperado: `f4351680c512e1180e6ebfba77d24bf3763df2b5a0414a41ecc6c44ae4e6a11f`;
- SHA-256 recibido: `11466d937704ab4ae5cb1bf784e6a2c70f91d916f3c5a8922b51b2430647ffe3`.

La causa fue el envío concurrente del mismo archivo mediante dos `createReadStream` en el servidor estático. Los bytes se intercalaban y corrompían el GLB sin alterar su longitud declarada.

### GREEN

Se eliminó el segundo flujo de respuesta y se reconstruyó el contenedor `web`. La misma comprobación pasó con longitud `1 449 552` y SHA-256 `f4351680c512e1180e6ebfba77d24bf3763df2b5a0414a41ecc6c44ae4e6a11f` tanto en `dist` como por HTTP.

La prueba E2E del Hero3D ahora también rechaza errores de carga de textura. Resultado dirigido en Docker: 9/9 pruebas Playwright aprobadas, sin omitidas, inesperadas ni inestables. La inspección visual automatizada confirmó que desaparecieron las superficies blancas y volvió a mostrarse el logo coloreado completo.

Se añadió un segundo ciclo RED/GREEN para impedir que el navegador reutilice el GLB corrupto ya almacenado. RED rechazó `v=phase6-20260718`; GREEN usa `v=f4351680c512`, derivado del SHA-256 actual. Una sesión limpia de Chromium cargó esa URL, no registró errores y guardó `qa-artifacts/performance/phase-6/debug/final-stage.png` como evidencia visual de la corrección.
