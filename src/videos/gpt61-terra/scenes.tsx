import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { C, FONT, MONO, Pop, Rise, SAFE, SourceCard, useBeat, useIn } from "../../components/kit";

// Minimal layout: one idea per screen, centred in the area above the captions.
// Visual area: x 70–930, y 140–1340. Captions sit below (1380–1640).
const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      paddingLeft: SAFE.left,
      paddingRight: SAFE.right,
      top: 140,
      height: 1200,
      justifyContent: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

const H: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children,
  size = 130,
  color = C.ink,
}) => <div style={{ font: `900 ${size}px/1.02 ${FONT}`, letterSpacing: "-0.04em", color }}>{children}</div>;

const Small: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.muted }) => (
  <div style={{ font: `700 44px/1.25 ${FONT}`, color, marginTop: 30 }}>{children}</div>
);

const SRC = "OpenAI announcement, Oct 26, 2026";

// 1 ─ hook
export const Hook: React.FC = () => {
  const half = useBeat("half", 45);
  return (
    <Center>
      <Rise><H>An AI that uses a computer for you.</H></Rise>
      <Rise delay={half}><H color={C.accent}>Half the price.</H></Rise>
    </Center>
  );
};

// 2 ─ what
export const What: React.FC = () => (
  <Center>
    <Rise><H size={180}>GPT-6.1</H></Rise>
    <Rise delay={4}><H size={180} color={C.accent}>Terra</H></Rise>
    <SourceCard text={SRC} delay={10} top={1110} />
  </Center>
);

// 3 ─ price
export const Price: React.FC = () => {
  const half = useBeat("half", 110);
  return (
    <Center>
      <Rise><H size={120}>$1 in · $5 out</H></Rise>
      <Small>per million tokens</Small>
      <Pop delay={half} style={{ marginTop: 70 }}>
        <H size={150} color={C.accent}>50% cheaper</H>
      </Pop>
      <SourceCard text={SRC} delay={10} top={1110} />
    </Center>
  );
};

// 4 ─ speed
export const Speed: React.FC = () => {
  const three = useBeat("three", 20);
  const theirs = useBeat("that's", 90);
  return (
    <Center>
      <Pop delay={Math.min(three, 8)}><H size={360}>3×</H></Pop>
      <Rise delay={Math.min(three, 8) + 6}><H size={84}>faster on computer tasks</H></Rise>
      <Rise delay={theirs}><Small color={C.accent}>* OpenAI's own test, not independent</Small></Rise>
    </Center>
  );
};

// 5 ─ caveat
export const Caveat: React.FC = () => (
  <Center>
    <Rise><H>Not their smartest model.</H></Rise>
  </Center>
);

// 6 ─ business: the broken process, as three words
const Step: React.FC<{ label: string; color: string; delay: number }> = ({ label, color, delay }) => (
  <Rise delay={delay}>
    <div style={{ font: `900 84px/1.15 ${FONT}`, color, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>{label}</div>
  </Rise>
);

export const Business: React.FC = () => {
  const email = useBeat("email", 40);
  const retypes = useBeat("retypes", 90);
  const old = useBeat("old", 110);
  return (
    <Center>
      <div style={{ font: `700 34px/1 ${MONO}`, color: C.muted, letterSpacing: "0.1em", marginBottom: 40 }}>
        DEMO · DENTAL CLINIC
      </div>
      <Step label="Email" color={C.ink} delay={email} />
      <Step label="↓ retyped by hand" color={C.bad} delay={retypes} />
      <Step label="↓ old system, no API" color={C.ink} delay={old} />
    </Center>
  );
};

// 7 ─ fix: the HyperFrames-rendered demo clip
export const Fix: React.FC = () => {
  const p = useIn(0);
  return (
    <Center>
      <div
        style={{
          width: 860,
          height: 860,
          borderRadius: 30,
          overflow: "hidden",
          opacity: p,
          transform: `scale(${0.96 + p * 0.04})`,
        }}
      >
        <OffthreadVideo src={staticFile("assets/terra-form-demo.mp4")} muted style={{ width: 860, height: 860 }} />
      </div>
      <Small>Illustration, not a live test</Small>
    </Center>
  );
};

// 8 ─ verdict
export const VerdictScene: React.FC = () => {
  const testing = useBeat("testing", 25);
  const trusting = useBeat("trusting", 55);
  return (
    <Center>
      <Rise delay={testing}><H color={C.ok}>Worth testing.</H></Rise>
      <Rise delay={trusting}><H color={C.bad}>Not alone.</H></Rise>
    </Center>
  );
};

// 9 ─ cta
export const Cta: React.FC = () => {
  const follow = useBeat("follow", 60);
  return (
    <Center>
      <Rise><H size={110}>Next: a real booking form.</H></Rise>
      <Rise delay={follow}><H size={110} color={C.accent}>Follow →</H></Rise>
    </Center>
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
