import type { ScriptScene } from "../../lib/timing";
import { makePaper } from "./kit";
import { PAPER_BOTTLENECK } from "./bottleneck";
import { PAPER_KNOWLEDGE } from "./knowledge";
import { PAPER_JOBS } from "./jobs";
import { PAPER_LEAVERS } from "./leavers";
import { PAPER_SAYNO } from "./sayno";
import bottleneck from "../../generated/biz-owner-bottleneck.scenes.json";
import knowledge from "../../generated/biz-best-employee-quits.scenes.json";
import jobs from "../../generated/biz-busy-not-profitable.scenes.json";
import leavers from "../../generated/biz-silent-leavers.scenes.json";
import sayno from "../../generated/biz-say-no.scenes.json";

// "Paper" format: light background, presenter in the corner, one illustrated world per video.
// Each entry reuses the script (and voiceover) of the matching scenes/<id>.txt.
export const PAPER: { id: string; compositionId: string; component: ReturnType<typeof makePaper>; script: ScriptScene[] }[] = [
  { id: "biz-owner-bottleneck", compositionId: "PaperOwnerBottleneck", component: makePaper(PAPER_BOTTLENECK), script: bottleneck.scenes },
  { id: "biz-best-employee-quits", compositionId: "PaperBestEmployeeQuits", component: makePaper(PAPER_KNOWLEDGE), script: knowledge.scenes },
  { id: "biz-busy-not-profitable", compositionId: "PaperBusyNotProfitable", component: makePaper(PAPER_JOBS), script: jobs.scenes },
  { id: "biz-silent-leavers", compositionId: "PaperSilentLeavers", component: makePaper(PAPER_LEAVERS), script: leavers.scenes },
  { id: "biz-say-no", compositionId: "PaperSayNo", component: makePaper(PAPER_SAYNO), script: sayno.scenes },
];
