import { makeExplainer } from "./primitives";
import { TWO_SALONS } from "./twoSalons";
import { RIPPLE } from "./ripple";
import { GOES_WRONG } from "./goesWrong";
import { FIVE_STEPS } from "./fiveSteps";
import { RACE } from "./race";
import { QUIZ } from "./quiz";
import twoSalons from "../../generated/ex-two-salons.scenes.json";
import ripple from "../../generated/ex-ripple-effects.scenes.json";
import goesWrong from "../../generated/ex-what-goes-wrong.scenes.json";
import fiveSteps from "../../generated/ex-five-steps.scenes.json";
import race from "../../generated/ex-the-race.scenes.json";
import quiz from "../../generated/ex-ai-or-automation.scenes.json";
import type { ScriptScene } from "../../lib/timing";

// Explainer formats: each video has its own story shape and its own visuals.
export const EXPLAINERS: { id: string; compositionId: string; component: ReturnType<typeof makeExplainer>; script: ScriptScene[] }[] = [
  { id: "ex-two-salons", compositionId: "ExTwoSalons", component: makeExplainer(TWO_SALONS), script: twoSalons.scenes },
  { id: "ex-ripple-effects", compositionId: "ExRippleEffects", component: makeExplainer(RIPPLE), script: ripple.scenes },
  { id: "ex-what-goes-wrong", compositionId: "ExWhatGoesWrong", component: makeExplainer(GOES_WRONG), script: goesWrong.scenes },
  { id: "ex-five-steps", compositionId: "ExFiveSteps", component: makeExplainer(FIVE_STEPS), script: fiveSteps.scenes },
  { id: "ex-the-race", compositionId: "ExTheRace", component: makeExplainer(RACE), script: race.scenes },
  { id: "ex-ai-or-automation", compositionId: "ExAiOrAutomation", component: makeExplainer(QUIZ), script: quiz.scenes },
];
