# Analytical Web App Template

Production-minded starter for polished, client-facing analytical web applications. It uses Next.js, TypeScript, Tailwind, Recharts, testable metric logic, auth-ready boundaries, and Codex agent workflows designed for parallel implementation.

## Stack

- Next.js App Router with React and TypeScript
- Tailwind CSS for a restrained premium interface system
- Recharts for dashboard visualizations
- NextAuth-ready auth boundary
- API/data access seams in `src/server`, `src/lib/db`, and `src/lib/data-processing`
- Vitest for testable analytics and utility logic

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run check
npm run build
```

## Template Workflow

1. Copy this repository into a new client or product repository.
2. Fill out `docs/project-charter.md` to define the strategic direction.
3. Fill out `docs/product-brief-template.md` before implementation.
4. Define metrics in `docs/metric-definitions.md`.
5. Replace sample data in `src/lib/data-processing/sample-data.ts` with database or API adapters.
6. Configure auth in `src/lib/auth`.
7. Assign Codex agents using `docs/agent-tasks/*.md`.
8. Keep business logic in `src/lib` or `src/server`; keep components presentation-focused.

## Where Codex Agents Start

Future agents should read `AGENTS.md` and `docs/project-charter.md` first, then:

- Strategic project charter: `docs/project-charter.md`
- Shared operating context: `docs/context-brief.md`
- Role runbook: `docs/agent-runbook.md`
- Architecture decisions: `docs/decision-log.md`
- API contracts: `docs/api-contracts.md`
- Data contracts: `docs/data-contracts.md`
- Final merge gate: `docs/integration-checklist.md`
- Product/UX work: `docs/product-brief-template.md`, `docs/design-system.md`, `src/components`
- Analytics work: `docs/metric-definitions.md`, `src/lib/analytics`, `src/lib/data-processing`
- API/backend work: `src/server`, `src/lib/db`, `src/types`
- Dashboard work: `src/features/dashboard`, `src/components/charts`, `src/components/layout`
- Security work: `docs/security-model.md`, `src/lib/auth`, `.env.example`

## Customization TODOs

Search for `TODO:` markers before client delivery. They identify app-specific decisions such as auth provider setup, database adapter selection, and sample-data replacement.
