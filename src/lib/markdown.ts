import { stages } from "../data/prompts";
import type { ClarityReport, SessionData } from "../types";

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function reportToMarkdown(
  session: SessionData,
  report: ClarityReport,
): string {
  const date = new Date(session.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const answers = stages
    .map(
      (stage) =>
        `### ${stage.question}\n\n${session.answers[stage.id] || "_No response recorded._"}`,
    )
    .join("\n\n");
  const experiments = report.nextExperiments
    .map(
      (experiment, index) =>
        `### ${index + 1}. ${experiment.title}\n\n**Action:** ${experiment.action}\n\n**Why it matters:** ${experiment.why}\n\n**How to know it worked:** ${experiment.signal}`,
    )
    .join("\n\n");

  return `# Your Clarity Report

**Date:** ${date}
**Starting point:** ${session.setupReason || "Not specified"}

## Session Notes

${session.setupDetails || "_No additional setup note recorded._"}

${answers}

## Current Situation

${report.summary}

## What You Seem To Want

${list(report.apparentWants)}

## What Seems Important

${list(report.importantValues)}

## Current Strategy

${list(report.currentStrategies)}

## Likely Blockers

### Internal Blockers
${list(report.blockers.internal)}

### External Blockers
${list(report.blockers.external)}

### Strategic Blockers
${list(report.blockers.strategic)}

## Key Tensions

${list(report.tensions)}

## Success Signals

### Leading Indicators
${list(report.successSignals.leading)}

### Lagging Indicators
${list(report.successSignals.lagging)}

## Next Experiments

${experiments}

## Final Reflection

The next honest step appears to be choosing one small action that tests this direction in real life, then listening carefully to what it teaches you.

${list(report.reflectionQuestions)}

---

Clarity is a reflective coaching tool. It is not therapy, medical advice, financial advice, legal advice, or crisis support.
`;
}
