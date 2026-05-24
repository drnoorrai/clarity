import { useEffect, useMemo, useState } from "react";
import { stages } from "./data/prompts";
import { Landing } from "./components/Landing";
import { Report } from "./components/Report";
import { Session } from "./components/Session";
import { Setup } from "./components/Setup";
import { reportToMarkdown } from "./lib/markdown";
import {
  containsCrisisContent,
  generateClarityReport,
} from "./lib/reportGenerator";
import { clearSession, loadSession, saveSession } from "./lib/storage";
import type { SessionData, StageId } from "./types";

type Screen = "landing" | StageId;

function freshSession(): SessionData {
  const now = new Date().toISOString();
  return {
    setupReason: "",
    setupDetails: "",
    answers: {},
    createdAt: now,
    updatedAt: now,
  };
}

export default function App() {
  const stored = useMemo(() => loadSession(), []);
  const [data, setData] = useState<SessionData>(stored?.data ?? freshSession());
  const [screen, setScreen] = useState<Screen>("landing");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [screen]);

  useEffect(() => {
    if (screen === "landing") return;
    saveSession({
      data: { ...data, updatedAt: new Date().toISOString() },
      stage: screen,
    });
  }, [data, screen]);

  const report = useMemo(() => generateClarityReport(data), [data]);
  const hasCrisisContent = containsCrisisContent(data);
  const currentStage = stages.find((stage) => stage.id === screen);

  function startNewSession() {
    const next = freshSession();
    clearSession();
    setData(next);
    setCopied(false);
    setScreen("setup");
  }

  function resumeSession() {
    const saved = loadSession();
    if (saved) {
      setData(saved.data);
      setScreen(saved.stage);
      return;
    }
    setScreen("setup");
  }

  function updateData(next: SessionData) {
    setData({ ...next, updatedAt: new Date().toISOString() });
  }

  function moveFromStage(direction: "forward" | "back") {
    const index = stages.findIndex((stage) => stage.id === screen);
    if (direction === "back") {
      setScreen(index === 0 ? "setup" : stages[index - 1].id);
      return;
    }
    setScreen(index === stages.length - 1 ? "report" : stages[index + 1].id);
  }

  async function copyReport() {
    const markdown = reportToMarkdown(data, report);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      downloadReport();
    }
  }

  function downloadReport() {
    const content = reportToMarkdown(data, report);
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clarity-report-${date}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {screen === "landing" && (
        <Landing
          hasSession={Boolean(stored || loadSession())}
          onStart={startNewSession}
          onResume={resumeSession}
        />
      )}
      {screen === "setup" && (
        <Setup
          data={data}
          onChange={updateData}
          onBegin={() => setScreen("want")}
          onBack={() => setScreen("landing")}
        />
      )}
      {currentStage && (
        <Session
          prompt={currentStage}
          data={data}
          showCrisisSupport={hasCrisisContent}
          onAnswer={(answer) =>
            updateData({
              ...data,
              answers: { ...data.answers, [currentStage.id]: answer },
            })
          }
          onBack={() => moveFromStage("back")}
          onContinue={() => moveFromStage("forward")}
          onSelectStage={setScreen}
        />
      )}
      {screen === "report" && (
        <Report
          data={data}
          report={report}
          showCrisisSupport={hasCrisisContent}
          copied={copied}
          onCopy={copyReport}
          onDownload={downloadReport}
          onRestart={startNewSession}
          onSelectStage={setScreen}
        />
      )}
      <footer className="boundary-note">
        Clarity is a reflective coaching tool. It is not therapy, medical
        advice, financial advice, legal advice, or crisis support.
      </footer>
    </>
  );
}
