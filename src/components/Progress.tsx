import { progressItems } from "../data/prompts";
import type { StageId } from "../types";

interface ProgressProps {
  stage: StageId;
  onSelect?: (stage: StageId) => void;
}

export function Progress({ stage, onSelect }: ProgressProps) {
  const activeIndex = progressItems.findIndex((item) => item.id === stage);

  return (
    <nav className="progress" aria-label="Clarity session progress">
      {progressItems.map((item, index) => (
        <button
          key={item.id}
          className={`progress-item ${index === activeIndex ? "active" : ""} ${index < activeIndex ? "complete" : ""}`}
          onClick={() => index <= activeIndex && onSelect?.(item.id)}
          disabled={!onSelect || index > activeIndex}
        >
          <span className="progress-dot" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
