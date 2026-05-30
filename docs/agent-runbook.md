# Agent Runbook

This runbook gives each agent role a consistent starting path. Role-specific task templates still live in `docs/agent-tasks`; use those for copy-paste execution prompts.

## Universal Start Sequence

1. Read `AGENTS.md`.
2. Read `docs/project-charter.md`.
3. Read `docs/context-brief.md`.
4. Read the relevant contracts:
   - API changes: `docs/api-contracts.md`
   - Data or metric changes: `docs/data-contracts.md` and `docs/metric-definitions.md`
   - Security changes: `docs/security-model.md`
   - Deployment changes: `docs/deployment.md`
5. State assumptions before coding.
6. List intended files to edit and files to avoid.
7. Update the charter, context, decisions, and contracts when your work changes them.

## Architect Agent

### Responsibilities

- Maintain architecture coherence and shared contracts.
- Resolve file ownership conflicts.
- Approve cross-boundary changes.
- Own final integration readiness.

### Required Reading Order

1. `AGENTS.md`
2. `docs/project-charter.md`
3. `docs/context-brief.md`
4. `docs/decision-log.md`
5. `docs/architecture.md`
6. `docs/api-contracts.md`
7. `docs/data-contracts.md`
8. `docs/integration-checklist.md`

### Files Allowed To Modify

- `AGENTS.md`
- `README.md`
- `docs/**`
- `src/types/**`
- `src/config/**`
- Small integration edits across `src/**`

### Files Requiring Coordination

- `package.json`
- `next.config.ts`
- `src/app/**`
- `src/server/**`
- `src/lib/auth/**`
- `src/lib/db/**`

### Handoff Format

Use the standard handoff in `AGENTS.md`, with explicit contract and ownership notes.

## Frontend Agent

### Responsibilities

- Build product surfaces, layouts, states, forms, tables, and component composition.
- Keep UI responsive, accessible, and aligned with the design system.

### Required Reading Order

1. `AGENTS.md`
2. `docs/project-charter.md`
3. `docs/context-brief.md`
4. `docs/product-brief-template.md`
5. `docs/design-system.md`
6. `docs/api-contracts.md`

### Files Allowed To Modify

- `src/app/**`
- `src/features/**`
- `src/components/layout/**`
- `src/components/forms/**`
- `src/components/states/**`
- `src/components/ui/**`
- `src/hooks/**`

### Files Requiring Coordination

- `src/types/**`
- `src/components/charts/**`
- `src/server/**`
- `docs/api-contracts.md`

### Handoff Format

Include screenshots or viewport notes when relevant, plus props/contracts consumed.

## Backend Agent

### Responsibilities

- Implement server-side data loading, route handlers, external API adapters, validation, and error handling.

### Required Reading Order

1. `AGENTS.md`
2. `docs/project-charter.md`
3. `docs/context-brief.md`
4. `docs/api-contracts.md`
5. `docs/data-contracts.md`
6. `docs/security-model.md`

### Files Allowed To Modify

- `src/server/**`
- `src/lib/db/**`
- `src/lib/data-processing/**`
- `src/types/**`
- `.env.example`
- `docs/api-contracts.md`
- `docs/deployment.md`

### Files Requiring Coordination

- `src/app/api/**`
- `src/lib/auth/**`
- `src/features/**`
- `docs/data-contracts.md`

### Handoff Format

Call out request/response shapes, env vars, auth assumptions, error behavior, and data freshness.

## Analytics Agent

### Responsibilities

- Define metrics, transformations, fixtures, data quality checks, and pure analytical functions.

### Required Reading Order

1. `AGENTS.md`
2. `docs/project-charter.md`
3. `docs/context-brief.md`
4. `docs/data-contracts.md`
5. `docs/metric-definitions.md`
6. `src/lib/analytics/**`

### Files Allowed To Modify

- `src/lib/analytics/**`
- `src/lib/data-processing/**`
- `src/types/**`
- `src/tests/**`
- `docs/data-contracts.md`
- `docs/metric-definitions.md`

### Files Requiring Coordination

- `src/server/**`
- `src/features/**`
- `src/components/charts/**`

### Handoff Format

Include formulas, caveats, edge cases, source assumptions, and test coverage.

## Security Agent

### Responsibilities

- Configure auth, authorization, secret handling, tenant boundaries, and data exposure rules.

### Required Reading Order

1. `AGENTS.md`
2. `docs/project-charter.md`
3. `docs/context-brief.md`
4. `docs/security-model.md`
5. `docs/api-contracts.md`
6. `docs/deployment.md`

### Files Allowed To Modify

- `src/lib/auth/**`
- `src/server/**`
- `src/app/api/**`
- `.env.example`
- `docs/security-model.md`
- `docs/deployment.md`

### Files Requiring Coordination

- `src/features/**`
- `src/lib/db/**`
- `package.json`
- `next.config.ts`

### Handoff Format

Include auth model, role/tenant rules, env vars, data exposure risks, and mitigations.

## QA Agent

### Responsibilities

- Verify correctness, regression risk, accessibility basics, and contract compatibility.

### Required Reading Order

1. `AGENTS.md`
2. `docs/project-charter.md`
3. `docs/context-brief.md`
4. `docs/integration-checklist.md`
5. `docs/api-contracts.md`
6. `docs/data-contracts.md`

### Files Allowed To Modify

- `src/tests/**`
- Test utilities
- QA notes in `docs/**`
- Small bug fixes with owner approval

### Files Requiring Coordination

- `src/lib/analytics/**`
- `src/server/**`
- `src/features/**`
- `src/lib/auth/**`

### Handoff Format

Include commands run, failures found, reproduction steps, coverage added, and residual risk.

## Deployment Agent

### Responsibilities

- Prepare preview and production deployments, environment variable setup, build validation, and rollback notes.

### Required Reading Order

1. `AGENTS.md`
2. `docs/project-charter.md`
3. `docs/context-brief.md`
4. `docs/deployment.md`
5. `docs/security-model.md`
6. `docs/integration-checklist.md`

### Files Allowed To Modify

- `next.config.ts`
- `package.json`
- `.env.example`
- `docs/deployment.md`
- Platform config files when needed

### Files Requiring Coordination

- `src/lib/auth/**`
- `src/server/**`
- `src/app/**`
- CI/CD config

### Handoff Format

Include platform target, build result, required env vars, deployment URL or pending steps, and rollback plan.
