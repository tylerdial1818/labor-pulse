# Agent Team Workflow

Use the role templates in `docs/agent-tasks` to split work safely across parallel Codex agents.

## Operating Model

1. Architect/Integrator owns contracts and final merge.
2. Product/UX defines scope, flows, and acceptance criteria.
3. Data and backend agents establish typed data contracts.
4. Frontend and visualization agents build product surfaces from those contracts.
5. Security and QA agents review before deployment.
6. Deployment agent ships only after checks pass.

## Handoff Expectations

Every agent must report:

- Summary of changes
- Files touched
- Validation commands and results
- Contract changes
- Risks and follow-ups

## Conflict Rules

- If two agents need the same file, pause and route through Architect/Integrator.
- Shared type changes require a short contract note.
- Metric formula changes require updated tests and `docs/metric-definitions.md`.
- Security-sensitive changes require `docs/security-model.md` updates.

## Recommended Branch Names

- `agent/architecture-contracts`
- `agent/product-ux`
- `agent/data-analytics`
- `agent/backend-api`
- `agent/frontend-dashboard`
- `agent/visual-polish`
- `agent/security-auth`
- `agent/qa-testing`
- `agent/deployment`
