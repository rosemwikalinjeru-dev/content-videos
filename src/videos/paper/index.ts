import type { ScriptScene } from "../../lib/timing";
import { makePaper } from "./kit";
import { PAPER_BOTTLENECK } from "./bottleneck";
import bottleneck from "../../generated/biz-owner-bottleneck.scenes.json";

// "Paper" format: light background, presenter in the corner, one illustrated world per video.
// Each entry reuses the script (and voiceover) of the matching scenes/<id>.txt.
export const PAPER: { id: string; compositionId: string; component: ReturnType<typeof makePaper>; script: ScriptScene[] }[] = [
  { id: "biz-owner-bottleneck", compositionId: "PaperOwnerBottleneck", component: makePaper(PAPER_BOTTLENECK), script: bottleneck.scenes },
];
