#!/usr/bin/env sh
set -eu

docker compose --env-file Docker/.env -f Docker/compose.yml --profile prod build web
