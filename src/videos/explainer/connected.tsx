import React from "react";
import { useVideoConfig } from "remotion";
import { useBeat } from "../../components/kit";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, clamp, interpolate, useCurrentFrame, useSpring } from "./primitives";

// FORMAT: system map + simulation. Five flow diagrams (3 steps each) joined by four handoffs,
// laid out as a snake. 20 customer dots run through it: first with handoffs "by memory"
// (dots leak at the gaps), then with the handoffs connected.
// The leak pattern is hand-set and deterministic: an illustration, not data.

const ROWS = [
  { label: "1 · LEAD", nodes: ["Call or form", "Fast reply", "Questions"] },
  { label: "2 · BOOKING", nodes: ["Pick a time", "Confirm", "Reminder"] },
  { label: "3 · JOB", nodes: ["Job card", "Tech arrives", "Work done"] },
  { label: "4 · INVOICE", nodes: ["Invoice", "Pay link", "Paid"] },
  { label: "5 · REVIEW", nodes: ["Ask", "Review", "Referral"] },
];

const X0 = 70;
const NW = 230;
const NG = 45;
const NH = 96;
const PITCH = 225;
const TOP = 100;
const RAIL_L = 40;
const RAIL_R = 890;
const RAIL = RAIL_R - RAIL_L;
const TOTAL = RAIL * 5 + PITCH * 4;
const N = 20;

const rowY = (r: number) => TOP + r * PITCH;
const railY = (r: number) => rowY(r) + 34 + NH + 12;
const leakDist = (h: number) => RAIL * (h + 1) + PITCH * h + PITCH / 2;

function pointAt(d: number) {
  let rem = Math.max(0, Math.min(TOTAL, d));
  for (let r = 0; r < 5; r++) {
    const even = r % 2 === 0;
    if (rem <= RAIL) return { x: even ? RAIL_L + rem : RAIL_R - rem, y: railY(r) };
    rem -= RAIL;
    if (r < 4) {
      if (rem <= PITCH) return { x: even ? RAIL_R : RAIL_L, y: railY(r) + rem };
      rem -= PITCH;
    }
  }
  return { x: RAIL_R, y: railY(4) };
}

// which dots drop out at which handoff (h = 0..3)
const BEFORE: number[][] = [[2, 7, 13], [4, 10, 16], [1, 8, 18], [5, 12]];
const AFTER: number[][] = [[], [10], [8], []];

type Mode = "none" | "gap" | "linked";

const Pill: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div style={{ border: `4px solid ${color}`, borderRadius: 16, padding: "8px 16px", background: C.panel, textAlign: "center" }}>
    <div style={{ font: `800 20px/1 ${MONO}`, letterSpacing: "0.06em", color: C.muted }}>{label}</div>
    <div style={{ font: `900 40px/1.1 ${FONT}`, color }}>{value}</div>
  </div>
);

const SystemMap: React.FC<{
  rowAt?: number[]; // frame each row appears (default: all visible)
  mode: Mode;
  modeAt?: number; // frame the handoff state starts revealing
  sim?: "before" | "after";
}> = ({ rowAt, mode, modeAt = 0, sim }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D, fps } = useVideoConfig();
  void fps;
  const table = sim === "after" ? AFTER : BEFORE;
  const dropAt = new Map<number, number>(); // dot -> handoff
  table.forEach((dots, h) => dots.forEach((i) => dropAt.set(i, h)));

  // simulation clock
  const travel = D * 0.5;
  const stagger = (D * 0.38) / N;
  const survivors = Array.from({ length: N }, (_, i) => i).filter((i) => !dropAt.has(i));
  let reached = 0;
  let dropped = 0;

  const dots = sim
    ? Array.from({ length: N }, (_, i) => {
        const t = frame - 8 - i * stagger;
        if (t < 0) return null;
        const d = (t / travel) * TOTAL;
        const h = dropAt.get(i);
        if (h !== undefined && d >= leakDist(h)) {
          dropped++;
          const p = pointAt(leakDist(h));
          const since = ((d - leakDist(h)) / TOTAL) * travel;
          const k = table[h].indexOf(i);
          const out = interpolate(since, [0, 10], [0, 1], clamp);
          const dir = (h % 2 === 0 ? 1 : -1) * (sim === "after" ? -1 : 1); // before: fall outward; after: move in to a person
          // before: lost customers pile up beside the gap; after: stuck ones move in to a person
          const off = sim === "after" ? 78 : 28;
          const dy = sim === "after" ? 38 : (k - 1) * 28;
          return { key: i, x: p.x + dir * off * out, y: p.y + dy * out, color: sim === "after" ? C.ok : C.bad, o: 1 };
        }
        if (d >= TOTAL) {
          const n = survivors.indexOf(i);
          reached++;
          return { key: i, x: RAIL_R - (n % 10) * 30, y: railY(4) + 36 + Math.floor(n / 10) * 30, color: C.ok, o: 1 };
        }
        const p = pointAt(d);
        return { key: i, x: p.x, y: p.y, color: C.accent, o: 1 };
      })
    : [];

  return (
    <div style={{ position: "absolute", left: 0, top: 140, width: 1080, height: 1230 }}>
      {/* header */}
      <div style={{ position: "absolute", left: X0, top: 0, right: 190, display: "flex", gap: 14, alignItems: "center" }}>
        {sim ? (
          <>
            <Pill label="CUSTOMERS IN" value="20" color={C.accent} />
            <Pill label="REACHED THE END" value={String(reached)} color={C.ok} />
            <Pill label={sim === "after" ? "TO A PERSON" : "LOST IN A GAP"} value={String(dropped)} color={sim === "after" ? C.blue : C.bad} />
          </>
        ) : (
          <Tag color={mode === "gap" ? C.bad : mode === "linked" ? C.ok : C.accent}>
            {mode === "gap" ? "THE GAPS BETWEEN STEPS" : mode === "linked" ? "HANDOFFS CONNECTED" : "ONE BUSINESS · FIVE FLOWS"}
          </Tag>
        )}
      </div>

      <svg width={1080} height={1230} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* rails */}
        {ROWS.map((_, r) => {
          const vis = !rowAt || frame >= rowAt[r];
          return vis ? <line key={`rail${r}`} x1={RAIL_L} y1={railY(r)} x2={RAIL_R} y2={railY(r)} stroke={C.line} strokeWidth={8} strokeLinecap="round" /> : null;
        })}
        {/* handoffs */}
        {[0, 1, 2, 3].map((h) => {
          const vis = !rowAt || frame >= rowAt[h + 1];
          if (!vis) return null;
          const x = h % 2 === 0 ? RAIL_R : RAIL_L;
          const on = mode !== "none" && frame >= modeAt + h * 6;
          const col = !on ? C.line : mode === "gap" ? C.bad : C.ok;
          return (
            <line
              key={`ho${h}`}
              x1={x}
              y1={railY(h)}
              x2={x}
              y2={railY(h + 1)}
              stroke={col}
              strokeWidth={on && mode === "linked" ? 12 : 8}
              strokeDasharray={on && mode === "gap" ? "6 20" : undefined}
              strokeLinecap="round"
            />
          );
        })}
        {/* customers */}
        {dots.map((d) => (d ? <circle key={d.key} cx={d.x} cy={d.y} r={12} fill={d.color} opacity={d.o} stroke={C.ground} strokeWidth={3} /> : null))}
      </svg>

      {/* flow rows */}
      {ROWS.map((row, r) => {
        const at = rowAt ? rowAt[r] : -100;
        return <Row key={r} r={r} label={row.label} nodes={row.nodes} at={at} />;
      })}

      {/* handoff tags */}
      {[0, 1, 2, 3].map((h) => {
        const start = modeAt + h * 6;
        if (mode === "none" || frame < start) return null;
        const right = h % 2 === 0;
        const gap = mode === "gap";
        return (
          <div
            key={`tag${h}`}
            style={{
              position: "absolute",
              top: railY(h) + 22,
              ...(right ? { right: 1080 - RAIL_R + 22 } : { left: RAIL_L + 22 }),
              font: `800 22px/1 ${MONO}`,
              letterSpacing: "0.06em",
              color: C.ground,
              background: gap ? C.bad : C.ok,
              padding: "8px 12px",
              borderRadius: 8,
            }}
          >
            {gap ? "BY MEMORY ?" : sim === "after" && AFTER[h].length ? "AUTO · STUCK → PERSON" : "AUTO ✓"}
          </div>
        );
      })}

      {sim && (
        <div style={{ position: "absolute", left: X0, top: railY(4) + 44, font: `700 22px/1.3 ${MONO}`, color: C.muted, letterSpacing: "0.05em" }}>
DEMO SIMULATION · NOT REAL DATA
        </div>
      )}
    </div>
  );
};

const Row: React.FC<{ r: number; label: string; nodes: string[]; at: number }> = ({ r, label, nodes, at }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at);
  if (frame < at) return null;
  const even = r % 2 === 0;
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ position: "absolute", left: 0, width: 930, top: rowY(r) + 2, textAlign: "center", font: `800 24px/1 ${MONO}`, letterSpacing: "0.1em", color: C.accent }}>
        {label} {even ? "→" : "←"}
      </div>
      {nodes.map((n, k) => {
        const col = even ? k : 2 - k;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: X0 + col * (NW + NG),
              top: rowY(r) + 34,
              width: NW,
              height: NH,
              borderRadius: 18,
              background: C.panel,
              border: `4px solid ${C.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              font: `800 30px/1.1 ${FONT}`,
              color: C.ink,
              padding: "0 8px",
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const one = useBeat("one", 60);
  const twenty = useBeat("twenty", 150);
  const a = useSpring(0);
  const b = useSpring(one);
  const strike = interpolate(frame, [14, 26], [0, 1], clamp);
  return (
    <Area>
      <div style={{ opacity: a, position: "relative", display: "inline-block", alignSelf: "flex-start" }}>
        <H size={104} color={C.muted}>
          5 separate tasks
        </H>
        <div style={{ position: "absolute", left: -8, top: "52%", height: 14, width: `${strike * 104}%`, background: C.bad, borderRadius: 7 }} />
      </div>
      <div style={{ opacity: b, transform: `translateY(${(1 - b) * 30}px)`, marginTop: 30 }}>
        <H size={128} color={C.accent}>
          One connected system.
        </H>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 64px)", gap: 18, marginTop: 70 }}>
        {Array.from({ length: N }, (_, i) => {
          const on = frame >= twenty + i * 1.5;
          return <div key={i} style={{ width: 64, height: 64, borderRadius: 99, background: on ? C.accent : "transparent", border: `4px solid ${on ? C.accent : C.line}` }} />;
        })}
      </div>
      <div style={{ font: `700 32px/1 ${MONO}`, color: C.muted, marginTop: 24, opacity: frame >= twenty ? 1 : 0 }}>20 CUSTOMERS</div>
    </Area>
  );
};

const Flows: React.FC = () => {
  const rowAt = [useBeat("lead", 0), useBeat("booking", 40), useBeat("job", 90), useBeat("invoice", 140), useBeat("review", 190)];
  for (let i = 1; i < 5; i++) rowAt[i] = Math.max(rowAt[i], rowAt[i - 1] + 8);
  return <SystemMap rowAt={rowAt} mode="none" />;
};

const Leaks: React.FC = () => <SystemMap mode="gap" modeAt={useBeat("gaps", 70)} />;
const SimBefore: React.FC = () => <SystemMap mode="gap" modeAt={-100} sim="before" />;
const Connect: React.FC = () => <SystemMap mode="linked" modeAt={useBeat("connect", 10)} />;
const SimAfter: React.FC = () => <SystemMap mode="linked" modeAt={-100} sim="after" />;

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const fix = useBeat("handoffs", 50);
  const follow = useBeat("follow", 100);
  const a = useSpring(0);
  const b = useSpring(fix - 10);
  if (frame >= follow - 4) return <SeriesCta line="Fix the handoffs." lineColor={C.ok} delay={follow - 4} />;
  return (
    <Area>
      <div style={{ opacity: a }}>
        <H size={120} color={C.muted}>
          Not the tasks.
        </H>
      </div>
      <div style={{ opacity: b, marginTop: 24 }}>
        <H size={150} color={C.ok}>
          The handoffs.
        </H>
      </div>
    </Area>
  );
};

export const CONNECTED: Record<string, React.FC> = {
  hook: Hook,
  flows: Flows,
  leaks: Leaks,
  "sim-before": SimBefore,
  connect: Connect,
  "sim-after": SimAfter,
  cta: Cta,
};
