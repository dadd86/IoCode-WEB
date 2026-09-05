<div align="center">

# IoCode SOLUTIONS Web

**Trilingual static site for an industrial automation consultancy — Astro 7, Three.js, hash-based CSP, and a hardened two-container production stack.**

[![Astro](https://img.shields.io/badge/Astro-7.1.3-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.184.0-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose%20v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![Playwright](https://img.shields.io/badge/Playwright-1.60.0-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-12.6.1-F44B21?logo=lighthouse&logoColor=white)](https://developer.chrome.com/docs/lighthouse/)
[![Node](https://img.shields.io/badge/Node-24--alpine-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Nginx](https://img.shields.io/badge/Nginx-TLS%201.2%2F1.3-009639?logo=nginx&logoColor=white)](https://nginx.org/)
[![i18n](https://img.shields.io/badge/i18n-ES%20·%20EN%20·%20DE-blue)](src/i18n/routes.ts)

[Architecture (EN)](ARCHITECTURE.md) · [Arquitectura (ES)](docs/es/ARCHITECTURE.md) · [Runbook](docs/RUNBOOK.md) · [ADRs](docs/adr/)

</div>

---

## What this is

The commercial site for IoCode SOLUTIONS — PLC programming, industrial robotics, software and data engineering for the DACH market. Thirty-three localised content routes across Spanish, English and German, thirty-eight generated pages, and a WebGL hero that degrades gracefully to a static image.

It is fully static. No database, no session store, no login, no application cookie, no server-side rendering at request time.

### Why the architecture matters here

**Two runtime dependencies.** `astro` and `three`. That's the entire production dependency surface for a 38-page trilingual site with a 3D hero — which is why `npm audit --omit=dev` can be a hard release gate rather than a source of noise. Supply-chain controls back it up: `.npmrc` sets `strict-allow-scripts=true`, and `package.json` names exactly which packages may run install scripts.

**No backend, by design.** The contact form composes a `mailto:` URI in the browser and hands it to the user's mail client. No enquiry ever touches project infrastructure — which removes the form endpoint, the submission database, the processor agreement and the data-subject rights over stored messages, all at once.

**CSP by per-response SHA-256 hashes.** The static server parses each outgoing HTML document, hashes its inline scripts and styles, and injects `'sha256-…'` sources into the policy. A strict CSP on a fully static site, without `'unsafe-inline'` and without needing dynamic rendering. Recorded as [ADR 0004](docs/adr/0004-csp-response-hashes.md).

**Localised slugs, not translated pages at English URLs.** A German visitor searching *SPS-Automatisierung* lands on `/de/sps-automatisierung/`. All three paths derive from one typed route table, so a missing translation is a TypeScript error rather than a broken link found in production.

**Compliance gated at build time.** A production build with the wrong `PUBLIC_SITE_URL` throws during configuration. Any environment that isn't production emits `noindex, nofollow, noarchive` and `Disallow: /` — a preview deployment cannot be indexed by accident.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Astro 7.1.3 · `output: "static"` · `trailingSlash: "always"` |
| Language | TypeScript 6.0.3 · `astro/tsconfigs/strict` + `noUncheckedIndexedAccess` |
| 3D | Three.js 0.184.0 · progressive loading · explicit GPU disposal |
| Styling | Five layered CSS files · design tokens · no framework |
| i18n | 11 route keys × 3 locales · localised slugs · derived `hreflang` |
| Runtime | Custom 510-line Node static server · hash CSP · gzip/Brotli · cache tiers |
| Edge | Nginx · TLS 1.2/1.3 · rate limiting · HSTS · Docker secrets for certs |
| Containers | Node 24-alpine, digest-pinned · read-only · `cap_drop: ALL` · non-root |
| Testing | Playwright 1.60.0 (4 device projects) · `node:test` unit suites · Lighthouse 12.6.1 · axe-core |
| CI/CD | GitHub Actions · GHCR by digest · self-hosted production runner · 5-minute monitoring |

---

## Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| Docker Desktop | Compose v2 | The only hard requirement — everything runs in containers |
| Node.js | 24 | Optional, for running scripts on the host |
| Git | any | |

---

## Quickstart

```bash
git clone https://github.com/dadd86/IoCode-WEB.git
cd IoCode-WEB
docker compose up -d dev
```

Open `http://localhost:4321/es/`, `/en/` or `/de/`.

Follow the logs with `docker compose logs -f dev`.

---

## Development with Docker Compose

Eight services across five profiles. Only `dev` runs without a profile flag.

| Command | What it does |
| --- | --- |
| `docker compose up -d dev` | Astro dev server on `:4321` with hot reload |
| `docker compose --profile preview up preview` | Production-mode preview build on `:4322` |
| `docker compose --profile prod up -d web` | Hardened production image on `:8080` |
| `docker compose --profile qa run --rm qa` | `astro check` + build + production dependency audit |
| `docker compose --profile qa --profile prod run --rm browser-qa` | Playwright + Lighthouse against the production container |
| `docker compose --profile qa --profile prod run --rm performance-qa` | Phase-6 performance and asset budgets |
| `docker compose --profile release run --rm release-tools` | Release manifest and documentation gates |
| `docker compose --profile assets run --rm assets` | `gltf-transform` for GLB work |

The QA services declare `depends_on: web: condition: service_healthy`, so tests never race a cold origin.

On Windows or macOS with file-watching problems, set `CHOKIDAR_USEPOLLING=true` in your `.env`.

---

## Frequent scripts

`package.json` declares 111 scripts under three namespaces: `internal:` for active gates, `historical:` for retained phase evidence, and `docker:` for in-container wrappers.

The ones you'll actually use:

```bash
npm run dev                          # Astro dev server (host, not container)
npm run check                        # astro check — type and diagnostic pass
npm run build                        # Static build to dist/
npm run preview                      # Serve the built output

npm run internal:qa                  # check + build + production audit
npm run internal:typecheck:src       # tsc --noEmit on source
npm run internal:typecheck:tests     # tsc --noEmit on the E2E tree
npm run internal:env:check           # .env ↔ compose.yml parity
npm run internal:docs:lint           # Documentation contract validator
npm run internal:docs:test           # Unit tests for the doc validator
```

Composite release gates:

```bash
npm run internal:qa:phase-6          # 19-step performance, 3D and asset gate
npm run internal:qa:phase-9d         # Pre-deploy: typecheck, build, audit, smoke, flaky, Lighthouse
npm run internal:qa:phase-9f         # Legal and privacy surface, static + E2E
npm run internal:monitor:production  # HTTP, DNS and TLS checks against production
```

Tests:

```bash
npx playwright test                                       # All 17 E2E specs, 4 projects
npx playwright test --project=webkit-iphone               # iOS engine only
node --test tests/unit/                                   # 9 unit suites, node:test
```

---

## Environment configuration

Copy the example that matches your target and fill it in:

```bash
cp .env.example .env                        # Local development
cp .env.preview.example .env                # Preview deployment
cp .env.production.example .env             # Production
```

Key variables:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_DEPLOY_ENV` | `local` · `preview` · `production` — drives indexing and URL validation |
| `PUBLIC_SITE_URL` | Must equal `https://iocode-solutions.com` exactly when `PUBLIC_DEPLOY_ENV=production`, or the build throws |
| `ENABLE_HSTS` / `ENABLE_COOP` / `ENABLE_UPGRADE_INSECURE_REQUESTS` | Runtime header toggles |

Legal identity and privacy content (imprint, providers, supervisory authority) are versioned source data in `src/data/legal-profile.ts` and `src/data/legal.ts` — not environment variables. There is nothing to configure per deployment; the same finalized content ships everywhere.

`npm run internal:env:check` verifies that your `.env` and `compose.yml` declare the same variables — environment drift is a test failure here, not a production incident.

> `ENABLE_HSTS` is deliberately `false` in production. The origin speaks plain HTTP on an internal Docker network; HSTS is emitted by the Nginx edge instead. Enabling it in the app produces a duplicated header.

---

## Production deployment

Production runs `compose.production.yml` — two services, `app` and `edge`, on an `internal: true` network. Both images must be supplied by digest:

```bash
export APP_IMAGE="ghcr.io/dadd86/iocode-solutions@sha256:<64-hex>"
export NGINX_IMAGE="nginx@sha256:<64-hex>"
export TLS_FULLCHAIN_PATH=/path/to/fullchain.pem
export TLS_PRIVKEY_PATH=/path/to/privkey.pem

docker compose -f compose.production.yml up -d
```

Compose refuses to start without these, so production cannot accidentally run a locally built or `:latest` image.

Deployment normally happens through CI: `ci-release.yml` builds and pushes, then `deploy.yml` fires on `workflow_run` completion and re-checks that CI succeeded, the branch was `master`, and the event was a push. Manual deploy and rollback go through `production-operation.yml`, which regex-validates the release SHA and the image digest before doing anything.

See [`docs/PRODUCTION_OPERATIONS.md`](docs/PRODUCTION_OPERATIONS.md), [`docs/RUNBOOK.md`](docs/RUNBOOK.md) and [`docs/DISASTER_RECOVERY.md`](docs/DISASTER_RECOVERY.md).

### Packaging a clean source archive

To hand off or archive the repository without compiled artifacts, dependencies or local state, use `git archive` — it packages only tracked files and never includes `.git`, `node_modules`, `dist` or `test-results` regardless of what exists in the working tree:

```bash
git archive --format=zip -o iocode-source-$(git rev-parse --short HEAD).zip HEAD
```

Do not `zip -r .` or similar from the working directory — that captures whatever local build/test output happens to exist alongside the source.

---

## Directory tree

```text
IoCode-WEB/
├── astro.config.mjs              # Static output + production URL guard (throws on mismatch)
├── package.json                  # 111 scripts, 2 runtime deps, allowScripts allowlist
├── playwright.config.ts          # chromium-desktop · chromium-mobile · webkit-iphone · webkit-ipad
├── compose.yml                   # 8 services: dev, qa, preview, web, browser-qa,
│                                 #   performance-qa, release-tools, assets
├── compose.production.yml        # app + edge on an internal network, digest-pinned
├── .gitleaks.toml                # Secret-scanning allowlist scoped to source
├── Docker/
│   ├── Dockerfile                # Multi-stage; check + build run inside the image
│   ├── Dockerfile.dev            # Dev and QA
│   ├── Dockerfile.browser-qa     # Playwright + Lighthouse
│   ├── Dockerfile.performance    # Playwright + Chromium + gltf-transform
│   ├── node-static-server.mjs    # Hash CSP · 11 headers · cache tiers · gzip/br · /health
│   └── scripts/                  # Shell and PowerShell entry points
├── infra/
│   ├── nginx/                    # TLS 1.2/1.3, rate limiting, 308 redirects, Docker secrets
│   ├── logrotate/
│   └── systemd/
├── src/
│   ├── assets/                   # tokens · global · components · pages · hero3d
│   ├── components/               # 20 .astro components — zero framework islands
│   ├── config/                   # environment.ts (guards) · legal.ts (approval gates)
│   ├── data/                     # 10 typed content modules
│   ├── i18n/                     # config · routes (11 keys × 3 locales) · ui
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── [locale]/[...slug].astro   # Catch-all for all localised content
│   │   ├── {de,en,es}/{404,500}.astro # Localised error pages
│   │   ├── robots.txt.ts              # Environment-aware; AI crawler allowlist in prod
│   │   └── sitemap{,-index}.xml.ts
│   ├── scripts/                  # hero3d-loader · hero3d (1072 lines) · page-control
│   └── types/
├── public/logo/3d/*.glb          # 168 KB hero model, version-token cache busting
├── tests/
│   ├── e2e/                      # 17 Playwright specs
│   ├── unit/                     # 9 node:test suites (contract tests over config)
│   └── fixtures/                 # doc-validator and env-parity fixtures
├── tools/                        # 88 QA, release and operations scripts
├── config/                       # observability.json · privacy-governance.json
├── docs/                         # 47 documents, 6 ADRs, runbooks, ROPA, DPA register
└── .github/workflows/            # ci-release · deploy · production-monitor · production-operation
```

---

## Performance budgets

Enforced as environment variables on the `performance-qa` service, not as advisory targets:

| Budget | Threshold |
| --- | --- |
| LCP | ≤ 2,500 ms |
| CLS | ≤ 0.1 |
| TBT | ≤ 300 ms |
| Lighthouse desktop / mobile | ≥ 0.90 / ≥ 0.75 |
| Lighthouse accessibility | **1.0** — a perfect score is required |
| Initial JS / total JS | 250 KB / 700 KB |
| Total CSS | 120 KB |
| Hero loader initial (raw / gzip) | 12 KB / 5 KB |
| Three.js runtime (gzip) | 190 KB |
| GLB ideal / blocker | 250 KB / 500 KB |

See [`ARCHITECTURE.md` §4.3](ARCHITECTURE.md#43-performance-budgets) for the complete table and variable names.

---

## Documentation

| Document | Language | Contents |
| --- | --- | --- |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | English | Full specification: stack, topology, islands, 3D pipeline, security, compliance, Docker, QA |
| [`docs/es/ARCHITECTURE.md`](docs/es/ARCHITECTURE.md) | Spanish | 1:1 equivalent of the above |
| [`docs/adr/`](docs/adr/) | Spanish | 6 architecture decision records |
| [`docs/RUNBOOK.md`](docs/RUNBOOK.md) | Spanish | Operational procedures |
| [`docs/PRODUCTION_OPERATIONS.md`](docs/PRODUCTION_OPERATIONS.md) | Spanish | Deploy, rollback, monitoring |
| [`docs/DISASTER_RECOVERY.md`](docs/DISASTER_RECOVERY.md) | Spanish | Recovery procedures |
| [`docs/ROPA_INVENTORY.md`](docs/ROPA_INVENTORY.md) | Spanish | GDPR Article 30 record |
| [`docs/PROCESSOR_DPA_REGISTER.md`](docs/PROCESSOR_DPA_REGISTER.md) | Spanish | Processor agreement register |
| [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md) | Spanish | Performance methodology |
| [`docs/I18N.md`](docs/I18N.md) | Spanish | Internationalisation contract |

> **Note on document placement.** `docs/ARCHITECTURE.md` already exists as a 157-line Spanish summary carrying the project's own control header. Decide whether it is superseded by the pair above or kept as a short-form entry point — and add the control header to whichever files remain, so `npm run internal:docs:lint` passes. See [`ARCHITECTURE.md` §8.1](ARCHITECTURE.md#81-deliverable-path-collision-with-existing-documentation).

---

## Open items

Tracked in detail in [`ARCHITECTURE.md` §8](ARCHITECTURE.md#8-known-limitations-and-architectural-risks). None break the build.

- **No `/.well-known/security.txt`** (RFC 9116). `SECURITY.md` exists but is not served as a discoverable contact. The `robots.txt.ts` route demonstrates the pattern to add it.
- **Two conflicting Lighthouse floors** — `browser-qa` sets 0.50, `performance-qa` sets 0.90 desktop. Document which one gates a release.
- **Inconsistent dependency pinning** — most packages are exact, but `@types/node`, `sharp`, `chrome-launcher` and `gltf-validator` use caret ranges. `allowScripts` also names `sharp@0.34.5` while the manifest requests `^0.35.3`.
- **Legal defaults embedded in `compose.yml` and the Dockerfile** — a misconfigured build ships an Impressum from fallbacks rather than failing. Consider empty defaults with the approval flags as the only publication path.
- **No CDN** — Nginx and the origin share a host, with a `0.50` CPU and `256m` memory limit behind a `20r/s` per-IP rate limit.
- **`carmonita` in the CI trigger list** — harmless, since `deploy.yml` filters on `master`, but worth renaming.

---

## Credits

IoCode SOLUTIONS — industrial automation, PLC, robotics, software and data. Production origin `https://iocode-solutions.com`, hosted in the EEA.
