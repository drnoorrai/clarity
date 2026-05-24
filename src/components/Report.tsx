import type { ClarityReport, SessionData, StageId } from "../types";
import { crisisSupportMessage } from "../lib/reportGenerator";
import { Button } from "./Button";
import { Progress } from "./Progress";

interface ReportProps {
  data: SessionData;
  report: ClarityReport;
  showCrisisSupport: boolean;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onRestart: () => void;
  onSelectStage: (stage: StageId) => void;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="report-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function Report({
  data,
  report,
  showCrisisSupport,
  copied,
  onCopy,
  onDownload,
  onRestart,
  onSelectStage,
}: ReportProps) {
  const date = new Date(data.updatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="journey report-page page-shell">
      <header className="session-header">
        <span className="brand compact">
          <span className="brand-mark" />
          Clarity
        </span>
        <p className="quiet-label">{date}</p>
      </header>
      <Progress stage="report" onSelect={onSelectStage} />
      <header className="report-title">
        <p className="stage-count">Private report</p>
        <h1>Your Clarity Report</h1>
        <p className="lead">
          A considered reading of your responses. Keep what is useful and
          question what is not.
        </p>
        <div className="report-actions">
          <Button onClick={onCopy}>{copied ? "Copied" : "Copy report"}</Button>
          <Button variant="secondary" onClick={onDownload}>
            Download as Markdown
          </Button>
          <Button variant="quiet" onClick={onRestart}>
            Restart session
          </Button>
        </div>
      </header>
      {showCrisisSupport && (
        <div className="support-alert report-alert" role="alert">
          {crisisSupportMessage}
        </div>
      )}
      <div className="report-grid">
        <section className="report-card span-two">
          <p className="report-label">Current situation</p>
          <p className="report-summary">{report.summary}</p>
        </section>
        <section className="report-card">
          <p className="report-label">What you seem to want</p>
          <Bullets items={report.apparentWants} />
        </section>
        <section className="report-card">
          <p className="report-label">What seems important</p>
          <ol className="ranked-values">
            {report.importantValues.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ol>
        </section>
        <section className="report-card span-two">
          <p className="report-label">Current strategy</p>
          <Bullets items={report.currentStrategies} />
        </section>
        <section className="report-card span-two">
          <p className="report-label">Likely blockers</p>
          <div className="blocker-columns">
            <div>
              <h2>Internal</h2>
              <Bullets items={report.blockers.internal} />
            </div>
            <div>
              <h2>External</h2>
              <Bullets items={report.blockers.external} />
            </div>
            <div>
              <h2>Strategic</h2>
              <Bullets items={report.blockers.strategic} />
            </div>
          </div>
        </section>
        <section className="report-card">
          <p className="report-label">Key tensions</p>
          <Bullets items={report.tensions} />
        </section>
        <section className="report-card">
          <p className="report-label">Success signals</p>
          <h2>Leading indicators</h2>
          <Bullets items={report.successSignals.leading} />
          <h2 className="lagging">Lagging indicators</h2>
          <Bullets items={report.successSignals.lagging} />
        </section>
        <section className="report-card span-two experiments">
          <p className="report-label">Next experiments · seven days</p>
          {report.nextExperiments.map((experiment, index) => (
            <article className="experiment" key={experiment.title}>
              <p className="experiment-number">0{index + 1}</p>
              <div>
                <h2>{experiment.title}</h2>
                <p>{experiment.action}</p>
                <p className="experiment-detail">
                  <strong>Why:</strong> {experiment.why}
                </p>
                <p className="experiment-detail">
                  <strong>Signal:</strong> {experiment.signal}
                </p>
              </div>
            </article>
          ))}
        </section>
        <section className="report-card span-two final-reflection">
          <p className="report-label">Final reflection</p>
          <h2>
            The next honest step appears to be choosing one small action that
            tests this direction in real life.
          </h2>
          <Bullets items={report.reflectionQuestions} />
        </section>
      </div>
    </main>
  );
}
