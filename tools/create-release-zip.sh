#!/bin/sh
set -eu

project_name="IoCode-WEB"
release_dir="releases"

if [ ! -d ".git" ]; then
  echo "ERROR: No existe .git. Este script debe ejecutarse desde el repositorio del proyecto."
  exit 1
fi

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
    | grep -E '(^|/)(\.git|dist|node_modules|\.astro|qa-artifacts|playwright-report|test-results|coverage|logs|releases|artifacts|exports)(/|$)|\.(log|zip|tar|tgz|rar|7z)$' \
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