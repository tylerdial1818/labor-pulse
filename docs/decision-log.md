# Decision Log

Use this lightweight ADR-style log for architecture, data, security, deployment, or workflow decisions that future agents should preserve. Add new entries at the top.

## Template

### YYYY-MM-DD: Decision title

- **Decision:** TODO
- **Rationale:** TODO
- **Alternatives considered:** TODO
- **Consequences:** TODO
- **Owner:** TODO

## Decisions

### 2026-05-30: Use a server-only local store for v1 local completeness

- **Decision:** Labor Pulse v1 runs locally from `data/labor-pulse-store.json`, seeded automatically with the v1 indicator catalog and observation history. Production Neon/Postgres remains the intended deployment migration path.
- **Rationale:** The app needs to be fully exercisable without blocking on external credentials or provisioned infrastructure.
- **Alternatives considered:** Blocking v1 on Neon/Drizzle wiring, keeping static UI-only values, calling public APIs from the browser.
- **Consequences:** Routes and UI are data-backed now, but production deployment should replace the file store with a managed database before public launch.
- **Owner:** Architect/Integrator Agent

### 2026-05-30: Build Labor Pulse as a deterministic-first public dashboard

- **Decision:** Labor Pulse v1 is a public app with no user accounts. All numbers, deltas, trends, chart data, and exports must come from structured database records populated from public sources. LLM usage is limited to cached prose definitions and methodology summaries.
- **Rationale:** The target researcher needs defensible, citable outputs for executive reporting. Mixing generated quantitative claims into the dashboard would weaken trust and auditability.
- **Alternatives considered:** LLM-generated summaries with current figures, authenticated private app, client-side external API calls.
- **Consequences:** Data ingestion, validation, source attribution, and export contracts are required before production. No numerical LLM output is allowed.
- **Owner:** Architect/Integrator Agent

### 2026-05-30: Use the Editorial dashboard design handoff as the design source of truth

- **Decision:** All Labor Pulse UI should follow `/Users/tylerdial/Downloads/design_handoff_laborpulse_dashboard`, including the Editorial tokens, typography, hairline rules, tab behavior, caveat treatment, and chart styling.
- **Rationale:** The handoff is approved high-fidelity design and is more specific than the starter template design system.
- **Alternatives considered:** Starter template visual system, looser Tailwind reinterpretation, marketing-style dashboard.
- **Consequences:** Agents must replace the starter sales-dashboard appearance, load Newsreader via `next/font`, map tokens into Tailwind/shadcn variables, avoid shadows, and use semantic green/maroon only for labor-market direction.
- **Owner:** Visualization/Design Polish Agent

### 2026-05-30: Use Next.js, TypeScript, Tailwind, and Recharts as the default stack

- **Decision:** The template uses Next.js App Router, TypeScript, Tailwind CSS, and Recharts for analytical web apps.
- **Rationale:** This stack is familiar, maintainable, deploys cleanly, supports server-side data boundaries, and provides enough visualization capability without overcomplicating the template.
- **Alternatives considered:** Vite SPA, Remix, SvelteKit, custom D3-only visualization layer.
- **Consequences:** Future agents should follow Next.js routing and server/client component conventions. Chart-heavy work should use reusable wrappers in `src/components/charts`.
- **Owner:** Architect/Integrator Agent

### 2026-05-30: Treat contracts and context docs as integration gates

- **Decision:** Agents must update context, decision, API, and data contract docs when they change product direction, architecture, interfaces, or data assumptions.
- **Rationale:** Multi-agent work fails when hidden assumptions drift. Lightweight contract docs reduce merge conflicts and make handoffs auditable.
- **Alternatives considered:** Rely only on code comments and PR descriptions.
- **Consequences:** Documentation updates are required for interface, data, deployment, and auth changes. Integrators should block merges when contracts are stale.
- **Owner:** Architect/Integrator Agent
