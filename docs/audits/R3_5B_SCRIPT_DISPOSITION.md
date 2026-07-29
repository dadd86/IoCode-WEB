# R3.5b — Propuesta de normalización de scripts

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación | Commit verificado |
|---|---|---|---|---|---|---|
| R3.5b | Inventario revisado, disposición y radio de cambio propuesto | Scripts npm, consumidores, herramientas y documentación | ES | `package.json`, Git, gate B1 y corpus actual | 2026-07-29 | RED `393a538`; GREEN `38d7da4` |

Estado: `PROPUESTO — R3.5b NO AUTORIZADO`.

Este documento no ejecuta renombres ni eliminaciones. Toda fila con disposición
`eliminar` requiere una confirmación distinta de la confirmación del renombrado.
`docs/archive/` es inmutable y queda fuera del radio operativo.

## Resultado revisado y deltas

| Magnitud | R3.5a aceptada | Estado actual | Delta | Interpretación |
|---|---:|---:|---:|---|
| Scripts definidos | 90 | 90 | 0 | B1 no cambia `package.json` |
| Referencias operativas conocidas | 164 | 168 | +4 | +2 correcciones de `qa:static:1.1c`; +2 fixtures negativos B1 |
| Referencias archivadas | 2 | 2 | 0 | Se conservan, no se actualizan |
| Candidatos a renombrado | 87 | 81 | −6 | `check` se mantiene; cinco scripts pasan a eliminación separada |
| Sitios operativos afectados por renombre | no fijado | 114 | n/a | 75 `package.json`, 24 docs, 11 `tools/`, 2 `.vscode/`, 1 compose y 1 fixture |
| Sitios de workflows afectados | 0 | 0 | 0 | No existen workflows consumidores |
| Sitios archivados afectados | 0 | 0 | 0 | Exclusión contractual |

La aritmética del radio es: 168 referencias operativas menos 25 de `check`,
27 de `build`, 1 de `dev`, 1 de `preview` y 0 de los cinco candidatos a
eliminación = **114**. El lote de renombrado modificaría 81 claves de
`package.json` y esos 114 consumidores. No se incluye la futura creación de
`verify:quick`, que es una operación adicional.

Categorías revisadas: 4 reservados, 40 internos y 46 históricos. Disposición:
85 mantener, 5 eliminar y 0 fusionar. `mantener` conserva la capacidad; no
significa necesariamente conservar el nombre salvo en la categoría reservada.

## Interfaz pública declarada sin capacidades fantasma

| Comando público objetivo | Estado actual | Fase prevista |
|---|---|---|
| `verify:quick` | No existe; nombre propuesto para el gate rápido | R3.5b, sujeto a CONFIRM |
| `release` | No existe y no es invocable | R6 |
| `verify:deploy` | No existe y no es invocable | R7 |

`check` conserva literalmente `astro check`. Se clasifica como reservado por
convención Astro, no se renombra en R3.5b y cualquier reconsideración queda
diferida hasta después de que R6 exista.

## B1 — Ficha G-01 del gate de invocaciones en herramientas

| Campo | Contrato |
|---|---|
| Qué detecta | Invocaciones literales `npm run <nombre>` cuyo nombre no existe en `package.json`, dentro de fuentes configuradas en `toolSources` |
| Fuentes | Recorrido recursivo de `tools/` para `.ps1`, `.mjs`, `.js`, `.cjs`, `.ts` y `.sh` |
| Qué no detecta | Nombres construidos dinámicamente, argumentos ensamblados en varias variables o comandos indirectos sin texto literal |
| Falsos positivos conocidos | Comentarios o ejemplos literales dentro de `tools/` también se consideran consumidores; deben actualizarse en un renombrado |
| Falsos negativos conocidos | Construcción dinámica como una plantilla con variable |
| Allowlist | Ninguna por nombre; la única autoridad es `package.json`. Las raíces se declaran explícitamente en `toolSources` |
| Fixture positivo PowerShell | Un nombre inexistente en `positive-unknown.ps1` produce `TOOL_NPM_SCRIPT_UNKNOWN` |
| Fixture positivo JavaScript | Un nombre inexistente en `positive-unknown.mjs` produce `TOOL_NPM_SCRIPT_UNKNOWN` |
| Fixtures negativos | Comandos existentes en `.ps1` y `.mjs`; la forma dinámica se ignora |
| Coste | O(n) sobre los archivos de herramientas configurados |
| Severidad | Bloqueante antes de R3.5b; evita consumidores rotos sin depender de R6 |

El RED `393a538` demostró el punto ciego: 12/13 pruebas pasaban y el nuevo caso
obtuvo `passed` cuando debía fallar. El GREEN `38d7da4` deja 13/13 PASS,
`docs:lint` en PASS y corrigió
`tools/validate-phase-1-1c.ps1:73-74` de `qa:static` a
`qa:static:1.1c`.

## Tabla de disposición por script

Las referencias son exclusivamente operativas y proceden del árbol Git actual.
Las referencias negativas intencionales a nombres inexistentes no forman parte
de este recuento. En las definiciones compuestas, `npm&#32;run` se renderiza
como el texto literal correspondiente, pero evita que este inventario se
convierta a sí mismo en un consumidor ejecutable.

| # | Script y definición literal | Categoría | Disposición | Nombre propuesto | Usos operativos | Sitios de invocación |
|---:|---|---|---|---|---:|---|
| 1 | `dev` = `astro dev` | reservado | mantener | `dev` | 1 | `compose.yml:20` |
| 2 | `check` = `astro check` | reservado | mantener | `check` | 25 | `.vscode/tasks.json:17`; `Docker/Dockerfile:23`; `docs/I18N.md:143`; `docs/MAINTENANCE.md:17,31,149`; `docs/MIGRATION_FROM_STATIC_HTML.md:61`; `docs/PROJECT_SELECTION.md:169`; `package.json:11,29,42,43,49,54,59,64,69,89,93,96`; `tests/fixtures/doc-validator/tooling/negative-known.ps1:1`; `tests/fixtures/doc-validator/valid.md:7`; `tools/qa-docs-phase-1-1e.mjs:71`; `tools/validate-phase-1-1c.ps1:61-62` |
| 3 | `build` = `astro build` | reservado | mantener | `build` | 27 | `.vscode/tasks.json:26`; `Docker/Dockerfile:24`; `compose.yml:65`; `docs/ARCHITECTURE.md:67`; `docs/I18N.md:145`; `docs/MAINTENANCE.md:18,32,87,98,150`; `docs/MIGRATION_FROM_STATIC_HTML.md:62`; `docs/PROJECT_SELECTION.md:171`; `package.json:11,29,42,43,49,54,59,64,69,89,94,96`; `tools/qa-docs-phase-1-1e.mjs:72`; `tools/validate-phase-1-1c.ps1:65-66` |
| 4 | `preview` = `astro preview` | reservado | mantener | `preview` | 1 | `compose.yml:66` |
| 5 | `qa` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod` | interno | mantener | `internal:qa` | 1 | `compose.yml:41` |
| 6 | `audit:prod` = `npm audit --omit=dev` | interno | mantener | `internal:audit:prod` | 18 | `.vscode/tasks.json:44`; `docs/MAINTENANCE.md:151`; `docs/MIGRATION_FROM_STATIC_HTML.md:63`; `package.json:11,29,42,43,49,54,59,64,69,89,95,96`; `tools/qa-docs-phase-1-1e.mjs:73`; `tools/validate-phase-1-1c.ps1:69-70` |
| 7 | `audit:prod:strict` = `npm audit --omit=dev` | interno | eliminar (CONFIRM separado) | — | 0 | — |
| 8 | `audit:all` = `npm audit` | interno | mantener | `internal:audit:all` | 1 | `.vscode/tasks.json:53` |
| 9 | `docs:test` = `node --test tests/unit/doc-validator.test.mjs` | interno | mantener | `internal:docs:test` | 4 | `README.md:33`; `docs/RUNBOOK.md:36`; `docs/testing/r1-document-validator.tdd.md:91`; `docs/testing/r2-recovery-g03.tdd.md:151` |
| 10 | `docs:coverage` = `node --test --experimental-test-coverage tests/unit/doc-validator.test.mjs` | interno | mantener | `internal:docs:coverage` | 2 | `docs/testing/r1-document-validator.tdd.md:97`; `docs/testing/r2-recovery-g03.tdd.md:151` |
| 11 | `docs:lint` = `node tools/doc-validator.js --config docs/document-control.json --output qa-artifacts/documentation/doc-validator.json` | interno | mantener | `internal:docs:lint` | 8 | `README.md:34`; `docs/I18N.md:146`; `docs/PROJECT_SELECTION.md:172`; `docs/RUNBOOK.md:37`; `docs/audits/R2_DOCUMENTATION.md:68`; `docs/testing/r1-document-validator.tdd.md:107`; `docs/testing/r2-recovery-g03.tdd.md:151`; `tests/fixtures/doc-validator/tooling/negative-known.mjs:1` |
| 12 | `env:test` = `node --test tests/unit/check-env-parity.test.mjs` | interno | mantener | `internal:env:test` | 1 | `docs/audits/R3_ENV_PARITY.md:36` |
| 13 | `env:coverage` = `node --test --experimental-test-coverage tests/unit/check-env-parity.test.mjs` | interno | mantener | `internal:env:coverage` | 0 | — |
| 14 | `env:check` = `node tools/check-env-parity.js` | interno | mantener | `internal:env:check` | 1 | `docs/audits/R3_ENV_PARITY.md:39` |
| 15 | `typecheck:tests` = `tsc -p tests/e2e/tsconfig.json --noEmit` | interno | mantener | `internal:typecheck:tests` | 7 | `package.json:25,49,54,59,64,69,89` |
| 16 | `clean:visual:1.1b` = `node tools/clean-phase-1-1b.mjs` | histórico | mantener | `historical:clean:visual:1.1b` | 1 | `package.json:25` |
| 17 | `summary:visual:1.1b` = `node tools/create-phase-1-1b-summary.mjs` | histórico | mantener | `historical:summary:visual:1.1b` | 1 | `package.json:25` |
| 18 | `qa:visual:1.1b` = `playwright test tests/e2e/phase-1-1b-visual.spec.ts --project=chromium-desktop --project=chromium-mobile` | histórico | mantener | `historical:qa:visual:1.1b` | 1 | `package.json:25` |
| 19 | `qa:phase-1-1b` = `npm&#32;run clean:visual:1.1b && npm&#32;run typecheck:tests && npm&#32;run qa:visual:1.1b && npm&#32;run summary:visual:1.1b` | histórico | mantener | `historical:qa:phase-1-1b` | 0 | — |
| 20 | `clean:seo:1.1c` = `node tools/clean-phase-1-1c.mjs` | histórico | mantener | `historical:clean:seo:1.1c` | 1 | `package.json:29` |
| 21 | `qa:static:1.1c` = `node tools/qa-static-phase-1-1c.mjs` | histórico | mantener | `historical:qa:static:1.1c` | 3 | `package.json:29`; `tools/validate-phase-1-1c.ps1:73-74` |
| 22 | `qa:lighthouse:1.1c` = `node tools/lighthouse-phase-1-1c.mjs` | histórico | mantener | `historical:qa:lighthouse:1.1c` | 1 | `package.json:29` |
| 23 | `qa:phase-1-1c` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod && npm&#32;run clean:seo:1.1c && npm&#32;run qa:static:1.1c && npm&#32;run qa:lighthouse:1.1c` | histórico | mantener | `historical:qa:phase-1-1c` | 0 | — |
| 24 | `clean:local-artifacts` = `node tools/clean-local-artifacts.mjs` | interno | mantener | `internal:clean:local-artifacts` | 0 | — |
| 25 | `validate:dist-sitemap` = `node tools/validate-dist-sitemap.mjs` | interno | mantener | `internal:validate:dist-sitemap` | 0 | — |
| 26 | `clean:security:1.1d` = `node tools/clean-phase-1-1d.mjs` | histórico | mantener | `historical:clean:security:1.1d` | 1 | `package.json:43` |
| 27 | `qa:static:1.1d` = `node tools/qa-static-phase-1-1d.mjs` | histórico | mantener | `historical:qa:static:1.1d` | 1 | `package.json:43` |
| 28 | `qa:headers:1.1d` = `node tools/qa-security-headers-phase-1-1d.mjs` | histórico | mantener | `historical:qa:headers:1.1d` | 1 | `package.json:43` |
| 29 | `qa:privacy:1.1d` = `node tools/qa-privacy-surface-phase-1-1d.mjs` | histórico | mantener | `historical:qa:privacy:1.1d` | 1 | `package.json:43` |
| 30 | `qa:release-hygiene:1.1d` = `node tools/qa-release-hygiene-phase-1-1d.mjs` | histórico | mantener | `historical:qa:release-hygiene:1.1d` | 1 | `package.json:43` |
| 31 | `summary:security:1.1d` = `node tools/create-phase-1-1d-summary.mjs` | histórico | mantener | `historical:summary:security:1.1d` | 2 | `package.json:43`; `tools/qa-gitleaks-phase-1-1d.ps1:44` |
| 32 | `clean:devops:1.1e` = `node tools/clean-phase-1-1e.mjs` | histórico | mantener | `historical:clean:devops:1.1e` | 1 | `package.json:42` |
| 33 | `qa:docs:1.1e` = `node tools/qa-docs-phase-1-1e.mjs` | histórico | mantener | `historical:qa:docs:1.1e` | 1 | `package.json:42` |
| 34 | `qa:smoke:1.1e` = `node tools/qa-devops-smoke-phase-1-1e.mjs` | histórico | mantener | `historical:qa:smoke:1.1e` | 1 | `package.json:42` |
| 35 | `summary:devops:1.1e` = `node tools/create-phase-1-1e-summary.mjs` | histórico | mantener | `historical:summary:devops:1.1e` | 2 | `package.json:42`; `tools/qa-host-smoke-phase-1-1e.ps1:124` |
| 36 | `qa:phase-1-1e` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod && npm&#32;run clean:devops:1.1e && npm&#32;run qa:docs:1.1e && npm&#32;run qa:smoke:1.1e && npm&#32;run summary:devops:1.1e` | histórico | mantener | `historical:qa:phase-1-1e` | 0 | — |
| 37 | `qa:phase-1-1d` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod && npm&#32;run clean:security:1.1d && npm&#32;run qa:static:1.1d && npm&#32;run qa:headers:1.1d && npm&#32;run qa:privacy:1.1d && npm&#32;run qa:release-hygiene:1.1d && npm&#32;run summary:security:1.1d` | histórico | mantener | `historical:qa:phase-1-1d` | 0 | — |
| 38 | `clean:a11y-perf:1.1f` = `node tools/clean-phase-1-1f.mjs` | histórico | mantener | `historical:clean:a11y-perf:1.1f` | 1 | `package.json:49` |
| 39 | `qa:a11y-keyboard:1.1f` = `playwright test tests/e2e/phase-1-1f-a11y-performance.spec.ts --project=chromium-desktop --project=chromium-mobile` | histórico | mantener | `historical:qa:a11y-keyboard:1.1f` | 1 | `package.json:49` |
| 40 | `qa:assets:1.1f` = `node tools/qa-asset-budgets-phase-1-1f.mjs` | histórico | mantener | `historical:qa:assets:1.1f` | 1 | `package.json:49` |
| 41 | `qa:lighthouse:1.1f` = `node tools/lighthouse-phase-1-1f.mjs` | histórico | mantener | `historical:qa:lighthouse:1.1f` | 1 | `package.json:49` |
| 42 | `summary:a11y-perf:1.1f` = `node tools/create-phase-1-1f-summary.mjs` | histórico | mantener | `historical:summary:a11y-perf:1.1f` | 1 | `package.json:49` |
| 43 | `qa:phase-1-1f` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod && npm&#32;run typecheck:tests && npm&#32;run clean:a11y-perf:1.1f && npm&#32;run qa:a11y-keyboard:1.1f && npm&#32;run qa:assets:1.1f && npm&#32;run qa:lighthouse:1.1f && npm&#32;run summary:a11y-perf:1.1f` | histórico | mantener | `historical:qa:phase-1-1f` | 0 | — |
| 44 | `clean:commercial:2` = `node tools/clean-phase-2.mjs` | histórico | mantener | `historical:clean:commercial:2` | 1 | `package.json:54` |
| 45 | `qa:commercial:2` = `node tools/qa-commercial-evidence-phase-2.mjs` | histórico | mantener | `historical:qa:commercial:2` | 1 | `package.json:54` |
| 46 | `qa:projects-ui:2` = `playwright test tests/e2e/phase-2-projects.spec.ts --project=chromium-desktop --project=chromium-mobile` | histórico | mantener | `historical:qa:projects-ui:2` | 1 | `package.json:54` |
| 47 | `summary:commercial:2` = `node tools/create-phase-2-summary.mjs` | histórico | mantener | `historical:summary:commercial:2` | 1 | `package.json:54` |
| 48 | `qa:phase-2` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod && npm&#32;run typecheck:tests && npm&#32;run clean:commercial:2 && npm&#32;run qa:commercial:2 && npm&#32;run qa:projects-ui:2 && npm&#32;run summary:commercial:2` | histórico | mantener | `historical:qa:phase-2` | 0 | — |
| 49 | `clean:skills:3` = `node tools/clean-phase-3.mjs` | histórico | mantener | `historical:clean:skills:3` | 1 | `package.json:59` |
| 50 | `qa:skills:3` = `node tools/qa-search-intent-skills-phase-3.mjs` | histórico | mantener | `historical:qa:skills:3` | 1 | `package.json:59` |
| 51 | `qa:skills-ui:3` = `playwright test tests/e2e/phase-3-skills.spec.ts --project=chromium-desktop --project=chromium-mobile` | histórico | mantener | `historical:qa:skills-ui:3` | 1 | `package.json:59` |
| 52 | `summary:skills:3` = `node tools/create-phase-3-summary.mjs` | histórico | mantener | `historical:summary:skills:3` | 1 | `package.json:59` |
| 53 | `qa:phase-3` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod && npm&#32;run typecheck:tests && npm&#32;run clean:skills:3 && npm&#32;run qa:skills:3 && npm&#32;run qa:skills-ui:3 && npm&#32;run summary:skills:3` | histórico | mantener | `historical:qa:phase-3` | 0 | — |
| 54 | `clean:contact:4` = `node tools/clean-phase-4.mjs` | histórico | mantener | `historical:clean:contact:4` | 1 | `package.json:64` |
| 55 | `qa:contact:4` = `node tools/qa-contact-conversion-phase-4.mjs` | histórico | mantener | `historical:qa:contact:4` | 1 | `package.json:64` |
| 56 | `qa:contact-ui:4` = `playwright test tests/e2e/phase-4-contact.spec.ts --project=chromium-desktop --project=chromium-mobile` | histórico | mantener | `historical:qa:contact-ui:4` | 1 | `package.json:64` |
| 57 | `summary:contact:4` = `node tools/create-phase-4-summary.mjs` | histórico | mantener | `historical:summary:contact:4` | 1 | `package.json:64` |
| 58 | `qa:phase-4` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod && npm&#32;run typecheck:tests && npm&#32;run clean:contact:4 && npm&#32;run qa:contact:4 && npm&#32;run qa:contact-ui:4 && npm&#32;run summary:contact:4` | histórico | mantener | `historical:qa:phase-4` | 0 | — |
| 59 | `clean:ui:5` = `node tools/clean-phase-5.mjs` | histórico | mantener | `historical:clean:ui:5` | 1 | `package.json:69` |
| 60 | `qa:ui:5` = `node tools/qa-ui-accessibility-phase-5.mjs` | histórico | mantener | `historical:qa:ui:5` | 1 | `package.json:69` |
| 61 | `qa:ui-screenshots:5` = `playwright test tests/e2e/phase-5-ui-accessibility.spec.ts --project=chromium-desktop` | histórico | mantener | `historical:qa:ui-screenshots:5` | 1 | `package.json:69` |
| 62 | `summary:ui:5` = `node tools/create-phase-5-summary.mjs` | histórico | mantener | `historical:summary:ui:5` | 1 | `package.json:69` |
| 63 | `qa:phase-5` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod && npm&#32;run typecheck:tests && npm&#32;run clean:ui:5 && npm&#32;run qa:ui:5 && npm&#32;run qa:ui-screenshots:5 && npm&#32;run summary:ui:5` | histórico | mantener | `historical:qa:phase-5` | 0 | — |
| 64 | `typecheck:src` = `tsc -p tsconfig.json --noEmit` | interno | mantener | `internal:typecheck:src` | 3 | `docs/I18N.md:144`; `docs/PROJECT_SELECTION.md:170`; `package.json:89` |
| 65 | `inspect:release-zip` = `node tools/inspect-release-zip.mjs` | interno | mantener | `internal:inspect:release-zip` | 1 | `docs/RUNBOOK.md:84` |
| 66 | `clean:performance:6` = `node tools/clean-phase-6.mjs` | interno | mantener | `internal:clean:performance:6` | 1 | `package.json:89` |
| 67 | `repair:glb:6` = `node tools/repair-glb-phase-6.mjs` | interno | mantener | `internal:repair:glb:6` | 3 | `package.json:87`; `tools/qa-glb-phase-6.mjs:286,302` |
| 68 | `qa:raster:6` = `node tools/qa-raster-assets-phase-6.mjs` | interno | mantener | `internal:qa:raster:6` | 1 | `package.json:89` |
| 69 | `qa:budgets:6` = `node tools/qa-performance-budgets-phase-6.mjs` | interno | mantener | `internal:qa:budgets:6` | 1 | `package.json:89` |
| 70 | `qa:assets:6` = `node tools/qa-glb-phase-6.mjs` | interno | mantener | `internal:qa:assets:6` | 1 | `package.json:87` |
| 71 | `qa:bundle:6` = `node tools/qa-bundle-phase-6.mjs` | interno | mantener | `internal:qa:bundle:6` | 1 | `package.json:89` |
| 72 | `qa:headers:6` = `node tools/qa-headers-phase-6.mjs` | interno | mantener | `internal:qa:headers:6` | 1 | `package.json:89` |
| 73 | `qa:hero3d-review:6` = `node tools/qa-hero3d-runtime-review-phase-6.mjs` | interno | mantener | `internal:qa:hero3d-review:6` | 1 | `package.json:89` |
| 74 | `qa:hero3d-runtime:6` = `node tools/run-phase-6-hero-runtime.mjs` | interno | mantener | `internal:qa:hero3d-runtime:6` | 1 | `package.json:89` |
| 75 | `qa:lighthouse:6` = `node tools/lighthouse-phase-6.mjs` | interno | mantener | `internal:qa:lighthouse:6` | 1 | `package.json:89` |
| 76 | `summary:performance:6` = `node tools/create-phase-6-summary.mjs` | interno | mantener | `internal:summary:performance:6` | 1 | `package.json:89` |
| 77 | `update:logo3d-version:6` = `node tools/update-logo3d-cache-version-phase-6.mjs` | interno | mantener | `internal:update:logo3d-version:6` | 2 | `package.json:87`; `tools/qa-logo3d-cache-version-phase-6.mjs:58` |
| 78 | `qa:logo3d-version:6` = `node tools/qa-logo3d-cache-version-phase-6.mjs` | interno | mantener | `internal:qa:logo3d-version:6` | 1 | `package.json:87` |
| 79 | `clean:local-heavy` = `node tools/clean-local-heavy.mjs` | interno | mantener | `internal:clean:local-heavy` | 0 | — |
| 80 | `size:project` = `node tools/project-size-report.mjs` | interno | mantener | `internal:size:project` | 0 | — |
| 81 | `prepare:assets:6` = `npm&#32;run repair:glb:6 && npm&#32;run update:logo3d-version:6 && npm&#32;run qa:assets:6 && npm&#32;run qa:logo3d-version:6` | interno | mantener | `internal:prepare:assets:6` | 5 | `QA_CHECKLIST.md:16`; `docs/PERFORMANCE.md:34`; `docs/RUNBOOK.md:68`; `package.json:89`; `tools/create-release-zip.sh:20` |
| 82 | `qa:hero3d-cross-platform:6` = `playwright test tests/e2e/phase-6-hero-cross-platform.spec.ts --project=chromium-desktop --project=chromium-mobile --project=webkit-iphone --project=webkit-ipad` | interno | mantener | `internal:qa:hero3d-cross-platform:6` | 1 | `package.json:89` |
| 83 | `qa:phase-6` = `npm&#32;run check && npm&#32;run typecheck:src && npm&#32;run typecheck:tests && npm&#32;run clean:performance:6 && npm&#32;run prepare:assets:6 && npm&#32;run build && npm&#32;run audit:prod && npm&#32;run qa:budgets:6 && npm&#32;run qa:raster:6 && npm&#32;run qa:bundle:6 && npm&#32;run qa:headers:6 && npm&#32;run qa:hero3d-review:6 && npm&#32;run qa:hero3d-runtime:6 && npm&#32;run qa:hero3d-cross-platform:6 && npm&#32;run qa:services-responsive && npm&#32;run qa:responsive-visual:6 && npm&#32;run qa:hero3d-ios:6 && npm&#32;run qa:lighthouse:6 && npm&#32;run summary:performance:6` | interno | mantener | `internal:qa:phase-6` | 1 | `docs/PERFORMANCE.md:25` |
| 84 | `qa:services-responsive` = `playwright test tests/e2e/services-responsive.spec.ts --project=chromium-desktop --project=webkit-iphone --project=webkit-ipad` | interno | mantener | `internal:qa:services-responsive` | 1 | `package.json:89` |
| 85 | `qa:responsive-visual:6` = `playwright test tests/e2e/phase-6-responsive-pages.spec.ts --project=chromium-desktop` | interno | mantener | `internal:qa:responsive-visual:6` | 1 | `package.json:89` |
| 86 | `qa:hero3d-ios:6` = `playwright test tests/e2e/phase-6-hero-ios.spec.ts --project=webkit-iphone` | interno | mantener | `internal:qa:hero3d-ios:6` | 1 | `package.json:89` |
| 87 | `docker:check` = `npm&#32;run check` | interno | eliminar (CONFIRM separado) | — | 0 | — |
| 88 | `docker:build` = `npm&#32;run build` | interno | eliminar (CONFIRM separado) | — | 0 | — |
| 89 | `docker:audit:prod` = `npm&#32;run audit:prod` | interno | eliminar (CONFIRM separado) | — | 0 | — |
| 90 | `docker:validate` = `npm&#32;run check && npm&#32;run build && npm&#32;run audit:prod` | interno | eliminar (CONFIRM separado) | — | 0 | — |

Los 19 scripts sin consumidor explícito continúan visibles: 5 se proponen para
eliminación y 14 se mantienen por su utilidad directa o trazabilidad histórica.
Ausencia de consumidor no equivale por sí sola a autorización para borrar.

## B2 — Referencias históricas excluidas

| Documento inmutable | Línea | Cita histórica | Tratamiento |
|---|---:|---|---|
| `docs/archive/I18N.full-2026-07-28.md` | 706 | `check` | No actualizar |
| `docs/archive/I18N.full-2026-07-28.md` | 707 | `build` | No actualizar |

Estas dos citas describen correctamente el momento archivado, no son deuda
operativa y no se suman a las 168 referencias actuales. Sus SHA-256 de control
son:

- `D86F34217A91C766326CF4A2F55F9B1A2D3F2BF91A69FD04311B9CD0437047D6`
  para `I18N.full-2026-07-28.md`;
- `36005870F70D7558632685EF2D4AC817BAD589B7EE3A446339DA0AB7D5511A77`
  para `PROJECT_SELECTION.full-2026-07-28.md`.

## C3 — Entregable disparado por el cierre de Fase 6

Los scripts 66–86 permanecen `interno` porque la Fase 6 sigue abierta. Su cambio
a `histórico` queda registrado como entregable pendiente con este disparador
explícito:

1. existe cierre formal de Fase 6 con la evidencia física y el sign-off exigidos;
2. se vuelve a medir el inventario y todos sus consumidores;
3. se presenta un lote CONFIRM específico para cambiar `internal:*` a
   `historical:*`;
4. el lote excluye `docs/archive/` y no se ejecuta por el mero hecho de que los
   presupuestos automatizados estén en verde.

Responsable: mantenedor del repositorio. Evidencia de entrada:
`docs/testing/phase-6-closure.tdd.md` y `docs/PERFORMANCE.md`.

## Condición dura previa a R4

R4 permanece `NO-GO` aunque X-LEGAL converja hasta añadir y poner en verde los
cuatro caminos de decisión pendientes del validador:

1. URL malformada en `isAllowedRemoteUrl`;
2. elemento `<link>` sin `rel` ni `href`;
3. directorio runtime anidado;
4. tabla I-03 con misma longitud pero campo incorrecto o en orden incorrecto.

No son parte de B1 ni se declaran ejecutados en este documento. El 84,87% de
cobertura de ramas es evidencia cuantitativa de que esa deuda sigue abierta.

## Puerta para autorizar R3.5b

Antes de cualquier renombrado deben cumplirse simultáneamente:

- confirmación explícita del lote de 81 renombres;
- confirmación separada si se desean eliminar los cinco scripts;
- GREEN del validador documental y de herramientas;
- búsqueda con cero invocaciones operativas al nombre anterior;
- `check`, `dev`, `build` y `preview` sin cambios;
- hashes de `docs/archive/` idénticos a los registrados;
- R3.5b limitado a `GATE LOCAL OK`, pues R6 aún no existe.
