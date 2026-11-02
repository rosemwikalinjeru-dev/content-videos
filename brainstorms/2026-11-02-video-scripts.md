# Video Scripts: Brainstorm / Discovery Notes
Date: 2026-11-02 · Goal: Stress-test how Rose Njeru Automation video scripts are written (starting from scenes/gpt61-terra.txt) and capture the rules so every future script follows them.

## Context going in
- Current script: scenes/gpt61-terra.txt (9 scenes, voiced, final render 64.0s, over the 30–60s target)
- Known issues already spotted: hook has a 2.2s dead pause ("..." + [pause]); "What it means for businesses" format, not "I tested it"; CTA promises a follow-up video
- Pipeline rules live in CLAUDE.md (research → script → approval → voice → visuals)

## Summary / key decisions
- **Audience split by format.** Short-form (TikTok/Reels/Shorts) is written for the **service business owner**. Builder detail (tokens, benchmarks, model names) goes in on-screen text only, never in the voiceover. Long-form YouTube "Build it" videos are for **builders**.
- **Why:** the next 3 weeks are revenue first.

## Q&A log
### Q1 — Who is the script for?
- Asked: business owner vs. automation builder, and which market.
- Captured: "in the next three weeks, revenue comes first, so short-form scripts should be written for the business owner, with builder detail only as on-screen text. The longer YouTube 'Build it' videos can be for builders."
- Implication for gpt61-terra: the "$1 per million input tokens" line is builder language in the voiceover and should become on-screen text. The voiceover should talk about cost per task or per booking instead.
- Flags: target geography (Kenya / US-UK / both) not answered -> Rose (asked as Q2)

## Open flags (pending input)
- Target owner geography: Kenya, US/UK, or both? -> Rose
