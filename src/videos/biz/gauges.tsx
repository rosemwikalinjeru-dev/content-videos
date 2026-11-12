import React from "react";
import { useBeat } from "../../components/kit";
import { Area, Badge, C, FONT, H, MONO, SeriesCta, Tag, clamp, interpolate, useCurrentFrame, useSpring } from "../explainer/primitives";
import { Beat } from "./common";

// A scorecard that fills in one number at a time. No values are claimed: each row is a blank to fill.

const NUMS = [
  { t: "New leads", s: "this week", col: C.blue },
  { t: "Booked", s: "how many leads said yes", col: C.accent },
  { t: "Average job", s: "what it's worth", col: "#ff9f43" },
  { t: "Come back", s: "repeat customers", col: C.ok },
  { t: "Days to get paid", s: "from invoice to money", col: "#c792ff" },
];

const Row: React.FC<{ i: number; fresh: boolean; dim: boolean; weak?: boolean }> = ({ i, fresh, dim, weak }) => {
  const frame = useCurrentFrame();
  const n = NUMS[i];
  const p = useSpring(fresh ? 4 : -100);
  const fill = fresh ? interpolate(frame, [10, 34], [0, 1], clamp) : 1;
  const col = weak ? C.bad : n.col;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: p * (dim ? 0.5 : 1),
        transform: `translateX(${(1 - p) * -60}px)`,
        background: weak ? "#2a1220" : C.panel,
        border: `5px solid ${fresh || weak ? col : C.line}`,
        borderRadius: 24,
        padding: fresh ? "26px 26px" : "16px 22px",
        marginBottom: 18,
      }}
    >
      <Badge glyph={String(i + 1)} color={col} size={fresh ? 92 : 64} />
      <div style={{ flex: 1 }}>
        <div style={{ font: `900 ${fresh ? 62 : 42}px/1.05 ${FONT}` }}>{n.t}</div>
        {fresh && <div style={{ font: `700 32px/1.2 ${FONT}`, color: C.muted, marginTop: 6 }}>{n.s}</div>}
        <div style={{ marginTop: 10, height: 14, background: C.ground, borderRadius: 7, overflow: "hidden" }}>
          <div style={{ width: `${fill * (weak ? 22 : 40 + ((i * 37) % 45))}%`, height: "100%", background: col }} />
        </div>
      </div>
      <div style={{ font: `900 ${fresh ? 54 : 40}px/1 ${MONO}`, color: weak ? C.bad : C.muted }}>{weak ? "↓" : "__"}</div>
    </div>
  );
};

const Card: React.FC<{ upTo: number; weak?: number }> = ({ upTo, weak }) => (
  <Area>
    <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Tag>YOUR FRIDAY SCORECARD</Tag>
      <span style={{ font: `700 24px/1 ${MONO}`, color: C.muted }}>FILL IN YOUR OWN</span>
    </div>
    {NUMS.map((_, i) => (i > upTo ? null : <Row key={i} i={i} fresh={i === upTo && weak === undefined} dim={weak !== undefined && weak >= 0 && weak !== i} weak={weak === i} />))}
  </Area>
);

const Hook: React.FC = () => (
  <Area>
    <H size={104}>You can't fix what you don't count.</H>
    <Beat word="five" fallback={70} pop style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 24 }}>
      <span style={{ font: `900 260px/0.9 ${FONT}`, color: C.accent }}>5</span>
      <H size={84}>numbers every owner should know</H>
    </Beat>
  </Area>
);

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const weak = useBeat("weak", 50);
  const follow = useBeat("follow", 120);
  if (frame >= follow - 4) return <SeriesCta line="Count it every Friday." delay={follow - 4} />;
  return (
    <>
      <Card upTo={4} weak={frame >= weak ? 1 : -1} />
      {frame >= weak && (
        <div style={{ position: "absolute", left: 70, top: 1250, font: `900 44px/1 ${FONT}`, color: C.bad }}>The weak one = what to fix first</div>
      )}
    </>
  );
};

export const GAUGES: Record<string, React.FC> = {
  hook: Hook,
  n1: () => <Card upTo={0} />,
  n2: () => <Card upTo={1} />,
  n3: () => <Card upTo={2} />,
  n4: () => <Card upTo={3} />,
  n5: () => <Card upTo={4} />,
  cta: Cta,
};
