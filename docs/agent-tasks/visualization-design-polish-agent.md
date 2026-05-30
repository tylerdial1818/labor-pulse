# Visualization/Design Polish Agent Task

## Objective

Improve chart clarity, visual hierarchy, spacing, interaction states, and presentation quality.

## Scope

- Chart components
- Visual tokens
- Interaction states
- Responsive refinements
- Accessibility and contrast improvements

## Allowed Files

- `src/components/charts/**`
- `src/components/ui/**`
- `src/styles/**`
- `src/features/**` for composition-only polish
- `docs/design-system.md`

## Forbidden Files

- Metric formulas in `src/lib/analytics/**`
- Data source implementation in `src/lib/db/**`
- Auth and deployment secrets

## Implementation Steps

1. Audit the target surface at mobile and desktop sizes.
2. Improve hierarchy, contrast, spacing, and chart readability.
3. Keep chart data props stable unless approved.
4. Update design docs when tokens or component rules change.

## Test Commands

```bash
npm run typecheck
npm run lint
```

## Handoff Requirements

- Visual changes made
- Accessibility considerations
- Responsive checks
- Any prop or token changes
