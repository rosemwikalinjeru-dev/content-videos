# Video Scripts: Brainstorm / Discovery Notes
Date: 2026-11-02 · Goal: Stress-test how Rose Njeru Automation video scripts are written (starting from scenes/gpt61-terra.txt) and capture the rules so every future script follows them.

## Context going in
- Current script: scenes/gpt61-terra.txt (9 scenes, voiced, final render 64.0s, over the 30–60s target)
- Known issues already spotted: hook has a 2.2s dead pause ("..." + [pause]); "What it means for businesses" format, not "I tested it"; CTA promises a follow-up video
- Pipeline rules live in CLAUDE.md (research → script → approval → voice → visuals)

## Summary / key decisions
- **Audience split by format.** Short-form (TikTok/Reels/Shorts) is written for the **service business owner**. Builder detail (tokens, benchmarks, model names) goes in on-screen text only, never in the voiceover. Long-form YouTube "Build it" videos are for **builders**.
- **Why:** the next 3 weeks are revenue first.
- **Market: US / UK owners.** Use USD (or GBP for UK-specific examples) and US/UK business examples. Customers there are phone/SMS/email/web-form first, not WhatsApp/M-Pesa. Note: this is a different call from my Kenya-first recommendation, and Rose chose US/UK.
- **Script quality bar (Rose's words):** "clear, understandable, relatable, business worthy and will create traffic to my pages."
- **Flow diagrams are a core format element:** every video explains a flow diagram, built with HyperFrames and Remotion.
- **Reconciling with the earlier "too much graphics" feedback:** the diagram IS the explanation, not decoration. One diagram per video, built node by node as the voice says each step, and nothing else competing on screen.
- **Default story structure: Before → After, told through one customer.** First the broken flow (the red box is the single bottleneck), then the fixed flow (where automation goes and where a person still checks).
- **Diagram limits:** max 4 boxes per flow, exactly one red box, and each box appears when the voice says it.
- **"Make it relatable"** is an explicit requirement (Rose, Q4), so every script must pass a relatability check.
- **Relatability rule: the owner's moment comes first, then the customer moves through the flow.** Every short-form script needs:
  1. A real moment with a time of day and a situation ("It's Monday, 8am. Your front desk has fourteen new patient emails…")
  2. One named demo customer with an ordinary name, labelled demo on screen
  3. A cost in owner terms (hours per week, a lost appointment, a wrong record), never tokens or benchmarks
  4. Owner vocabulary ("front desk", "appointment", "the system"), never "workflow", "integration" or "API" in the voiceover
- **Demo numbers are allowed only if labelled as demo** on screen (e.g. "DEMO SCENARIO"). Real or news numbers still need a source in research/.
- **Default short-form scene order (replaces the CLAUDE.md order for business-owner shorts):**
  1. Owner's moment (hook), 3–5s
  2. Before flow, with the red box as the bottleneck, 6–8s
  3. The cost (labelled demo number), 3–5s
  4. The new thing, one sentence plus a source card, 5–7s
  5. After flow, showing where AI goes and where a person checks, 8–10s
  6. Honest verdict, 4–6s
  7. CTA, about 3s
  Target 35–45s. Builder details (price per token, benchmarks, model comparisons) become on-screen text at most, never voiceover.
- **Freshness rule relaxed:** topic news can be up to **14 days** old when the video is a business teardown (news is the fix, not the headline). Pure news videos keep the 7-day rule. Terra (Oct 26) is OK until ~Nov 9.
- **Default CTA: series follow.** "Follow… I fix one business process like this every week." Show the series name on screen ("Can I Automate This Business?"). Use a comment keyword only when a real asset exists to send. Don't use "next I'm testing X" lines unless that video is scheduled.
- **Primary goal of each video: traffic to Rose's pages** (profile visits and follows), not direct sales from the video.

## Q&A log
### Q1 — Who is the script for?
- Asked: business owner vs. automation builder, and which market.
- Captured: "in the next three weeks, revenue comes first, so short-form scripts should be written for the business owner, with builder detail only as on-screen text. The longer YouTube 'Build it' videos can be for builders."
- Implication for gpt61-terra: the "$1 per million input tokens" line is builder language in the voiceover and should become on-screen text. The voiceover should talk about cost per task or per booking instead.
- Flags: geography resolved in Q2.

### Q2 — Which market are the owners in?
- Asked: Kenya / US-UK / both (recommended Kenya-first).
- Captured: "us/uk"
- Implications: examples use US/UK service businesses (dental practice, HVAC/plumbing, med spa, law firm, agency). Currency is $ (or £ for UK-only examples). Channels are calls, missed calls, SMS, web forms and email. Spelling and phrasing should suit both (e.g. "appointment", not "booking slot"). The 3-month KES goal is still the internal target, and clients pay in USD/GBP.
- Flags: is the first audience US or UK when an example has to pick one (spelling, currency, terms like "dentist" vs "dental practice")? -> Rose (later)

### Q3 — What should the viewer do at the end (CTA)?
- Asked: follow / comment keyword / DM / link in bio (recommended comment keyword + lead magnet).
- Captured: "I want something clear understable, relatable, business worthy and will create traffic to my pages, this includes flow diagrams explained, using hyper frames and remotion"
- Interpretation: the goal is traffic to her pages. The CTA wasn't picked directly, so it's inferred as follow/profile-visit and flagged.
- New requirement: an explained flow diagram (HyperFrames + Remotion) in every video.
- Flags: CTA mechanic -> Rose

### Q4 — How is the flow diagram told?
- Asked: Before→After / one flow revealed / follow one customer (recommended Before→After through one customer).
- Captured: "yes, before → after through one customer. Make it relatable"
- Terra example: Before = Patient emails → front desk retypes (red) → old system. After = Patient emails → AI fills the form → staff approve → saved.
- Flags: what "relatable" concretely means (whose pain leads, how the customer is named) -> asked as Q5

### Q5 — What makes it relatable?
- Asked: owner's pain vs. customer's pain leading, and how specific the moment is (recommended owner's moment first, customer moves through the flow, demo numbers labelled).
- Captured: "yes, owner's moment first, label demo numbers"
- Terra hook draft (not yet approved): "It's Monday, 8am. Your front desk has fourteen new patient emails… and every one gets retyped by hand. OpenAI just released an AI that can do that typing for you."
- Flags: none

### Q6 — Default scene order and news freshness
- Asked: switch to the owner-first 7-scene order? Relax the 7-day rule for teardown videos?
- Captured: "yes, use the 7-scene order, relax to 14 days"
- Follow-ups: CLAUDE.md "Short-form structure" and "Hard rule 3" need updating to match (do this at the end, with Rose's OK).
- Flags: none

### Q7 — CTA
- Asked: follow / comment keyword / series-follow (recommended series-follow as the default).
- Captured: "yes, option 3 as default"
- Terra CTA becomes: "Follow… I fix one business process like this every week." This replaces "Next, I'm putting it on a real booking form…", so there's no unscheduled promise.
- Commitment implied: a weekly teardown cadence. That's consistent with the Saturday "Can I Automate This Business?" series in Rose's operating system.
- Flags: none (resolves the earlier CTA-mechanic flag)

## Open flags (pending input)
- Update CLAUDE.md (short-form structure, rule 3 freshness, audience/CTA rules) once the grill is done -> Claude, with Rose's approval
- When one has to win, US or UK? (currency, spelling, terminology) -> Rose
