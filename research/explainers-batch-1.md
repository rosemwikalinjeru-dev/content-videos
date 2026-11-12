# Explainers batch 1 — advantages, effects, problems, solutions, staying ahead

**Why this batch exists:** Rose's feedback (2026-11-06): the 17 teardown episodes "all sound the same". The same
template, the same "It's Monday, 8am" opening and the same arc. This batch uses **6 different story shapes and 6
different main animations**. It doesn't use the 7-scene teardown template.
**Researched:** 2026-11-06

## No statistics in any script
All six are explanations and reasoning, not data. **No percentages, survey numbers or "businesses that use AI
grow X%" claims.** Those circulate widely without primary sources (CLAUDE.md rule 2). Every business, name and
example is a labelled demo.

## Claims that need care (and how the scripts phrase them)

| Video | Claim | Basis / phrasing |
|---|---|---|
| ex-two-salons | "The salon that answers first gets the first chance to book." | Logical. It says "first *chance*", not "always wins" |
| ex-ripple-effects | "Ask at the right moment, and those customers leave reviews." | Conditional ("ask"), no rate claimed. Ties back to Ep 09's review-gating rule (ask everyone) |
| ex-ripple-effects | "Automate a broken process and you just make mistakes faster." | Reasoning / well-known principle, stated as opinion |
| ex-what-goes-wrong | "AI can sound sure and still be wrong." | Widely documented limitation of language models, and providers' own docs warn outputs can be inaccurate. Stated generally, no product named |
| ex-what-goes-wrong | "It breaks silently." | Common failure mode of connected tools (expired logins, changed forms). The fix is design advice (failure alerts) |
| ex-five-steps | Five-step order (pick → map → fix on paper → automate with a human on decisions → measure) | Rose's own method (Understand → Diagnose → Redesign → Automate → Measure) |
| ex-the-race | Three roofers, replies next afternoon / next morning / two minutes | **Demo scenario**, labelled DEMO. No claim about how often the fastest wins: "Guess who gets the first visit" |
| ex-ai-or-automation | Rule-based automation vs AI handling unstructured messages | Definitional. Accurate at the owner level |

## The six formats (so they don't feel alike)

| # | File | Topic you asked for | Story shape | Main animation (Remotion) | HyperFrames piece |
|---|---|---|---|---|---|
| 1 | ex-two-salons | **Advantages** | Same business, two versions | Split screen: Salon A vs Salon B, live reply timers, 3 advantage cards stacking, a "gap" line widening | Two phones side by side: one unread for hours, one answered in a minute |
| 2 | ex-ripple-effects | **Effects** | Chain reaction | Dominoes fall into a loop (reply → bookings → full schedule → reviews → leads → back to start), then red dominoes for the twist | — |
| 3 | ex-what-goes-wrong | **Problems that may arise + solutions** | Countdown of 4 warnings | Warning cards that shake, then flip from red problem to green fix | An "automation health" feed: last run 21 days ago, then an alert fires |
| 4 | ex-five-steps | **Solutions / how to start** | Staircase playbook | A chip climbs 5 steps, each with an icon (pick, map, fix, automate, measure) | — |
| 5 | ex-the-race | **How to be ahead of competitors** | Race | Three lanes, three roofers, a clock running; roofer 3 crosses first and the homeowner chip jumps to them | Three inboxes with timestamps racing |
| 6 | ex-ai-or-automation | **AI vs automation** (myth-busting) | Quiz | Quiz cards with "AI or automation?" buttons, a timer ring, and a reveal stamp. Ends on a 3-part triangle: rules, AI, people | — |

Industry illustrations reused where they fit: salon (1), HVAC (2), roofing (5). Videos 3, 4 and 6 are cross-industry,
so they use icons instead.

## Voice and openings: deliberately varied
No "It's [day], [time]" opening in this batch. The hooks are a comparison (1), a promise of consequences (2), a warning (3),
a reframe (4), a provocative claim (5) and a quiz (6). "Workflow", "integration" and "API" stay on-screen only (CLAUDE.md), and the voice
says "automation" and "the system".

---

## ex-connected-system (added 2026-11-12): simulation + connected flow diagrams

**Format:** system map. Five flows (Lead → Booking → Job → Invoice → Review), three steps each, joined by four
handoffs. A deterministic simulation runs 20 customer dots through the whole map twice.

- **The simulation is an illustration, not data.** The leak pattern is set by hand in
  `src/videos/explainer/connected.tsx` (before: 11 of 20 lost at handoffs; after: 18 reach the end, 2 go to a
  person). On screen it is labelled "DEMO SIMULATION · NOT REAL DATA". The voiceover gives no numbers except
  "twenty customers" and says only "far more reach the end".
- Claim "customers get lost in the gaps between steps": reasoning, the core of Rose's method (handoffs are where
  processes break). No statistic.
