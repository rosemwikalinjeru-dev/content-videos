import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

// Original flat illustrations, one scene per industry (viewBox 800×500).
// People are faceless figures, so no real faces (CLAUDE.md rule 9), and no stock licensing.

export type Industry =
  | "roofing"
  | "hvac"
  | "plumbing"
  | "dental"
  | "medspa"
  | "salon"
  | "law"
  | "landscaping"
  | "cleaning"
  | "bookkeeping"
  | "agency"
  | "remodeling";

const P = {
  sky: "#16204a",
  sky2: "#1d2a5c",
  ground: "#0f1630",
  line: "#2b3660",
  white: "#f4f6fb",
  muted: "#9aa5c4",
  yellow: "#ffd84d",
  orange: "#ff9f43",
  red: "#ff5a5f",
  green: "#3ddc97",
  blue: "#5b8cff",
  teal: "#2ec4b6",
  brown: "#8a5a3c",
  wood: "#c08552",
  grey: "#5d6688",
  dark: "#0b1020",
};

const SKIN = ["#8d5524", "#c68642", "#e0ac69", "#6b4226", "#f1c27d"];

// faceless person; (x, y) = feet centre
const Person: React.FC<{
  x: number;
  y: number;
  s?: number;
  skin?: number;
  shirt?: string;
  pants?: string;
  hat?: "hard" | "cap" | "none" | "hair";
  hatColor?: string;
  armUp?: boolean;
  bob?: number;
}> = ({ x, y, s = 1, skin = 0, shirt = P.blue, pants = P.dark, hat = "none", hatColor = P.yellow, armUp, bob = 0 }) => (
  <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
    <rect x={-22} y={-70} width={18} height={70} rx={8} fill={pants} />
    <rect x={4} y={-70} width={18} height={70} rx={8} fill={pants} />
    <rect x={-30} y={-150} width={60} height={88} rx={22} fill={shirt} />
    <rect x={-46} y={armUp ? -210 : -146} width={16} height={74} rx={8} fill={shirt} transform={armUp ? "rotate(20 -38 -146)" : undefined} />
    <rect x={30} y={-146} width={16} height={74} rx={8} fill={shirt} />
    <circle cx={0} cy={-178} r={28} fill={SKIN[skin % SKIN.length]} />
    {hat === "hard" && (
      <>
        <path d="M-32 -184 A32 32 0 0 1 32 -184 Z" fill={hatColor} />
        <rect x={-38} y={-188} width={76} height={8} rx={4} fill={hatColor} />
      </>
    )}
    {hat === "cap" && (
      <>
        <path d="M-29 -186 A29 29 0 0 1 29 -186 Z" fill={hatColor} />
        <rect x={0} y={-190} width={44} height={8} rx={4} fill={hatColor} />
      </>
    )}
    {hat === "hair" && <path d="M-30 -178 A30 30 0 0 1 30 -178 L30 -150 L22 -150 L22 -180 L-22 -180 L-22 -150 L-30 -150 Z" fill={hatColor} />}
  </g>
);

const Backdrop: React.FC<{ sun?: boolean; t: number }> = ({ sun = true, t }) => (
  <>
    <rect x={0} y={0} width={800} height={500} rx={36} fill={P.sky} />
    <circle cx={140} cy={120} r={220} fill={P.sky2} opacity={0.6} />
    {sun && (
      <g transform={`translate(680 90) rotate(${t * 0.4})`}>
        <circle r={38} fill={P.yellow} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={-4} y={-66} width={8} height={16} rx={4} fill={P.yellow} transform={`rotate(${i * 45})`} />
        ))}
      </g>
    )}
    <rect x={0} y={420} width={800} height={80} fill={P.ground} />
    <rect x={0} y={420} width={800} height={6} fill={P.line} />
  </>
);

const House: React.FC<{ x: number; y: number; w?: number; roof?: string; wall?: string }> = ({
  x,
  y,
  w = 280,
  roof = P.red,
  wall = "#e9e6dc",
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={-180} width={w} height={180} fill={wall} />
    <polygon points={`-24,-180 ${w / 2},-300 ${w + 24},-180`} fill={roof} />
    {Array.from({ length: 4 }, (_, i) => {
      // shingle lines stay inside the roof triangle
      const y = -195 - i * 24;
      const half = (w / 2 + 24) * (1 - (-180 - y) / 120) - 6;
      return <line key={i} x1={w / 2 - half} y1={y} x2={w / 2 + half} y2={y} stroke={P.dark} strokeOpacity={0.25} strokeWidth={4} />;
    })}
    <rect x={w / 2 - 30} y={-100} width={60} height={100} rx={6} fill={P.brown} />
    <rect x={24} y={-140} width={56} height={50} rx={6} fill={P.blue} opacity={0.8} />
    <rect x={w - 80} y={-140} width={56} height={50} rx={6} fill={P.blue} opacity={0.8} />
  </g>
);

type SceneFC = React.FC<{ t: number }>;

const SCENES: Record<Industry, SceneFC> = {
  roofing: ({ t }) => (
    <>
      <Backdrop t={t} />
      <House x={200} y={420} w={320} roof={P.orange} />
      {/* ladder */}
      <g transform="translate(560 420) rotate(-18)">
        <rect x={0} y={-250} width={10} height={250} fill={P.wood} />
        <rect x={50} y={-250} width={10} height={250} fill={P.wood} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={0} y={-230 + i * 40} width={60} height={8} fill={P.wood} />
        ))}
      </g>
      <Person x={430} y={185} s={0.8} skin={1} shirt={P.orange} hat="hard" bob={Math.sin(t / 10) * 3} armUp />
      {/* shingle bundle */}
      <rect x={150} y={385} width={70} height={35} rx={6} fill={P.grey} />
    </>
  ),
  hvac: ({ t }) => (
    <>
      <Backdrop t={t} />
      <rect x={420} y={180} width={300} height={240} fill="#e9e6dc" />
      <rect x={470} y={230} width={90} height={80} rx={8} fill={P.blue} opacity={0.8} />
      {/* outdoor AC unit with spinning fan */}
      <g transform="translate(250 330)">
        <rect x={-110} y={-90} width={220} height={180} rx={16} fill="#cfd6e6" />
        <circle r={62} fill={P.dark} />
        <g transform={`rotate(${t * 9})`}>
          {[0, 120, 240].map((a) => (
            <ellipse key={a} cx={0} cy={-28} rx={14} ry={30} fill={P.muted} transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r={10} fill={P.white} />
      </g>
      <Person x={600} y={420} s={0.85} skin={3} shirt={P.teal} hat="cap" hatColor={P.blue} />
      <rect x={640} y={380} width={60} height={40} rx={6} fill={P.red} />
    </>
  ),
  plumbing: ({ t }) => (
    <>
      <Backdrop t={t} />
      {/* van */}
      <g transform="translate(110 420)">
        <rect x={0} y={-150} width={330} height={120} rx={20} fill={P.white} />
        <rect x={230} y={-190} width={100} height={80} rx={16} fill={P.white} />
        <rect x={250} y={-176} width={66} height={44} rx={8} fill={P.blue} opacity={0.8} />
        <rect x={0} y={-90} width={330} height={16} fill={P.blue} />
        <circle cx={70} cy={-30} r={30} fill={P.dark} />
        <circle cx={260} cy={-30} r={30} fill={P.dark} />
        {/* wrench logo */}
        <g transform="translate(110 -130) rotate(-30)">
          <rect x={-6} y={0} width={12} height={46} rx={6} fill={P.blue} />
          <circle cx={0} cy={0} r={14} fill={P.blue} />
          <circle cx={0} cy={-4} r={6} fill={P.white} />
        </g>
      </g>
      {/* gate */}
      <g transform="translate(520 420)">
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={i * 24} y={-130} width={10} height={130} fill={P.grey} />
        ))}
        <rect x={0} y={-110} width={130} height={10} fill={P.grey} />
        <rect x={0} y={-40} width={130} height={10} fill={P.grey} />
      </g>
      <Person x={700} y={420} s={0.85} skin={2} shirt={P.blue} hat="cap" hatColor={P.dark} bob={Math.sin(t / 12) * 2} />
    </>
  ),
  dental: ({ t }) => (
    <>
      <Backdrop t={t} sun={false} />
      {/* chair */}
      <g transform="translate(180 420)">
        <rect x={0} y={-90} width={260} height={40} rx={20} fill={P.teal} />
        <rect x={210} y={-200} width={50} height={140} rx={20} fill={P.teal} transform="rotate(20 235 -60)" />
        <rect x={110} y={-50} width={30} height={50} fill={P.grey} />
        <rect x={60} y={-10} width={130} height={14} rx={7} fill={P.grey} />
      </g>
      {/* lamp */}
      <path d="M520 100 Q440 100 430 180" stroke={P.grey} strokeWidth={10} fill="none" />
      <ellipse cx={430} cy={190} rx={46} ry={22} fill={P.yellow} opacity={0.9} />
      {/* big tooth */}
      <g transform={`translate(640 270) scale(${1 + Math.sin(t / 15) * 0.03})`}>
        <path d="M-70 -60 Q-70 -110 -30 -110 Q0 -95 30 -110 Q70 -110 70 -60 Q70 0 45 60 Q35 90 20 60 L0 10 L-20 60 Q-35 90 -45 60 Q-70 0 -70 -60 Z" fill={P.white} />
        <path d="M80 -120 l8 18 l18 8 l-18 8 l-8 18 l-8 -18 l-18 -8 l18 -8 Z" fill={P.yellow} />
      </g>
    </>
  ),
  medspa: ({ t }) => (
    <>
      <Backdrop t={t} sun={false} />
      {/* treatment bed */}
      <rect x={120} y={300} width={360} height={50} rx={24} fill={P.white} />
      <rect x={130} y={350} width={20} height={70} fill={P.grey} />
      <rect x={450} y={350} width={20} height={70} fill={P.grey} />
      <rect x={130} y={280} width={110} height={30} rx={15} fill="#dfe4f0" />
      {/* bottles & leaves */}
      <rect x={560} y={260} width={50} height={110} rx={14} fill={P.teal} />
      <rect x={575} y={240} width={20} height={24} rx={4} fill={P.grey} />
      <rect x={630} y={290} width={44} height={80} rx={12} fill="#f7c6d0" />
      <rect x={530} y={370} width={180} height={50} rx={10} fill={P.wood} />
      <g transform={`translate(650 170) rotate(${Math.sin(t / 20) * 6})`}>
        <ellipse cx={0} cy={0} rx={22} ry={60} fill={P.green} transform="rotate(-25)" />
        <ellipse cx={40} cy={10} rx={18} ry={50} fill={P.green} transform="rotate(25 40 10)" />
      </g>
    </>
  ),
  salon: ({ t }) => (
    <>
      <Backdrop t={t} sun={false} />
      {/* mirror */}
      <rect x={430} y={90} width={220} height={270} rx={110} fill="#c9d4ee" />
      <rect x={445} y={105} width={190} height={240} rx={95} fill={P.sky2} />
      {/* chair */}
      <g transform="translate(300 420)">
        <rect x={-70} y={-170} width={140} height={120} rx={30} fill={P.red} />
        <rect x={-90} y={-70} width={180} height={34} rx={17} fill={P.red} />
        <rect x={-10} y={-36} width={20} height={30} fill={P.grey} />
        <rect x={-70} y={-8} width={140} height={10} rx={5} fill={P.grey} />
      </g>
      {/* scissors */}
      <g transform={`translate(640 380) rotate(${Math.sin(t / 8) * 10})`}>
        <circle cx={-22} cy={20} r={14} fill="none" stroke={P.yellow} strokeWidth={8} />
        <circle cx={22} cy={20} r={14} fill="none" stroke={P.yellow} strokeWidth={8} />
        <rect x={-6} y={-60} width={8} height={70} rx={4} fill={P.white} transform="rotate(-12)" />
        <rect x={-2} y={-60} width={8} height={70} rx={4} fill={P.white} transform="rotate(12)" />
      </g>
      <Person x={160} y={420} s={0.8} skin={4} shirt={P.dark} hat="hair" hatColor={P.brown} />
    </>
  ),
  law: ({ t }) => (
    <>
      <Backdrop t={t} sun={false} />
      {/* courthouse */}
      <polygon points="120,150 320,80 520,150" fill="#d9dcea" />
      <rect x={130} y={150} width={380} height={24} fill="#c7cbe0" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={150 + i * 78} y={174} width={30} height={220} fill="#e9ebf4" />
      ))}
      <rect x={120} y={394} width={400} height={26} fill="#c7cbe0" />
      {/* scales */}
      <g transform={`translate(650 250) rotate(${Math.sin(t / 18) * 4})`}>
        <rect x={-4} y={-110} width={8} height={170} fill={P.yellow} />
        <rect x={-90} y={-110} width={180} height={8} rx={4} fill={P.yellow} />
        <path d="M-90 -100 L-120 -30 L-60 -30 Z" fill="none" stroke={P.yellow} strokeWidth={4} />
        <path d="M90 -100 L60 -30 L120 -30 Z" fill="none" stroke={P.yellow} strokeWidth={4} />
        <path d="M-125 -30 A35 18 0 0 0 -55 -30 Z" fill={P.yellow} />
        <path d="M55 -30 A35 18 0 0 0 125 -30 Z" fill={P.yellow} />
        <rect x={-40} y={60} width={80} height={14} rx={7} fill={P.yellow} />
      </g>
      {/* books */}
      <rect x={590} y={380} width={40} height={40} fill={P.red} />
      <rect x={632} y={370} width={40} height={50} fill={P.blue} />
      <rect x={674} y={385} width={40} height={35} fill={P.green} />
    </>
  ),
  landscaping: ({ t }) => (
    <>
      <Backdrop t={t} />
      {/* lawn stripes */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={i * 100} y={420} width={100} height={80} fill={i % 2 ? "#1d5c3f" : "#226b49"} />
      ))}
      {/* fence */}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={20 + i * 66} y={300} width={40} height={120} rx={8} fill="#e9e6dc" opacity={0.85} />
      ))}
      <rect x={0} y={330} width={800} height={12} fill="#e9e6dc" opacity={0.85} />
      {/* tree */}
      <rect x={140} y={260} width={30} height={160} fill={P.brown} />
      <circle cx={155} cy={220} r={90} fill={P.green} />
      <circle cx={100} cy={260} r={50} fill="#2fb57d" />
      {/* mower */}
      <g transform={`translate(${470 + Math.sin(t / 25) * 30} 420)`}>
        <rect x={0} y={-50} width={110} height={40} rx={10} fill={P.red} />
        <circle cx={20} cy={-8} r={14} fill={P.dark} />
        <circle cx={90} cy={-8} r={14} fill={P.dark} />
        <line x1={100} y1={-50} x2={160} y2={-130} stroke={P.grey} strokeWidth={8} />
      </g>
      <Person x={660} y={420} s={0.8} skin={0} shirt={P.green} hat="cap" hatColor={P.yellow} />
    </>
  ),
  cleaning: ({ t }) => (
    <>
      <Backdrop t={t} />
      {/* office building */}
      <rect x={90} y={110} width={300} height={310} fill="#cfd6e6" />
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (
          <rect key={`${r}-${c}`} x={110 + c * 70} y={130 + r * 70} width={50} height={46} rx={4} fill={P.blue} opacity={0.75} />
        )),
      )}
      {/* bucket + mop */}
      <g transform="translate(520 420)">
        <path d="M0 -80 L90 -80 L80 0 L10 0 Z" fill={P.yellow} />
        <rect x={40} y={-260} width={10} height={200} fill={P.wood} transform="rotate(10 45 -60)" />
      </g>
      {/* spray bottle with sparkle */}
      <g transform="translate(680 420)">
        <rect x={-26} y={-110} width={52} height={110} rx={14} fill={P.teal} />
        <rect x={-14} y={-140} width={40} height={30} rx={6} fill={P.white} />
        <path d={`M48 -150 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 Z`} fill={P.yellow} opacity={0.6 + 0.4 * Math.sin(t / 6)} />
      </g>
    </>
  ),
  bookkeeping: ({ t }) => (
    <>
      <Backdrop t={t} sun={false} />
      {/* desk */}
      <rect x={80} y={330} width={640} height={30} rx={10} fill={P.wood} />
      <rect x={110} y={360} width={20} height={60} fill={P.brown} />
      <rect x={670} y={360} width={20} height={60} fill={P.brown} />
      {/* laptop */}
      <rect x={140} y={190} width={240} height={140} rx={12} fill={P.grey} />
      <rect x={155} y={205} width={210} height={110} rx={6} fill={P.dark} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={175 + i * 48} y={300 - (30 + i * 18)} width={30} height={30 + i * 18} fill={i === 3 ? P.green : P.blue} />
      ))}
      {/* paper stack */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={430 + i * 6} y={250 - i * 8} width={150} height={80} rx={6} fill={P.white} opacity={1 - i * 0.2} />
      ))}
      {/* calculator */}
      <g transform="translate(620 230)">
        <rect x={0} y={0} width={80} height={100} rx={10} fill={P.dark} stroke={P.line} strokeWidth={4} />
        <rect x={10} y={10} width={60} height={22} rx={4} fill={P.green} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={12 + (i % 3) * 20} y={42 + Math.floor(i / 3) * 24} width={14} height={14} rx={3} fill={P.muted} />
        ))}
      </g>
    </>
  ),
  agency: ({ t }) => (
    <>
      <Backdrop t={t} sun={false} />
      <rect x={100} y={330} width={600} height={26} rx={10} fill={P.wood} />
      <rect x={200} y={140} width={400} height={190} rx={14} fill={P.grey} />
      <rect x={216} y={156} width={368} height={158} rx={8} fill={P.dark} />
      {[0, 1, 2, 3, 4].map((i) => {
        const h = 30 + ((i * 37) % 90) + Math.sin(t / 10 + i) * 6;
        return <rect key={i} x={250 + i * 64} y={300 - h} width={36} height={h} fill={i === 4 ? P.yellow : P.blue} />;
      })}
      <rect x={640} y={280} width={40} height={50} rx={8} fill={P.white} />
      <rect x={680} y={292} width={14} height={24} rx={7} fill="none" stroke={P.white} strokeWidth={5} />
    </>
  ),
  remodeling: ({ t }) => (
    <>
      <Backdrop t={t} sun={false} />
      {/* kitchen cabinets */}
      <rect x={80} y={120} width={360} height={110} rx={8} fill="#e9e6dc" />
      <rect x={80} y={270} width={360} height={150} rx={8} fill="#e9e6dc" />
      <rect x={70} y={258} width={380} height={18} rx={6} fill={P.grey} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={95 + i * 118} y={135} width={100} height={80} rx={6} fill="#d6d1c2" />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={95 + i * 118} y={290} width={100} height={115} rx={6} fill="#d6d1c2" />
      ))}
      {/* paint roller */}
      <g transform={`translate(600 ${220 + Math.sin(t / 12) * 10})`}>
        <rect x={-60} y={-24} width={120} height={48} rx={22} fill={P.yellow} />
        <path d="M60 0 L90 0 L90 80 L10 80 L10 130" stroke={P.grey} strokeWidth={10} fill="none" />
        <rect x={0} y={130} width={20} height={70} rx={8} fill={P.dark} />
      </g>
      <Person x={720} y={420} s={0.75} skin={3} shirt={P.orange} hat="hard" />
    </>
  ),
};

export const IndustryArt: React.FC<{
  industry: Industry;
  width?: number;
  /** "problem" adds a red alert badge, "fixed" a green check */
  mood?: "neutral" | "problem" | "fixed";
  style?: React.CSSProperties;
}> = ({ industry, width = 860, mood = "neutral", style }) => {
  const t = useCurrentFrame();
  const Scene = SCENES[industry];
  const pop = interpolate(t, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg viewBox="0 0 800 500" width={width} height={(width * 500) / 800} style={style}>
      <defs>
        <clipPath id={`clip-${industry}`}>
          <rect x={0} y={0} width={800} height={500} rx={36} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${industry})`}>
        <Scene t={t} />
      </g>
      {mood !== "neutral" && (
        <g transform={`translate(740 440) scale(${pop})`}>
          <circle r={44} fill={mood === "problem" ? P.red : P.green} stroke={P.dark} strokeWidth={6} />
          <text
            x={0}
            y={18}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={900}
            fontSize={52}
            fill={P.dark}
          >
            {mood === "problem" ? "!" : "✓"}
          </text>
        </g>
      )}
    </svg>
  );
};
