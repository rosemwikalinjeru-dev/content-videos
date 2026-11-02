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

## Open flags (pending input)
- CTA mechanic: is "traffic to my pages" = follow/profile visit, or should we still use a comment-keyword to start DMs? (inferred: follow-first) -> Rose
- When one has to win, US or UK? (currency, spelling, terminology) -> Rose
