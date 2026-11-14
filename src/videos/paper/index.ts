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
import { AI_CONNECTED, AI_THREE_HIRES, AI_OPERATING_SYSTEM } from "./ai1";
import { AI_MESS, AI_JOB, AI_NOT_FOR_AI } from "./ai2";
import { AI_MORNING, AI_FIVE_PAGES, AI_EFFICIENT } from "./ai3";
import c1 from "../../generated/ai-claude-connected.scenes.json";
import c2 from "../../generated/ai-three-hires.scenes.json";
import c3 from "../../generated/ai-operating-system.scenes.json";
import c4 from "../../generated/ai-dont-automate-mess.scenes.json";
import c5 from "../../generated/ai-agent-job-description.scenes.json";
import c6 from "../../generated/ai-not-for-ai.scenes.json";
import c7 from "../../generated/ai-morning-question.scenes.json";
import c8 from "../../generated/ai-five-pages.scenes.json";
import c9 from "../../generated/ai-make-it-efficient.scenes.json";

// "Paper" format: light background, presenter in the corner, one illustrated world per video.
// Each entry reuses the script (and voiceover) of the matching scenes/<id>.txt.
export const PAPER: { id: string; compositionId: string; component: ReturnType<typeof makePaper>; script: ScriptScene[] }[] = [
  { id: "biz-owner-bottleneck", compositionId: "PaperOwnerBottleneck", component: makePaper(PAPER_BOTTLENECK), script: bottleneck.scenes },
  { id: "biz-best-employee-quits", compositionId: "PaperBestEmployeeQuits", component: makePaper(PAPER_KNOWLEDGE), script: knowledge.scenes },
  { id: "biz-busy-not-profitable", compositionId: "PaperBusyNotProfitable", component: makePaper(PAPER_JOBS), script: jobs.scenes },
  { id: "biz-silent-leavers", compositionId: "PaperSilentLeavers", component: makePaper(PAPER_LEAVERS), script: leavers.scenes },
  { id: "biz-say-no", compositionId: "PaperSayNo", component: makePaper(PAPER_SAYNO), script: sayno.scenes },
  { id: "ai-claude-connected", compositionId: "PaperAiConnected", component: makePaper(AI_CONNECTED), script: c1.scenes },
  { id: "ai-three-hires", compositionId: "PaperAiThreeHires", component: makePaper(AI_THREE_HIRES), script: c2.scenes },
  { id: "ai-operating-system", compositionId: "PaperAiOperatingSystem", component: makePaper(AI_OPERATING_SYSTEM), script: c3.scenes },
  { id: "ai-dont-automate-mess", compositionId: "PaperAiMess", component: makePaper(AI_MESS), script: c4.scenes },
  { id: "ai-agent-job-description", compositionId: "PaperAiJobDescription", component: makePaper(AI_JOB), script: c5.scenes },
  { id: "ai-not-for-ai", compositionId: "PaperAiNotForAi", component: makePaper(AI_NOT_FOR_AI), script: c6.scenes },
  { id: "ai-morning-question", compositionId: "PaperAiMorning", component: makePaper(AI_MORNING), script: c7.scenes },
  { id: "ai-five-pages", compositionId: "PaperAiFivePages", component: makePaper(AI_FIVE_PAGES), script: c8.scenes },
  { id: "ai-make-it-efficient", compositionId: "PaperAiEfficient", component: makePaper(AI_EFFICIENT), script: c9.scenes },
];
