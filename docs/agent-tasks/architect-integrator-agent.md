# Architect/Integrator Agent Task

## Objective

Maintain system coherence, approve contracts, integrate parallel work, and keep documentation aligned.

## Scope

- Architecture decisions
- Cross-feature data contracts
- Integration sequencing
- Final quality gate

## Allowed Files

- `AGENTS.md`
- `README.md`
- `docs/**`
- `src/types/**`
- `src/config/**`
- Small integration edits across `src/**`

## Forbidden Files

- Large feature rewrites without owning agent handoff
- Secret values or unapproved deployment credentials

## Implementation Steps

1. Read all active agent handoffs.
2. Identify contract collisions and ownership conflicts.
3. Update shared types and docs when contracts change.
4. Run quality commands.
5. Produce final integration handoff.

## Test Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Handoff Requirements

- Integrated changes summary
- Contract changes
- Validation results
- Remaining risks
