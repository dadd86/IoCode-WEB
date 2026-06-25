import { rmSync } from "node:fs";

rmSync("qa-artifacts/visual/phase-1-1b", {
  recursive: true,
  force: true
});

console.log("qa-artifacts/visual/phase-1-1b limpiado.");