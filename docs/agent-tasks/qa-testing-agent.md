# QA/Testing Agent Task

## Objective

Verify behavior, add tests, check accessibility basics, and protect analytical correctness.

## Scope

- Unit tests
- Integration smoke checks
- Accessibility review
- Regression checklist
- Bug reports

## Allowed Files

- `src/tests/**`
- Test utilities
- `docs/**` QA notes
- Small fixes with owner approval

## Forbidden Files

- Broad architecture rewrites
- Metric formula changes without Data Model + Analytics approval
- Auth policy changes without Security/Auth approval

## Implementation Steps

1. Read product brief and metric definitions.
2. Add tests for pure calculations and risky utilities.
3. Smoke test loading, empty, error, and primary dashboard states.
4. Run quality commands.
5. Document failures with file paths and reproduction steps.

## Test Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Handoff Requirements

- Tests added
- Commands run
- Failures found
- Residual risk
