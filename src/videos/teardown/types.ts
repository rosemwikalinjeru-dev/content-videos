// One spec per video. Every visual beat names the spoken word it lands on (`beat`),
// so the animation follows the real voiceover timing from manifest.json.

export type NodeKind =
  | "normal" // an ordinary step
  | "bad" // THE bottleneck (exactly one per "before" flow, red)
  | "outcome" // where the broken flow ends up (lost job, empty chair), grey
  | "ai" // the automated step (blue)
  | "human" // a person checks or decides (green)
  | "done" // the good end state (green, solid)
  // permission-map kinds (what an AI agent is allowed to do)
  | "read" // read-only access (blue)
  | "limited" // can write, but only something narrow (amber)
  | "handoff"; // never the AI's call: goes to a person (green outline)

export type FlowNode = {
  label: string;
  sub?: string;
  kind: NodeKind;
  /** spoken word this box appears on; omit to show it at the start of the scene */
  beat?: string;
  /** override the corner tag (e.g. "FULL ACCESS" instead of "BOTTLENECK") */
  tag?: string;
};

export type Flow = {
  /** the demo customer travelling through the flow */
  customer: string;
  nodes: FlowNode[]; // max 4 (readable on a phone)
  /** diagram shape; default "flow" (vertical boxes) */
  layout?: "flow" | "branch" | "timeline" | "swimlane";
  /** branch: labels on the two split arrows */
  edgeLabels?: [string, string];
  /** timeline: label at the top of the rail (e.g. "DAY 0 · estimate sent") */
  railLabel?: string;
  /** swimlane: one label per lane, node i sits in lane i */
  lanes?: string[];
};

export type TeardownSpec = {
  id: string; // must match scenes/<id>.txt and the voiceover folder
  compositionId: string;
  business: string; // shown as "DEMO · <business>"
  moment: { clip: string; label: string };
  before: Flow;
  cost: { tag?: string; lines: { text: string; beat?: string; color?: "ink" | "bad" | "accent" }[] };
  newThing: {
    kicker: string;
    title: string;
    sub?: string;
    source?: string;
    isNews: boolean;
    /** HyperFrames demo clip shown under the title */
    clip?: string;
    /** seconds of the clip that must be seen; playback speeds up to fit the scene */
    clipSeconds?: number;
    /** do / don't rule card instead of a sub line */
    rule?: { dont: string; do: string };
  };
  after: Flow;
  verdict: { clip?: string; clipSeconds?: number; lines: { text: string; beat?: string; color: "ok" | "bad" | "accent" | "muted" }[] };
};
