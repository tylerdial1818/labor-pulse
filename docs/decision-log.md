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
