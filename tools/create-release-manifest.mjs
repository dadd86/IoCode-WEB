import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { basename, resolve } from "node:path";

function argument(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] || fallback : fallback;
}

const artifactPath = resolve(argument("--artifact"));
const outputPath = resolve(argument("--output", "release-manifest.json"));
const imageDigest = argument("--image-digest", process.env.IMAGE_DIGEST || "");
const expectedSha256 = argument("--artifact-sha256");

if (!argument("--artifact")) {
  throw new Error("Uso: node tools/create-release-manifest.mjs --artifact <archivo> [--image-digest <sha256>] [--output <ruta>]");
}

if (imageDigest && !/^sha256:[a-f0-9]{64}$/u.test(imageDigest)) {
  throw new Error("--image-digest debe tener formato sha256:<64 hex>.");
}

const [artifact, packageJson] = await Promise.all([
  readFile(artifactPath),
  readFile(resolve("package.json"), "utf8").then(JSON.parse)
]);
const artifactSha256 = createHash("sha256").update(artifact).digest("hex");

if (expectedSha256 && expectedSha256 !== artifactSha256) {
  throw new Error("El SHA-256 indicado no coincide con el artefacto.");
}

const commitSha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const commitTimestamp = execFileSync("git", ["show", "-s", "--format=%cI", "HEAD"], { encoding: "utf8" }).trim();
const createdAt = process.env.RELEASE_CREATED_AT || commitTimestamp;
const manifest = {
  schemaVersion: 1,
  application: packageJson.name,
  version: packageJson.version,
  commitSha,
  createdAt,
  artifact: {
    name: basename(artifactPath),
    sha256: artifactSha256,
    bytes: artifact.byteLength
  },
  imageDigest: imageDigest || null
};

await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Manifest de release creado: ${outputPath}`);
