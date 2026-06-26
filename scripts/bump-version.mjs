import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const versionPath = path.join(root, "version.json");
const data = JSON.parse(readFileSync(versionPath, "utf8"));

const parts = String(data.version).split(".").map(Number);
if (parts.length !== 3 || parts.some(Number.isNaN)) {
  throw new Error(`Invalid version in version.json: ${data.version}`);
}

const [major, minor, patch] = parts;
data.version = `${major}.${minor}.${patch + 1}`;

writeFileSync(versionPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`App version bumped to ${data.version}`);
