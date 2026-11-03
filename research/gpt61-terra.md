# GPT-6.1 Terra — research

**Video:** `gpt61-terra` · **Format:** What it means for businesses (30–60s, vertical)
**Researched:** 2026-11-02 · **News date:** 2026-10-26 (7 days old: film/publish this week or it's stale)

## What happened

- **Who:** OpenAI
- **When:** October 26, 2026
- **What:** Released GPT-6.1 Terra, the upgrade to its mid-size model (replaces GPT-5.6 Terra).
  OpenAI's description: "a fast, efficient model that combines detailed visual reasoning and precise
  computer use alongside clearer, more natural writing."
- **Where it's available:** ChatGPT Work and Codex for Plus, Pro, Enterprise and Edu users. In the API as `gpt-6.1-terra`.

## Primary sources

- OpenAI announcement: https://openai.com/index/introducing-gpt-6-1-terra/ (Oct 26, 2026)
- OpenAI system card addendum: https://deploymentsafety.openai.com/gpt-6-1-terra/addendum-to-gpt-6-astra-system-card-gpt-6.1-terra
- OpenAI developer community announcement: https://community.openai.com/t/gpt-6-1-terra-delivering-fast-and-capable-computer-use-at-a-lower-price/1409900

> Note: openai.com is blocked from the cloud session where this was researched, so I couldn't open the
> announcement page directly. The facts below come from search snippets of the openai.com page and from
> press coverage that quotes it. **Rose: open the announcement once and check the starred (★) lines
> before publishing.**

## Secondary coverage

- AI Weekly: https://aiweekly.co/alerts/openai-ships-gpt-61-terra-at-15-per-million-half-of-sol
- AI Magazine: https://aimagazine.com/news/how-openais-gpt-6-1-terra-is-much-faster-and-50-cheaper
- InfoWorld: https://infoworld.com/article/4241006/openai-bets-on-ai-economics-with-lower-cost-gpt-6-1-terra.html
- inside.com.tw (benchmarks): https://www.inside.com.tw/article/42736-openai-gpt-6-1-terra-computer-use-critical-cyber
- Vals.ai index: https://vals.ai/models/openai_gpt-6.1-terra
- Let's Data Science review: https://letsdatascience.com/blog/gpt-6-1-terra-beats-openai-flagship-claude-still-leads
- aicybr (OSWorld numbers): https://aicybr.com/blog/openai-gpt-6-1-terra-api-pricing-computer-use-benchmarks

## Facts used in the script

| # | Claim in script | Status | Source |
|---|---|---|---|
| 1 | Released Oct 26, 2026 by OpenAI | Confirmed | OpenAI announcement |
| 2 | Built for computer use: reads the screen, clicks, types, fills forms | Confirmed (OpenAI lists "filling out forms" as a workday task) | OpenAI announcement, via 9to5Mac/inside.com.tw quotes |
| 3 ★ | $1 per million input tokens, $5 per million output | Confirmed | OpenAI announcement; AI Weekly |
| 4 ★ | Half the price of the model it replaces (GPT-5.6 Terra) | Confirmed: "50% lower than GPT-5.6 Terra and GPT-6.1 Sol" | OpenAI announcement |
| 5 ★ | "More than three times faster" on computer-use tasks than OpenAI's bigger models (GPT-6 Astra, GPT-6.1 Sol) | **OpenAI's own evaluation, not independent.** Script says so. | OpenAI announcement; AI Magazine |
| 6 | OpenAI still recommends its bigger models (GPT-6.1 Sol / GPT-6 Astra) for the most complex coding work | Confirmed | OpenAI announcement, via Let's Data Science |
| 7 | Vals.ai ranks it #10 of 28 | Third-party, on-screen only | vals.ai |

## Not used (and why)

- OSWorld 2.1 scores (66.7% medium / 74.2% max vs Claude Sonnet 5.5 at 83.9%): these come from one secondary blog and I couldn't confirm them against OpenAI's chart. Too much detail for a 45s video anyway.
- Terminal-Bench 4.0 50.3%, hallucination rate 53.6% → 16.7%: only in one Chinese-language report. Not needed.
- "Critical" cybersecurity rating: true (system card), but off-topic for this video.

## Business translation (the demo)

**Demo scenario (labelled as a demo on screen):** a dental clinic. New-patient details arrive by email or
web form, and front-desk staff retype them into an old booking portal that has no API. That retyping is
the task a computer-use model is built for. The safe design: the AI drafts the entry, and a person checks it
before saving (human handoff).

Why this fits: no API means Zapier/n8n can't connect directly. Computer use is the "last resort" integration.
It's slower and less reliable than an API, so it needs a human check and error handling.

## What I could build/test on screen (next video, "I tested it")

1. A demo clinic intake form (a local HTML page) with name, date of birth, phone, reason for visit, and preferred slot.
2. Give GPT-6.1 Terra a sample patient email (fake data) and ask it to fill and submit the form.
3. Record: time per run, cost per run (tokens × price), and which fields it got wrong.
4. Break it on purpose: ambiguous date format (03/04), a missing phone number, a CAPTCHA.
5. Show the fix: validation and a human-approval step before submit.

**This video makes no test claims.** It's the explainer. The test is the follow-up.

---

## Script v2 (2026-11-03): owner-first teardown rewrite

The script was rewritten to the owner-first 7-scene structure (see brainstorms/2026-11-02-video-scripts.md).
Claims now in the voiceover:

| Claim | Status | Source |
|---|---|---|
| OpenAI just released GPT-6.1 Terra | Confirmed, Oct 26, 2026 (8 days old; inside the 14-day teardown window until ~Nov 9) | OpenAI announcement |
| It can use a computer and fill in forms | Confirmed ("precise computer use"; "filling out forms" listed as a workday task) | OpenAI announcement |
| Fourteen new patient emails / hours every week / one typo = wrong record | **Demo scenario**, labelled DEMO on screen | — |
| AI types it in, front desk checks before saving | Design of the fix (human approval step) | — |

Dropped from the voiceover (builder detail): $1/$5 per million tokens, "3× faster", and "not their smartest model".
