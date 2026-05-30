# Backend/API Agent Task

## Objective

Implement secure server-side data loading, API integrations, database access, and validation.

## Scope

- Server functions
- API route handlers
- Database/service clients
- Input validation
- Data source error handling

## Allowed Files

- `src/server/**`
- `src/lib/db/**`
- `src/lib/data-processing/**`
- `src/types/**`
- `.env.example`
- `docs/architecture.md`
- `docs/deployment.md`

## Forbidden Files

- `src/components/ui/**`
- `src/components/charts/**`
- `src/styles/**` unless coordinated
- Auth policy changes unless paired with Security/Auth Agent

## Implementation Steps

1. Confirm data contract with Architect/Integrator.
2. Add environment variable placeholders.
3. Implement server-only data access.
4. Validate external data before returning view models.
5. Add tests for transformations and failure cases.

## Test Commands

```bash
npm run typecheck
npm run test
npm run build
```

## Handoff Requirements

- Data sources and freshness
- Env vars added
- Error states exposed to UI
- Contract changes
