import type { StagePrompt } from "../data/prompts";
import type { SessionData, StageId } from "../types";
import { crisisSupportMessage } from "../lib/reportGenerator";
import { Button } from "./Button";
import { Progress } from "./Progress";

interface SessionProps {
  prompt: StagePrompt;
  data: SessionData;
  showCrisisSupport: boolean;
  onAnswer: (answer: string) => void;
  onBack: () => void;
  onContinue: () => void;
  onSelectStage: (stage: StageId) => void;
}

export function Session({
  prompt,
  data,
  showCrisisSupport,
  onAnswer,
  onBack,
  onContinue,
  onSelectStage,
}: SessionProps) {
  const answer = data.answers[prompt.id] || "";

  function addReflection(reflection: string) {
    const separator = answer.trim() ? "\n\n" : "";
    onAnswer(`${answer}${separator}${reflection}\n`);
  }

  return (
    <main className="journey page-shell">
      <header className="session-header">
        <span className="brand compact">
          <span className="brand-mark" />
          Clarity
        </span>
        <p className="quiet-label">Saved locally</p>
      </header>
      <Progress stage={prompt.id} onSelect={onSelectStage} />
      <section className="question-layout">
        <aside className="question-context">
          <p className="stage-count">
            {prompt.label} · {prompt.id === "want" ? "01" : prompt.id === "values" ? "02" : prompt.id === "strategy" ? "03" : prompt.id === "blockers" ? "04" : "05"}
          </p>
          <h1>{prompt.question}</h1>
          <p className="lead">{prompt.guidance}</p>
        </aside>
        <div className="answer-area">
          {showCrisisSupport && (
            <div className="support-alert" role="alert">
              {crisisSupportMessage}
            </div>
          )}
          <label className="sr-only" htmlFor={`answer-${prompt.id}`}>
            Your reflection
          </label>
          <textarea
            id={`answer-${prompt.id}`}
            className="reflection-textarea session-textarea"
            value={answer}
            onChange={(event) => onAnswer(event.target.value)}
            placeholder="Write freely. There is no right phrasing and no one else sees this unless you export it."
            autoFocus
          />
          <p className="reflection-label">Optional prompts to go deeper</p>
          <div className="chips">
            {prompt.reflections.map((reflection) => (
              <button
                className="chip"
                key={reflection}
                onClick={() => addReflection(reflection)}
              >
                {reflection}
              </button>
            ))}
          </div>
          <div className="session-actions">
            <Button variant="quiet" onClick={onBack}>
              Back
            </Button>
            <Button onClick={onContinue}>
              {prompt.id === "evidence" ? "Create my report" : "Continue"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
