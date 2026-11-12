import React from "react";
import { useBeat } from "../../components/kit";
import { Area, Badge, C, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame } from "../explainer/primitives";
import { Beat, Box, CTA_LINE } from "./common";

// A week calendar. The wrong job lands on Thursday; the right one bounces off.

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const CW = 160;
const colX = (d: number) => 10 + d * (CW + 10);

const Week: React.FC<{ badWord?: string; goodWord?: string; badOn?: boolean }> = ({ badWord, goodWord, badOn }) => {
  const frame = useCurrentFrame();
  const bw = useBeat(badWord ?? "\u0000", 20);
  const gw = useBeat(goodWord ?? "\u0000", 80);
  const drop = badOn ? 1 : badWord ? ease(interpolate(frame, [bw, bw + 14], [0, 1], clamp)) : 0;
  // good job flies in, hits Thursday, bounces away
  const g = goodWord ? interpolate(frame, [gw - 22, gw, gw + 22], [0, 1, 2], clamp) : -1;
  const gx = g <= 1 ? 900 - ease(Math.max(0, g)) * (900 - colX(3)) : colX(3) + ease(g - 1) * 520;
  const gy = g <= 1 ? 40 + ease(Math.max(0, g)) * 150 : 190 - Math.sin((g - 1) * Math.PI) * 120 + (g - 1) * 260;
  return (
    <svg width={860} height={560} style={{ overflow: "visible" }}>
      {DAYS.map((d, i) => (
        <g key={d}>
          <rect x={colX(i)} y={60} width={CW} height={480} rx={18} fill={C.panel} stroke={i === 3 && drop > 0.5 ? C.bad : C.line} strokeWidth={5} />
          <text x={colX(i) + CW / 2} y={40} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={800} fontSize={30} fill={i === 3 ? C.accent : C.muted}>
            {d}
          </text>
        </g>
      ))}
      {/* a couple of normal jobs: a slow week */}
      <rect x={colX(0) + 12} y={90} width={CW - 24} height={110} rx={14} fill={C.blue} opacity={0.7} />
      <rect x={colX(2) + 12} y={260} width={CW - 24} height={110} rx={14} fill={C.blue} opacity={0.7} />
      {/* the wrong job fills Thursday */}
      {drop > 0 && (
        <g transform={`translate(0 ${(1 - drop) * -300})`} opacity={drop}>
          <rect x={colX(3) + 12} y={84} width={CW - 24} height={430} rx={14} fill="#5d6688" />
          <text x={colX(3) + CW / 2} y={290} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={30} fill={C.ink}>
            Bad fit
          </text>
          <text x={colX(3) + CW / 2} y={326} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={24} fill={C.ink}>
            all day
          </text>
        </g>
      )}
      {g >= 0 && (
        <g transform={`translate(${gx} ${gy})`} opacity={g > 1.7 ? 2 - g / 1 + 0.7 : 1}>
          <rect x={12} y={0} width={CW - 24} height={170} rx={14} fill={C.accent} />
          <text x={CW / 2} y={78} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={30} fill={C.ground}>
            Ideal
          </text>
          <text x={CW / 2} y={114} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={30} fill={C.ground}>
            customer
          </text>
        </g>
      )}
    </svg>
  );
};

const Hook: React.FC = () => (
  <Area>
    <H size={90}>The most profitable word in your business:</H>
    <Beat word="no" fallback={110} pop style={{ marginTop: 20 }}>
      <H size={420} color={C.accent}>
        No.
      </H>
    </Beat>
  </Area>
);

const Setup: React.FC = () => (
  <Area>
    <Tag>A SLOW WEEK · DEMO SCENARIO</Tag>
    <Box color={C.muted} style={{ marginTop: 30 }}>
      <div style={{ font: `900 64px/1.05 ${FONT}` }}>A job that's a bad fit</div>
      <div style={{ display: "flex", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
        {[
          ["Far away", "far"],
          ["Low pay", "low"],
          ["Vague details", "vague"],
        ].map(([t, w], i) => (
          <Beat key={t} word={w} fallback={90 + i * 20} pop>
            <span style={{ display: "inline-block", background: C.bad, color: C.ground, borderRadius: 14, padding: "14px 20px", font: `900 40px/1 ${FONT}` }}>✕ {t}</span>
          </Beat>
        ))}
      </div>
    </Box>
    <div style={{ marginTop: 30 }}>
      <Week />
    </div>
  </Area>
);

const Block: React.FC = () => (
  <Area>
    <Tag color={C.bad}>THURSDAY'S GONE</Tag>
    <div style={{ marginTop: 40 }}>
      <Week badWord="thursday" goodWord="gone" />
    </div>
  </Area>
);

const Cost: React.FC = () => (
  <Area>
    <H size={96} color={C.muted}>
      It didn't just pay less.
    </H>
    <Beat word="cost" fallback={60} style={{ marginTop: 40 }}>
      <H size={120} color={C.bad}>
        It cost you the right one.
      </H>
    </Beat>
  </Area>
);

const RULES: [string, string][] = [
  ["Your area", "area"],
  ["Your minimum price", "minimum"],
  ["Your type of work", "type"],
];

const Fix: React.FC = () => (
  <Area>
    <Tag color={C.ok}>3 RULES FOR A GOOD JOB</Tag>
    {RULES.map(([t, w], i) => (
      <Beat key={t} word={w} fallback={60 + i * 30} style={{ marginTop: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Badge glyph={String(i + 1)} color={C.ok} size={104} />
          <H size={84}>{t}</H>
        </div>
      </Beat>
    ))}
  </Area>
);

const Use: React.FC = () => (
  <Area>
    <Tag>A NEW REQUEST COMES IN</Tag>
    <Box style={{ marginTop: 26 }}>
      {[
        ["Your area", false],
        ["Your minimum price", false],
        ["Your type of work", true],
      ].map(([t, ok]) => (
        <div key={String(t)} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
          <Badge glyph={ok ? "✓" : "✕"} color={ok ? C.ok : C.bad} size={70} />
          <span style={{ font: `800 52px/1.1 ${FONT}` }}>{t}</span>
        </div>
      ))}
    </Box>
    <Beat word="no" fallback={70} pop style={{ marginTop: 34, alignSelf: "flex-start" }}>
      <div style={{ border: `8px solid ${C.accent}`, color: C.accent, borderRadius: 18, padding: "16px 28px", font: `900 76px/1.05 ${FONT}`, transform: "rotate(-3deg)" }}>
        NO → refer them on
      </div>
    </Beat>
    <div style={{ font: `700 24px/1 ${MONO}`, color: C.muted, marginTop: 24 }}>BREAKS 2 OF 3 RULES</div>
  </Area>
);

export const CALENDAR: Record<string, React.FC> = { hook: Hook, setup: Setup, block: Block, cost: Cost, fix: Fix, use: Use, cta: () => <SeriesCta line={CTA_LINE} /> };
