# Changelog

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| Histórico | Resumen cronológico de entregas completadas | Proyecto completo | ES, EN, DE | Historial documental y Git | 2026-07-28 |

## Cierre de hallazgos residuales B2B (README, RompeCajas, CTA confidencial)

- Se corrigió `README.md`: conteo de páginas desactualizado ("thirty-eight generated pages" → 66 páginas verificadas del build) y enlaces rotos a `ARCHITECTURE.md`/`docs/es/ARCHITECTURE.md` (ficheros inexistentes) sustituidos por `ARCHITECTURE-EN.md`/`ARCHITECTURE-ES.md`. Se añadió la sección "Commercial content model" documentando brevemente `src/data/skills.ts`/`src/data/projects.ts` y listando los 8 proyectos públicos seleccionados.
- Se sustituyó el adjetivo reductivo ("Juego pequeño"/"Small game"/"Kleines Spiel") en el `summary` de RompeCajas (`src/data/projects.ts`) por una descripción factual ("Juego 2D modular"/"Modular 2D game"/"Modulares 2D-Spiel"), verificada contra el repositorio público real.
- Se añadió un CTA compacto de "trabajo industrial confidencial" al final de la página Projects (`src/pages/[locale]/[...slug].astro`), enrutado a Contact vía `getLocalizedPath`, sin crear un noveno Project ni exponer datos de cliente. Reutiliza el estilo existente de `.processCta__panel` (`src/assets/components.css`).

## Fase de reposicionamiento comercial B2B (Skills y Projects)

- Se reescribió el copy de las páginas Skills y Projects (hero, tarjetas y campos de evidencia) en ES/EN/DE, sustituyendo redacción defensiva o autocrítica por lenguaje profesional verificable.
- Se diversificó la evidencia de Skills entre proyectos del portafolio y se dejó `relatedProjects: []` como estado explícito cuando ningún repositorio demuestra la capacidad (ver `industrial-automation` en `src/data/skills.ts`).
- Se separaron los campos de gobernanza interna (`searchIntent`, `evidenceLevel`, `claimLevel`) de su representación pública: los componentes ya no renderizan estos valores en crudo, sino etiquetas localizadas (`src/i18n/ui.ts`) o los usan solo en lógica condicional. Ver §3.5 de `ARCHITECTURE-EN.md` / `ARCHITECTURE-ES.md`.
- Se renombró la etiqueta de navegación de Skills ("Habilidades"/"Skills"/"Fähigkeiten" → "Capacidades"/"Expertise"/"Kompetenzen") sin alterar rutas ni slugs.
- Se añadieron comprobaciones de regresión (`tools/qa-search-intent-skills-phase-3.mjs`, `tools/qa-commercial-evidence-phase-2.mjs`, `tests/e2e/phase-2-projects.spec.ts`, `tests/e2e/phase-3-skills.spec.ts`) que verifican que los identificadores internos no aparezcan en el texto renderizado.
- Se corrigió la documentación de `docs/PROJECT_SELECTION.md` para eliminar campos y flujos (`status`, `publicLinks: []`) no soportados por el modelo TypeScript vigente.

## R0–R2

- Se preservó la línea base sin modificar `master` ni el remoto.
- Se añadió un validador documental desarrollado mediante ciclos RED/GREEN.
- Se consolidaron las guías operativas en `docs/RUNBOOK.md`.
- Se registraron decisiones arquitectónicas mediante ADRs.
- Se corrigieron metadatos, codificación y delimitadores Markdown.

## Fase 1.1B

- Se alineó la documentación inicial con `compose.yml`.
- Se documentaron health, seguridad HTTP, SEO técnico y operación Docker.

## Fase 1.1A

- Se rediseñó la página Proceso.
- Se amplió la seguridad del servidor estático.
- Se añadieron sitemap multilingüe, schema, redirección canónica 308 y 404 real.

## Fase 1

- Se reforzaron Home y Servicios con contenido en español, inglés y alemán.
- Se añadieron secciones de valor industrial.

## Fase 0

- Se creó la base Astro multilingüe.
- Se añadieron rutas localizadas, Empresa y Contacto.
