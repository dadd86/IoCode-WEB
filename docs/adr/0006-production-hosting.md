# ADR-0006 — Hosting de producción en VPS Docker

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| A | Selección entre hosting estático administrado y VPS Docker | Hosting, seguridad, coste y operación | ES, EN, DE | Perfil de producción, Dockerfiles y requisitos 9.2–9.11 | 2026-08-01 |

Estado: Accepted.

## Contexto

Astro genera un sitio completamente estático. La plataforma debe ofrecer TLS, redirecciones, cabeceras estrictas, compresión, rollback menor de 15 minutos y trazabilidad por digest. El repositorio ya tiene un runtime endurecido y QA dependiente de sus cabeceras CSP calculadas por respuesta.

## Opciones evaluadas

| Criterio | Estático administrado | VPS Docker |
|---|---|---|
| Operación | Menor; CDN/TLS gestionados | Mayor; SO, TLS, monitorización y parches propios |
| Rendimiento global | CDN nativa | Requiere CDN posterior si crece el tráfico |
| Control de CSP, caché y redirects | Depende del proveedor | Completo y versionado en Nginx/origen |
| Portabilidad | Riesgo de configuración propietaria | OCI y Compose portables |
| Rollback | Habitualmente instantáneo | Menor de 15 min mediante digest anterior |
| Coste inicial | Bajo o nulo | VPS, backups y operación |
| Ajuste al stack existente | Requiere traducir reglas | Reutiliza imagen y gates actuales |

## Decisión

Se elige VPS Docker en Alemania/UE. Nginx no privilegiado termina TLS y aplica el dominio canónico; el contenedor Astro/Node queda aislado en una red interna. Producción solo acepta imágenes por digest. El despliegue lo ejecuta un runner autoalojado protegido por el entorno GitHub `production`.

## Consecuencias

Se obtiene control reproducible y rollback sin build, a cambio de mantener el host, renovar TLS, monitorizar y aplicar parches. Un CDN podrá añadirse sin alterar el origen cuando lo indiquen los umbrales del perfil. Si no existe capacidad de guardia o parcheo, este ADR debe revisarse y preferirse hosting administrado.
