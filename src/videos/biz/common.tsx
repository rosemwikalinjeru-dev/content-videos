import React from "react";
import { useBeat } from "../../components/kit";
import { C, FONT, MONO, useSpring } from "../explainer/primitives";

// Helpers for the "business" videos (not automation). Each video still has its own visuals.

/** Reveal children on a spoken word (or at a fixed frame). */
export const Beat: React.FC<{
  word?: string;
  at?: number;
  fallback?: number;
  pop?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ word, at, fallback = 0, pop, children, style }) => {
  const b = useBeat(word ?? "\u0000", fallback);
  const p = useSpring(at ?? b);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.4),
        transform: pop ? `scale(${0.7 + p * 0.3})` : `translateY(${(1 - p) * 30}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Demo: React.FC<{ text?: string }> = ({ text = "DEMO NUMBERS · NOT REAL DATA" }) => (
  <div style={{ font: `700 24px/1.3 ${MONO}`, letterSpacing: "0.06em", color: C.muted, marginTop: 24 }}>{text}</div>
);

export const Box: React.FC<{ color?: string; fill?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  color = C.line,
  fill = C.panel,
  children,
  style,
}) => (
  <div style={{ border: `5px solid ${color}`, background: fill, borderRadius: 28, padding: "28px 32px", ...style }}>{children}</div>
);

export const Sub: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = C.muted, size = 42 }) => (
  <div style={{ font: `700 ${size}px/1.25 ${FONT}`, color }}>{children}</div>
);

/** faceless person, feet at (x, y) */
export const Fig: React.FC<{ x: number; y: number; color: string; s?: number; opacity?: number }> = ({ x, y, color, s = 1, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <rect x={-34} y={-110} width={68} height={110} rx={30} fill={color} />
    <circle cx={0} cy={-142} r={30} fill={color} />
  </g>
);

export const CTA_LINE = "One business fix, every week.";
