import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO, useBeat } from "../../components/kit";
import type { Flow, NodeKind } from "./types";

// Point-to-point flow: boxes appear top to bottom on their spoken word, the connector
// draws in, and the customer chip travels from the previous box to the new one.

const BOX_W = 820;
const BOX_H = 190;
const GAP = 100;
const AREA_TOP = 110; // below the BEFORE/AFTER header
const AREA_H = 1090;

export const KIND: Record<NodeKind, { border: string; fill: string; ink: string; tag?: string; tagColor?: string }> = {
  normal: { border: C.line, fill: C.panel, ink: C.ink },
  bad: { border: C.bad, fill: "#2a1220", ink: C.ink, tag: "BOTTLENECK", tagColor: C.bad },
  outcome: { border: "#3a4260", fill: "#10152a", ink: C.muted },
  ai: { border: C.blue, fill: "#121d3d", ink: C.ink, tag: "AUTOMATED", tagColor: C.blue },
  human: { border: C.ok, fill: "#0f2a22", ink: C.ink, tag: "PERSON", tagColor: C.ok },
  done: { border: C.ok, fill: C.ok, ink: C.ground },
  read: { border: C.blue, fill: "#121d3d", ink: C.ink, tag: "READ ONLY", tagColor: C.blue },
  limited: { border: C.accent, fill: "#2a2410", ink: C.ink, tag: "LIMITED WRITE", tagColor: C.accent },
  handoff: { border: C.ok, fill: "#0f2a22", ink: C.ink, tag: "HAND TO A PERSON", tagColor: C.ok },
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export const FlowDiagram: React.FC<{ flow: Flow; mode: "before" | "after"; business: string }> = ({
  flow,
  mode,
  business,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = flow.nodes.length;
  // centre the stack vertically in the diagram area
  const TOP = AREA_TOP + Math.max(0, (AREA_H - (n * BOX_H + (n - 1) * GAP)) / 2);

  // beat frame for each node (first one defaults to the start of the scene)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const beats = flow.nodes.map((node, i) => useBeat(node.beat ?? "\u0000", i === 0 ? 2 : 20 + i * 25, 6));
  // keep beats in order even if a word is spoken early
  for (let i = 1; i < n; i++) beats[i] = Math.max(beats[i], beats[i - 1] + 8);

  const yOf = (i: number) => TOP + i * (BOX_H + GAP);

  // which node the customer is at (fractional while travelling)
  let pos = 0;
  for (let i = 1; i < n; i++) {
    const t = interpolate(frame, [beats[i] - 8, beats[i] + 4], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    pos += ease(t);
  }
  const chipY = TOP + pos * (BOX_H + GAP) + BOX_H / 2;
  const atIdx = Math.round(pos);
  const atKind = flow.nodes[Math.min(atIdx, n - 1)].kind;
  const chipColor =
    atKind === "bad" || atKind === "outcome"
      ? C.bad
      : atKind === "done" || atKind === "human" || atKind === "handoff"
        ? C.ok
        : C.accent;
  const chipIn = spring({ frame: frame - beats[0], fps, config: { damping: 14 } });

  const headColor = mode === "before" ? C.bad : C.ok;

  return (
    <div style={{ position: "absolute", left: 0, top: 140, width: 1080, height: 1220 }}>
      {/* header */}
      <div style={{ position: "absolute", left: 70, top: 20, display: "flex", alignItems: "center", gap: 20 }}>
        <span
          style={{
            font: `800 40px/1 ${MONO}`,
            letterSpacing: "0.1em",
            color: C.ground,
            background: headColor,
            padding: "12px 18px",
            borderRadius: 10,
          }}
        >
          {mode === "before" ? "BEFORE" : "AFTER"}
        </span>
        <span style={{ font: `700 30px/1 ${MONO}`, letterSpacing: "0.08em", color: C.muted }}>DEMO · {business}</span>
      </div>

      {/* connectors */}
      {flow.nodes.slice(1).map((_, k) => {
        const i = k + 1;
        const grow = interpolate(frame, [beats[i] - 8, beats[i] + 2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y0 = yOf(i - 1) + BOX_H;
        return (
          <div key={`c${i}`} style={{ position: "absolute", left: 540 - 5, top: y0, width: 10, height: GAP }}>
            <div style={{ width: 10, height: GAP * ease(grow), background: C.line, borderRadius: 5 }} />
            {grow > 0.9 && (
              <div
                style={{
                  position: "absolute",
                  left: -15,
                  top: GAP - 22,
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderTop: `24px solid ${C.line}`,
                }}
              />
            )}
          </div>
        );
      })}

      {/* boxes */}
      {flow.nodes.map((node, i) => {
        const k = KIND[node.kind];
        const p = spring({ frame: frame - beats[i], fps, config: { damping: 13, stiffness: 170, mass: 0.7 } });
        const shake =
          node.kind === "bad" ? Math.sin((frame - beats[i]) * 1.4) * 8 * Math.max(0, 1 - (frame - beats[i]) / 18) : 0;
        return (
          <div
            key={`n${i}`}
            style={{
              position: "absolute",
              left: (1080 - BOX_W) / 2 + shake,
              top: yOf(i),
              width: BOX_W,
              height: BOX_H,
              opacity: frame < beats[i] ? 0 : Math.min(1, p * 1.6),
              transform: `scale(${0.85 + p * 0.15})`,
              background: k.fill,
              border: `5px solid ${k.border}`,
              borderRadius: 30,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 40px 0 150px",
            }}
          >
            <div
              style={{
                font: `900 ${node.label.length > 22 ? 46 : 58}px/1.05 ${FONT}`,
                color: k.ink,
                letterSpacing: "-0.02em",
                marginTop: (node.tag ?? k.tag) ? 14 : 0,
              }}
            >
              {node.label}
            </div>
            {node.sub && (
              <div style={{ font: `600 36px/1.2 ${FONT}`, color: node.kind === "done" ? C.ground : C.muted, marginTop: 8 }}>
                {node.sub}
              </div>
            )}
            {(node.tag ?? k.tag) && (
              <div
                style={{
                  position: "absolute",
                  right: 24,
                  top: -22,
                  font: `800 24px/1 ${MONO}`,
                  letterSpacing: "0.08em",
                  color: C.ground,
                  background: k.tagColor,
                  padding: "8px 12px",
                  borderRadius: 8,
                }}
              >
                {node.tag ?? k.tag}
              </div>
            )}
          </div>
        );
      })}

      {/* the customer chip travelling point to point */}
      <div
        style={{
          position: "absolute",
          left: (1080 - BOX_W) / 2 + 22,
          top: chipY - 52,
          width: 104,
          height: 104,
          borderRadius: 999,
          background: chipColor,
          color: C.ground,
          font: `900 50px/104px ${FONT}`,
          textAlign: "center",
          opacity: chipIn,
          transform: `scale(${0.6 + chipIn * 0.4})`,
          boxShadow: "0 10px 30px #000a",
        }}
      >
        {flow.customer.charAt(0)}
      </div>
      <div
        style={{
          position: "absolute",
          left: (1080 - BOX_W) / 2 - 10,
          top: chipY + 56,
          width: 170,
          textAlign: "center",
          font: `800 26px/1 ${FONT}`,
          color: chipColor,
          opacity: chipIn,
          whiteSpace: "nowrap",
          textShadow: "0 0 6px #000, 0 2px 0 #000",
        }}
      >
        {flow.customer}
      </div>
    </div>
  );
};
