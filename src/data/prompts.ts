import type { StageId } from "../types";

export interface StagePrompt {
  id: Exclude<StageId, "setup" | "report">;
  label: string;
  question: string;
  guidance: string;
  reflections: string[];
}

export const stages: StagePrompt[] = [
  {
    id: "want",
    label: "Want",
    question: "What do you want?",
    guidance:
      "Name what you are reaching for, without needing to justify it yet.",
    reflections: [
      "If life was meaningfully better 12 months from now, what would be different?",
      "What are you tired of tolerating?",
      "What do you secretly wish you could admit you wanted?",
      "What would make you proud?",
    ],
  },
  {
    id: "values",
    label: "Values",
    question: "What’s important to you?",
    guidance:
      "Explore why this matters and what should remain intact as you pursue it.",
    reflections: [
      "Why does this matter?",
      "What would you not want to sacrifice to get it?",
      "Which matters more right now: freedom, security, peace, growth, family, health, or mastery?",
      "What value feels underfed in your current life?",
    ],
  },
  {
    id: "strategy",
    label: "Strategy",
    question: "How are you getting it?",
    guidance:
      "Look honestly at your current choices, attention and energy.",
    reflections: [
      "What are you currently doing to move toward this?",
      "What does your calendar suggest you are prioritising?",
      "What is working?",
      "What is not working?",
    ],
  },
  {
    id: "blockers",
    label: "Blockers",
    question: "What is preventing you from having it?",
    guidance:
      "Name obstacles precisely. A clear constraint is easier to meet than a vague weight.",
    reflections: [
      "Is the blocker internal, external, relational, structural, or strategic?",
      "What are you avoiding?",
      "What fear might be operating underneath this?",
      "What would become uncomfortable if you got what you wanted?",
    ],
  },
  {
    id: "evidence",
    label: "Evidence",
    question: "How will you know that you have it?",
    guidance:
      "Define the signs of progress and the point at which this becomes enough.",
    reflections: [
      "What would be visibly different?",
      "What would you feel more often?",
      "What would you stop doing?",
      "What would count as enough?",
    ],
  },
];

export const progressItems = [
  ...stages.map(({ id, label }) => ({ id, label })),
  { id: "report" as const, label: "Report" },
];

export const setupReasons = [
  "I feel stuck",
  "I don’t know what I want",
  "I have too many options",
  "I feel unfulfilled",
  "I’m avoiding something",
  "I want to make a decision",
  "I want to reset my direction",
  "Something else",
];
