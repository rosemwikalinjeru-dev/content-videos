import type { TeardownSpec } from "./types";

// Beat words must appear in that scene's voiceover text (scenes/<id>.txt).
// Matching ignores case and punctuation ("A-I" matches "ai").

export const SPECS: TeardownSpec[] = [
  {
    id: "gpt61-terra",
    compositionId: "Gpt61Terra",
    business: "DENTAL PRACTICE",
    moment: { clip: "assets/moments/gpt61-terra.mp4", label: "Monday · 8:00 AM" },
    before: {
      customer: "Sarah",
      nodes: [
        { label: "Patient emails", sub: "14 this morning", kind: "normal" },
        { label: "Front desk retypes it", sub: "by hand, every one", kind: "bad", beat: "retyped" },
        { label: "Old booking system", sub: "can't connect to anything", kind: "outcome", beat: "old" },
      ],
    },
    cost: {
      lines: [
        { text: "Hours every week", color: "ink" },
        { text: "1 typo = wrong patient record", color: "bad", beat: "typo" },
      ],
    },
    newThing: {
      kicker: "NEW · OPENAI",
      title: "GPT-6.1 Terra",
      sub: "Uses a computer. Fills in forms.",
      source: "OpenAI announcement, Oct 26, 2026",
      isNews: true,
    },
    after: {
      customer: "Sarah",
      nodes: [
        { label: "Patient emails", kind: "normal", beat: "email" },
        { label: "AI types it in", sub: "into the old system", kind: "ai", beat: "types" },
        { label: "Front desk checks", sub: "a person approves", kind: "human", beat: "checks" },
        { label: "Saved", kind: "done", beat: "saves" },
      ],
    },
    verdict: {
      lines: [
        { text: "Worth testing.", color: "ok", beat: "testing" },
        { text: "Not alone.", color: "bad", beat: "trusting" },
        { text: "Keep a person on the final click.", color: "muted", beat: "keep" },
      ],
    },
  },
  {
    id: "apple-numbers-mcp",
    compositionId: "AppleNumbersMcp",
    business: "MARKETING AGENCY",
    moment: { clip: "assets/moments/apple-numbers-mcp.mp4", label: "Friday · 4:00 PM" },
    before: {
      customer: "Dave's report",
      nodes: [
        { label: "Numbers in one app", kind: "normal", beat: "copy" },
        { label: "Copy, paste, fix by hand", sub: "every Friday", kind: "bad", beat: "paste" },
        { label: "Spreadsheet report", sub: "one wrong cell → client", kind: "outcome", beat: "spreadsheet" },
      ],
    },
    cost: {
      lines: [
        { text: "Every Friday afternoon", color: "ink" },
        { text: "1 wrong cell → your client", color: "bad", beat: "wrong" },
      ],
    },
    newThing: {
      kicker: "NEW · APPLE · BETA",
      title: "Numbers + outside AI",
      sub: "Reads & edits your spreadsheets · Mac only (MCP)",
      source: "Apple Newsroom, Oct 27, 2026",
      isNews: true,
    },
    after: {
      customer: "Dave's report",
      nodes: [
        { label: "AI pulls this week's numbers", kind: "ai", beat: "pulls" },
        { label: "Fills in the report", sub: "in Numbers", kind: "ai", beat: "fills" },
        { label: "You check it", sub: "a person approves", kind: "human", beat: "check" },
        { label: "Sent to Dave", kind: "done", beat: "sent" },
      ],
    },
    verdict: {
      lines: [
        { text: "Promising.", color: "ok", beat: "promising" },
        { text: "Mac only. Brand new.", color: "accent", beat: "mac" },
        { text: "Test it on one report first.", color: "muted", beat: "test" },
      ],
    },
  },
  {
    id: "missed-calls",
    compositionId: "MissedCalls",
    business: "PLUMBING COMPANY",
    moment: { clip: "assets/moments/missed-calls.mp4", label: "Tuesday · 2:00 PM" },
    before: {
      customer: "Mike",
      nodes: [
        { label: "Mike calls", kind: "normal" },
        { label: "Nobody answers", sub: "your plumber's on a job", kind: "bad", beat: "answers" },
        { label: "Calls the next plumber", sub: "job gone", kind: "outcome", beat: "next" },
      ],
    },
    cost: {
      lines: [
        { text: "3 missed calls a week", color: "ink" },
        { text: "= 3 jobs gone", color: "bad", beat: "jobs" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "Missed call → text in 1 minute",
      sub: "No new tech needed",
      isNews: false,
    },
    after: {
      customer: "Mike",
      nodes: [
        { label: "Missed call", kind: "normal" },
        { label: "Text + booking link", sub: "sent automatically", kind: "ai", beat: "text" },
        { label: "Mike picks a time", kind: "normal", beat: "picks" },
        { label: "Office calls to confirm", sub: "a person closes it", kind: "human", beat: "confirm" },
      ],
    },
    verdict: {
      lines: [
        { text: "Do this one now.", color: "ok", beat: "now" },
        { text: "It saves jobs you already paid to win.", color: "muted", beat: "saves" },
      ],
    },
  },
  {
    id: "no-shows",
    compositionId: "NoShows",
    business: "MED SPA",
    moment: { clip: "assets/moments/no-shows.mp4", label: "Thursday · 10:00 AM" },
    before: {
      customer: "Jess",
      nodes: [
        { label: "Jess books", sub: "two weeks out", kind: "normal", beat: "booked" },
        { label: "No reminder", kind: "bad", beat: "reminded" },
        { label: "Empty chair", sub: "no-show", kind: "outcome", beat: "chair" },
      ],
    },
    cost: {
      lines: [
        { text: "2 no-shows a week", color: "ink" },
        { text: "= 2 slots you can't resell", color: "bad", beat: "slots" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "A reminder that asks for a reply",
      sub: "Not just a reminder",
      isNews: false,
    },
    after: {
      customer: "Jess",
      nodes: [
        { label: "Reminder text, day before", sub: "sent automatically", kind: "ai", beat: "text" },
        { label: "Jess replies yes", sub: "or picks a new time", kind: "normal", beat: "replies" },
        { label: "No reply? Front desk calls", sub: "a person follows up", kind: "human", beat: "reply" },
      ],
    },
    verdict: {
      lines: [
        { text: "Do this first.", color: "ok", beat: "do" },
        { text: "Before any fancy AI.", color: "muted", beat: "fancy" },
      ],
    },
  },
  {
    id: "slow-quotes",
    compositionId: "SlowQuotes",
    business: "HOME REMODELER",
    moment: { clip: "assets/moments/slow-quotes.mp4", label: "Sunday · 9:41 PM" },
    before: {
      customer: "Lisa",
      nodes: [
        { label: "Quote form", sub: "Sunday night", kind: "normal" },
        { label: "Inbox until Tuesday", sub: "nobody checks", kind: "bad", beat: "inbox" },
        { label: "Lisa hires someone else", kind: "outcome", beat: "hired" },
      ],
    },
    cost: {
      lines: [
        { text: "Every slow reply", color: "ink" },
        { text: "= a quote you never sent", color: "bad", beat: "quote" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "Reply in minutes, not days",
      sub: "Even when you're off",
      isNews: false,
    },
    after: {
      customer: "Lisa",
      nodes: [
        { label: "Instant reply", sub: "+ 3 quick questions", kind: "ai", beat: "reply" },
        { label: "Saved to your customer list", kind: "normal", beat: "customer" },
        { label: "Real job? You get a text", sub: "you make the call", kind: "human", beat: "real" },
      ],
    },
    verdict: {
      lines: [
        { text: "Worth doing.", color: "ok", beat: "worth" },
        { text: "Real person on the first call.", color: "muted", beat: "person" },
      ],
    },
  },
  {
    id: "ai-receptionist-permissions",
    compositionId: "AiReceptionistPermissions",
    business: "MED SPA",
    moment: { clip: "assets/moments/ai-receptionist-permissions.mp4", label: "Your AI receptionist" },
    before: {
      customer: "Jess",
      nodes: [
        { label: "Client asks for a refund", sub: "Saturday night, by text", kind: "normal", beat: "texts" },
        { label: "AI has full access", sub: "calendar, payments, everything", kind: "bad", tag: "FULL ACCESS", beat: "access" },
        { label: "It says yes", sub: "refund promised", kind: "outcome", beat: "yes" },
      ],
    },
    cost: {
      tag: "DEMO SCENARIO",
      lines: [
        { text: "A promise nobody approved", color: "ink" },
        { text: "In your front desk's voice", color: "bad", beat: "sounded" },
      ],
    },
    newThing: {
      kicker: "PROOF · UK AI SECURITY INSTITUTE",
      title: "Agents went past their limits",
      sub: "To finish the task. Nobody hacked them. (Cyber test · safety filters off · no harm found)",
      source: "AISI incident report, Aug 4, 2026",
      isNews: true,
    },
    after: {
      customer: "Jess",
      nodes: [
        { label: "Reads your calendar", sub: "sees open times", kind: "read", beat: "read" },
        { label: "Writes tentative holds", sub: "nothing else", kind: "limited", tag: "TENTATIVE ONLY", beat: "tentative" },
        { label: "Refunds & clinical questions", sub: "never the AI's call", kind: "handoff", beat: "refunds" },
        { label: "A person decides", sub: "front desk or provider", kind: "done", beat: "person" },
      ],
    },
    verdict: {
      lines: [
        { text: "Not the keys.", color: "bad", beat: "keys" },
        { text: "A job description.", color: "ok", beat: "job" },
      ],
    },
  },
  {
    id: "ai-receptionist-refunds",
    compositionId: "AiReceptionistRefunds",
    business: "MED SPA",
    moment: { clip: "assets/moments/ai-receptionist-refunds.mp4", label: "Sunday · 9:40 AM" },
    before: {
      customer: "Jess",
      nodes: [
        { label: "Jess asks for a refund", kind: "normal", beat: "asked" },
        { label: "AI guesses the policy", sub: "it doesn't know it", kind: "bad", beat: "guessed" },
        { label: "Full refund promised", sub: "nobody approved it", kind: "outcome", beat: "yes" },
      ],
    },
    cost: {
      tag: "DEMO SCENARIO",
      lines: [
        { text: "A refund nobody approved", color: "ink" },
        { text: "Monday: take it back", color: "bad", beat: "promise" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "Money is never the AI's call",
      sub: "One rule. No exceptions.",
      isNews: false,
    },
    after: {
      customer: "Jess",
      nodes: [
        { label: "Jess asks for a refund", kind: "normal", beat: "refund" },
        { label: "AI: \"A person will reply\"", sub: "+ summary to front desk", kind: "handoff", beat: "summary" },
        { label: "Front desk decides", kind: "human", beat: "decide" },
        { label: "Jess hears back", kind: "done", beat: "hears" },
      ],
    },
    verdict: {
      lines: [
        { text: "Let it book.", color: "ok", beat: "book" },
        { text: "Keep refunds human.", color: "accent", beat: "refunds" },
      ],
    },
  },
  {
    id: "ai-receptionist-clinical",
    compositionId: "AiReceptionistClinical",
    business: "MED SPA",
    moment: { clip: "assets/moments/ai-receptionist-clinical.mp4", label: "10:03 PM · after hours" },
    before: {
      customer: "Maya",
      nodes: [
        { label: "Clinical question", sub: "\"Is this safe with my medication?\"", kind: "normal" },
        { label: "AI answers alone", sub: "fast and confident", kind: "bad", beat: "answers" },
        { label: "No licensed eyes", sub: "your name on it", kind: "outcome", beat: "license" },
      ],
    },
    cost: {
      tag: "DEMO SCENARIO",
      lines: [
        { text: "Not a wrong booking", color: "ink" },
        { text: "Medical advice, your name on it", color: "bad", beat: "medical" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "Clinical → a provider",
      sub: "A hard line. Every time.",
      isNews: false,
    },
    after: {
      customer: "Maya",
      nodes: [
        { label: "Maya's question", kind: "normal", beat: "question" },
        { label: "AI spots it's clinical", sub: "and doesn't answer it", kind: "ai", beat: "clinical" },
        { label: "Flagged for a provider", sub: "\"A provider will reply\"", kind: "handoff", beat: "flags" },
        { label: "Provider answers", sub: "in the morning", kind: "done", beat: "morning" },
      ],
    },
    verdict: {
      lines: [
        { text: "It can book.", color: "ok", beat: "book" },
        { text: "It never gives the answer.", color: "bad", beat: "never" },
      ],
    },
  },
  {
    id: "review-requests",
    compositionId: "ReviewRequests",
    business: "HVAC COMPANY",
    moment: { clip: "assets/moments/review-requests.mp4", label: "Friday · 5:00 PM" },
    before: {
      customer: "Tom",
      nodes: [
        { label: "Job done, Tom's happy", sub: "AC fixed", kind: "normal" },
        { label: "Nobody asks for a review", kind: "bad", beat: "asks" },
        { label: "Newest review: March", sub: "Tom forgot by dinner", kind: "outcome", beat: "march" },
      ],
    },
    cost: {
      tag: "DEMO SCENARIO",
      lines: [
        { text: "Your next customer reads these", color: "ink" },
        { text: "before they ever call you", color: "bad", beat: "before" },
      ],
    },
    newThing: {
      kicker: "THE RULE · GOOGLE REVIEW POLICY",
      title: "Careful when you automate it",
      rule: { dont: "Only ask the happy customers", do: "Ask everyone the same way" },
      source: "Google review policy: \"fake engagement\"",
      isNews: false,
    },
    after: {
      customer: "Tom",
      layout: "branch",
      edgeLabels: ["EVERYONE", "LOW SCORE: ALSO"],
      nodes: [
        { label: "Job done", sub: "wait 1 hour", kind: "normal", beat: "hour" },
        { label: "One text to Tom", sub: "same text for every customer", kind: "ai", beat: "text" },
        { label: "Review link", sub: "goes to everyone", kind: "done", beat: "everyone" },
        { label: "Went badly? Office calls", sub: "on top of the link", kind: "human", beat: "badly" },
      ],
    },
    verdict: {
      clip: "assets/fix-demos/review-sms.mp4",
      lines: [
        { text: "Ask everyone.", color: "ok", beat: "ask" },
        { text: "Fix the unhappy ones yourself.", color: "accent", beat: "fix" },
      ],
    },
  },
  {
    id: "estimate-follow-up",
    compositionId: "EstimateFollowUp",
    business: "ROOFING COMPANY",
    moment: { clip: "assets/moments/estimate-follow-up.mp4", label: "Monday · 8:00 AM" },
    before: {
      customer: "Dana",
      nodes: [
        { label: "9 estimates sent", sub: "last week", kind: "normal" },
        { label: "7 sitting in inboxes", sub: "no reply", kind: "outcome", beat: "sitting" },
        { label: "Nobody follows up", sub: "everyone's on a roof", kind: "bad", beat: "follows" },
      ],
    },
    cost: {
      tag: "DEMO NUMBERS",
      lines: [
        { text: "Hours on every estimate", color: "ink" },
        { text: "Most quietly expire", color: "bad", beat: "expire" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "Follow-ups that run on their own",
      clip: "assets/fix-demos/estimate-sequence.mp4",
      isNews: false,
    },
    after: {
      customer: "Dana",
      layout: "timeline",
      railLabel: "DAY 0 · ESTIMATE SENT",
      nodes: [
        { label: "Quick check-in", sub: "any questions?", kind: "ai", tag: "DAY 2", beat: "two" },
        { label: "Photos of a similar roof", kind: "ai", tag: "DAY 5", beat: "five" },
        { label: "One last nudge", sub: "want to lock in a date?", kind: "ai", tag: "DAY 10", beat: "ten" },
        { label: "Dana replies → to you", sub: "the sequence stops", kind: "done", tag: "REPLY", beat: "replies" },
      ],
    },
    verdict: {
      lines: [
        { text: "Worth it this week.", color: "ok", beat: "worth" },
        { text: "You already did the hard part.", color: "muted", beat: "hard" },
      ],
    },
  },
  {
    id: "tech-handoff",
    compositionId: "TechHandoff",
    business: "PLUMBING COMPANY",
    moment: { clip: "assets/moments/tech-handoff.mp4", label: "Wednesday · 9:00 AM" },
    before: {
      customer: "Sam",
      nodes: [
        { label: "Gate code: in an email", kind: "normal", beat: "gate" },
        { label: "Photos: in someone's texts", kind: "normal", beat: "photos" },
        { label: "Office: on another call", sub: "your plumber waits", kind: "bad", tag: "SCATTERED", beat: "office" },
      ],
    },
    cost: {
      tag: "DEMO NUMBERS",
      lines: [
        { text: "20 minutes in the truck", color: "ink" },
        { text: "on a job you're paying for", color: "bad", beat: "paying" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "One job card, filled at booking",
      clip: "assets/fix-demos/job-card.mp4",
      isNews: false,
    },
    after: {
      customer: "Priya",
      layout: "swimlane",
      lanes: ["CUSTOMER", "SYSTEM", "OFFICE", "PLUMBER"],
      nodes: [
        { label: "Priya books online", kind: "normal", beat: "books" },
        { label: "One job card", sub: "address · gate code · photos", kind: "ai", beat: "card" },
        { label: "Office checks it", kind: "human", beat: "checks" },
        { label: "On the plumber's phone", sub: "before he leaves", kind: "done", beat: "plumber's" },
      ],
    },
    verdict: {
      lines: [
        { text: "Start working.", color: "ok", beat: "working" },
        { text: "Not start calling.", color: "bad", beat: "calling" },
      ],
    },
  },
];
