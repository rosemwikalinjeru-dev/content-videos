import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useBeat } from "../../components/kit";
import { Counter, P, PF, PH, PM, PaperScene, lerp } from "./kit";
import { Block, Bubble, Cta, In, Label, Person, Pill, tw } from "./world";

// "Silent leavers." One world: ten customers and a door, then a bucket with a hole in it.
// An illustration, not a statistic: no rates are claimed (research/business-batch-1.md).

const px = (i: number) => 110 + (i % 5) * 180;
const py = (i: number) => (i < 5 ? 330 : 640);
const SPEAKER = 3;

const Ten: React.FC<{ leaveAt?: number; speakAt?: number }> = ({ leaveAt, speakAt }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        const stays = i === SPEAKER && speakAt !== undefined;
        const t = leaveAt !== undefined && !stays ? tw(frame, leaveAt + i * 3, 26) : 0;
        return (
          <div key={i} style={{ opacity: 1 - t * 0.85 }}>
            <Person x={px(i) + t * 900} y={py(i)} color={stays ? P.accent : "#9fb4d1"} s={0.95} />
          </div>
        );
      })}
      {speakAt !== undefined && frame >= speakAt && (
        <Bubble x={px(SPEAKER) - 150} y={10} w={360} size={34} tail="right" color={P.accent}>
          "It was slow today."
        </Bubble>
      )}
    </>
  );
};

const Hook: React.FC = () => {
  const back = useBeat("back", 90);
  return <Ten leaveAt={back - 20} />;
};
const Quiet: React.FC = () => {
  const one = useBeat("one", 90);
  return <Ten speakAt={one} />;
};
const Gone: React.FC = () => {
  const leave = useBeat("leave", 40);
  const else_ = useBeat("else", 100);
  return (
    <>
      <Ten speakAt={0} leaveAt={leave} />
      <In at={else_} pop>
        <Pill x={500} y={720} text="9 booked somewhere else" color={P.bad} size={38} />
      </In>
    </>
  );
};

const Why: React.FC = () => {
  const frame = useCurrentFrame();
  const leaving = useBeat("leaving", 60);
  const hot = frame >= leaving;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 80, width: 420, height: 520, borderRadius: 26, background: P.card, border: `5px solid ${P.bad}`, boxSizing: "border-box", padding: 30, opacity: hot ? 0.45 : 1 }}>
        <div style={{ font: `600 26px/1 ${PM}`, letterSpacing: "0.08em", color: P.bad }}>OPTION 1</div>
        <div style={{ font: `800 72px/1 ${PH}`, color: P.ink, marginTop: 16 }}>Complain</div>
        <div style={{ font: `700 44px/1.15 ${PF}`, color: P.bad, marginTop: 30 }}>Awkward. A hard conversation.</div>
      </div>
      <In at={leaving - 6}>
        <div style={{ position: "absolute", left: 520, top: 80, width: 420, height: 520, borderRadius: 26, background: P.card, border: `5px solid ${P.ink}`, boxShadow: `0 10px 0 ${P.line}`, boxSizing: "border-box", padding: 30 }}>
          <div style={{ font: `600 26px/1 ${PM}`, letterSpacing: "0.08em", color: P.soft }}>OPTION 2</div>
          <div style={{ font: `800 72px/1 ${PH}`, color: P.ink, marginTop: 16 }}>Leave</div>
          <div style={{ font: `700 44px/1.15 ${PF}`, color: P.ink, marginTop: 30 }}>Easy. No conversation at all.</div>
        </div>
      </In>
    </>
  );
};

// ---------- the bucket ----------
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const slotOf = (k: number) => ({ x: 330 + (k % 5) * 70, y: 330 + Math.floor(k / 5) * 78 });
const HOLE = { x: 470, y: 650 };

const Bucket: React.FC<{ from: number; labels?: boolean }> = ({ from, labels }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const mf = from + (frame / D) * 6; // six months per scene
  const month = Math.min(11, Math.floor(mf));
  const hole = useBeat("hole", 40);
  const pay = useBeat("paying", 80);
  return (
    <>
      <svg width={1000} height={860} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M270 250 L330 660 L440 660 M500 660 L610 660 L670 250" fill="none" stroke={P.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M260 250 L680 250" stroke={P.ink} strokeWidth={8} strokeLinecap="round" />
      </svg>
      {Array.from({ length: 20 }, (_, k) => {
        // dot k leaves in month floor(k/2)+ (0 or 10): two leave each month, then an ad brings a new one
        const m = Math.floor(k / 2);
        const s = slotOf(k);
        const ph = mf - m - (k % 2) * 0.2;
        let x = s.x;
        let y = s.y;
        let op = 1;
        let bought = false;
        if (ph > 0 && ph < 0.45) {
          const t = ph / 0.45;
          x = lerp(s.x, HOLE.x, Math.min(1, t * 2));
          y = t < 0.5 ? lerp(s.y, HOLE.y, t * 2) : lerp(HOLE.y, 800, (t - 0.5) * 2);
          op = t < 0.5 ? 1 : 1 - (t - 0.5) * 2;
        } else if (ph >= 0.45 && ph < 0.9) {
          const t = (ph - 0.45) / 0.45;
          x = lerp(790, s.x, t);
          y = lerp(120, s.y, t) - Math.sin(t * Math.PI) * 60;
          bought = true;
        } else if (ph >= 0.9) bought = true;
        return <div key={k} style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: 99, background: bought ? P.warm : "#9fb4d1", border: `4px solid ${P.ink}`, boxSizing: "border-box", opacity: op }} />;
      })}
      <Counter x={130} y={60} label="MONTH" value={MONTHS[month]} color={P.ink} />
      <Block x={700} y={70} w={220} h={90} color={P.warm} ink={P.ink} size={34}>
        ADS $
      </Block>
      {labels && frame >= hole && (
        <Label x={470} y={700} w={500} color={P.bad} head size={44}>
          ↑ the hole
        </Label>
      )}
      {labels && frame >= pay && (
        <Label x={810} y={200} w={280} color={P.ink} size={30}>
          you keep paying to refill it
        </Label>
      )}
      <div style={{ position: "absolute", left: 40, top: 812, display: "flex", gap: 24, font: `600 24px/1 ${PM}`, color: P.soft }}>
        <span>
          <span style={{ color: "#9fb4d1" }}>●</span> CUSTOMER
        </span>
        <span>
          <span style={{ color: P.warm }}>●</span> BOUGHT WITH ADS
        </span>
      </div>
    </>
  );
};

const Phone: React.FC<{ children: React.ReactNode; x?: number }> = ({ children, x = 320 }) => (
  <div style={{ position: "absolute", left: x - 230, top: 20, width: 460, height: 760, borderRadius: 54, background: P.card, border: `8px solid ${P.ink}`, boxShadow: `0 12px 0 ${P.line}`, boxSizing: "border-box", padding: "70px 26px 26px" }}>
    <div style={{ position: "absolute", left: 160, top: 22, width: 124, height: 20, borderRadius: 10, background: P.ink }} />
    {children}
  </div>
);
const Msg: React.FC<{ children: React.ReactNode; mine?: boolean; color?: string }> = ({ children, mine, color }) => (
  <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 20 }}>
    <div style={{ maxWidth: 340, background: color ?? (mine ? P.paper2 : P.accent), color: mine && !color ? P.ink : "#fff", borderRadius: 26, padding: "18px 22px", font: `700 38px/1.15 ${PF}` }}>{children}</div>
  </div>
);

const Fix: React.FC = () => {
  const how = useBeat("how", 110);
  const msg = useBeat("message", 40);
  return (
    <>
      <Phone>
        <In at={msg}>
          <div style={{ position: "relative", top: 70, padding: "0 26px" }}>
            <Msg>Thanks for coming in today.</Msg>
          </div>
        </In>
        <In at={how}>
          <div style={{ position: "relative", top: 250, padding: "0 26px" }}>
            <Msg>How did we do?</Msg>
          </div>
        </In>
      </Phone>
      <Label x={770} y={260} w={340} color={P.ink} head size={54}>
        After every visit
      </Label>
      <Label x={770} y={400} w={340} size={32}>
        one short message
      </Label>
    </>
  );
};

const Then: React.FC = () => {
  const not = useBeat("not", 50);
  const call = useBeat("call", 90);
  return (
    <>
      <Phone>
        <Msg>How did we do?</Msg>
        <In at={not}>
          <div style={{ position: "relative", top: 200, padding: "0 26px" }}>
            <Msg mine color={P.bad}>
              Not great.
            </Msg>
          </div>
        </In>
      </Phone>
      <In at={call} pop>
        <Block x={590} y={240} w={360} h={220} color={P.ok} size={48}>
          Call them
          <br />
          the same day
        </Block>
      </In>
    </>
  );
};

const Say: React.FC = () => {
  const a = useBeat("sorry", 90);
  const b = useBeat("happened", 130);
  const c = useBeat("here's", 170);
  const rows: [string, number][] = [
    ["I'm sorry.", a],
    ["What happened?", b],
    ["Here's what I'll do.", c],
  ];
  return (
    <>
      <Label x={500} y={10} w={880} mono size={28}>
        ON THAT CALL, THREE THINGS
      </Label>
      {rows.map(([t, at], i) => (
        <In key={t} at={at}>
          <div style={{ position: "absolute", left: 60, top: 80 + i * 220, width: 880, display: "flex", alignItems: "center", gap: 26 }}>
            <span style={{ width: 110, height: 110, flexShrink: 0, borderRadius: 99, background: P.accent, color: "#fff", font: `800 64px/110px ${PH}`, textAlign: "center" }}>{i + 1}</span>
            <div style={{ flex: 1, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 26, padding: "26px 30px", font: `700 62px/1.05 ${PF}`, color: P.ink, boxShadow: `0 8px 0 ${P.line}` }}>"{t}"</div>
          </div>
        </In>
      ))}
    </>
  );
};

const Win: React.FC = () => {
  const frame = useCurrentFrame();
  const leave = useBeat("leave", 30);
  const stay = useBeat("stay", 80);
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => {
        const goes = i === 1 || i === 4;
        const t = goes ? tw(frame, leave + i * 2, 26) : 0;
        const kept = !goes && frame >= stay;
        return (
          <div key={i} style={{ opacity: 1 - t * 0.8 }}>
            <Person x={110 + i * 180 + t * 500} y={470} color={kept ? P.ok : "#9fb4d1"} s={1.15} mark={kept ? "✓" : undefined} markColor={P.ok} />
          </div>
        );
      })}
      <In at={stay + 10} pop>
        <Bubble x={500} y={560} w={760} tail="none" color={P.ok} size={46}>
          They stayed because <span style={{ color: P.ok }}>you called</span>.
        </Bubble>
      </In>
    </>
  );
};

const Learn: React.FC = () => {
  const fix = useBeat("fix", 40);
  const next = useBeat("next", 90);
  return (
    <>
      <Block x={60} y={120} w={270} h={200} color={P.bad} size={36}>
        "The wait was too long"
      </Block>
      <In at={fix}>
        <Label x={380} y={170} w={100} color={P.ink} head size={80}>
          →
        </Label>
        <Block x={430} y={120} w={240} h={200} color={P.accent} size={40}>
          You fix the wait
        </Block>
      </In>
      <In at={next}>
        <Label x={720} y={170} w={100} color={P.ink} head size={80}>
          →
        </Label>
        <Person x={860} y={330} color={P.ok} s={1.15} mark="✓" markColor={P.ok} label="NEXT CUSTOMER" />
      </In>
      <In at={next + 10}>
        <Label x={500} y={520} w={880} color={P.ink} size={44}>
          One complaint fixes it for everyone after.
        </Label>
      </In>
    </>
  );
};

const DEMO = "AN ILLUSTRATION · NOT A STATISTIC";

export const PAPER_LEAVERS: Record<string, PaperScene> = {
  hook: { kicker: "THE QUIET PROBLEM", head: "No complaint.", accent: "No return.", bad: true, Stage: Hook },
  quiet: { kicker: DEMO, head: "Ten so-so visits.", accent: "One tells you.", bad: true, Stage: Quiet },
  gone: { kicker: DEMO, head: "The rest", accent: "just leave", bad: true, Stage: Gone },
  why: { kicker: "WHY THEY STAY QUIET", head: "Leaving is", accent: "easier", bad: true, Stage: Why },
  sim: { kicker: DEMO, head: "A year of", accent: "quiet leavers", bad: true, Stage: () => <Bucket from={0} /> },
  sim2: { kicker: DEMO, head: "A bucket", accent: "with a hole", bad: true, Stage: () => <Bucket from={6} labels /> },
  fix: { kicker: "THE FIX", head: "Ask", accent: "first", Stage: Fix },
  then: { kicker: "WHEN IT'S BAD NEWS", head: "Call", accent: "the same day", Stage: Then },
  say: { kicker: "WHAT TO SAY", head: "Three", accent: "sentences", Stage: Say },
  win: { kicker: "WHAT YOU GET", head: "Some will", accent: "stay", Stage: Win },
  learn: { kicker: "THE BONUS", head: "You learn", accent: "what to fix", Stage: Learn },
  cta: { kicker: "SILENCE ISN'T", head: "A complaint is", accent: "a second chance", Stage: Cta },
};
