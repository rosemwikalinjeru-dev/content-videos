import React from "react";
import { useBeat } from "../../components/kit";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, useCurrentFrame, useSpring } from "../explainer/primitives";
import { Beat, Box, CTA_LINE, Sub } from "./common";

// Task chips rain onto one desk and jam; then they get sorted into three trays.

const CHIPS: [string, string][] = [
  ["Quotes", "quotes"],
  ["Refunds", "refunds"],
  ["Schedule changes", "schedule"],
  ["Supplier questions", "supplier"],
];

const Chip: React.FC<{ text: string; color?: string; small?: boolean }> = ({ text, color = C.accent, small }) => (
  <div
    style={{
      display: "inline-block",
      background: color,
      color: C.ground,
      borderRadius: 16,
      padding: small ? "10px 16px" : "18px 26px",
      font: `900 ${small ? 30 : 44}px/1.1 ${FONT}`,
      margin: "0 12px 14px 0",
    }}
  >
    {text}
  </div>
);

const Desk: React.FC<{ jam?: boolean }> = ({ jam }) => (
  <div
    style={{
      marginTop: 20,
      border: `6px solid ${jam ? C.bad : C.line}`,
      background: jam ? "#2a1220" : C.panel,
      borderRadius: 24,
      padding: "26px 30px",
      textAlign: "center",
      font: `900 70px/1 ${FONT}`,
      color: jam ? C.bad : C.ink,
    }}
  >
    YOUR DESK
  </div>
);

const Hook: React.FC = () => (
  <Area>
    <H size={104}>Every decision waits for you</H>
    <Beat word="speed" fallback={80} style={{ marginTop: 40 }}>
      <H size={104} color={C.accent}>
        = the business moves at your speed.
      </H>
    </Beat>
  </Area>
);

const Pile: React.FC = () => (
  <Area>
    <div style={{ minHeight: 360 }}>
      {CHIPS.map(([t, w], i) => (
        <Beat key={t} word={w} fallback={i * 20} pop style={{ display: "inline-block" }}>
          <Chip text={t} />
        </Beat>
      ))}
    </div>
    <div style={{ font: `900 80px/1 ${FONT}`, color: C.muted, textAlign: "center" }}>↓</div>
    <Beat word="yours" fallback={120}>
      <Desk />
    </Beat>
  </Area>
);

const Cost: React.FC = () => {
  const frame = useCurrentFrame();
  const stops = useBeat("stops", 70);
  const jam = frame >= stops;
  return (
    <Area>
      <div style={{ opacity: jam ? 0.45 : 1 }}>
        {CHIPS.map(([t]) => (
          <Chip key={t} text={t} color={jam ? C.muted : C.accent} />
        ))}
      </div>
      <Desk jam={jam} />
      <Beat word="stops" fallback={70} pop style={{ marginTop: 40, textAlign: "center" }}>
        <H size={130} color={C.bad}>
          Everything stops.
        </H>
      </Beat>
      <Sub>On a job. Asleep. On vacation.</Sub>
    </Area>
  );
};

const TRAYS: { title: string; sub: string; col: string; word: string; items: string[] }[] = [
  { title: "Only you", sub: "the big calls", col: C.accent, word: "only", items: ["Big quotes"] },
  { title: "Someone else, with a rule", sub: "written down once", col: C.ok, word: "someone", items: ["Refunds", "Schedule changes", "Supplier questions"] },
  { title: "Nobody", sub: "stop doing it", col: C.muted, word: "nobody", items: [] },
];

const Trays: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <Area>
    <div style={{ marginBottom: 26 }}>
      <Tag>SORT EVERY DECISION</Tag>
    </div>
    {TRAYS.map((t, i) => (
      <Beat key={t.title} word={filled ? undefined : t.word} at={filled ? i * 5 : undefined} fallback={i * 30} style={{ marginBottom: 22 }}>
        <Box color={t.col}>
          <div style={{ font: `900 56px/1.05 ${FONT}`, color: t.col }}>{t.title}</div>
          <div style={{ font: `700 32px/1.2 ${FONT}`, color: C.muted, marginTop: 6 }}>{t.sub}</div>
          {filled && t.items.length > 0 && (
            <div style={{ marginTop: 14 }}>
              {t.items.map((x) => (
                <Chip key={x} text={x} color={t.col} small />
              ))}
            </div>
          )}
        </Box>
      </Beat>
    ))}
  </Area>
);

const Rule: React.FC = () => {
  const p = useSpring(0);
  return (
    <Area>
      <div style={{ opacity: p }}>
        <Tag color={C.ok}>A RULE SOUNDS LIKE THIS</Tag>
      </div>
      <Beat word="refunds" fallback={40} pop style={{ marginTop: 34 }}>
        <Box color={C.ok} fill="#0f2a22" style={{ padding: "44px 40px" }}>
          <div style={{ font: `700 34px/1 ${MONO}`, color: C.ok, letterSpacing: "0.08em" }}>RULE #1</div>
          <div style={{ font: `900 84px/1.08 ${FONT}`, marginTop: 20 }}>Refunds under $50</div>
          <div style={{ font: `900 84px/1.08 ${FONT}`, color: C.ok, marginTop: 10 }}>→ front desk decides</div>
        </Box>
      </Beat>
      <Sub>Example only. Set the amount that fits your business.</Sub>
    </Area>
  );
};

export const BOTTLENECK: Record<string, React.FC> = {
  hook: Hook,
  pile: Pile,
  cost: Cost,
  sort: () => <Trays />,
  rule: Rule,
  result: () => <Trays filled />,
  cta: () => <SeriesCta line={CTA_LINE} />,
};
