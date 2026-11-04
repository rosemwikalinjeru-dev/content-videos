import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Background,
  C,
  Captions,
  FONT,
  MONO,
  Pop,
  PreviewBadge,
  Rise,
  SAFE,
  SceneWords,
  useBeat,
  useIn,
} from "../../components/kit";
import { IndustryArt, Industry } from "../../components/industry/IndustryArt";
import type { TimedScene, VideoProps } from "../../lib/timing";

// Ep 00: series trailer for "Can I Automate This Business?". Every beat lands on a spoken word.

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ paddingLeft: SAFE.left, paddingRight: SAFE.right, top: 140, height: 1200, justifyContent: "center" }}>
    {children}
  </AbsoluteFill>
);

const H: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 120,
  color = C.ink,
  style,
}) => <div style={{ font: `900 ${size}px/1.04 ${FONT}`, letterSpacing: "-0.04em", color, ...style }}>{children}</div>;

const Tag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.accent }) => (
  <span
    style={{
      display: "inline-block",
      font: `800 32px/1 ${MONO}`,
      letterSpacing: "0.1em",
      color: C.ground,
      background: color,
      padding: "12px 18px",
      borderRadius: 10,
    }}
  >
    {children}
  </span>
);

// 1 — hook
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const more = useBeat("more", 50);
  const they = useBeat("they", 90);
  const strike = interpolate(frame, [more + 6, more + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Center>
      <Rise>
        <Tag>EP 00 · THE SERIES</Tag>
      </Rise>
      <Rise delay={4} style={{ marginTop: 40 }}>
        <H size={112}>Most small businesses don't need</H>
      </Rise>
      <Rise delay={more - 4}>
        <div style={{ position: "relative", display: "inline-block", marginTop: 10 }}>
          <H size={140} color={C.muted}>
            more AI.
          </H>
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "52%",
              height: 16,
              width: `${strike * 105}%`,
              background: C.bad,
              borderRadius: 8,
            }}
          />
        </div>
      </Rise>
      <Pop delay={they} style={{ marginTop: 50 }}>
        <H size={104} color={C.accent}>
          One broken process, fixed.
        </H>
      </Pop>
    </Center>
  );
};

// 2 — promise: the industries cut in as they're named
const ALL: Industry[] = ["roofing", "dental", "salon", "hvac", "law", "landscaping", "plumbing", "cleaning", "bookkeeping"];
const Promise_: React.FC = () => {
  const frame = useCurrentFrame();
  const roofer = useBeat("roofer", 80, 2);
  const dental = useBeat("dental", 110, 2);
  const salon = useBeat("salon", 140, 2);
  const cracks = useBeat("cracks", 220, 2);
  const kind = useBeat("kind", 40);
  // before "roofer": a grid of businesses; then one big scene per named business
  const big: Industry | null = frame >= salon ? "salon" : frame >= dental ? "dental" : frame >= roofer ? "roofing" : null;
  const bigIn = useIn(roofer);
  return (
    <AbsoluteFill style={{ top: 140, height: 1200, alignItems: "center", justifyContent: "center" }}>
      {big === null ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 280px)", gap: 18 }}>
          {ALL.map((k, i) => (
            <Pop key={k} delay={Math.min(kind, 4) + i * 2}>
              <IndustryArt industry={k} width={280} />
            </Pop>
          ))}
        </div>
      ) : (
        <div style={{ position: "relative", opacity: bigIn }}>
          <IndustryArt industry={big} width={900} mood={frame >= cracks ? "problem" : "neutral"} />
          <div style={{ position: "absolute", left: 28, top: 26 }}>
            <Tag>{big === "roofing" ? "A ROOFER" : big === "dental" ? "A DENTAL OFFICE" : "A SALON"}</Tag>
          </div>
          {frame >= cracks && (
            <Pop delay={cracks} style={{ marginTop: 40, textAlign: "center" }}>
              <H size={84} color={C.bad}>
                Where customers fall through the cracks.
              </H>
            </Pop>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// 3 — how: broken flow → the fix → a person steps in
const Step: React.FC<{ n: string; label: string; color: string; delay: number }> = ({ n, label, color, delay }) => (
  <Pop delay={delay}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        border: `6px solid ${color}`,
        borderRadius: 30,
        padding: "34px 36px",
        background: C.panel,
        marginBottom: 26,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 99,
          background: color,
          color: C.ground,
          font: `900 54px/96px ${FONT}`,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div style={{ font: `900 70px/1.05 ${FONT}`, color: C.ink }}>{label}</div>
    </div>
  </Pop>
);
const How: React.FC = () => {
  const broken = useBeat("broken", 10);
  const fix = useBeat("fix", 50);
  const person = useBeat("person", 90);
  return (
    <Center>
      <Rise>
        <Tag>EVERY EPISODE</Tag>
      </Rise>
      <div style={{ height: 44 }} />
      <Step n="1" label="The broken flow" color={C.bad} delay={broken} />
      <Step n="2" label="The fix" color={C.blue} delay={fix} />
      <Step n="3" label="Where a person steps in" color={C.ok} delay={person} />
    </Center>
  );
};

// 4 — honest
const Honest: React.FC = () => {
  const worth = useBeat("worth", 40);
  return (
    <Center>
      <Rise>
        <H size={160}>No hype.</H>
      </Rise>
      <Pop delay={worth} rotate={-3} style={{ marginTop: 60, display: "inline-block" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 24,
            border: `6px solid ${C.bad}`,
            borderRadius: 28,
            padding: "26px 34px",
            background: C.panel,
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: 99,
              background: C.bad,
              color: C.ground,
              font: `900 58px/90px ${FONT}`,
              textAlign: "center",
            }}
          >
            ✕
          </div>
          <div>
            <div style={{ font: `800 28px/1 ${MONO}`, letterSpacing: "0.1em", color: C.muted }}>SOME VERDICTS WILL BE</div>
            <div style={{ font: `900 66px/1.1 ${FONT}`, color: C.ink, marginTop: 8 }}>Don't automate this.</div>
          </div>
        </div>
      </Pop>
    </Center>
  );
};

// 5 — cta: the series card
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const follow = useBeat("follow", 70);
  const comment = useBeat("comment", 90);
  const pulse = 1 + Math.sin(frame / 6) * 0.025;
  return (
    <Center>
      <Rise>
        <div style={{ font: `700 36px/1.2 ${MONO}`, letterSpacing: "0.08em", color: C.muted }}>A NEW SERIES · EP 00</div>
      </Rise>
      <Pop delay={10}>
        <H size={128} color={C.accent} style={{ marginTop: 16 }}>
          Can I Automate This Business?
        </H>
      </Pop>
      <div style={{ display: "flex", gap: 22, marginTop: 60, alignItems: "center", flexWrap: "wrap" }}>
        <Pop delay={follow}>
          <div
            style={{
              transform: `scale(${pulse})`,
              background: C.accent,
              color: C.ground,
              borderRadius: 999,
              padding: "28px 56px",
              font: `900 70px/1 ${FONT}`,
            }}
          >
            Follow →
          </div>
        </Pop>
      </div>
      <Rise delay={comment} style={{ marginTop: 40 }}>
        <div
          style={{
            border: `4px dashed ${C.line}`,
            borderRadius: 24,
            padding: "24px 30px",
            font: `800 50px/1.2 ${FONT}`,
            color: C.ink,
          }}
        >
          Comment: which business should I fix next?
        </div>
      </Rise>
    </Center>
  );
};

const VISUALS: Record<string, React.FC> = { hook: Hook, promise: Promise_, how: How, honest: Honest, cta: Cta };

const Shell: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const Visual = VISUALS[scene.id];
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

export const SeriesTrailer: React.FC<VideoProps> = ({ scenes, preview }) => {
  let from = 0;
  return (
    <AbsoluteFill>
      <Background />
      {scenes.map((scene) => {
        const seq = (
          <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} name={scene.id}>
            <Shell scene={scene} />
          </Sequence>
        );
        from += scene.durationInFrames;
        return seq;
      })}
      {preview ? <PreviewBadge /> : null}
    </AbsoluteFill>
  );
};
