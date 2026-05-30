# Data Model + Analytics Agent Task

## Objective

Define data contracts, metric formulas, data transformations, and testable analytical logic.

## Scope

- Metric definitions
- Domain types
- Pure calculations
- Data cleaning and shaping
- Fixtures or sample data

## Allowed Files

- `docs/metric-definitions.md`
- `docs/architecture.md`
- `src/types/**`
- `src/lib/analytics/**`
- `src/lib/data-processing/**`
- `src/tests/**`

## Forbidden Files

- `src/components/**` except prop-contract notes
- `src/lib/auth/**`
- Deployment configuration

## Implementation Steps

1. Document formulas and caveats.
2. Define or update shared TypeScript types.
3. Implement pure metric functions.
4. Add edge-case tests.
5. Hand off typed view-model expectations to backend and frontend agents.

## Test Commands

```bash
npm run typecheck
npm run test
```

## Handoff Requirements

- Metric formulas changed
- Data types changed
- Tests added or updated
- Known data caveats
