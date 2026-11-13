import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useBeat } from "../../components/kit";
import { Card, Counter, P, PF, PH, PM, PaperScene, lerp } from "./kit";
import { Block, Bubble, Cta, In, Label, Person, Pill, move, tw } from "./world";

// "The day your best employee quits." One world: her, what she knows (cards around her head),
// and a shared folder that starts empty and fills one page at a time. Demo story, no statistics.

const HER = P.accent;
const KNOWS = ["Supplier codes", "Tricky customers", "The real schedule"];
const kPos = [
  { x: 150, y: 150 },
  { x: 330, y: 70 },
  { x: 510, y: 150 },
];

const Folder: React.FC<{ x: number; y: number; w?: number; h?: number; label?: string; children?: React.ReactNode; color?: string }> = ({ x, y, w = 360, h = 300, label = "SHARED FOLDER", children, color = P.warm }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w * 0.42, height: 44, background: color, border: `5px solid ${P.ink}`, borderBottom: "none", borderRadius: "16px 16px 0 0", boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: 0, top: 38, width: w, height: h - 38, background: color, border: `5px solid ${P.ink}`, borderRadius: "0 18px 18px 18px", boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: h + 10, textAlign: "center", font: `600 26px/1 ${PM}`, letterSpacing: "0.06em", color: P.soft }}>{label}</div>
    {children}
  </div>
);

const Page: React.FC<{ x: number; y: number; title: string; s?: number; checks?: number; rot?: number }> = ({ x, y, title, s = 1, checks = 0, rot = 0 }) => (
  <div style={{ position: "absolute", left: x - 110 * s, top: y, width: 220 * s, height: 260 * s, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 14, boxShadow: `0 6px 0 ${P.line}`, padding: 16 * s, boxSizing: "border-box", transform: `rotate(${rot}deg)` }}>
    <div style={{ font: `800 ${26 * s}px/1.05 ${PH}`, color: P.ink }}>{title}</div>
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 * s, marginTop: 16 * s }}>
        <div style={{ width: 26 * s, height: 26 * s, borderRadius: 6, border: `4px solid ${i < checks ? P.ok : P.line}`, background: i < checks ? P.ok : "transparent", color: "#fff", font: `800 ${18 * s}px/${20 * s}px ${PH}`, textAlign: "center", boxSizing: "border-box" }}>{i < checks ? "✓" : ""}</div>
        <div style={{ flex: 1, height: 10 * s, borderRadius: 5, background: P.line }} />
      </div>
    ))}
  </div>
);

const Know: React.FC<{ upTo?: number[]; dx?: number; fade?: number }> = ({ upTo = [0, 0, 0], dx = 0, fade = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {KNOWS.map((k, i) => {
        if (frame < upTo[i]) return null;
        const t = tw(frame, upTo[i], 10);
        return (
          <div key={k} style={{ opacity: t * fade }}>
            <Card x={kPos[i].x + dx} y={kPos[i].y + (1 - t) * 30 + Math.sin(frame / 12 + i) * 5} text={k} scale={1.15} />
          </div>
        );
      })}
    </>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const quits = useBeat("quits", 70);
  const t = tw(frame, quits, 20);
  return (
    <>
      <Know />
      <Person x={lerp(330, 760, t)} y={600} color={HER} s={1.5} label="YOUR BEST EMPLOYEE" />
      <Block x={820} y={300} w={130} h={300} color={P.bad} dashed size={30}>
        EXIT
      </Block>
    </>
  );
};

const Head: React.FC = () => {
  const a = useBeat("supplier", 20);
  const b = useBeat("tricky", 50);
  const c = useBeat("schedule", 90);
  const none = useBeat("none", 140);
  return (
    <>
      <Know upTo={[a, b, c]} />
      <Person x={330} y={600} color={HER} s={1.5} />
      <In at={none}>
        <Folder x={770} y={300} w={300} h={250} label="WRITTEN DOWN" />
        <Label x={770} y={400} color={P.ink} head size={64}>
          0
        </Label>
      </In>
    </>
  );
};

const Leave: React.FC = () => {
  const frame = useCurrentFrame();
  const go = useBeat("leaves", 14);
  const t = tw(frame, go, 34);
  return (
    <>
      <Know dx={t * 760} fade={1 - t * 0.6} />
      <div style={{ opacity: 1 - t * 0.5 }}>
        <Person x={330 + t * 760} y={600} color={HER} s={1.5} />
      </div>
      <Block x={820} y={300} w={130} h={300} color={P.bad} dashed size={30}>
        EXIT
      </Block>
      <In at={go + 30}>
        <Folder x={330} y={330} w={300} h={250} label="WRITTEN DOWN" />
        <Label x={330} y={430} color={P.ink} head size={64}>
          0
        </Label>
      </In>
    </>
  );
};

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const dayX = (i: number) => 40 + i * 184;
const Week: React.FC<{ hits: [number, number, string][]; team?: number }> = ({ hits, team }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {DAYS.map((d, i) => (
        <div key={d}>
          <Label x={dayX(i) + 84} y={40} mono size={28} w={168}>
            {d}
          </Label>
          <Block x={dayX(i)} y={86} w={168} h={380} color={P.paper2} ink={P.ink} />
        </div>
      ))}
      {hits.map(([day, at, text]) => {
        if (frame < at) return null;
        const t = tw(frame, at, 12);
        return (
          <Block key={text} x={dayX(day) + 8} y={lerp(-80, 130 + day * 40, t)} w={152} h={150} color={P.bad} size={25}>
            {text}
          </Block>
        );
      })}
      {team !== undefined &&
        [0, 1, 2].map((i) => (
          <In key={i} at={team + i * 5}>
            <Person x={260 + i * 220} y={790} color={P.warm} s={1.25} mark="?" />
          </In>
        ))}
    </>
  );
};

const Sim: React.FC = () => {
  const a = useBeat("order", 60);
  const b = useBeat("regular", 110);
  const c = useBeat("double", 170);
  return (
    <Week
      hits={[
        [0, a, "Order went in late"],
        [2, b, "Wrong price for a regular"],
        [4, c, "Double booked"],
      ]}
    />
  );
};

const Sim2: React.FC = () => {
  const know = useBeat("know", 50);
  return (
    <Week
      hits={[
        [0, -99, "Order went in late"],
        [2, -99, "Wrong price for a regular"],
        [4, -99, "Double booked"],
      ]}
      team={Math.max(4, know - 20)}
    />
  );
};

const Fix: React.FC = () => {
  const frame = useCurrentFrame();
  const pick = useBeat("pick", 60);
  const write = useBeat("write", 110);
  const p = move(frame, pick, 22, kPos[0], { x: 740, y: 300 });
  const landed = frame >= write;
  return (
    <>
      <Pill x={330} y={10} text="1 HOUR A WEEK" color={P.accent} />
      <Person x={330} y={640} color={HER} s={1.5} />
      {!landed && <Card x={frame < pick ? kPos[0].x : p.x} y={(frame < pick ? kPos[0].y : p.y) + 60} text={KNOWS[0]} scale={1.15} />}
      {[1, 2].map((i) => (
        <Card key={i} x={kPos[i].x} y={kPos[i].y + 60} text={KNOWS[i]} scale={1.15} />
      ))}
      <In at={write} pop>
        <Page x={740} y={230} title="Supplier codes" s={1.35} />
      </In>
    </>
  );
};

const Test: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const follow = useBeat("follow", 60);
  const without = useBeat("without", 110);
  const checks = Math.max(0, Math.min(4, Math.floor((frame - follow) / Math.max(6, (D - follow) / 6))));
  return (
    <>
      <Page x={330} y={120} title="Supplier codes" s={1.6} checks={checks} />
      <Person x={760} y={600} color={P.warm} s={1.5} label="SOMEONE NEW" />
      <In at={without} pop>
        <Pill x={500} y={720} text="✓ Didn't need to ask her" color={P.ok} size={38} />
      </In>
    </>
  );
};

const Which: React.FC = () => {
  const frame = useCurrentFrame();
  const only = useBeat("only", 50);
  const miss = useBeat("miss", 100);
  const rows = ["A task anyone can do", "A task only she can do", "A task done once a year"];
  return (
    <>
      {rows.map((r, i) => {
        const hot = i === 1 && frame >= only;
        return (
          <div key={r} style={{ position: "absolute", left: 60, top: 60 + i * 170, width: 880, height: 130, borderRadius: 22, background: P.card, border: `5px solid ${hot ? P.accent : P.line}`, boxShadow: hot ? `0 10px 0 ${P.line}` : undefined, display: "flex", alignItems: "center", padding: "0 30px", boxSizing: "border-box", font: `700 46px/1.1 ${PF}`, color: hot || frame < only ? P.ink : P.soft, transform: hot ? "scale(1.04)" : undefined }}>
            {r}
            {hot && <span style={{ marginLeft: "auto", background: P.accent, color: "#fff", borderRadius: 999, padding: "10px 20px", font: `800 30px/1 ${PH}` }}>START HERE</span>}
          </div>
        );
      })}
      <In at={miss}>
        <Label x={500} y={590} w={860} color={P.ink} size={40}>
          …and you'd miss it tomorrow
        </Label>
      </In>
    </>
  );
};

const Keep: React.FC = () => {
  const frame = useCurrentFrame();
  const folder = useBeat("folder", 60);
  const page = useBeat("page", 90);
  const titles = ["Supplier codes", "Tricky customers", "The real schedule"];
  return (
    <>
      <In at={Math.max(0, folder - 30)}>
        <Folder x={500} y={300} w={760} h={420} />
      </In>
      {titles.map((t, i) => {
        const at = page + i * 9;
        if (frame < at) return null;
        const p = move(frame, at, 14, { x: 500, y: -40 }, { x: 280 + i * 220, y: 380 });
        return <Page key={t} x={p.x} y={p.y} title={t} s={0.9} rot={(i - 1) * 3} />;
      })}
    </>
  );
};

const Bonus: React.FC = () => {
  const frame = useCurrentFrame();
  const vac = useBeat("vacation", 70);
  const t = tw(frame, vac, 16);
  return (
    <>
      <Folder x={300} y={330} w={420} h={300}>
        <Page x={210} y={70} title="Her tasks" s={0.8} checks={4} />
      </Folder>
      <Person x={lerp(520, 780, t)} y={640} color={HER} s={1.5} />
      <In at={vac} pop>
        <svg width={200} height={200} style={{ position: "absolute", left: 690, top: 60 }}>
          <circle cx={100} cy={100} r={54} fill={P.warm} stroke={P.ink} strokeWidth={6} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line key={i} x1={100} y1={100} x2={100 + Math.cos((i * Math.PI) / 4) * 94} y2={100 + Math.sin((i * Math.PI) / 4) * 94} stroke={P.ink} strokeWidth={6} strokeLinecap="round" strokeDasharray="0 70 30" />
          ))}
        </svg>
        <Pill x={780} y={690} text="A REAL VACATION" color={P.ok} />
      </In>
    </>
  );
};

const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const n = Math.min(10, Math.max(0, Math.floor(((frame - 6) / (D * 0.55)) * 10) + 1));
  return (
    <>
      <Folder x={380} y={90} w={640} h={470} />
      {Array.from({ length: n }, (_, i) => (
        <Block key={i} x={90 + (i % 5) * 118} y={170 + Math.floor(i / 5) * 180} w={104} h={150} color={P.card} ink={P.ink} size={22}>
          Task {i + 1}
        </Block>
      ))}
      <Counter x={830} y={220} label="WEEK" value={n} color={P.accent} />
      <Label x={830} y={380} w={240} size={28} color={P.ink}>
        1 task a week
      </Label>
      <Bubble x={500} y={680} w={720} tail="none" color={P.ok} size={40}>
        In the business. Not in one head.
      </Bubble>
    </>
  );
};

const DEMO = "DEMO STORY · NOT A REAL BUSINESS";

export const PAPER_KNOWLEDGE: Record<string, PaperScene> = {
  hook: { kicker: "A QUESTION FOR OWNERS", head: "The day she", accent: "quits", bad: true, Stage: Hook },
  head: { kicker: "WHAT SHE KNOWS", head: "It's all in", accent: "one head", bad: true, Stage: Head },
  leave: { kicker: "THE RISK", head: "She leaves.", accent: "It leaves too.", bad: true, Stage: Leave },
  sim: { kicker: DEMO, head: "Week one", accent: "without her", bad: true, Stage: Sim },
  sim2: { kicker: DEMO, head: "Nobody knew", accent: "what she knew", bad: true, Stage: Sim2 },
  fix: { kicker: "THE FIX", head: "One task,", accent: "one page", Stage: Fix },
  test: { kicker: "STEP TWO", head: "Then", accent: "test it", Stage: Test },
  which: { kicker: "WHERE TO START", head: "Which task", accent: "first?", Stage: Which },
  keep: { kicker: "WHERE IT LIVES", head: "One shared", accent: "folder", Stage: Keep },
  bonus: { kicker: "GOOD FOR HER TOO", head: "She gets", accent: "a real break", Stage: Bonus },
  result: { kicker: "10 WEEKS LATER", head: "10 tasks", accent: "written down", Stage: Result },
  cta: { kicker: "ONE BUSINESS FIX, EVERY WEEK", head: "Follow for", accent: "the next one", Stage: Cta },
};
