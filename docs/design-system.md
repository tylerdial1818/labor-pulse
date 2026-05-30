# Design System

## Principles

- Premium analytical product, not marketing site.
- Calm density: strong hierarchy, compact controls, readable tables.
- Color supports meaning and scanability.
- Components are reusable across consulting/client apps.

## Visual Tokens

Tokens live in `src/styles/globals.css` and `tailwind.config.ts`.

- Background: soft cool gray
- Panel: white
- Primary: deep cyan
- Accent: amber
- Success: emerald
- Warning: amber
- Danger: red

## Components

- `src/components/ui`: Button, Card, Badge, KPI Card
- `src/components/charts`: chart wrappers with consistent legends, spacing, and tooltip styling
- `src/components/layout`: app shell, sidebar, top bar
- `src/components/forms`: dashboard filters
- `src/components/states`: loading, empty, and error states

## UX Rules

- First screen should be a working analytical surface.
- Use stable chart heights and responsive grid tracks.
- Keep filters near the data they affect.
- Prefer explicit labels over clever copy.
- Tables should support scanning: aligned numbers, clear health/status badges, and concise column labels.
