import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Word } from "../lib/timing";

export const C = {
  ground: "#0b1020",
  panel: "#141b31",
  panel2: "#1c2542",
  line: "#2b3660",
  ink: "#f4f6fb",
  muted: "#9aa5c4",
  accent: "#FFD84D",
  ok: "#3ddc97",
  bad: "#ff5a5f",
  blue: "#5b8cff",
};
export const FONT = "Inter, sans-serif";
export const MONO = "'JetBrains Mono', monospace";

// Vertical safe zone: nothing important in the bottom 250px or right 120px.
export const SAFE = { left: 70, right: 120 + 30, top: 140, bottom: 250 };
export const CAPTION_TOP = 1380; // captions live in 1380–1640, above the bottom safe zone

// ---------- word beats ----------
// Each scene gets its voiceover word timings, so animations land on the spoken word
// (from the manifest captions, or the preview estimate).
export const SceneWords = React.createContext<Word[]>([]);

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9½]/g, "");

/** Frame (within the scene) where `word` is first spoken, minus a small lead. */
export function useBeat(word: string, fallback = 0, lead = 4): number {
  const words = React.useContext(SceneWords);
  const { fps } = useVideoConfig();
  const target = norm(word);
  const hit = words.find((w) => norm(w.text) === target);
  return hit ? Math.max(0, Math.round(hit.start * fps) - lead) : fallback;
}

// Spoken spellings -> on-screen text ("A-I" -> "AI", "A-P-I" -> "API", "G-P-T" -> "GPT").
export const displayWord = (w: string) => w.replace(/\b([A-Z])((?:-[A-Z])+)\b/g, (m) => m.replace(/-/g, ""));

// ---------- motion helpers ----------
export function useIn(delay = 0, config = { damping: 18, stiffness: 140, mass: 0.8 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
}

export const Rise: React.FC<{
  delay?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, y = 60, children, style }) => {
  const p = useIn(delay);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * y}px)`, ...style }}>{children}</div>
  );
};

export const Pop: React.FC<{
  delay?: number;
  rotate?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, rotate = 0, children, style }) => {
  const p = useIn(delay, { damping: 11, stiffness: 160, mass: 0.7 });
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${0.4 + p * 0.6}) rotate(${(1 - p) * rotate * 3 + rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export function useCount(to: number, delay: number, frames = 24) {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, frames], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
}

// ---------- background ----------
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.4) % 80;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line}33 2px, transparent 2px), linear-gradient(90deg, ${C.line}33 2px, transparent 2px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${drift}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 700px at 20% 15%, ${C.blue}22, transparent 70%), radial-gradient(800px 700px at 85% 70%, ${C.accent}14, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- source card ----------
export const SourceCard: React.FC<{ text: string; delay?: number; top?: number }> = ({
  text,
  delay = 8,
  top = 1250,
}) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 22px",
        borderRadius: 14,
        background: "#000a",
        border: `2px solid ${C.line}`,
        font: `600 30px/1 ${FONT}`,
        color: C.muted,
      }}
    >
      <span style={{ font: `700 24px/1 ${MONO}`, color: C.ground, background: C.muted, padding: "6px 10px", borderRadius: 6 }}>
        SOURCE
      </span>
      <span style={{ color: C.ink }}>{text}</span>
    </div>
  );
};

// ---------- captions: 4 words per chunk, active word #FFD84D ----------
export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!words.length) return null;

  const chunks: Word[][] = [];
  for (let i = 0; i < words.length; i += 4) chunks.push(words.slice(i, i + 4));

  let idx = chunks.findIndex((c) => t < c[c.length - 1].end + 0.05);
  if (idx === -1) idx = chunks.length - 1;
  const chunk = chunks[idx];
  if (t < chunk[0].start - 0.15 && idx === 0) return null;

  const chunkStartFrame = Math.round(chunk[0].start * fps);
  const p = spring({ frame: frame - chunkStartFrame + 3, fps, config: { damping: 14, stiffness: 220 } });

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        top: CAPTION_TOP,
        height: 1920 - SAFE.bottom - CAPTION_TOP,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 22px",
          transform: `scale(${0.9 + p * 0.1})`,
          opacity: Math.min(1, p * 2),
          textAlign: "center",
        }}
      >
        {chunk.map((w, i) => {
          const active = t >= w.start - 0.02 && t < w.end + 0.08;
          return (
            <span
              key={i}
              style={{
                font: `900 74px/1.15 ${FONT}`,
                color: active ? C.accent : C.ink,
                textShadow: "0 4px 0 #000, 0 0 24px #000c, 0 0 6px #000",
                WebkitTextStroke: "2px #000",
                paintOrder: "stroke fill",
                transform: active ? "translateY(-4px)" : undefined,
              }}
            >
              {displayWord(w.text)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- chrome ----------
export const ProgressBar: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: "100%", background: "#ffffff14" }}>
      <div style={{ height: "100%", width: `${(frame / total) * 100}%`, background: C.accent }} />
    </div>
  );
};

export const PreviewBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      top: 50,
      padding: "10px 18px",
      borderRadius: 10,
      background: C.bad,
      color: "#fff",
      font: `700 26px/1 ${MONO}`,
      letterSpacing: "0.08em",
    }}
  >
    PREVIEW · NO VOICEOVER · ESTIMATED TIMING
  </div>
);

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> = ({
  children,
  color = C.accent,
  delay = 0,
}) => (
  <Rise delay={delay} y={30}>
    <div
      style={{
        display: "inline-block",
        font: `700 30px/1 ${MONO}`,
        letterSpacing: "0.12em",
        color: C.ground,
        background: color,
        padding: "10px 16px",
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  </Rise>
);
