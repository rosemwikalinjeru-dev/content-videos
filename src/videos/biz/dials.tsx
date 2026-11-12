import React from "react";
import { useBeat } from "../../components/kit";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame } from "../explainer/primitives";
import { Beat, Box, Demo } from "./common";

// Two dials (customers, price) and two bars (profit, work). Turn one dial at a time.
// Demo business: 10 jobs/week × $200, $150 cost each → $500 profit.
// +2 jobs → $600. +10% price → $700.

const Dial: React.FC<{ label: string; turn: number; color: string; value: string }> = ({ label, turn, color, value }) => {
  const ang = -70 + turn * 110;
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <svg width={340} height={230} viewBox="0 0 340 230">
        <path d="M 40 200 A 130 130 0 0 1 300 200" stroke={C.line} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M 40 200 A 130 130 0 0 1 300 200" stroke={color} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={408} strokeDashoffset={408 * (1 - (0.25 + turn * 0.55))} />
        <g transform={`rotate(${ang} 170 200)`}>
          <rect x={164} y={86} width={12} height={118} rx={6} fill={C.ink} />
        </g>
        <circle cx={170} cy={200} r={18} fill={C.ink} />
      </svg>
      <div style={{ font: `800 30px/1 ${MONO}`, letterSpacing: "0.08em", color }}>{label}</div>
      <div style={{ font: `900 56px/1.1 ${FONT}`, marginTop: 6 }}>{value}</div>
    </div>
  );
};

const Bar: React.FC<{ label: string; value: string; frac: number; color: string }> = ({ label, value, frac, color }) => (
  <div style={{ marginTop: 26 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ font: `800 32px/1 ${MONO}`, color: C.muted, letterSpacing: "0.06em" }}>{label}</span>
      <span style={{ font: `900 64px/1 ${FONT}`, color }}>{value}</span>
    </div>
    <div style={{ marginTop: 10, height: 40, background: C.panel, borderRadius: 20, overflow: "hidden" }}>
      <div style={{ width: `${frac * 100}%`, height: "100%", background: color, borderRadius: 20 }} />
    </div>
  </div>
);

const Panel: React.FC<{ d1: number; d2: number; tag: string; tagColor?: string }> = ({ d1, d2, tag, tagColor = C.accent }) => {
  const jobs = 10 + 2 * d1;
  const price = 200 + 20 * d2;
  const profit = jobs * (price - 150);
  return (
    <Area>
      <Tag color={tagColor}>{tag}</Tag>
      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
        <Dial label="DIAL 1 · CUSTOMERS" turn={d1} color={C.blue} value={`${Math.round(jobs)} jobs / week`} />
        <Dial label="DIAL 2 · PRICE" turn={d2} color={C.accent} value={`$${Math.round(price)} a job`} />
      </div>
      <Bar label="PROFIT / WEEK" value={`$${Math.round(profit)}`} frac={profit / 800} color={C.ok} />
      <Bar label="WORK" value={`${Math.round(jobs)} jobs`} frac={jobs / 14} color={d1 > 0.5 ? C.bad : C.muted} />
      <Demo />
    </Area>
  );
};

const useTurn = (word: string, fallback: number) => {
  const frame = useCurrentFrame();
  const b = useBeat(word, fallback);
  return ease(interpolate(frame, [b, b + 24], [0, 1], clamp));
};

const Hook: React.FC = () => (
  <Area>
    <H size={130}>More profit?</H>
    <Beat word="two" fallback={40} style={{ marginTop: 30 }}>
      <H size={130} color={C.accent}>
        You have two dials.
      </H>
    </Beat>
    <Beat word="one" fallback={110} style={{ marginTop: 30 }}>
      <div style={{ font: `800 50px/1.2 ${FONT}`, color: C.muted }}>Most owners only turn one.</div>
    </Beat>
  </Area>
);

const Base: React.FC = () => (
  <Area>
    <Tag>A DEMO BUSINESS</Tag>
    {[
      ["10 jobs a week", "ten", C.blue],
      ["$200 a job", "two", C.accent],
      ["$150 cost per job", "one-fifty", C.bad],
    ].map(([t, w, col], i) => (
      <Beat key={t} word={w} fallback={30 + i * 40} style={{ marginTop: 24 }}>
        <Box color={col}>
          <div style={{ font: `900 76px/1 ${FONT}` }}>{t}</div>
        </Box>
      </Beat>
    ))}
    <Beat word="do" fallback={170} pop style={{ marginTop: 30 }}>
      <H size={84} color={C.ok}>
        = $500 profit a week
      </H>
    </Beat>
    <Demo />
  </Area>
);

const More: React.FC = () => <Panel d1={useTurn("two", 60)} d2={0} tag="TURN DIAL 1 · MORE CUSTOMERS" tagColor={C.blue} />;
const Price: React.FC = () => <Panel d1={0} d2={useTurn("ten", 50)} tag="TURN DIAL 2 · PRICE +10%" />;

const Catch: React.FC = () => (
  <Area>
    <Tag color={C.bad}>THE CATCH</Tag>
    <H size={110} style={{ marginTop: 30 }}>
      Some customers may leave.
    </H>
    <Beat word="test" fallback={80} style={{ marginTop: 40 }}>
      <H size={100} color={C.ok}>
        Test it on new customers first.
      </H>
    </Beat>
  </Area>
);

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const follow = useBeat("follow", 100);
  if (frame >= follow - 4) return <SeriesCta line="Know both dials." delay={follow - 4} />;
  return <Panel d1={0} d2={0} tag="KNOW BOTH BEFORE YOU CHASE MORE WORK" />;
};

export const DIALS: Record<string, React.FC> = { hook: Hook, base: Base, more: More, price: Price, catch: Catch, cta: Cta };
