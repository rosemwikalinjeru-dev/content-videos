import React from "react";
import { useBeat } from "../../components/kit";
import { Area, C, FONT, H, MONO, SeriesCta, Tag, clamp, ease, interpolate, useCurrentFrame, useSpring } from "./primitives";

// FORMAT: staircase playbook. Five steps; a chip climbs one step per scene.

const STEPS = [
  { title: "Pick one task", sub: "the one your team complains about", col: C.blue },
  { title: "Write it down", sub: "every step, even the messy ones", col: C.accent },
  { title: "Fix it on paper", sub: "before you touch any tool", col: "#ff9f43" },
  { title: "Automate the boring part", sub: "a person keeps the decisions", col: C.ok },
  { title: "Watch it for a month", sub: "hours saved · mistakes caught", col: "#c792ff" },
];

const SW = 150; // step width
const SH = 110; // step height
const BASE_X = 60;
const BASE_Y = 860;

const Stairs: React.FC<{ current: number; beatWord: string }> = ({ current, beatWord }) => {
  const frame = useCurrentFrame();
  const beat = useBeat(beatWord, 6);
  // chip moves from step current-1 to current
  const t = ease(interpolate(frame, [beat, beat + 14], [0, 1], clamp));
  const stepTop = (i: number) => ({ x: BASE_X + i * SW + SW / 2, y: BASE_Y - (i + 1) * SH });
  const from = current > 0 ? stepTop(current - 1) : { x: BASE_X - 40, y: BASE_Y };
  const to = stepTop(current);
  const hop = Math.sin(t * Math.PI) * 60;
  const cx = from.x + (to.x - from.x) * t;
  const cy = from.y + (to.y - from.y) * t - hop;
  return (
    <svg width={900} height={900} style={{ alignSelf: "center", overflow: "visible" }}>
      {STEPS.map((s, i) => {
        const done = i < current || (i === current && t > 0.8);
        const isCur = i === current;
        return (
          <g key={i}>
            <rect
              x={BASE_X + i * SW}
              y={BASE_Y - (i + 1) * SH}
              width={SW}
              height={(i + 1) * SH}
              fill={done ? s.col : C.panel}
              opacity={done ? (isCur ? 1 : 0.55) : 1}
              stroke={isCur ? s.col : C.line}
              strokeWidth={5}
            />
            <text
              x={BASE_X + i * SW + SW / 2}
              y={BASE_Y - 30}
              textAnchor="middle"
              fontFamily="Inter"
              fontWeight={900}
              fontSize={64}
              fill={done ? C.ground : C.muted}
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      {/* climber */}
      <circle cx={cx} cy={cy - 36} r={34} fill={C.ink} stroke={C.ground} strokeWidth={6} />
      <text x={cx} y={cy - 22} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={36} fill={C.ground}>
        ★
      </text>
    </svg>
  );
};

const StepScene: React.FC<{ i: number }> = ({ i }) => {
  const s = STEPS[i];
  const beat = useBeat("step", 6);
  const p = useSpring(beat + 8);
  return (
    <Area center={false} style={{ paddingTop: 40 }}>
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)`, minHeight: 330 }}>
        <Tag color={s.col}>STEP {i + 1} OF 5</Tag>
        <H size={96} style={{ marginTop: 22 }}>
          {s.title}
        </H>
        <div style={{ font: `700 44px/1.25 ${FONT}`, color: C.muted, marginTop: 14 }}>{s.sub}</div>
      </div>
      <Stairs current={i} beatWord="step" />
    </Area>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const five = useBeat("five", 50);
  const p = useSpring(0);
  const q = useSpring(five);
  const strike = interpolate(frame, [12, 24], [0, 1], clamp);
  return (
    <Area>
      <div style={{ opacity: p, position: "relative", display: "inline-block", alignSelf: "flex-start" }}>
        <H size={110} color={C.muted}>
          A big AI project
        </H>
        <div style={{ position: "absolute", left: -8, top: "50%", height: 14, width: `${strike * 104}%`, background: C.bad, borderRadius: 7 }} />
      </div>
      <div style={{ opacity: q, transform: `translateY(${(1 - q) * 30}px)`, marginTop: 40 }}>
        <H size={130} color={C.accent}>
          5 small steps,
        </H>
        <H size={130}>in the right order.</H>
      </div>
    </Area>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const follow = useBeat("follow", 120);
  const words: [string, string, string][] = [
    ["Small.", "small", C.blue],
    ["Boring.", "boring", C.accent],
    ["Measured.", "measured", C.ok],
  ];
  if (frame >= follow - 4) return <SeriesCta line="Small. Boring. Measured." delay={follow - 4} />;
  return (
    <Area>
      {words.map(([t, w, col]) => (
        <Word key={t} text={t} word={w} col={col} />
      ))}
      <div style={{ font: `700 34px/1.3 ${MONO}`, color: C.muted, marginTop: 30 }}>THAT'S HOW IT ACTUALLY WORKS</div>
    </Area>
  );
};

const Word: React.FC<{ text: string; word: string; col: string }> = ({ text, word, col }) => {
  const at = useBeat(word, 10);
  const p = useSpring(at);
  return (
    <div style={{ opacity: p, transform: `scale(${0.8 + p * 0.2})`, transformOrigin: "left center" }}>
      <H size={170} color={col}>
        {text}
      </H>
    </div>
  );
};

export const FIVE_STEPS: Record<string, React.FC> = {
  hook: Hook,
  s1: () => <StepScene i={0} />,
  s2: () => <StepScene i={1} />,
  s3: () => <StepScene i={2} />,
  s4: () => <StepScene i={3} />,
  s5: () => <StepScene i={4} />,
  cta: Cta,
};
