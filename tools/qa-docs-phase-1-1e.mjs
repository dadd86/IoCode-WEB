import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/devops/phase-1-1e";
const errors = [];

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });

  writeFileSync(
    join(artifactRoot, name),
    JSON.stringify(payload, null, 2),
    "utf8"
  );
}

function readRequiredFile(path) {
  if (!existsSync(path)) {
    errors.push(`${path}: archivo requerido no encontrado.`);
    return "";
  }

  return readFileSync(path, "utf8");
}

function assertContains(filePath, content, expected) {
  if (!content.includes(expected)) {
    errors.push(`${filePath}: falta referencia requerida "${expected}".`);
  }
}

function assertNotContains(filePath, content, forbidden) {
  if (content.includes(forbidden)) {
    errors.push(`${filePath}: contiene referencia legacy "${forbidden}".`);
  }
}

const docs = {
  "README.md": readRequiredFile("README.md"),
  "RUN_GUIDE.md": readRequiredFile("RUN_GUIDE.md"),
  "Docker/README.md": readRequiredFile("Docker/README.md"),
  "Docker/OPERATIONS.md": readRequiredFile("Docker/OPERATIONS.md"),
  "Docker/SECURITY_NOTES.md": readRequiredFile("Docker/SECURITY_NOTES.md")
};

const packageJson = JSON.parse(readRequiredFile("package.json"));
const compose = readRequiredFile("compose.yml");
const dockerServer = readRequiredFile("Docker/node-static-server.mjs");

for (const [filePath, content] of Object.entries(docs)) {
  for (const forbidden of [
    "/healthz",
    "Docker/compose.yml",
    "Docker/.env",
    "npm install --no-save",
    "npm install "
  ]) {
    assertNotContains(filePath, content, forbidden);
  }
}

assertContains("README.md", docs["README.md"], "docker compose up -d dev");
assertContains("README.md", docs["README.md"], "docker compose --profile prod up --build -d web");
assertContains("README.md", docs["README.md"], "http://localhost:8080/health");

assertContains("RUN_GUIDE.md", docs["RUN_GUIDE.md"], "docker compose exec dev npm run check");
assertContains("RUN_GUIDE.md", docs["RUN_GUIDE.md"], "docker compose exec dev npm run build");
assertContains("RUN_GUIDE.md", docs["RUN_GUIDE.md"], "docker compose exec dev npm run internal:audit:prod");
assertContains("RUN_GUIDE.md", docs["RUN_GUIDE.md"], "http://localhost:8080/no-existe/");

assertContains("Docker/OPERATIONS.md", docs["Docker/OPERATIONS.md"], "/health");
assertContains("Docker/OPERATIONS.md", docs["Docker/OPERATIONS.md"], "/no-existe/");
assertContains("Docker/README.md", docs["Docker/README.md"], "compose.yml");

if (!packageJson.scripts?.["historical:qa:phase-1-1e"]) {
  errors.push("package.json: falta script historical:qa:phase-1-1e.");
}

if (!packageJson.scripts?.["historical:qa:smoke:1.1e"]) {
  errors.push("package.json: falta script historical:qa:smoke:1.1e.");
}

if (!packageJson.scripts?.["historical:summary:devops:1.1e"]) {
  errors.push("package.json: falta script historical:summary:devops:1.1e.");
}

assertContains("compose.yml", compose, "profiles:");
assertContains("compose.yml", compose, "prod");
assertContains("compose.yml", compose, "qa");
assertContains("compose.yml", compose, "/health");
assertContains("compose.yml", compose, "condition: service_healthy");
assertContains("Docker/node-static-server.mjs", dockerServer, 'request.url === "/health"');

const status = errors.length === 0 ? "passed" : "failed";

writeArtifact("docs.json", {
  phase: "1.1E",
  check: "documentation-sync",
  status,
  checkedFiles: Object.keys(docs),
  warningCount: 0,
  errorCount: errors.length,
  warnings: [],
  errors,
  generatedAt: new Date().toISOString()
});

if (errors.length > 0) {
  console.error("Errores documentación Fase 1.1E:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Documentación Fase 1.1E sincronizada.");
