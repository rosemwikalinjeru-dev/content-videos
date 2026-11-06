import React from "react";
import { useBeat } from "../../components/kit";
import { IndustryArt } from "../../components/industry/IndustryArt";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame, useSpring } from "./primitives";

// FORMAT: chain reaction. Five domino tiles on a loop tip over one by one, then the
// same loop turns red for the twist ("automate a broken process → mistakes faster").

const NODES = ["Fast reply", "More bookings", "Full schedule", "More reviews", "More leads"];
const R = 330;
const CX = 470;
const CY = 470;

const Loop: React.FC<{ upTo: number; beatWord: string; red?: boolean; spin?: boolean }> = ({ upTo, beatWord, red, spin }) => {
  const frame = useCurrentFrame();
  const beat = useBeat(beatWord, 8);
  const col = red ? C.bad : C.ok;
  const labels = red
    ? ["Broken process", "Automated", "Mistakes, faster", "Angry customers", "Bad reviews"]
    : NODES;
  const pos = (i: number) => {
    const a = -Math.PI / 2 + (i / NODES.length) * Math.PI * 2;
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
  };
  return (
    <svg width={940} height={940} style={{ alignSelf: "center", overflow: "visible" }}>
      {/* arrows between nodes */}
      {labels.map((_, i) => {
        const a = pos(i);
        const b = pos((i + 1) % NODES.length);
        const lit = i < upTo || (spin && i === NODES.length - 1);
        const prog = i === upTo - 1 ? ease(interpolate(frame, [beat, beat + 12], [0, 1], clamp)) : lit ? 1 : 0;
        const mx = a.x + (b.x - a.x) * prog;
        const my = a.y + (b.y - a.y) * prog;
        return (
          <g key={`e${i}`}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.line} strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" />
            {prog > 0 && <line x1={a.x} y1={a.y} x2={mx} y2={my} stroke={col} strokeWidth={10} strokeLinecap="round" />}
          </g>
        );
      })}
      {/* domino tiles */}
      {labels.map((label, i) => {
        const p = pos(i);
        const tipAt = i === 0 ? 0 : i < upTo ? (i === upTo ? beat : -999) : beat;
        const isTipping = i === upTo;
        const fallen = i < upTo || (isTipping && frame >= beat + 6);
        const tilt = isTipping ? ease(interpolate(frame, [beat, beat + 10], [0, 1], clamp)) : fallen ? 1 : 0;
        const active = i <= upTo;
        void tipAt;
        return (
          <g key={`n${i}`} transform={`translate(${p.x} ${p.y})`}>
            <g transform={`rotate(${tilt * -12})`}>
              <rect
                x={-120}
                y={-62}
                width={240}
                height={124}
                rx={22}
                fill={active ? (red ? "#2a1220" : "#0f2a22") : C.panel}
                stroke={active ? col : C.line}
                strokeWidth={6}
              />
              <text x={0} y={-6} textAnchor="middle" fill={active ? C.ink : C.muted} fontFamily="Inter" fontWeight={900} fontSize={30}>
                {label.split(" ")[0]}
              </text>
              <text x={0} y={30} textAnchor="middle" fill={active ? C.ink : C.muted} fontFamily="Inter" fontWeight={900} fontSize={30}>
                {label.split(" ").slice(1).join(" ")}
              </text>
            </g>
          </g>
        );
      })}
      {spin && (
        <g transform={`translate(${CX} ${CY}) rotate(${frame * 3})`}>
          <path d="M -90 0 A 90 90 0 1 1 0 90" stroke={col} strokeWidth={14} fill="none" strokeLinecap="round" />
          <polygon points="-18,80 18,80 0,110" fill={col} transform="rotate(-90 0 90)" />
        </g>
      )}
      {!spin && (
        <text x={CX} y={CY + 14} textAnchor="middle" fill={col} fontFamily="JetBrains Mono" fontWeight={800} fontSize={34}>
          {red ? "THE WRONG LOOP" : "ONE AUTOMATION"}
        </text>
      )}
    </svg>
  );
};

const Hook: React.FC = () => {
  const one = useBeat("one", 60);
  const replying = useBeat("replying", 140);
  const p = useSpring(0);
  const q = useSpring(one);
  const r = useSpring(replying);
  return (
    <Area>
      <div style={{ opacity: p, alignSelf: "center" }}>
        <IndustryArt industry="hvac" width={820} />
      </div>
      <div style={{ opacity: q, marginTop: 40 }}>
        <Tag>AUTOMATE JUST ONE THING</Tag>
      </div>
      <div style={{ opacity: r, transform: `translateY(${(1 - r) * 30}px)`, marginTop: 20 }}>
        <H size={96} color={C.accent}>
          Replying to new leads.
        </H>
      </div>
    </Area>
  );
};

const D: React.FC<{ n: number; word: string; caption: string }> = ({ n, word, caption }) => (
  <Area>
    <div style={{ marginBottom: 10 }}>
      <Tag color={C.ok}>RIPPLE {n} OF 4</Tag>
    </div>
    <Loop upTo={n} beatWord={word} spin={n === 4} />
    <div style={{ font: `800 46px/1.2 ${FONT}`, color: C.muted, textAlign: "center" }}>{caption}</div>
  </Area>
);

const D1: React.FC = () => <D n={1} word="book" caption="Reply in a minute → more people book" />;
const D2: React.FC = () => <D n={2} word="schedule" caption="Fuller schedule → no idle techs" />;
const D3: React.FC = () => <D n={3} word="reviews" caption="Ask at the right moment → reviews" />;
const D4: React.FC = () => <D n={4} word="leads" caption="Reviews → leads → the loop repeats" />;

const Twist: React.FC = () => {
  const both = useBeat("both", 30);
  const p = useSpring(both);
  return (
    <Area>
      <div style={{ marginBottom: 10, opacity: p }}>
        <Tag color={C.bad}>BUT IT WORKS BOTH WAYS</Tag>
      </div>
      <Loop upTo={4} beatWord="faster" red />
    </Area>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const then = useBeat("then", 40);
  const a = useSpring(0);
  const b = useSpring(then);
  const follow = useBeat("follow", 90);
  if (frame >= follow - 4) return <SeriesCta line="Fix first. Then automate." delay={follow - 4} />;
  return (
    <Area>
      <div style={{ opacity: a }}>
        <H size={140}>1. Fix the process.</H>
      </div>
      <div style={{ opacity: b, marginTop: 30 }}>
        <H size={140} color={C.ok}>
          2. Then automate.
        </H>
      </div>
      <div style={{ font: `700 32px/1 ${MONO}`, color: C.muted, marginTop: 40 }}>IN THAT ORDER</div>
    </Area>
  );
};

export const RIPPLE: Record<string, React.FC> = { hook: Hook, d1: D1, d2: D2, d3: D3, d4: D4, twist: Twist, cta: Cta };
