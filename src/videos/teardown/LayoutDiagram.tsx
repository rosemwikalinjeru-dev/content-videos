import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO, useBeat } from "../../components/kit";
import { KIND } from "./FlowDiagram";
import type { Flow } from "./types";

// Non-linear "after" diagrams: BRANCH (split paths), TIMELINE (days on a rail) and
// SWIMLANE (who does what). Same rules as FlowDiagram: each box appears on its spoken
// word, connectors draw in, and the customer chip travels point to point.

type Rect = { x: number; y: number; w: number; h: number };
type Edge = { from: number; to: number; label?: string };

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function layoutOf(flow: Flow): { rects: Rect[]; edges: Edge[]; chipAt: (r: Rect) => { x: number; y: number } } {
  const n = flow.nodes.length;
  const inside = (r: Rect) => ({ x: r.x + 74, y: r.y + r.h / 2 });
  if (flow.layout === "branch") {
    const rects: Rect[] = [
      { x: 130, y: 150, w: 820, h: 170 },
      { x: 130, y: 420, w: 820, h: 170 },
      { x: 50, y: 760, w: 470, h: 250 },
      { x: 560, y: 760, w: 470, h: 250 },
    ];
    return {
      rects,
      edges: [
        { from: 0, to: 1 },
        { from: 1, to: 2, label: flow.edgeLabels?.[0] },
        { from: 1, to: 3, label: flow.edgeLabels?.[1] },
      ],
      chipAt: inside,
    };
  }
  if (flow.layout === "timeline") {
    const rects = Array.from({ length: n }, (_, i) => ({ x: 240, y: 200 + i * 240, w: 770, h: 190 }));
    return { rects, edges: [], chipAt: (r) => ({ x: 150, y: r.y + r.h / 2 }) };
  }
  if (flow.layout === "swimlane") {
    const rects = Array.from({ length: n }, (_, i) => ({ x: 250 + i * 30, y: 170 + i * 262, w: 720, h: 175 }));
    return {
      rects,
      edges: rects.slice(1).map((_, i) => ({ from: i, to: i + 1 })),
      chipAt: inside,
    };
  }
  throw new Error(`LayoutDiagram does not handle layout "${flow.layout}"`);
}

export const LayoutDiagram: React.FC<{ flow: Flow; business: string }> = ({ flow, business }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { rects, edges, chipAt } = layoutOf(flow);
  const n = flow.nodes.length;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const beats = flow.nodes.map((node, i) => useBeat(node.beat ?? "\u0000", i === 0 ? 2 : 20 + i * 25, 6));
  for (let i = 1; i < n; i++) beats[i] = Math.max(beats[i], beats[i - 1] + 8);

  // chip travels node to node in spoken order
  let cx = chipAt(rects[0]).x;
  let cy = chipAt(rects[0]).y;
  let at = 0;
  for (let i = 1; i < n; i++) {
    const t = ease(interpolate(frame, [beats[i] - 8, beats[i] + 4], [0, 1], clamp));
    const a = chipAt(rects[i - 1]);
    const b = chipAt(rects[i]);
    if (t > 0) {
      cx = a.x + (b.x - a.x) * t;
      cy = a.y + (b.y - a.y) * t;
      if (t > 0.5) at = i;
    }
  }
  const atKind = flow.nodes[at].kind;
  const chipColor =
    atKind === "bad" || atKind === "outcome"
      ? C.bad
      : atKind === "done" || atKind === "human" || atKind === "handoff"
        ? C.ok
        : C.accent;
  const chipIn = spring({ frame: frame - beats[0], fps, config: { damping: 14 } });

  const centerBottom = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h });
  const centerTop = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y });

  return (
    <div style={{ position: "absolute", left: 0, top: 140, width: 1080, height: 1220 }}>
      {/* header */}
      <div style={{ position: "absolute", left: 70, top: 20, display: "flex", alignItems: "center", gap: 20 }}>
        <span
          style={{
            font: `800 40px/1 ${MONO}`,
            letterSpacing: "0.1em",
            color: C.ground,
            background: C.ok,
            padding: "12px 18px",
            borderRadius: 10,
          }}
        >
          AFTER
        </span>
        <span style={{ font: `700 30px/1 ${MONO}`, letterSpacing: "0.08em", color: C.muted }}>DEMO · {business}</span>
      </div>

      {/* swimlane bands */}
      {flow.layout === "swimlane" &&
        (flow.lanes ?? []).map((lane, i) => {
          const p = interpolate(frame, [i * 3, i * 3 + 10], [0, 1], clamp);
          return (
            <div
              key={`lane${i}`}
              style={{
                position: "absolute",
                left: 30,
                right: 30,
                top: 140 + i * 262,
                height: 236,
                borderRadius: 24,
                background: i % 2 === 0 ? "#111831" : "#0e1428",
                border: `2px solid ${C.line}55`,
                opacity: p,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 26,
                  top: 22,
                  font: `800 26px/1.1 ${MONO}`,
                  letterSpacing: "0.08em",
                  color: C.muted,
                  width: 180,
                }}
              >
                {lane}
              </div>
            </div>
          );
        })}

      {/* timeline rail */}
      {flow.layout === "timeline" && (
        <>
          <div style={{ position: "absolute", left: 60, top: 120, font: `800 28px/1 ${MONO}`, color: C.muted, letterSpacing: "0.06em" }}>
            {flow.railLabel}
          </div>
          <div style={{ position: "absolute", left: 145, top: 170, width: 10, height: 1000, background: C.line, borderRadius: 5 }} />
          <div
            style={{
              position: "absolute",
              left: 145,
              top: 170,
              width: 10,
              height: Math.max(0, cy - 170),
              background: chipColor,
              borderRadius: 5,
            }}
          />
          {rects.map((r, i) => (
            <div
              key={`dot${i}`}
              style={{
                position: "absolute",
                left: 150 - 20,
                top: r.y + r.h / 2 - 20,
                width: 40,
                height: 40,
                borderRadius: 99,
                background: frame >= beats[i] ? KIND[flow.nodes[i].kind].border : C.panel,
                border: `4px solid ${C.line}`,
              }}
            />
          ))}
        </>
      )}

      {/* connectors (SVG, drawn in on the target box's beat) */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1220}>
        {edges.map((e, k) => {
          const a = centerBottom(rects[e.from]);
          const b = centerTop(rects[e.to]);
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          const t = ease(interpolate(frame, [beats[e.to] - 10, beats[e.to] + 2], [0, 1], clamp));
          return (
            <g key={`e${k}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y - 6}
                stroke={C.line}
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - t)}
              />
            </g>
          );
        })}
      </svg>
      {edges.map((e, k) => {
        if (!e.label) return null;
        const a = centerBottom(rects[e.from]);
        const b = centerTop(rects[e.to]);
        const show = frame >= beats[e.to] - 2;
        return (
          <div
            key={`el${k}`}
            style={{
              position: "absolute",
              left: (a.x + b.x) / 2 - 150,
              top: (a.y + b.y) / 2 - 24,
              width: 300,
              textAlign: "center",
              opacity: show ? 1 : 0,
            }}
          >
            <span
              style={{
                font: `800 28px/1 ${MONO}`,
                color: C.ground,
                background: KIND[flow.nodes[e.to].kind].border,
                padding: "8px 12px",
                borderRadius: 8,
              }}
            >
              {e.label}
            </span>
          </div>
        );
      })}

      {/* boxes */}
      {flow.nodes.map((node, i) => {
        const k = KIND[node.kind];
        const r = rects[i];
        const p = spring({ frame: frame - beats[i], fps, config: { damping: 13, stiffness: 170, mass: 0.7 } });
        const tag = node.tag ?? k.tag;
        return (
          <div
            key={`n${i}`}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              opacity: frame < beats[i] ? 0 : Math.min(1, p * 1.6),
              transform: `scale(${0.85 + p * 0.15})`,
              background: k.fill,
              border: `5px solid ${k.border}`,
              borderRadius: 28,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: flow.layout === "timeline" ? "0 34px" : "0 30px 0 140px",
            }}
          >
            <div
              style={{
                font: `900 ${node.label.length > 20 || r.w < 500 ? 44 : 54}px/1.06 ${FONT}`,
                color: k.ink,
                letterSpacing: "-0.02em",
                marginTop: tag ? 12 : 0,
              }}
            >
              {node.label}
            </div>
            {node.sub && (
              <div style={{ font: `600 32px/1.2 ${FONT}`, color: node.kind === "done" ? C.ground : C.muted, marginTop: 8 }}>
                {node.sub}
              </div>
            )}
            {tag && (
              <div
                style={{
                  position: "absolute",
                  right: 22,
                  top: -22,
                  font: `800 24px/1 ${MONO}`,
                  letterSpacing: "0.08em",
                  color: C.ground,
                  background: k.tagColor ?? k.border,
                  padding: "8px 12px",
                  borderRadius: 8,
                }}
              >
                {tag}
              </div>
            )}
          </div>
        );
      })}

      {/* customer chip */}
      <div
        style={{
          position: "absolute",
          left: cx - 50,
          top: cy - 50,
          width: 100,
          height: 100,
          borderRadius: 999,
          background: chipColor,
          color: C.ground,
          font: `900 48px/100px ${FONT}`,
          textAlign: "center",
          opacity: chipIn,
          transform: `scale(${0.6 + chipIn * 0.4})`,
          boxShadow: "0 10px 30px #000a",
          zIndex: 5,
        }}
      >
        {flow.customer.charAt(0)}
      </div>
      <div
        style={{
          position: "absolute",
          left: cx - 90,
          top: cy + 52,
          width: 180,
          textAlign: "center",
          font: `800 26px/1 ${FONT}`,
          color: chipColor,
          textShadow: "0 0 6px #000, 0 2px 0 #000",
          opacity: chipIn,
          zIndex: 5,
        }}
      >
        {flow.customer}
      </div>
    </div>
  );
};
