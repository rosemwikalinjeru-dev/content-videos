# Weekend quote requests sit in the inbox — research

**Video:** `slow-quotes` · **Format:** evergreen "Can I Automate This Business?" teardown (no news claim)
**Researched:** 2026-11-03

## Claims in the script

| Claim | Type | Note |
|---|---|---|
| Sunday-night quote form sits until Tuesday, and the homeowner hires someone else | Demo story | Labelled DEMO. Customer "Lisa" is fictional. The business is a home remodeler. |
| "Every slow reply is a quote you never got to send" | Reasoning | Not a statistic. |
| Instant reply with three quick questions → answers saved to the customer list → owner gets a text if it's a real job | Design of the fix | Form → auto-reply → CRM → SMS alert. No product named. The voiceover says "customer list", not "CRM" (owner vocabulary). |
| "Keep a real person on the first phone call" | Opinion (Rose's verdict) | Human handoff. |

## No industry statistics used

No "responding in 5 minutes makes you X times more likely…" claims. That stat circulates widely, but I don't have a primary source for it here.

## Build/test idea

A web form webhook → n8n/Make → instant email/SMS reply with 3 qualifying questions → write to a CRM or sheet → SMS the owner when the answers match "real job" rules.
