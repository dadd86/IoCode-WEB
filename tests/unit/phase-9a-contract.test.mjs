import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8");

test("compose de producción aplica hardening y referencias inmutables", async () => {
  const compose = await read("compose.production.yml");
  for (const contract of [
    "${APP_IMAGE:?",
    "${NGINX_IMAGE:?",
    "read_only: true",
    "no-new-privileges:true",
    "cap_drop:",
    "pids_limit:",
    "mem_limit:",
    "cpus:",
    "healthcheck:",
    "internal: true"
  ]) assert.ok(compose.includes(contract), `Falta ${contract}`);
});

test("Nginx fuerza HTTPS, dominio canónico, TLS y HSTS", async () => {
  const nginx = await read("infra/nginx/conf.d/default.conf");
  for (const contract of [
    "return 308 https://iocode-solutions.com$request_uri",
    "ssl_protocols TLSv1.2 TLSv1.3",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "Permissions-Policy",
    "proxy_pass http://iocode_origin"
  ]) assert.ok(nginx.includes(contract), `Falta ${contract}`);
});

test("rollback reutiliza release anterior sin build", async () => {
  const rollback = await read("tools/rollback-release.sh");
  assert.ok(rollback.includes("previous"));
  assert.ok(rollback.includes("docker compose"));
  assert.ok(rollback.includes("restore_current_on_failure"));
  assert.doesNotMatch(rollback, /docker\s+(compose\s+)?build/u);
});

test("local, preview y producción tienen contratos separados", async () => {
  const [local, preview, production] = await Promise.all([
    read(".env.example"),
    read(".env.preview.example"),
    read(".env.production.example")
  ]);
  assert.match(local, /PUBLIC_DEPLOY_ENV=local/u);
  assert.match(preview, /PUBLIC_DEPLOY_ENV=preview/u);
  assert.match(production, /PUBLIC_DEPLOY_ENV=production/u);
  assert.doesNotMatch(production, /localhost|web:8080/u);
});
