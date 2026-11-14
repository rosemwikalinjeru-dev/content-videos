import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useBeat } from "../../components/kit";
import { P, PF, PH, PM, PaperScene, lerp } from "./kit";
import { Ask, Bot, Chip, Door, Hi, Row, Rows, Say } from "./aikit";
import { Block, Bubble, Cta, In, Label, Person, Pill, move, tw } from "./world";

const DEMO = "DEMO · NOT A REAL BUSINESS";
const CTA: PaperScene = { kicker: "ONE BUSINESS FIX, EVERY WEEK", head: "Follow for", accent: "the next one", Stage: Cta };

// =====================================================================================
// 1. Claude without your business vs with it. World: the AI and three doors (your tools).
// =====================================================================================
const DOORS = ["Calendar", "Email", "Files"];
const dX = (i: number) => 330 + i * 250;

const C_Hook: React.FC = () => {
  const connect = useBeat("connect", 80);
  return (
    <>
      <Bot x={260} y={520} s={1.6} mark="?" label="GUESSES" />
      <In at={connect} pop>
        <Bot x={720} y={520} s={1.6} mark="✓" markColor={P.accent} label="LOOKS IT UP" />
        <Label x={490} y={300} w={100} color={P.ink} head size={90}>
          →
        </Label>
      </In>
    </>
  );
};

const C_Alone: React.FC = () => {
  const world = useBeat("world", 40);
  const nothing = useBeat("nothing", 90);
  return (
    <>
      <Block x={250} y={40} w={500} h={520} color={P.line} dashed />
      <Bot x={500} y={500} s={1.6} />
      <In at={world} pop>
        <Chip x={60} y={620} w={420} h={110} text="✓ Knows the world" kind="ok" size={36} />
      </In>
      <In at={nothing} pop>
        <Chip x={520} y={620} w={420} h={110} text="✕ Your Tuesday" kind="bad" size={36} />
      </In>
    </>
  );
};

const C_Connect: React.FC = () => {
  const frame = useCurrentFrame();
  const beats = [useBeat("calendar", 50), useBeat("email", 75), useBeat("files", 100)];
  return (
    <>
      <Bot x={120} y={520} s={1.2} />
      {DOORS.map((d, i) => (
        <Door key={d} x={dX(i)} y={180} label={d} open={frame >= beats[i]} />
      ))}
      <Label x={580} y={520} w={720} size={38} color={P.ink}>
        Each door is one you choose to open
      </Label>
    </>
  );
};

const C_Sim: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const res = ["4 booked tomorrow", "2 emails with no reply", "1 quote to send"];
  const seg = (D - 20) / 3;
  const i = Math.min(2, Math.floor(frame / seg));
  const t = tw(frame, i * seg, 14);
  const bx = lerp(i === 0 ? 80 : dX(i - 1), dX(i), t);
  return (
    <>
      {DOORS.map((d, k) => (
        <Door key={d} x={dX(k)} y={20} label={d} open hot={k === i} h={230} />
      ))}
      <Bot x={bx} y={520} s={1.15} />
      {res.map((r, k) =>
        frame >= k * seg + 18 ? (
          <Chip key={r} x={60} y={560 + k * 92} w={880} h={80} text={`${k + 1}.  ${r}`} kind="ok" size={36} />
        ) : null,
      )}
    </>
  );
};

const C_Limit: React.FC = () => {
  const good = useBeat("good", 110);
  return (
    <>
      <Door x={250} y={60} label="Calendar" open />
      <Door x={500} y={60} label="Email" open />
      <Door x={750} y={60} label="Invoices" />
      <Label x={500} y={390} w={880} size={42} color={P.ink}>
        It only sees the doors you open
      </Label>
      <In at={good}>
        <Chip x={110} y={500} w={780} h={110} text="Messy calendar in → messy answers out" kind="bad" size={36} />
      </In>
    </>
  );
};

const C_Check: React.FC = () => {
  const approves = useBeat("approves", 90);
  return (
    <>
      <div style={{ position: "absolute", left: 100, top: 30, width: 800, borderRadius: 24, background: P.card, border: `5px solid ${P.ink}`, boxShadow: `0 10px 0 ${P.line}`, padding: "26px 32px", boxSizing: "border-box" }}>
        <div style={{ font: `600 26px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>DRAFT · NOT SENT</div>
        <div style={{ font: `800 48px/1.1 ${PH}`, color: P.ink, marginTop: 12 }}>Reply to Dana</div>
        <div style={{ font: `600 36px/1.25 ${PF}`, color: P.soft, marginTop: 14 }}>"Hi Dana, yes, we can do Thursday at 10…"</div>
        <div style={{ display: "flex", gap: 18, marginTop: 28 }}>
          <span style={{ background: P.accent, color: "#fff", borderRadius: 16, padding: "18px 34px", font: `800 40px/1 ${PH}` }}>Approve</span>
          <span style={{ border: `5px solid ${P.ink}`, color: P.ink, borderRadius: 16, padding: "14px 34px", font: `800 40px/1 ${PH}` }}>Edit</span>
        </div>
      </div>
      <In at={approves} pop>
        <Pill x={500} y={520} text="You approve before it sends" color={P.pill} size={40} />
      </In>
    </>
  );
};

const C_Start: React.FC = () => {
  const frame = useCurrentFrame();
  const one = useBeat("one", 50);
  const ask = useBeat("ask", 90);
  return (
    <>
      <Door x={230} y={90} label="Calendar" open={frame >= one} w={260} h={360} />
      <In at={ask} pop>
        <Bubble x={670} y={150} w={500} size={46} tail="left" color={P.accent}>
          "Who's booked tomorrow?"
        </Bubble>
      </In>
      <Label x={500} y={540} w={880} size={40} color={P.ink}>
        One door. One question.
      </Label>
    </>
  );
};

export const AI_CONNECTED: Record<string, PaperScene> = {
  hook: { kicker: "CONNECTING AI TO YOUR BUSINESS", head: "Guessing vs", accent: "looking it up", Stage: C_Hook },
  alone: { kicker: "ON ITS OWN", head: "It doesn't know", accent: "your business", bad: true, Stage: C_Alone },
  ask1: { kicker: DEMO, head: "So it", accent: "can't answer", bad: true, Stage: () => <Ask q="Who's booked tomorrow?" a="I can't see your calendar." aAt={useBeat("says", 80)} good={false} /> },
  connect: { kicker: "NOW CONNECT IT", head: "Open", accent: "three doors", Stage: C_Connect },
  ask2: {
    kicker: DEMO,
    head: "Now it",
    accent: "looks it up",
    Stage: () => (
      <Ask
        q="Who's booked tomorrow?"
        a={
          <>
            9:00 Dana
            <br />
            11:30 Lee
            <br />
            2:00 Park
          </>
        }
        aAt={useBeat("opens", 90)}
        good
      />
    ),
  },
  more: { kicker: DEMO, head: "Ask it", accent: "anything in there", Stage: () => <Ask q="Who emailed and got no reply?" a="Two customers: Dana (Mon) and Lee (Tue)." aAt={useBeat("checks", 90)} good /> },
  sim: { kicker: "DEMO MORNING · NOT REAL DATA", head: "3 questions,", accent: "3 doors", Stage: C_Sim },
  limit: { kicker: "THE HONEST PART", head: "It sees only", accent: "what you connect", bad: true, Stage: C_Limit },
  check: { kicker: "KEEP CONTROL", head: "You stay", accent: "the approver", Stage: C_Check },
  start: { kicker: "YOUR FIRST STEP", head: "Start", accent: "small", Stage: C_Start },
  verdict: {
    kicker: "THE DIFFERENCE",
    head: "A toy, or",
    accent: "a helper",
    Stage: () => (
      <Say
        lines={[
          [<>AI that guesses is a toy.</>],
          [
            <>
              AI that can <Hi>look things up</Hi> is a helper.
            </>,
            "look",
          ],
        ]}
      />
    ),
  },
  cta: CTA,
};

// =====================================================================================
// 2. Chatbot, automation, agent. World: three helpers side by side, one customer request.
// =====================================================================================
const TRIO = [
  { n: "CHATBOT", sub: "answers questions", col: P.warm },
  { n: "AUTOMATION", sub: "follows a checklist", col: P.pill },
  { n: "AGENT", sub: "decides the next step", col: P.accent },
];
const tX = (i: number) => 180 + i * 320;

const Trio: React.FC<{ show?: number; hot?: number; y?: number; subs?: boolean }> = ({ show = 3, hot, y = 760, subs }) => (
  <>
    {TRIO.slice(0, show).map((t, i) => (
      <div key={t.n}>
        <Bot x={tX(i)} y={y - 40} s={1.15} color={t.col} dim={hot !== undefined && hot !== i} label={t.n} />
        {subs && (
          <Label x={tX(i)} y={y + 46} w={300} size={28} color={P.ink}>
            {t.sub}
          </Label>
        )}
      </div>
    ))}
  </>
);

const H_One: React.FC<{ i: number }> = ({ i }) => (
  <>
    <Trio show={i + 1} hot={i} y={520} subs />
    <Chip x={110} y={640} w={780} h={120} text={["It answers. That's all.", "Same steps, every time.", "Decides, then uses your tools."][i]} kind={i === 2 ? "blue" : i === 1 ? "bad" : "ok"} size={42} />
  </>
);

const REQ = "Can I move my appointment to Friday?";
const H_Sim: React.FC = () => {
  const writes = useBeat("writes", 70);
  return (
    <>
      <In at={writes} pop>
        <Bubble x={500} y={20} w={780} size={48} tail="left">
          "{REQ}"
        </Bubble>
      </In>
      <Trio />
    </>
  );
};

const H_Reply: React.FC<{ i: number; reply: string; note: string; noteAt: string }> = ({ i, reply, note, noteAt }) => {
  const at = useBeat(noteAt, 90);
  return (
    <>
      <Bubble x={500} y={10} w={820} size={38} tail="none" color={P.line}>
        "{REQ}"
      </Bubble>
      <Bubble x={500} y={190} w={760} size={46} tail={i === 0 ? "left" : "right"} color={TRIO[i].col === P.warm ? P.ink : TRIO[i].col}>
        {reply}
      </Bubble>
      <In at={at} pop>
        <Pill x={500} y={400} text={note} color={P.pill} size={36} />
      </In>
      <Trio hot={i} />
    </>
  );
};

const H_Agent: React.FC = () => {
  const steps: [string, string][] = [
    ["Checks Friday", "checks"],
    ["Friday is full", "full"],
    ["Offers Thursday", "thursday"],
    ["Books it", "books"],
    ["Tells you", "tells"],
  ];
  const beats = steps.map(([, w], i) => useBeat(w, 10 + i * 30));
  return (
    <>
      {steps.map(([t], i) => (
        <In key={t} at={beats[i]} pop>
          <Chip x={60 + (i % 3) * 300} y={30 + Math.floor(i / 3) * 130} w={280} h={110} text={`${i + 1}. ${t}`} kind={i === 4 ? "ok" : "blue"} size={34} />
        </In>
      ))}
      <Trio hot={2} />
    </>
  );
};

const H_Cost: React.FC = () => {
  const rules = useBeat("rules", 90);
  const checking = useBeat("checking", 120);
  return (
    <>
      <Bot x={500} y={420} s={1.6} color={P.accent} label="AGENT" />
      <In at={rules} pop>
        <Chip x={60} y={560} w={420} h={130} text="Rules" kind="bad" size={54} />
      </In>
      <In at={checking} pop>
        <Chip x={520} y={560} w={420} h={130} text="Someone checking" kind="bad" size={42} />
      </In>
    </>
  );
};

export const AI_THREE_HIRES: Record<string, PaperScene> = {
  hook: { kicker: "AI AGENTS, PLAINLY", head: "Three different", accent: "helpers", Stage: () => <Trio y={600} subs /> },
  one: { kicker: "NUMBER ONE", head: "A", accent: "chatbot", Stage: () => <H_One i={0} /> },
  two: { kicker: "NUMBER TWO", head: "An", accent: "automation", Stage: () => <H_One i={1} /> },
  three: { kicker: "NUMBER THREE", head: "An", accent: "agent", Stage: () => <H_One i={2} /> },
  sim: { kicker: DEMO, head: "One request,", accent: "three helpers", Stage: H_Sim },
  sim1: { kicker: DEMO, head: "The chatbot", accent: "answers", bad: true, Stage: () => <H_Reply i={0} reply={'"Sure! Call the office."'} note="Nothing actually moved" noteAt="nothing" /> },
  sim2: { kicker: DEMO, head: "The automation", accent: "sends a link", Stage: () => <H_Reply i={1} reply="Here's your reschedule link →" note="Great, if Friday is simple" noteAt="great" /> },
  sim3: { kicker: DEMO, head: "The agent", accent: "works it out", Stage: H_Agent },
  cost: { kicker: "THE CATCH", head: "More freedom,", accent: "more risk", bad: true, Stage: H_Cost },
  pick: {
    kicker: "HOW TO CHOOSE",
    head: "Pick by",
    accent: "the job",
    Stage: () => (
      <Rows
        rows={[
          ["Same answer every time", "answer", "→ a chatbot"],
          ["Same steps every time", "steps", "→ an automation"],
        ]}
        gap={220}
        color={P.pill}
      />
    ),
  },
  pick2: {
    kicker: "HOW TO CHOOSE",
    head: "Only then,",
    accent: "an agent",
    Stage: () => (
      <>
        <Row i={2} y={70} text="Steps change every time" sub="→ an agent" />
        <Bot x={500} y={640} s={1.5} label="AGENT" />
      </>
    ),
  },
  cta: CTA,
};

// =====================================================================================
// 3. Your operating system is your memory. World: the owner's head and one board.
// =====================================================================================
const COLS = ["Customers", "Jobs", "Money", "Follow-ups"];
const cX = (i: number) => 40 + i * 232;
const HEADS = [
  { t: "Quote for Dana?", col: 0 },
  { t: "Lee hasn't paid", col: 2 },
  { t: "Thursday job", col: 1 },
  { t: "Call Sam back", col: 3 },
];
const hPos = [
  { x: 130, y: 60 },
  { x: 390, y: 20 },
  { x: 650, y: 60 },
  { x: 390, y: 160 },
];

const Board: React.FC<{ show?: number[]; y?: number; h?: number; hot?: number; children?: React.ReactNode }> = ({ show = [0, 0, 0, 0], y = 40, h = 440, hot, children }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {COLS.map((c, i) =>
        frame >= show[i] ? (
          <div key={c} style={{ opacity: tw(frame, show[i], 8) }}>
            <Block x={cX(i)} y={y} w={216} h={h} color={P.card} ink={P.ink} />
            <Block x={cX(i)} y={y} w={216} h={64} color={hot === i ? P.accent : P.pill} size={28}>
              {c}
            </Block>
          </div>
        ) : null,
      )}
      {children}
    </>
  );
};
const BCard: React.FC<{ col: number; row: number; text: string; y?: number; kind?: "plain" | "ok" | "blue" }> = ({ col, row, text, y = 40, kind = "ok" }) => (
  <Chip x={cX(col) + 10} y={y + 78 + row * 98} w={196} h={86} text={text} kind={kind} size={24} />
);

const Owner: React.FC<{ upTo?: number[]; dim?: boolean; sign?: string }> = ({ upTo = [0, 0, 0, 0], dim, sign }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {HEADS.map((h, i) =>
        frame >= upTo[i] ? (
          <div key={h.t} style={{ opacity: tw(frame, upTo[i], 8) * (dim ? 0.25 : 1) }}>
            <Chip x={hPos[i].x} y={hPos[i].y + Math.sin(frame / 12 + i) * 5} w={230} h={90} text={h.t} size={26} />
          </div>
        ) : null,
      )}
      <Person x={500} y={640} color={P.pill} s={1.7} dim={dim} label="YOU" />
      {sign && <Pill x={500} y={720} text={sign} color={P.pill} size={38} />}
    </>
  );
};

const O_Head: React.FC = () => <Owner upTo={[useBeat("quote", 20), useBeat("paid", 50), useBeat("thursday", 80), 9999]} />;
const O_Risk: React.FC = () => {
  const frame = useCurrentFrame();
  const forgets = useBeat("forgets", 90);
  return <Owner dim={frame >= forgets - 20} sign={frame >= forgets ? "The business forgets" : undefined} />;
};
const O_Idea: React.FC = () => {
  const one = useBeat("one", 110);
  return (
    <>
      <Board show={[one, one + 4, one + 8, one + 12]} y={120} h={380} />
      <In at={one + 20}>
        <Label x={500} y={540} w={880} size={42} color={P.ink}>
          One place where the business remembers
        </Label>
      </In>
    </>
  );
};
const O_Lists: React.FC = () => <Board show={[useBeat("customers", 30), useBeat("jobs", 60), useBeat("money", 90), useBeat("follow-ups", 120)]} y={80} h={520} />;
const O_Move: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  return (
    <>
      <Board y={300} h={440} />
      {HEADS.map((h, i) => {
        const at = 20 + (i * (D - 50)) / 4;
        const from = { x: 140 + i * 230, y: 110 };
        const to = { x: cX(h.col) + 108, y: 300 + 78 + 43 };
        const p = move(frame, at, 18, from, to);
        return <Chip key={h.t} x={p.x - 98} y={p.y - 43} w={196} h={86} text={h.t} kind={frame >= at + 18 ? "ok" : "plain"} size={24} />;
      })}
      <Label x={500} y={10} w={880} mono size={26}>
        OUT OF YOUR HEAD ↓ ONTO THE BOARD
      </Label>
    </>
  );
};
const O_Sim: React.FC<{ part: 1 | 2 }> = ({ part }) => {
  const frame = useCurrentFrame();
  const lead = useBeat("lead", 70);
  const lands = useBeat("lands", 110);
  const quote = useBeat("quote", 10);
  const follow = useBeat("follow-up", 60);
  const p = move(frame, lands, 16, { x: 500, y: -40 }, { x: cX(0) + 108, y: 80 + 78 + 98 + 43 });
  return (
    <Board y={80} h={520}>
      <BCard col={0} row={0} text="Dana" y={80} kind="plain" />
      <BCard col={1} row={0} text="Thursday job" y={80} kind="plain" />
      <BCard col={2} row={0} text="Lee: unpaid" y={80} kind="plain" />
      {part === 1 && frame >= lead && <Chip x={p.x - 98} y={p.y - 43} w={196} h={86} text="New lead: Sam" kind="blue" size={24} />}
      {part === 2 && <BCard col={0} row={1} text="New lead: Sam" y={80} kind="blue" />}
      {part === 2 && frame >= quote && <BCard col={1} row={1} text="Quote sent: Sam" y={80} />}
      {part === 2 && frame >= follow && <BCard col={3} row={0} text="Check in: Thu" y={80} />}
    </Board>
  );
};
const O_Ai: React.FC = () => {
  const tells = useBeat("tells", 100);
  return (
    <>
      <Board y={20} h={330}>
        <BCard col={0} row={0} text="New lead: Sam" y={20} kind="blue" />
        <BCard col={1} row={0} text="Thursday job" y={20} kind="plain" />
        <BCard col={2} row={0} text="Lee: unpaid" y={20} kind="plain" />
        <BCard col={3} row={0} text="Check in: Thu" y={20} kind="plain" />
      </Board>
      <Bot x={140} y={800} s={1.2} />
      <In at={tells} pop>
        <Bubble x={610} y={430} w={640} size={40} tail="left" color={P.accent}>
          Today: 1. Call Sam back
          <br />
          2. Chase Lee's invoice
        </Bubble>
      </In>
    </>
  );
};
const O_Start: React.FC = () => (
  <>
    <Board y={80} h={420} hot={2} />
    <Label x={500} y={540} w={880} size={42} color={P.ink}>
      One list this week. The one you'd lose sleep over.
    </Label>
  </>
);

export const AI_OPERATING_SYSTEM: Record<string, PaperScene> = {
  hook: { kicker: "AI OPERATING SYSTEM, PLAINLY", head: "Your business runs on", accent: "your memory", bad: true, Stage: () => <Owner /> },
  head: { kicker: "WHAT YOU'RE CARRYING", head: "It's all in", accent: "your head", bad: true, Stage: O_Head },
  risk: { kicker: "THE RISK", head: "You're out.", accent: "It forgets.", bad: true, Stage: O_Risk },
  idea: { kicker: "WHAT IT REALLY IS", head: "One place that", accent: "remembers", Stage: O_Idea },
  lists: { kicker: "THE BOARD", head: "Four", accent: "lists", Stage: O_Lists },
  move: { kicker: "STEP ONE", head: "Head →", accent: "board", Stage: O_Move },
  sim: { kicker: "DEMO MONDAY · NOT REAL DATA", head: "A lead lands", accent: "on the board", Stage: () => <O_Sim part={1} /> },
  sim2: { kicker: "DEMO MONDAY · NOT REAL DATA", head: "Nobody had to", accent: "remember", Stage: () => <O_Sim part={2} /> },
  ai: { kicker: "WHERE AI COMES IN", head: "It reads", accent: "the board", Stage: O_Ai },
  order: {
    kicker: "THE ORDER MATTERS",
    head: "Board first,",
    accent: "AI second",
    Stage: () => (
      <Rows
        rows={[
          ["The board", "board", "written down, in one place"],
          ["Then AI", "second", "it can only organize what's written"],
        ]}
        gap={230}
      />
    ),
  },
  start: { kicker: "YOUR FIRST STEP", head: "Start with", accent: "one list", Stage: O_Start },
  cta: CTA,
};
