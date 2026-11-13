import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { P, PF, PH, PM, clampP, easeP, lerp, on, useSpr } from "./kit";

// Shared pieces for the paper-format worlds (people, labels, the closing card).

export type Pt = { x: number; y: number };

export const tw = (frame: number, start: number, dur = 12) => easeP(interpolate(frame, [start, start + dur], [0, 1], clampP));

export const move = (frame: number, start: number, dur: number, a: Pt, b: Pt, hop = 26): Pt => {
  const t = tw(frame, start, dur);
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) - Math.sin(t * Math.PI) * hop };
};

/** fades + lifts its children in at a frame */
export const In: React.FC<{ at: number; children: React.ReactNode; pop?: boolean }> = ({ at, children, pop }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = tw(frame, at, 9);
  return <div style={{ position: "absolute", inset: 0, opacity: t, transform: pop ? `scale(${0.92 + t * 0.08})` : `translateY(${(1 - t) * 18}px)` }}>{children}</div>;
};

export const Label: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; w?: number; size?: number; mono?: boolean; head?: boolean }> = ({
  x,
  y,
  children,
  color = P.soft,
  w = 320,
  size = 30,
  mono,
  head,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y,
      width: w,
      textAlign: "center",
      font: head ? `800 ${size}px/1.05 ${PH}` : mono ? `600 ${size}px/1.15 ${PM}` : `700 ${size}px/1.15 ${PF}`,
      letterSpacing: mono ? "0.06em" : undefined,
      color,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ x: number; y: number; text: string; color?: string; size?: number }> = ({ x, y, text, color = P.ink, size = 30 }) => (
  <div style={{ position: "absolute", left: x - 300, top: y, width: 600, textAlign: "center" }}>
    <span style={{ display: "inline-block", background: color, color: on(color), borderRadius: 999, padding: "10px 22px", font: `800 ${size}px/1 ${PH}`, whiteSpace: "nowrap" }}>{text}</span>
  </div>
);

/** a faceless person: round head, simple body. (x, y) is where the feet are. */
export const Person: React.FC<{ x: number; y: number; color?: string; s?: number; dim?: boolean; label?: string; mark?: string; markColor?: string }> = ({
  x,
  y,
  color = P.accent,
  s = 1,
  dim,
  label,
  mark,
  markColor = P.bad,
}) => (
  <div style={{ position: "absolute", left: x - 60 * s, top: y - 190 * s, width: 120 * s, opacity: dim ? 0.28 : 1 }}>
    <svg width={120 * s} height={190 * s} viewBox="0 0 120 190">
      <circle cx={60} cy={38} r={30} fill={P.paper2} stroke={P.ink} strokeWidth={6} />
      <path d="M14 186 L14 130 Q14 82 60 82 Q106 82 106 130 L106 186 Z" fill={color} stroke={P.ink} strokeWidth={6} strokeLinejoin="round" />
    </svg>
    {mark && (
      <div style={{ position: "absolute", left: 78 * s, top: -18 * s, width: 54, height: 54, borderRadius: 99, background: markColor, color: on(markColor), textAlign: "center", font: `800 36px/54px ${PH}` }}>{mark}</div>
    )}
    {label && (
      <div style={{ position: "absolute", left: -100, right: -100, top: 196 * s, textAlign: "center", font: `600 24px/1.1 ${PM}`, letterSpacing: "0.06em", color: P.soft }}>{label}</div>
    )}
  </div>
);

export const Bubble: React.FC<{ x: number; y: number; w?: number; children: React.ReactNode; color?: string; size?: number; tail?: "left" | "right" | "none" }> = ({
  x,
  y,
  w = 420,
  children,
  color = P.ink,
  size = 44,
  tail = "left",
}) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, background: P.card, border: `5px solid ${color}`, borderRadius: 26, padding: "20px 24px", font: `700 ${size}px/1.12 ${PF}`, color: P.ink, boxShadow: `0 8px 0 ${P.line}` }}>
    {children}
    {tail !== "none" && (
      <div style={{ position: "absolute", bottom: -22, [tail]: 46, width: 30, height: 30, background: P.card, borderRight: `5px solid ${color}`, borderBottom: `5px solid ${color}`, transform: "rotate(45deg)" } as React.CSSProperties} />
    )}
  </div>
);

/** a coloured block (calendar job, bar, tile) */
export const Block: React.FC<{ x: number; y: number; w: number; h: number; color: string; children?: React.ReactNode; ink?: string; dashed?: boolean; opacity?: number; size?: number }> = ({
  x,
  y,
  w,
  h,
  color,
  children,
  ink,
  dashed,
  opacity = 1,
  size = 26,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 14,
      background: dashed ? "transparent" : color,
      border: dashed ? `5px dashed ${color}` : `4px solid ${P.ink}`,
      color: dashed ? color : (ink ?? on(color)),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      font: `700 ${size}px/1.05 ${PF}`,
      opacity,
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpr(4);
  const pulse = 1 + Math.sin(frame / 6) * 0.03;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 120, transform: `scale(${p * pulse})`, transformOrigin: "left center", background: P.accent, color: "#fff", borderRadius: 999, padding: "34px 70px", font: `800 96px/1 ${PH}`, boxShadow: `0 12px 0 ${P.line}` }}>
        Follow →
      </div>
      <div style={{ position: "absolute", left: 64, top: 330, font: `600 34px/1.3 ${PM}`, letterSpacing: "0.06em", color: P.soft, opacity: p }}>
        ROSE NJERU AUTOMATION
        <br />
        ONE BUSINESS FIX, EVERY WEEK
      </div>
    </>
  );
};
