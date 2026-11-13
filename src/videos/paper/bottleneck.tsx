import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useBeat } from "../../components/kit";
import { Card, Counter, Desk, Note, P, PF, PH, PM, PaperScene, clampP, easeP, lerp, useSpr } from "./kit";

// "The owner is the bottleneck", told in one world: decisions arrive as cards and have to
// reach a desk. First there is one desk (yours). Then there are three.
// All numbers are a demo day (12 decisions), labelled on screen.

const LABELS = ["Quote?", "Refund?", "Move job?", "Supplier?", "Discount?", "Day off?", "Invoice?", "Parts?", "Refund?", "Reminder?", "Late fee?", "Big bid?"];
const TEAM = [0, 3, 7];
const YOU = [11];
const target = (i: number) => (YOU.includes(i) ? "you" : TEAM.includes(i) ? "team" : "rule");

type Pt = { x: number; y: number };
const DOOR: Pt = { x: 500, y: 36 };
const ONE: Pt = { x: 500, y: 590 }; // the single desk
const D3 = { you: 170, team: 480, rule: 790 }; // three desks (x)
const D3Y = 500;

const slot = (i: number): Pt => ({ x: 245 + (i % 4) * 170, y: 150 + Math.floor(i / 4) * 112 });
const move = (frame: number, start: number, dur: number, a: Pt, b: Pt): Pt => {
  const t = easeP(interpolate(frame, [start, start + dur], [0, 1], clampP));
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) - Math.sin(t * Math.PI) * 26 };
};

const Door: React.FC<{ x?: number; y?: number }> = ({ x = DOOR.x, y = DOOR.y }) => (
  <div style={{ position: "absolute", left: x - 150, top: y - 36, width: 300, height: 72, borderRadius: 18, border: `5px dashed ${P.ink}`, textAlign: "center", font: `600 26px/62px ${PM}`, letterSpacing: "0.08em", color: P.soft }}>
    DECISIONS IN
  </div>
);

const Clock: React.FC<{ t: number; from: number; to: number; x?: number; y?: number }> = ({ t, from, to, x = 830, y = 0 }) => {
  const h = lerp(from, to, t);
  const hour = Math.floor(h);
  const label = `${((hour + 11) % 12) + 1} ${hour >= 12 ? "PM" : "AM"}`;
  const ang = (h % 12) * 30;
  return (
    <div style={{ position: "absolute", left: x - 105, top: y, width: 210, display: "flex", alignItems: "center", gap: 12, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 999, padding: "8px 14px" }}>
      <svg width={52} height={52} viewBox="0 0 52 52">
        <circle cx={26} cy={26} r={22} fill={P.paper} stroke={P.ink} strokeWidth={5} />
        <line x1={26} y1={26} x2={26} y2={11} stroke={P.ink} strokeWidth={5} strokeLinecap="round" transform={`rotate(${ang} 26 26)`} />
      </svg>
      <span style={{ font: `800 38px/1 ${PH}`, color: P.ink, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
};

const Sub: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; w?: number }> = ({ x, y, children, color = P.soft, w = 300 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", font: `700 30px/1.15 ${PF}`, color }}>{children}</div>
);

// ---------- 1. hook: one desk, cards queue toward it ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Door />
      {[0, 1, 2, 3].map((i) => {
        const start = 8 + i * 14;
        if (frame < start) return null;
        const p = move(frame, start, 16, DOOR, { x: 500, y: 450 - i * 104 });
        return <Card key={i} x={p.x} y={p.y} text={LABELS[i]} state={frame > start + 30 ? "wait" : "new"} />;
      })}
      <Desk x={ONE.x} y={ONE.y} label="YOU" color={P.accent} w={330} />
    </>
  );
};

// ---------- 2. pile: four kinds of decision land on the same desk ----------
const PILE: [string, string, number][] = [
  ["Quotes", "quotes", 0],
  ["Refunds", "refunds", 1],
  ["Schedule", "schedule", 2],
  ["Supplier", "supplier", 3],
];
const Pile: React.FC = () => {
  const frame = useCurrentFrame();
  const beats = PILE.map(([, w, i]) => useBeat(w, 4 + i * 14));
  const yours = useBeat("yours", 110);
  const from: Pt[] = [
    { x: 80, y: 60 },
    { x: 900, y: 60 },
    { x: 80, y: 300 },
    { x: 900, y: 300 },
  ];
  return (
    <>
      {PILE.map(([t, , i]) => {
        if (frame < beats[i]) return null;
        const p = move(frame, beats[i], 16, from[i], { x: 395 + (i % 2) * 210, y: 320 + Math.floor(i / 2) * 124 });
        return <Card key={t} x={p.x} y={p.y} text={t} scale={1.25} rot={(i - 1.5) * 3} />;
      })}
      <Desk x={ONE.x} y={ONE.y} label="YOU" color={frame >= yours ? P.bad : P.accent} w={330} />
    </>
  );
};

// ---------- 3. cost: the desk is empty, the pile turns red ----------
const Cost: React.FC = () => {
  const frame = useCurrentFrame();
  const job = useBeat("job", 20);
  const asleep = useBeat("asleep", 45);
  const stops = useBeat("stops", 70);
  const sign = frame >= asleep ? "ASLEEP" : frame >= job ? "ON A JOB" : undefined;
  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Card key={i} x={320 + (i % 3) * 180} y={270 + Math.floor(i / 3) * 116} text={LABELS[i]} state={frame >= stops ? "wait" : "new"} rot={((i * 7) % 5) - 2} />
      ))}
      <Desk x={ONE.x} y={ONE.y} label="YOU" color={P.soft} sign={sign} dim={frame >= job} w={330} />
      {frame >= stops && (
        <Sub x={500} y={70} color={P.bad} w={700}>
          <span style={{ font: `800 64px/1 ${PH}` }}>Everything stops.</span>
        </Sub>
      )}
    </>
  );
};

// ---------- 4–5. simulation: one desk ----------
const Sim1: React.FC<{ part: 1 | 2 }> = ({ part }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const t = interpolate(frame, [0, D - 8], [0, 1], clampP);
  const three = useBeat("three", Math.round(D * 0.3));
  const nine = useBeat("nine", Math.round(D * 0.5));
  const done = [0, 1, 2];
  return (
    <>
      <Door x={190} />
      <Clock t={t} from={part === 1 ? 9 : 13} to={part === 1 ? 13 : 17} />
      {LABELS.map((label, i) => {
        if (part === 1) {
          const start = 6 + (i * (D - 40)) / 12;
          if (frame < start) return null;
          const p = move(frame, start, 14, { x: 190, y: 36 }, slot(i));
          return <Card key={i} x={p.x} y={p.y} text={label} />;
        }
        const k = done.indexOf(i);
        if (k >= 0) {
          // slot -> desk -> done pile, one after another through the afternoon
          const start = 8 + k * ((D * 0.55) / 3);
          const a = move(frame, start, 14, slot(i), { x: 500, y: 490 });
          const b = move(frame, start + 26, 14, a, { x: 150, y: 540 - k * 20 });
          const p = frame < start + 26 ? a : b;
          return <Card key={i} x={p.x} y={p.y} text={label} state={frame >= start + 22 ? "done" : "new"} />;
        }
        const red = frame >= nine - 10 + (i % 5) * 3;
        return <Card key={i} x={slot(i).x} y={slot(i).y} text={label} state={red ? "wait" : "new"} />;
      })}
      <Desk x={ONE.x} y={ONE.y} label="YOU" color={P.accent} w={330} />
      {part === 2 && frame >= three && <Counter x={150} y={630} label="DONE" value={3} color={P.ok} />}
      {part === 2 && frame >= nine && <Counter x={830} y={630} label="WAITING" value={9} color={P.bad} />}
    </>
  );
};

// ---------- three desks ----------
const DESKS = [
  { k: "you", x: D3.you, label: "ONLY YOU", color: P.accent, sub: "the big calls" },
  { k: "team", x: D3.team, label: "YOUR TEAM", color: P.pill, sub: "with a rule" },
  { k: "rule", x: D3.rule, label: "NOBODY", color: P.warm, sub: "the rule answers" },
] as const;

const ThreeDesks: React.FC<{ show?: number[]; subs?: boolean; w?: number }> = ({ show = [0, 0, 0], subs = true, w = 260 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {DESKS.map((d, i) => {
        if (frame < show[i]) return null;
        const p = interpolate(frame, [show[i], show[i] + 8], [0, 1], clampP);
        return (
          <div key={d.k} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
            <Desk x={d.x} y={D3Y} label={d.label} color={d.color} w={w} />
            {subs && (
              <Sub x={d.x} y={D3Y + 240}>
                {d.sub}
              </Sub>
            )}
          </div>
        );
      })}
    </>
  );
};

// ---------- 6. sort ----------
const Sort: React.FC = () => {
  const only = useBeat("only", 30);
  const someone = useBeat("someone", 60);
  const nobody = useBeat("nobody", 100);
  return <ThreeDesks show={[only, someone, nobody]} />;
};

// ---------- 7. rule: a refund card leaves your desk for the team ----------
const Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpr(4);
  const front = useBeat("front", 70);
  const p = move(frame, front, 20, { x: D3.you, y: 360 }, { x: D3.team, y: 360 });
  return (
    <>
      <div style={{ opacity: a, transform: `scale(${0.9 + a * 0.1})`, transformOrigin: "500px 120px" }}>
        <Note x={500} y={20} w={860} color={P.accent}>
          <div style={{ font: `600 24px/1 ${PM}`, letterSpacing: "0.1em", color: P.accent }}>EXAMPLE RULE</div>
          <div style={{ font: `800 54px/1.1 ${PH}`, color: P.ink, marginTop: 10 }}>
            Refund under $50 → <span style={{ color: P.accent }}>front desk decides</span>
          </div>
        </Note>
      </div>
      <ThreeDesks subs={false} />
      <Card x={p.x} y={p.y} text="Refund? $35" scale={1.2} state={frame >= front + 24 ? "done" : "new"} />
    </>
  );
};

// ---------- 8. result: small cards flow past you, one stays ----------
const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const keep = useBeat("keep", 70);
  return (
    <>
      <Door />
      <ThreeDesks subs={false} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const start = 6 + i * 10;
        if (frame < start) return null;
        const to = i % 3 === 0 ? D3.team : D3.rule;
        const col = Math.floor(i / 3);
        const p = move(frame, start, 16, DOOR, { x: to, y: 380 - col * 58 - (i % 3 === 2 ? 116 : 0) });
        return <Card key={i} x={p.x} y={p.y} text={LABELS[i === 0 ? 0 : i === 3 ? 3 : i + 3]} state={frame > start + 18 ? "done" : "new"} />;
      })}
      {frame >= keep && (() => {
        const p = move(frame, keep, 16, DOOR, { x: D3.you, y: 360 });
        return <Card x={p.x} y={p.y} text="Big bid?" scale={1.2} />;
      })()}
    </>
  );
};

// ---------- 9–10. simulation: three desks ----------
const stackPos = (i: number): Pt => {
  const k = target(i);
  const group = LABELS.map((_, j) => j).filter((j) => target(j) === k);
  const n = group.indexOf(i);
  if (k === "rule") return { x: D3.rule + (n % 2 === 0 ? -80 : 80), y: 380 - Math.floor(n / 2) * 58 };
  return { x: k === "team" ? D3.team : D3.you, y: 380 - n * 58 };
};

const Sim2: React.FC<{ part: 1 | 2 }> = ({ part }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const t = interpolate(frame, [0, D - 8], [0, 1], clampP);
  const eight = useBeat("eight", Math.round(D * 0.35));
  const threeB = useBeat("three", Math.round(D * 0.55));
  const one = useBeat("one", Math.round(D * 0.75));
  const five = useBeat("five", 30);
  const count = (k: string) => LABELS.filter((_, i) => target(i) === k && (part === 2 || frame >= 6 + (i * (D * 0.6)) / 12 + 14)).length;
  return (
    <>
      <Door />
      <Clock t={t} from={part === 1 ? 9 : 14} to={part === 1 ? 14 : 17} />
      <ThreeDesks subs={false} />
      {LABELS.map((label, i) => {
        const k = target(i);
        const pos = stackPos(i);
        if (part === 2) return <Card key={i} x={pos.x} y={pos.y} text={label} state={k === "you" && frame < five ? "new" : "done"} scale={k === "you" ? 1.2 : 1} />;
        const start = 6 + (i * (D * 0.6)) / 12;
        if (frame < start) return null;
        const p = move(frame, start, 14, DOOR, pos);
        // a rule answers at once; the team takes a moment; yours waits for you
        const doneAt = start + (k === "rule" ? 16 : k === "team" ? 40 : 9999);
        return <Card key={i} x={p.x} y={p.y} text={label} state={frame >= doneAt ? "done" : "new"} scale={k === "you" ? 1.2 : 1} />;
      })}
      {(part === 2 || frame >= one) && <Counter x={D3.you} y={745} label="YOU" value={part === 2 ? 1 : count("you")} color={P.accent} />}
      {(part === 2 || frame >= threeB) && <Counter x={D3.team} y={745} label="TEAM" value={part === 2 ? 3 : count("team")} color={P.pill} />}
      {(part === 2 || frame >= eight) && <Counter x={D3.rule} y={745} label="RULE" value={part === 2 ? 8 : count("rule")} color={P.warm} />}
    </>
  );
};

// ---------- 11. start ----------
const Start: React.FC = () => {
  const frame = useCurrentFrame();
  const ask = useBeat("asks", 40);
  const could = useBeat("could", 110);
  const a = interpolate(frame, [ask, ask + 8], [0, 1], clampP);
  const b = interpolate(frame, [could, could + 8], [0, 1], clampP);
  return (
    <>
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * 20}px)` }}>
        <Note x={400} y={40} w={620}>
          <div style={{ font: `600 24px/1 ${PM}`, letterSpacing: "0.1em", color: P.soft }}>SOMEONE ASKS YOU</div>
          <div style={{ font: `800 56px/1.1 ${PH}`, color: P.ink, marginTop: 10 }}>"Can I refund this?"</div>
        </Note>
      </div>
      <div style={{ opacity: b, transform: `translateY(${(1 - b) * 20}px)` }}>
        <Note x={540} y={330} w={760} color={P.accent}>
          <div style={{ font: `600 24px/1 ${PM}`, letterSpacing: "0.1em", color: P.accent }}>ASK YOURSELF</div>
          <div style={{ font: `800 68px/1.05 ${PH}`, color: P.ink, marginTop: 10 }}>
            Could a <span style={{ color: P.accent }}>rule</span> answer this?
          </div>
        </Note>
      </div>
    </>
  );
};

// ---------- 12. cta ----------
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpr(4);
  const pulse = 1 + Math.sin(frame / 6) * 0.03;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 120, transform: `scale(${p * pulse})`, transformOrigin: "left center", background: P.accent, color: "#fff", borderRadius: 999, padding: "34px 70px", font: `800 96px/1 ${PH}`, boxShadow: `0 12px 0 ${P.line}` }}>
        Follow →
      </div>
      <div style={{ position: "absolute", left: 64, top: 330, font: `600 34px/1.3 ${PM}`, letterSpacing: "0.06em", color: P.soft, opacity: p }}>
        ROSE NJERU AUTOMATION
        <br />
        ONE BUSINESS FIX, EVERY WEEK
      </div>
    </>
  );
};

const DEMO = "DEMO DAY · NOT REAL DATA";

export const PAPER_BOTTLENECK: Record<string, PaperScene> = {
  hook: { kicker: "THE OWNER TRAP", head: "Everything waits for", accent: "you", bad: true, Stage: Hook },
  pile: { kicker: "WHERE DECISIONS GO", head: "All on", accent: "one desk", bad: true, Stage: Pile },
  cost: { kicker: "WHEN YOU'RE NOT THERE", head: "You're out.", accent: "It stops.", bad: true, Stage: Cost },
  sim: { kicker: DEMO, head: "12 decisions,", accent: "one desk", bad: true, Stage: () => <Sim1 part={1} /> },
  sim2: { kicker: DEMO, head: "By 5 PM:", accent: "9 still waiting", bad: true, Stage: () => <Sim1 part={2} /> },
  sort: { kicker: "THE FIX", head: "Sort into", accent: "three piles", Stage: Sort },
  rule: { kicker: "WHAT A RULE SOUNDS LIKE", head: "Write", accent: "one rule", Stage: Rule },
  result: { kicker: "WHAT CHANGES", head: "It moves", accent: "without you", Stage: Result },
  sim3: { kicker: DEMO, head: "Same day,", accent: "three desks", Stage: () => <Sim2 part={1} /> },
  sim4: { kicker: DEMO, head: "All answered", accent: "by 5", Stage: () => <Sim2 part={2} /> },
  start: { kicker: "YOUR FIRST STEP", head: "Start", accent: "this week", Stage: Start },
  cta: { kicker: "ONE BUSINESS FIX, EVERY WEEK", head: "Follow for", accent: "the next one", Stage: Cta },
};
