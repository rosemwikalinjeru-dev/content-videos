import React from "react";
import { useBeat } from "../../components/kit";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, clamp, interpolate, useCurrentFrame, useSpring } from "./primitives";

// FORMAT: quiz. A question card with two answer buttons and a timer ring, then a reveal stamp.

const TimerRing: React.FC<{ from: number; frames: number }> = ({ from, frames }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, from + frames], [1, 0], clamp);
  const r = 46;
  const L = 2 * Math.PI * r;
  return (
    <svg width={120} height={120}>
      <circle cx={60} cy={60} r={r} stroke={C.line} strokeWidth={12} fill="none" />
      <circle
        cx={60}
        cy={60}
        r={r}
        stroke={C.accent}
        strokeWidth={12}
        fill="none"
        strokeDasharray={L}
        strokeDashoffset={L * (1 - t)}
        transform="rotate(-90 60 60)"
        strokeLinecap="round"
      />
    </svg>
  );
};

const Buttons: React.FC<{ pick?: "ai" | "auto"; pickAt?: number }> = ({ pick, pickAt = 0 }) => {
  const frame = useCurrentFrame();
  const on = pick && frame >= pickAt;
  const B: React.FC<{ id: "ai" | "auto"; label: string; col: string }> = ({ id, label, col }) => {
    const chosen = on && pick === id;
    const dim = on && pick !== id;
    return (
      <div
        style={{
          flex: 1,
          textAlign: "center",
          padding: "40px 10px",
          borderRadius: 28,
          border: `6px solid ${chosen ? col : C.line}`,
          background: chosen ? col : C.panel,
          color: chosen ? C.ground : C.ink,
          opacity: dim ? 0.35 : 1,
          font: `900 64px/1 ${FONT}`,
          transform: chosen ? "scale(1.04)" : undefined,
        }}
      >
        {label}
      </div>
    );
  };
  return (
    <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
      <B id="ai" label="AI" col="#c792ff" />
      <B id="auto" label="Automation" col={C.blue} />
    </div>
  );
};

const QuestionCard: React.FC<{ n: number; text: string }> = ({ n, text }) => {
  const p = useSpring(0);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Tag>QUESTION {n} OF 2</Tag>
        <TimerRing from={6} frames={110} />
      </div>
      <div
        style={{
          marginTop: 24,
          background: C.panel,
          border: `4px solid ${C.line}`,
          borderRadius: 30,
          padding: "40px 36px",
          font: `900 70px/1.12 ${FONT}`,
          letterSpacing: "-0.02em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Stamp: React.FC<{ text: string; col: string; from: number }> = ({ text, col, from }) => {
  const p = useSpring(from, { damping: 10, stiffness: 200, mass: 0.6 });
  return (
    <div
      style={{
        marginTop: 40,
        display: "inline-block",
        alignSelf: "flex-start",
        opacity: Math.min(1, p * 1.5),
        transform: `rotate(-4deg) scale(${1.6 - p * 0.6})`,
        border: `8px solid ${col}`,
        color: col,
        borderRadius: 18,
        padding: "16px 28px",
        font: `900 70px/1 ${FONT}`,
      }}
    >
      {text}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const mix = useBeat("mix", 80);
  const p = useSpring(0);
  const q = useSpring(mix);
  const flicker = Math.floor(frame / 8) % 2 === 0;
  return (
    <Area>
      <div style={{ opacity: p }}>
        <Tag>QUICK TEST</Tag>
        <H size={120} style={{ marginTop: 24 }}>
          Is it <span style={{ color: flicker ? "#c792ff" : C.blue }}>{flicker ? "AI" : "automation"}</span>?
        </H>
      </div>
      <Buttons />
      <div style={{ opacity: q, marginTop: 40, font: `800 48px/1.2 ${FONT}`, color: C.muted }}>Most owners mix them up.</div>
    </Area>
  );
};

const Q1: React.FC = () => (
  <Area>
    <QuestionCard n={1} text="A text goes out every time someone books." />
    <Buttons />
  </Area>
);

const A1: React.FC = () => {
  const at = useBeat("automation.", 2);
  return (
    <Area>
      <QuestionCard n={1} text="A text goes out every time someone books." />
      <Buttons pick="auto" pickAt={at} />
      <Stamp text="AUTOMATION ✓ same rule, every time" col={C.blue} from={at + 4} />
    </Area>
  );
};

const Q2: React.FC = () => (
  <Area>
    <QuestionCard n={2} text="Reading a customer's message and drafting a reply." />
    <Buttons />
  </Area>
);

const A2: React.FC = () => {
  const at = useBeat("a-i.", 6);
  return (
    <Area>
      <QuestionCard n={2} text="Reading a customer's message and drafting a reply." />
      <Buttons pick="ai" pickAt={at} />
      <Stamp text="AI ✓ handles the messy part" col="#c792ff" from={at + 4} />
    </Area>
  );
};

const Need: React.FC = () => {
  const first = useBeat("first.", 60);
  const messy = useBeat("messy", 120);
  const a = useSpring(first);
  const b = useSpring(messy);
  return (
    <Area>
      <Tag>WHICH DO YOU NEED?</Tag>
      <div style={{ marginTop: 40, opacity: a, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ font: `900 90px/1 ${FONT}`, color: C.blue }}>1</span>
        <H size={96}>Automation first</H>
      </div>
      <div style={{ height: 70, borderLeft: `8px dashed ${C.line}`, marginLeft: 22, marginTop: 20, opacity: b }} />
      <div style={{ marginTop: 20, opacity: b, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ font: `900 90px/1 ${FONT}`, color: "#c792ff" }}>2</span>
        <H size={96}>Then AI, for the messy parts</H>
      </div>
    </Area>
  );
};

// triangle: rules / AI / people
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const follow = useBeat("follow", 130);
  const r = useBeat("rules", 0);
  const a = useBeat("messy.", 40);
  const pp = useBeat("people", 80);
  if (frame >= follow - 4) return <SeriesCta line="Rules. AI. People." delay={follow - 4} />;
  const Corner: React.FC<{ x: number; y: number; t: string; sub: string; col: string; at: number }> = ({ x, y, t, sub, col, at }) => {
    const p = useSpring(at);
    return (
      <g opacity={p} transform={`translate(${x} ${y}) scale(${0.7 + p * 0.3})`}>
        <circle r={130} fill={C.panel} stroke={col} strokeWidth={10} />
        <text y={-6} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={54} fill={col}>
          {t}
        </text>
        <text y={44} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={30} fill={C.muted}>
          {sub}
        </text>
      </g>
    );
  };
  return (
    <Area>
      <svg width={900} height={900} style={{ alignSelf: "center" }}>
        <polygon points="450,170 760,700 140,700" fill="none" stroke={C.line} strokeWidth={8} strokeDasharray="6 18" />
        <Corner x={450} y={170} t="Rules" sub="the routine" col={C.blue} at={r} />
        <Corner x={140} y={700} t="AI" sub="the messy" col="#c792ff" at={a} />
        <Corner x={760} y={700} t="People" sub="the decisions" col={C.ok} at={pp} />
      </svg>
    </Area>
  );
};

export const QUIZ: Record<string, React.FC> = { hook: Hook, q1: Q1, a1: A1, q2: Q2, a2: A2, need: Need, cta: Cta };
