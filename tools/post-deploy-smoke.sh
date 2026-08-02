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
assert_status "/es/servicios/" 200
assert_status "/en/services/" 200
assert_status "/de/leistungen/" 200
assert_status "/es/contacto/" 200
assert_status "/en/contact/" 200
assert_status "/de/kontakt/" 200
assert_status "/sitemap-index.xml" 200
assert_status "/sitemap.xml" 200
assert_status "/robots.txt" 200
assert_status "/es/no-existe-9d/" 404
assert_status "/en/not-found-9d/" 404
assert_status "/de/nicht-gefunden-9d/" 404

headers="$(curl --silent --show-error --head "${base_url}/es/")"
printf '%s\n' "$headers" | grep -qi '^strict-transport-security: max-age=31536000; includeSubDomains' || { echo "ERROR: HSTS ausente." >&2; exit 1; }
printf '%s\n' "$headers" | grep -qi '^content-security-policy:' || { echo "ERROR: CSP ausente." >&2; exit 1; }
printf '%s\n' "$headers" | grep -qi '^x-content-type-options: nosniff' || { echo "ERROR: nosniff ausente." >&2; exit 1; }

compression="$(curl --silent --show-error --head --header 'Accept-Encoding: br, gzip' "${base_url}/es/")"
printf '%s\n' "$compression" | grep -Eqi '^content-encoding: (br|gzip)' || { echo "ERROR: compresión Brotli/Gzip ausente." >&2; exit 1; }

glb_headers="$(curl --silent --show-error --head "${base_url}/logo/3d/iocode_solutions_logo_extruded_3d.glb?v=572076acb6cb")"
printf '%s\n' "$glb_headers" | grep -qi '^content-type: model/gltf-binary' || { echo "ERROR: MIME GLB incorrecto." >&2; exit 1; }
printf '%s\n' "$glb_headers" | grep -qi '^cache-control: public, max-age=31536000, immutable' || { echo "ERROR: caché GLB incorrecta." >&2; exit 1; }

impressum_redirect="$(curl --silent --show-error --output /dev/null --write-out '%{http_code} %{redirect_url}' "${base_url}/es/impressum/")"
case "$impressum_redirect" in
  "308 ${base_url}/es/aviso-legal/") ;;
  *) echo "ERROR: alias Impressum inesperado: ${impressum_redirect}." >&2; exit 1 ;;
esac

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
