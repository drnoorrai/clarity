import type { ClarityReport, SessionData } from "../types";

const valueTerms: Record<string, string[]> = {
  Freedom: ["freedom", "autonomy", "independence", "flexibility", "choice"],
  Security: ["security", "stable", "stability", "safe", "money", "income"],
  Peace: ["peace", "calm", "balance", "rest", "quiet", "ease"],
  Growth: ["growth", "learn", "learning", "develop", "challenge", "progress"],
  Contribution: ["contribute", "help", "service", "impact", "meaning"],
  Recognition: ["recognition", "respected", "status", "seen", "achievement"],
  Family: ["family", "children", "partner", "relationship", "home"],
  Health: ["health", "healthy", "energy", "fitness", "sleep", "wellbeing"],
  Mastery: ["mastery", "craft", "excellent", "expert", "skill"],
};

const blockerTerms = {
  internal: {
    Fear: ["fear", "afraid", "scared", "anxious", "risk"],
    Confidence: ["confidence", "self-doubt", "doubt", "imposter"],
    Avoidance: ["avoid", "avoiding", "procrastinat", "putting off"],
    Energy: ["energy", "exhausted", "tired", "burnout", "overwhelm"],
  },
  external: {
    Time: ["time", "busy", "calendar", "hours"],
    Money: ["money", "financial", "cost", "salary", "afford"],
    Relationships: ["partner", "family", "manager", "relationship", "team"],
    Commitments: ["commitment", "responsibilit", "childcare", "workload"],
  },
  strategic: {
    Clarity: ["clarity", "unclear", "confused", "direction", "options"],
    Plan: ["plan", "strategy", "step", "priorit", "decision"],
    Consistency: ["consistent", "habit", "routine", "focus", "distract"],
  },
};

const crisisTerms = [
  "suicide",
  "kill myself",
  "harm myself",
  "self harm",
  "self-harm",
  "end my life",
  "hurt someone",
  "kill someone",
  "immediate danger",
];

function fullText(session: SessionData): string {
  return [
    session.setupReason,
    session.setupDetails,
    ...Object.values(session.answers),
  ]
    .join(" ")
    .toLowerCase();
}

function hasAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function compactAnswer(answer: string | undefined, fallback: string): string {
  const cleaned = (answer ?? "").replace(/\s+/g, " ").trim();
  if (!cleaned) return fallback;
  const sentence = cleaned.split(/[.!?]\s/)[0];
  return sentence.length > 128 ? `${sentence.slice(0, 125)}...` : sentence;
}

function detectValues(text: string): string[] {
  const ranked = Object.entries(valueTerms)
    .map(([value, terms]) => ({
      value,
      count: terms.reduce(
        (score, term) => score + (text.split(term).length - 1),
        0,
      ),
    }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count)
    .map(({ value }) => value);

  return ranked.length ? ranked.slice(0, 5) : ["Meaning", "Direction", "Integrity"];
}

function detectBlockers(text: string, category: keyof typeof blockerTerms): string[] {
  const matches = Object.entries(blockerTerms[category])
    .filter(([, terms]) => hasAny(text, terms))
    .map(([label]) => label);

  const fallback = {
    internal: "No clear internal blocker named yet",
    external: "No clear external constraint named yet",
    strategic: "More specificity may reveal the practical next step",
  };

  return matches.length ? matches : [fallback[category]];
}

function inferTensions(values: string[], text: string): string[] {
  const tensions: string[] = [];
  if (
    (values.includes("Freedom") && values.includes("Security")) ||
    (hasAny(text, valueTerms.Freedom) && hasAny(text, valueTerms.Security))
  ) {
    tensions.push("Freedom vs security");
  }
  if (
    (values.includes("Growth") && values.includes("Peace")) ||
    (hasAny(text, valueTerms.Growth) && hasAny(text, valueTerms.Peace))
  ) {
    tensions.push("Growth vs peace");
  }
  if (
    (values.includes("Recognition") && values.includes("Health")) ||
    (hasAny(text, ["achievement", "ambition"]) && hasAny(text, valueTerms.Health))
  ) {
    tensions.push("Achievement vs energy");
  }
  if (hasAny(text, ["unclear", "certainty", "sure"]) && values.includes("Growth")) {
    tensions.push("Certainty vs growth");
  }
  return tensions.length
    ? tensions
    : ["Immediate comfort vs meaningful change"];
}

export function containsCrisisContent(session: SessionData): boolean {
  return hasAny(fullText(session), crisisTerms);
}

export function generateClarityReport(session: SessionData): ClarityReport {
  const text = fullText(session);
  const values = detectValues(text);
  const want = compactAnswer(
    session.answers.want,
    "A clearer definition of what meaningful progress would look like.",
  );
  const strategy = compactAnswer(
    session.answers.strategy,
    "No established strategy has been described yet.",
  );
  const evidence = compactAnswer(
    session.answers.evidence,
    "A concrete signal of progress still needs defining.",
  );
  const situation: Record<string, string> = {
    "I feel stuck": "feeling stuck",
    "I don’t know what I want": "uncertainty about what you want",
    "I have too many options": "too many competing options",
    "I feel unfulfilled": "a sense of being unfulfilled",
    "I’m avoiding something": "something you may be avoiding",
    "I want to make a decision": "a decision that needs making",
    "I want to reset my direction": "a wish to reset your direction",
    "Something else": "a situation that needs clearer definition",
  };
  const context = situation[session.setupReason] ?? "a moment of uncertainty";
  const actionWant = /^I want to\s+/i.test(want);
  const goal = want
    .replace(/^I want to\s+/i, "")
    .replace(/^I want\s+/i, "")
    .replace(/^./, (letter) => letter.toLowerCase());
  const direction = actionWant
    ? `trying to ${goal}`
    : `moving toward ${want.toLowerCase()}`;

  return {
    summary: `Your answers suggest you are navigating ${context} while ${direction}. The material here points to a need for a smaller, observable next move rather than a perfect long-range answer.`,
    apparentWants: [
      want,
      "Greater alignment between daily choices and what matters most.",
    ],
    importantValues: values,
    currentStrategies: [
      strategy,
      "Your answers can now be used to test whether current time and attention support this direction.",
    ],
    blockers: {
      internal: detectBlockers(text, "internal"),
      external: detectBlockers(text, "external"),
      strategic: detectBlockers(text, "strategic"),
    },
    tensions: inferTensions(values, text),
    successSignals: {
      leading: [
        "One protected action each week that moves this priority forward.",
        "Less time spent avoiding or repeatedly reconsidering the same next step.",
      ],
      lagging: [evidence, "A felt increase in alignment, ease, or momentum."],
    },
    nextExperiments: [
      {
        title: "Protect one small move",
        action: `Schedule one 30-minute action this week that supports: ${want}.`,
        why: "Intent becomes easier to assess once it is expressed in behaviour.",
        signal: "The session happens and leaves you with clearer information.",
      },
      {
        title: "Name the constraint",
        action:
          "Write down the single obstacle that most affected this action, using concrete rather than general language.",
        why: "A named constraint can be adjusted, accepted, or planned around.",
        signal: "You can describe the blocker in one sentence without hedging.",
      },
      {
        title: "Run an alignment check",
        action: `At the end of seven days, rate how well your choices served ${values[0].toLowerCase()} from 1 to 10 and note one change.`,
        why: "Progress is easier to sustain when it is linked to an important value.",
        signal: "You identify one choice to continue and one to change next week.",
      },
    ],
    reflectionQuestions: [
      `What would a brave but proportionate step toward ${want.toLowerCase()} look like this week?`,
      `What are you willing to decline in order to protect ${values[0].toLowerCase()}?`,
      "What evidence would allow you to stop analysing and make a decision?",
    ],
  };
}

export const crisisSupportMessage =
  "This sounds serious and you deserve real support. If you may be at risk of harming yourself or someone else, contact emergency services now or reach out to a trusted person immediately.";
