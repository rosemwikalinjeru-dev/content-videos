import { makeExplainer } from "../explainer/primitives";
import type { ScriptScene } from "../../lib/timing";
import { BUSY } from "./busy";
import { BOTTLENECK } from "./bottleneck";
import { SEESAW } from "./seesaw";
import { KNOWLEDGE } from "./knowledge";
import { DIALS } from "./dials";
import { GAUGES } from "./gauges";
import { LEAVERS } from "./leavers";
import { CALENDAR } from "./calendar";
import dials from "../../generated/biz-price-or-customers.scenes.json";
import gauges from "../../generated/biz-five-numbers.scenes.json";
import leavers from "../../generated/biz-silent-leavers.scenes.json";
import calendar from "../../generated/biz-say-no.scenes.json";
import busy from "../../generated/biz-busy-not-profitable.scenes.json";
import bottleneck from "../../generated/biz-owner-bottleneck.scenes.json";
import seesaw from "../../generated/biz-cheapest-customer.scenes.json";
import knowledge from "../../generated/biz-best-employee-quits.scenes.json";

// Business videos (not automation): money, the owner, pricing, the team.
export const BIZ: { id: string; compositionId: string; component: ReturnType<typeof makeExplainer>; script: ScriptScene[] }[] = [
  { id: "biz-busy-not-profitable", compositionId: "BizBusyNotProfitable", component: makeExplainer(BUSY), script: busy.scenes },
  { id: "biz-owner-bottleneck", compositionId: "BizOwnerBottleneck", component: makeExplainer(BOTTLENECK), script: bottleneck.scenes },
  { id: "biz-cheapest-customer", compositionId: "BizCheapestCustomer", component: makeExplainer(SEESAW), script: seesaw.scenes },
  { id: "biz-best-employee-quits", compositionId: "BizBestEmployeeQuits", component: makeExplainer(KNOWLEDGE), script: knowledge.scenes },
  { id: "biz-price-or-customers", compositionId: "BizPriceOrCustomers", component: makeExplainer(DIALS), script: dials.scenes },
  { id: "biz-five-numbers", compositionId: "BizFiveNumbers", component: makeExplainer(GAUGES), script: gauges.scenes },
  { id: "biz-silent-leavers", compositionId: "BizSilentLeavers", component: makeExplainer(LEAVERS), script: leavers.scenes },
  { id: "biz-say-no", compositionId: "BizSayNo", component: makeExplainer(CALENDAR), script: calendar.scenes },
];
