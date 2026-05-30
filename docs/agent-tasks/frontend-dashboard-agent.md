# Frontend/Dashboard Agent Task

## Objective

Build feature screens, dashboard layout, filters, tables, and responsive user workflows.

## Scope

- Feature composition
- Layout and responsive behavior
- Filter controls
- Tables and state handling
- Component integration

## Allowed Files

- `src/app/**`
- `src/features/**`
- `src/components/layout/**`
- `src/components/forms/**`
- `src/components/states/**`
- `src/components/ui/**` for small reusable additions

## Forbidden Files

- `src/lib/analytics/**` metric formulas
- `src/lib/db/**`
- `src/lib/auth/**`
- Deployment secrets

## Implementation Steps

1. Read product brief and data contracts.
2. Build the dashboard surface with loading, empty, and error states.
3. Keep business logic out of components.
4. Verify mobile and desktop layouts.
5. Hand off visual polish needs separately when appropriate.

## Test Commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Handoff Requirements

- Screens/components changed
- Props consumed
- Responsive behavior verified
- Remaining UX gaps
