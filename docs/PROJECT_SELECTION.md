# Selección y publicación de proyectos

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2-recovery | Contrato editorial para seleccionar, publicar y retirar proyectos | Portafolio, evidencia, seguridad y contenido | ES, EN, DE | `src/data/projects.ts` y evidencia verificable | 2026-07-29 |

## Objetivo y fuente de verdad

La sección demuestra capacidad técnica y criterio profesional; no busca maximizar
el número de casos. La fuente publicada es `src/data/projects.ts`.

La guía explicativa anterior se conserva en
[`archive/PROJECT_SELECTION.full-2026-07-28.md`](archive/PROJECT_SELECTION.full-2026-07-28.md).
Este documento contiene el contrato editorial vigente.

## Clasificación obligatoria

Antes de redactar, clasificar el proyecto según el modelo real (`Project` en
`src/data/projects.ts`):

- `claimLevel`: `verified` (los artefactos públicos respaldan las
  afirmaciones técnicas principales) o `technical-demonstration` (los
  artefactos públicos demuestran una capacidad técnica concreta sin implicar
  despliegue comercial en producción). No existen otros valores.
- `evidenceLevel`: no se declara por proyecto; el modelo lo fija
  automáticamente a `"public-repository"` en `createProject()`.
- `featured`: decisión editorial, no prueba de calidad.

### Público

Puede incluir enlaces solo si el destino es público, estable, pertinente y fue
revisado. El texto debe distinguir demostración técnica de producto o despliegue
real.

El modelo `Project` actual requiere un enlace de repositorio: `publicLinks` se
genera siempre a partir de `repository` en `createProject()`, sin ninguna
variante que produzca `publicLinks: []`. Las experiencias confidenciales o sin
evidencia pública no son elegibles como Project bajo este modelo.

### Interno, académico, demo local o solo documentación

Debe nombrarse como tal. No se presenta como implantación productiva, trabajo para
cliente ni resultado comercial validado.

## Criterios de selección

Puntuar cada criterio de 0 a 5 y conservar la evidencia usada:

| Criterio | Pregunta de decisión |
|---|---|
| Relevancia | ¿Representa una capacidad que IoCode ofrece o quiere demostrar? |
| Profundidad | ¿Explica problema, solución, rol técnico y decisiones? |
| Evidencia | ¿El nivel declarado coincide con lo verificable? |
| Mantenibilidad | ¿El caso sigue siendo entendible y actualizable? |
| Seguridad y privacidad | ¿Evita secretos, datos personales y contexto sensible? |
| Claridad comercial | ¿Explica valor sin promesas no demostradas? |
| Diferenciación | ¿Añade una señal distinta al resto del portafolio? |
| Multilingüe | ¿Mantiene el mismo `scope` y nivel de evidencia en ES, EN y DE? |

La media orienta, pero no sustituye los no-go:

- `4,0–5,0`: candidato a destacado;
- `3,0–3,9`: publicable;
- `2,0–2,9`: mejorar antes de publicar;
- `<2,0`: no publicar.

Un solo criterio de rechazo inmediato bloquea la publicación aunque la media sea
alta.

## Rechazo inmediato

No publicar si el proyecto:

- contiene secretos, credenciales, `.env`, claves, tokens o datos personales;
- enlaza un repositorio privado o un destino no revisado;
- identifica clientes, instalaciones o procesos sin autorización verificable;
- expone código privado, IP, topología, tags PLC o pantallas internas;
- afirma producción, precisión, ahorro, disponibilidad o impacto sin evidencia;
- carece de una versión completa en ES, EN o DE;
- presenta una demo, ejercicio o caso académico como implantación real;
- contradice su `evidenceLevel`, `claimLevel` o `scope`.

## Modelo mínimo de datos

No crear un modelo paralelo en la documentación. El ejemplo siguiente ilustra,
para un único idioma, los campos que produce el tipo `Project` existente en
`src/data/projects.ts`: los campos de `copy` (título, resumen, problema,
solución, etc.) más los campos compartidos del `ProjectSeed` que los envuelve
(`capabilities`, `claimLevel`, `repository`, `featured`). No es literalmente
ni `Project` ni `ProjectSeed`: `key` y `path` los deriva `createProject()`, y
`evidenceLevel`/`publicLinks` se explican debajo.

```ts
{
  slug: "identificador-estable",
  title: "...",
  type: "...",
  summary: "...",
  problem: "...",
  solution: "...",
  technicalRole: "...",
  businessValue: "...",
  evidenceSummary: "...",
  technologies: ["..."],
  capabilities: ["software-architecture"],
  claimLevel: "technical-demonstration",
  scope: "...",
  repository: "nombre-del-repositorio-en-github",
  featured: false,
  seoTitle: "...",
  seoDescription: "...",
  keywords: ["..."],
  imageAlt: "..."
}
```

`evidenceLevel` no se declara por proyecto: el modelo lo fija automáticamente
a `"public-repository"` en `createProject()`. `schemaType` se repite igual en
cada copy, pero `createProject()` lo sobrescribe siempre a
`"SoftwareSourceCode"`, así que su valor por proyecto no tiene efecto.

Los campos de copy se definen para `es`, `en` y `de` en el mismo `ProjectSeed`.
Tecnologías, capacidades, claimLevel, enlaces y `featured` se comparten para
evitar divergencias entre idiomas.

## Procedimiento de alta

1. Reunir la evidencia disponible y registrar su origen.
2. Aplicar clasificación, puntuación y no-go.
3. Definir `claimLevel` sin elevar el alcance real.
4. Redactar problema, solución, rol, valor y `scope` en ES, EN y DE.
5. Añadir enlaces solo después de comprobar acceso público y contenido.
6. Crear el `ProjectSeed` en `src/data/projects.ts`.
7. Revisar que `createProject()` produzca las tres variantes completas.
8. Verificar que claims, tecnologías, enlaces y `scope` sean coherentes.
9. Probar la tarjeta/página en los tres idiomas y todos los tamaños soportados.
10. Ejecutar los gates indicados al final.

## Procedimiento de retirada

1. Retirar la semilla o impedir su publicación desde `src/data/projects.ts`.
2. Eliminar enlaces y referencias editoriales relacionadas.
3. Si existía una URL pública propia, definir redirección o respuesta intencional.
4. Comprobar menú, sitemap, enlaces internos y las tres variantes.
5. Mantener historial solo si no conserva datos que motivaron la retirada.

La retirada es inmediata si aparece un secreto, dato personal, enlace privado o
reclamación de autorización.

## Plantilla de evaluación

```text
Proyecto:
Responsable de revisión:
Fecha:
Origen de evidencia:

EvidenceLevel: public-repository (fijo, no editable)
ClaimLevel:

Relevancia:          /5
Profundidad:         /5
Evidencia:           /5
Mantenibilidad:      /5
Seguridad/privacidad:/5
Claridad comercial: /5
Diferenciación:      /5
Multilingüe:         /5

No-go detectado:
Decisión: destacar | publicar | mejorar | rechazar
Justificación:
```

## Criterio de cierre

Un proyecto queda aceptado cuando la clasificación coincide con la evidencia,
ningún no-go está presente, las copias ES/EN/DE están completas y equivalentes,
los enlaces públicos fueron revisados y pasan:

```text
npm run check
npm run internal:typecheck:src
npm run build
npm run internal:docs:lint
```

El número de líneas es un indicador de mantenibilidad, no sustituye estos
criterios.
