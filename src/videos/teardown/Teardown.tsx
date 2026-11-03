import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
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
  SourceCard,
  useBeat,
  useIn,
} from "../../components/kit";
import type { TimedScene, VideoProps } from "../../lib/timing";
import { FlowDiagram } from "./FlowDiagram";
import type { TeardownSpec } from "./types";

// 7-scene owner-first teardown: moment → before → cost → new → after → verdict → cta.

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ paddingLeft: SAFE.left, paddingRight: SAFE.right, top: 140, height: 1200, justifyContent: "center" }}
  >
    {children}
  </AbsoluteFill>
);

const H: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children,
  size = 120,
  color = C.ink,
}) => <div style={{ font: `900 ${size}px/1.04 ${FONT}`, letterSpacing: "-0.04em", color }}>{children}</div>;

const Tag: React.FC<{ children: React.ReactNode; color?: string; ink?: string }> = ({
  children,
  color = C.accent,
  ink = C.ground,
}) => (
  <span
    style={{
      display: "inline-block",
      font: `800 32px/1 ${MONO}`,
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

const colorOf = (c: string) =>
  ({ ink: C.ink, bad: C.bad, accent: C.accent, ok: C.ok, muted: C.muted } as Record<string, string>)[c] ?? C.ink;

// 1 ─ owner's moment: the HyperFrames phone clip
const Moment: React.FC<{ spec: TeardownSpec }> = ({ spec }) => {
  const p = useIn(0);
  return (
    <AbsoluteFill style={{ top: 140, height: 1200, alignItems: "center" }}>
      <div style={{ marginTop: 20, opacity: p }}>
        <Tag>{spec.moment.label}</Tag>
      </div>
      <div style={{ width: 980, height: 980, marginTop: 30, opacity: p, transform: `scale(${0.96 + p * 0.04})` }}>
        <OffthreadVideo src={staticFile(spec.moment.clip)} muted style={{ width: 980, height: 980 }} />
      </div>
    </AbsoluteFill>
  );
};

// 3 ─ the cost (demo numbers, labelled)
const Cost: React.FC<{ spec: TeardownSpec }> = ({ spec }) => {
  const beats = spec.cost.lines.map((l, i) => useBeat(l.beat ?? "\u0000", i === 0 ? 0 : 40));
  return (
    <Center>
      <div style={{ marginBottom: 40 }}>
        <Tag color={C.muted}>{spec.cost.tag ?? "DEMO NUMBERS"}</Tag>
      </div>
      {spec.cost.lines.map((l, i) => (
        <Rise key={i} delay={beats[i]} style={{ marginBottom: 30 }}>
          <H size={i === 0 ? 120 : 84} color={colorOf(l.color ?? "ink")}>
            {l.text}
          </H>
        </Rise>
      ))}
    </Center>
  );
};

// 4 ─ the new thing (news + source card) or the fix (evergreen)
const NewThing: React.FC<{ spec: TeardownSpec }> = ({ spec }) => {
  const t = spec.newThing;
  return (
    <Center>
      <Rise>
        <Tag color={t.isNews ? C.accent : C.ok}>{t.kicker}</Tag>
      </Rise>
      <div style={{ height: 40 }} />
      <Rise delay={4}>
        <H size={t.title.length > 22 ? 100 : 140}>{t.title}</H>
      </Rise>
      {t.sub && (
        <Rise delay={14}>
          <div style={{ font: `700 50px/1.25 ${FONT}`, color: C.muted, marginTop: 30 }}>{t.sub}</div>
        </Rise>
      )}
      {t.source && <SourceCard text={t.source} delay={10} top={1110} />}
    </Center>
  );
};

// 6 ─ verdict
const Verdict: React.FC<{ spec: TeardownSpec }> = ({ spec }) => {
  const beats = spec.verdict.lines.map((l, i) => useBeat(l.beat ?? "\u0000", i * 30));
  return (
    <Center>
      <div style={{ marginBottom: 40 }}>
        <Tag>MY VERDICT</Tag>
      </div>
      {spec.verdict.lines.map((l, i) => (
        <Rise key={i} delay={beats[i]} style={{ marginBottom: 20 }}>
          <H size={l.color === "muted" ? 68 : 120} color={colorOf(l.color)}>
            {l.text}
          </H>
        </Rise>
      ))}
    </Center>
  );
};

// 7 ─ CTA: series follow
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 6) * 0.025;
  return (
    <Center>
      <Rise>
        <div style={{ font: `700 36px/1.2 ${MONO}`, letterSpacing: "0.08em", color: C.muted }}>THE SERIES</div>
      </Rise>
      <Rise delay={3}>
        <H size={104} color={C.accent}>
          Can I Automate This Business?
        </H>
      </Rise>
      <Rise delay={8}>
        <div style={{ font: `700 50px/1.25 ${FONT}`, color: C.ink, marginTop: 30 }}>
          One business process fixed, every week.
        </div>
      </Rise>
      <Pop delay={12} style={{ marginTop: 60, display: "inline-block" }}>
        <div
          style={{
            display: "inline-block",
            transform: `scale(${pulse})`,
            background: C.accent,
            color: C.ground,
            borderRadius: 999,
            padding: "28px 64px",
            font: `900 72px/1 ${FONT}`,
          }}
        >
          Follow →
        </div>
      </Pop>
    </Center>
  );
};

const Visual: React.FC<{ id: string; spec: TeardownSpec }> = ({ id, spec }) => {
  switch (id) {
    case "moment":
      return <Moment spec={spec} />;
    case "before":
      return <FlowDiagram flow={spec.before} mode="before" business={spec.business} />;
    case "cost":
      return <Cost spec={spec} />;
    case "new":
      return <NewThing spec={spec} />;
    case "after":
      return <FlowDiagram flow={spec.after} mode="after" business={spec.business} />;
    case "verdict":
      return <Verdict spec={spec} />;
    case "cta":
      return <Cta />;
    default:
      return null;
  }
};

const SceneShell: React.FC<{ scene: TimedScene; spec: TeardownSpec }> = ({ scene, spec }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [scene.durationInFrames - 4, scene.durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
        <SceneWords.Provider value={scene.words}>
          <Visual id={scene.id} spec={spec} />
        </SceneWords.Provider>
      </AbsoluteFill>
      <Captions words={scene.words} />
      {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
    </AbsoluteFill>
  );
};

export const Teardown: React.FC<VideoProps & { spec: TeardownSpec }> = ({ scenes, preview, spec }) => {
  let from = 0;
  return (
    <AbsoluteFill>
      <Background />
      {scenes.map((scene) => {
        const seq = (
          <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} name={scene.id}>
            <SceneShell scene={scene} spec={spec} />
          </Sequence>
        );
        from += scene.durationInFrames;
        return seq;
      })}
      {preview ? <PreviewBadge /> : null}
    </AbsoluteFill>
  );
};
