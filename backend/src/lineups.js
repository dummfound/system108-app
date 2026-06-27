import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lineupsPath = path.resolve(__dirname, "../data/event-lineups.json");

let cachedLineups = null;

function loadLineups() {
  if (cachedLineups) return cachedLineups;

  try {
    cachedLineups = JSON.parse(readFileSync(lineupsPath, "utf8"));
  } catch {
    cachedLineups = {};
  }

  return cachedLineups;
}

export function getLineupForEvent(slug, fallbackLineup = []) {
  const lineups = loadLineups();
  const stored = lineups[slug];

  if (Array.isArray(stored) && stored.length > 0) {
    return stored.map((name) => String(name).trim()).filter(Boolean);
  }

  return fallbackLineup;
}

export function getAllStoredLineups() {
  return { ...loadLineups() };
}
