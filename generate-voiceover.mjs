// ElevenLabs voiceover generator.
//
//   node generate-voiceover.mjs scenes/<video>.txt                       # changed scenes only
//   node generate-voiceover.mjs scenes/<video>.txt --only hook --force   # redo one take
//   node generate-voiceover.mjs scenes/<video>.txt --dry-run             # show what would be generated
//
// Writes public/voiceover/<video>/<scene>.mp3, <scene>.json (word timings) and
// public/voiceover/<video>/manifest.json. Do not hand-edit those files.
//
// The API key is read from ELEVENLABS_API_KEY (environment or .env). It is never printed.
// On an API error the status code and message are shown and the script stops: no retry loop.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { captionWords, parseScenes, videoNameFromPath } from "./scripts/scenes.mjs";

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "B7ZAlMIzX6c9jwjYTxMd";
const MODELS = {
  v2: {
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.05, use_speaker_boost: true },
  },
  v3: {
    model_id: "eleven_v3",
    voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.05 },
  },
};
const API = "https://api.elevenlabs.io/v1";

// ---------- args ----------
const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--only");
const onlyIdx = args.indexOf("--only");
const only = onlyIdx >= 0 ? args[onlyIdx + 1]?.split(",") : null;
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");

if (!file) {
  console.error("Usage: node generate-voiceover.mjs scenes/<video>.txt [--only id[,id]] [--force] [--dry-run]");
  process.exit(1);
}
if (force && !only) {
  console.error("Refusing --force on the whole script. Use --only <scene-id> --force for the scenes that changed.");
  process.exit(1);
}

// ---------- key (never printed) ----------
function loadKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  if (existsSync(".env")) {
    for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*ELEVENLABS_API_KEY\s*=\s*"?([^"\s]+)"?\s*$/);
      if (m) return m[1];
    }
  }
  return null;
}

// ---------- helpers ----------
const hashOf = (scene) =>
  createHash("sha256")
    .update(JSON.stringify({ text: scene.text, voice: VOICE_ID, ...MODELS[scene.version] }))
    .digest("hex")
    .slice(0, 16);

function mp3Duration(path) {
  try {
    const out = execFileSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", path],
      { encoding: "utf8" },
    );
    const d = parseFloat(out.trim());
    return Number.isFinite(d) ? d : null;
  } catch {
    return null;
  }
}

// Character alignment -> words with start/end seconds. v3 tags are dropped.
function wordsFromAlignment(alignment) {
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;
  const words = [];
  let cur = null;
  let inTag = false;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === "[") inTag = true;
    if (inTag) {
      if (c === "]") inTag = false;
      if (cur) { words.push(cur); cur = null; }
      continue;
    }
    if (/\s/.test(c)) {
      if (cur) { words.push(cur); cur = null; }
      continue;
    }
    if (!cur) cur = { text: "", start: starts[i], end: ends[i] };
    cur.text += c;
    cur.end = ends[i];
  }
  if (cur) words.push(cur);
  return words.filter((w) => !/^[.…,]+$/.test(w.text));
}

async function apiError(res) {
  let message = await res.text();
  try {
    const j = JSON.parse(message);
    message = j.detail?.message || j.detail?.status || JSON.stringify(j.detail ?? j);
  } catch {}
  return `ElevenLabs error ${res.status} ${res.statusText}: ${message}`;
}

async function characterCount(key) {
  const res = await fetch(`${API}/user/subscription`, { headers: { "xi-api-key": key } });
  if (!res.ok) return null;
  const j = await res.json();
  return { used: j.character_count, limit: j.character_limit };
}

// ---------- main ----------
const video = videoNameFromPath(file);
const scenes = parseScenes(file);
const outDir = join("public", "voiceover", video);
const manifestPath = join(outDir, "manifest.json");
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : { video, voiceId: VOICE_ID, scenes: [] };
const prev = new Map(manifest.scenes.map((s) => [s.id, s]));

if (only) {
  const unknown = only.filter((id) => !scenes.some((s) => s.id === id));
  if (unknown.length) {
    console.error(`Unknown scene id(s): ${unknown.join(", ")}`);
    process.exit(1);
  }
}

const todo = scenes.filter((s) => {
  if (only && !only.includes(s.id)) return false;
  const p = prev.get(s.id);
  const fresh = p && p.hash === hashOf(s) && existsSync(join(outDir, `${s.id}.mp3`));
  return force || !fresh;
});

const chars = todo.reduce((n, s) => n + s.text.length, 0);
console.log(`${video}: ${scenes.length} scenes, ${todo.length} to generate (~${chars} characters)`);
for (const s of todo) console.log(`  - ${s.id} [${s.version}] ${s.text.length} chars`);
if (dryRun || todo.length === 0) {
  if (todo.length === 0) console.log("Nothing changed. No credits used.");
  process.exit(0);
}

const key = loadKey();
if (!key) {
  console.error("ELEVENLABS_API_KEY is not set (environment or .env).");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const before = await characterCount(key);

for (const scene of todo) {
  const cfg = MODELS[scene.version];
  const res = await fetch(
    `${API}/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text: scene.text, ...cfg }),
    },
  );
  if (!res.ok) {
    console.error(`[${scene.id}] ${await apiError(res)}`);
    if (scene.version === "v3") console.error(`  If this is a timestamp problem, change "# ${scene.id} | v3" to v2.`);
    writeManifest();
    process.exit(1);
  }
  const data = await res.json();
  const mp3 = join(outDir, `${scene.id}.mp3`);
  writeFileSync(mp3, Buffer.from(data.audio_base64, "base64"));

  const alignment = data.alignment || data.normalized_alignment;
  let words = alignment ? wordsFromAlignment(alignment) : [];
  const duration = mp3Duration(mp3) ?? (words.length ? words[words.length - 1].end + 0.2 : null);
  if (!words.length) {
    console.warn(`[${scene.id}] no timestamps returned; captions will be evenly spaced.`);
    const ws = captionWords(scene.text);
    words = ws.map((text, i) => ({ text, start: (i / ws.length) * duration, end: ((i + 1) / ws.length) * duration }));
  }
  writeFileSync(join(outDir, `${scene.id}.json`), JSON.stringify({ id: scene.id, words }, null, 2) + "\n");

  prev.set(scene.id, {
    id: scene.id,
    version: scene.version,
    model: cfg.model_id,
    hash: hashOf(scene),
    audio: `voiceover/${video}/${scene.id}.mp3`,
    captions: `voiceover/${video}/${scene.id}.json`,
    durationInSeconds: Math.round(duration * 1000) / 1000,
    characters: scene.text.length,
  });
  console.log(`  ✓ ${scene.id}  ${duration.toFixed(2)}s`);
}

function writeManifest() {
  manifest.voiceId = VOICE_ID;
  manifest.generatedAt = new Date().toISOString();
  manifest.scenes = scenes.filter((s) => prev.has(s.id)).map((s) => prev.get(s.id));
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}
writeManifest();

const after = await characterCount(key);
if (before && after) {
  console.log(`Credits used: ${after.used - before.used} characters (${after.used}/${after.limit} this period)`);
} else {
  console.log(`Credits used: ~${chars} characters (subscription endpoint unavailable)`);
}
console.log(`Manifest: ${manifestPath}`);
