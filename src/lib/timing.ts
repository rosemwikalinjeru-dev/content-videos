import { staticFile } from "remotion";

export const FPS = 30;
// Breathing room after each voiceover take, so cuts don't clip the last word.
const TAIL_SECONDS = 0.25;

export type Word = { text: string; start: number; end: number };

export type ScriptScene = { id: string; version: string; text: string };

export type TimedScene = ScriptScene & {
  durationInFrames: number;
  audio: string | null;
  words: Word[];
};

export type VideoProps = {
  video: string;
  preview: boolean;
  scenes: TimedScene[];
};

type ManifestScene = {
  id: string;
  audio: string;
  captions: string;
  durationInSeconds: number;
};

const captionWords = (text: string) =>
  text
    .replace(/\[[^\]]*\]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w && !/^[.…]+$/.test(w));

// Preview only (no voiceover yet): estimate ~2.8 words/second and space words by length.
function estimate(scene: ScriptScene): { seconds: number; words: Word[] } {
  const ws = captionWords(scene.text);
  const pauses = (scene.text.match(/\.\.\.|\[pause\]/g) || []).length * 0.35;
  const seconds = ws.length / 2.8 + pauses;
  const totalChars = ws.reduce((n, w) => n + w.length + 2, 0);
  let t = 0;
  const words = ws.map((text) => {
    const d = ((text.length + 2) / totalChars) * seconds;
    const w = { text, start: t, end: t + d };
    t += d;
    return w;
  });
  return { seconds, words };
}

// Durations come from public/voiceover/<video>/manifest.json (CLAUDE.md rule 7).
// If there is no manifest yet, the composition renders as a clearly marked PREVIEW.
export async function loadTiming(video: string, script: ScriptScene[]): Promise<VideoProps> {
  let manifest: { scenes: ManifestScene[] } | null = null;
  try {
    const res = await fetch(staticFile(`voiceover/${video}/manifest.json`));
    if (res.ok) manifest = await res.json();
  } catch {
    manifest = null;
  }

  const byId = new Map((manifest?.scenes ?? []).map((s) => [s.id, s]));
  const preview = script.some((s) => !byId.has(s.id));

  const scenes = await Promise.all(
    script.map(async (scene): Promise<TimedScene> => {
      const m = byId.get(scene.id);
      if (!preview && m) {
        const cap = await fetch(staticFile(m.captions)).then((r) => r.json());
        return {
          ...scene,
          durationInFrames: Math.ceil((m.durationInSeconds + TAIL_SECONDS) * FPS),
          audio: m.audio,
          words: cap.words,
        };
      }
      const est = estimate(scene);
      return {
        ...scene,
        durationInFrames: Math.ceil((est.seconds + TAIL_SECONDS) * FPS),
        audio: null,
        words: est.words,
      };
    }),
  );

  return { video, preview, scenes };
}
