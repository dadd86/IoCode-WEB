import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function getSize(path) {
  const stat = statSync(path);

  if (stat.isFile()) {
    return stat.size;
  }

  if (!stat.isDirectory()) {
    return 0;
  }

  return readdirSync(path).reduce((total, entry) => {
    return total + getSize(join(path, entry));
  }, 0);
}

function format(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(1)} ${units[index]}`;
}

const entries = readdirSync(".")
  .map((entry) => ({
    entry,
    size: getSize(entry)
  }))
  .sort((a, b) => b.size - a.size);

for (const item of entries) {
  console.log(`${format(item.size).padStart(10)}  ${item.entry}`);
}