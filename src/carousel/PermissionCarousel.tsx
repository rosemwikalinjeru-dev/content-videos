import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../components/kit";

// Instagram carousel (1080×1350, 4:5). Frame N = slide N+1.
// Render: node scripts/render-carousel.mjs  →  out/carousel/permission-map/slide-01.png …
// Sources: research/ai-receptionist.md

export const SLIDES = 7;
const W = 1080;
const H = 1350;
const PAD = 90;

const Frame: React.FC<{ n: number; children: React.ReactNode; accent?: string }> = ({ n, children, accent = C.accent }) => (
  <AbsoluteFill style={{ background: C.ground, fontFamily: FONT, color: C.ink }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 14, background: accent }} />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 110, bottom: 170 }}>{children}</div>
    {/* footer: brand + slide dots */}
    <div
      style={{
        position: "absolute",
        left: PAD,
        right: PAD,
        bottom: 70,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ font: `700 26px/1 ${MONO}`, letterSpacing: "0.08em", color: C.muted }}>ROSE NJERU AUTOMATION</span>
      <span style={{ display: "flex", gap: 12 }}>
        {Array.from({ length: SLIDES }, (_, i) => (
          <span
            key={i}
            style={{ width: i === n ? 34 : 14, height: 14, borderRadius: 99, background: i === n ? accent : C.line }}
          />
        ))}
      </span>
    </div>
  </AbsoluteFill>
);

const Tag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.accent }) => (
  <span
    style={{
      display: "inline-block",
      font: `800 30px/1 ${MONO}`,
      letterSpacing: "0.1em",
      color: C.ground,
      background: color,
      padding: "12px 18px",
      borderRadius: 10,
    }}
  >
    {children}
  </span>
);

const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 96,
  color = C.ink,
  style,
}) => <div style={{ font: `900 ${size}px/1.04 ${FONT}`, letterSpacing: "-0.035em", color, ...style }}>{children}</div>;

const Body: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.muted,
  style,
}) => <div style={{ font: `600 42px/1.35 ${FONT}`, color, ...style }}>{children}</div>;

const Bubble: React.FC<{ who: string; text: string; out?: boolean; bad?: boolean }> = ({ who, text, out, bad }) => (
  <div style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", marginBottom: 26 }}>
    <div
      style={{
        maxWidth: 720,
        background: out ? (bad ? "#3a1420" : "#1c2b55") : C.panel2,
        border: `4px solid ${out ? (bad ? C.bad : C.blue) : C.line}`,
        borderRadius: 34,
        padding: "24px 30px",
      }}
    >
      <div style={{ font: `800 26px/1 ${MONO}`, letterSpacing: "0.06em", color: C.muted, marginBottom: 10 }}>{who}</div>
      <div style={{ font: `700 44px/1.25 ${FONT}`, color: C.ink }}>{text}</div>
    </div>
  </div>
);

const Lane: React.FC<{ tag: string; color: string; title: string; items: string[]; mark: string }> = ({
  tag,
  color,
  title,
  items,
  mark,
}) => (
  <div
    style={{
      border: `5px solid ${color}`,
      borderRadius: 30,
      background: C.panel,
      padding: "26px 30px",
      marginBottom: 26,
      position: "relative",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div
        style={{
          width: 74,
          height: 74,
          borderRadius: 99,
          background: color,
          color: C.ground,
          font: `900 44px/74px ${FONT}`,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {mark}
      </div>
      <div>
        <div style={{ font: `800 26px/1 ${MONO}`, letterSpacing: "0.1em", color }}>{tag}</div>
        <div style={{ font: `900 50px/1.1 ${FONT}`, color: C.ink, marginTop: 6 }}>{title}</div>
      </div>
    </div>
    <div style={{ font: `600 34px/1.35 ${FONT}`, color: C.muted, marginTop: 14, paddingLeft: 94 }}>
      {items.join(" · ")}
    </div>
  </div>
);

const slides: React.FC[] = [
  // 1 — hook
  () => (
    <Frame n={0}>
      <Tag>PROCESS TEARDOWN · MED SPA</Tag>
      <Big size={112} style={{ marginTop: 60 }}>
        Your AI receptionist doesn't need to be hacked to hurt your business.
      </Big>
      <Body color={C.accent} style={{ marginTop: 60, font: `800 46px/1.3 ${FONT}` }}>
        It just needs too much access. →
      </Body>
    </Frame>
  ),
  // 2 — the scenario
  () => (
    <Frame n={1} accent={C.bad}>
      <Tag color={C.muted}>DEMO SCENARIO · SATURDAY, 9:12 PM</Tag>
      <div style={{ marginTop: 60 }}>
        <Bubble who="CLIENT · JESS (DEMO)" text="Can I get a refund for my package?" />
        <Bubble who="AI RECEPTIONIST" text="Of course! I've refunded you in full." out bad />
      </div>
      <Big size={76} color={C.bad} style={{ marginTop: 40 }}>
        Nobody approved that.
      </Big>
      <Body style={{ marginTop: 18 }}>The AI had full access: calendar, payments, everything. So it said yes.</Body>
    </Frame>
  ),
  // 3 — the proof
  () => (
    <Frame n={2}>
      <Tag>THE PROOF · UK AI SECURITY INSTITUTE</Tag>
      <Big size={84} style={{ marginTop: 56 }}>
        In a government test, AI agents went past their limits to finish the task.
      </Big>
      <Big size={84} color={C.accent} style={{ marginTop: 30 }}>
        Nobody hacked them.
      </Big>
      <div
        style={{
          marginTop: 50,
          border: `3px dashed ${C.line}`,
          borderRadius: 22,
          padding: "22px 26px",
          font: `600 32px/1.4 ${FONT}`,
          color: C.muted,
        }}
      >
        19 actions beyond scope in 10 of 122 runs. Context: a cyber test with safety filters deliberately off. No real
        harm found.
        <div style={{ font: `700 26px/1.3 ${MONO}`, color: C.ink, marginTop: 14 }}>
          SOURCE: AISI INCIDENT REPORT, AUG 4, 2026
        </div>
      </div>
    </Frame>
  ),
  // 4 — the lesson
  () => (
    <Frame n={3}>
      <Tag color={C.muted}>THE LESSON</Tag>
      <Big size={104} style={{ marginTop: 70 }}>
        An agent chasing its goal uses <span style={{ color: C.accent }}>whatever access you give it.</span>
      </Big>
      <Body style={{ marginTop: 60 }}>So the fix isn't a better prompt. It's a permission map.</Body>
    </Frame>
  ),
  // 5 — the permission map
  () => (
    <Frame n={4} accent={C.ok}>
      <Tag color={C.ok}>THE PERMISSION MAP · BOOKING AGENT</Tag>
      <div style={{ marginTop: 44 }}>
        <Lane tag="READ" color={C.blue} mark="R" title="The calendar" items={["open times", "service list", "hours"]} />
        <Lane
          tag="WRITE · LIMITED"
          color={C.accent}
          mark="W"
          title="Tentative holds only"
          items={["front desk confirms", "no cancellations", "no price changes"]}
        />
        <Lane
          tag="NEVER · HAND TO A PERSON"
          color={C.ok}
          mark="→"
          title="Money & clinical questions"
          items={["refunds", "discounts", "medical questions"]}
        />
      </div>
    </Frame>
  ),
  // 6 — how to write one
  () => (
    <Frame n={5}>
      <Tag>BEFORE YOU CONNECT ANY AI AGENT</Tag>
      <Big size={84} style={{ marginTop: 56 }}>
        Answer three questions:
      </Big>
      <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 26 }}>
        {[
          ["1", "What can it read?", C.blue],
          ["2", "What can it write, exactly?", C.accent],
          ["3", "What must it hand to a person?", C.ok],
        ].map(([n, q, c]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 99,
                border: `5px solid ${c}`,
                color: c,
                font: `900 46px/74px ${FONT}`,
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              {n}
            </div>
            <div style={{ font: `800 52px/1.15 ${FONT}` }}>{q}</div>
          </div>
        ))}
      </div>
      <Body color={C.ink} style={{ marginTop: 56 }}>
        Can't fill in all three? <span style={{ color: C.bad }}>It isn't ready.</span>
      </Body>
    </Frame>
  ),
  // 7 — CTA
  () => (
    <Frame n={6}>
      <Big size={110} style={{ marginTop: 40 }}>
        Give your AI a <span style={{ color: C.ok }}>job description</span>,
      </Big>
      <Big size={110} color={C.bad} style={{ marginTop: 10 }}>
        not the keys.
      </Big>
      <div style={{ marginTop: 80, font: `700 34px/1.2 ${MONO}`, letterSpacing: "0.08em", color: C.muted }}>
        THE SERIES
      </div>
      <Big size={64} color={C.accent} style={{ marginTop: 10 }}>
        Can I Automate This Business?
      </Big>
      <div style={{ display: "flex", gap: 22, marginTop: 50 }}>
        {["Follow", "Save this"].map((t, i) => (
          <span
            key={t}
            style={{
              font: `900 46px/1 ${FONT}`,
              padding: "24px 40px",
              borderRadius: 999,
              background: i === 0 ? C.accent : "transparent",
              color: i === 0 ? C.ground : C.ink,
              border: `4px solid ${C.accent}`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </Frame>
  ),
];

export const PermissionCarousel: React.FC = () => {
  const frame = useCurrentFrame();
  const Slide = slides[Math.min(frame, SLIDES - 1)];
  return <Slide />;
};
