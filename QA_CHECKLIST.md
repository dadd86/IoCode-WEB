# QA_CHECKLIST.md

## Comandos

| Prueba | Esperado | Estado |
|---|---|---|
| `npm install` | Dependencias instaladas | Pending |
| `npm run check` | 0 errores | Pending |
| `npm run build` | Build generado | Pending |
| `npm run preview` | Preview accesible | Pending |
| `npm run audit:prod` | 0 vulnerabilidades prod | Pending |

## Rutas

| Ruta | Esperado | Estado |
|---|---|---|
| `/es/` | Home espanol | Pending |
| `/en/` | Home ingles | Pending |
| `/de/` | Home aleman | Pending |
| `/es/servicios/` | Servicios | Pending |
| `/en/services/` | Services | Pending |
| `/de/leistungen/` | Leistungen | Pending |
| `/es/automatizacion-plc/` | PLC | Pending |
| `/en/plc-automation/` | PLC | Pending |
| `/de/sps-automatisierung/` | SPS | Pending |

## SEO

| Prueba | Esperado | Estado |
|---|---|---|
| Canonical | Ruta actual | Pending |
| hreflang es | Ruta equivalente ES | Pending |
| hreflang en | Ruta equivalente EN | Pending |
| hreflang de | Ruta equivalente DE | Pending |
| sitemap.xml | Todas las rutas | Pending |

## UI

| Prueba | Esperado | Estado |
|---|---|---|
| Logo header/footer | Visible | Pending |
| Selector idioma | Conserva ruta equivalente | Pending |
| Responsive | Sin scroll horizontal | Pending |
| Contacto | Abre mailto | Pending |
| Logo 3D | Carga GLB y no se recorta | Pending |
| Fallback 3D | Muestra SVG si falla WebGL | Pending |

## Seguridad

| Prueba | Esperado | Estado |
|---|---|---|
| `.git/` | No incluido | Pending |
| `.env` | No incluido | Pending |
| ZIPs internos | No incluidos | Pending |
| Repos privados | Sin enlaces | Pending |
