import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8");

test("technical and publication checks remain independent and visible", async () => {
  const [technical, publication, deploy, phase9b] = await Promise.all([
    read(".github/workflows/ci-technical.yml"),
    read(".github/workflows/ci-release.yml"),
    read(".github/workflows/deploy.yml"),
    read("tools/qa-phase-9b.mjs")
  ]);

  assert.match(technical, /^name: Technical branch gate$/mu);
  for (const command of [
    "npm run check",
    "npm run internal:typecheck:src",
    "npm run internal:typecheck:tests",
    "npm run build",
    "npm run internal:qa:privacy",
    "npm run internal:qa:phase-9f:static",
    "npm run internal:qa:phase-9f:e2e",
    "node Docker/node-static-server.mjs",
    "npm audit --omit=dev --audit-level=high"
  ]) {
    assert.ok(technical.includes(command), `technical gate missing ${command}`);
  }
  assert.doesNotMatch(technical, /internal:qa:config:prod|docker push|upload-artifact/iu);

  assert.match(publication, /^name: Publication gate$/mu);
  assert.match(publication, /npm run internal:qa:config:prod/u);
  assert.ok(
    publication.indexOf("npm run internal:qa:config:prod") < publication.indexOf("docker push"),
    "publication approval must precede release publication"
  );
  assert.doesNotMatch(publication, /continue-on-error:\s*true/iu);

  assert.match(deploy, /^\s{6}- Publication gate$/mu);
  assert.match(deploy, /workflow_run\.conclusion == 'success'/u);
  assert.match(deploy, /workflow_run\.head_branch == 'master'/u);

  assert.match(phase9b, /const isProduction = deployEnvironment === "production"/u);
  assert.match(phase9b, /preview legal sin noindex o aviso visible/u);
  assert.match(phase9b, /robots\.txt de preview debe bloquear rastreo/u);
});
