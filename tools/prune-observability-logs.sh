#!/bin/sh
set -eu

log_root="${OBSERVABILITY_LOG_ROOT:-/var/log/iocode-observability}"
retention_days="${OBSERVABILITY_RETENTION_DAYS:-14}"

case "$log_root" in
  /var/log/iocode-observability|/srv/iocode-observability)
    ;;
  *)
    echo "Refusing unsafe OBSERVABILITY_LOG_ROOT: $log_root" >&2
    exit 64
    ;;
esac

case "$retention_days" in
  ''|*[!0-9]*)
    echo "OBSERVABILITY_RETENTION_DAYS must be an integer." >&2
    exit 64
    ;;
esac

if [ "$retention_days" -lt 1 ] || [ "$retention_days" -gt 30 ]; then
  echo "OBSERVABILITY_RETENTION_DAYS must be between 1 and 30." >&2
  exit 64
fi

if [ ! -d "$log_root" ]; then
  echo "Observability log directory does not exist; nothing to prune."
  exit 0
fi

find "$log_root" -xdev -type f -mtime "+$retention_days" -delete
echo "Expired observability files older than $retention_days days were removed."
