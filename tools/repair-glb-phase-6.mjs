import sharp from "sharp";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const sourceLogoPng = "public/logo/iocode-logo.png";
const outputGlb = "public/logo/3d/iocode_solutions_logo_extruded_3d.glb";
const backupGlb = join(
  artifactRoot,
  "iocode_solutions_logo_extruded_3d.before-billboard-rebuild.glb"
);
const reportPath = join(artifactRoot, "glb-repair-report.json");

const errors = [];
const warnings = [];

const JSON_CHUNK = 0x4e4f534a;
const BIN_CHUNK = 0x004e4942;
const GLB_MAGIC = 0x46546c67;

function sha256Buffer(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function sha256File(path) {
  return sha256Buffer(readFileSync(path));
}

function padBuffer(buffer, padByte = 0x00) {
  const padding = (4 - (buffer.length % 4)) % 4;

  if (padding === 0) {
    return buffer;
  }

  return Buffer.concat([buffer, Buffer.alloc(padding, padByte)]);
}

async function getAlphaStats(pngBuffer) {
  const { data, info } = await sharp(pngBuffer)
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

function writeGlb(path, gltf, bin) {
  const jsonBuffer = padBuffer(Buffer.from(JSON.stringify(gltf), "utf8"), 0x20);
  const binBuffer = padBuffer(bin, 0x00);
  const totalLength = 12 + 8 + jsonBuffer.length + 8 + binBuffer.length;
  const output = Buffer.alloc(totalLength);

  let offset = 0;

  output.writeUInt32LE(GLB_MAGIC, offset);
  offset += 4;
  output.writeUInt32LE(2, offset);
  offset += 4;
  output.writeUInt32LE(totalLength, offset);
  offset += 4;

  output.writeUInt32LE(jsonBuffer.length, offset);
  offset += 4;
  output.writeUInt32LE(JSON_CHUNK, offset);
  offset += 4;
  jsonBuffer.copy(output, offset);
  offset += jsonBuffer.length;

  output.writeUInt32LE(binBuffer.length, offset);
  offset += 4;
  output.writeUInt32LE(BIN_CHUNK, offset);
  offset += 4;
  binBuffer.copy(output, offset);

  writeFileSync(path, output);
}

function float32Buffer(values) {
  const buffer = Buffer.alloc(values.length * 4);

  values.forEach((value, index) => {
    buffer.writeFloatLE(value, index * 4);
  });

  return buffer;
}

function uint16Buffer(values) {
  const buffer = Buffer.alloc(values.length * 2);

  values.forEach((value, index) => {
    buffer.writeUInt16LE(value, index * 2);
  });

  return buffer;
}

mkdirSync(artifactRoot, {
  recursive: true
});

mkdirSync("public/logo/3d", {
  recursive: true
});

let before = null;
let after = null;
let sourceAlpha = null;

try {
  if (!existsSync(sourceLogoPng)) {
    throw new Error(`${sourceLogoPng}: no existe.`);
  }

  if (existsSync(outputGlb) && !existsSync(backupGlb)) {
    copyFileSync(outputGlb, backupGlb);
  }

  const sourcePng = await sharp(sourceLogoPng)
    .ensureAlpha()
    .resize({
      width: 512,
      height: 512,
      fit: "contain",
      background: {
        r: 0,
        g: 0,
        b: 0,
        alpha: 0
      }
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: false
    })
    .toBuffer();

  sourceAlpha = await getAlphaStats(sourcePng);

  if (!sourceAlpha.hasTransparency) {
    throw new Error(`${sourceLogoPng}: la imagen fuente no conserva alpha.`);
  }

  before = existsSync(outputGlb)
    ? {
        file: outputGlb,
        sizeBytes: statSync(outputGlb).size,
        sha256: sha256File(outputGlb)
      }
    : null;

  const imageBuffer = padBuffer(sourcePng, 0x00);

  const half = 2.1;

  const positions = float32Buffer([
    -half, -half, 0,
     half, -half, 0,
     half,  half, 0,
    -half,  half, 0
  ]);

  const uvs = float32Buffer([
    0, 1,
    1, 1,
    1, 0,
    0, 0
  ]);

  const indices = uint16Buffer([0, 1, 2, 0, 2, 3]);

  const imageOffset = 0;
  const positionsOffset = imageOffset + imageBuffer.length;
  const positionsPadded = padBuffer(positions, 0x00);
  const uvsOffset = positionsOffset + positionsPadded.length;
  const uvsPadded = padBuffer(uvs, 0x00);
  const indicesOffset = uvsOffset + uvsPadded.length;
  const indicesPadded = padBuffer(indices, 0x00);

  const bin = Buffer.concat([
    imageBuffer,
    positionsPadded,
    uvsPadded,
    indicesPadded
  ]);

  const gltf = {
    asset: {
      version: "2.0",
      generator: "IoCode Phase 6 alpha-safe billboard generator"
    },
    extras: {
      iocodePhase6LogoMode: "alpha-safe-billboard",
      source: sourceLogoPng,
      sourceSha256: sha256Buffer(sourcePng)
    },
    scenes: [
      {
        nodes: [0]
      }
    ],
    scene: 0,
    nodes: [
      {
        name: "IoCodeLogoAlphaSafeBillboard",
        mesh: 0
      }
    ],
    meshes: [
      {
        name: "iocode_logo_alpha_safe_billboard",
        primitives: [
          {
            attributes: {
              POSITION: 0,
              TEXCOORD_0: 1
            },
            indices: 2,
            material: 0,
            mode: 4
          }
        ]
      }
    ],
    materials: [
      {
        name: "IoCodeLogoAlphaSafeMaterial",
        alphaMode: "BLEND",
        doubleSided: false,
        pbrMetallicRoughness: {
          baseColorTexture: {
            index: 0
          },
          metallicFactor: 0,
          roughnessFactor: 0.55
        },
        emissiveTexture: {
          index: 0
        },
        emissiveFactor: [0.18, 0.18, 0.18]
      }
    ],
    textures: [
      {
        sampler: 0,
        source: 0
      }
    ],
    samplers: [
      {
        magFilter: 9729,
        minFilter: 9987,
        wrapS: 33071,
        wrapT: 33071
      }
    ],
    images: [
      {
        mimeType: "image/png",
        bufferView: 0
      }
    ],
    buffers: [
      {
        byteLength: bin.length
      }
    ],
    bufferViews: [
      {
        buffer: 0,
        byteOffset: imageOffset,
        byteLength: sourcePng.length
      },
      {
        buffer: 0,
        byteOffset: positionsOffset,
        byteLength: positions.length,
        target: 34962
      },
      {
        buffer: 0,
        byteOffset: uvsOffset,
        byteLength: uvs.length,
        target: 34962
      },
      {
        buffer: 0,
        byteOffset: indicesOffset,
        byteLength: indices.length,
        target: 34963
      }
    ],
    accessors: [
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: 5126,
        count: 4,
        type: "VEC3",
        min: [-half, -half, 0],
        max: [half, half, 0]
      },
      {
        bufferView: 2,
        byteOffset: 0,
        componentType: 5126,
        count: 4,
        type: "VEC2",
        min: [0, 0],
        max: [1, 1]
      },
      {
        bufferView: 3,
        byteOffset: 0,
        componentType: 5123,
        count: 6,
        type: "SCALAR",
        min: [0],
        max: [3]
      }
    ]
  };

  writeGlb(outputGlb, gltf, bin);

  after = {
    file: outputGlb,
    sizeBytes: statSync(outputGlb).size,
    sha256: sha256File(outputGlb),
    mode: "alpha-safe-billboard",
    meshCount: 1,
    materialCount: 1,
    imageCount: 1,
    alpha: sourceAlpha
  };
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
  rmSync(`${outputGlb}.tmp`, {
    force: true
  });
}

writeFileSync(
  reportPath,
  JSON.stringify(
    {
      phase: "6",
      check: "glb-alpha-safe-billboard-rebuild",
      status: errors.length === 0 ? "passed" : "failed",
      sourceLogoPng,
      outputGlb,
      backupGlb: existsSync(backupGlb) ? backupGlb : null,
      before,
      after,
      sourceAlpha,
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
  console.error("Errores rebuild GLB Fase 6:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("GLB Fase 6 reconstruido como alpha-safe billboard.");