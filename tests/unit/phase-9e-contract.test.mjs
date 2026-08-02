import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const read = (path) => readFile(resolve(root, path), "utf8");

test("the production monitor covers localized availability, DNS and TLS", async () => {
  const config = JSON.parse(await read("config/observability.json"));
  const timer = await read("infra/systemd/iocode-production-monitor.timer");
  const paths = config.http.targets.map((target) => target.path);

  assert.deepEqual(paths, ["/health", "/es/", "/en/", "/de/"]);
  assert.equal(config.http.intervalSeconds, 60);
  assert.match(timer, /OnUnitActiveSec=60s/u);
  assert.equal(config.http.failureThreshold, 2);
  assert.equal(config.tls.criticalDaysRemaining, 14);
  assert.equal(config.dns.requireA, true);
  assert.equal(config.dns.requireAAAA, true);
  assert.equal(config.dns.requiredWwwCname, "iocode-solutions.com");
});

test("Nginx access telemetry cannot identify a visitor or requested page", async () => {
  const nginx = await read("infra/nginx/nginx.conf");
  const format = nginx.match(/log_format privacy_minimal[\s\S]*?;\n/u)?.[0];

  assert.ok(format, "privacy_minimal log format is required");
  for (const forbidden of [
    "$remote_addr",
    "$remote_user",
    "$request_uri",
    "$http_referer",
    "$http_user_agent",
    "$http_cookie",
    "$http_authorization"
  ]) {
    assert.equal(format.includes(forbidden), false, `${forbidden} must not be logged`);
  }
  assert.match(format, /\$time_iso8601/u);
  assert.match(format, /\$status/u);
  assert.match(format, /\$request_time/u);
  assert.match(nginx, /error_log \/dev\/stderr emerg;/u);
});

test("retention is bounded and destructive pruning rejects broad paths", async () => {
  const [configText, compose, logrotate, prune] = await Promise.all([
    read("config/observability.json"),
    read("compose.production.yml"),
    read("infra/logrotate/iocode-observability"),
    read("tools/prune-observability-logs.sh")
  ]);
  const config = JSON.parse(configText);

  assert.equal(config.retention.rawLogsDays, 14);
  assert.equal((compose.match(/driver: local/gu) || []).length, 2);
  assert.match(logrotate, /rotate 14/u);
  assert.match(logrotate, /maxage 14/u);
  assert.match(prune, /\/var\/log\/iocode-observability\|\/srv\/iocode-observability/u);
  assert.match(prune, /Refusing unsafe OBSERVABILITY_LOG_ROOT/u);
});

test("incident and recovery contracts use immutable rollback and explicit ownership", async () => {
  const [runbook, recovery, rollback] = await Promise.all([
    read("docs/INCIDENT_RUNBOOK.md"),
    read("docs/DISASTER_RECOVERY.md"),
    read("tools/rollback-release.sh")
  ]);

  for (const section of ["Detección", "Contención", "Diagnóstico", "Rollback técnico", "Comunicación"]) {
    assert.ok(runbook.includes(section), `missing ${section}`);
  }
  assert.match(recovery, /RTO/u);
  assert.match(recovery, /RPO/u);
  assert.match(recovery, /DNS/u);
  assert.match(recovery, /TLS/u);
  assert.match(rollback, /previous/u);
  assert.doesNotMatch(rollback, /npm (run|exec)|astro build/u);
});

test("field CWV defaults to Search Console without client tracking", async () => {
  const observability = await read("docs/OBSERVABILITY.md");

  assert.match(observability, /Google Search Console/u);
  assert.match(observability, /LCP/u);
  assert.match(observability, /CLS/u);
  assert.match(observability, /INP/u);
  assert.match(observability, /sin cookies/u);
  assert.match(observability, /14 días/u);
});
