# SECURITY.md

## Principios

- No publicar secretos.
- No commitear `.env`.
- No publicar `.git` dentro de ZIPs o despliegues.
- No enlazar repositorios privados.
- No afirmar que el formulario envia datos a un backend: solo prepara `mailto:`.

## Assets permitidos

- `public/logo/iocode-logo.svg`
- `public/logo/3d/iocode_solutions_logo_extruded_3d.glb`

No publicar assets fuente como EPS, PDF, ZIP, PSD o carpetas internas.

## Docker

El servicio de produccion usa Nginx no privilegiado, filesystem read-only, `tmpfs`, `cap_drop: ALL` y `no-new-privileges`.

## Revision antes de publicar

- Revisar consola.
- Revisar enlaces externos.
- Revisar que no existan `.env`, backups, dumps o logs.
- Revisar que no se publique `Skills/` ni `public/Logo/`.
