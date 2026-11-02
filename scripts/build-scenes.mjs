// Writes src/generated/<video>.scenes.json from scenes/<video>.txt so the
// Remotion composition always shows the current script text (and can preview
// before any voiceover exists). No API calls, no credits.
//
//   node scripts/build-scenes.mjs scenes/<video>.txt
import { mkdirSync, writeFileSync } from "node:fs";
import { parseScenes, videoNameFromPath } from "./scenes.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/build-scenes.mjs scenes/<video>.txt");
  process.exit(1);
}
const video = videoNameFromPath(file);
const scenes = parseScenes(file);
mkdirSync("src/generated", { recursive: true });
const out = `src/generated/${video}.scenes.json`;
writeFileSync(out, JSON.stringify({ video, scenes }, null, 2) + "\n");
console.log(`Wrote ${out} (${scenes.length} scenes)`);
