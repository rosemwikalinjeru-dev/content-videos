import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useBeat } from "../../components/kit";
import { P, PF, PH, PM, PaperScene } from "./kit";
import { Ask, Bot, Chip, Door, Hi, Row, Rows, Say } from "./aikit";
import { Block, Bubble, Cta, In, Label, Person, Pill, tw } from "./world";

const DEMO = "DEMO · NOT A REAL BUSINESS";
const CTA: PaperScene = { kicker: "ONE BUSINESS FIX, EVERY WEEK", head: "Follow for", accent: "the next one", Stage: Cta };

// =====================================================================================
// 7. One morning question. World: three doors the AI checks, then a short list.
// =====================================================================================
const PLACES: [string, string][] = [
  ["Calendar", "calendar"],
  ["Inbox", "inbox"],
  ["Invoices", "invoices"],
  ["A notebook", "notebook"],
  ["Your head", "head"],
];

const Q_Now: React.FC<{ hunt?: boolean }> = ({ hunt }) => {
  const frame = useCurrentFrame();
  const beats = PLACES.map(([, w], i) => useBeat(w, 60 + i * 20));
  const pos = (i: number) => ({ x: 60 + (i % 3) * 300, y: 60 + Math.floor(i / 3) * 190 });
  const k = Math.floor(frame / 12) % 5;
  return (
    <>
      {PLACES.map(([t], i) =>
        hunt || frame >= beats[i] ? <Chip key={t} x={pos(i).x} y={pos(i).y} w={280} h={150} text={t} kind={hunt && k === i ? "blue" : "plain"} size={38} /> : null,
      )}
      {hunt && (
        <>
          <Person x={500} y={720} color={P.pill} s={1.3} label="YOU, EVERY MORNING" />
          <Pill x={500} y={440} text="click… click… click…" color={P.pill} size={36} />
        </>
      )}
    </>
  );
};

const MD = ["Calendar", "Invoices", "Inbox"];
const mX = (i: number) => 200 + i * 300;
const FOUND = ["4 jobs today · 1 has no address", "2 invoices overdue", "1 quote request · no reply since Friday"];

const Q_Sim: React.FC<{ i: number }> = ({ i }) => {
  const at = useBeat(["address", "overdue", "replied"][i], 100);
  const frame = useCurrentFrame();
  const t = tw(frame, 0, 16);
  const from = i === 0 ? 60 : mX(i - 1);
  return (
    <>
      {MD.map((d, k) => (
        <Door key={d} x={mX(k)} y={20} label={d} open={k <= i} hot={k === i} h={230} w={230} />
      ))}
      <Bot x={from + (mX(i) - from) * t} y={520} s={1.15} />
      {FOUND.slice(0, i).map((f, k) => (
        <Chip key={f} x={60} y={560 + k * 92} w={880} h={80} text={f} kind="plain" size={32} />
      ))}
      <In at={at} pop>
        <Chip x={60} y={560 + i * 92} w={880} h={80} text={FOUND[i]} kind="ok" size={32} />
      </In>
    </>
  );
};

const Q_Need: React.FC = () => {
  const up = useBeat("date", 110);
  return (
    <>
      {MD.map((d, k) => (
        <Door key={d} x={mX(k)} y={40} label={d} open h={250} w={230} />
      ))}
      <Chip x={60} y={360} w={420} h={120} text="1. Connected" kind="blue" size={42} />
      <In at={up} pop>
        <Chip x={520} y={360} w={420} h={120} text="2. Up to date" kind="blue" size={42} />
      </In>
    </>
  );
};

const Q_Start: React.FC = () => (
  <div style={{ position: "absolute", left: 100, top: 20, width: 800, height: 700, borderRadius: 22, background: P.card, border: `5px solid ${P.ink}`, boxShadow: `0 10px 0 ${P.line}`, boxSizing: "border-box", padding: "30px 40px" }}>
    <div style={{ font: `600 28px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>MY 3 MORNING QUESTIONS</div>
    {[1, 2, 3].map((n) => (
      <div key={n} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 70 }}>
        <span style={{ width: 90, height: 90, borderRadius: 99, background: P.accent, color: "#fff", font: `800 52px/90px ${PH}`, textAlign: "center" }}>{n}</span>
        <div style={{ flex: 1, borderBottom: `6px solid ${P.line}`, height: 60 }} />
      </div>
    ))}
  </div>
);

const Split: React.FC<{ ai: string; you: string; at: string }> = ({ ai, you, at }) => {
  const b = useBeat(at, 70);
  return (
    <>
      <Bot x={220} y={480} s={1.5} />
      <Chip x={40} y={540} w={360} h={120} text={ai} kind="plain" size={32} />
      <In at={b} pop>
        <Label x={500} y={230} w={120} color={P.ink} head size={100}>
          →
        </Label>
        <Person x={780} y={480} color={P.pill} s={1.6} />
        <Chip x={600} y={540} w={360} h={120} text={you} kind="blue" size={32} />
      </In>
    </>
  );
};

export const AI_MORNING: Record<string, PaperScene> = {
  hook: {
    kicker: "ASK YOUR BUSINESS",
    head: "One question,",
    accent: "every morning",
    Stage: () => (
      <>
        <Person x={200} y={600} color={P.pill} s={1.6} label="YOU" />
        <Bubble x={640} y={140} w={560} size={56} tail="left" color={P.accent}>
          "What needs me today?"
        </Bubble>
      </>
    ),
  },
  now: { kicker: "TODAY", head: "The answer lives in", accent: "five places", bad: true, Stage: () => <Q_Now /> },
  cost: { kicker: "TODAY", head: "Mornings start", accent: "with clicking", bad: true, Stage: () => <Q_Now hunt /> },
  idea: {
    kicker: "PICTURE THIS",
    head: "One",
    accent: "question",
    Stage: () => (
      <>
        <Bubble x={500} y={80} w={820} size={84} tail="left" color={P.accent}>
          "What needs me today?"
        </Bubble>
        <Bot x={780} y={760} s={1.3} />
      </>
    ),
  },
  sim: { kicker: "DEMO MORNING · NOT REAL DATA", head: "It checks", accent: "the calendar", Stage: () => <Q_Sim i={0} /> },
  sim2: { kicker: "DEMO MORNING · NOT REAL DATA", head: "It checks", accent: "the invoices", Stage: () => <Q_Sim i={1} /> },
  sim3: { kicker: "DEMO MORNING · NOT REAL DATA", head: "It checks", accent: "the inbox", Stage: () => <Q_Sim i={2} /> },
  list: {
    kicker: "DEMO MORNING · NOT REAL DATA",
    head: "Your list:",
    accent: "three things",
    Stage: () => (
      <Rows
        rows={[
          ["Get the missing address", "three"],
          ["Reply to the quote request", "things"],
          ["Chase 2 overdue invoices", "order"],
        ]}
        gap={200}
        size={46}
      />
    ),
  },
  honest: { kicker: "THE HONEST PART", head: "It points.", accent: "You do the job.", Stage: () => <Split ai="Shows where to look first" you="Does the work" at="look" /> },
  need: { kicker: "WHAT IT TAKES", head: "Connected, and", accent: "up to date", Stage: Q_Need },
  start: { kicker: "YOUR FIRST STEP", head: "Write your", accent: "three questions", Stage: Q_Start },
  cta: CTA,
};

// =====================================================================================
// 8. Five pages an AI needs. World: a folder that fills with five pages.
// =====================================================================================
const PAGES = [
  { t: "What we do", s: "…and what we don't" },
  { t: "Prices", s: "or how we quote" },
  { t: "Where & when", s: "area and hours" },
  { t: "Our rules", s: "deposits · cancellations · needs my OK" },
  { t: "How we talk", s: "a few real examples" },
];

const Pages: React.FC<{ upTo: number; big?: boolean; hot?: number }> = ({ upTo, big = true, hot }) => (
  <>
    {PAGES.map((p, i) => {
      const on_ = i <= upTo;
      const cur = i === (hot ?? upTo);
      return (
        <div key={p.t} style={{ position: "absolute", left: 40 + i * 186, top: 20 + (cur ? -6 : 0), width: 172, height: 230, borderRadius: 14, background: on_ ? P.card : "transparent", border: on_ ? `5px solid ${cur ? P.accent : P.ink}` : `5px dashed ${P.line}`, boxSizing: "border-box", padding: 14, boxShadow: cur ? `0 8px 0 ${P.line}` : undefined }}>
          <div style={{ font: `800 46px/1 ${PH}`, color: on_ ? P.accent : P.line }}>{i + 1}</div>
          {on_ && <div style={{ font: `700 27px/1.08 ${PF}`, color: P.ink, marginTop: 10 }}>{p.t}</div>}
          {on_ && [0, 1, 2].map((k) => <div key={k} style={{ height: 8, borderRadius: 4, background: P.line, marginTop: 12 }} />)}
        </div>
      );
    })}
    {big && (
      <div style={{ position: "absolute", left: 60, top: 320, width: 880, borderRadius: 26, background: P.pill, color: "#fff", padding: "30px 34px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 28 }}>
        <span style={{ font: `800 150px/0.9 ${PH}`, color: P.warm }}>{upTo + 1}</span>
        <div>
          <div style={{ font: `800 64px/1.05 ${PH}` }}>{PAGES[upTo].t}</div>
          <div style={{ font: `600 36px/1.15 ${PF}`, color: P.line, marginTop: 8 }}>{PAGES[upTo].s}</div>
        </div>
      </div>
    )}
  </>
);

const F_Hook: React.FC = () => {
  const items: [string, string][] = [
    ["Your prices?", "prices"],
    ["Your area?", "area"],
    ["Your rules?", "rules"],
  ];
  const beats = items.map(([, w], i) => useBeat(w, 30 + i * 20));
  return (
    <>
      <Bot x={500} y={420} s={1.6} mark="?" />
      {items.map(([t], i) => (
        <In key={t} at={beats[i]} pop>
          <Chip x={60 + i * 300} y={500} w={280} h={120} text={t} kind="bad" size={36} />
        </In>
      ))}
    </>
  );
};

const F_Why: React.FC = () => (
  <>
    <Bot x={260} y={560} s={1.6} />
    <Block x={540} y={200} w={380} h={300} color={P.line} dashed size={40}>
      <span style={{ color: P.ink }}>
        0 pages
        <br />
        about your business
      </span>
    </Block>
  </>
);

const F_Bonus: React.FC = () => {
  const hire = useBeat("hire", 60);
  return (
    <>
      <Pages upTo={4} big={false} hot={-1} />
      <Bot x={300} y={620} s={1.3} label="AI" />
      <In at={hire} pop>
        <Person x={700} y={620} color={P.pill} s={1.4} label="A NEW HIRE" />
      </In>
      <Label x={500} y={700} w={880} size={40} color={P.ink}>
        Same five pages. Both get it right.
      </Label>
    </>
  );
};

const CQ = "Do you work Saturdays?";
export const AI_FIVE_PAGES: Record<string, PaperScene> = {
  hook: { kicker: "BEFORE AI ANSWERS FOR YOU", head: "It doesn't know", accent: "your business", bad: true, Stage: F_Hook },
  problem: { kicker: DEMO, head: "Confident,", accent: "and wrong", bad: true, Stage: () => <Ask q={CQ} a="Yes! We're open 24/7." aAt={useBeat("confident", 60)} good={false} /> },
  why: { kicker: "WHY", head: "Nobody", accent: "told it", Stage: F_Why },
  p1: { kicker: "PAGE ONE", head: "What you do,", accent: "and don't", Stage: () => <Pages upTo={0} /> },
  p2: { kicker: "PAGE TWO", head: "Your", accent: "prices", Stage: () => <Pages upTo={1} /> },
  p3: { kicker: "PAGE THREE", head: "Where and", accent: "when", Stage: () => <Pages upTo={2} /> },
  p4: { kicker: "PAGE FOUR", head: "Your", accent: "rules", Stage: () => <Pages upTo={3} /> },
  p5: { kicker: "PAGE FIVE", head: "How you", accent: "talk", Stage: () => <Pages upTo={4} /> },
  sim: { kicker: DEMO, head: "Same question,", accent: "before", bad: true, Stage: () => <Ask q={CQ} a="Probably? Most businesses do." aAt={useBeat("after", 70)} good={false} /> },
  sim2: {
    kicker: DEMO,
    head: "Same question,",
    accent: "after",
    Stage: () => (
      <Ask
        q={CQ}
        a={
          <>
            Yes, until 2 PM.
            <br />
            Here's how to book →
          </>
        }
        aAt={useBeat("page", 60)}
        good
      />
    ),
  },
  bonus: { kicker: "THE BONUS", head: "It helps every", accent: "new hire", Stage: F_Bonus },
  cta: CTA,
};

// =====================================================================================
// 9. Making AI actually useful. World: two demo businesses with the same AI.
// =====================================================================================
const FIVE = [
  { t: "One repeated task", s: "like answering new leads" },
  { t: "Tell it how you work", s: "prices · area · rules, written down" },
  { t: "Connect your tools", s: "so it looks things up" },
  { t: "Keep a person checking", s: "money and customers especially" },
  { t: "Count, before and after", s: "how long did a reply take?" },
];

const E_Step: React.FC<{ i: number }> = ({ i }) => (
  <>
    {FIVE.map((f, k) => {
      const on_ = k <= i;
      const cur = k === i;
      return (
        <div key={f.t} style={{ position: "absolute", left: 60, top: 10 + k * 104 + (k > i ? 70 : 0), width: 880, display: "flex", alignItems: "center", gap: 20, opacity: on_ ? 1 : 0.28 }}>
          <span style={{ width: 76, height: 76, flexShrink: 0, borderRadius: 99, background: cur ? P.accent : on_ ? P.warm : P.line, color: cur ? "#fff" : P.ink, font: `800 44px/76px ${PH}`, textAlign: "center" }}>{k + 1}</span>
          <div style={{ flex: 1, background: cur ? P.card : "transparent", border: `5px solid ${cur ? P.ink : "transparent"}`, borderRadius: 20, padding: cur ? "14px 22px" : "4px 22px", boxShadow: cur ? `0 8px 0 ${P.line}` : undefined }}>
            <div style={{ font: `700 ${cur ? 50 : 34}px/1.05 ${PF}`, color: P.ink }}>{f.t}</div>
            {cur && <div style={{ font: `600 30px/1.2 ${PF}`, color: P.soft, marginTop: 6 }}>{f.s}</div>}
          </div>
        </div>
      );
    })}
  </>
);

const Two: React.FC<{ part: 0 | 1 | 2 }> = ({ part }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const helping = useBeat("helping", 110);
  const job = useBeat("job", Math.round(D * 0.7));
  const second = useBeat("second", Math.round(D * 0.45));
  const names = part === 0 ? ["YOU", "A COMPETITOR"] : ["BUSINESS A", "BUSINESS B"];
  const subs = part === 0 ? ["", ""] : ["just chats with it", "gave it a job"];
  return (
    <>
      {[0, 1].map((k) => (
        <div key={k}>
          <Block x={40 + k * 480} y={10} w={440} h={part === 2 ? 760 : 620} color={P.card} ink={P.ink} />
          <Block x={40 + k * 480} y={10} w={440} h={70} color={k === 1 ? P.accent : P.pill} size={30}>
            {names[k]}
          </Block>
          {(part !== 1 || k === 0 || frame >= job - 30) && <Bot x={260 + k * 480} y={part === 2 ? 320 : 400} s={part === 2 ? 1 : 1.4} mark={part === 0 && k === 1 && frame >= helping ? "?" : undefined} />}
          {subs[k] && (part !== 1 || k === 0 || frame >= job) && (
            <Label x={260 + k * 480} y={part === 2 ? 340 : 440} w={400} size={34} color={P.ink}>
              {subs[k]}
            </Label>
          )}
        </div>
      ))}
      {part === 2 && (
        <>
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ position: "absolute", left: 80, top: 420 + r * 60, width: 360 - r * 60, height: 22, borderRadius: 11, background: P.line }} />
          ))}
          <Label x={260} y={620} w={400} size={30}>
            nice paragraphs
          </Label>
          {[0, 1, 2].map((r) => {
            const ok = frame >= second + r * 14;
            return <Chip key={r} x={540} y={410 + r * 92} w={400} h={80} text={ok ? `✓ Lead ${r + 1} answered` : `New lead ${r + 1}`} kind={ok ? "ok" : "plain"} size={30} />;
          })}
          <Label x={760} y={700} w={400} mono size={24}>
            OWNER IS ON A JOB
          </Label>
        </>
      )}
    </>
  );
};

export const AI_EFFICIENT: Record<string, PaperScene> = {
  hook: { kicker: "AI IN YOUR BUSINESS", head: "They use AI.", accent: "Is it helping?", Stage: () => <Two part={0} /> },
  toy: {
    kicker: "WHAT A LOT OF AI USE LOOKS LIKE",
    head: "Nice, but",
    accent: "nothing changes",
    bad: true,
    Stage: () => {
      const a = useBeat("question", 50);
      const b = useBeat("email", 80);
      return (
        <>
          <Bot x={500} y={380} s={1.5} />
          <In at={a} pop>
            <Chip x={60} y={460} w={420} h={120} text="A question here" kind="plain" size={38} />
          </In>
          <In at={b} pop>
            <Chip x={520} y={460} w={420} h={120} text="An email there" kind="plain" size={38} />
          </In>
        </>
      );
    },
  },
  five: {
    kicker: "THE USEFUL VERSION",
    head: "Five",
    accent: "things",
    Stage: () => (
      <div style={{ position: "absolute", left: 0, top: 40, width: 1000, textAlign: "center", font: `800 560px/1 ${PH}`, color: P.accent }}>5</div>
    ),
  },
  s1: { kicker: "ONE", head: "Pick", accent: "one task", Stage: () => <E_Step i={0} /> },
  s2: { kicker: "TWO", head: "Tell it how", accent: "you work", Stage: () => <E_Step i={1} /> },
  s3: { kicker: "THREE", head: "Connect", accent: "your tools", Stage: () => <E_Step i={2} /> },
  s4: { kicker: "FOUR", head: "Keep a person", accent: "checking", Stage: () => <E_Step i={3} /> },
  s5: { kicker: "FIVE", head: "Count,", accent: "before and after", Stage: () => <E_Step i={4} /> },
  sim: { kicker: "DEMO · TWO BUSINESSES, SAME AI", head: "One chats.", accent: "One gives it a job.", Stage: () => <Two part={1} /> },
  sim2: { kicker: "DEMO · NOT REAL DATA", head: "Paragraphs vs", accent: "answered leads", Stage: () => <Two part={2} /> },
  verdict: { kicker: "THE DIFFERENCE", head: "Same tool,", accent: "different setup", Stage: () => <Say lines={[[<>Same tool.</>], [<>The <Hi>setup</Hi> is the difference.</>, "setup"]]} /> },
  start: {
    kicker: "YOUR FIRST STEP",
    head: "Start with",
    accent: "step one",
    Stage: () => (
      <>
        <Row i={0} y={80} text="One task you repeat every day" sub="this week" size={50} />
        <Bot x={500} y={640} s={1.4} />
      </>
    ),
  },
  cta: CTA,
};
