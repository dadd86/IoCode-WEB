# Plan de pruebas en dispositivos reales

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| 9D | Checklist físico previo al Go de producción | iOS Safari, iPadOS Safari y Android Chrome | ES, EN, DE | Build candidato desplegado por SHA y observación directa | 2026-08-02 |

## Matriz mínima

| Plataforma | Dispositivo mínimo | Navegador | Red | Orientaciones |
|---|---|---|---|---|
| iOS | iPhone 13 o equivalente compatible | Safari estable | Wi-Fi y 4G/5G limitado | Retrato y paisaje |
| iPadOS | iPad Pro 11 o equivalente | Safari estable | Wi-Fi | Retrato y paisaje |
| Android | Pixel 5 o gama media equivalente | Chrome estable | Wi-Fi y 4G/5G limitado | Retrato y paisaje |

Registrar modelo, versión de sistema, versión de navegador, fecha, tester, SHA desplegado y URL exacta. Una captura aislada no sustituye el checklist firmado.

## Checklist por dispositivo

- Abrir `/es/`, `/en/` y `/de/` desde una sesión privada limpia.
- Confirmar que header, selector de idioma, menú móvil y footer responden al primer toque.
- Abrir una ruta interna, aviso legal, privacidad y contacto.
- Confirmar que el enlace `mailto:` abre el selector o cliente de correo sin enviar automáticamente.
- Probar una URL inexistente bajo cada idioma y verificar status 404 y mensaje localizado.
- Rotar retrato/paisaje tres veces; no debe aparecer overflow horizontal ni un segundo canvas.
- Hacer scroll alejando y acercando el Hero3D; la animación debe pausarse y reanudarse sin salto visible.
- Activar “Reducir movimiento”, recargar y confirmar fallback estático sin descarga GLB ni canvas.
- En modo normal confirmar logo 3D completo, controles táctiles utilizables y ausencia de parpadeo o rectángulos negros.
- Dejar la página cinco minutos, cambiar de pestaña y volver; no debe haber calentamiento, bloqueo ni pérdida visual.
- Navegar adelante/atrás entre idiomas; debe existir un único canvas y no aumentar continuamente el uso de memoria.
- Con red limitada, el contenido, H1, navegación y fallback deben aparecer antes que el 3D.

## Evidencia obligatoria

Por dispositivo se adjuntan capturas de home, menú abierto, 404 localizado y Hero3D en ambas orientaciones; vídeo corto de rotación; consola remota sin errores; y resultado PASS/FAIL por cada punto. Cualquier crash, canvas duplicado, overflow, enlace inaccesible o regresión de contenido es bloqueante P0/P1 y exige `NO-GO`.

## Criterio de cierre

El gate físico sólo pasa cuando los tres perfiles tienen evidencia completa sobre el mismo SHA candidato y cero fallos abiertos. La emulación Playwright WebKit/Pixel es un gate previo, no reemplaza hardware real.
