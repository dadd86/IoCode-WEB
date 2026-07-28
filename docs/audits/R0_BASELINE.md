# Línea base R0

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R0 | Preservación e inventario del trabajo existente antes del programa R0–R8 | Repositorio completo | ES, EN, DE | `git status`, `git diff HEAD`, configuración Git y artefactos locales | 2026-07-28 | Baseline `1573da9` sobre base `2d70884da722` |

Estado: `Done with evidence`.

## Decisiones autorizadas

- Preservar todos los cambios existentes sin borrar, revertir ni descartar archivos.
- Mantener `master` como rama de release predeterminada.
- Ejecutar el programa en la rama `codex/baseline-r0`.
- Mantener el repositorio en OneDrive mientras no exista un fallo de I/O reproducible.
- No afirmar que la Fase 6 está cerrada ni que el sitio está listo para producción.

## Punto de partida

- Rama de origen: `codex/seo-geo-rag`.
- Commit base: `2d70884da722`.
- Rama de preservación: `codex/baseline-r0`.
- Entradas iniciales en `git status --porcelain`: 33.
- Archivos versionados modificados: 29.
- Archivos nuevos no versionados: 4.
- Diferencia versionada respecto al commit base: 3.234 inserciones y 1.019 eliminaciones.
- Escaneo preventivo de patrones de secretos sobre los archivos modificados: sin coincidencias.
- Artefactos ZIP y `qa-artifacts/`: excluidos por `.gitignore`.

## Inventario de archivos versionados modificados

1. `Docker/Dockerfile.performance`
2. `QA_CHECKLIST.md`
3. `README.md`
4. `RUN_GUIDE.md`
5. `docs/PERFORMANCE.md`
6. `docs/testing/seo-geo-rag.tdd.md`
7. `package-lock.json`
8. `package.json`
9. `playwright.config.ts`
10. `src/assets/components.css`
11. `src/assets/global.css`
12. `src/assets/hero3d.css`
13. `src/assets/pages.css`
14. `src/assets/tokens.css`
15. `src/components/ContactForm.astro`
16. `src/components/Header.astro`
17. `src/components/Navigation.astro`
18. `src/components/PageHero.astro`
19. `src/data/heroPanels.ts`
20. `src/data/pageContent.ts`
21. `src/pages/[locale]/[...slug].astro`
22. `src/scripts/hero3d-loader.ts`
23. `src/scripts/hero3d.ts`
24. `tests/e2e/phase-6-hero-performance.spec.ts`
25. `tools/create-phase-6-runtime-report.mjs`
26. `tools/lighthouse-phase-6.mjs`
27. `tools/qa-glb-phase-6.mjs`
28. `tools/qa-headers-phase-6.mjs`
29. `tools/qa-hero3d-runtime-review-phase-6.mjs`

## Inventario de archivos nuevos preservados

1. `tests/e2e/phase-6-hero-cross-platform.spec.ts`
2. `tests/e2e/phase-6-hero-ios.spec.ts`
3. `tests/e2e/phase-6-responsive-pages.spec.ts`
4. `tests/e2e/services-responsive.spec.ts`

## Observaciones de integridad

- `git diff --check` detectó espacios finales preexistentes en seis líneas de `package-lock.json`. Se registran, pero no se corrigen dentro de R0 para no alterar silenciosamente la línea base preservada.
- Git advirtió que varios archivos LF podrían convertirse a CRLF en una futura escritura. No se aplicó una normalización masiva de finales de línea.
- El resumen de QA de Fase 6 existente no contiene un commit SHA y, por tanto, no constituye todavía evidencia trazable del baseline.
- No se produjo un error `EBUSY` o `EPERM`; el traslado fuera de OneDrive permanece fuera de alcance.

## Gate de cierre R0

R0 podrá pasar a `Done with evidence` cuando:

1. el gate básico Docker (`check`, build y auditoría de producción) termine con código 0;
2. este inventario y los 33 cambios preservados formen un commit de baseline;
3. el commit resultante sea alcanzable desde `codex/baseline-r0`;
4. `git status --porcelain` quede vacío después del commit.

## Evidencia del gate básico

Comando ejecutado:

```text
docker compose --profile qa --profile prod run --rm qa
```

Resultado registrado el 2026-07-28:

- código de salida: 0;
- instalación reproducible mediante `npm ci`: 415 paquetes auditados, 0 vulnerabilidades;
- `astro check`: 93 archivos, 0 errores, 0 warnings y 0 hints;
- build Astro estático: 29 páginas;
- `npm audit --omit=dev`: 0 vulnerabilidades.

El intento con solo `--profile qa` no llegó a ejecutar las pruebas porque `browser-qa` depende del servicio `web`, perteneciente al perfil `prod`. La necesidad de activar ambos perfiles queda registrada como entrada para la consolidación del runbook y la revisión de Compose.

## Firma de R0

- Commit de preservación: `1573da9`.
- El commit pertenece a `codex/baseline-r0` y conserva los 33 cambios iniciales.
- La firma documental se completa en un commit posterior para no reescribir la evidencia de preservación.
