import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const artifactRoot = "qa-artifacts/performance/phase-6";
const glbPath = "public/logo/3d/iocode_solutions_logo_extruded_3d.glb";
const sourceLogoPath = "public/logo/iocode-logo.png";
const errors = [];
const warnings = [];

const maxEmbeddedTextureBytes = Number(
  process.env.PHASE6_MAX_CRITICAL_LOGO_BYTES || "180000"
);
const maxEmbeddedTextureDimension = 512;

function writeArtifact(name, payload) {
  mkdirSync(artifactRoot, { recursive: true });
  writeFileSync(join(artifactRoot, name), JSON.stringify(payload, null, 2), "utf8");
}

function sha256Buffer(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
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

function readGlbChunks(path) {
  const buffer = readFileSync(path);

  if (buffer.toString("utf8", 0, 4) !== "glTF") {
    throw new Error("Archivo GLB inválido: magic header no es glTF.");
  }

  let offset = 12;
  let json = null;
  let bin = null;

  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.readUInt32LE(offset + 4);
    offset += 8;

    const chunk = buffer.subarray(offset, offset + chunkLength);
    offset += chunkLength;

    if (chunkType === 0x4e4f534a) {
      json = JSON.parse(chunk.toString("utf8").replace(/\0+$/g, "").trim());
    }

    if (chunkType === 0x004e4942) {
      bin = Buffer.from(chunk);
    }
  }

  if (!json || !bin) {
    throw new Error("GLB incompleto: faltan chunks JSON o BIN.");
  }

  return {
    json,
    bin
  };
}

async function getImageAlphaStats(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({
      resolveWithObject: true
    });

  let minAlpha = 255;
  let maxAlpha = 0;
  let transparentPixels = 0;
  let translucentPixels = 0;
  let opaquePixels = 0;

  for (let index = 3; index < data.length; index += info.channels) {
    const alpha = data[index];

    minAlpha = Math.min(minAlpha, alpha);
    maxAlpha = Math.max(maxAlpha, alpha);

    if (alpha === 0) {
      transparentPixels += 1;
    } else if (alpha === 255) {
      opaquePixels += 1;
    } else {
      translucentPixels += 1;
    }
  }

  return {
    width: info.width,
    height: info.height,
    channels: info.channels,
    minAlpha,
    maxAlpha,
    transparentPixels,
    translucentPixels,
    opaquePixels,
    totalPixels: info.width * info.height,
    hasTransparency: minAlpha < 255
  };
}

async function inspectEmbeddedImagesAlpha(path) {
  const { json, bin } = readGlbChunks(path);
  const imageReports = [];

  for (const [index, image] of (json.images ?? []).entries()) {
    if (image.bufferView === undefined) {
      imageReports.push({
        index,
        status: "skipped",
        reason: "Imagen no embebida en bufferView."
      });
      continue;
    }

    const view = json.bufferViews?.[image.bufferView];

    if (!view) {
      imageReports.push({
        index,
        status: "failed",
        reason: "bufferView inexistente."
      });
      continue;
    }

    const offset = view.byteOffset ?? 0;
    const imageBuffer = bin.subarray(offset, offset + view.byteLength);
    const alpha = await getImageAlphaStats(imageBuffer);

    imageReports.push({
      index,
      mimeType: image.mimeType ?? null,
      bufferView: image.bufferView,
      byteLength: view.byteLength,
      sha256: sha256Buffer(imageBuffer),
      status: alpha.hasTransparency ? "passed" : "failed",
      alpha
    });
  }

  return imageReports;
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
let embeddedAlphaReports = [];

if (!existsSync(glbPath)) {
  errors.push(`${glbPath}: no existe.`);
} else {
  try {
    stats = statSync(glbPath);
    gltf = readGlbJson(glbPath);

    if (gltf.extras?.iocodePhase6LogoMode !== "alpha-safe-billboard") {
      errors.push(
        "El GLB no fue generado como alpha-safe-billboard por tools/repair-glb-phase-6.mjs. El GLB anterior produce fragmentación visual en Three.js."
      );
    }

    if (gltf.extras?.source !== sourceLogoPath) {
      errors.push(
        `El GLB no declara ${sourceLogoPath} como fuente visual canónica.`
      );
    }

    if ((gltf.meshes?.length ?? 0) !== 1) {
      errors.push(
        `El GLB debe tener exactamente 1 mesh alpha-safe para Fase 6. Actual: ${gltf.meshes?.length ?? 0}.`
      );
    }

    if ((gltf.materials?.length ?? 0) !== 1) {
      errors.push(
        `El GLB debe tener exactamente 1 material alpha-safe. Actual: ${gltf.materials?.length ?? 0}.`
      );
    }

    const material = gltf.materials?.[0];

    if (material?.alphaMode !== "BLEND") {
      errors.push("El material principal del GLB debe usar alphaMode BLEND.");
    }

    if (material?.doubleSided === true) {
      errors.push("El material principal no debe ser doubleSided; causa overdraw y artefactos con alpha.");
    }

    const primitiveCount = (gltf.meshes ?? []).reduce((total, mesh) => {
      return total + (mesh.primitives?.length ?? 0);
    }, 0);

    if (primitiveCount !== 1) {
      errors.push(`El GLB debe tener exactamente 1 primitive. Actual: ${primitiveCount}.`);
    }

    const accessors = gltf.accessors ?? [];
    const positionAccessor = accessors[0];
    const indexAccessor = accessors[2];

    if ((positionAccessor?.count ?? 0) !== 4) {
      errors.push(
        `El GLB alpha-safe debe tener 4 vértices de posición. Actual: ${positionAccessor?.count ?? 0}.`
      );
    }

    if ((indexAccessor?.count ?? 0) !== 6) {
      errors.push(
        `El GLB alpha-safe debe tener 6 índices. Actual: ${indexAccessor?.count ?? 0}.`
      );
    }

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
      errors.push(
        "El GLB contiene cámaras no usadas por el runtime. Ejecuta npm run repair:glb:6 dentro del contenedor assets."
      );
    }

    embeddedAlphaReports = await inspectEmbeddedImagesAlpha(glbPath);

    for (const imageReport of embeddedAlphaReports) {
      if (imageReport.status === "skipped") {
        errors.push(
          `GLB image[${imageReport.index}] no está embebida en el GLB.`
        );
        continue;
      }

      if (imageReport.status === "failed") {
        errors.push(
          `GLB image[${imageReport.index}] no conserva transparencia alpha. Esto causa rectángulo blanco en Three.js. Ejecuta npm run repair:glb:6 dentro del contenedor assets.`
        );
      }

      if (
        imageReport.sha256 !==
        gltf.extras?.sourceSha256
      ) {
        errors.push(
          `GLB image[${imageReport.index}] no coincide con la textura canónica registrada por el generador.`
        );
      }

      if ((imageReport.byteLength ?? 0) > maxEmbeddedTextureBytes) {
        errors.push(
          `GLB image[${imageReport.index}] ${imageReport.byteLength} bytes supera presupuesto ${maxEmbeddedTextureBytes}.`
        );
      }

      if (
        (imageReport.alpha?.width ?? 0) > maxEmbeddedTextureDimension ||
        (imageReport.alpha?.height ?? 0) > maxEmbeddedTextureDimension
      ) {
        errors.push(
          `GLB image[${imageReport.index}] supera ${maxEmbeddedTextureDimension}x${maxEmbeddedTextureDimension}.`
        );
      }
    }

    const texturedMaterialsWithoutAlphaMode = (gltf.materials ?? [])
      .map((material, index) => ({
        index,
        material
      }))
      .filter(({ material }) => {
        const usesTexture =
          material.pbrMetallicRoughness?.baseColorTexture ||
          material.emissiveTexture ||
          material.normalTexture ||
          material.occlusionTexture;

        return usesTexture && !["BLEND", "MASK"].includes(material.alphaMode ?? "OPAQUE");
      });

    for (const { index } of texturedMaterialsWithoutAlphaMode) {
      errors.push(
        `material[${index}] usa textura pero alphaMode no es BLEND/MASK. Esto puede renderizar fondo blanco opaco.`
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

    inspectOutput = JSON.stringify(
      {
        asset: gltf.asset ?? null,
        extensions: {
          used: gltf.extensionsUsed ?? [],
          required: gltf.extensionsRequired ?? []
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
        sizeBytes: stats.size
      },
      null,
      2
    );

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
      embeddedImages: embeddedAlphaReports,
      embeddedTextureBudget: {
        maxBytes: maxEmbeddedTextureBytes,
        maxDimension: maxEmbeddedTextureDimension
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
      warningCount:
        (validatorReport?.issues?.numWarnings ?? 0) +
        (validatorReport?.issues?.numInfos ?? 0),
      errorCount: validatorReport?.issues?.numErrors ?? errors.length,
      warnings: [],
      errors: [],
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
