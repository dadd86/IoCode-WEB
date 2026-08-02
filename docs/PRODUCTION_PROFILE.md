# Perfil de producción — IoCode SOLUTIONS

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| A | Contrato operativo y de capacidad del sitio público | Producción, continuidad y ownership | ES, EN, DE | `astro.config.mjs`, `compose.production.yml`, ADR-0006 y propietario del servicio | 2026-08-01 |

## Bloque A — metadatos obligatorios

| Campo | Valor aprobado |
|---|---|
| Producto | IoCode SOLUTIONS Web |
| Tipo de aplicación | Sitio corporativo estático generado por Astro; sin base de datos ni backend público |
| Idiomas | Español, inglés y alemán |
| Dominio canónico | `https://iocode-solutions.com` |
| Variante | `https://www.iocode-solutions.com` redirige con 308 al dominio sin `www` |
| Hosting elegido | VPS Linux en región Alemania/UE, Docker Compose, Nginx TLS y origen estático interno |
| Región primaria | Alemania (UE); ciudad y proveedor se registran en el inventario privado al contratarse |
| Tráfico de diseño inicial | 100 000 solicitudes/mes; pico sostenido 20 solicitudes/s; transferencia objetivo menor de 100 GB/mes |
| Escalado | CDN opcional delante del VPS cuando el percentil 95 supere 15 solicitudes/s durante 15 minutos o 70 % de transferencia mensual |
| Disponibilidad objetivo | 99,9 % mensual, excluyendo mantenimiento anunciado |
| RTO | 15 minutos mediante cambio al digest anterior y smoke test |
| RPO | 0 para contenido publicado: cada release es un artefacto estático inmutable; no existen datos de usuario en runtime |
| Retención | Últimos 5 releases y manifiestos; mínimo 30 días en CI |
| Responsable (A) | Responsable técnico/propietario de IoCode SOLUTIONS |
| Operador (R) | Production Engineer de guardia con acceso al runner `production` |
| Contacto operativo | `contact@iocode-solutions.com`; el teléfono/escalado se conserva fuera de Git |

## SLO y alertas

Se comprueba cada minuto `https://iocode-solutions.com/es/` desde una región externa. Se alerta tras dos fallos consecutivos, certificado con menos de 14 días, respuesta no 200, ausencia de CSP/HSTS o latencia superior a 2 segundos durante cinco minutos. El responsable acusa recibo en 5 minutos y decide rollback antes del minuto 10.

## Fronteras

El contenedor no recibe secretos de negocio y no conserva estado. TLS termina en Nginx. DNS, certificados, credenciales de registro, runner y alertas pertenecen al plano privado de operación. Los valores reales no se versionan.
