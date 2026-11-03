// Checks that every `beat` word in src/videos/teardown/specs.ts is actually spoken in
// that scene of scenes/<id>.txt, so no box waits for a word that never comes.
//   node scripts/check-beats.mjs
import { readFileSync } from "node:fs";
import { captionWords, parseScenes } from "./scenes.mjs";

const src = readFileSync("src/videos/teardown/specs.ts", "utf8");
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9½]/g, "");
let problems = 0;

// Split the specs file by video id, then by scene block.
const blocks = src.split(/\n\s*\{\n\s*id: "/).slice(1);
const SCENE_OF = { before: "before", cost: "cost", after: "after", verdict: "verdict" };
for (const block of blocks) {
  const id = block.slice(0, block.indexOf('"'));
  const scenes = Object.fromEntries(parseScenes(`scenes/${id}.txt`).map((s) => [s.id, s]));
  for (const [key, sceneId] of Object.entries(SCENE_OF)) {
    const start = block.indexOf(`\n    ${key}: {`);
    if (start < 0) continue;
    const end = block.indexOf("\n    },", start);
    const part = block.slice(start, end);
    const words = new Set(captionWords(scenes[sceneId]?.text ?? "").map(norm));
    for (const m of part.matchAll(/beat: "([^"]+)"/g)) {
      if (!words.has(norm(m[1]))) {
        console.log(`✗ ${id}/${sceneId}: beat "${m[1]}" is not spoken in that scene`);
        problems++;
      }
    }
  }
}
console.log(problems ? `${problems} problem(s)` : "✓ all beat words are spoken");
process.exit(problems ? 1 : 0);
