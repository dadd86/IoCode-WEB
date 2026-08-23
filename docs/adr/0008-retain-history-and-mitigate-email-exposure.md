# ADR-0008 — Conservar el historial y mitigar la exposición de P3

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R-PRIVACIDAD / decisión OWNER | Aceptación consciente del riesgo residual P3 sin reescritura | Historial Git y cuenta GitHub | No aplica | Auditoría forense del repositorio y decisión del titular | 2026-08-23 |

## Contexto

La auditoría demostró que P1, P2, P4 y P6 nunca estuvieron en el árbol ni en el historial público. P3 sí aparece de forma histórica en contenido y metadatos, pero es el elemento de menor criticidad del conjunto auditado. El repositorio se mantiene público deliberadamente como evidencia de trayectoria profesional.

Una purga completa exigiría reescribir 89 commits públicos únicos. Aunque las dos ramas remotas suman 176 apariciones de commits, no son 176 objetos únicos. Reescribir commits históricos cambiaría los SHA descendientes, invalidaría clones y forks existentes y sólo mitigaría copias bajo control del titular.

## Decisión

No se reescribe el historial por P3. El titular acepta conscientemente su permanencia histórica y adopta controles preventivos:

1. La identidad Git local del repositorio usa exclusivamente el correo corporativo público.
2. GitHub debe mantener activadas las opciones **Keep my email address private** y **Block command line pushes that expose my email**.
3. El gate G-01 bloquea correos de proveedores personales en fuentes, documentación, configuración, tests y artefactos.
4. La lista exacta privada se conserva fuera de Git y se inyecta en CI mediante un secreto.

La activación de las opciones de cuenta es una acción OWNER y debe verificarse antes del siguiente push. Esta decisión no afirma que el dato desaparezca de copias históricas ni sustituye la higiene de identidades futuras.

## Consecuencias

- Se conserva la continuidad del historial y su utilidad como evidencia profesional.
- No se rompen forks ni clones existentes.
- P3 permanece visible en commits históricos y se acepta ese riesgo residual.
- Todo commit nuevo debe usar la identidad corporativa verificada.
- Cualquier aparición futura de P3 en contenido debe bloquearse como S0.

## Alternativas rechazadas

- Reescribir únicamente los dos commits que introdujeron P3 en contenido: no elimina P3 de metadatos y cambia los SHA descendientes.
- Reescribir contenido y metadatos: mitigación más amplia, pero desproporcionada respecto de la criticidad y con impacto operativo sobre todo el historial público.
