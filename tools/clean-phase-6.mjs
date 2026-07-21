import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const artifactRoot = "qa-artifacts/performance/phase-6";
const preservedArtifactNames = [
  "glb-repair-report.json",
  "iocode_solutions_logo_extruded_3d.before-alpha-repair.glb"
];

const preservedArtifacts = preservedArtifactNames
  .map((name) => ({
    name,
    path: join(artifactRoot, name)
  }))
  .filter(({ path }) => existsSync(path))
  .map(({ name, path }) => ({
    name,
    content: readFileSync(path)
  }));

rmSync(artifactRoot, {
  recursive: true,
  force: true
});

mkdirSync(artifactRoot, {
  recursive: true
});

for (const artifact of preservedArtifacts) {
  writeFileSync(join(artifactRoot, artifact.name), artifact.content);
}

console.log(
  `qa-artifacts/performance/phase-6 limpiado; ${preservedArtifacts.length} evidencia(s) de preparación GLB preservada(s).`
);
