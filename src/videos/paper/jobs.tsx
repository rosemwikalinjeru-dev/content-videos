import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useBeat } from "../../components/kit";
import { Counter, P, PF, PH, PM, PaperScene, lerp } from "./kit";
import { Block, Bubble, Cta, In, Label, Pill, tw } from "./world";

// "Busy isn't profitable." One world: a road from HOME to each job, then a week calendar.
// Demo numbers only (research/business-batch-1.md): time and travel counted, materials ignored.

const JOBS = [
  { n: "Job 1", pay: 400, site: "2 hrs on site", drive: "10 min away", px: 430, hours: 2.33, ph: 171, col: P.warm },
  { n: "Job 2", pay: 600, site: "A full day", drive: "1 hr drive each way", px: 880, hours: 10, ph: 60, col: P.pill },
  { n: "Job 3", pay: 300, site: "45 min on site", drive: "5 min away", px: 300, hours: 0.92, ph: 327, col: P.accent },
];
const HOME = 110;
const ROAD_Y = 170;

const Van: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={110} height={70} style={{ position: "absolute", left: x - 55, top: y - 62 }}>
    <rect x={4} y={10} width={74} height={40} rx={8} fill={P.card} stroke={P.ink} strokeWidth={5} />
    <path d="M78 22 L98 22 L106 38 L106 50 L78 50 Z" fill={P.warm} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={28} cy={54} r={11} fill={P.ink} />
    <circle cx={86} cy={54} r={11} fill={P.ink} />
  </svg>
);

const Road: React.FC<{ to: number; t: number; col: string; label: string }> = ({ to, t, col, label }) => (
  <>
    <div style={{ position: "absolute", left: HOME, top: ROAD_Y, width: to - HOME, height: 14, borderRadius: 7, background: P.line }} />
    <div style={{ position: "absolute", left: HOME, top: ROAD_Y, width: (to - HOME) * t, height: 14, borderRadius: 7, background: col }} />
    <Block x={HOME - 70} y={ROAD_Y - 100} w={130} h={70} color={P.ink} size={26}>
      HOME
    </Block>
    <Block x={to - 65} y={ROAD_Y - 100} w={130} h={70} color={col} size={26}>
      {label}
    </Block>
    <Van x={lerp(HOME, to, t)} y={ROAD_Y + 4} />
  </>
);

const Job: React.FC<{ i: number; payWord: string; siteWord: string; driveWord: string }> = ({ i, payWord, siteWord, driveWord }) => {
  const frame = useCurrentFrame();
  const j = JOBS[i];
  const pay = useBeat(payWord, 30);
  const site = useBeat(siteWord, 70);
  const drive = useBeat(driveWord, 110);
  const t = tw(frame, drive, 40);
  return (
    <>
      <Road to={j.px} t={t} col={j.col} label={j.n.toUpperCase()} />
      <In at={pay} pop>
        <div style={{ position: "absolute", left: 60, top: 300, width: 880, borderRadius: 26, background: P.card, border: `5px solid ${P.ink}`, boxShadow: `0 10px 0 ${P.line}`, padding: "26px 34px", boxSizing: "border-box" }}>
          <div style={{ font: `600 26px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>{j.n.toUpperCase()} PAYS</div>
          <div style={{ font: `800 150px/1 ${PH}`, color: P.ink }}>${j.pay}</div>
        </div>
      </In>
      <In at={site}>
        <Block x={60} y={590} w={420} h={110} color={P.paper2} ink={P.ink} size={38}>
          {j.site}
        </Block>
      </In>
      <In at={drive}>
        <Block x={520} y={590} w={420} h={110} color={P.paper2} ink={P.ink} size={38}>
          {j.drive}
        </Block>
      </In>
    </>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const money = useBeat("money", 60);
  return (
    <>
      {[0, 1, 2, 3, 4].map((d) =>
        [0, 1, 2].map((r) => {
          const at = 4 + (d * 3 + r) * 3;
          if (frame < at) return null;
          return <Block key={`${d}-${r}`} x={50 + d * 182} y={60 + r * 150} w={166} h={134} color={[JOBS[0].col, JOBS[1].col, P.accent][(d + r) % 3]} size={28} opacity={tw(frame, at, 6)} />;
        }),
      )}
      <In at={money} pop>
        <Bubble x={500} y={560} w={620} tail="none" color={P.bad} size={60}>
          …but what's left?
        </Bubble>
      </In>
    </>
  );
};

const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const hour = useBeat("hour", 20);
  const t = tw(frame, Math.max(hour, 20) + 14, 26); // show "what it pays" first, then flip
  const byPay = [1, 0, 2]; // row order by what it pays
  const byHour = [2, 0, 1]; // row order per hour
  return (
    <>
      <Pill x={500} y={0} text={t < 0.5 ? "WHAT IT PAYS" : "PER HOUR OF YOUR TIME"} color={t < 0.5 ? P.ink : P.accent} size={34} />
      {JOBS.map((j, i) => {
        const y = lerp(90 + byPay.indexOf(i) * 200, 90 + byHour.indexOf(i) * 200, t);
        const w = lerp((j.pay / 600) * 560, (j.ph / 327) * 560, t);
        const col = t > 0.5 ? (j.ph === 327 ? P.ok : j.ph === 60 ? P.bad : j.col) : j.col;
        return (
          <div key={j.n} style={{ position: "absolute", left: 60, top: y, width: 880, height: 170, borderRadius: 22, background: P.card, border: `5px solid ${t > 0.5 ? col : P.ink}`, boxSizing: "border-box", padding: "18px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ font: `800 44px/1 ${PH}`, color: P.ink }}>{j.n}</span>
              <span style={{ font: `800 60px/1 ${PH}`, color: col === P.warm ? P.ink : col }}>{t < 0.5 ? `$${j.pay}` : `≈ $${j.ph}/hr`}</span>
            </div>
            <div style={{ marginTop: 18, width: w, height: 36, borderRadius: 10, background: col }} />
          </div>
        );
      })}
      <Label x={500} y={710} w={880} mono size={24}>
        DEMO · TIME + DRIVING ONLY · MATERIALS NOT COUNTED
      </Label>
    </>
  );
};

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const dx = (i: number) => 30 + i * 138;
const H10 = 400; // px for a 10-hour day

const WeekGrid: React.FC<{ children: React.ReactNode; money: number; hours: number; free?: boolean }> = ({ children, money, hours, free }) => (
  <>
    {DAYS.map((d, i) => (
      <div key={d}>
        <Label x={dx(i) + 63} y={0} mono size={26} w={126}>
          {d}
        </Label>
        <Block x={dx(i)} y={40} w={126} h={H10 + 16} color={free && i === 4 ? P.ok : P.line} dashed />
      </div>
    ))}
    {children}
    <Counter x={850} y={90} label="EARNED" value={`$${money.toLocaleString("en-US")}`} color={P.ink} />
    <Counter x={850} y={260} label="HOURS" value={hours} color={P.ink} />
  </>
);

const WeekA: React.FC<{ full?: boolean }> = ({ full }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const n = full ? 5 : Math.max(0, Math.min(5, Math.floor((frame - D * 0.45) / (D * 0.1)) + 1));
  const drive = useBeat("driving", 40);
  return (
    <WeekGrid money={n * 600} hours={n * 10}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i}>
          <Block x={dx(i) + 8} y={48} w={110} h={H10} color={JOBS[1].col} size={26}>
            Job 2<br />10 hrs
          </Block>
          {full && frame >= drive + i * 3 && (
            <Block x={dx(i) + 8} y={48} w={110} h={80} color={P.bad} size={22}>
              2 hrs driving
            </Block>
          )}
        </div>
      ))}
      <Label x={370} y={480} w={700} size={34} color={P.ink}>
        Week A: yes to every big job
      </Label>
    </WeekGrid>
  );
};

const WeekB: React.FC<{ full?: boolean }> = ({ full }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const n = full ? 4 : Math.max(0, Math.min(4, Math.floor((frame - D * 0.35) / (D * 0.13)) + 1));
  const thu = useBeat("thursday", 80);
  const parts = [0, 2, 0, 2]; // two Job 1s and two Job 3s a day
  return (
    <WeekGrid money={n * 1400} hours={Math.round(n * 6.5)} free={full}>
      {Array.from({ length: n }, (_, d) => {
        let y = 48;
        return (
          <div key={d}>
            {parts.map((p, k) => {
              const h = (JOBS[p].hours / 10) * H10 + (p === 2 ? 14 : 0);
              const el = (
                <Block key={k} x={dx(d) + 8} y={y} w={110} h={h - 6} color={JOBS[p].col} size={22}>
                  {JOBS[p].n}
                </Block>
              );
              y += h;
              return el;
            })}
          </div>
        );
      })}
      {full && frame >= thu && (
        <Block x={dx(4) + 8} y={48} w={110} h={H10} color={P.ok} size={30}>
          Day off
        </Block>
      )}
      <Label x={370} y={480} w={700} size={34} color={P.ink}>
        Week B: close by, pays well for the time
      </Label>
    </WeekGrid>
  );
};

const Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const more = useBeat("more", 80);
  const half = useBeat("half", 110);
  const rows = [
    { n: "Week A", m: 3000, h: 50, col: JOBS[1].col },
    { n: "Week B", m: 5600, h: 26, col: P.accent },
  ];
  return (
    <>
      {rows.map((r, i) => (
        <div key={r.n} style={{ position: "absolute", left: 60, top: 40 + i * 330, width: 880, height: 290, borderRadius: 24, background: P.card, border: `5px solid ${i === 1 && frame >= more ? P.ok : P.ink}`, boxSizing: "border-box", padding: "20px 26px" }}>
          <div style={{ font: `800 46px/1 ${PH}`, color: P.ink }}>{r.n}</div>
          {[
            ["EARNED", `$${r.m.toLocaleString("en-US")}`, (r.m / 5600) * 560, more],
            ["HOURS", `${r.h} hrs`, (r.h / 50) * 560, half],
          ].map(([l, v, w, at]) => (
            <div key={String(l)} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
              <span style={{ width: 120, font: `600 24px/1 ${PM}`, color: P.soft }}>{l}</span>
              <div style={{ width: (w as number) * tw(frame, (at as number) - 10, 16), height: 44, borderRadius: 10, background: r.col }} />
              <span style={{ font: `800 44px/1 ${PH}`, color: P.ink, opacity: frame >= (at as number) ? 1 : 0 }}>{v}</span>
            </div>
          ))}
        </div>
      ))}
      <Label x={500} y={720} w={880} mono size={24}>
        DEMO WEEKS · TIME + DRIVING ONLY
      </Label>
    </>
  );
};

const How: React.FC = () => {
  const a = useBeat("paid", 90);
  const b = useBeat("site", 120);
  const c = useBeat("driving", 150);
  const rows: [string, number][] = [
    ["What it paid", a],
    ["Hours on site", b],
    ["Hours driving", c],
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 100, top: 30, width: 800, height: 700, borderRadius: 22, background: P.card, border: `5px solid ${P.ink}`, boxShadow: `0 10px 0 ${P.line}`, boxSizing: "border-box", padding: "30px 40px" }}>
        <div style={{ font: `600 28px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>FOR EVERY JOB, WRITE DOWN</div>
      </div>
      {rows.map(([t, at], i) => (
        <In key={t} at={at}>
          <div style={{ position: "absolute", left: 140, top: 130 + i * 180, width: 720, display: "flex", alignItems: "center", gap: 26, borderBottom: `5px solid ${P.line}`, paddingBottom: 26 }}>
            <span style={{ width: 96, height: 96, borderRadius: 99, background: P.accent, color: "#fff", font: `800 56px/96px ${PH}`, textAlign: "center" }}>{i + 1}</span>
            <span style={{ font: `700 64px/1 ${PF}`, color: P.ink }}>{t}</span>
          </div>
        </In>
      ))}
    </>
  );
};

const Lesson: React.FC = () => {
  const ask = useBeat("ask", 60);
  return (
    <>
      <Bubble x={420} y={60} w={640} color={P.soft} size={56}>
        <span style={{ textDecoration: "line-through", color: P.soft }}>"How busy am I?"</span>
      </Bubble>
      <In at={ask} pop>
        <Bubble x={520} y={360} w={800} color={P.accent} size={72} tail="none">
          "What does each <span style={{ color: P.accent }}>hour</span> bring in?"
        </Bubble>
      </In>
    </>
  );
};

const DEMO = "DEMO NUMBERS · NOT REAL DATA";

export const PAPER_JOBS: Record<string, PaperScene> = {
  hook: { kicker: "BUSY VS PROFITABLE", head: "Full calendar.", accent: "Full pockets?", bad: true, Stage: Hook },
  j1: { kicker: DEMO, head: "Job one:", accent: "$400", Stage: () => <Job i={0} payWord="four" siteWord="two" driveWord="ten" /> },
  j2: { kicker: DEMO, head: "Job two:", accent: "$600", Stage: () => <Job i={1} payWord="six" siteWord="full" driveWord="drive" /> },
  j3: { kicker: DEMO, head: "Job three:", accent: "$300", Stage: () => <Job i={2} payWord="three" siteWord="forty-five" driveWord="five" /> },
  reveal: { kicker: DEMO, head: "The smallest job", accent: "wins", Stage: Reveal },
  "week-a": { kicker: DEMO, head: "Week A:", accent: "every big job", bad: true, Stage: () => <WeekA /> },
  "week-a2": { kicker: DEMO, head: "5 long days,", accent: "lots of driving", bad: true, Stage: () => <WeekA full /> },
  "week-b": { kicker: DEMO, head: "Week B:", accent: "pick your jobs", Stage: () => <WeekB /> },
  "week-b2": { kicker: DEMO, head: "Done on", accent: "Thursday", Stage: () => <WeekB full /> },
  compare: { kicker: DEMO, head: "More money,", accent: "half the hours", Stage: Compare },
  how: { kicker: "FIND YOURS", head: "Write down", accent: "three things", Stage: How },
  lesson: { kicker: "THE BETTER QUESTION", head: "Ask what", accent: "each hour earns", Stage: Lesson },
  cta: { kicker: "ONE BUSINESS FIX, EVERY WEEK", head: "Follow for", accent: "the next one", Stage: Cta },
};
