import React from "react";
import { useCurrentFrame } from "remotion";
import { useBeat } from "../../components/kit";
import { P, PF, PH, PM, on } from "./kit";
import { Block, Bubble, In, Label, Person, tw } from "./world";

// Pieces shared by the AI videos: the AI as a character, tools as doors, a chat exchange,
// numbered rows, and small scene factories so each video file stays readable.

/** the AI, drawn as a friendly helper. (x, y) is where it stands. */
export const Bot: React.FC<{ x: number; y: number; s?: number; color?: string; label?: string; mark?: string; markColor?: string; dim?: boolean }> = ({
  x,
  y,
  s = 1,
  color = P.accent,
  label,
  mark,
  markColor = P.pill,
  dim,
}) => {
  const frame = useCurrentFrame();
  const blink = frame % 80 < 4;
  return (
    <div style={{ position: "absolute", left: x - 70 * s, top: y - 210 * s, width: 140 * s, opacity: dim ? 0.3 : 1 }}>
      <svg width={140 * s} height={210 * s} viewBox="0 0 140 210">
        <line x1={70} y1={8} x2={70} y2={30} stroke={P.ink} strokeWidth={6} strokeLinecap="round" />
        <circle cx={70} cy={10} r={9} fill={P.warm} stroke={P.ink} strokeWidth={5} />
        <rect x={16} y={30} width={108} height={86} rx={24} fill={P.card} stroke={P.ink} strokeWidth={6} />
        {blink ? (
          <>
            <rect x={38} y={68} width={20} height={5} rx={2} fill={P.ink} />
            <rect x={82} y={68} width={20} height={5} rx={2} fill={P.ink} />
          </>
        ) : (
          <>
            <circle cx={48} cy={70} r={9} fill={P.ink} />
            <circle cx={92} cy={70} r={9} fill={P.ink} />
          </>
        )}
        <path d="M52 94 Q70 106 88 94" stroke={P.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <rect x={26} y={126} width={88} height={80} rx={18} fill={color} stroke={P.ink} strokeWidth={6} />
        <text x={70} y={180} textAnchor="middle" fontFamily="Archivo" fontWeight={800} fontSize={34} fill={on(color)}>
          AI
        </text>
      </svg>
      {mark && (
        <div style={{ position: "absolute", left: 96 * s, top: 4 * s, width: 58, height: 58, borderRadius: 99, background: markColor, color: on(markColor), textAlign: "center", font: `800 38px/58px ${PH}` }}>{mark}</div>
      )}
      {label && <div style={{ position: "absolute", left: -110, right: -110, top: 216 * s, textAlign: "center", font: `600 24px/1.1 ${PM}`, letterSpacing: "0.06em", color: P.soft }}>{label}</div>}
    </div>
  );
};

/** a tool, drawn as a door the owner chooses to open */
export const Door: React.FC<{ x: number; y: number; label: string; open?: boolean; w?: number; h?: number; hot?: boolean }> = ({ x, y, label, open, w = 200, h = 290, hot }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "22px 22px 6px 6px", border: `6px solid ${P.ink}`, background: open ? P.warm : P.pill, boxSizing: "border-box", boxShadow: hot ? `0 0 0 8px ${P.accent}` : undefined }} />
    {!open && <div style={{ position: "absolute", right: 22, top: h / 2 - 12, width: 24, height: 24, borderRadius: 99, background: P.paper }} />}
    <div style={{ position: "absolute", left: 0, right: 0, top: open ? h / 2 - 44 : 34, textAlign: "center", font: `800 ${open ? 34 : 30}px/1.05 ${PH}`, color: open ? P.ink : "#fff" }}>
      {label}
      {open && <div style={{ font: `600 22px/1 ${PM}`, letterSpacing: "0.08em", marginTop: 12, color: P.ink }}>OPEN</div>}
    </div>
    {!open && <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", font: `600 22px/1 ${PM}`, letterSpacing: "0.08em", color: P.line }}>CLOSED</div>}
  </div>
);

/** numbered row (step lists, rules, pages) */
export const Row: React.FC<{ i: number; y: number; text: React.ReactNode; sub?: string; color?: string; size?: number; n?: string }> = ({ i, y, text, sub, color = P.accent, size = 54, n }) => (
  <div style={{ position: "absolute", left: 60, top: y, width: 880, display: "flex", alignItems: "center", gap: 24 }}>
    <span style={{ width: 100, height: 100, flexShrink: 0, borderRadius: 99, background: color, color: on(color), font: `800 58px/100px ${PH}`, textAlign: "center" }}>{n ?? i + 1}</span>
    <div style={{ flex: 1, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 24, padding: "20px 26px", boxShadow: `0 8px 0 ${P.line}` }}>
      <div style={{ font: `700 ${size}px/1.05 ${PF}`, color: P.ink }}>{text}</div>
      {sub && <div style={{ font: `600 28px/1.2 ${PF}`, color: P.soft, marginTop: 8 }}>{sub}</div>}
    </div>
  </div>
);

/** rows that appear on spoken words: [text, beat word, sub?] */
export const Rows: React.FC<{ title?: string; rows: [string, string, string?][]; top?: number; gap?: number; size?: number; color?: string; start?: number }> = ({ title, rows, top = 70, gap = 170, size, color, start = 0 }) => {
  const beats = rows.map(([, w], i) => useBeat(w, 40 + i * 40));
  return (
    <>
      {title && (
        <Label x={500} y={10} w={880} mono size={28}>
          {title}
        </Label>
      )}
      {rows.map(([t, , sub], i) => (
        <In key={t} at={beats[i]}>
          <Row i={i + start} y={top + i * gap} text={t} sub={sub} size={size} color={color} />
        </In>
      ))}
    </>
  );
};

/** a question from the owner and an answer from the AI */
export const Ask: React.FC<{ q: string; a: React.ReactNode; aAt: number; qAt?: number; good?: boolean; who?: "bot" | "none"; aSize?: number }> = ({ q, a, aAt, qAt = 4, good, who = "bot", aSize = 44 }) => (
  <>
    <In at={qAt}>
      <Bubble x={380} y={20} w={640} size={46} tail="left">
        {q}
      </Bubble>
      <Person x={120} y={420} color={P.pill} s={1.05} label="YOU" />
    </In>
    <In at={aAt} pop>
      <Bubble x={560} y={430} w={680} size={aSize} tail="right" color={good ? P.accent : P.pill}>
        {a}
      </Bubble>
    </In>
    {who === "bot" && <Bot x={860} y={830} s={1.05} mark={good === undefined ? undefined : good ? "✓" : "?"} markColor={good ? P.accent : P.pill} />}
  </>
);

/** one big statement */
export const Say: React.FC<{ lines: [React.ReactNode, string?][]; size?: number; top?: number }> = ({ lines, size = 76, top = 120 }) => {
  const beats = lines.map(([, w], i) => useBeat(w ?? "\u0000", i === 0 ? 4 : 50 * i));
  return (
    <>
      {lines.map(([t], i) => (
        <In key={i} at={beats[i]}>
          <div style={{ position: "absolute", left: 60, top: top + i * (size * 2.5), width: 880, font: `800 ${size}px/1.06 ${PH}`, letterSpacing: "-0.02em", color: P.ink }}>{t}</div>
        </In>
      ))}
    </>
  );
};

export const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: P.accent }}>{children}</span>;

/** small labelled tile that can be dark (problem), mint (done) or plain */
export const Chip: React.FC<{ x: number; y: number; w?: number; h?: number; text: string; kind?: "plain" | "bad" | "ok" | "blue"; size?: number; opacity?: number }> = ({ x, y, w = 190, h = 90, text, kind = "plain", size = 28, opacity }) => (
  <Block x={x} y={y} w={w} h={h} color={kind === "bad" ? P.pill : kind === "ok" ? P.warm : kind === "blue" ? P.accent : P.card} size={size} opacity={opacity}>
    {text}
  </Block>
);

export { tw };
