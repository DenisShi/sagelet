# Sagelet — Windows MVP

Sagelet is a small desktop learning companion. It stays in the Windows system tray and reveals a short English lesson when the pointer touches the top edge of the screen.

The first version is intentionally local: it does not require an account, backend, internet connection, or AI API.

## What is already implemented

- Electron + React + TypeScript desktop application.
- Compact top-edge learning card with `Got it`, `Repeat later`, and `Next idea` actions.
- English explanations, Russian translations, and bilingual examples.
- Expanded local English content for levels A1–B2.
- Randomized new-card selection and spaced review intervals without immediate repeats.
- Native desktop notifications and click-to-open behavior.
- Windows system tray with open, next card, pause, and exit actions.
- Scheduler with active hours, weekdays, interval, daily limit, and pause support.
- Safe resume after sleep and no notification burst after missed reminders.
- Local settings and learning progress persistence.
- Optional launch with Windows.
- Minimal settings popover for level, reminder interval, notifications, and Windows startup.
- Isolated preload bridge with `contextIsolation`, disabled Node integration, and renderer sandboxing.

## Start locally

Requirements: Node.js 22.12 or newer and npm.

```bash
npm install
npm run dev
```

Move the pointer to the top edge of the screen to reveal Sagelet. Moving away hides an edge-opened card automatically. The tray menu can open the card manually, pause reminders, or exit the application completely.

## Verify the project

```bash
npm run typecheck
npm test
npm run build
```

## Create the Windows installer

Run on Windows:

```bash
npm run build:win
```

The NSIS installer is written to `release/`. The first prototype uses Electron's default executable icon; branded `.ico` and installer signing are deliberately left for the packaging stage.

## Project structure

```text
src/
  main/
    content/       local, validated learning cards
    services/      content engine, scheduler, JSON persistence
    app-controller.ts
    index.ts
  preload/         narrow IPC bridge exposed to React
  renderer/        React user interface
  shared/          schemas, types, and IPC contracts
tests/             pure scheduler and content-selection tests
```

## Where local data is stored

Electron writes `sagelet-state.json` inside the current user's application data directory. On Windows this is normally under `%APPDATA%/Sagelet/`. Removing that file resets settings and progress.

## Next development steps

1. Continue expanding and proofreading the local content pack.
2. Add a branded Windows icon and code signing.
3. Introduce a backend content provider, then connect AI generation without exposing an API key in the desktop application.
