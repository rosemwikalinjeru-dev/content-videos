import type { TeardownSpec } from "./types";

// Beat words must appear in that scene's voiceover text (scenes/<id>.txt).
// Matching ignores case and punctuation ("A-I" matches "ai").

export const SPECS: TeardownSpec[] = [
  {
    id: "gpt61-terra",
    episode: 1,
    industry: "dental",
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
    episode: 3,
    industry: "agency",
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
    episode: 2,
    industry: "plumbing",
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
    episode: 4,
    industry: "medspa",
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
    episode: 5,
    industry: "remodeling",
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
    episode: 6,
    industry: "medspa",
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
    episode: 7,
    industry: "medspa",
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
    episode: 8,
    industry: "medspa",
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
    episode: 9,
    industry: "hvac",
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
      clipSeconds: 5.2,
      lines: [
        { text: "Ask everyone.", color: "ok", beat: "ask" },
        { text: "Fix the unhappy ones yourself.", color: "accent", beat: "fix" },
      ],
    },
  },
  {
    id: "estimate-follow-up",
    episode: 10,
    industry: "roofing",
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
      clipSeconds: 6.8,
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
    episode: 11,
    industry: "plumbing",
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
      clipSeconds: 4.4,
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
  {
    id: "dental-recall",
    episode: 12,
    industry: "dental",
    compositionId: "DentalRecall",
    business: "DENTAL PRACTICE",
    moment: { clip: "assets/moments/dental-recall.mp4", label: "Tuesday · 2:15 PM" },
    before: {
      customer: "Maria",
      nodes: [
        { label: "Patient due for a cleaning", kind: "normal" },
        { label: "Nobody reminds them", kind: "bad", beat: "reminds" },
        { label: "They drift away", sub: "life got busy", kind: "outcome", beat: "drifted" },
      ],
    },
    cost: {
      tag: "DEMO SCENARIO",
      lines: [
        { text: "Empty hygiene slots", color: "ink" },
        { text: "= time you already paid for", color: "bad", beat: "paid" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "A recall schedule that stops when they book",
      clip: "assets/fix-demos/recall-thread.mp4",
      clipSeconds: 4.0,
      isNews: false,
    },
    after: {
      customer: "Maria",
      layout: "timeline",
      railLabel: "LAST CLEANING",
      nodes: [
        { label: "Text with open times", kind: "ai", tag: "MONTH 6", beat: "six" },
        { label: "A friendly nudge", kind: "ai", tag: "MONTH 7", beat: "later" },
        { label: "Front desk calls", sub: "still no booking", kind: "human", tag: "STILL NOTHING", beat: "nothing" },
      ],
    },
    verdict: {
      lines: [
        { text: "Your best new patients", color: "ok", beat: "best" },
        { text: "are the ones you already have.", color: "muted", beat: "already" },
      ],
    },
  },
  {
    id: "ad-leads",
    episode: 13,
    industry: "landscaping",
    compositionId: "AdLeads",
    business: "LANDSCAPING COMPANY",
    moment: { clip: "assets/moments/ad-leads.mp4", label: "7:02 PM · ad form" },
    before: {
      customer: "Nina",
      nodes: [
        { label: "Ad form at 7 PM", kind: "normal" },
        { label: "Lands in a spreadsheet", kind: "bad", beat: "spreadsheet" },
        { label: "Seen 2 days later", kind: "normal", beat: "days" },
        { label: "She hires someone else", kind: "outcome", beat: "hired" },
      ],
    },
    cost: {
      tag: "DEMO SCENARIO",
      lines: [
        { text: "You paid for that lead", color: "ink" },
        { text: "then let it go cold", color: "bad", beat: "cold" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "Reply in minutes, ask the right questions",
      clip: "assets/fix-demos/lead-thread.mp4",
      clipSeconds: 4.0,
      isNews: false,
    },
    after: {
      customer: "Nina",
      layout: "branch",
      edgeLabels: ["READY", "JUST LOOKING"],
      nodes: [
        { label: "Ad form", sub: "7 PM", kind: "normal" },
        { label: "Instant text", sub: "3 quick questions", kind: "ai", beat: "text" },
        { label: "You get an alert", sub: "call her today", kind: "human", beat: "ready" },
        { label: "Project photos", sub: "check in later", kind: "ai", beat: "looking" },
      ],
    },
    verdict: {
      lines: [
        { text: "Speed wins the job.", color: "ok", beat: "speed" },
        { text: "You still make the call.", color: "accent", beat: "still" },
      ],
    },
  },
  {
    id: "invoice-chasing",
    episode: 14,
    industry: "cleaning",
    compositionId: "InvoiceChasing",
    business: "COMMERCIAL CLEANING",
    moment: { clip: "assets/moments/invoice-chasing.mp4", label: "End of the month" },
    before: {
      customer: "Dan",
      nodes: [
        { label: "Job finished", sub: "3 weeks ago", kind: "normal" },
        { label: "Invoice sent once", kind: "normal", beat: "invoice" },
        { label: "Nobody follows up", sub: "asking feels awkward", kind: "bad", beat: "followed" },
      ],
    },
    cost: {
      tag: "DEMO SCENARIO",
      lines: [
        { text: "Your crew got paid.", color: "ink" },
        { text: "You didn't.", color: "bad", beat: "didn't" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "Polite reminders, a pay link every time",
      clip: "assets/fix-demos/invoice-thread.mp4",
      clipSeconds: 4.0,
      isNews: false,
    },
    after: {
      customer: "Dan",
      nodes: [
        { label: "Friendly heads-up", sub: "3 days before it's due", kind: "ai", beat: "before" },
        { label: "Pay link", sub: "on the due date", kind: "ai", beat: "link" },
        { label: "A week late? You call", sub: "personally", kind: "human", beat: "late" },
      ],
    },
    verdict: {
      lines: [
        { text: "Automate the reminder.", color: "ok", beat: "automate" },
        { text: "Keep the hard talk human.", color: "accent", beat: "hard" },
      ],
    },
  },
  {
    id: "law-intake",
    episode: 15,
    industry: "law",
    compositionId: "LawIntake",
    business: "LAW FIRM",
    moment: { clip: "assets/moments/law-intake.mp4", label: "Monday · 8:00 AM" },
    before: {
      customer: "Carlos",
      nodes: [
        { label: "6 weekend calls", kind: "normal" },
        { label: "Few voicemails", sub: "most hang up", kind: "normal", beat: "voicemails" },
        { label: "Never written down", kind: "bad", beat: "written" },
      ],
    },
    cost: {
      tag: "DEMO SCENARIO",
      lines: [
        { text: "Every missed call", color: "ink" },
        { text: "was someone who needed a lawyer", color: "bad", beat: "needed" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "Takes the details, never gives advice",
      clip: "assets/fix-demos/intake-note.mp4",
      clipSeconds: 4.0,
      isNews: false,
    },
    after: {
      customer: "Carlos",
      layout: "swimlane",
      lanes: ["CALLER", "ASSISTANT", "INTAKE TEAM", "ATTORNEY"],
      nodes: [
        { label: "Carlos calls Saturday", kind: "normal", beat: "calls" },
        { label: "Takes the details", sub: "name · number · what happened", kind: "ai", tag: "NO ADVICE", beat: "takes" },
        { label: "Intake team reviews", sub: "Monday", kind: "human", beat: "reviews" },
        { label: "Attorney calls back", kind: "done", beat: "attorney" },
      ],
    },
    verdict: {
      lines: [
        { text: "Let it take the message.", color: "ok", beat: "message" },
        { text: "Never the advice.", color: "bad", beat: "never" },
      ],
    },
  },
  {
    id: "salon-waitlist",
    episode: 16,
    industry: "salon",
    compositionId: "SalonWaitlist",
    business: "HAIR SALON",
    moment: { clip: "assets/moments/salon-waitlist.mp4", label: "Thursday · 8:00 AM" },
    before: {
      customer: "Leah",
      nodes: [
        { label: "2 PM cancels", kind: "normal" },
        { label: "Waitlist on a sticky note", kind: "normal", beat: "sticky" },
        { label: "No time to call them all", kind: "bad", beat: "time" },
        { label: "Empty chair", kind: "outcome", beat: "chair" },
      ],
    },
    cost: {
      tag: "DEMO SCENARIO",
      lines: [
        { text: "A last-minute cancel is fine.", color: "ink" },
        { text: "An empty chair isn't.", color: "bad", beat: "empty" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "Text the whole waitlist, first yes wins",
      clip: "assets/fix-demos/waitlist-thread.mp4",
      clipSeconds: 4.2,
      isNews: false,
    },
    after: {
      customer: "Leah",
      layout: "branch",
      edgeLabels: ["FIRST YES", "NO REPLIES"],
      nodes: [
        { label: "Cancel comes in", kind: "normal", beat: "cancel" },
        { label: "Text all 5 at once", kind: "ai", beat: "text" },
        { label: "Leah's booked", sub: "first to reply", kind: "done", beat: "first" },
        { label: "Front desk heads-up", sub: "nobody replied", kind: "human", beat: "nobody" },
      ],
    },
    verdict: {
      lines: [
        { text: "Cancellations happen.", color: "ok", beat: "cancellations" },
        { text: "Empty chairs don't have to.", color: "accent", beat: "empty" },
      ],
    },
  },
  {
    id: "bookkeeper-onboarding",
    episode: 17,
    industry: "bookkeeping",
    compositionId: "BookkeeperOnboarding",
    business: "BOOKKEEPING FIRM",
    moment: { clip: "assets/moments/bookkeeper-onboarding.mp4", label: "Wednesday · 9:30 AM" },
    before: {
      customer: "Anna",
      nodes: [
        { label: "New client signed", sub: "2 weeks ago", kind: "normal" },
        { label: "6 emails, each different", kind: "bad", beat: "emails" },
        { label: "They stop opening them", kind: "outcome", beat: "stopped" },
      ],
    },
    cost: {
      tag: "DEMO NUMBERS",
      lines: [
        { text: "Two weeks of back and forth", color: "ink" },
        { text: "before any actual work", color: "bad", beat: "actual" },
      ],
    },
    newThing: {
      kicker: "THE FIX",
      title: "One checklist link",
      clip: "assets/fix-demos/doc-checklist.mp4",
      clipSeconds: 4.0,
      isNews: false,
    },
    after: {
      customer: "Anna",
      nodes: [
        { label: "One checklist link", kind: "normal", beat: "link" },
        { label: "Anna uploads what she has", kind: "normal", beat: "uploads" },
        { label: "Reminder for the missing item", kind: "ai", beat: "missing" },
        { label: "Complete → you start", kind: "done", beat: "complete" },
      ],
    },
    verdict: {
      lines: [
        { text: "Ask once, clearly.", color: "ok", beat: "ask" },
        { text: "Let reminders do the chasing.", color: "accent", beat: "reminders" },
      ],
    },
  },
];
