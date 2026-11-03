// One spec per video. Every visual beat names the spoken word it lands on (`beat`),
// so the animation follows the real voiceover timing from manifest.json.

export type NodeKind =
  | "normal" // an ordinary step
  | "bad" // THE bottleneck (exactly one per "before" flow, red)
  | "outcome" // where the broken flow ends up (lost job, empty chair), grey
  | "ai" // the automated step (blue)
  | "human" // a person checks or decides (green)
  | "done"; // the good end state (green, solid)

export type FlowNode = {
  label: string;
  sub?: string;
  kind: NodeKind;
  /** spoken word this box appears on; omit to show it at the start of the scene */
  beat?: string;
};

export type Flow = {
  /** the demo customer travelling through the flow */
  customer: string;
  nodes: FlowNode[]; // max 4 (readable on a phone)
};

export type TeardownSpec = {
  id: string; // must match scenes/<id>.txt and the voiceover folder
  compositionId: string;
  business: string; // shown as "DEMO · <business>"
  moment: { clip: string; label: string };
  before: Flow;
  cost: { lines: { text: string; beat?: string; color?: "ink" | "bad" | "accent" }[] };
  newThing: { kicker: string; title: string; sub?: string; source?: string; isNews: boolean };
  after: Flow;
  verdict: { lines: { text: string; beat?: string; color: "ok" | "bad" | "accent" | "muted" }[] };
};
