# Design System

## Principles

- Labor Pulse uses the approved Editorial design handoff in `/Users/tylerdial/Downloads/design_handoff_laborpulse_dashboard`.
- Build a newspaper-grade analytical tool, not a marketing site or generic SaaS dashboard.
- Preserve calm density, strong hierarchy, compact controls, visible provenance, and readable charts/tables.
- Color is semantic: green and maroon appear only when encoding whether a change is favorable or unfavorable for the labor market.

## Visual Tokens

Tokens live in `src/styles/globals.css` and `tailwind.config.ts`. Copy the raw LaborPulse tokens from the design package `tokens.css` and map them to shadcn variables.

- `--lp-navy: #24446B` for links, active tabs, focus rings, and primary series lines.
- `--lp-ink: #1C1815` for foreground, headlines, and numerals.
- `--lp-sub: #6B6258` for secondary and essential meta.
- `--lp-faint: #9A9186` for decorative strokes only; do not use for body text.
- `--lp-paper: #FBFAF6` for page background.
- `--lp-panel: #FFFFFF` for raised surfaces.
- `--lp-rule` and `--lp-hair` for dashboard grid and divider hairlines.
- `--lp-up: #266B3F` and `--lp-down: #8A2E3B` for semantic labor-market direction.
- `--lp-navy-tint: rgba(36,68,107,0.055)` for hover wash, caveat panels, and count badges.

Typography:

- Load Newsreader via `next/font/google` and expose `--lp-serif-font`.
- Use Newsreader/serif for masthead, H1, card titles, section blurbs, caveat body, and numerals.
- Use Helvetica Neue/system sans for navigation, labels, meta, axes, badges, and controls.
- No drop shadows. Use 2px radius by default and hairline rules for structure.

## Components

- `src/components/ui`: shadcn primitives restyled to the Editorial system.
- `src/components/charts`: Recharts sparkline, time-series, and diverging-bar wrappers with no dashboard-card animations.
- `src/components/layout`: top navigation with LaborPulse masthead and Dashboard/Sources/About links.
- `src/components/forms`: time-window controls and future disabled geography selector slot.
- `src/components/states`: loading, empty, and error states

## UX Rules

- First screen should be a working analytical surface.
- Use stable chart heights and responsive grid tracks.
- Dashboard default route is `/` with Lagging, Leading, and Tech & AI Impact tabs.
- Tech & AI Impact always shows the persistent methodology caveat.
- Keep dates, units, sources, and freshness visible without hover.
- Prefer explicit labels over clever copy.
- At narrow widths, replace the tab list with a select.
- No nested cards, decorative emoji, decorative icons, delayed animations, hero sections, or marketing copy.
