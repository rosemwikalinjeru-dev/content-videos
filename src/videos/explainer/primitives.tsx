import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background, C, Captions, FONT, MONO, PreviewBadge, SAFE, SceneWords } from "../../components/kit";
import type { TimedScene, VideoProps } from "../../lib/timing";

// Shared building blocks for the explainer formats (split screen, chain reaction, warnings,
// staircase, race, quiz). Each format supplies its own scene visuals keyed by scene id.

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export const Area: React.FC<{ children: React.ReactNode; center?: boolean; style?: React.CSSProperties }> = ({
  children,
  center = true,
  style,
}) => (
  <AbsoluteFill
    style={{
      paddingLeft: SAFE.left,
      paddingRight: SAFE.right,
      top: 140,
      height: 1220,
      justifyContent: center ? "center" : "flex-start",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const H: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 110,
  color = C.ink,
  style,
}) => <div style={{ font: `900 ${size}px/1.04 ${FONT}`, letterSpacing: "-0.04em", color, ...style }}>{children}</div>;

export const Tag: React.FC<{ children: React.ReactNode; color?: string; ink?: string }> = ({
  children,
  color = C.accent,
  ink = C.ground,
}) => (
  <span
    style={{
      display: "inline-block",
      font: `800 30px/1 ${MONO}`,
      letterSpacing: "0.1em",
      color: ink,
      background: color,
      padding: "12px 18px",
      borderRadius: 10,
    }}
  >
    {children}
  </span>
);

/** spring progress from a start frame */
export function useSpring(from: number, config = { damping: 14, stiffness: 160, mass: 0.7 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - from, fps, config });
}

/** a HyperFrames clip, sped up to fit the scene if needed */
export const Clip: React.FC<{ src: string; size: number; startFrame?: number; rate?: number }> = ({
  src,
  size,
  startFrame = 0,
  rate = 1,
}) => {
  const p = useSpring(startFrame);
  return (
    <div style={{ width: size, height: size, borderRadius: 28, overflow: "hidden", opacity: p, alignSelf: "center" }}>
      <Sequence from={startFrame} layout="none">
        <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: size, height: size }} />
      </Sequence>
    </div>
  );
};

/** simple round badge with a glyph (no emoji fonts needed) */
export const Badge: React.FC<{ glyph: string; color: string; size?: number; ink?: string }> = ({
  glyph,
  color,
  size = 96,
  ink = C.ground,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: color,
      color: ink,
      font: `900 ${Math.round(size * 0.55)}px/${size}px ${FONT}`,
      textAlign: "center",
      flexShrink: 0,
    }}
  >
    {glyph}
  </div>
);

export const SeriesCta: React.FC<{ line: string; lineColor?: string; delay?: number }> = ({ line, lineColor = C.ink, delay = 0 }) => {
  const frame = useCurrentFrame();
  const a = useSpring(delay);
  const b = useSpring(delay + 14);
  const pulse = 1 + Math.sin(frame / 6) * 0.025;
  return (
    <Area>
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
        <H size={104} color={lineColor}>
          {line}
        </H>
      </div>
      <div style={{ opacity: b, marginTop: 60, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
        <div
          style={{
            transform: `scale(${pulse})`,
            background: C.accent,
            color: C.ground,
            borderRadius: 999,
            padding: "26px 54px",
            font: `900 64px/1 ${FONT}`,
          }}
        >
          Follow →
        </div>
        <div style={{ font: `800 30px/1.3 ${MONO}`, letterSpacing: "0.06em", color: C.muted }}>
          CAN I AUTOMATE
          <br />
          THIS BUSINESS?
        </div>
      </div>
    </Area>
  );
};

const Shell: React.FC<{ scene: TimedScene; visuals: Record<string, React.FC> }> = ({ scene, visuals }) => {
  const frame = useCurrentFrame();
  const Visual = visuals[scene.id];
  const fade = Math.min(
    interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [scene.durationInFrames - 4, scene.durationInFrames], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fade }}>
        <SceneWords.Provider value={scene.words}>{Visual ? <Visual /> : null}</SceneWords.Provider>
      </AbsoluteFill>
      <Captions words={scene.words} />
      {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
    </AbsoluteFill>
  );
};

export const makeExplainer = (visuals: Record<string, React.FC>): React.FC<VideoProps> => {
  const Comp: React.FC<VideoProps> = ({ scenes, preview }) => {
    let from = 0;
    return (
      <AbsoluteFill>
        <Background />
        {scenes.map((scene) => {
          const seq = (
            <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} name={scene.id}>
              <Shell scene={scene} visuals={visuals} />
            </Sequence>
          );
          from += scene.durationInFrames;
          return seq;
        })}
        {preview ? <PreviewBadge /> : null}
      </AbsoluteFill>
    );
  };
  return Comp;
};

export { C, FONT, MONO, clamp as CLAMP };
export { interpolate, useCurrentFrame };
