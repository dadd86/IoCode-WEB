# Security

Documento de seguridad para IoCode SOLUTIONS Web.

## Alcance

Esta revisión aplica al estado actual del proyecto:

- sitio estático Astro;
- Docker local;
- servidor estático Node;
- formulario `mailto`;
- sin base de datos;
- sin login;
- sin sesiones;
- sin API propia;
- sin cookies de aplicación;
- sin pagos;
- sin subida de archivos.

## Datos tratados

El sitio puede preparar datos de contacto mediante el cliente de correo del usuario:

- nombre;
- email;
- tipo de proyecto;
- mensaje.

El sitio no almacena estos datos en servidor propio en esta fase. El formulario construye un enlace `mailto:` y delega el envío en el cliente de correo del usuario.

## Controles implementados

Servidor estático:

- `Content-Security-Policy`;
- `X-Content-Type-Options`;
- `X-Frame-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `Cross-Origin-Opener-Policy`;
- `Cross-Origin-Resource-Policy`;
- `Origin-Agent-Cluster`;
- ETag;
- Last-Modified;
- 404 real;
- redirect 308 para rutas canónicas;
- healthcheck sin caché.

Docker runtime:

- usuario no root;
- filesystem read-only;
- sin capabilities Linux;
- `no-new-privileges`;
- `tmpfs` para `/tmp`.

## CSP actual

La política CSP actual se define en:

```text
Docker/node-static-server.mjs