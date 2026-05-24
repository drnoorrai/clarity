import { Button } from "./Button";

interface LandingProps {
  hasSession: boolean;
  onStart: () => void;
  onResume: () => void;
}

export function Landing({ hasSession, onStart, onResume }: LandingProps) {
  return (
    <main className="landing page-shell">
      <header className="brand">
        <span className="brand-mark" />
        <span>Clarity</span>
      </header>
      <div className="landing-grid">
        <section className="hero">
          <h1>Clarity</h1>
          <p className="hero-copy">
            A guided reflection tool for figuring out what you want, what
            matters, what’s in the way, and what to do next.
          </p>
          <div className="hero-actions">
            <Button onClick={onStart}>Start a clarity session</Button>
            {hasSession && (
              <Button variant="secondary" onClick={onResume}>
                Resume saved session
              </Button>
            )}
          </div>
          <p className="privacy-note">
            Private by design. Your responses stay in this browser unless you
            export them.
          </p>
        </section>
        <aside className="session-preview" aria-hidden="true">
          <div className="preview-top">
            <span>Guided session</span>
            <span>15–25 min</span>
          </div>
          <div className="preview-line" />
          <p className="preview-question">What do you want?</p>
          <p className="preview-answer">
            Make room for the work and relationships that feel most honest...
          </p>
          <div className="preview-stage">
            {["Want", "Values", "Strategy", "Blockers", "Evidence"].map(
              (label, index) => (
                <span className={index === 0 ? "selected" : ""} key={label}>
                  {label}
                </span>
              ),
            )}
          </div>
        </aside>
      </div>
      <div className="landing-bottom">
        <p>
          Five considered questions. One private report. A practical next step.
        </p>
      </div>
    </main>
  );
}
