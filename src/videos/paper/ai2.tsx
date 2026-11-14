import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useBeat } from "../../components/kit";
import { Counter, P, PF, PH, PM, PaperScene } from "./kit";
import { Bot, Chip, Door, Hi, Rows, Say } from "./aikit";
import { Block, Bubble, Cta, In, Label, Person, Pill, tw } from "./world";

const DEMO = "DEMO · NOT A REAL BUSINESS";
const CTA: PaperScene = { kicker: "ONE BUSINESS FIX, EVERY WEEK", head: "Follow for", accent: "the next one", Stage: Cta };

// =====================================================================================
// 4. Don't automate a mess. World: a path of steps a new customer travels.
// =====================================================================================
const STEPS = ["Take the call", "Write it on paper", "Type into calendar", "Type into calendar again", "Text the address", "Email the quote", "Type the quote again"];
const DUP = [3, 6]; // done twice
const CUT = [1, 3, 6]; // what goes when you simplify
const KEEP = [0, 2, 4, 5];
const sPos = (i: number) => ({ x: 40 + (i % 4) * 232, y: 60 + Math.floor(i / 4) * 150 });
const kPos = (k: number) => ({ x: 40 + k * 232, y: 130 });

const Path: React.FC<{ upTo?: number; mode?: "all" | "why" | "cut"; at?: number }> = ({ upTo = 7, mode = "all", at = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {STEPS.slice(0, upTo).map((s, i) => {
        const dup = DUP.includes(i);
        const gone = mode === "cut" && CUT.includes(i) ? tw(frame, at + CUT.indexOf(i) * 8, 12) : 0;
        return (
          <div key={i} style={{ opacity: 1 - gone * 0.85 }}>
            <Chip x={sPos(i).x} y={sPos(i).y + gone * 30} w={216} h={130} text={s} kind={dup ? "bad" : "plain"} size={26} />
            <div style={{ position: "absolute", left: sPos(i).x + 8, top: sPos(i).y - 16, width: 40, height: 40, borderRadius: 99, background: P.accent, color: "#fff", font: `800 24px/40px ${PH}`, textAlign: "center" }}>{i + 1}</div>
            {mode === "why" && frame >= at + i * 6 && <div style={{ position: "absolute", left: sPos(i).x + 150, top: sPos(i).y - 22, background: P.warm, color: P.ink, borderRadius: 12, padding: "6px 12px", font: `800 28px/1 ${PH}` }}>why?</div>}
          </div>
        );
      })}
    </>
  );
};

const M_Mess: React.FC = () => {
  const frame = useCurrentFrame();
  const seven = useBeat("seven", 60);
  const twice = useBeat("twice", 150);
  const n = Math.max(0, Math.min(7, Math.floor((frame - seven) / 6) + 1));
  return (
    <>
      <Path upTo={n} />
      <In at={twice} pop>
        <Pill x={500} y={400} text="2 steps are done twice" color={P.pill} size={40} />
      </In>
    </>
  );
};

const M_Worker: React.FC<{ bot?: boolean }> = ({ bot }) => {
  const at = useBeat(bot ? "same" : "catches", 70);
  return (
    <>
      <Path />
      {bot ? <Bot x={200} y={640} s={1.2} /> : <Person x={200} y={640} color={P.pill} s={1.3} mark="✓" markColor={P.warm} />}
      <In at={at} pop>
        <Bubble x={610} y={430} w={600} size={42} tail="left">
          {bot ? "Same 7 steps. Same 2 mistakes." : "Slow, but a person catches the mistakes."}
        </Bubble>
      </In>
    </>
  );
};

const M_Sim: React.FC<{ fixed?: boolean }> = ({ fixed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const pos = fixed ? KEEP.map((_, k) => kPos(k)) : STEPS.map((_, i) => sPos(i));
  const per = (D * 0.75) / 10;
  const done = Math.max(0, Math.min(10, Math.floor((frame - 10) / per)));
  return (
    <>
      {(fixed ? KEEP : STEPS.map((_, i) => i)).map((si, k) => (
        <Chip key={k} x={pos[k].x} y={pos[k].y} w={216} h={130} text={STEPS[si]} kind={!fixed && DUP.includes(si) ? "bad" : "plain"} size={26} />
      ))}
      {fixed && (
        <Block x={kPos(3).x} y={kPos(3).y + 140} w={216} h={70} color={P.warm} size={26}>
          ✓ a person checks
        </Block>
      )}
      {Array.from({ length: 10 }, (_, c) => {
        const t = (frame - 10 - c * per) / (per * 1.6);
        if (t < 0 || t > 1) return null;
        const f = t * (pos.length - 1);
        const a = pos[Math.floor(f)];
        const b = pos[Math.min(pos.length - 1, Math.floor(f) + 1)];
        const u = f - Math.floor(f);
        return <div key={c} style={{ position: "absolute", left: a.x + (b.x - a.x) * u + 86, top: a.y + (b.y - a.y) * u + 100, width: 44, height: 44, borderRadius: 99, background: P.accent, border: `4px solid ${P.ink}`, boxSizing: "border-box" }} />;
      })}
      <Counter x={170} y={560} label="CUSTOMERS" value={done} color={P.ink} />
      <Counter x={500} y={560} label="TYPED TWICE" value={fixed ? 0 : done * 2} color={fixed ? P.accent : P.pill} />
      {fixed && <Counter x={830} y={560} label="CHECKED" value={done} color={P.accent} />}
    </>
  );
};

const M_Fix2: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = useBeat("cut", 10);
  const four = useBeat("four", 80);
  return (
    <>
      <Path mode="cut" at={cut} />
      <Counter x={500} y={420} label="STEPS" value={frame >= four ? 4 : 7} color={P.accent} />
    </>
  );
};

const M_Then: React.FC = () => {
  const person = useBeat("person", 90);
  return (
    <>
      {KEEP.map((si, k) => (
        <Chip key={k} x={kPos(k).x} y={kPos(k).y} w={216} h={130} text={STEPS[si]} kind="blue" size={26} />
      ))}
      <Bot x={250} y={640} s={1.2} label="AUTOMATED" />
      <In at={person} pop>
        <Person x={kPos(3).x + 108} y={640} color={P.warm} s={1.2} mark="✓" markColor={P.warm} label="A PERSON CHECKS" />
      </In>
    </>
  );
};

export const AI_MESS: Record<string, PaperScene> = {
  hook: { kicker: "BEFORE YOU AUTOMATE", head: "Don't automate", accent: "a mess", bad: true, Stage: () => <Say lines={[[<>It doesn't fix it.</>], [<>It just breaks it <Hi>faster</Hi>.</>, "breaks"]]} /> },
  mess: { kicker: DEMO, head: "7 steps to", accent: "book one customer", bad: true, Stage: M_Mess },
  slow: { kicker: DEMO, head: "By hand:", accent: "slow but caught", Stage: () => <M_Worker /> },
  auto: { kicker: DEMO, head: "Automated", accent: "as it is", bad: true, Stage: () => <M_Worker bot /> },
  sim: { kicker: "DEMO · 10 CUSTOMERS · NOT REAL DATA", head: "Mistakes,", accent: "only faster", bad: true, Stage: () => <M_Sim /> },
  why: {
    kicker: "WHY",
    head: "It does what",
    accent: "it's told",
    bad: true,
    Stage: () => (
      <>
        <Bot x={220} y={560} s={1.7} />
        <Bubble x={640} y={160} w={540} size={50} tail="left">
          "Type it twice? OK."
        </Bubble>
      </>
    ),
  },
  fix1: { kicker: "THE FIX", head: "Ask of every step:", accent: "why?", Stage: () => <Path mode="why" at={useBeat("every", 50)} /> },
  fix2: { kicker: "SIMPLIFY", head: "Seven becomes", accent: "four", Stage: M_Fix2 },
  then: { kicker: "THEN AUTOMATE", head: "Automate", accent: "the four", Stage: M_Then },
  sim2: { kicker: "DEMO · 10 CUSTOMERS · NOT REAL DATA", head: "Same customers,", accent: "clean path", Stage: () => <M_Sim fixed /> },
  rule: {
    kicker: "THE RULE",
    head: "In that",
    accent: "order",
    Stage: () => (
      <Rows
        rows={[
          ["Simplify first", "simplify"],
          ["Automate second", "automate"],
        ]}
        gap={220}
        size={68}
      />
    ),
  },
  cta: CTA,
};

// =====================================================================================
// 5. Give an AI agent a job description. World: a hiring card that fills in line by line.
// =====================================================================================
const LINES = [
  { q: "The job", a: "Answer new leads", no: "Not: run my business" },
  { q: "Can touch", a: "The calendar", no: "Not: the bank account" },
  { q: "Never", a: "Refunds · made-up prices · medical advice", no: "" },
  { q: "Asks", a: "The owner, by name", no: "When it isn't sure" },
];

const JobCard: React.FC<{ upTo: number }> = ({ upTo }) => (
  <div style={{ position: "absolute", left: 60, top: 10, width: 880, borderRadius: 24, background: P.card, border: `5px solid ${P.ink}`, boxShadow: `0 10px 0 ${P.line}`, padding: "24px 28px", boxSizing: "border-box" }}>
    <div style={{ font: `600 26px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>JOB DESCRIPTION · AI AGENT</div>
    {LINES.map((l, i) => {
      const on_ = i <= upTo;
      const cur = i === upTo;
      return (
        <div key={l.q} style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 18, padding: "14px 16px", borderRadius: 18, background: cur ? P.paper : "transparent", border: `4px solid ${cur ? P.accent : "transparent"}`, opacity: on_ ? 1 : 0.3 }}>
          <span style={{ width: 70, height: 70, flexShrink: 0, borderRadius: 99, background: on_ ? P.accent : P.line, color: "#fff", font: `800 40px/70px ${PH}`, textAlign: "center" }}>{i + 1}</span>
          <div>
            <div style={{ font: `600 24px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>{l.q.toUpperCase()}</div>
            <div style={{ font: `700 ${cur ? 44 : 34}px/1.1 ${PF}`, color: P.ink, marginTop: 6 }}>{on_ ? l.a : "________"}</div>
            {cur && l.no && <div style={{ font: `600 30px/1.2 ${PF}`, color: P.soft, marginTop: 6 }}>{l.no}</div>}
          </div>
        </div>
      );
    })}
  </div>
);

const J_Hook: React.FC = () => {
  const ai = useBeat("ai", 110);
  return (
    <>
      <Person x={260} y={520} color={P.pill} s={1.6} mark="✓" markColor={P.warm} label="NEW HIRE: HAS ONE" />
      <In at={ai} pop>
        <Bot x={720} y={520} s={1.6} mark="?" label="AI: USUALLY NONE" />
      </In>
    </>
  );
};

const KEYS = ["Calendar", "Email", "Bank", "Customers"];
const J_Keys: React.FC<{ risk?: boolean }> = ({ risk }) => {
  const go = useBeat(risk ? "key" : "everything", 60);
  return (
    <>
      {!risk && (
        <Bubble x={500} y={10} w={700} size={50} tail="left">
          "Here's everything. Go help."
        </Bubble>
      )}
      {KEYS.map((k, i) => (
        <In key={k} at={go + i * 5}>
          <Door x={150 + i * 235} y={risk ? 40 : 230} label={k} open w={200} h={230} />
        </In>
      ))}
      <Bot x={500} y={risk ? 600 : 760} s={1.2} mark="?" />
      {risk && (
        <Label x={500} y={640} w={880} size={42} color={P.ink}>
          Every key. No instructions.
        </Label>
      )}
    </>
  );
};

const J_Sim: React.FC<{ part: 1 | 2 }> = ({ part }) => {
  const not = useBeat("not", 90);
  const owner = useBeat("owner", 70);
  return (
    <>
      <Bubble x={380} y={10} w={640} size={46} tail="left">
        "Can I get a discount?"
      </Bubble>
      <Bot x={200} y={640} s={1.3} />
      {part === 1 ? (
        <In at={not} pop>
          <Chip x={380} y={420} w={560} h={130} text="Not in the job description" kind="bad" size={38} />
        </In>
      ) : (
        <>
          <Bubble x={560} y={250} w={560} size={44} tail="left" color={P.accent}>
            "Let me get the owner."
          </Bubble>
          <In at={owner} pop>
            <Label x={560} y={560} w={100} color={P.ink} head size={90}>
              →
            </Label>
            <Person x={800} y={720} color={P.pill} s={1.3} label="THE OWNER" />
          </In>
        </>
      )}
    </>
  );
};

const J_Review: React.FC = () => {
  const frame = useCurrentFrame();
  const read = useBeat("read", 80);
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const ok = frame >= read + i * 10;
        return (
          <div key={i} style={{ position: "absolute", left: 60, top: 30 + i * 150, width: 640, height: 120, borderRadius: 20, background: P.card, border: `5px solid ${P.ink}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 20, padding: "0 24px" }}>
            <span style={{ width: 64, height: 64, borderRadius: 14, background: ok ? P.accent : "transparent", border: `5px solid ${ok ? P.accent : P.line}`, color: "#fff", font: `800 40px/56px ${PH}`, textAlign: "center", boxSizing: "border-box" }}>{ok ? "✓" : ""}</span>
            <span style={{ font: `700 38px/1 ${PF}`, color: P.ink }}>Conversation {i + 1}</span>
          </div>
        );
      })}
      <Person x={840} y={520} color={P.pill} s={1.3} label="YOU, WEEK ONE" />
    </>
  );
};

export const AI_JOB: Record<string, PaperScene> = {
  hook: { kicker: "SETTING UP AN AI AGENT", head: "No description?", accent: "No hire.", Stage: J_Hook },
  bad: { kicker: "HOW MOST SET IT UP", head: "Here's everything.", accent: "Go help.", bad: true, Stage: () => <J_Keys /> },
  risk: { kicker: "THE RISK", head: "Every key,", accent: "no instructions", bad: true, Stage: () => <J_Keys risk /> },
  j1: { kicker: "LINE ONE", head: "What's", accent: "the job?", Stage: () => <JobCard upTo={0} /> },
  j2: { kicker: "LINE TWO", head: "What can it", accent: "touch?", Stage: () => <JobCard upTo={1} /> },
  j3: { kicker: "LINE THREE", head: "What must it", accent: "never do?", Stage: () => <JobCard upTo={2} /> },
  j4: { kicker: "LINE FOUR", head: "Who does it", accent: "ask?", Stage: () => <JobCard upTo={3} /> },
  sim: { kicker: DEMO, head: "A request", accent: "outside the job", Stage: () => <J_Sim part={1} /> },
  sim2: { kicker: DEMO, head: "It doesn't guess.", accent: "It hands off.", Stage: () => <J_Sim part={2} /> },
  review: { kicker: "LIKE ANY NEW HIRE", head: "Check", accent: "its work", Stage: J_Review },
  verdict: { kicker: "WHAT GOOD LOOKS LIKE", head: "It knows", accent: "its job", Stage: () => <Say lines={[[<>Not the smartest agent.</>], [<>The one that <Hi>knows its job</Hi>.</>, "knows"]]} /> },
  cta: CTA,
};

// =====================================================================================
// 6. What I would not hand to AI. World: a handoff line between the AI and a person.
// =====================================================================================
const Handoff: React.FC<{ ai: string; you: string; at: string }> = ({ ai, you, at }) => {
  const b = useBeat(at, 70);
  return (
    <>
      <Bot x={220} y={480} s={1.5} />
      <Chip x={60} y={540} w={320} h={110} text={ai} kind="plain" size={32} />
      <In at={b} pop>
        <Label x={500} y={230} w={120} color={P.ink} head size={100}>
          →
        </Label>
        <Person x={780} y={480} color={P.pill} s={1.6} />
        <Chip x={620} y={540} w={320} h={110} text={you} kind="blue" size={32} />
      </In>
    </>
  );
};

const Topic: React.FC<{ n: number; title: string; chips: [string, string][] }> = ({ n, title, chips }) => {
  const beats = chips.map(([, w], i) => useBeat(w, 80 + i * 25));
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 20, width: 880, borderRadius: 26, background: P.pill, color: "#fff", padding: "30px 34px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 28 }}>
        <span style={{ font: `800 150px/0.9 ${PH}`, color: P.warm }}>{n}</span>
        <span style={{ font: `800 62px/1.05 ${PH}` }}>{title}</span>
      </div>
      {chips.map(([t], i) => (
        <In key={t} at={beats[i]} pop>
          <Chip x={60 + i * 300} y={330} w={280} h={120} text={t} kind="plain" size={36} />
        </In>
      ))}
      <Person x={500} y={800} color={P.pill} s={1.3} label="KEEP WITH A PERSON" />
    </>
  );
};

const N_Flip: React.FC = () => {
  const items: [string, string][] = [
    ["Reminders", "reminders"],
    ["First replies", "first"],
    ["Sorting", "sorting"],
    ["Notes", "notes"],
  ];
  const beats = items.map(([, w], i) => useBeat(w, 80 + i * 20));
  return (
    <>
      <Bot x={500} y={330} s={1.4} label="GIVE AI THE REPEATED STUFF" />
      {items.map(([t], i) => (
        <In key={t} at={beats[i]} pop>
          <Chip x={60 + (i % 2) * 450} y={420 + Math.floor(i / 2) * 140} w={430} h={120} text={t} kind="ok" size={42} />
        </In>
      ))}
    </>
  );
};

const NEED = [3, 8, 13, 17]; // the few that need a person (demo: 4 of 20)
const N_Sim: React.FC<{ part: 1 | 2 }> = ({ part }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const few = useBeat("few", Math.round(D * 0.7));
  const clears = useBeat("clears", 10);
  const front = useBeat("front", 80);
  const shown = part === 1 ? Math.max(0, Math.min(20, Math.floor(((frame - D * 0.3) / (D * 0.3)) * 20))) : 20;
  const moved = part === 2 ? tw(frame, front, 16) : 0;
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => {
        if (i >= shown) return null;
        const need = NEED.includes(i);
        const marked = need && (part === 2 || frame >= few);
        const cleared = !need && part === 2 && frame >= clears + i * 2;
        const gx = 40 + (i % 5) * 184;
        const gy = 150 + Math.floor(i / 5) * 118;
        const k = NEED.indexOf(i);
        const x = need ? gx + (130 + k * 200 - gx) * moved : gx;
        const y = need ? gy + (10 - gy) * moved : gy;
        return <Chip key={i} x={x} y={y} w={170} h={104} text={marked ? "Needs you" : cleared ? "✓ done" : "Message"} kind={marked ? "bad" : cleared ? "ok" : "plain"} size={26} opacity={cleared && moved > 0 ? 0.55 : 1} />;
      })}
      <Counter x={170} y={650} label="MESSAGES" value={shown} color={P.ink} />
      {(part === 2 || frame >= few) && <Counter x={500} y={650} label="NEED A PERSON" value={4} color={P.pill} />}
      {part === 2 && frame >= clears + 20 && <Counter x={830} y={650} label="AI CLEARED" value={16} color={P.accent} />}
    </>
  );
};

export const AI_NOT_FOR_AI: Record<string, PaperScene> = {
  hook: {
    kicker: "WHERE AI DOESN'T BELONG",
    head: "Three things",
    accent: "I'd keep human",
    Stage: () => (
      <>
        {[1, 2, 3].map((n, i) => (
          <Block key={n} x={60 + i * 300} y={120} w={280} h={400} color={P.pill} size={200}>
            <span style={{ font: `800 220px/1 ${PH}`, color: P.warm }}>{n}</span>
          </Block>
        ))}
      </>
    ),
  },
  one: { kicker: "DON'T HAND OVER", head: "The angry", accent: "customer", bad: true, Stage: () => <Topic n={1} title="The angry customer" chips={[["Wants a person", "person"]]} /> },
  one2: { kicker: "THE SPLIT", head: "AI spots it.", accent: "You call.", Stage: () => <Handoff ai="Spots they're upset" you="Makes the call" at="person" /> },
  two: {
    kicker: "DON'T HAND OVER",
    head: "The price",
    accent: "exception",
    bad: true,
    Stage: () => (
      <Topic
        n={2}
        title="The price exception"
        chips={[
          ["A discount", "discount"],
          ["A refund", "refund"],
          ["A favor", "favor"],
        ]}
      />
    ),
  },
  two2: { kicker: "THE SPLIT", head: "AI prepares.", accent: "You approve.", Stage: () => <Handoff ai="Prepares it" you="Approves it" at="approve" /> },
  three: {
    kicker: "DON'T HAND OVER",
    head: "When wrong is",
    accent: "expensive",
    bad: true,
    Stage: () => (
      <Topic
        n={3}
        title="Wrong = expensive"
        chips={[
          ["Health", "health"],
          ["Legal", "legal"],
          ["Safety", "safety"],
        ]}
      />
    ),
  },
  three2: { kicker: "THE SPLIT", head: "AI notes it.", accent: "You answer.", Stage: () => <Handoff ai="Takes the message" you="Gives the answer" at="shouldnt" /> },
  flip: { kicker: "SO WHAT DOES AI GET?", head: "The", accent: "repeated stuff", Stage: N_Flip },
  sim: { kicker: "DEMO DAY · NOT REAL DATA", head: "20 messages", accent: "come in", Stage: () => <N_Sim part={1} /> },
  sim2: { kicker: "DEMO DAY · NOT REAL DATA", head: "The few,", accent: "in front of you", Stage: () => <N_Sim part={2} /> },
  verdict: { kicker: "THE SPLIT", head: "Routine vs", accent: "moments", Stage: () => <Say lines={[[<>AI for the routine.</>], [<><Hi>People</Hi> for the moments that matter.</>, "people"]]} /> },
  cta: CTA,
};
