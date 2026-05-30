# Context Brief

This is the shared operating context for all AI agents working in this repository. Update it when project direction, active ownership, architecture decisions, deployment assumptions, auth model, data sources, or major risks change.

## Project Mission

TODO: Describe the decision-making product this analytical web app enables and the client/business outcome it should improve.

## Target Users

| User group | Needs | Success signal |
| --- | --- | --- |
| TODO | TODO | TODO |

## Primary Workflows

1. TODO: User opens the app and understands the current analytical state.
2. TODO: User filters, drills into, or compares data.
3. TODO: User exports, shares, or acts on insights.

## Current Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| App shell | Starter complete | Dashboard shell, filters, KPI cards, charts, table, and states exist. |
| Data | Placeholder | Sample data lives in `src/lib/data-processing/sample-data.ts`. |
| Analytics | Starter complete | Pure metric functions and tests exist in `src/lib/analytics` and `src/tests`. |
| Auth | Placeholder | Auth-ready config exists in `src/lib/auth/auth-options.ts`. |
| Deployment | Ready for setup | Vercel-oriented docs exist; client-specific setup still required. |

## Active Workstreams

| Workstream | Agent owner | Status | Files in scope | Dependencies |
| --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | TODO |

## Current Architecture Decisions

- Next.js App Router with React, TypeScript, Tailwind, and Recharts.
- Business logic belongs in `src/lib/analytics`, `src/lib/data-processing`, or `src/server`.
- UI components should consume typed view models and avoid direct data fetching.
- Contracts live in `docs/api-contracts.md`, `docs/data-contracts.md`, and `src/types`.

## Deployment Target

Default target: Vercel for Next.js deployments.

TODO: Replace with client-approved platform, domains, preview strategy, and production approval flow.

## Authentication Model

Default state: auth-ready placeholder.

TODO: Define public, invite-only, SSO, password-protected, or internal-only access. Document provider, roles, tenant model, and callback URLs.

## Key Data Sources

| Source | Owner | Refresh cadence | Grain | Access method | Status |
| --- | --- | --- | --- | --- | --- |
| Sample dashboard data | Template | Static | Month/account/segment | Local fixture | Placeholder |

## Known Risks

- Metric definitions must be client-approved before production use.
- Sample data must be replaced before client delivery.
- Auth provider, roles, and tenant isolation are not yet configured.
- Exports and downstream sharing rules must be reviewed for sensitive data.

## Current Priorities

1. TODO: Confirm product brief and user workflows.
2. TODO: Confirm data sources and metric definitions.
3. TODO: Configure auth and deployment environment.

## Files Owned By Active Agents

| Agent | Owned files | Coordination required with | Notes |
| --- | --- | --- | --- |
| TODO | TODO | TODO | TODO |

## Update Rules

- Update this file when an agent starts or finishes a major workstream.
- Update this file when architecture, auth, deployment, or data-source assumptions change.
- Keep entries brief. Link to detailed docs instead of duplicating long explanations.
