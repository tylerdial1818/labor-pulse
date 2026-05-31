# Labor Pulse

Labor Pulse is a public US labor market monitor for researchers preparing executive-facing reports. It shows lagging, leading, and technology/AI impact indicators with visible source attribution, methodology caveats, drilldowns, and CSV/PNG exports.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Editorial dashboard design from `design_handoff_laborpulse_dashboard`
- Server-only local JSON store for v1 local operation
- FRED refresh API scaffolding with Zod-style validation helpers
- OpenAI definition endpoint, cache-first, prose-only
- Native SVG charts in the app and server-side PNG export
- Vitest coverage for indicator catalog and metric helpers

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The local v1 store is created automatically at `data/labor-pulse-store.json` on first read. It seeds all 15 v1 indicators and enough observation history for dashboard cards, drilldowns, source logs, CSV export, and PNG export.

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run check
npm run build
```

## Environment

Required for local app display:

```bash
NEXT_PUBLIC_APP_NAME="Labor Pulse"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRON_SECRET="replace-with-strong-random-secret"
```

Required for live integrations:

```bash
FRED_API_KEY="..."
OPENAI_API_KEY="..."
OPENAI_MODEL_DEFINITIONS="gpt-4o-mini"
DATABASE_URL="..." # reserved for Neon/Postgres production migration
```

## Routes

- `/` dashboard with Lagging, Leading, and Tech & AI Impact tabs
- `/indicators/[id]` detail page with time windows, chart, definition, source, CSV and PNG downloads
- `/sources` source table and refresh log
- `/about` project/methodology overview
- `/api/cron/refresh-fred` protected FRED refresh route
- `/api/definitions/[id]` cached generated definition route
- `/api/export/csv/[id]` CSV export
- `/api/export/png/[id]` PNG chart export

## Data Rules

- All displayed numbers, deltas, and chart points come from stored observations.
- LLM output is limited to explanatory prose definitions and is rejected if it contains numerical content.
- Tech & AI indicators remain visibly caveated as proxy or scoped AI-usage signals.

## Agent Context

Future Codex agents should read `AGENTS.md`, `docs/project-charter.md`, and `docs/context-brief.md` first. Contracts and acceptance notes live in `docs/api-contracts.md`, `docs/data-contracts.md`, `docs/metric-definitions.md`, `docs/security-model.md`, and `docs/integration-checklist.md`.
