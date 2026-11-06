import React from "react";
import { useBeat } from "../../components/kit";
import { IndustryArt } from "../../components/industry/IndustryArt";
import { Area, Badge, C, Clip, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame, useSpring } from "./primitives";

// FORMAT: same business, two versions (split screen) → stacking advantage cards → widening gap.

const Hook: React.FC = () => {
  const ahead = useBeat("ahead", 90);
  const a = useSpring(0);
  const b = useSpring(6);
  const lift = useSpring(ahead);
  const Side: React.FC<{ label: string; p: number; win?: boolean }> = ({ label, p, win }) => (
    <div
      style={{
        opacity: p * (win ? 1 : 1 - 0.45 * lift),
        transform: `translateY(${(1 - p) * 40 - (win ? lift * 40 : 0)}px) scale(${win ? 1 + lift * 0.06 : 1})`,
        textAlign: "center",
      }}
    >
      <IndustryArt industry="salon" width={410} />
      <div style={{ font: `900 56px/1 ${FONT}`, marginTop: 18, color: win && lift > 0.5 ? C.ok : C.ink }}>{label}</div>
      {win && (
        <div style={{ opacity: lift, font: `800 32px/1 ${MONO}`, color: C.ok, marginTop: 14 }}>↑ PULLING AHEAD</div>
      )}
    </div>
  );
  return (
    <Area>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Tag>SAME STREET · SAME PRICES</Tag>
      </div>
      <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
        <Side label="Salon A" p={a} />
        <Side label="Salon B" p={b} win />
      </div>
    </Area>
  );
};

const Split: React.FC = () => (
  <Area>
    <Clip src="assets/fix-demos/two-phones.mp4" size={900} rate={1.1} />
    <div style={{ textAlign: "center", marginTop: 20, font: `700 30px/1 ${MONO}`, color: C.muted }}>DEMO SCENARIO</div>
  </Area>
);

const ADV = [
  { n: "1", title: "Speed", sub: "First reply = first chance to book", color: C.accent },
  { n: "2", title: "Fewer mistakes", sub: "Typed once, not three times", color: C.blue },
  { n: "3", title: "Your team's time", sub: "Less chasing, more real work", color: C.ok },
];

const Advantages: React.FC<{ active: number; beat: string }> = ({ active, beat }) => {
  const b = useBeat(beat, 10);
  return (
    <Area>
      <div style={{ marginBottom: 36 }}>
        <Tag>THE ADVANTAGES</Tag>
      </div>
      {ADV.map((a, i) => {
        if (i > active) return null;
        const isNow = i === active;
        return <AdvCard key={a.n} adv={a} isNow={isNow} from={isNow ? b : -100} />;
      })}
    </Area>
  );
};

const AdvCard: React.FC<{ adv: (typeof ADV)[number]; isNow: boolean; from: number }> = ({ adv, isNow, from }) => {
  const p = useSpring(from);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        background: isNow ? C.panel : "transparent",
        border: `5px solid ${isNow ? adv.color : C.line}`,
        borderRadius: 30,
        padding: isNow ? "40px 36px" : "22px 30px",
        marginBottom: 24,
        opacity: isNow ? p : 0.55,
        transform: isNow ? `translateX(${(1 - p) * -80}px) scale(${0.9 + p * 0.1})` : undefined,
      }}
    >
      <Badge glyph={adv.n} color={adv.color} size={isNow ? 110 : 70} />
      <div>
        <div style={{ font: `900 ${isNow ? 80 : 46}px/1.05 ${FONT}`, color: C.ink, letterSpacing: "-0.03em" }}>{adv.title}</div>
        {isNow && <div style={{ font: `700 40px/1.25 ${FONT}`, color: C.muted, marginTop: 10 }}>{adv.sub}</div>}
      </div>
    </div>
  );
};

const Speed: React.FC = () => <Advantages active={0} beat="speed" />;
const Accuracy: React.FC = () => <Advantages active={1} beat="mistakes" />;
const Time: React.FC = () => <Advantages active={2} beat="team's" />;

// widening gap: two lines, drawn in, with the space between them filling
const Gap: React.FC = () => {
  const frame = useCurrentFrame();
  const gaps = useBeat("gaps", 60);
  const t = ease(interpolate(frame, [4, gaps + 30], [0, 1], clamp));
  const W = 860;
  const Hh = 560;
  const N = 24;
  const pts = (fn: (x: number) => number) =>
    Array.from({ length: N + 1 }, (_, i) => {
      const x = i / N;
      return [x * W, Hh - fn(x) * Hh] as const;
    });
  const A = pts((x) => 0.2 + 0.08 * x + 0.02 * Math.sin(x * 9));
  const B = pts((x) => 0.2 + 0.62 * Math.pow(x, 1.4) + 0.02 * Math.sin(x * 7));
  const cut = Math.max(1, Math.round(t * N));
  const path = (p: readonly (readonly [number, number])[]) => p.slice(0, cut + 1).map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`).join(" ");
  const fill =
    path(B) +
    " " +
    A.slice(0, cut + 1)
      .reverse()
      .map((q) => `L${q[0]} ${q[1]}`)
      .join(" ") +
    " Z";
  return (
    <Area>
      <H size={84} style={{ marginBottom: 30 }}>
        Small gaps, <span style={{ color: C.accent }}>every day.</span>
      </H>
      <svg width={W} height={Hh + 60} style={{ overflow: "visible" }}>
        <line x1={0} y1={Hh} x2={W} y2={Hh} stroke={C.line} strokeWidth={4} />
        <path d={fill} fill={C.accent} opacity={0.15} />
        <path d={path(A)} stroke={C.muted} strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d={path(B)} stroke={C.ok} strokeWidth={12} fill="none" strokeLinecap="round" />
        {t > 0.95 && (
          <>
            <text x={W - 10} y={B[N][1] - 24} textAnchor="end" fill={C.ok} fontFamily="Inter" fontWeight={900} fontSize={44}>
              Salon B
            </text>
            <text x={W - 10} y={A[N][1] - 24} textAnchor="end" fill={C.muted} fontFamily="Inter" fontWeight={900} fontSize={44}>
              Salon A
            </text>
          </>
        )}
        <text x={0} y={Hh + 50} fill={C.muted} fontFamily="JetBrains Mono" fontWeight={700} fontSize={26}>
          DAY 1 → MONTHS LATER · ILLUSTRATION, NOT DATA
        </text>
      </svg>
    </Area>
  );
};

const Cta: React.FC = () => <SeriesCta line="So which salon are you?" lineColor={C.accent} />;

export const TWO_SALONS: Record<string, React.FC> = {
  hook: Hook,
  split: Split,
  speed: Speed,
  accuracy: Accuracy,
  time: Time,
  gap: Gap,
  cta: Cta,
};
