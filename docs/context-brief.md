# Context Brief

This is the shared operating context for all AI agents working in this repository. Update it when project direction, active ownership, architecture decisions, deployment assumptions, auth model, data sources, or major risks change.

## Project Mission

Labor Pulse is a continuously maintained public US labor market research service for people preparing policy and executive-facing work. It provides source-backed indicators, transparent composite measures, visible freshness and caveats, citable pages, and exportable chart and data outputs.

## Target Users

| User group | Needs | Success signal |
| --- | --- | --- |
| Workforce and labor policy researcher | Quickly understand US labor market conditions and cite defensible sources | Can export chart PNGs and CSVs with visible source/freshness metadata |
| Policy analyst or economic journalist | Compare leading and lagging indicators without overstating proxy signals | Uses indicator detail pages and methodology notes in external analysis |

## Primary Workflows

1. User opens `/` and sees the Lagging tab by default with 6 indicator cards.
2. User switches between Lagging, Leading, and Tech & AI Impact tabs; Tech & AI always shows a methodology caveat.
3. User opens `/indicators/[id]` for full history, definition, source attribution, time windows, metric-specific breakdowns, and exports.
4. User uses the detail-page breakdown controls where supported, such as unemployment by gender, age, or state and payroll employment by industry.
5. User opens Data & Methods at `/sources` to review research standards, definitions, source freshness, refresh activity, citation guidance, and corrections contact information.
6. User opens the Research Monitor at `/insights` to review recurring source profiles and dated source updates.

## Current Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| App shell | v1.8 institutional refresh integrated locally | Dashboard, detail, Data & Methods, About, Research Monitor, AI impact, composites, briefings, citations, and a global stewardship footer exist locally. |
| Data | Relational v1.6 scaffold | Core FRED refresh now targets 11 years; metric-detail breakdowns use explicit FRED series mappings and show top 5 comparison lines when a cut has more than 5 mapped segments. |
| Analytics | v1.6 in progress | Current values, deltas, chart axes, composite calculations, deterministic historical context, 10-year windows, and metric-detail report rows are implemented. |
| Auth | v1 omitted | Public app; no user auth. Cron route must require `CRON_SECRET`. |
| Deployment | Planned | Vercel target with daily 08:00 UTC FRED cron; optional 09:00 UTC insights cron requires tier/quota confirmation. |

## Active Workstreams

| Workstream | Agent owner | Status | Files in scope | Dependencies |
| --- | --- | --- | --- | --- |
| Architecture/contracts | Architect/Integrator | in progress | `docs/**`, `src/types/**`, `src/config/**` | Must precede backend/frontend implementation |
| Data model + analytics | Data Model + Analytics Agent | ready to start | `src/types/**`, `src/lib/analytics/**`, `src/lib/data-processing/**`, `src/tests/**`, metric/data docs | Depends on Labor Pulse indicator catalog contract |
| Backend/API | Backend/API Agent | ready after contract review | `src/server/**`, `src/lib/db/**`, API routes, `.env.example`, deployment docs | Depends on data schema/types |
| Frontend/dashboard | Frontend/Dashboard Agent | ready after view-model contract | `src/app/**`, `src/features/**`, layout/forms/states/ui components | Depends on dashboard view-model props |
| Visualization/design polish | Visualization/Design Polish Agent | ready after frontend skeleton | `src/components/charts/**`, design tokens, responsive/a11y polish | Must follow Editorial handoff exactly |
| Underemployment v1.7 | Architect/Integrator + parallel specialists | integrated locally | `src/app/underemployment/**`, `src/components/underemployment/**`, `src/lib/underemployment/**`, briefing/dashboard/nav touchpoints | Live NY Fed workbook mapping still needs production hardening |

## Current Architecture Decisions

- Next.js App Router with React, TypeScript, Tailwind, shadcn/ui, and Recharts.
- Business logic belongs in `src/lib/analytics`, `src/lib/data-processing`, or `src/server`.
- UI components should consume typed view models and avoid direct data fetching.
- Contracts live in `docs/api-contracts.md`, `docs/data-contracts.md`, and `src/types`.
- Labor Pulse uses a deterministic-first rule: every number, delta, and trend comes from the database; LLM output is cached prose only and never quantitative.
- Public copy presents Labor Pulse as a public research service. Dialed Intelligence appears as steward on About and in the footer rather than in the dashboard introduction.
- Public copy does not expose model names, generation labels, seed labels, or other implementation terms. Site-authored copy uses no em dashes or semicolons.
- v1.6 backend read models expose trailing 10-year histories where stored data exists. Detail pages expose all supported industry, gender, age, and state breakdowns for the selected metric when explicit public FRED mappings exist.
- The design source of truth is `/Users/tylerdial/Downloads/design_handoff_laborpulse_dashboard`, especially `README.md`, `tokens.css`, and screenshots.

## Deployment Target

Target: Vercel for Next.js with preview deployments and production promotion after validation. Daily FRED refresh runs at 08:00 UTC via Vercel Cron.

## Authentication Model

Public app, no user authentication in v1. Service-only cron route requires `Authorization: Bearer $CRON_SECRET`.

## Key Data Sources

| Source | Owner | Refresh cadence | Grain | Access method | Status |
| --- | --- | --- | --- | --- | --- |
| FRED API | Federal Reserve Bank of St. Louis | Daily app refresh; source frequencies weekly/monthly | Series/date/geography | Server-side API client | 14 indicators; validate with Zod before storing |
| FRED breakdown series | Federal Reserve Bank of St. Louis | Server-side fetch for metric-detail breakdowns and reports | Series/date/segment | Server-side API client | v1.6 supports verified cuts across payrolls, unemployment, participation, employment-population, claims, earnings, JOLTS, and weekly hours where FRED exposes matching series |
| Anthropic Economic Index | Anthropic | Ad hoc | Release/occupation usage share | Manual import script | Direct Claude usage signal; file shape still needs confirmation |
| Qualitative insight sources | BLS, Federal Reserve, Indeed, Brookings, NBER, LinkedIn | Daily app refresh where public source allows | Article/release summary | Server-side fetch with deterministic fallback summaries | Seeded local feed active; live source robustness needs production monitoring |
| Eloundou GPT exposure | OpenAI GPTs-are-GPTs repository | Manual/ad hoc | O*NET-SOC occupation | Original `occ_level.csv` ingestion | 923 occupation exposure rows imported into Neon locally |
| NY Fed Recent College Graduates | Federal Reserve Bank of New York | Quarterly headline, annual major outcomes | Date/cohort/major | Workbook parser scaffold plus deterministic seed data | v1.7 page uses source-dated seed data until workbook sheet mapping is hardened |

## Known Risks

- FRED and Anthropic data cannot be fetched from the browser.
- Methodology notes must prevent overclaiming Tech & AI proxy indicators.
- LLM definitions must never include numerical values or quantitative claims.
- Anthropic Economic Index release format is not confirmed.
- Design fidelity depends on replacing the starter dashboard look with the Editorial handoff.

## Current Priorities

1. Establish shared Labor Pulse contracts, types, metrics, and docs.
2. Build validated data ingestion, persistence, server read models, and export endpoints.
3. Rebuild the dashboard/detail/sources/about UI using the Editorial design handoff.
4. Validate accessibility, mobile behavior, build, tests, and deployment readiness.

## Files Owned By Active Agents

| Agent | Owned files | Coordination required with | Notes |
| --- | --- | --- | --- |
| Architect/Integrator | `docs/**`, `src/types/**`, `src/config/**` | all implementation agents | Owns contract drift and final integration |
| Data Model + Analytics | `src/lib/analytics/**`, `src/lib/data-processing/**`, `src/types/**`, `src/tests/**`, metric/data docs | Backend, Frontend, Visualization | Owns formulas and view-model expectations |
| Backend/API | `src/server/**`, `src/lib/db/**`, API routes, `.env.example`, deployment docs | Data, Security, Frontend | Owns persistence, ingestion, exports, and server-only data access |
| Frontend/Dashboard | `src/app/**`, `src/features/**`, layout/forms/states/ui | Backend, Visualization | Owns routes and screen composition |
| Visualization/Design Polish | `src/components/charts/**`, `src/styles/globals.css`, visual components with coordination | Frontend, Architect | Owns Editorial token fidelity, charts, responsive polish |

## Update Rules

- Update this file when an agent starts or finishes a major workstream.
- Update this file when architecture, auth, deployment, or data-source assumptions change.
- Keep entries brief. Link to detailed docs instead of duplicating long explanations.
