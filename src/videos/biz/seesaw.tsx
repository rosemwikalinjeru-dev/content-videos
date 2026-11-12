import React from "react";
import { useBeat } from "../../components/kit";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame } from "../explainer/primitives";
import { Beat, Box, CTA_LINE, Demo, Sub } from "./common";

// A seesaw: what the customer pays vs the hours they take. It tips when the hours are counted.

const Row: React.FC<{ text: string; color: string; mark: string }> = ({ text, color, mark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18 }}>
    <span style={{ width: 62, height: 62, borderRadius: 99, background: color, color: C.ground, font: `900 38px/62px ${FONT}`, textAlign: "center", flexShrink: 0 }}>{mark}</span>
    <span style={{ font: `800 50px/1.1 ${FONT}` }}>{text}</span>
  </div>
);

const Hook: React.FC = () => (
  <Area>
    <H size={110}>Your cheapest customer</H>
    <Beat word="expensive" fallback={60} style={{ marginTop: 30 }}>
      <H size={110} color={C.bad}>
        is often your most expensive.
      </H>
    </Beat>
  </Area>
);

const A: React.FC = () => (
  <Area>
    <Box color={C.ok}>
      <Tag color={C.ok}>CUSTOMER A · FULL PRICE</Tag>
      <Beat word="one" fallback={30}>
        <Row text="1 call" color={C.ok} mark="✓" />
      </Beat>
      <Beat word="visit" fallback={50}>
        <Row text="1 visit" color={C.ok} mark="✓" />
      </Beat>
      <Beat word="done" fallback={70}>
        <Row text="Done. Paid." color={C.ok} mark="✓" />
      </Beat>
    </Box>
    <Demo text="DEMO SCENARIO" />
  </Area>
);

const B: React.FC = () => (
  <Area>
    <Box color={C.bad} fill="#2a1220">
      <Tag color={C.bad}>CUSTOMER B · WANTS A DISCOUNT</Tag>
      <Beat word="five" fallback={50}>
        <Row text="5 calls" color={C.bad} mark="!" />
      </Beat>
      <Beat word="two" fallback={70}>
        <Row text="2 changes" color={C.bad} mark="!" />
      </Beat>
      <Beat word="late" fallback={90}>
        <Row text="A late payment" color={C.bad} mark="!" />
      </Beat>
    </Box>
    <Demo text="DEMO SCENARIO" />
  </Area>
);

const Flip: React.FC = () => {
  const frame = useCurrentFrame();
  const count = useBeat("count", 70);
  const t = ease(interpolate(frame, [count, count + 24], [0, 1], clamp));
  const tilt = -6 + t * 20; // starts slightly towards "pays", ends heavily towards "hours"
  const blocks = Math.round(t * 5);
  return (
    <Area>
      <Tag color={t > 0.5 ? C.bad : C.accent}>{t > 0.5 ? "NOW COUNT YOUR HOURS" : "ON PAPER, B LOOKS LIKE INCOME"}</Tag>
      <svg width={860} height={640} style={{ marginTop: 20 }}>
        <polygon points="430,560 370,640 490,640" fill={C.line} />
        <g transform={`rotate(${tilt} 430 540)`}>
          <rect x={50} y={528} width={760} height={24} rx={12} fill={C.ink} />
          {/* left: what B pays */}
          <rect x={80} y={398} width={220} height={130} rx={18} fill={C.ok} />
          <text x={190} y={458} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill={C.ground}>
            What B
          </text>
          <text x={190} y={502} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill={C.ground}>
            pays
          </text>
          {/* right: hours, stacking up */}
          {Array.from({ length: blocks }, (_, i) => (
            <rect key={i} x={590} y={458 - i * 76} width={190} height={66} rx={14} fill={C.bad} />
          ))}
          {blocks > 0 && (
            <text x={685} y={502} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={36} fill={C.ground}>
              Your hours
            </text>
          )}
        </g>
      </svg>
      <div style={{ font: `700 24px/1 ${MONO}`, color: C.muted }}>ILLUSTRATION · DEMO SCENARIO</div>
    </Area>
  );
};

const Lesson: React.FC = () => (
  <Area>
    <H size={120}>Price isn't just money.</H>
    <Beat word="filter" fallback={70} pop style={{ marginTop: 40 }}>
      <svg width={300} height={220} style={{ display: "block" }}>
        <polygon points="10,10 290,10 180,120 180,210 120,210 120,120" fill="none" stroke={C.accent} strokeWidth={12} strokeLinejoin="round" />
      </svg>
      <H size={120} color={C.accent}>
        It's a filter.
      </H>
    </Beat>
    <Sub>…for who you work with</Sub>
  </Area>
);

const Do: React.FC = () => (
  <Area>
    <H size={96} color={C.muted}>
      Don't drop them.
    </H>
    <Beat word="stop" fallback={50} style={{ marginTop: 40 }}>
      <H size={110} color={C.ok}>
        Just stop discounting to win them.
      </H>
    </Beat>
  </Area>
);

export const SEESAW: Record<string, React.FC> = { hook: Hook, a: A, b: B, flip: Flip, lesson: Lesson, do: Do, cta: () => <SeriesCta line={CTA_LINE} /> };
