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
];
