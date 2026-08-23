# Lote R-POST-PRIVACY — deuda de contratos e integridad documental

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R-POST-PRIVACY | Registro de deuda posterior al cierre de Fases 2/4/5 | Tests unitarios y README | No aplica | Suite global y validador documental | 2026-08-23 |

## Autoridad y alcance

Este lote queda asignado como trabajo posterior, de coste bajo y alcance independiente. Registrar un elemento no autoriza a cambiar su contrato ni su implementación. No forma parte del commit correctivo de P5.

## Inventarios congelados — actualizar cifras, no reparar tests

| ID | Contrato | Estado | Acción futura |
|---|---|---|---|
| D-01 | Interfaz congelada en 90 scripts | Pendiente | Re-inventariar la interfaz actual y actualizar la cifra con evidencia |
| D-02 | Contador congelado en 121 consumidores | Pendiente | Recontar consumidores controlados y documentar el delta |
| D-03 | Hash de registro inmutable divergente | Pendiente | Identificar el cambio de bytes y actualizar la referencia sólo con trazabilidad |
| D-04 | Requisito de ejecución Docker de R3.5b | Pendiente | Actualizar el estado del entorno soportado y su evidencia; no simular Docker |

## Contratos de expectativa — decidir contrato o implementación

| ID | Contrato | Estado | Pregunta de evaluación |
|---|---|---|---|
| D-05 | Límite de tamaño de PageControl | Pendiente | ¿El presupuesto sigue siendo correcto o la implementación debe reducirse? |
| D-06 | Formato mínimo de telemetría Nginx | Pendiente | ¿El parser del test refleja la configuración vigente o falta el contrato operativo? |

## Integridad documental

El validador reporta ocho defectos en `README.md`: ausencia del contrato de metadatos y siete enlaces relativos que no resuelven. Se agrupan como D-07 y deberán corregirse juntos, verificando enlaces y metadatos sin reescribir documentos históricos.

## Criterio de cierre futuro

El lote se cierra únicamente con inventario reproducible, explicación de cada delta, suite dirigida verde y validador documental sin los ocho defectos registrados. No se reutiliza un resultado histórico como evidencia nueva.
