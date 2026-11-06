import React from "react";
import { useBeat } from "../../components/kit";
import { Area, Badge, C, Clip, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame, useSpring } from "./primitives";

// FORMAT: countdown of 4 warnings. Each card shakes in red (the problem), then flips to green (the fix).

const Triangle: React.FC<{ size: number; label?: string }> = ({ size, label = "!" }) => (
  <svg width={size} height={size * 0.88} viewBox="0 0 100 88">
    <polygon points="50,4 96,84 4,84" fill={C.accent} stroke={C.ground} strokeWidth={4} strokeLinejoin="round" />
    <text x={50} y={72} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={48} fill={C.ground}>
      {label}
    </text>
  </svg>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const four = useBeat("four", 60);
  const p = useSpring(0);
  const q = useSpring(four);
  const shake = Math.sin(frame * 1.3) * 6 * Math.max(0, 1 - frame / 20);
  return (
    <Area>
      <div style={{ alignSelf: "center", opacity: p, transform: `translateX(${shake}px)` }}>
        <Triangle size={420} label={frame >= four ? "4" : "!"} />
      </div>
      <div style={{ opacity: q, marginTop: 40, textAlign: "center" }}>
        <H size={92}>4 ways automation</H>
        <H size={92} color={C.bad}>
          quietly hurts you
        </H>
        <div style={{ font: `800 40px/1.3 ${FONT}`, color: C.ok, marginTop: 20 }}>…and the fix for each</div>
      </div>
    </Area>
  );
};

type Warn = { n: number; problem: string; pSub: string; fix: string; fSub: string; clip?: string };

const Card: React.FC<{ w: Warn }> = ({ w }) => {
  const frame = useCurrentFrame();
  const fixAt = useBeat("fix", 80);
  const p = useSpring(0);
  const flip = ease(interpolate(frame, [fixAt - 4, fixAt + 8], [0, 1], clamp));
  const showFix = flip > 0.5;
  const shake = !showFix ? Math.sin(frame * 1.2) * 7 * Math.max(0, 1 - frame / 18) : 0;
  const col = showFix ? C.ok : C.bad;
  return (
    <div
      style={{
        opacity: p,
        transform: `translateX(${shake}px) rotateY(${showFix ? (1 - flip) * 90 : flip * 90}deg)`,
        border: `6px solid ${col}`,
        background: showFix ? "#0f2a22" : "#2a1220",
        borderRadius: 34,
        padding: "40px 40px",
        minHeight: 400,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <Badge glyph={showFix ? "✓" : String(w.n)} color={col} size={100} />
        <span style={{ font: `800 32px/1 ${MONO}`, letterSpacing: "0.1em", color: col }}>
          {showFix ? "THE FIX" : `PROBLEM ${w.n} OF 4`}
        </span>
      </div>
      <div style={{ font: `900 76px/1.05 ${FONT}`, color: C.ink, marginTop: 30, letterSpacing: "-0.03em" }}>
        {showFix ? w.fix : w.problem}
      </div>
      <div style={{ font: `700 40px/1.3 ${FONT}`, color: C.muted, marginTop: 16 }}>{showFix ? w.fSub : w.pSub}</div>
    </div>
  );
};

const Problem: React.FC<{ w: Warn }> = ({ w }) => (
  <Area center={!w.clip} style={w.clip ? { paddingTop: 40 } : undefined}>
    <Card w={w} />
    {w.clip && (
      <div style={{ marginTop: 30 }}>
        <Clip src={w.clip} size={620} startFrame={6} rate={1.3} />
      </div>
    )}
  </Area>
);

const W: Warn[] = [
  { n: 1, problem: "Bad details in, bad messages out", pSub: "Wrong number → the text goes to a stranger", fix: "Check details at the door", fSub: "Confirm the phone number when they book" },
  { n: 2, problem: "It breaks silently", pSub: "Nobody notices for weeks", fix: "An alert the moment it fails", fSub: "You hear about it today, not next month", clip: "assets/fix-demos/alert-feed.mp4" },
  { n: 3, problem: "AI sounds sure, and is wrong", pSub: "Confident is not the same as correct", fix: "AI drafts, a person approves", fSub: "Anything about money, health or promises" },
  { n: 4, problem: "Customers feel stuck with a robot", pSub: "No way out of the loop", fix: "An easy way to reach a person", fSub: "\"Reply HUMAN\" or a real phone number" },
];

const P1: React.FC = () => <Problem w={W[0]} />;
const P2: React.FC = () => <Problem w={W[1]} />;
const P3: React.FC = () => <Problem w={W[2]} />;
const P4: React.FC = () => <Problem w={W[3]} />;

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const set = useBeat("set,", 40);
  const watch = useBeat("watch,", 55);
  const improve = useBeat("improve", 70);
  const follow = useBeat("follow", 110);
  if (frame >= follow - 4) return <SeriesCta line="Set. Watch. Improve." delay={follow - 4} />;
  const items: [string, number, string][] = [
    ["Set", set, C.blue],
    ["Watch", watch, C.accent],
    ["Improve", improve, C.ok],
  ];
  return (
    <Area>
      <div style={{ marginBottom: 30 }}>
        <Tag color={C.bad}>NOT "SET AND FORGET"</Tag>
      </div>
      {items.map(([t, at, col]) => (
        <Step key={t} text={t} at={at} col={col} />
      ))}
    </Area>
  );
};

const Step: React.FC<{ text: string; at: number; col: string }> = ({ text, at, col }) => {
  const p = useSpring(at);
  return (
    <div style={{ opacity: p, transform: `translateX(${(1 - p) * -60}px)`, marginBottom: 14 }}>
      <H size={150} color={col}>
        {text}.
      </H>
    </div>
  );
};

export const GOES_WRONG: Record<string, React.FC> = { hook: Hook, p1: P1, p2: P2, p3: P3, p4: P4, cta: Cta };
