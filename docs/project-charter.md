# Project Charter

This is the first strategic document for any client-facing analytical web application built from this template. Use it to align future agents on why the app exists, who it serves, what success looks like, and which constraints matter.

## 1. Project Summary

| Field | Value |
| --- | --- |
| Project name | Labor Pulse |
| One-sentence description | Continuously maintained public US labor market research service with source-backed indicators, transparent composite measures, and citable analysis. |
| Current stage | build |
| Primary owner | Architect/Integrator Agent |
| Last updated | 2026-07-17 |

## 2. Problem Statement

Describe the problem in plain language.

- **Problem being solved:** Researchers need a single, citable dashboard for tracking US labor market direction without mixing deterministic data with generated claims.
- **Who experiences it:** Workforce and labor policy researchers preparing executive-level briefings.
- **Why it matters:** Executive audiences need clear, source-backed labor market signals and explicit caveats around technology and AI impact.
- **Current pain points:** Indicators are scattered across sources, leading and lagging signals are often conflated, and AI impact proxies are easy to overstate.

## 3. Target Users

- **Primary users:** Workforce and labor policy researchers on executive insights teams.
- **Secondary users:** Public-sector researchers, higher-ed researchers, policy analysts, and economic journalists.
- **User roles/personas:** Researcher producing charts, source notes, and concise interpretations for senior leadership.
- **Technical sophistication:** moderate
- **Access needs:** public

## 4. Core Workflows

| Workflow name | User | Trigger | Desired outcome | Success criteria |
| --- | --- | --- | --- | --- |
| Default browsing | Researcher | Opens `/` | Understand current and directional US labor market conditions | Three tabs expose all 15 indicators with current values, deltas, sparklines, and update dates |
| Indicator drilldown | Researcher | Clicks an indicator card | Review full history, definition, methodology, and source | Detail route shows chart, time windows, definition, source attribution, and exports |
| Source verification | Researcher | Opens Data & Methods at `/sources` | Verify provenance, definitions, and freshness | Research standards, source coverage, citation guidance, and recent refresh activity remain public |

## 5. Success Metrics

### Product Success Metrics

- Dashboard is credible enough for executive-facing screenshots.
- Users can export chart PNGs and CSV data for external reports.
- Users can cite Labor Pulse pages and identify the original publisher for the underlying data.
- Dashboard loads in under 1 second on cached data.

### Analytical / Business Metrics

- 15 v1 indicators across lagging, leading, and technology/AI impact categories.
- Current value, prior-period delta, sparkline, freshness, source attribution, and caveats where applicable.
- LLM usage is limited to cached plain-English definitions and methodology summaries.

### Adoption / Usage Metrics

- Public researcher use of dashboard, source verification, drilldown, and exports.
- No authentication or personalization in v1.

### Performance Metrics

- Dashboard loads in under 1 second on cached data.
- Typecheck, lint, tests, and production build pass before handoff.
- Dashboard and indicator detail pages meet Lighthouse accessibility score target of 90 or higher.

## 6. Non-Goals

List what this project is intentionally not trying to do. Future agents should treat these as scope boundaries.

- State-level drilldown
- Industry-level disaggregation
- News, research paper, or RSS feeds
- LLM-powered briefing builder
- Item tagging or content classification
- User authentication, accounts, or personalization
- Email alerts or notifications
- International or non-US data
- Paid data sources
- WARN Act notices
- Job posting volume or skill demand data
- Chat interfaces or conversational agents
- Marketing landing pages or hero sections

## 7. Constraints

- **Timeline constraints:** Build v1 in phased multi-agent workstreams.
- **Budget constraints:** Use Vercel, Neon, FRED, OpenAI, and public sources only.
- **Data constraints:** National US data only in v1; schema must preserve a future `geography` field for state-level support.
- **Privacy/security constraints:** Public aggregate data only; no accounts or user-specific state in v1.
- **Technical constraints:** Next.js App Router, TypeScript strict mode, Tailwind, shadcn/ui, Recharts, Drizzle, Neon, Zod validation, OpenAI SDK.
- **Deployment constraints:** Vercel with daily cron at 08:00 UTC for FRED refreshes.

## 8. Data Sources

| Source name | Owner | Access method | Refresh frequency | Sensitivity level | Notes |
| --- | --- | --- | --- | --- | --- |
| FRED API | Federal Reserve Bank of St. Louis | API key query parameter | Daily refresh, source frequencies vary | public | 14 FRED-sourced labor market indicators |
| Anthropic Economic Index | Anthropic | Manual downloaded file import | Ad hoc releases | public | Claude-specific AI usage signal; not a broad AI labor market measure |

## 9. Authentication & Access Model

- **Access model:** public URL
- **User roles:** none in v1
- **Auth provider:** none in v1
- **Permissions:** public read access; cron endpoint protected by bearer secret
- **Sensitive routes:** `/api/cron/refresh-fred` service-only via `CRON_SECRET`

## 10. Deployment Target

- **Hosting platform:** Vercel
- **Environment strategy:** local, preview, production
- **Required environment variables:** `DATABASE_URL`, `FRED_API_KEY`, `OPENAI_API_KEY`, optional `OPENAI_MODEL_DEFINITIONS`, `CRON_SECRET`
- **Production URL:** TBD
- **Staging URL:** Vercel preview deployments

## 11. Design Direction

- **Aesthetic references:** `design_handoff_laborpulse_dashboard` Editorial dashboard handoff.
- **Brand guidelines:** Newspaper-grade analytical tool with serif masthead and numerals, hairline rules, navy accent, semantic green/maroon only for labor-market direction.
- **Tone:** executive, analytical, editorial
- **Public positioning:** Labor Pulse speaks as a public research service. Dialed Intelligence is credited as steward on About and in the global footer.
- **Writing standard:** Public copy uses plain professional language, concrete claims, and natural sentence structure. Site-authored copy uses no em dashes or semicolons and does not expose internal model or generation labels.
- **Accessibility requirements:** AA contrast, visible focus states, semantic landmarks, color never as the only meaning carrier.
- **Responsive design priorities:** Dashboard tab list collapses to a select at narrow widths; chart, card, and table dimensions remain stable.

## 12. Key Risks

| Risk | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| LLM-generated definitions accidentally include numbers | medium | high | Prompt and validation must prohibit quantitative claims; all numbers come from database only | Backend/API Agent |
| Tech and AI indicators are overinterpreted | medium | high | Persistent caveat banner and methodology notes on proxy indicators | Product/UX + Frontend |
| External data shape drift | medium | medium | Zod-validate all FRED responses and log skipped records | Backend/API Agent |
| Anthropic Economic Index release format is unknown | medium | medium | Build manual import script after confirming latest public file format | Data Model + Analytics Agent |

## 13. Open Questions

| Question | Owner | Priority | Status |
| --- | --- | --- | --- |
| Confirm initial FRED backfill depth; recommendation is maximum available history | Architect/Integrator | medium | open |
| Confirm production domain | Deployment/DevOps | low | open |
| Confirm Anthropic Economic Index file shape before ingestion script | Data Model + Analytics | high | open |
| Decide whether analytics/monitoring are deferred for v1 | Architect/Integrator | low | open |

## 14. Agent Guidance

Future agents must:

- Read this file before `AGENTS.md` or immediately after `AGENTS.md`.
- Preserve the project’s stated goals, users, workflows, and success metrics.
- Avoid expanding scope beyond the non-goals unless the charter is updated.
- Update this file when project strategy changes.
- Flag contradictions between implementation tasks and this charter before coding.
- Keep tactical details in `docs/context-brief.md`, contracts, and role handoffs rather than overloading this charter.

## 15. Update Log

| Date | Editor | Change summary |
| --- | --- | --- |
| 2026-07-17 | Codex | Added the institutional public research positioning, Data & Methods standard, citation requirement, Dialed Intelligence stewardship, and public writing rules. |
| 2026-05-30 | Codex | Promoted Labor Pulse v1 brief into the project charter for build kickoff. |
