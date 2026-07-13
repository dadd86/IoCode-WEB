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

function getExtensions(gltf) {
  return {
    used: gltf.extensionsUsed ?? [],
    required: gltf.extensionsRequired ?? []
  };
}

function extensionIsUsedOrRequired(gltf, extensionName) {
  const extensions = getExtensions(gltf);

  return (
    extensions.used.includes(extensionName) ||
    extensions.required.includes(extensionName)
  );
}

let gltf = null;
let stats = null;
let inspectOutput = "";
let validatorReport = null;

if (!existsSync(glbPath)) {
  errors.push(`${glbPath}: no existe.`);
} else {
  try {
    stats = statSync(glbPath);
    gltf = readGlbJson(glbPath);

    const extensions = getExtensions(gltf);

    if (extensionIsUsedOrRequired(gltf, "EXT_meshopt_compression")) {
      errors.push(
        "El GLB contiene EXT_meshopt_compression. Este proyecto no debe requerir Meshopt en runtime porque el GLB está bajo presupuesto y ya falló con Malformed buffer data."
      );
    }

    if (extensionIsUsedOrRequired(gltf, "KHR_draco_mesh_compression")) {
      errors.push(
        "El GLB contiene KHR_draco_mesh_compression, pero el runtime no configura DRACOLoader."
      );
    }

    if ((gltf.cameras?.length ?? 0) > 0) {
      warnings.push(
        "El GLB contiene cámaras. No es bloqueante para runtime, pero se recomienda eliminarlas en la siguiente optimización del asset."
      );
    }

    if ((gltf.images?.length ?? 0) > 0) {
      warnings.push(
        "El GLB contiene imágenes embebidas. Revisar compresión de textura y dimensiones."
      );
    }

    if ((gltf.meshes?.length ?? 0) === 0) {
      errors.push("El GLB no contiene meshes.");
    }

    if ((gltf.scenes?.length ?? 0) === 0) {
      errors.push("El GLB no contiene scenes.");
    }

    if ((stats?.size ?? 0) > Number(process.env.PHASE6_MAX_GLB_ACCEPTED_BYTES || "5000000")) {
      errors.push(
        `${glbPath}: ${stats.size} bytes supera presupuesto aceptable de GLB.`
      );
    }

    try {
      inspectOutput = execFileSync(gltfTransformBin, ["inspect", glbPath], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      });
    } catch (error) {
      errors.push(
        `gltf-transform inspect falló: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    try {
      const validatorModule = await import("gltf-validator");
      const validator = validatorModule.default ?? validatorModule;

      validatorReport = await validator.validateBytes(new Uint8Array(readFileSync(glbPath)), {
        maxIssues: 200
      });

      if ((validatorReport.issues?.numErrors ?? 0) > 0) {
        errors.push(`glTF Validator reporta ${validatorReport.issues.numErrors} errores.`);
      }

      if ((validatorReport.issues?.numWarnings ?? 0) > 0) {
        warnings.push(
          `glTF Validator reporta ${validatorReport.issues.numWarnings} warnings.`
        );
      }

      if ((validatorReport.issues?.numInfos ?? 0) > 0) {
        warnings.push(
          `glTF Validator reporta ${validatorReport.issues.numInfos} infos.`
        );
      }
    } catch (error) {
      errors.push(
        `No se pudo ejecutar gltf-validator desde Node: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    writeArtifact("glb-report.json", {
      phase: "6",
      check: "glb-inspection",
      status: errors.length === 0 ? "passed" : "failed",
      file: glbPath,
      sizeBytes: stats?.size ?? null,
      asset: gltf.asset ?? null,
      extensions,
      runtimeCompatibility: {
        meshoptRequired: extensionIsUsedOrRequired(gltf, "EXT_meshopt_compression"),
        dracoRequired: extensionIsUsedOrRequired(gltf, "KHR_draco_mesh_compression"),
        expectedRuntime: "Three.js GLTFLoader without external mesh compression decoders"
      },
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
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
}

if (!existsSync(join(artifactRoot, "glb-report.json"))) {
  writeArtifact("glb-report.json", {
    phase: "6",
    check: "glb-inspection",
    status: "failed",
    file: glbPath,
    warningCount: warnings.length,
    errorCount: errors.length,
    warnings,
    errors,
    generatedAt: new Date().toISOString()
  });

  writeArtifact("gltf-validator-report.json", {
    phase: "6",
    check: "gltf-validator",
    status: "failed",
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