# Batch 4: 6 different ideas — research

**Videos:** `dental-recall`, `ad-leads`, `invoice-chasing`, `law-intake`, `salon-waitlist`, `bookkeeper-onboarding`
**Format:** evergreen "Can I Automate This Business?" teardowns (owner-first, 7 scenes).
**Researched:** 2026-11-03

**No external facts, statistics or news are claimed in any of these 6 scripts.** Every number, name and business is a
demo scenario and is labelled DEMO on screen. The only product name is "Facebook" (ad form), used descriptively.

| Video | Business | After diagram | HyperFrames demo (planned) |
|---|---|---|---|
| dental-recall | Dental practice | TIMELINE (month 6 → month 7 → front desk call) | Recall text with open times + "book" tap |
| ad-leads | Landscaping company | BRANCH (ready → owner alert / just looking → photos) | Lead form → instant text with 3 questions |
| invoice-chasing | Commercial cleaning company | FLOW (heads-up → pay link → owner calls) | Invoice with status chips → "Paid" |
| law-intake | Law firm | SWIMLANE (Caller · Assistant · Intake team · Attorney) | Weekend intake note filling in |
| salon-waitlist | Hair salon | BRANCH (first yes → booked / no replies → front desk) | Waitlist broadcast, first reply wins |
| bookkeeper-onboarding | Bookkeeping firm | FLOW (one link → upload → reminder → complete) | Document checklist with progress bar |

## Demo claims per video

**dental-recall:** three empty hygiene slots and "hundreds" of overdue patients (demo). The six-month recall cadence is a
common practice convention, not a clinical recommendation. The video doesn't say how often anyone *should* get a cleaning.

**ad-leads:** a lead form at 7pm, seen two days later, and the customer hired someone else (demo story). "Reply in the first
few minutes" is a design choice. **No speed-to-lead statistics** are claimed.

**invoice-chasing:** job finished three weeks ago, still unpaid (demo). Reminders at −3 days, on the due date and +7 days are a design choice.
The owner calls personally when it's overdue (human handoff).

**law-intake:** six missed weekend calls (demo).
- ★ Design guardrail stated in the script: the assistant **collects details and never gives legal advice**.
- ⚠ Compliance notes for any real build (not claimed in the video): call-recording consent rules vary by US
  state (some require all-party consent); intake data may be confidential; check the state bar's guidance on
  AI and client intake. Keep it to message-taking plus a human attorney callback.

**salon-waitlist:** a 2pm cancellation and five people asking for that slot (demo). "First yes gets the slot" is a design choice, and
no replies goes to the front desk.

**bookkeeper-onboarding:** new client two weeks in, no bank statements, six emails sent (demo). One checklist link,
item-specific reminders, and a ping when complete are a design choice.
⚠ For a real build: financial documents need a secure upload, not email attachments.
