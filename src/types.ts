export type StageId =
  | "setup"
  | "want"
  | "values"
  | "strategy"
  | "blockers"
  | "evidence"
  | "report";

export interface SessionData {
  setupReason: string;
  setupDetails: string;
  answers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ClarityReport {
  summary: string;
  apparentWants: string[];
  importantValues: string[];
  currentStrategies: string[];
  blockers: {
    internal: string[];
    external: string[];
    strategic: string[];
  };
  tensions: string[];
  successSignals: {
    leading: string[];
    lagging: string[];
  };
  nextExperiments: {
    title: string;
    action: string;
    why: string;
    signal: string;
  }[];
  reflectionQuestions: string[];
}

export interface StoredSession {
  data: SessionData;
  stage: StageId;
}
