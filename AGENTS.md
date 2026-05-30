# AGENTS.md

This repository is a reusable template for premium, client-facing analytical web applications. Treat it as production-intended: keep changes scoped, typed, accessible, secure, and easy for parallel agents to integrate.

## Before Major Implementation

- Use Plan Mode for broad features, cross-cutting architecture, data model changes, security work, deployment changes, or anything touching more than one ownership area.
- Read `AGENTS.md` first, then `docs/project-charter.md`, then `docs/context-brief.md`, then the relevant contract docs before editing.
- Read `docs/project-charter.md` before implementation to understand the project mission, target users, workflows, success metrics, non-goals, and constraints.
- Read `docs/api-contracts.md` before changing endpoints, server functions, or request/response shapes.
- Read `docs/data-contracts.md` and `docs/metric-definitions.md` before changing sources, schemas, transformations, or metrics.
- Read `docs/security-model.md` before changing auth, authorization, secrets, exports, or data exposure.
- State assumptions before coding.
- State the files you expect to touch and the files you will avoid.
- Check existing patterns before introducing dependencies or abstractions.
- Update `docs/context-brief.md` when major decisions, priorities, workstreams, risks, deployment assumptions, auth assumptions, or active ownership change.
- Update `docs/project-charter.md` when strategic goals, target users, core workflows, success metrics, non-goals, constraints, or deployment/access strategy change.
- Update `docs/decision-log.md` when architecture, data, security, deployment, or workflow decisions change.
- Update API and data contracts when interfaces, schemas, or source assumptions change.

## Setup Commands

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Development Commands

```bash
npm run dev
npm run build
npm run start
```

## Quality Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run check
```

Run `npm run check` before handoff when dependencies are installed. If a command cannot run, explain why and list the residual risk.

## Coding Standards

- Use TypeScript with strict types. Avoid `any`; prefer domain types in `src/types`.
- Keep business rules in `src/lib/analytics`, `src/lib/data-processing`, or `src/server`, not inside UI components.
- Keep UI components small, composable, and presentation-focused.
- Prefer existing helpers such as `cn`, `formatCurrency`, and metric functions before adding new utilities.
- Add comments only when they clarify architecture, security, or non-obvious analytical logic.
- Mark app-specific replacement points with `TODO:`.

## Design Standards

- Build polished analytical product surfaces: dense but calm, clear hierarchy, restrained color, strong spacing, and legible tables.
- Use reusable components in `src/components/ui`, charts in `src/components/charts`, and feature composition in `src/features`.
- Avoid landing-page filler for apps. The first screen should be a useful product surface.
- Keep cards for discrete repeated items, data panels, or modals. Do not nest cards inside cards.
- Use responsive layouts and stable dimensions for charts, tables, filters, and KPI panels.
- Use icons from `lucide-react` for toolbar and navigation actions.

## Accessibility Standards

- Use semantic landmarks: `main`, `header`, `nav`, `section`, and table semantics.
- Provide accessible names for controls and buttons.
- Maintain visible focus states and keyboard-operable interactions.
- Preserve color contrast in charts and badges; do not encode meaning with color alone.
- Keep text readable on mobile without overlap or truncation surprises.

## Analytics And Data Standards

- Define every client-facing metric in `docs/metric-definitions.md`.
- Keep calculations pure and covered by tests in `src/tests`.
- Document data source freshness, grain, joins, and known caveats.
- Never silently change metric definitions. Update docs, tests, and UI labels together.
- Validate external API/database responses before they reach dashboard components.

## Security Rules

- Never hardcode secrets, tokens, credentials, or client data.
- Use environment variables for configuration and secret-manager-backed values in deployment.
- Keep auth logic in `src/lib/auth` and server-only access checks in `src/server`.
- Treat all user-controlled inputs as untrusted.
- Do not expose privileged data through `NEXT_PUBLIC_` variables.
- Add security notes to `docs/security-model.md` for new auth, data, or deployment surfaces.

## Environment Variable Rules

- Add new variables to `.env.example` with safe placeholder values.
- Prefix only browser-safe values with `NEXT_PUBLIC_`.
- Document required deployment variables in `docs/deployment.md`.
- Do not commit `.env`, `.env.local`, or real client credentials.

## Deployment Rules

- Keep builds reproducible with `npm run build`.
- Prefer Vercel for simple Next.js deployment unless client constraints require another platform.
- Document platform-specific setup, domains, auth callback URLs, and secret names.
- Verify production-like auth and data access before client delivery.

## File Ownership Boundaries

- `src/app`: routing, layouts, route-level loading/error states.
- `src/components/ui`: generic primitives only; no client-specific business logic.
- `src/components/charts`: reusable chart components; no source-specific data fetching.
- `src/components/layout`: navigation and shell layout.
- `src/components/forms`: filters and inputs.
- `src/features/*`: feature composition and screen-specific orchestration.
- `src/lib/analytics`: pure metric calculations and analytical helpers.
- `src/lib/data-processing`: cleaning, shaping, and sample or fixture data.
- `src/lib/auth`: auth configuration and identity helpers.
- `src/lib/db`: database or service clients.
- `src/server`: server-only data access and orchestration.
- `src/types`: shared domain types.
- `docs`: product, architecture, security, deployment, and workflow documentation.

## Recommended Ownership Matrix

| Area | Primary owner | Files | Coordination required |
| --- | --- | --- | --- |
| Frontend | Frontend/Dashboard Agent | `src/app/**`, `src/features/**`, `src/components/**`, `src/hooks/**`, `src/styles/**` | Coordinate shared types, API contracts, chart data props, and design tokens. |
| Backend | Backend/API Agent | `src/server/**`, `src/lib/db/**`, `src/app/api/**`, `.env.example` | Coordinate auth rules, data contracts, environment variables, and response schemas. |
| Analytics | Data Model + Analytics Agent | `src/lib/analytics/**`, `src/lib/data-processing/**`, `src/types/**`, `src/tests/**`, `docs/metric-definitions.md`, `docs/data-contracts.md` | Coordinate UI labels, server view models, metric caveats, and chart requirements. |
| Infrastructure | Deployment/DevOps Agent | `next.config.ts`, `package.json`, `package-lock.json`, `.env.example`, deployment docs, platform config | Coordinate dependency changes, build settings, auth callback URLs, and required secrets. |
| Security | Security/Auth Agent | `src/lib/auth/**`, auth-sensitive `src/server/**`, `.env.example`, `docs/security-model.md` | Coordinate protected routes, tenant boundaries, exports, and deployment env vars. |
| Architecture | Architect/Integrator Agent | `AGENTS.md`, `README.md`, `docs/context-brief.md`, `docs/decision-log.md`, contracts, `src/types/**` | Coordinate every cross-boundary change and final merge. |

## High-Conflict Files

These files require coordination before editing because multiple agents often need them:

- `package.json` and `package-lock.json`
- `.env.example`
- `src/types/**`
- `src/server/dashboard-data.ts` and shared server modules
- `src/app/layout.tsx`, `src/app/page.tsx`, and route-level state files
- `src/styles/globals.css` and `tailwind.config.ts`
- `docs/context-brief.md`
- `docs/project-charter.md`
- `docs/decision-log.md`
- `docs/api-contracts.md`
- `docs/data-contracts.md`
- `docs/metric-definitions.md`
- `docs/deployment.md`
- `docs/security-model.md`

## Parallel Agent Workflow

- Each agent owns one role template in `docs/agent-tasks`.
- Each agent should follow the reading and handoff rules in `docs/agent-runbook.md`.
- Agents should work in their allowed files and avoid forbidden files unless the Architect/Integrator approves a handoff.
- Cross-boundary changes require a short contract note: affected types, data shape, component props, tests, and migration steps.
- Integrator merges surfaces only after typecheck, lint, tests, and docs are aligned.
- Use `docs/integration-checklist.md` before final merge, preview deployment, or client handoff.

## Required Handoff Format

Use this exact format in final handoffs:

```md
## Summary
- What changed

## Files Changed
- path: reason

## Validation
- command: result

## Contracts
- Data shapes, env vars, routes, props, or auth assumptions changed

## Risks / Follow-ups
- Known gaps or next steps
```

## PR Checklist

- [ ] Product brief and metric definitions are current.
- [ ] UI works on mobile and desktop.
- [ ] Loading, empty, and error states are handled.
- [ ] New metrics are pure, typed, documented, and tested.
- [ ] Secrets are not committed.
- [ ] `.env.example` is updated for new config.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] Deployment docs reflect the target platform.
