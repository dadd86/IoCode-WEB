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

## CSP sin unsafe-inline

La política CSP efectiva se define en:

```text
Docker/node-static-server.mjs

```md id="rmmq70"
## HSTS

HSTS es un control de despliegue HTTPS.

En auditoría local HTTP no se exige `Strict-Transport-Security`, porque el objetivo local es validar el servidor estático, CSP, headers base y superficie de privacidad.

Para despliegue HTTPS real:

```text
ENABLE_HSTS=true
SECURITY_REQUIRE_HSTS=true

## Formulario de contacto

El formulario debe mantener una advertencia visible para evitar que el usuario envíe información sensible.

Textos esperados:

```text
ES: No escribas contraseñas, tokens, datos bancarios ni información sensible.
EN: Do not write passwords, tokens, banking data or sensitive information.
DE: Bitte keine Passwörter, Tokens, Bankdaten oder sensiblen Informationen eingeben.
```

El correo empresarial configurado es:

```text
contact@iocode-solutions.com
```

El formulario no debe almacenar mensajes ni enviar datos a un backend en esta fase.

## Persona física y enlaces externos

Los enlaces a LinkedIn y GitHub de la persona técnica responsable solo deben aparecer en las páginas de contacto:

```text
/es/contacto/
/en/contact/
/de/kontakt/
```

No deben aparecer en páginas comerciales generales como home, servicios, proyectos, habilidades, empresa o proceso.

## Dependencias

Validación actual esperada:

```bash
docker compose exec dev npm run audit:prod
```

Resultado esperado:

```text
found 0 vulnerabilities
```

No usar `npm audit fix --force` sin revisar cambios rompientes.

## Secretos

No versionar:

- tokens reales;
- contraseñas reales;
- claves privadas;
- dumps;
- backups;
- `.env` con valores reales;
- credenciales cloud;
- claves de API.

Archivos y carpetas que no deben entrar en artefactos públicos:

```text
.env
.env.*
.git
node_modules
dist
.astro
backups
dumps
secrets
credentials
private
keys
```

El Docker context debe excluir `.git` y `.env` mediante `.dockerignore`.

## Validaciones recomendadas

Validación completa de Fase 1.1D:

```bash
docker compose exec dev npm run qa:phase-1-1d
```

Validar que LinkedIn, GitHub y el nombre de la persona física no aparecen fuera de contacto:

```bash
docker compose exec dev sh -lc "find dist -type f -name 'index.html' ! -path '*/contacto/*' ! -path '*/contact/*' ! -path '*/kontakt/*' -exec grep -HnE 'Diego Armando Diaz Devia|Diego Diaz|dadd86|linkedin\\.com/in/diegoarmandodiaz|github\\.com/dadd86' {} + || true"
```

Resultado esperado:

```text
sin salida
```

Validar que no hay asignaciones evidentes de secretos en fuente, documentación o Docker:

```bash
docker compose exec dev sh -lc "grep -RInE '(password|passwd|pwd|token|secret|api[_-]?key|private[_-]?key|access[_-]?key|client[_-]?secret)[[:space:]]*[:=][[:space:]]*[\"'\"']?[^\"'\"'[:space:]#;]{8,}|-----BEGIN (RSA |DSA |EC |OPENSSH |)?PRIVATE KEY-----' src docs Docker .env.example compose.yml README.md RUN_GUIDE.md SECURITY.md .gitignore .dockerignore 2>/dev/null || true"
```

Resultado esperado:

```text
sin salida
```

## No-go para publicar

No publicar si:

- `check` falla;
- `build` falla;
- `audit:prod` reporta vulnerabilidades;
- `/health` no devuelve 200;
- rutas inexistentes no devuelven 404;
- aparece información personal fuera de contacto;
- el correo de contacto no existe;
- hay secretos reales en el repositorio;
- hay `.env` real en el artefacto;
- hay `.git` en un artefacto público;
- HSTS se activa sin HTTPS real validado;
- aparece texto con codificación dañada en páginas visibles o documentación de release.

## Limitaciones

Este documento no certifica cumplimiento legal ni normativo. Solo describe controles técnicos revisados localmente para una web estática sin backend, sin login, sin sesiones, sin cookies de aplicación y sin almacenamiento propio de datos de formulario.