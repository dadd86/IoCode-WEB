# Docker Security Notes

Notas de seguridad para el entorno Docker local.

## Modelo actual

El proyecto genera un sitio estÃ¡tico con Astro. El contenedor `web` sirve `dist` con un servidor Node minimalista.

No hay base de datos, sesiones, autenticaciÃ³n, cookies de sesiÃ³n ni backend de formularios en esta fase.

## Controles activos

Runtime de producciÃ³n local:

- usuario no root.
- filesystem read-only.
- `tmpfs` en `/tmp`.
- `no-new-privileges`.
- capacidades Linux eliminadas.
- healthcheck local.
- cabeceras HTTP de seguridad.
- cache control explÃ­cito.
- ETag y Last-Modified.
- 404 real.
- redirect 308 para rutas canÃ³nicas.

## CSP

La CSP actual mantiene `unsafe-inline` para scripts y estilos porque el sitio Astro actual genera y usa inline code.

Deuda futura:

- reducir scripts inline.
- evaluar hashes o nonces si el hosting lo permite.
- revisar compatibilidad del formulario `mailto`.
- revisar impacto en la escena 3D.

## HSTS

No activar en local. Activar solo despuÃ©s de validar HTTPS real en producciÃ³n.

## Secretos

No guardar secretos en:

- repositorio.
- documentaciÃ³n.
- Docker build args.
- frontend.
- `public`.
- `dist`.
- logs.

## Contacto

El formulario usa `mailto:` y no envÃ­a datos a servidor.

Aun asÃ­, la UI advierte no escribir:

- contraseÃ±as.
- tokens.
- datos bancarios.
- informaciÃ³n sensible.

## No-go

No publicar si:

- el correo de contacto no existe.
- aparecen secretos en el repositorio.
- `audit:prod` reporta vulnerabilidades.
- el servidor no devuelve 404 real.
- el healthcheck falla.
- las cabeceras principales desaparecen.