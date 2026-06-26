import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../backend/public");

if (existsSync(publicDir)) {
  rmSync(publicDir, { recursive: true, force: true });
}
