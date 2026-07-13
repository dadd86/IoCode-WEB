import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const sourceGlb = "public/logo/3d/iocode_solutions_logo_extruded_3d.glb";
const tempGlb = "public/logo/3d/iocode_solutions_logo_extruded_3d.runtime-safe.tmp.glb";
const backupGlb = join(artifactRoot, "iocode_solutions_logo_extruded_3d.before-repair.glb");
const reportPath = join(artifactRoot, "glb-repair-report.json");

const gltfTransformBin = join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "gltf-transform.cmd" : "gltf-transform"
);

const errors = [];
const warnings = [];

function readGlbJson(path) {
  const buffer = readFileSync(path);

  if (buffer.toString("utf8", 0, 4) !== "glTF") {
    throw new Error(`${path}: cabecera inválida, no es GLB.`);
  }

  const version = buffer.readUInt32LE(4);
  const declaredLength = buffer.readUInt32LE(8);
  const jsonChunkLength = buffer.readUInt32LE(12);
  const jsonChunkType = buffer.readUInt32LE(16);

  if (version !== 2) {
    throw new Error(`${path}: versión GLB ${version}; se esperaba 2.`);
  }

  if (declaredLength !== buffer.length) {
    throw new Error(
      `${path}: longitud declarada ${declaredLength}, longitud real ${buffer.length}.`
    );
  }

  if (jsonChunkType !== 0x4e4f534a) {
    throw new Error(`${path}: primer chunk no es JSON.`);
  }

  return JSON.parse(buffer.toString("utf8", 20, 20 + jsonChunkLength));
}

function getExtensions(gltf) {
  return {
    used: gltf.extensionsUsed ?? [],
    required: gltf.extensionsRequired ?? []
  };
}

function hasMeshopt(gltf) {
  const extensions = getExtensions(gltf);

  return (
    extensions.used.includes("EXT_meshopt_compression") ||
    extensions.required.includes("EXT_meshopt_compression")
  );
}

function assertRuntimeSafeGlb(path) {
  const gltf = readGlbJson(path);
  const extensions = getExtensions(gltf);

  if (hasMeshopt(gltf)) {
    throw new Error(
      `${path}: todavía contiene EXT_meshopt_compression. No es runtime-safe para esta Fase 6.`
    );
  }

  if (extensions.required.includes("KHR_draco_mesh_compression")) {
    throw new Error(
      `${path}: contiene KHR_draco_mesh_compression requerido, pero el runtime no configura DRACOLoader.`
    );
  }

  return {
    asset: gltf.asset ?? null,
    extensions,
    counts: {
      scenes: gltf.scenes?.length ?? 0,
      nodes: gltf.nodes?.length ?? 0,
      meshes: gltf.meshes?.length ?? 0,
      materials: gltf.materials?.length ?? 0,
      images: gltf.images?.length ?? 0,
      textures: gltf.textures?.length ?? 0,
      cameras: gltf.cameras?.length ?? 0
    }
  };
}

mkdirSync(artifactRoot, {
  recursive: true
});

if (!existsSync(sourceGlb)) {
  errors.push(`${sourceGlb}: no existe.`);
}

if (!existsSync(gltfTransformBin)) {
  errors.push(`${gltfTransformBin}: no existe. Ejecuta este script dentro del contenedor assets/performance.`);
}

let before = null;
let after = null;

if (errors.length === 0) {
  try {
    before = {
      ...assertRuntimeSafeGlb(sourceGlb),
      sizeBytes: statSync(sourceGlb).size,
      alreadyRuntimeSafe: true
    };

    warnings.push("El GLB ya era runtime-safe. No se modificó el archivo.");
  } catch {
    try {
      const originalGltf = readGlbJson(sourceGlb);

      before = {
        asset: originalGltf.asset ?? null,
        extensions: getExtensions(originalGltf),
        sizeBytes: statSync(sourceGlb).size,
        alreadyRuntimeSafe: false
      };

      copyFileSync(sourceGlb, backupGlb);

      rmSync(tempGlb, {
        force: true
      });

      execFileSync(gltfTransformBin, ["copy", sourceGlb, tempGlb], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      });

      after = {
        ...assertRuntimeSafeGlb(tempGlb),
        sizeBytes: statSync(tempGlb).size
      };

      renameSync(tempGlb, sourceGlb);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      rmSync(tempGlb, {
        force: true
      });
    }
  }
}

const status = errors.length === 0 ? "passed" : "failed";

writeFileSync(
  reportPath,
  JSON.stringify(
    {
      phase: "6",
      check: "glb-runtime-repair",
      status,
      sourceGlb,
      backupGlb: existsSync(backupGlb) ? backupGlb : null,
      before,
      after,
      warningCount: warnings.length,
      errorCount: errors.length,
      warnings,
      errors,
      generatedAt: new Date().toISOString()
    },
    null,
    2
  ),
  "utf8"
);

if (errors.length > 0) {
  console.error("Errores repair GLB Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("GLB Fase 6 reparado o ya runtime-safe.");