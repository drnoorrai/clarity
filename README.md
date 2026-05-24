# Clarity

Clarity is a premium, local-first guided reflection prototype. In a focused
15–25 minute session it takes a user through five questions:

1. What do you want?
2. What is important to you?
3. How are you getting it?
4. What is preventing you from having it?
5. How will you know that you have it?

The result is a structured personal clarity report with practical seven-day
experiments, available to copy or download as Markdown.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

The Vite base path is configured for deployment at
`https://drnoorrai.github.io/clarity/`.

## Privacy Note

Clarity requires no account and no backend. Session responses are saved only in
the browser's `localStorage` until the user restarts the session or clears
browser storage. A report leaves the browser only when the user copies or
downloads it.

This prototype is a reflective coaching tool. It is not therapy, medical
advice, financial advice, legal advice, or crisis support.

## How It Works

- React, TypeScript, Vite and Tailwind CSS
- Five-stage conversational reflection flow with local autosave
- Deterministic `generateClarityReport(sessionData)` report generation
- Safety boundary messaging for possible immediate-harm language
- Markdown download and clipboard export
- GitHub Pages deployment workflow

## Future Ideas

- AI-powered adaptive questioning
- optional encrypted account sync
- recurring weekly reviews
- decision coaching mode
- values profile
- personal operating manual
- calendar/behaviour reflection
- longitudinal pattern detection
- coach dashboard
- clinician/therapist-safe version
- export to PDF
- private local-first memory
