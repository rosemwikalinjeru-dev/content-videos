// Shared scene-file parser. Used by generate-voiceover.mjs and build-scenes.mjs.
import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";

// "# scene-id" or "# scene-id | v3"
const HEADER = /^#\s*([a-z0-9][a-z0-9-_]*)\s*(?:\|\s*(v2|v3))?\s*$/i;

export function videoNameFromPath(path) {
  return basename(path, extname(path));
}

export function parseScenes(path) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const scenes = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(HEADER);
    if (m) {
      if (current) scenes.push(current);
      current = { id: m[1], version: (m[2] || "v2").toLowerCase(), lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) scenes.push(current);

  const ids = new Set();
  return scenes.map((s) => {
    if (ids.has(s.id)) throw new Error(`Duplicate scene id "${s.id}" in ${path}`);
    ids.add(s.id);
    const text = s.lines.join(" ").replace(/\s+/g, " ").trim();
    if (!text) throw new Error(`Scene "${s.id}" has no text`);
    return { id: s.id, version: s.version, text };
  });
}

// Words a viewer should see in captions: v3 tags like [pause] are dropped.
export function captionWords(text) {
  return text
    .replace(/\[[^\]]*\]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w && !/^[.…]+$/.test(w));
}
