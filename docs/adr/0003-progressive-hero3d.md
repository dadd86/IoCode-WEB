# ADR-0003 — Hero3D progresivo con fallback

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Carga diferida de Three.js y preservación del logo canónico | UI, 3D, rendimiento y accesibilidad | ES, EN, DE | `src/components/Hero3D.astro`, runtime Hero3D y `docs/PERFORMANCE.md` | 2026-07-28 |

Estado: Accepted.

## Contexto

El logo 3D aporta identidad visual, pero no puede bloquear el H1, navegación, enlaces ni información del servicio. La representación debe conservar la textura y forma canónicas del logo.

## Decisión

El HTML usable y el fallback se entregan primero. Three.js se mantiene en un chunk dinámico; no se carga con reduced motion o sin WebGL. El runtime pausa fuera de viewport y libera recursos al finalizar.

El GLB actual pesa 168.812 bytes. El contrato objetivo de R8 es hasta 250.000 bytes y bloqueo por encima de 500.000; hasta que el gate ejecutable adopte esos valores, `docs/PERFORMANCE.md` debe distinguir el objetivo de los límites legacy vigentes.

## Consecuencias

Una regresión visual del logo, overflow, pérdida del fallback o inclusión de Three.js en el chunk crítico es `NO-GO`. No se introducen modelos separados por dispositivo ni compresión Draco sin evidencia.
