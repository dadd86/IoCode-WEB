#!/bin/sh
set -eu
umask 077

: "${APP_IMAGE:?APP_IMAGE es obligatorio y debe incluir @sha256}"
: "${NGINX_IMAGE:?NGINX_IMAGE es obligatorio y debe incluir @sha256}"
: "${RELEASE_ID:?RELEASE_ID es obligatorio}"
: "${RELEASE_ROOT:=/opt/iocode/releases}"
: "${TLS_FULLCHAIN_PATH:?TLS_FULLCHAIN_PATH es obligatorio}"
: "${TLS_PRIVKEY_PATH:?TLS_PRIVKEY_PATH es obligatorio}"

printf '%s\n' "$APP_IMAGE" | grep -Eq '^.+@sha256:[a-f0-9]{64}$' || { echo "ERROR: APP_IMAGE no es inmutable." >&2; exit 64; }
printf '%s\n' "$NGINX_IMAGE" | grep -Eq '^.+@sha256:[a-f0-9]{64}$' || { echo "ERROR: NGINX_IMAGE no es inmutable." >&2; exit 64; }
printf '%s\n' "$RELEASE_ID" | grep -Eq '^[a-f0-9]{40}$' || { echo "ERROR: RELEASE_ID debe ser un commit SHA completo." >&2; exit 64; }

release_dir="${RELEASE_ROOT}/${RELEASE_ID}"
current_link="${RELEASE_ROOT}/current"
previous_link="${RELEASE_ROOT}/previous"
old_release=""
deployment_ok="false"

if [ -L "$current_link" ]; then
  old_release="$(readlink -f "$current_link")"
fi

if [ -e "$release_dir" ]; then
  echo "ERROR: el release ${RELEASE_ID} ya existe y no se sobrescribe." >&2
  exit 1
fi

restore_on_failure() {
  if [ "$deployment_ok" = "true" ]; then return; fi
  echo "ERROR: despliegue fallido; restaurando el runtime anterior." >&2
  if [ -n "$old_release" ] && [ -f "$old_release/.env.production" ]; then
    docker compose --env-file "$old_release/.env.production" -f "$old_release/compose.production.yml" up -d --remove-orphans --wait || true
  elif [ -f "$release_dir/.env.production" ]; then
    docker compose --env-file "$release_dir/.env.production" -f "$release_dir/compose.production.yml" down || true
  fi
}
trap restore_on_failure EXIT

mkdir -p "$release_dir/infra/nginx"
cp compose.production.yml "$release_dir/compose.production.yml"
cp -R infra/nginx/. "$release_dir/infra/nginx/"

cat > "$release_dir/.env.production" <<EOF
APP_IMAGE=$APP_IMAGE
NGINX_IMAGE=$NGINX_IMAGE
TLS_FULLCHAIN_PATH=$TLS_FULLCHAIN_PATH
TLS_PRIVKEY_PATH=$TLS_PRIVKEY_PATH
RELEASE_ID=$RELEASE_ID
RELEASE_ROOT=$RELEASE_ROOT
EOF

docker compose --env-file "$release_dir/.env.production" -f "$release_dir/compose.production.yml" config --quiet
docker compose --env-file "$release_dir/.env.production" -f "$release_dir/compose.production.yml" pull

manifest_version="$(docker image inspect --format '{{ index .Config.Labels "org.opencontainers.image.version" }}' "$APP_IMAGE")"
manifest_commit="$(docker image inspect --format '{{ index .Config.Labels "org.opencontainers.image.revision" }}' "$APP_IMAGE")"
manifest_date="$(docker image inspect --format '{{ index .Config.Labels "org.opencontainers.image.created" }}' "$APP_IMAGE")"
manifest_artifact="$(docker image inspect --format '{{ index .Config.Labels "com.iocode.release.artifact.name" }}' "$APP_IMAGE")"
manifest_artifact_sha="$(docker image inspect --format '{{ index .Config.Labels "com.iocode.release.artifact.sha256" }}' "$APP_IMAGE")"

[ "$manifest_commit" = "$RELEASE_ID" ] || { echo "ERROR: el label VCS no coincide con RELEASE_ID." >&2; exit 1; }
printf '%s\n' "$manifest_artifact_sha" | grep -Eq '^[a-f0-9]{64}$' || { echo "ERROR: la imagen no contiene SHA-256 de artefacto válido." >&2; exit 1; }

cat > "$release_dir/release-manifest.json" <<EOF
{
  "schemaVersion": 1,
  "application": "iocode-solutions-web",
  "version": "$manifest_version",
  "commitSha": "$manifest_commit",
  "createdAt": "$manifest_date",
  "artifact": {
    "name": "$manifest_artifact",
    "sha256": "$manifest_artifact_sha"
  },
  "imageDigest": "${APP_IMAGE##*@}"
}
EOF

docker compose --env-file "$release_dir/.env.production" -f "$release_dir/compose.production.yml" up -d --remove-orphans --wait
sh tools/post-deploy-smoke.sh "https://iocode-solutions.com"

if [ -n "$old_release" ]; then ln -sfn "$old_release" "$previous_link"; fi
ln -sfn "$release_dir" "$current_link"
deployment_ok="true"
echo "Release ${RELEASE_ID} desplegada sin recompilación."
