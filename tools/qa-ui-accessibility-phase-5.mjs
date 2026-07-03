import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/ui-accessibility/phase-5";

mkdirSync(artifactRoot, {
  recursive: true
});

function readSource(path) {
  if (!existsSync(path)) {
    return "";
  }

  return readFileSync(path, "utf8");
}

function writeArtifact(name, errors, extra = {}) {
  const artifact = {
    phase: "5",
    status: errors.length === 0 ? "passed" : "failed",
    warningCount: 0,
    errorCount: errors.length,
    blockers: {
      S0: errors.length,
      S1: 0
    },
    errors,
    generatedAt: new Date().toISOString(),
    ...extra
  };

  writeFileSync(join(artifactRoot, name), JSON.stringify(artifact, null, 2));

  return artifact;
}

function requireToken(source, token, errors, file) {
  if (!source.includes(token)) {
    errors.push(`${file}: falta ${token}.`);
  }
}

function requireAnyToken(source, tokens, errors, file, label) {
  if (!tokens.some((token) => source.includes(token))) {
    errors.push(`${file}: falta ${label}.`);
  }
}

const files = {
  baseLayout: "src/layouts/BaseLayout.astro",
  header: "src/components/Header.astro",
  footer: "src/components/Footer.astro",
  navigation: "src/components/Navigation.astro",
  languageSwitcher: "src/components/LanguageSwitcher.astro",
  contactForm: "src/components/ContactForm.astro",
  hero3d: "src/components/Hero3D.astro",
  hero3dScript: "src/scripts/hero3d.ts",
  globalCss: "src/assets/global.css",
  componentsCss: "src/assets/components.css",
  hero3dCss: "src/assets/hero3d.css",
  routes: "src/i18n/routes.ts"
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, readSource(path)])
);

const layoutErrors = [];
const pagesErrors = [];
const formErrors = [];
const keyboardErrors = [];
const accessibilityErrors = [];
const responsiveErrors = [];
const motionPerformanceErrors = [];
const screenshotsErrors = [];

for (const [key, path] of Object.entries(files)) {
  if (!existsSync(path)) {
    layoutErrors.push(`${path}: archivo requerido no encontrado (${key}).`);
  }
}

for (const token of [
  "<Header",
  "<Footer",
  "<main id=\"contenido\"",
  "class=\"skipLink\"",
  "href=\"#contenido\""
]) {
  requireToken(source.baseLayout, token, layoutErrors, files.baseLayout);
}

for (const token of [
  "<header",
  "<nav",
  "aria-label",
  "brand__logo",
  "alt={siteConfig.name}",
  "<Navigation",
  "<LanguageSwitcher"
]) {
  requireToken(source.header, token, layoutErrors, files.header);
}

for (const token of [
  "<footer",
  "aria-label"
]) {
  requireToken(source.footer, token, layoutErrors, files.footer);
}

for (const token of [
  "aria-current",
  "is-active"
]) {
  requireToken(source.navigation, token, layoutErrors, files.navigation);
}

for (const token of [
  "aria-current",
  "is-active"
]) {
  requireToken(source.languageSwitcher, token, layoutErrors, files.languageSwitcher);
}

const requiredRoutes = [
  "/es/",
  "/en/",
  "/de/",
  "/es/servicios/",
  "/en/services/",
  "/de/leistungen/",
  "/es/proceso/",
  "/en/process/",
  "/de/prozess/",
  "/es/proyectos/",
  "/en/projects/",
  "/de/projekte/",
  "/es/habilidades/",
  "/en/skills/",
  "/de/faehigkeiten/",
  "/es/contacto/",
  "/en/contact/",
  "/de/kontakt/"
];

for (const route of requiredRoutes) {
  requireToken(source.routes, route, pagesErrors, files.routes);
}

for (const token of [
  "data-contact-email",
  "data-contact-copy",
  "data-copy-status",
  "data-last-mailto",
  "required",
  "autocomplete=\"name\"",
  "autocomplete=\"email\"",
  "reportValidity",
  "mailto:",
  "navigator.clipboard",
  "aria-live=\"polite\""
]) {
  requireToken(source.contactForm, token, formErrors, files.contactForm);
}

for (const forbidden of [
  "type=\"password\"",
  "type=\"file\"",
  "name=\"password\"",
  "name=\"token\"",
  "name=\"secret\"",
  "name=\"credential\""
]) {
  if (source.contactForm.includes(forbidden)) {
    formErrors.push(`${files.contactForm}: no debe existir ${forbidden}.`);
  }
}

for (const token of [
  ":focus-visible",
  ".skipLink",
  ".skipLink:focus"
]) {
  requireToken(source.globalCss, token, keyboardErrors, files.globalCss);
}

requireAnyToken(
  source.componentsCss,
  [":focus-visible", ".skillLinks a:focus-visible"],
  keyboardErrors,
  files.componentsCss,
  "estilos focus-visible en componentes"
);

requireAnyToken(
  source.hero3dCss,
  [".hero3d__panel:focus-visible"],
  keyboardErrors,
  files.hero3dCss,
  "focus-visible en hero 3D"
);

for (const token of [
  "prefers-reduced-motion: reduce",
  "scroll-behavior: auto"
]) {
  requireToken(source.globalCss, token, accessibilityErrors, files.globalCss);
}

for (const token of [
  "<html lang={locale}",
  "<meta name=\"viewport\"",
  "hreflang=\"es\"",
  "hreflang=\"en\"",
  "hreflang=\"de\""
]) {
  requireToken(source.baseLayout, token, accessibilityErrors, files.baseLayout);
}

for (const token of [
  "aria-hidden=\"true\"",
  "data-hero-fallback",
  "data-fallback-logo-url",
  "aria-label"
]) {
  requireToken(source.hero3d, token, motionPerformanceErrors, files.hero3d);
}

for (const token of [
  "prefers-reduced-motion: reduce",
  "transition: none"
]) {
  requireToken(source.hero3dCss, token, motionPerformanceErrors, files.hero3dCss);
}

for (const token of [
  "prefers-reduced-motion: reduce",
  "hasWebGL",
  "showFallback"
]) {
  requireToken(source.hero3dScript, token, motionPerformanceErrors, files.hero3dScript);
}

for (const token of [
  "@media (max-width: 1180px)",
  "@media (max-width: 820px)",
  "@media (max-width: 620px)",
  "@media (max-width: 420px)"
]) {
  requireAnyToken(
    `${source.componentsCss}\n${source.hero3dCss}\n${source.globalCss}`,
    [token],
    responsiveErrors,
    "src/assets/*.css",
    token
  );
}

for (const token of [
  "overflow-x: hidden",
  "minmax(0, 1fr)",
  "min-width: 0"
]) {
  requireAnyToken(
    `${source.componentsCss}\n${source.hero3dCss}\n${source.globalCss}`,
    [token],
    responsiveErrors,
    "src/assets/*.css",
    token
  );
}

const artifacts = [
  writeArtifact("layout-review.json", layoutErrors, {
    checkedFiles: [
      files.baseLayout,
      files.header,
      files.footer,
      files.navigation,
      files.languageSwitcher
    ]
  }),
  writeArtifact("pages-review.json", pagesErrors, {
    checkedFile: files.routes,
    requiredRoutes
  }),
  writeArtifact("form-review.json", formErrors, {
    checkedFile: files.contactForm
  }),
  writeArtifact("keyboard-review.json", keyboardErrors, {
    checkedFiles: [
      files.baseLayout,
      files.globalCss,
      files.componentsCss,
      files.hero3dCss
    ]
  }),
  writeArtifact("accessibility-review.json", accessibilityErrors, {
    checkedFiles: [
      files.baseLayout,
      files.globalCss
    ]
  }),
  writeArtifact("responsive-review.json", responsiveErrors, {
    checkedFiles: [
      files.componentsCss,
      files.hero3dCss,
      files.globalCss
    ]
  }),
  writeArtifact("motion-performance-review.json", motionPerformanceErrors, {
    checkedFiles: [
      files.hero3d,
      files.hero3dScript,
      files.hero3dCss,
      files.globalCss
    ]
  }),
  writeArtifact("screenshots-review.json", screenshotsErrors, {
    note: "Las capturas reales se validan con Playwright en phase-5-ui-accessibility.spec.ts."
  })
];

const allErrors = artifacts.flatMap((artifact) => artifact.errors);

if (allErrors.length > 0) {
  console.error("Errores Fase 5:");
  for (const error of allErrors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("QA UI/accessibility Fase 5 superado.");