import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const TEXT_EXTENSIONS = new Set([
  "", ".astro", ".css", ".env", ".html", ".js", ".json", ".md", ".mjs",
  ".sh", ".svg", ".ts", ".tsx", ".txt", ".yml", ".yaml"
]);
const SCAN_TARGETS = [
  "src", "docs", "config", "tools", "tests", "public", "package.json",
  "compose.yml", "Docker"
];
const SKIPPED_FILES = new Set(["tools/private-denylist.txt"]);
const ALLOWED_POSTAL_CODE = "20459";

const fiscalLabel = ["Steuer", "nummer"].join("");
const fiscalAlternatives = [fiscalLabel, "Steuer-Nr", "St.-Nr", "StNr"].join("|");
const rules = [
  {
    id: "GERMAN_PRIVATE_ADDRESS",
    pattern: new RegExp(
      String.raw`(?:Stra(?:ße|sse)|Str\.?|Weg|Platz|Allee|Gasse|Ring)\s*\d[^\r\n]{0,80}\b(?!${ALLOWED_POSTAL_CODE}\b)\d{5}\b\s+[A-ZÄÖÜ]|\b(?!${ALLOWED_POSTAL_CODE}\b)\d{5}\b\s+[A-ZÄÖÜ][^\r\n]{0,80}(?:Stra(?:ße|sse)|Str\.?|Weg|Platz|Allee|Gasse|Ring)\s*\d`,
      "giu"
    )
  },
  {
    id: "PRIVATE_TAX_IDENTIFIER",
    pattern: new RegExp(String.raw`\b(?:${fiscalAlternatives})\s*:?\s*\d[\d\s/-]{5,}\b`, "giu")
  },
  {
    id: "PERSONAL_EMAIL",
    pattern: /[a-z0-9._%+-]+@(?:gmail\.com|gmx\.[a-z]{2,}|web\.de|outlook\.[a-z]{2,})\b/giu
  },
  { id: "PROVIDER_CUSTOMER_NUMBER", pattern: /\bK\d{10}\b/gu }
];
const legalPdfName = new RegExp(
  String.raw`(?:vollmacht|av[-_ ]?vertrag|dpa|auftragsverarbeitung|gewerbe|steuerbescheid|identity|passport|ausweis)[^\r\n/\\]*\.pdf\b`,
  "giu"
);
const ipv4 = /\b(?:\d{1,3}\.){3}\d{1,3}\b/gu;

function validIpv4(value) {
  return value.split(".").every((part) => Number(part) >= 0 && Number(part) <= 255);
}

function allowedIpv4(value, context, file) {
  const octets = value.split(".").map(Number);
  if (value === "0.0.0.0" || value === "255.255.255.255") return true;
  if (octets[0] === 127) return true;
  if (octets[0] === 192 && octets[1] === 0 && octets[2] === 2) return true;
  if (octets[0] === 198 && octets[1] === 51 && octets[2] === 100) return true;
  if (octets[0] === 203 && octets[1] === 0 && octets[2] === 113) return true;
  if (octets[0] === 0 && /(?:versi[oó]n|version|dependencia|dependency|package|three|semver)/iu.test(context)) return true;
  if (/^dist\/_astro\/.*\.js$/u.test(file) && !/(?:https?|host|server|endpoint|origin|address|\bip\b|dns|ssh)/iu.test(context)) return true;
  return false;
}

export function scanText(content, file = "fixture.txt") {
  const findings = [];
  for (const rule of rules) {
    rule.pattern.lastIndex = 0;
    for (const match of content.matchAll(rule.pattern)) {
      findings.push({ id: rule.id, file, index: match.index ?? 0 });
    }
  }

  legalPdfName.lastIndex = 0;
  for (const match of content.matchAll(legalPdfName)) {
    findings.push({ id: "PRIVATE_LEGAL_PDF", file, index: match.index ?? 0 });
  }

  ipv4.lastIndex = 0;
  for (const match of content.matchAll(ipv4)) {
    const value = match[0];
    const index = match.index ?? 0;
    const context = content.slice(Math.max(0, index - 50), index + value.length + 50);
    if (validIpv4(value) && !allowedIpv4(value, context, file)) {
      findings.push({ id: "SERVER_IPV4", file, index });
    }
  }
  return findings;
}

async function collectFiles(path) {
  try {
    const info = await stat(path);
    if (info.isFile()) return [path];
    const files = [];
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (["node_modules", ".git", "qa-artifacts"].includes(entry.name)) continue;
      files.push(...(await collectFiles(join(path, entry.name))));
    }
    return files;
  } catch {
    return [];
  }
}

async function readDenylist(root) {
  const injected = process.env.PRIVACY_DENYLIST_CONTENT?.trim() || "";
  if (injected) return injected.split(/\r?\n/u).map((item) => item.trim()).filter(Boolean);
  try {
    return (await readFile(resolve(root, "tools/private-denylist.txt"), "utf8"))
      .split(/\r?\n/u).map((item) => item.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

export async function scanRepository(root = ROOT) {
  const targets = [...SCAN_TARGETS];
  for (const name of [".env.example", ".env.preview.example", ".env.production.example", "dist"]) {
    targets.push(name);
  }
  const paths = (await Promise.all(targets.map((target) => collectFiles(resolve(root, target))))).flat();
  const denylist = await readDenylist(root);
  const findings = [];

  if (process.env.PRIVACY_DENYLIST_REQUIRED === "1" && denylist.length === 0) {
    findings.push({ id: "EXACT_DENYLIST_MISSING", file: "CI", index: 0 });
  }

  for (const path of [...new Set(paths)]) {
    const file = relative(root, path).replaceAll("\\", "/");
    if (SKIPPED_FILES.has(file) || !TEXT_EXTENSIONS.has(extname(path).toLowerCase())) continue;
    const content = await readFile(path, "utf8");
    findings.push(...scanText(content, file));
    for (const token of denylist) {
      let offset = content.indexOf(token);
      while (offset !== -1) {
        findings.push({ id: "EXACT_DENYLIST_MATCH", file, index: offset });
        offset = content.indexOf(token, offset + token.length);
      }
    }
  }
  return findings;
}

async function main() {
  const findings = await scanRepository(resolve(process.argv[2] || ROOT));
  if (findings.length) {
    console.error("Privacy gate: FAILED");
    for (const finding of findings) {
      if (finding.id === "EXACT_DENYLIST_MISSING") {
        console.error("- EXACT_DENYLIST_MISSING: CI requires non-empty PRIVACY_DENYLIST_CONTENT.");
      } else {
        console.error(`- ${finding.id}: ${finding.file}`);
      }
    }
    process.exitCode = 1;
    return;
  }
  console.log("Privacy gate: PASSED (structural patterns and available exact denylist)." );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
