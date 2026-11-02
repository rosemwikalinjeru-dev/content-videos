import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  C,
  FONT,
  Kicker,
  MONO,
  Pop,
  Rise,
  SAFE,
  SourceCard,
  useBeat,
  useCount,
  useIn,
} from "../../components/kit";

// Visual area: x 70–930, y 140–1340. Captions sit below (1380–1640).
// Animation beats use useBeat("word"): they land when that word is spoken.
const Stage: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 200 }) => (
  <AbsoluteFill style={{ paddingLeft: SAFE.left, paddingRight: SAFE.right, paddingTop: top }}>
    {children}
  </AbsoluteFill>
);

const H: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 118,
  color = C.ink,
  style,
}) => (
  <div style={{ font: `900 ${size}px/1.0 ${FONT}`, letterSpacing: "-0.04em", color, ...style }}>{children}</div>
);

const SRC_OPENAI = "OpenAI announcement, Oct 26, 2026";

// 1 ─ hook
export const Hook: React.FC = () => {
  const half = useBeat("half", 45);
  return (
    <Stage top={230}>
      <Kicker>JUST RELEASED · OPENAI</Kicker>
      <div style={{ height: 44 }} />
      <Rise delay={2}><H size={136}>An AI that</H></Rise>
      <Rise delay={6}><H size={136}>uses a</H></Rise>
      <Rise delay={10}><H size={136}>computer</H></Rise>
      <Rise delay={14}><H size={136} color={C.accent}>for you.</H></Rise>
      <Pop delay={half} rotate={-4} style={{ marginTop: 80, display: "inline-block" }}>
        <div
          style={{
            display: "inline-block",
            border: `10px solid ${C.accent}`,
            color: C.accent,
            borderRadius: 28,
            padding: "22px 40px",
            font: `900 120px/1 ${FONT}`,
          }}
        >
          ½ THE PRICE
        </div>
      </Pop>
    </Stage>
  );
};

// 2 ─ what
const Chip: React.FC<{ label: string; delay: number }> = ({ label, delay }) => (
  <Pop delay={delay}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        background: C.panel,
        border: `3px solid ${C.line}`,
        borderRadius: 24,
        padding: "34px 30px",
        font: `800 56px/1 ${FONT}`,
        color: C.ink,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 26, height: 26, borderRadius: 99, background: C.ok, flexShrink: 0 }} />
      {label}
    </div>
  </Pop>
);

export const What: React.FC = () => {
  const reads = useBeat("reads", 60);
  const clicks = useBeat("clicks", 75);
  const types = useBeat("types", 90);
  const fills = useBeat("fills", 105);
  return (
    <Stage top={200}>
      <Kicker>THE MODEL</Kicker>
      <div style={{ height: 30 }} />
      <Rise delay={2}><H size={170}>GPT-6.1</H></Rise>
      <Rise delay={6}><H size={170} color={C.accent}>Terra</H></Rise>
      <Rise delay={10} style={{ marginTop: 22 }}>
        <div style={{ font: `600 42px/1.2 ${FONT}`, color: C.muted }}>API name: gpt-6.1-terra</div>
      </Rise>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 56 }}>
        <div style={{ display: "flex", gap: 22 }}>
          <Chip label="Reads the screen" delay={reads} />
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          <Chip label="Clicks" delay={clicks} />
          <Chip label="Types" delay={types} />
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          <Chip label="Fills in forms" delay={fills} />
        </div>
      </div>
      <SourceCard text={SRC_OPENAI} delay={14} top={1250} />
    </Stage>
  );
};

// 3 ─ price
const PriceCard: React.FC<{ value: number; label: string; delay: number }> = ({ value, label, delay }) => {
  const n = useCount(value, delay + 4, 18);
  return (
    <Rise delay={delay} style={{ flex: 1 }}>
      <div
        style={{
          background: C.panel,
          border: `3px solid ${C.line}`,
          borderRadius: 30,
          padding: "40px 36px",
          height: 470,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ font: `700 40px/1.1 ${MONO}`, color: C.muted, letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ font: `900 210px/1 ${FONT}`, color: C.ink, letterSpacing: "-0.05em" }}>${n.toFixed(0)}</div>
        <div style={{ font: `600 36px/1.2 ${FONT}`, color: C.muted }}>per 1M tokens</div>
      </div>
    </Rise>
  );
};

export const Price: React.FC = () => {
  const one = useBeat("one", 0);
  const five = useBeat("five", 50);
  const half = useBeat("half", 110);
  return (
    <Stage top={200}>
      <Kicker>API PRICE</Kicker>
      <div style={{ height: 44 }} />
      <div style={{ display: "flex", gap: 26 }}>
        <PriceCard value={1} label="INPUT" delay={one} />
        <PriceCard value={5} label="OUTPUT" delay={five} />
      </div>
      <Pop delay={half} rotate={-3} style={{ marginTop: 70, display: "inline-block" }}>
        <div
          style={{
            display: "inline-block",
            background: C.accent,
            color: C.ground,
            borderRadius: 26,
            padding: "26px 40px",
            font: `900 120px/1 ${FONT}`,
          }}
        >
          −50%
          <div style={{ font: `800 40px/1.2 ${FONT}`, marginTop: 10 }}>vs. GPT-5.6 Terra, the model it replaces</div>
        </div>
      </Pop>
      <SourceCard text={SRC_OPENAI} delay={10} top={1250} />
    </Stage>
  );
};

// 4 ─ speed
export const Speed: React.FC = () => {
  const three = useBeat("three", 20);
  const theirs = useBeat("that's", 90);
  const n = useCount(3, three, 22);
  const frame = useCurrentFrame();
  return (
    <Stage top={200}>
      <Kicker>OPENAI'S CLAIM</Kicker>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 30 }}>
        <Pop delay={three}>
          <div style={{ font: `900 420px/0.9 ${FONT}`, color: C.ink, letterSpacing: "-0.06em" }}>
            {frame < three + 22 ? Math.max(1, n).toFixed(1) : "3"}×
          </div>
        </Pop>
        <Pop delay={theirs}>
          <div style={{ font: `900 160px/1 ${FONT}`, color: C.accent }}>*</div>
        </Pop>
      </div>
      <Rise delay={three + 8}>
        <div style={{ font: `800 64px/1.12 ${FONT}`, color: C.ink, marginTop: 10 }}>
          faster on computer tasks
          <br />
          <span style={{ color: C.muted }}>than its bigger models</span>
        </div>
      </Rise>
      <Pop delay={theirs} style={{ marginTop: 60 }}>
        <div
          style={{
            border: `5px dashed ${C.accent}`,
            borderRadius: 24,
            padding: "28px 32px",
            font: `800 54px/1.2 ${FONT}`,
            color: C.accent,
          }}
        >
          * OpenAI's own test.
          <br />
          Not independent.
        </div>
      </Pop>
      <SourceCard text={SRC_OPENAI} delay={12} top={1250} />
    </Stage>
  );
};

// 5 ─ caveat
const Tier: React.FC<{ name: string; note: string; delay: number; hi?: boolean }> = ({ name, note, delay, hi }) => (
  <Rise delay={delay}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: hi ? C.accent : C.panel,
        color: hi ? C.ground : C.ink,
        border: `3px solid ${hi ? C.accent : C.line}`,
        borderRadius: 24,
        padding: "34px 34px",
        marginBottom: 22,
      }}
    >
      <span style={{ font: `900 60px/1 ${FONT}` }}>{name}</span>
      <span style={{ font: `700 38px/1.1 ${FONT}`, opacity: 0.85 }}>{note}</span>
    </div>
  </Rise>
);

export const Caveat: React.FC = () => (
  <Stage top={200}>
    <Kicker color={C.bad}>THE CATCH</Kicker>
    <div style={{ height: 34 }} />
    <Rise delay={0}><H size={120}>Not their smartest model.</H></Rise>
    <div style={{ height: 60 }} />
    <div style={{ font: `700 34px/1.2 ${MONO}`, color: C.muted, marginBottom: 20, letterSpacing: "0.04em" }}>
      FOR THE HARDEST WORK, OPENAI POINTS TO:
    </div>
    <Tier name="GPT-6 Astra" note="bigger" delay={8} />
    <Tier name="GPT-6.1 Sol" note="bigger" delay={14} />
    <Tier name="GPT-6.1 Terra" note="fast + cheap" delay={22} hi />
    <SourceCard text="OpenAI · Vals.ai index: #10 of 28" delay={20} top={1250} />
  </Stage>
);

// 6 ─ business: the broken process
const FlowNode: React.FC<{ title: string; sub: string; color: string; delay: number }> = ({
  title,
  sub,
  color,
  delay,
}) => (
  <Pop delay={delay}>
    <div
      style={{
        background: C.panel,
        border: `5px solid ${color}`,
        borderRadius: 28,
        padding: "34px 30px",
        textAlign: "center",
      }}
    >
      <div style={{ font: `900 64px/1.05 ${FONT}`, color: C.ink }}>{title}</div>
      <div style={{ font: `700 38px/1.2 ${FONT}`, color, marginTop: 12 }}>{sub}</div>
    </div>
  </Pop>
);

const Arrow: React.FC<{ delay: number; color?: string }> = ({ delay, color = C.muted }) => {
  const frame = useCurrentFrame();
  const h = interpolate(frame - delay, [0, 10], [0, 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 10, height: 80 }}>
        <div style={{ width: 10, height: h, background: color, borderRadius: 5 }} />
        {h > 70 && (
          <div
            style={{
              position: "absolute",
              left: -16,
              top: 72,
              borderLeft: "21px solid transparent",
              borderRight: "21px solid transparent",
              borderTop: `26px solid ${color}`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export const Business: React.FC = () => {
  const clinic = useBeat("dental", 20);
  const email = useBeat("patient", 40);
  const retypes = useBeat("retypes", 90);
  const old = useBeat("old", 110);
  return (
    <Stage top={180}>
      <Rise delay={0}>
        <H size={96}>Where's it useful?</H>
      </Rise>
      <div style={{ height: 30 }} />
      <Pop delay={clinic} style={{ display: "inline-block" }}>
        <div
          style={{
            display: "inline-block",
            font: `700 34px/1 ${MONO}`,
            letterSpacing: "0.1em",
            color: C.ground,
            background: C.accent,
            padding: "12px 18px",
            borderRadius: 8,
          }}
        >
          DEMO SCENARIO · DENTAL CLINIC
        </div>
      </Pop>
      <div style={{ height: 30 }} />
      <FlowNode title="New patient email" sub="name · birth date · phone" color={C.blue} delay={email} />
      <Arrow delay={retypes - 8} />
      <FlowNode title="Someone retypes it" sub="by hand · every booking" color={C.bad} delay={retypes} />
      <Arrow delay={old - 8} />
      <FlowNode title="Old booking system" sub="no API to connect to" color={C.muted} delay={old} />
    </Stage>
  );
};

// 7 ─ fix: the HyperFrames-rendered demo clip
export const Fix: React.FC = () => {
  const p = useIn(0);
  return (
    <Stage top={170}>
      <Kicker color={C.ok}>WHAT IT'S BUILT FOR</Kicker>
      <div
        style={{
          marginTop: 30,
          width: 860,
          height: 860,
          borderRadius: 30,
          overflow: "hidden",
          border: `4px solid ${C.line}`,
          opacity: p,
          transform: `scale(${0.94 + p * 0.06})`,
          boxShadow: "0 30px 80px #000a",
        }}
      >
        <OffthreadVideo src={staticFile("assets/terra-form-demo.mp4")} muted style={{ width: 860, height: 860 }} />
      </div>
      <Rise delay={20} style={{ marginTop: 28 }}>
        <div style={{ font: `700 38px/1.25 ${FONT}`, color: C.muted }}>
          Illustration, not a live test.
          <br />
          <span style={{ color: C.ink }}>AI drafts → a person approves.</span>
        </div>
      </Rise>
    </Stage>
  );
};

// 8 ─ verdict
const VerdictRow: React.FC<{ label: string; mark: string; color: string; delay: number; dim?: boolean }> = ({
  label,
  mark,
  color,
  delay,
  dim,
}) => (
  <Pop delay={delay}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        background: dim ? "transparent" : C.panel,
        border: `6px solid ${color}`,
        borderRadius: 28,
        padding: "36px 36px",
        marginBottom: 28,
      }}
    >
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 99,
          background: color,
          color: C.ground,
          font: `900 72px/110px ${FONT}`,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {mark}
      </div>
      <div style={{ font: `900 76px/1.0 ${FONT}`, color: C.ink }}>{label}</div>
    </div>
  </Pop>
);

export const VerdictScene: React.FC = () => {
  const testing = useBeat("testing", 25);
  const trusting = useBeat("trusting", 55);
  const wrong = useBeat("wrong", 95);
  return (
    <Stage top={200}>
      <Kicker>MY VERDICT</Kicker>
      <div style={{ height: 44 }} />
      <VerdictRow label="Worth testing" mark="✓" color={C.ok} delay={testing} />
      <VerdictRow label="Trusting it alone" mark="✕" color={C.bad} delay={trusting} dim />
      <Rise delay={wrong} style={{ marginTop: 50 }}>
        <div style={{ font: `800 58px/1.18 ${FONT}`, color: C.muted }}>
          A wrong date of birth costs more than the <span style={{ color: C.accent }}>tokens you save.</span>
        </div>
      </Rise>
    </Stage>
  );
};

// 9 ─ cta
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const follow = useBeat("follow", 60);
  const pulse = 1 + Math.sin(frame / 6) * 0.025;
  return (
    <Stage top={260}>
      <Kicker>NEXT VIDEO</Kicker>
      <div style={{ height: 34 }} />
      <Rise delay={2}><H size={120}>I put it on a</H></Rise>
      <Rise delay={6}><H size={120} color={C.accent}>real booking form.</H></Rise>
      <Rise delay={14} style={{ marginTop: 30 }}>
        <div style={{ font: `700 56px/1.2 ${FONT}`, color: C.muted }}>…to see where it breaks.</div>
      </Rise>
      <Pop delay={follow} style={{ marginTop: 90, display: "inline-block" }}>
        <div
          style={{
            display: "inline-block",
            transform: `scale(${pulse})`,
            background: C.accent,
            color: C.ground,
            borderRadius: 999,
            padding: "32px 70px",
            font: `900 76px/1 ${FONT}`,
          }}
        >
          Follow →
        </div>
      </Pop>
      <Rise delay={follow + 8} style={{ marginTop: 44 }}>
        <div style={{ font: `700 38px/1 ${MONO}`, color: C.muted, letterSpacing: "0.06em" }}>ROSE NJERU AUTOMATION</div>
      </Rise>
    </Stage>
  );
};

export const SCENE_VISUALS: Record<string, React.FC> = {
  hook: Hook,
  what: What,
  price: Price,
  speed: Speed,
  caveat: Caveat,
  business: Business,
  fix: Fix,
  verdict: VerdictScene,
  cta: Cta,
};
