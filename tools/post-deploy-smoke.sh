#!/bin/sh
set -eu

base_url="${1:-https://iocode-solutions.com}"

case "$base_url" in
  https://*) ;;
  *) echo "ERROR: el smoke de producción exige HTTPS." >&2; exit 64 ;;
esac

assert_status() {
  path="$1"
  expected="$2"
  actual="$(curl --fail-with-body --silent --show-error --output /dev/null --write-out '%{http_code}' "${base_url}${path}")"
  if [ "$actual" != "$expected" ]; then
    echo "ERROR: ${path} devolvió ${actual}; se esperaba ${expected}." >&2
    exit 1
  fi
}

assert_status "/es/" 200
assert_status "/en/" 200
assert_status "/de/" 200
assert_status "/sitemap.xml" 200
assert_status "/robots.txt" 200

headers="$(curl --silent --show-error --head "${base_url}/es/")"
printf '%s\n' "$headers" | grep -qi '^strict-transport-security: max-age=31536000; includeSubDomains' || { echo "ERROR: HSTS ausente." >&2; exit 1; }
printf '%s\n' "$headers" | grep -qi '^content-security-policy:' || { echo "ERROR: CSP ausente." >&2; exit 1; }
printf '%s\n' "$headers" | grep -qi '^x-content-type-options: nosniff' || { echo "ERROR: nosniff ausente." >&2; exit 1; }

redirect="$(curl --silent --show-error --output /dev/null --write-out '%{http_code} %{redirect_url}' "http://iocode-solutions.com/es/")"
case "$redirect" in
  "308 https://iocode-solutions.com/es/") ;;
  *) echo "ERROR: redirección HTTP inesperada: ${redirect}." >&2; exit 1 ;;
esac

www_redirect="$(curl --silent --show-error --output /dev/null --write-out '%{http_code} %{redirect_url}' "https://www.iocode-solutions.com/es/")"
case "$www_redirect" in
  "308 https://iocode-solutions.com/es/") ;;
  *) echo "ERROR: redirección www inesperada: ${www_redirect}." >&2; exit 1 ;;
esac

echo "Smoke post-deploy PASSED para ${base_url}."
