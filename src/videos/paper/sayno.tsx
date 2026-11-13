import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useBeat } from "../../components/kit";
import { Counter, P, PF, PH, PM, PaperScene, clampP, lerp } from "./kit";
import { Block, Bubble, Cta, In, Label, Pill, tw } from "./world";

// "Say no." One world: your calendar. First a week, then a month of 20 job slots (demo month).
// Hand-set illustration: it does not claim every bad-fit job gets replaced.

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const GOOD = "#3b6fc0";
const BADFIT = "#9a9184";
const wx = (i: number) => 40 + i * 184;

const WeekRow: React.FC<{ y?: number; h?: number; children?: React.ReactNode; hot?: number; hotColor?: string }> = ({ y = 60, h = 300, children, hot, hotColor = P.bad }) => (
  <>
    {DAYS.map((d, i) => (
      <div key={d}>
        <Label x={wx(i) + 84} y={y - 44} mono size={28} w={168} color={i === hot ? hotColor : P.soft}>
          {d}
        </Label>
        <Block x={wx(i)} y={y} w={168} h={h} color={i === hot ? hotColor : P.line} dashed />
      </div>
    ))}
    <Block x={wx(0) + 10} y={y + 10} w={148} h={110} color={GOOD} size={26}>
      Job
    </Block>
    <Block x={wx(2) + 10} y={y + 130} w={148} h={110} color={GOOD} size={26}>
      Job
    </Block>
    {children}
  </>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const no = useBeat("no", 100);
  const t = tw(frame, no, 8);
  return (
    <>
      <Label x={500} y={60} w={880} color={P.soft} size={44}>
        The most profitable word in your business
      </Label>
      {frame >= no && (
        <div style={{ position: "absolute", left: 180, top: 240, width: 640, textAlign: "center", border: `14px solid ${P.accent}`, borderRadius: 40, color: P.accent, font: `800 300px/1.1 ${PH}`, transform: `rotate(-5deg) scale(${2 - t})`, opacity: t }}>NO.</div>
      )}
    </>
  );
};

const Setup: React.FC = () => {
  const take = useBeat("take", 50);
  const tags: [string, string][] = [
    ["Far away", "far"],
    ["Low pay", "low"],
    ["Vague details", "vague"],
  ];
  const beats = tags.map(([, w], i) => useBeat(w, 120 + i * 20));
  return (
    <>
      <WeekRow y={60} h={260} />
      <In at={take}>
        <div style={{ position: "absolute", left: 60, top: 380, width: 880, borderRadius: 24, background: P.card, border: `5px solid ${P.ink}`, boxShadow: `0 10px 0 ${P.line}`, padding: "24px 30px", boxSizing: "border-box" }}>
          <div style={{ font: `600 26px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>NEW REQUEST</div>
          <div style={{ font: `800 60px/1.05 ${PH}`, color: P.ink, marginTop: 8 }}>A job that's a bad fit</div>
        </div>
      </In>
      {tags.map(([t], i) => (
        <In key={t} at={beats[i]} pop>
          <Block x={60 + i * 300} y={610} w={280} h={90} color={P.bad} size={34}>
            ✕ {t}
          </Block>
        </In>
      ))}
    </>
  );
};

const BlockScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fills = useBeat("fills", 6);
  const ideal = useBeat("ideal", 70);
  const gone = useBeat("gone", 130);
  const drop = tw(frame, fills, 14);
  const g = interpolate(frame, [ideal, gone, gone + 24], [0, 1, 2], clampP);
  const gx = g <= 1 ? lerp(760, wx(3) + 10, g) : wx(3) + 10 + (g - 1) * 420;
  const gy = g <= 1 ? lerp(520, 330, g) : 330 - Math.sin((g - 1) * Math.PI) * 140 + (g - 1) * 300;
  return (
    <>
      <WeekRow y={60} h={360} hot={drop > 0.9 ? 3 : undefined}>
        <Block x={wx(3) + 10} y={lerp(-300, 70, drop)} w={148} h={340} color={BADFIT} size={28}>
          Bad fit
          <br />
          all day
        </Block>
      </WeekRow>
      {frame >= ideal && (
        <Block x={gx} y={gy} w={148} h={150} color={P.accent} size={28} opacity={g > 1.6 ? (2 - g) / 0.4 : 1}>
          Ideal customer
        </Block>
      )}
      <In at={gone + 10} pop>
        <Pill x={500} y={700} text="Thursday's gone" color={P.bad} size={44} />
      </In>
    </>
  );
};

const Cost: React.FC = () => {
  const cost = useBeat("cost", 70);
  return (
    <>
      <Block x={60} y={120} w={410} h={360} color={BADFIT} size={46}>
        The wrong job
        <br />
        paid less
      </Block>
      <In at={cost} pop>
        <Label x={500} y={250} w={80} color={P.bad} head size={90}>
          +
        </Label>
        <Block x={530} y={120} w={410} h={360} color={P.bad} dashed size={46}>
          The right job
          <br />
          never happened
        </Block>
      </In>
    </>
  );
};

// ---------- the month ----------
const BAD = [2, 5, 9, 12, 14, 18];
const REPLACED = [2, 9, 14]; // good jobs take some of their places
const tx = (i: number) => 40 + (i % 5) * 138;
const ty = (i: number) => 70 + Math.floor(i / 5) * 150;

const Month: React.FC<{ mode: "fill" | "pain" | "fix" }> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const six = useBeat("six", Math.round(D * 0.7));
  const down = useBeat("down", 50);
  const good = useBeat("good", 100);
  const evenings = useBeat("evenings", 170);
  const pains: [string, number][] = [
    ["Your slots", useBeat("slots", 30)],
    ["Your miles", useBeat("miles", 55)],
    ["Your patience", useBeat("patience", 80)],
  ];
  const shown = mode === "fill" ? Math.max(0, Math.min(20, Math.floor(((frame - D * 0.3) / (D * 0.35)) * 20))) : 20;
  const badCount = mode === "fill" ? (frame >= six ? 6 : 0) : mode === "pain" ? 6 : frame >= down ? 0 : 6;
  return (
    <>
      {DAYS.map((d, i) => (
        <Label key={d} x={tx(i) + 63} y={24} mono size={24} w={126}>
          {d}
        </Label>
      ))}
      {Array.from({ length: 20 }, (_, i) => {
        if (i >= shown) return <Block key={i} x={tx(i)} y={ty(i)} w={126} h={134} color={P.line} dashed />;
        const isBad = BAD.includes(i);
        const red = isBad && (mode !== "fill" || frame >= six);
        if (mode === "fix" && isBad && frame >= down) {
          const out = tw(frame, down + BAD.indexOf(i) * 3, 14);
          if (REPLACED.includes(i) && frame >= good + REPLACED.indexOf(i) * 6)
            return (
              <Block key={i} x={tx(i)} y={ty(i)} w={126} h={134} color={P.ok} size={26}>
                Good job
              </Block>
            );
          if (!REPLACED.includes(i) && frame >= evenings)
            return (
              <Block key={i} x={tx(i)} y={ty(i)} w={126} h={134} color={P.ok} dashed size={26}>
                Free
              </Block>
            );
          return (
            <div key={i}>
              <Block x={tx(i)} y={ty(i)} w={126} h={134} color={P.line} dashed />
              {out < 1 && (
                <Block x={tx(i) + out * 300} y={ty(i) - out * 200} w={126} h={134} color={P.bad} size={26} opacity={1 - out}>
                  Bad fit
                </Block>
              )}
            </div>
          );
        }
        return (
          <Block key={i} x={tx(i)} y={ty(i)} w={126} h={134} color={red ? P.bad : GOOD} size={26}>
            {red ? "Bad fit" : "Job"}
          </Block>
        );
      })}
      <Counter x={850} y={70} label="JOBS" value={mode === "fix" && frame >= down ? (frame >= good ? 17 : 14) : shown} color={P.ink} />
      <Counter x={850} y={240} label="BAD FITS" value={badCount} color={badCount ? P.bad : P.ok} />
      {mode === "pain" &&
        pains.map(([t, at], i) => (
          <In key={t} at={at} pop>
            <Block x={40 + i * 232} y={700} w={216} h={84} color={P.bad} size={30}>
              {t}
            </Block>
          </In>
        ))}
      {mode === "fix" && (
        <In at={evenings + 6} pop>
          <Pill x={380} y={710} text="…and your evenings back" color={P.ok} size={38} />
        </In>
      )}
    </>
  );
};

const RULES: [string, string][] = [
  ["Your area", "area"],
  ["Your minimum price", "minimum"],
  ["Your type of work", "type"],
];

const Fix: React.FC = () => {
  const beats = RULES.map(([, w], i) => useBeat(w, 90 + i * 30));
  return (
    <>
      <Label x={500} y={10} w={880} mono size={28}>
        3 RULES FOR A GOOD JOB
      </Label>
      {RULES.map(([t], i) => (
        <In key={t} at={beats[i]}>
          <div style={{ position: "absolute", left: 60, top: 80 + i * 220, width: 880, display: "flex", alignItems: "center", gap: 26 }}>
            <span style={{ width: 110, height: 110, flexShrink: 0, borderRadius: 99, background: P.accent, color: "#fff", font: `800 64px/110px ${PH}`, textAlign: "center" }}>{i + 1}</span>
            <div style={{ flex: 1, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 26, padding: "26px 30px", font: `700 60px/1.05 ${PF}`, color: P.ink, boxShadow: `0 8px 0 ${P.line}` }}>{t}</div>
          </div>
        </In>
      ))}
    </>
  );
};

const Use: React.FC = () => {
  const frame = useCurrentFrame();
  const breaks = useBeat("breaks", 50);
  const no = useBeat("no", 110);
  const point = useBeat("point", 140);
  const res = [false, false, true];
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 20, width: 880, borderRadius: 24, background: P.card, border: `5px solid ${P.ink}`, boxShadow: `0 10px 0 ${P.line}`, padding: "24px 30px", boxSizing: "border-box" }}>
        <div style={{ font: `600 26px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>A NEW REQUEST COMES IN</div>
        {RULES.map(([t], i) => {
          const on = frame >= breaks + i * 8;
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 22 }}>
              <span style={{ width: 76, height: 76, borderRadius: 99, background: on ? (res[i] ? P.ok : P.bad) : P.line, color: "#fff", font: `800 46px/76px ${PH}`, textAlign: "center" }}>{on ? (res[i] ? "✓" : "✕") : ""}</span>
              <span style={{ font: `700 54px/1 ${PF}`, color: P.ink }}>{t}</span>
            </div>
          );
        })}
      </div>
      <In at={no} pop>
        <div style={{ position: "absolute", left: 60, top: 470, border: `10px solid ${P.accent}`, color: P.accent, borderRadius: 24, padding: "10px 36px", font: `800 130px/1.1 ${PH}`, transform: "rotate(-4deg)" }}>NO</div>
      </In>
      <In at={point}>
        <Block x={400} y={500} w={540} h={150} color={P.accent} size={44}>
          → point them to someone else
        </Block>
      </In>
    </>
  );
};

const How: React.FC = () => {
  const fit = useBeat("fit", 80);
  return (
    <In at={Math.max(0, fit - 20)} pop>
      <Bubble x={500} y={80} w={860} size={64} color={P.accent}>
        "That's not a fit for us, but here's <span style={{ color: P.accent }}>someone who can help</span>."
      </Bubble>
      <Label x={500} y={520} w={880} mono size={28}>
        ONE SENTENCE · POLITE · DONE
      </Label>
    </In>
  );
};

const Fear: React.FC = () => {
  const flex = useBeat("flexible", 80);
  const frame = useCurrentFrame();
  const on = frame >= flex;
  return (
    <>
      <WeekRow y={90} h={330} hot={on ? 4 : undefined} hotColor={P.warm}>
        {on && (
          <Block x={wx(4) + 10} y={100} w={148} h={310} color={P.warm} ink={P.ink} size={30}>
            Flex day
          </Block>
        )}
      </WeekRow>
      <In at={flex + 10}>
        <Label x={500} y={480} w={880} color={P.ink} size={46}>
          One day a week for the "maybe" jobs
        </Label>
      </In>
    </>
  );
};

const DEMO = "DEMO MONTH · NOT REAL DATA";

export const PAPER_SAYNO: Record<string, PaperScene> = {
  hook: { kicker: "CHOOSING YOUR JOBS", head: "The word that", accent: "pays", Stage: Hook },
  setup: { kicker: "DEMO SCENARIO · A SLOW WEEK", head: "You take", accent: "a bad fit", bad: true, Stage: Setup },
  block: { kicker: "DEMO SCENARIO", head: "It fills your", accent: "Thursday", bad: true, Stage: BlockScene },
  cost: { kicker: "THE REAL COST", head: "It cost you", accent: "the right one", bad: true, Stage: Cost },
  sim: { kicker: DEMO, head: "Month one:", accent: "yes to all", bad: true, Stage: () => <Month mode="fill" /> },
  sim2: { kicker: DEMO, head: "What six", accent: "bad fits eat", bad: true, Stage: () => <Month mode="pain" /> },
  sim3: { kicker: DEMO, head: "Month two:", accent: "six no's", Stage: () => <Month mode="fix" /> },
  fix: { kicker: "THE FIX", head: "Write", accent: "three rules", Stage: Fix },
  use: { kicker: "USING THE RULES", head: "Breaks two?", accent: "Say no.", Stage: Use },
  how: { kicker: "HOW TO SAY IT", head: "One polite", accent: "sentence", Stage: How },
  fear: { kicker: "SCARED OF A GAP?", head: "Keep one", accent: "flex day", Stage: Fear },
  cta: { kicker: "ONE BUSINESS FIX, EVERY WEEK", head: "Follow for", accent: "the next one", Stage: Cta },
};
