import React from "react";
import { useBeat } from "../../components/kit";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame } from "../explainer/primitives";
import { Beat, Box, CTA_LINE, Fig, Sub } from "./common";

// Knowledge lives in one head, walks out the door, then gets written into the business.

const KNOW: [string, string, number, number][] = [
  ["Supplier codes", "supplier", 250, 150],
  ["Tricky customers", "tricky", 560, 250],
  ["The real schedule", "schedule", 300, 370],
];

const Head: React.FC<{ leaveWord?: string }> = ({ leaveWord }) => {
  const frame = useCurrentFrame();
  const beats = KNOW.map(([, w], i) => useBeat(w, i * 30));
  const lv = useBeat(leaveWord ?? "\u0000", 40);
  const t = leaveWord ? ease(interpolate(frame, [lv, lv + 30], [0, 1], clamp)) : 0;
  return (
    <svg width={860} height={720} style={{ overflow: "visible" }}>
      <g transform={`translate(${t * 700} 0)`} opacity={1 - t * 0.9}>
        <ellipse cx={430} cy={260} rx={400} ry={250} fill={C.panel} stroke={C.line} strokeWidth={8} strokeDasharray="10 18" />
        <Fig x={430} y={720} color={C.blue} s={1.3} />
        {KNOW.map(([label], i) => {
          const on = leaveWord ? true : frame >= beats[i];
          return on ? (
            <g key={label} transform={`translate(${KNOW[i][2]} ${KNOW[i][3]})`}>
              <rect x={-150} y={-36} width={300} height={72} rx={18} fill={C.accent} />
              <text y={12} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={32} fill={C.ground}>
                {label}
              </text>
            </g>
          ) : null;
        })}
      </g>
    </svg>
  );
};

const Hook: React.FC = () => (
  <Area>
    <H size={100}>The day your best employee</H>
    <Beat word="quits" fallback={90} pop style={{ marginTop: 20 }}>
      <H size={200} color={C.bad}>
        quits?
      </H>
    </Beat>
  </Area>
);

const HeadScene: React.FC = () => (
  <Area>
    <Tag>IT'S ALL IN HER HEAD</Tag>
    <Head />
    <Beat word="none" fallback={150} pop>
      <H size={76} color={C.bad}>
        None of it is written down.
      </H>
    </Beat>
  </Area>
);

const Leave: React.FC = () => (
  <Area>
    <Tag color={C.bad}>SHE LEAVES</Tag>
    <Head leaveWord="leaves" />
    <Beat word="with" fallback={70}>
      <H size={84} color={C.bad}>
        …and it all leaves with her.
      </H>
    </Beat>
  </Area>
);

const Fix: React.FC = () => (
  <Area>
    <Tag color={C.ok}>THE FIX · 1 HOUR A WEEK</Tag>
    <Beat word="pick" fallback={50} style={{ marginTop: 30 }}>
      <Box color={C.ok}>
        <div style={{ font: `900 60px/1.1 ${FONT}` }}>Task: Ordering from the supplier</div>
        {["Log in to the supplier site", "Use code on the price sheet", "Order by Wednesday noon"].map((s, i) => (
          <Beat key={s} word="write" fallback={90} at={undefined} style={{ marginTop: 16 }}>
            <div style={{ font: `700 40px/1.2 ${FONT}`, color: C.muted }}>
              {i + 1}. {s}
            </div>
          </Beat>
        ))}
      </Box>
    </Beat>
    <Sub>Demo example</Sub>
  </Area>
);

const Test: React.FC = () => (
  <Area>
    <Tag>THE TEST</Tag>
    <svg width={860} height={420} style={{ marginTop: 10 }}>
      <Fig x={180} y={400} color={C.muted} s={1.5} />
      <text x={180} y={70} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={800} fontSize={30} fill={C.muted}>
        SOMEONE NEW
      </text>
      <rect x={420} y={90} width={380} height={300} rx={24} fill={C.panel} stroke={C.ok} strokeWidth={6} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={460} y={140 + i * 70} width={300} height={26} rx={13} fill={C.line} />
      ))}
    </svg>
    <Beat word="without" fallback={80} pop>
      <H size={84} color={C.ok}>
        Can they do it without asking her?
      </H>
    </Beat>
  </Area>
);

const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const not = useBeat("not", 110);
  return (
    <Area>
      <Tag color={C.ok}>10 WEEKS → 10 TASKS</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 150px)", gap: 18, marginTop: 30 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const on = frame >= 6 + i * 6;
          return (
            <div
              key={i}
              style={{
                height: 170,
                borderRadius: 18,
                background: on ? "#0f2a22" : C.panel,
                border: `5px solid ${on ? C.ok : C.line}`,
                font: `900 60px/160px ${FONT}`,
                textAlign: "center",
                color: on ? C.ok : C.line,
              }}
            >
              {on ? "✓" : i + 1}
            </div>
          );
        })}
      </div>
      <H size={80} style={{ marginTop: 36 }}>
        In the business.
      </H>
      <div style={{ opacity: frame >= not ? 1 : 0 }}>
        <H size={80} color={C.muted}>
          Not in one head.
        </H>
      </div>
      <div style={{ font: `700 24px/1 ${MONO}`, color: C.muted, marginTop: 14 }}>ONE TASK A WEEK</div>
    </Area>
  );
};

export const KNOWLEDGE: Record<string, React.FC> = { hook: Hook, head: HeadScene, leave: Leave, fix: Fix, test: Test, result: Result, cta: () => <SeriesCta line={CTA_LINE} /> };
