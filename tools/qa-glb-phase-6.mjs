import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const glbPath = "public/logo/3d/iocode_solutions_logo_extruded_3d.glb";
const errors = [];
const warnings = [];

const gltfTransformBin = join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "gltf-transform.cmd" : "gltf-transform"
);

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });
  writeFileSync(join(artifactRoot, name), JSON.stringify(payload, null, 2), "utf8");
}

function readGlbJson(path) {
  const buffer = readFileSync(path);

  if (buffer.toString("utf8", 0, 4) !== "glTF") {
    throw new Error("Archivo GLB inválido: magic header no es glTF.");
  }

  const version = buffer.readUInt32LE(4);
  const declaredLength = buffer.readUInt32LE(8);
  const jsonChunkLength = buffer.readUInt32LE(12);
  const jsonChunkType = buffer.readUInt32LE(16);

  if (version !== 2) {
    throw new Error(`GLB versión ${version}; se esperaba 2.`);
  }

  if (declaredLength !== buffer.length) {
    throw new Error(`GLB length declarado ${declaredLength}, real ${buffer.length}.`);
  }

  if (jsonChunkType !== 0x4e4f534a) {
    throw new Error("Primer chunk GLB no es JSON.");
  }

  return JSON.parse(buffer.toString("utf8", 20, 20 + jsonChunkLength));
}

if (!existsSync(glbPath)) {
  errors.push(`${glbPath}: no existe.`);
} else {
  const stats = statSync(glbPath);
  const gltf = readGlbJson(glbPath);

  if ((gltf.cameras?.length ?? 0) > 0) {
    warnings.push("El GLB contiene cámaras. No es bloqueante, pero se recomienda eliminar cámaras no usadas.");
  }

  if ((gltf.images?.length ?? 0) > 0) {
    warnings.push("El GLB contiene imágenes embebidas. Revisar compresión de textura.");
  }

  let inspectOutput = "";

  try {
    inspectOutput = execFileSync(gltfTransformBin, ["inspect", glbPath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (error) {
    errors.push(`gltf-transform inspect falló: ${error.message}`);
  }

  let validatorReport = null;

  try {
    const validatorModule = await import("gltf-validator");
    const validator = validatorModule.default ?? validatorModule;

    const report = await validator.validateBytes(new Uint8Array(readFileSync(glbPath)), {
      maxIssues: 200
    });

    validatorReport = report;

    const issueCount =
      (report.issues?.numErrors ?? 0) +
      (report.issues?.numWarnings ?? 0);

    if ((report.issues?.numErrors ?? 0) > 0) {
      errors.push(`glTF Validator reporta ${report.issues.numErrors} errores.`);
    }

    if (issueCount > 0 && (report.issues?.numErrors ?? 0) === 0) {
      warnings.push(`glTF Validator reporta ${issueCount} issues no bloqueantes.`);
    }
  } catch (error) {
    errors.push(`No se pudo ejecutar gltf-validator desde Node: ${error.message}`);
  }

  writeArtifact("glb-report.json", {
    phase: "6",
    check: "glb-inspection",
    status: errors.length === 0 ? "passed" : "failed",
    file: glbPath,
    sizeBytes: stats.size,
    asset: gltf.asset,
    counts: {
      scenes: gltf.scenes?.length ?? 0,
      nodes: gltf.nodes?.length ?? 0,
      meshes: gltf.meshes?.length ?? 0,
      materials: gltf.materials?.length ?? 0,
      images: gltf.images?.length ?? 0,
      textures: gltf.textures?.length ?? 0,
      cameras: gltf.cameras?.length ?? 0
    },
    inspectOutput,
    warningCount: warnings.length,
    errorCount: errors.length,
    warnings,
    errors,
    generatedAt: new Date().toISOString()
  });

  writeArtifact("gltf-validator-report.json", {
    phase: "6",
    check: "gltf-validator",
    status: validatorReport && errors.length === 0 ? "passed" : "failed",
    report: validatorReport,
    generatedAt: new Date().toISOString()
  });
}

if (errors.length > 0) {
  console.error("Errores GLB Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("GLB Fase 6 validado.");