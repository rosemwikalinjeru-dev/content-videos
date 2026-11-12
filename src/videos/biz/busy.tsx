import React from "react";
import { useBeat } from "../../components/kit";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame, useSpring } from "../explainer/primitives";
import { Beat, CTA_LINE, Demo } from "./common";

// Three job cards. Bars start as "what it pays", then morph to "per hour of your time" and the ranking flips.

const JOBS = [
  { n: "Job 1", pay: 400, time: "2 hrs · 10 min away", ph: 171 },
  { n: "Job 2", pay: 600, time: "full day · 1 hr drive each way", ph: 60 },
  { n: "Job 3", pay: 300, time: "45 min · 5 min away", ph: 327 },
];

const JobCard: React.FC<{ j: (typeof JOBS)[number]; t: number; fresh: boolean }> = ({ j, t, fresh }) => {
  const p = useSpring(fresh ? 4 : -100);
  const w = (j.pay / 600) * (1 - t) + (j.ph / 327) * t;
  const col = t < 0.5 ? C.accent : j.ph === 327 ? C.ok : j.ph === 60 ? C.bad : C.accent;
  return (
    <div
      style={{
        opacity: p,
        transform: `translateX(${(1 - p) * -60}px)`,
        background: C.panel,
        border: `5px solid ${t > 0.5 ? col : C.line}`,
        borderRadius: 28,
        padding: "26px 30px",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ font: `900 56px/1 ${FONT}` }}>{j.n}</span>
        <span style={{ font: `900 64px/1 ${FONT}`, color: col }}>{t < 0.5 ? `$${j.pay}` : `$${j.ph}/hr`}</span>
      </div>
      <div style={{ font: `700 32px/1.2 ${FONT}`, color: C.muted, marginTop: 8 }}>{j.time}</div>
      <div style={{ marginTop: 16, height: 30, background: C.ground, borderRadius: 15, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(6, w * 100)}%`, height: "100%", background: col, borderRadius: 15 }} />
      </div>
    </div>
  );
};

const Jobs: React.FC<{ upTo: number; perHourWord?: string }> = ({ upTo, perHourWord }) => {
  const frame = useCurrentFrame();
  const b = useBeat(perHourWord ?? "\u0000", 30);
  const t = perHourWord ? ease(interpolate(frame, [b, b + 18], [0, 1], clamp)) : 0;
  return (
    <Area>
      <div style={{ marginBottom: 30 }}>
        <Tag color={t > 0.5 ? C.ok : C.accent}>{t > 0.5 ? "PER HOUR OF YOUR TIME" : "WHAT EACH JOB PAYS"}</Tag>
      </div>
      {JOBS.map((j, i) => (i > upTo ? null : <JobCard key={j.n} j={j} t={t} fresh={i === upTo && !perHourWord} />))}
      <Demo text="DEMO NUMBERS · TIME + TRAVEL ONLY, MATERIALS NOT COUNTED" />
    </Area>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Area>
      <H size={100}>A full calendar</H>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 150px)", gap: 14, margin: "36px 0" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ height: 70, borderRadius: 12, background: frame > 4 + i * 2 ? C.blue : C.panel, border: `3px solid ${C.line}` }} />
        ))}
      </div>
      <Beat word="money" fallback={60}>
        <H size={100} color={C.bad}>
          ≠ making money
        </H>
      </Beat>
    </Area>
  );
};

const Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [20, 32], [0, 1], clamp);
  return (
    <Area>
      <div style={{ position: "relative", display: "inline-block", alignSelf: "flex-start" }}>
        <H size={96} color={C.muted}>
          "How busy am I?"
        </H>
        <div style={{ position: "absolute", left: -8, top: "52%", height: 14, width: `${strike * 104}%`, background: C.bad, borderRadius: 7 }} />
      </div>
      <Beat word="ask" fallback={70} style={{ marginTop: 50 }}>
        <H size={116} color={C.ok}>
          "What does each hour bring in?"
        </H>
      </Beat>
    </Area>
  );
};

export const BUSY: Record<string, React.FC> = {
  hook: Hook,
  j1: () => <Jobs upTo={0} />,
  j2: () => <Jobs upTo={1} />,
  j3: () => <Jobs upTo={2} />,
  reveal: () => <Jobs upTo={2} perHourWord="smallest" />,
  lesson: Lesson,
  cta: () => <SeriesCta line={CTA_LINE} />,
};
