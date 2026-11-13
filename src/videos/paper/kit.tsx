import React from "react";
import "@fontsource/archivo/800.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/600.css";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { displayWord, SceneWords } from "../../components/kit";
import type { TimedScene, VideoProps, Word } from "../../lib/timing";

// "Paper" format (after the reference Rose sent, see content-plan/reference-style.md):
// light paper background, kicker + two-tone headline, a presenter in the corner with a small
// caption pill, and one illustrated world in the middle that things physically move through.

export const P = {
  paper: "#f5eee2",
  paper2: "#ebe1d0",
  card: "#fffdf8",
  ink: "#1f1b16",
  soft: "#7a6f60",
  line: "#cdbfa8",
  accent: "#0e7c6b", // Rose's accent: deep teal
  warm: "#e9a23b",
  bad: "#d6452f",
  ok: "#1f9d6b",
  pill: "#221d17",
  hi: "#FFD84D",
};
// Brand typography (locked, see brand/visual-identity.md): Archivo for headlines and big numbers,
// IBM Plex Sans for running text and captions, IBM Plex Mono for labels.
export const PH = "Archivo, sans-serif";
export const PF = "'IBM Plex Sans', sans-serif";
export const PM = "'IBM Plex Mono', monospace";
export const STAGE = { x: 0, y: 370, w: 1080, h: 860 };

export const clampP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeP = (t: number) => 1 - Math.pow(1 - t, 3);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function useSpr(from: number, config = { damping: 14, stiffness: 150, mass: 0.7 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - from, fps, config });
}

// ---------- presenter (a drawn cartoon of the character Rose chose: short dark curls,
// blue plaid overshirt, pink collared shirt. A drawing, never a photo.) ----------
export const Presenter: React.FC<{ pointing: boolean }> = ({ pointing }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 14) * 4;
  const blink = frame % 96 < 4;
  const arm = pointing ? -58 + Math.sin(frame / 9) * 5 : 8;
  const skin = "#8a5a3c";
  const dark = "#1c1512";
  const plaid = "url(#plaid)";
  return (
    <svg width={330} height={440} viewBox="0 0 330 440" style={{ position: "absolute", left: 6, top: 1236 }}>
      <defs>
        <pattern id="plaid" width={44} height={44} patternUnits="userSpaceOnUse">
          <rect width={44} height={44} fill="#4a7cc4" />
          <rect x={0} y={0} width={12} height={44} fill="#eee7d8" opacity={0.85} />
          <rect x={0} y={0} width={44} height={12} fill="#eee7d8" opacity={0.6} />
          <rect x={24} y={0} width={4} height={44} fill="#2c4f8a" />
          <rect x={0} y={24} width={44} height={4} fill="#2c4f8a" />
        </pattern>
      </defs>
      <g transform={`translate(0 ${bob})`}>
        {/* far arm */}
        <rect x={52} y={236} width={44} height={150} rx={22} fill={plaid} stroke="#2c4f8a" strokeWidth={3} />
        {/* pink shirt under the open overshirt */}
        <path d="M112 440 L112 214 L218 214 L218 440 Z" fill="#f6c3d0" />
        <line x1={165} y1={250} x2={165} y2={440} stroke="#e39db0" strokeWidth={3} />
        {[282, 330, 378].map((y) => (
          <circle key={y} cx={165} cy={y} r={5} fill="#fff" stroke="#e39db0" strokeWidth={2} />
        ))}
        {/* plaid overshirt, open at the front */}
        <path d="M70 440 L70 270 Q70 214 128 208 L146 440 Z" fill={plaid} stroke="#2c4f8a" strokeWidth={3} />
        <path d="M260 440 L260 270 Q260 214 202 208 L184 440 Z" fill={plaid} stroke="#2c4f8a" strokeWidth={3} />
        {/* overshirt collar */}
        <path d="M128 206 L100 236 L138 262 L150 214 Z" fill={plaid} stroke="#2c4f8a" strokeWidth={3} />
        <path d="M202 206 L230 236 L192 262 L180 214 Z" fill={plaid} stroke="#2c4f8a" strokeWidth={3} />
        {/* neck + pink shirt collar */}
        <rect x={146} y={176} width={38} height={46} rx={14} fill={skin} />
        <path d="M140 210 L165 250 L150 258 L130 222 Z" fill="#f9d3dc" stroke="#e39db0" strokeWidth={2} />
        <path d="M190 210 L165 250 L180 258 L200 222 Z" fill="#f9d3dc" stroke="#e39db0" strokeWidth={2} />
        {/* ears + head */}
        <ellipse cx={99} cy={130} rx={12} ry={20} fill={skin} />
        <ellipse cx={231} cy={130} rx={12} ry={20} fill={skin} />
        <ellipse cx={165} cy={124} rx={62} ry={70} fill={skin} />
        {/* short dark curls */}
        <path d="M103 112 Q96 40 165 36 Q234 40 227 112 Q216 74 165 72 Q114 74 103 112 Z" fill={dark} />
        {[108, 126, 146, 166, 186, 206, 222].map((x, i) => (
          <circle key={x} cx={x} cy={i === 0 || i === 6 ? 62 : i === 1 || i === 5 ? 46 : 38} r={13} fill={dark} />
        ))}
        {/* face */}
        <path d="M132 108 Q146 100 158 108" stroke={dark} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M174 108 Q186 100 200 108" stroke={dark} strokeWidth={4} fill="none" strokeLinecap="round" />
        {blink ? (
          <>
            <rect x={136} y={126} width={18} height={4} rx={2} fill={dark} />
            <rect x={178} y={126} width={18} height={4} rx={2} fill={dark} />
          </>
        ) : (
          <>
            <circle cx={145} cy={128} r={6.5} fill={dark} />
            <circle cx={187} cy={128} r={6.5} fill={dark} />
          </>
        )}
        <path d="M142 156 Q165 174 190 154" stroke={dark} strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* near arm (gestures), sleeve rolled */}
        <g transform={`rotate(${arm} 246 250)`}>
          <rect x={226} y={236} width={44} height={120} rx={22} fill={plaid} stroke="#2c4f8a" strokeWidth={3} />
          <rect x={232} y={340} width={32} height={40} rx={14} fill={skin} />
          <circle cx={248} cy={392} r={22} fill={skin} />
        </g>
      </g>
    </svg>
  );
};

// ---------- caption pill: 3 words, active word highlighted ----------
export const CaptionPill: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!words.length) return null;
  const chunks: Word[][] = [];
  for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3));
  let idx = chunks.findIndex((c) => t < c[c.length - 1].end + 0.05);
  if (idx === -1) idx = chunks.length - 1;
  const chunk = chunks[idx];
  return (
    <div style={{ position: "absolute", left: 350, top: 1404, right: 150, display: "flex" }}>
      <div style={{ background: P.pill, borderRadius: 22, padding: "20px 28px", display: "flex", gap: 14, flexWrap: "wrap", boxShadow: "0 8px 0 #0002" }}>
        {chunk.map((w, i) => {
          const active = t >= w.start - 0.02 && t < w.end + 0.08;
          return (
            <span key={i} style={{ font: `700 52px/1.1 ${PF}`, color: active ? P.hi : "#fff" }}>
              {displayWord(w.text)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- kicker + two-tone headline ----------
export const Headline: React.FC<{ kicker: string; head: string; accent: string; bad?: boolean }> = ({ kicker, head, accent, bad }) => {
  const p = useSpr(0);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 130, opacity: p, transform: `translateY(${(1 - p) * -16}px)` }}>
      <div style={{ font: `600 28px/1 ${PM}`, letterSpacing: "0.16em", color: bad ? P.bad : P.accent }}>{kicker}</div>
      <div style={{ font: `800 86px/1.0 ${PH}`, letterSpacing: "-0.02em", color: P.ink, marginTop: 14, textTransform: "uppercase" }}>
        {head} <span style={{ color: bad ? P.bad : P.accent }}>{accent}</span>
      </div>
    </div>
  );
};

const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: P.paper }}>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${P.line}55 2px, transparent 2px)`,
        backgroundSize: "36px 36px",
        opacity: 0.5,
      }}
    />
  </AbsoluteFill>
);

export type PaperScene = { kicker: string; head: string; accent: string; bad?: boolean; point?: boolean; Stage: React.FC };

const Shell: React.FC<{ scene: TimedScene; spec?: PaperScene; index: number }> = ({ scene, spec, index }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(
    interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [scene.durationInFrames - 3, scene.durationInFrames], [1, 0.0], { extrapolateLeft: "clamp" }),
  );
  return (
    <AbsoluteFill>
      {spec && (
        <>
          <Headline kicker={spec.kicker} head={spec.head} accent={spec.accent} bad={spec.bad} />
          <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, opacity: fade }}>
            <SceneWords.Provider value={scene.words}>
              <spec.Stage />
            </SceneWords.Provider>
          </div>
        </>
      )}
      <Presenter pointing={spec?.point ?? index % 2 === 0} />
      <CaptionPill words={scene.words} />
      {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
    </AbsoluteFill>
  );
};

export const makePaper = (specs: Record<string, PaperScene>): React.FC<VideoProps> => {
  const Comp: React.FC<VideoProps> = ({ scenes, preview }) => {
    let from = 0;
    return (
      <AbsoluteFill style={{ fontFamily: PF }}>
        <PaperBg />
        {scenes.map((scene, i) => {
          const seq = (
            <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} name={scene.id}>
              <Shell scene={scene} spec={specs[scene.id]} index={i} />
            </Sequence>
          );
          from += scene.durationInFrames;
          return seq;
        })}
        {preview ? (
          <div style={{ position: "absolute", left: 60, top: 60, background: P.bad, color: "#fff", borderRadius: 10, padding: "10px 16px", font: `600 24px/1 ${PM}`, letterSpacing: "0.06em" }}>
            PREVIEW · NO VOICE · ESTIMATED TIMING
          </div>
        ) : null}
      </AbsoluteFill>
    );
  };
  return Comp;
};

// ---------- world pieces ----------
export const Desk: React.FC<{ x: number; y: number; label: string; color?: string; sign?: string; w?: number; dim?: boolean }> = ({
  x,
  y,
  label,
  color = P.ink,
  sign,
  w = 270,
  dim,
}) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - 60, width: w, opacity: dim ? 0.4 : 1 }}>
    <div style={{ textAlign: "center", marginBottom: 10 }}>
      <span style={{ background: color, color: "#fff", borderRadius: 999, padding: "8px 20px", font: `800 32px/1 ${PH}`, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{label}</span>
    </div>
    <div style={{ height: 150, borderRadius: 22, background: P.paper2, border: `5px solid ${P.ink}`, boxShadow: `0 10px 0 ${P.line}` }} />
    <div style={{ margin: "0 auto", width: 44, height: 46, background: P.paper2, borderLeft: `5px solid ${P.ink}`, borderRight: `5px solid ${P.ink}` }} />
    <div style={{ margin: "0 auto", width: w * 0.62, height: 24, borderRadius: 14, background: P.paper2, border: `5px solid ${P.ink}` }} />
    {sign && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center" }}>
        <span style={{ background: P.bad, color: "#fff", borderRadius: 10, padding: "8px 12px", font: `600 24px/1 ${PM}` }}>{sign}</span>
      </div>
    )}
  </div>
);

export const Card: React.FC<{ x: number; y: number; text: string; state?: "new" | "wait" | "done"; scale?: number; rot?: number }> = ({
  x,
  y,
  text,
  state = "new",
  scale = 1,
  rot = 0,
}) => {
  const border = state === "wait" ? P.bad : state === "done" ? P.ok : P.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 78,
        top: y - 48,
        width: 156,
        height: 96,
        borderRadius: 12,
        background: P.card,
        border: `4px solid ${border}`,
        boxShadow: "0 5px 0 #0002",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        font: `700 25px/1.05 ${PF}`,
        color: P.ink,
        transform: `scale(${scale}) rotate(${rot}deg)`,
      }}
    >
      {text}
      {state === "done" && (
        <span style={{ position: "absolute", right: -12, top: -14, width: 34, height: 34, borderRadius: 99, background: P.ok, color: "#fff", font: `800 22px/34px ${PH}` }}>✓</span>
      )}
    </div>
  );
};

export const Counter: React.FC<{ x: number; y: number; label: string; value: string | number; color: string }> = ({ x, y, label, value, color }) => (
  <div style={{ position: "absolute", left: x - 120, top: y, width: 240, textAlign: "center", background: P.card, border: `4px solid ${color}`, borderRadius: 18, padding: "10px 6px" }}>
    <div style={{ font: `600 26px/1 ${PM}`, letterSpacing: "0.06em", color: P.soft }}>{label}</div>
    <div style={{ font: `800 60px/1.05 ${PH}`, color }}>{value}</div>
  </div>
);

export const Note: React.FC<{ children: React.ReactNode; x: number; y: number; w?: number; color?: string }> = ({ children, x, y, w = 700, color = P.ink }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, background: P.card, border: `5px solid ${color}`, borderRadius: 22, padding: "24px 28px", boxShadow: `0 10px 0 ${P.line}` }}>{children}</div>
);

export const DemoTag: React.FC<{ text?: string }> = ({ text = "DEMO · NOT REAL DATA" }) => (
  <div style={{ position: "absolute", right: 60, bottom: 6, font: `600 22px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>{text}</div>
);
