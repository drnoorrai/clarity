import { setupReasons } from "../data/prompts";
import type { SessionData } from "../types";
import { Button } from "./Button";
import { Card } from "./Card";

interface SetupProps {
  data: SessionData;
  onChange: (data: SessionData) => void;
  onBegin: () => void;
  onBack: () => void;
}

export function Setup({ data, onChange, onBegin, onBack }: SetupProps) {
  return (
    <main className="journey page-shell">
      <div className="setup-header">
        <button className="text-control" onClick={onBack}>
          Clarity
        </button>
        <p className="quiet-label">Session setup</p>
      </div>
      <Card className="setup-card">
        <h1>What brings you here today?</h1>
        <p className="lead">
          Choose the closest starting point. You can be more precise in your
          own words below.
        </p>
        <div className="reason-grid" role="radiogroup" aria-label="Reason">
          {setupReasons.map((reason) => (
            <button
              className={`reason-option ${data.setupReason === reason ? "is-selected" : ""}`}
              key={reason}
              onClick={() => onChange({ ...data, setupReason: reason })}
              role="radio"
              aria-checked={data.setupReason === reason}
            >
              {reason}
            </button>
          ))}
        </div>
        <label className="field-label" htmlFor="setupDetails">
          Tell Clarity a little more...
        </label>
        <textarea
          id="setupDetails"
          className="reflection-textarea setup-textarea"
          value={data.setupDetails}
          onChange={(event) =>
            onChange({ ...data, setupDetails: event.target.value })
          }
          placeholder="What has been on your mind, and what would feel useful to understand today?"
        />
        <div className="card-actions">
          <Button
            onClick={onBegin}
            disabled={!data.setupReason && !data.setupDetails.trim()}
          >
            Begin
          </Button>
        </div>
      </Card>
    </main>
  );
}
