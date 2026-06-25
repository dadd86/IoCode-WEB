import { rmSync } from "node:fs";

rmSync("qa-artifacts/seo/phase-1-1c", {
  recursive: true,
  force: true
});

rmSync("qa-artifacts/lighthouse", {
  recursive: true,
  force: true
});

rmSync("qa-artifacts/lighthouse-summary.json", {
  force: true
});

console.log("qa-artifacts/seo/phase-1-1c limpiado.");
console.log("qa-artifacts/lighthouse limpiado.");
console.log("qa-artifacts/lighthouse-summary.json eliminado.");