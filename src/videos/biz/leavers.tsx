import React from "react";
import { useBeat } from "../../components/kit";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame } from "../explainer/primitives";
import { Beat, Box, Fig } from "./common";

// Ten customers. One speaks up. Nine walk out quietly. Then: ask first.

const Crowd: React.FC<{ bubbleWord?: string; leaveWord?: string; fadeWord?: string }> = ({ bubbleWord, leaveWord, fadeWord }) => {
  const frame = useCurrentFrame();
  const bub = useBeat(bubbleWord ?? "\u0000", 60);
  const lv = useBeat(leaveWord ?? "\u0000", 40);
  const fd = useBeat(fadeWord ?? "\u0000", 60);
  return (
    <svg width={860} height={640} style={{ overflow: "visible" }}>
      {/* door */}
      {leaveWord && (
        <g>
          <rect x={760} y={120} width={100} height={460} rx={10} fill="none" stroke={C.line} strokeWidth={8} />
          <text x={810} y={100} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={800} fontSize={26} fill={C.muted}>
            EXIT
          </text>
        </g>
      )}
      {Array.from({ length: 10 }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const x = 90 + col * 140;
        const y = 300 + row * 290;
        const speaker = i === 0;
        let dx = 0;
        let o = 1;
        if (leaveWord && !speaker) {
          const t = ease(interpolate(frame, [lv + i * 3, lv + i * 3 + 26], [0, 1], clamp));
          dx = t * (800 - x);
          o = 1 - t * 0.85;
        }
        if (fadeWord && !speaker) o = 1 - 0.8 * interpolate(frame, [fd, fd + 16], [0, 1], clamp);
        return <Fig key={i} x={x + dx} y={y} color={speaker && (bubbleWord || leaveWord) ? C.accent : C.muted} opacity={o} />;
      })}
      {(bubbleWord ? frame >= bub : Boolean(leaveWord)) && (
        <g transform="translate(150 60)">
          <rect x={0} y={0} width={330} height={80} rx={24} fill={C.accent} />
          <polygon points="20,78 60,78 20,112" fill={C.accent} />
          <text x={165} y={52} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={34} fill={C.ground}>
            "It wasn't great."
          </text>
        </g>
      )}
    </svg>
  );
};

const Hook: React.FC = () => (
  <Area>
    <H size={84}>Unhappy customers usually don't complain.</H>
    <Crowd fadeWord="they" />
    <Beat word="back" fallback={110}>
      <H size={84} color={C.bad}>
        They just don't come back.
      </H>
    </Beat>
  </Area>
);

const Quiet: React.FC = () => (
  <Area>
    <Tag>PICTURE 10 CUSTOMERS · A SO-SO VISIT</Tag>
    <Crowd bubbleWord="one" />
    <div style={{ font: `700 24px/1 ${MONO}`, color: C.muted }}>ILLUSTRATION · NOT A STATISTIC</div>
  </Area>
);

const Gone: React.FC = () => (
  <Area>
    <Tag color={C.bad}>THE REST LEAVE QUIETLY</Tag>
    <Crowd leaveWord="leave" />
    <div style={{ font: `700 24px/1 ${MONO}`, color: C.muted }}>ILLUSTRATION · NOT A STATISTIC</div>
  </Area>
);

const Why: React.FC = () => (
  <Area>
    <Box color={C.bad} fill="#2a1220">
      <div style={{ font: `800 32px/1 ${MONO}`, color: C.bad }}>COMPLAINING</div>
      <div style={{ font: `900 110px/1.05 ${FONT}`, marginTop: 10 }}>feels awkward</div>
    </Box>
    <Beat word="leaving" fallback={50} style={{ marginTop: 30 }}>
      <Box color={C.ok} fill="#0f2a22">
        <div style={{ font: `800 32px/1 ${MONO}`, color: C.ok }}>LEAVING</div>
        <div style={{ font: `900 110px/1.05 ${FONT}`, marginTop: 10 }}>is easy</div>
      </Box>
    </Beat>
  </Area>
);

const Bubble: React.FC<{ text: string; out?: boolean; color?: string }> = ({ text, out, color }) => (
  <div style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", marginTop: 26 }}>
    <div
      style={{
        maxWidth: 700,
        background: color ?? (out ? C.blue : C.panel2),
        color: out ? "#fff" : C.ink,
        borderRadius: 36,
        padding: "30px 36px",
        font: `800 60px/1.15 ${FONT}`,
      }}
    >
      {text}
    </div>
  </div>
);

const Fix: React.FC = () => (
  <Area>
    <Tag color={C.ok}>SO ASK FIRST · AFTER EVERY VISIT</Tag>
    <Beat word="how" fallback={90} pop>
      <Bubble text="How did we do today?" out />
    </Beat>
  </Area>
);

const Then: React.FC = () => (
  <Area>
    <Bubble text="How did we do today?" out />
    <Beat word="not" fallback={40}>
      <Bubble text="Not great, honestly." />
    </Beat>
    <Beat word="call" fallback={80} pop style={{ marginTop: 50 }}>
      <H size={110} color={C.ok}>
        ☎ Call them the same day.
      </H>
    </Beat>
  </Area>
);

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const follow = useBeat("follow", 110);
  if (frame >= follow - 4) return <SeriesCta line="Ask before they leave." delay={follow - 4} />;
  return (
    <Area>
      <H size={100} color={C.ok}>
        A complaint is a second chance.
      </H>
      <Beat word="silence" fallback={60} style={{ marginTop: 40 }}>
        <H size={130} color={C.muted}>
          Silence isn't.
        </H>
      </Beat>
    </Area>
  );
};

export const LEAVERS: Record<string, React.FC> = { hook: Hook, quiet: Quiet, gone: Gone, why: Why, fix: Fix, then: Then, cta: Cta };
