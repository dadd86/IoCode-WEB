#!/bin/sh
set -eu

project_name="IoCode-WEB"
release_dir="releases"
phase6_summary="qa-artifacts/performance/phase-6/summary.json"

if [ ! -d ".git" ]; then
  echo "ERROR: No existe .git. Este script debe ejecutarse desde el repositorio del proyecto."
  exit 1
fi

if [ ! -f "$phase6_summary" ]; then
  echo "ERROR: No existe evidencia de Fase 6:"
  echo "$phase6_summary"
  echo
  echo "Ejecuta primero el flujo completo de Fase 6:"
  echo "docker compose --profile prod --profile qa --profile assets --profile release down --remove-orphans"
  echo "docker compose --profile assets build --no-cache assets"
  echo "docker compose --profile assets run --rm assets \"npm run prepare:assets:6\""
  echo "docker compose --profile prod --profile qa build --no-cache web performance-qa"
  echo "docker compose --profile prod --profile qa up -d web"
  echo "docker compose --profile prod --profile qa run --rm performance-qa"
  echo "docker compose --profile prod --profile qa down --remove-orphans"
  exit 1
fi

node -e "
const fs = require('node:fs');
const summaryPath = '$phase6_summary';
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

const errors = [];

if (summary.status !== 'passed') {
  errors.push(\`summary.status=\${summary.status}; se esperaba passed\`);
}

if ((summary.errorCount ?? 0) !== 0) {
  errors.push(\`summary.errorCount=\${summary.errorCount}; se esperaba 0\`);
}

if ((summary.warningCount ?? 0) !== 0) {
  errors.push(\`summary.warningCount=\${summary.warningCount}; se esperaba 0\`);
}

if ((summary.blockers?.S0 ?? 0) !== 0) {
  errors.push(\`summary.blockers.S0=\${summary.blockers.S0}; se esperaba 0\`);
}

if ((summary.blockers?.S1 ?? 0) !== 0) {
  errors.push(\`summary.blockers.S1=\${summary.blockers.S1}; se esperaba 0\`);
}

if (errors.length > 0) {
  console.error('ERROR: Fase 6 no está cerrada.');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK: Evidencia Fase 6 passed.');
"

if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: El repositorio tiene cambios sin confirmar."
  echo
  git status --short
  echo
  echo "Haz commit antes de crear un ZIP de release."
  exit 1
fi

mkdir -p "$release_dir"

commit="$(git rev-parse --short HEAD)"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
output="${release_dir}/${project_name}-${timestamp}-${commit}.zip"

git archive \
  --format=zip \
  --prefix="${project_name}/" \
  --output="$output" \
  HEAD

echo "ZIP creado: $output"
echo

bad_paths="$(
  unzip -l "$output" \
    | awk '{print $4}' \
    | grep -E '(^|/)(\.git|\.agents|dist|node_modules|\.astro|qa-artifacts|playwright-report|test-results|coverage|logs|releases|artifacts|exports)(/|$)|\.(log|zip|tar|tgz|rar|7z)$' \
    || true
)"

bad_env_paths="$(
  unzip -l "$output" \
    | awk '{print $4}' \
    | grep -E '(^|/)\.env($|\.)' \
    | grep -vE '(^|/)\.env\.example$' \
    || true
)"

if [ -n "$bad_paths" ] || [ -n "$bad_env_paths" ]; then
  echo "ERROR: El ZIP contiene archivos o carpetas que no deben publicarse."
  echo

  if [ -n "$bad_paths" ]; then
    echo "$bad_paths"
  fi

  if [ -n "$bad_env_paths" ]; then
    echo "$bad_env_paths"
  fi

  rm -f "$output"
  exit 1
fi

echo "OK: ZIP limpio."
echo "OK: No contiene .git, dist, node_modules, .astro, qa-artifacts, logs, .env reales ni ZIPs previos."
