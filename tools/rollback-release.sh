#!/bin/sh
set -eu

: "${RELEASE_ROOT:=/opt/iocode/releases}"
current_link="${RELEASE_ROOT}/current"
previous_link="${RELEASE_ROOT}/previous"

if [ ! -L "$current_link" ] || [ ! -L "$previous_link" ]; then
  echo "ERROR: no existen punteros current y previous para rollback." >&2
  exit 1
fi

current_release="$(readlink -f "$current_link")"
target_release="$(readlink -f "$previous_link")"
env_file="${target_release}/.env.production"
compose_file="${target_release}/compose.production.yml"
rollback_ok="false"

test -f "$env_file" && test -f "$compose_file" || { echo "ERROR: release anterior incompleta." >&2; exit 1; }

restore_current_on_failure() {
  if [ "$rollback_ok" = "true" ]; then return; fi
  echo "ERROR: rollback fallido; restaurando el runtime que seguía vigente." >&2
  if [ -f "$current_release/.env.production" ]; then
    docker compose --env-file "$current_release/.env.production" -f "$current_release/compose.production.yml" up -d --remove-orphans --wait || true
  fi
}
trap restore_current_on_failure EXIT

docker compose --env-file "$env_file" -f "$compose_file" config --quiet
docker compose --env-file "$env_file" -f "$compose_file" pull
docker compose --env-file "$env_file" -f "$compose_file" up -d --remove-orphans --wait
sh tools/post-deploy-smoke.sh "https://iocode-solutions.com"

ln -sfn "$target_release" "$current_link"
ln -sfn "$current_release" "$previous_link"
rollback_ok="true"
echo "Rollback completado a $(basename "$target_release") sin build."
