import React from "react";
import { useBeat } from "../../components/kit";
import { IndustryArt } from "../../components/industry/IndustryArt";
import { Area, Badge, C, Clip, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame, useSpring } from "./primitives";

// FORMAT: the race. Three roofers, three lanes. Bar length = how long the homeowner waited.
// The fastest reply wins the visit.

const LANES = [
  { name: "Roofer 1", time: "next afternoon", wait: 1, col: C.bad, word: "one" },
  { name: "Roofer 2", time: "next morning", wait: 0.62, col: "#ff9f43", word: "two," },
  { name: "Roofer 3", time: "2 minutes", wait: 0.04, col: C.ok, word: "three" },
];

const Lanes: React.FC<{ revealAll?: boolean; winner?: number }> = ({ revealAll, winner }) => {
  const frame = useCurrentFrame();
  const beats = LANES.map((l) => useBeat(l.word, 30));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {LANES.map((l, i) => {
        const at = revealAll ? -30 : beats[i];
        const grow = ease(interpolate(frame, [at, at + 18], [0, 1], clamp));
        const shown = frame >= at;
        const isWin = winner === i;
        return (
          <div
            key={l.name}
            style={{
              opacity: shown ? 1 : 0.25,
              background: isWin ? "#0f2a22" : C.panel,
              border: `5px solid ${isWin ? C.ok : C.line}`,
              borderRadius: 26,
              padding: "24px 28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ font: `900 52px/1 ${FONT}`, color: C.ink }}>{l.name}</span>
              <span style={{ font: `800 34px/1 ${MONO}`, color: l.col, opacity: grow }}>{l.time}</span>
            </div>
            <div style={{ marginTop: 18, height: 34, background: C.ground, borderRadius: 17, overflow: "hidden" }}>
              <div style={{ width: `${Math.max(3, l.wait * 100) * grow}%`, height: "100%", background: l.col, borderRadius: 17 }} />
            </div>
            <div style={{ font: `700 24px/1 ${MONO}`, color: C.muted, marginTop: 10 }}>HOW LONG SHE WAITED</div>
          </div>
        );
      })}
    </div>
  );
};

const Hook: React.FC = () => {
  const faster = useBeat("faster", 60);
  const p = useSpring(0);
  const q = useSpring(faster);
  return (
    <Area>
      <div style={{ opacity: p }}>
        <H size={120} color={C.muted}>
          Not better.
        </H>
      </div>
      <div style={{ opacity: q, transform: `scale(${0.85 + q * 0.15})`, transformOrigin: "left center", marginTop: 20 }}>
        <H size={190} color={C.accent}>
          Faster.
        </H>
      </div>
      <div style={{ opacity: q, font: `800 46px/1.2 ${FONT}`, color: C.ink, marginTop: 30 }}>at the boring stuff</div>
    </Area>
  );
};

const Setup: React.FC = () => (
  <Area center={false} style={{ paddingTop: 20 }}>
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <IndustryArt industry="roofing" width={430} />
      <div>
        <Tag>DEMO SCENARIO</Tag>
        <div style={{ font: `900 52px/1.1 ${FONT}`, marginTop: 16 }}>1 homeowner, 3 roofers</div>
      </div>
    </div>
    <div style={{ marginTop: 20 }}>
      <Clip src="assets/fix-demos/quote-requests.mp4" size={760} rate={1.3} />
    </div>
  </Area>
);

const Race: React.FC = () => (
  <Area>
    <div style={{ marginBottom: 30 }}>
      <Tag>THE REPLY RACE · 9:14 PM START</Tag>
    </div>
    <Lanes />
  </Area>
);

const Result: React.FC = () => {
  const p = useSpring(4);
  return (
    <Area>
      <Lanes revealAll winner={2} />
      <div style={{ opacity: p, transform: `scale(${0.7 + p * 0.3})`, marginTop: 40, display: "flex", alignItems: "center", gap: 22 }}>
        <Badge glyph="✓" color={C.ok} size={110} />
        <H size={82} color={C.ok}>
          Roofer 3 gets the visit
        </H>
      </div>
    </Area>
  );
};

const PILLARS: [string, string][] = [
  ["Answer", "answering,"],
  ["Follow up", "following"],
  ["Show up", "showing"],
];

const Lesson: React.FC = () => {
  const memory = useBeat("memory", 200);
  const m = useSpring(memory);
  return (
    <Area>
      <div style={{ marginBottom: 30 }}>
        <Tag>NOT THE FANCIEST AI</Tag>
      </div>
      {PILLARS.map(([t, w], i) => (
        <Pillar key={t} text={t} word={w} n={i + 1} />
      ))}
      <div style={{ opacity: m, marginTop: 30, font: `800 50px/1.2 ${FONT}`, color: C.accent }}>Every time. No relying on memory.</div>
    </Area>
  );
};

const Pillar: React.FC<{ text: string; word: string; n: number }> = ({ text, word, n }) => {
  const at = useBeat(word, 20 * n);
  const p = useSpring(at);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 22, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
      <Badge glyph={String(n)} color={C.ok} size={96} />
      <H size={110}>{text}</H>
    </div>
  );
};

const Cta: React.FC = () => <SeriesCta line="Be the fast one." lineColor={C.ok} />;

export const RACE: Record<string, React.FC> = { hook: Hook, setup: Setup, race: Race, result: Result, lesson: Lesson, cta: Cta };
