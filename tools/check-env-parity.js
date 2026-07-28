import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const PUBLIC_ENV_DEFAULTS = Object.freeze({
  ASTRO_DEV_PORT: "4321",
  ASTRO_PREVIEW_PORT: "4322",
  WEB_PORT: "8080",
  ENABLE_HSTS: "false",
  ENABLE_COOP: "false",
  ENABLE_UPGRADE_INSECURE_REQUESTS: "false"
});

export function parseDotEnv(content) {
  const values = new Map();

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const match = line.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/u
    );

    if (!match) {
      continue;
    }

    const [, name, rawValue] = match;
    const value = rawValue.trim().replace(/^(["'])(.*)\1$/u, "$2");
    values.set(name, value);
  }

  return values;
}

export function parseComposeInterpolations(content) {
  const values = new Map();
  const pattern = /\$\{([A-Z][A-Z0-9_]*)(?::-([^}]*))?\}/gu;

  for (const match of content.matchAll(pattern)) {
    const [, name, fallback = ""] = match;
    const fallbacks = values.get(name) ?? [];
    fallbacks.push(fallback);
    values.set(name, fallbacks);
  }

  return values;
}

function finding(code, variable, message, source) {
  return {
    severity: "error",
    code,
    variable,
    source,
    message
  };
}

export async function validateEnvParity({
  envPath,
  composePath,
  allowlist = PUBLIC_ENV_DEFAULTS
}) {
  const resolvedEnvPath = resolve(envPath);
  const resolvedComposePath = resolve(composePath);
  const [envContent, composeContent] = await Promise.all([
    readFile(resolvedEnvPath, "utf8"),
    readFile(resolvedComposePath, "utf8")
  ]);
  const envValues = parseDotEnv(envContent);
  const composeValues = parseComposeInterpolations(composeContent);
  const checkedVariables = Object.keys(allowlist).sort();
  const findings = [];

  for (const variable of checkedVariables) {
    const expectedDefault = String(allowlist[variable]);
    const envDefault = envValues.get(variable);
    const composeDefaults = composeValues.get(variable);

    if (envDefault === undefined) {
      findings.push(
        finding(
          "ENV_PUBLIC_MISSING",
          variable,
          `Falta ${variable} en el ejemplo de entorno.`,
          resolvedEnvPath
        )
      );
    } else if (envDefault !== expectedDefault) {
      findings.push(
        finding(
          "ENV_DEFAULT_MISMATCH",
          variable,
          `El valor de ejemplo debe ser ${expectedDefault}, no ${envDefault}.`,
          resolvedEnvPath
        )
      );
    }

    if (!composeDefaults?.length) {
      findings.push(
        finding(
          "COMPOSE_INTERPOLATION_MISSING",
          variable,
          `${variable} debe usar interpolación de Compose con fallback.`,
          resolvedComposePath
        )
      );
      continue;
    }

    for (const actualDefault of composeDefaults) {
      if (actualDefault !== expectedDefault) {
        findings.push(
          finding(
            "COMPOSE_DEFAULT_MISMATCH",
            variable,
            `El fallback de Compose debe ser ${expectedDefault}, no ${actualDefault || "(vacío)"}.`,
            resolvedComposePath
          )
        );
      }
    }
  }

  return {
    schemaVersion: 1,
    status: findings.length === 0 ? "passed" : "failed",
    checkedVariables,
    sources: {
      env: resolvedEnvPath,
      compose: resolvedComposePath
    },
    findings
  };
}

function parseArguments(argv) {
  const options = {
    envPath: ".env.example",
    composePath: "compose.yml",
    outputPath: "qa-artifacts/configuration/env-parity.json"
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (argument === "--env" && value) {
      options.envPath = value;
      index += 1;
    } else if (argument === "--compose" && value) {
      options.composePath = value;
      index += 1;
    } else if (argument === "--output" && value) {
      options.outputPath = value;
      index += 1;
    }
  }

  return options;
}

async function runCli() {
  const { envPath, composePath, outputPath } = parseArguments(
    process.argv.slice(2)
  );
  const report = await validateEnvParity({ envPath, composePath });
  const resolvedOutputPath = resolve(outputPath);

  await mkdir(dirname(resolvedOutputPath), { recursive: true });
  await writeFile(
    resolvedOutputPath,
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8"
  );

  console.log(
    `Paridad de entorno: ${report.status}; ${report.checkedVariables.length} variables; ${report.findings.length} errores; reporte ${resolvedOutputPath}`
  );

  process.exitCode = report.status === "passed" ? 0 : 1;
}

const isCli =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isCli) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
