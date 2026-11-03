# CLAUDE.md — Rose Njeru Automation · Video Studio

This project produces my videos on **trending AI and automation topics** for TikTok, Instagram Reels,
YouTube Shorts, and long-form YouTube.
Stack: **Remotion** (React video) + **ElevenLabs voice clone** for voiceover + screen recordings.
No Premiere, no After Effects. Everything is code.

## The angle

Plenty of accounts report AI news. My videos **test it and translate it**:
what dropped → what it actually does (shown on screen) → what it means for a real business.

Every video should make the viewer think:
**"She actually tried it, and she knows where it's useful."**

I'm a builder, not a hype account. No "this changes EVERYTHING", no "RIP [job]", and no claims
I haven't checked.

---

## Commands

```bash
node generate-voiceover.mjs scenes/<video>.txt                       # generate changed scenes only
node generate-voiceover.mjs scenes/<video>.txt --only hook --force   # redo one take
npx remotion studio                                                  # preview
npx remotion render <CompositionId> out/<video>.mp4                  # render
node scripts/build-scenes.mjs scenes/<video>.txt                     # refresh script text for Remotion (no credits)
node scripts/check-beats.mjs                                         # every flow box lands on a spoken word
```

- Teardown template: `src/videos/teardown/` (one spec per video in `specs.ts`).
- Owner's-moment phone clips: HyperFrames project `hyperframes/owner-moment/`, one row per video in
  `moments.json`, rendered to `public/assets/moments/<video>.mp4` with `--variables`.

- Voice ID: `B7ZAlMIzX6c9jwjYTxMd` (my clone; it's the default in the script)
- API key: `ELEVENLABS_API_KEY` in `.env`

## Folder structure

```
research/         one .md per video: trend, sources, verified facts (made before the script)
scenes/           one .txt script per video (source of truth for voiceover)
public/voiceover/ generated mp3 + captions json + manifest.json (do not hand-edit)
public/recordings/ my screen recordings
public/assets/    logos, diagrams, images
src/              Remotion compositions and components
out/              rendered videos (gitignored)
```

---

## Pipeline for every video

1. **Find the trend.** When I ask for ideas, search the web for AI and automation news from the
   **last 7 days**: model and tool releases, new agent and MCP features, n8n/Make/Zapier updates,
   viral demos, big announcements. Give me 5 topics, ranked, each with one line on why it's
   trending and the business angle.
2. **Verify.** For the topic I pick, write `research/<video>.md` with:
   - what happened, when, and who announced it
   - links to **primary sources** (official blog, docs, changelog), not only commentary
   - what's confirmed vs. rumoured
   - what I could build or test on screen to show it
3. **Script.** Write `scenes/<video>.txt`. Wait for my approval.
4. **Voiceover.** Run the generator only after I approve the script.
5. **Visuals.** Build the Remotion composition around my recordings and the manifest.
6. **Render**, then report the file path, the duration, and the credits used.

---

## Hard rules

1. **Never read, print, log, or commit `.env` or any API key.** If a key shows up in output,
   chat, or a file, stop and tell me to rotate it.
2. **Nothing goes in a script without a source in `research/`.** No invented features, numbers,
   benchmarks, prices, or quotes. If it's unconfirmed, the script says so ("reportedly", "early reports").
3. **Check the date.** Pure news videos need the news to be under ~7 days old. Business teardowns
   (news is the fix, not the headline) can use news up to **14 days** old. Evergreen teardowns have
   no news claim, so no limit. If something's older, tell me and suggest a fresher angle.
4. **Script first, audio second, visuals third.** Every ElevenLabs generation costs credits.
5. **Never use `--force` on the whole script without asking.** Regenerate only the scenes that changed.
6. **Never hand-edit files in `public/voiceover/`.** Change the scene text and regenerate.
7. Scene durations come from `manifest.json`. Never hardcode frame counts for voiceover scenes.
8. If ElevenLabs errors, show me the status code and message. Don't retry in a loop.
9. No real people's faces, no copyrighted clips, no company logos used in a way that implies an
   endorsement. Product names in the voiceover and in text are fine.

---

## Video formats (pick one per trend)

| Format | What it is | Length |
|---|---|---|
| **I tested it** | New tool or feature, tried live on screen, verdict at the end | 30–60s |
| **What it means for businesses** | The trend, then 1 concrete use for a real business (clinic, agency, home services...) | 30–60s |
| **Hype check** | A viral claim vs. what actually happens when you try it | 30–45s |
| **Build it with the new thing** | Use the new release to build a small working automation | Long-form 8–15 min, cut into 3–5 shorts |
| **What broke** | The new tool failed: the error, why, the fix | 30–60s |

Default to **I tested it**. Showing it working beats explaining it.

## Who short-form is for (decided 2026-11-03, see brainstorms/2026-11-02-video-scripts.md)

- **Short-form = US/UK service business owners.** Long-form "Build it" = automation builders.
- **US default** for wording, currency and spelling ("front desk", "appointment", "$", "organize").
- Builder detail (tokens, benchmarks, model comparisons, "API", "workflow", "integration") goes in
  **on-screen text only**, never in the voiceover. Owner vocabulary only ("the system", "your customer list").
- Goal of every short: **traffic to my pages**. Clear, understandable, relatable, business-worthy.

## Short-form structure (owner-first teardown, 35–45s)

Before → After, told through **one named demo customer**. The owner's moment comes first, and the news is the fix.

| # | Scene id | What | Length |
|---|---|---|---|
| 1 | `moment` | Owner's moment: time of day + situation ("It's Monday, 8am…") | 3–5s |
| 2 | `before` | Broken flow. **One red box** = the bottleneck | 6–8s |
| 3 | `cost` | Cost in owner terms (hours, lost job, wrong record), with **demo numbers labelled DEMO** | 3–5s |
| 4 | `new` | The new thing (news + source card) or the fix (evergreen) | 5–7s |
| 5 | `after` | Fixed flow: where automation goes, **where a person checks** | 8–10s |
| 6 | `verdict` | Honest verdict in one line | 4–6s |
| 7 | `cta` | "Follow. I fix one business process like this every week." | ~3s |

Flow diagrams: **max 4 boxes**, each box appears on the spoken word (`beat` in
`src/videos/teardown/specs.ts`), and the customer chip travels box to box. Run
`node scripts/check-beats.mjs` after editing a script or spec.

CTA: series follow by default ("Can I Automate This Business?" on screen). Use a comment keyword only
when a real asset exists. Never promise "next I'm testing X" unless it's scheduled.

---

## Writing scene scripts (`scenes/*.txt`)

Format:
```
# scene-id            ← add "| v3" for expressive hooks with [tags]
Text for this scene.
```

Write for the ear:
- Short sentences. One idea per scene. A scene runs 4–12 seconds.
- Commas where I'd breathe. "..." where I'd pause.
- Spell out what the voice would mispronounce:

| Write | Not |
|---|---|
| en-eight-en | n8n |
| M-C-P | MCP |
| A-P-I | API |
| C-R-M | CRM |
| L-L-M | LLM |
| G-P-T five | GPT-5 |
| Claude Opus five point five | Claude Opus 5.5 |
| two hundred dollars | $200 |

- Version numbers and model names: write them out the way they're said. When in doubt, say it in full.
- Hooks use **v2 by default**. Use `| v3` only when a hook needs real emotion. Tags: `[excited]`, `[pause]`,
  `[laughs softly]`, `[whispers]`.
- If a v3 scene fails on timestamps, switch it to v2.
- **Never "..." and `[pause]` together.** Max one "..." per scene, and none in the first 3 seconds.
- First spoken words = the owner's moment. No "So," or "Hey guys".
- **Max ~15 words per scene** (~5s). Split or cut anything over 8s. Read it out loud before generating.

## Voice settings (already in the script)

- v2: stability 0.45, similarity 0.8, style 0.05, speaker boost on
- v3: stability 0.5, similarity 0.8, style 0.05
- Only change these if I say the voice sounds off. Change one value at a time.

---

## Visual specs

| Platform | Size | FPS |
|---|---|---|
| TikTok / Reels / Shorts | 1080×1920 | 30 |
| YouTube long-form | 1920×1080 | 30 |
| LinkedIn | 1080×1350 or 1080×1920 | 30 |

- Vertical safe zone: nothing important in the bottom 250px or the right 120px.
- Captions always on: word-by-word, 4 words per chunk, active word `#FFD84D`, bold, high contrast.
- Put a **source card** on screen when stating news ("Source: OpenAI blog, Oct 30").
- **Industry images in every teardown:** set `industry` in the spec (roofing, hvac, plumbing, dental, medspa,
  salon, law, landscaping, cleaning, bookkeeping, agency, remodeling). The original illustration appears in the
  moment, cost (red "!"), fix and verdict (green ✓) scenes. They're drawn in `src/components/industry/IndustryArt.tsx`:
  faceless figures, no stock photos, no real faces. Add a new industry scene there when a video needs one.
- On-screen text is readable on a phone without zooming, one idea per card, and scannable in under 10 seconds.

---

## Honesty and platform rules

- Videos with my cloned voice get the **AI-generated content label** on TikTok and Instagram.
- Never script my clone saying something I haven't approved, and never use it to imitate anyone else.
- Never invent results. Demo businesses are labelled as demos.

## How to work with me

- Be decisive. Rank the topics and recommend one.
- Hand me the asset first, then a short explanation.
- Push back if a trend is pure hype with nothing to show on screen, or if I'm only reposting news
  with no test, build, or business translation.
