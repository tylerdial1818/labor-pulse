# Handoff Spec: Home page, scroll-led Ledger (option A2)

## Overview

Tyler picked option A2 from a design exploration. It keeps the Editorial Ledger look (Newsreader serif, hairline rules, paper ground, navy accent) and adds a small set of scroll behaviors so the page feels more alive without turning into a marketing site.

`home-ledger-scroll-led.reference.html` in this folder is a standalone visual reference. It already uses this repo's tokens and nav. Treat it as a picture of the intent. Do not copy its markup into `src`. Rebuild it with the existing components, Tailwind classes, and live data.

The reference was designed from the public site's content only. It leaves out provenance that this repo requires on every number (source, as-of date, change since last period, sparkline). Keep all of that. The goal is to change layout and motion, not to remove information.

## Read this before coding (decisions that need Tyler's approval)

These items conflict with `docs/design-system.md` or `AGENTS.md`. Raise them in Plan Mode and log the outcome in `docs/decision-log.md`.

| # | Conflict | Recommendation |
|---|----------|----------------|
| 1 | Design system says no hero sections and no decorative animation. A2 adds a ticker, a progress line, and growing bars. | Approve the progress line, bar growth, and sticky nav. Treat the ticker as optional, see item 2. |
| 2 | The ticker moves continuously. WCAG 2.2.2 requires a way to pause moving content, and hover alone is not keyboard accessible. The design system also requires dates, units, and sources visible without hover. | Ship without the ticker first. If Tyler wants it, add a visible Pause button, a fixed "Latest refresh" label at the left edge, and a link on each item to its indicator page. |
| 3 | A2 makes "Underemployment Analytics" the first heading. The repo's home H1 is "U.S. Labor Market Monitor". | Keep "U.S. Labor Market Monitor" as the single H1. Render the featured analysis as an H2 section. |
| 4 | A2 shows indicators as a horizontal snap strip. The design system requires Lagging, Leading, and Tech & AI Impact tabs on `/`, with a select at narrow widths. | Keep the tabs. Apply scroll-snap only to the card row inside the active tab, and keep the existing indicator card content. |
| 5 | A2 uses a large centered masthead with a sticky nav below it. The current `TopBar` is a compact row on every page. | Large masthead on `/` only. Sticky compact nav with the wordmark on all pages. |
| 6 | The "Three measures, three definitions" bar chart puts the NY Fed recent-graduate rate, U-6, and the unemployment rate on one axis. That is a new client-facing presentation. | Add it to `docs/metric-definitions.md`, source values from the underemployment data store, and keep the "definitions differ" caveat visible. |

## Layout

Page order on `/` (desktop, 1180px max width, matching the current container).

1. Optional ticker band (see decision 2).
2. Masthead (home only). Centered wordmark, italic tagline, double rule.
3. Sticky nav bar with a 3px progress line along its bottom edge.
4. Featured analysis. Two columns, text left and the three-bar chart right.
5. Composite signals. Three columns separated by hairlines. Reuse `CompositesStrip` data.
6. Indicators. Existing tabs, with card row scroll-snap (decision 4).
7. Footer (existing `SiteFooter`).

## Design Tokens Used

All tokens already exist in `src/styles/globals.css` and `tailwind.config.ts`. Do not add new colors.

| Token | Value | Usage |
|-------|-------|-------|
| `paper` | #FBFAF6 | Page ground, sticky nav background |
| `ink` | #1C1815 | Text, double rule, bar fill for comparison series |
| `navy` | #24446B | Progress line, emphasized bar, links, focus ring |
| `sub` | #6B6258 | Secondary text, captions |
| `rule` | rgba(28,24,21,0.16) | Hairlines and card borders |
| `muted` | #F1EFE9 | Bar tracks |
| `warning` | #8C5C17 | Caution and Watch status text |
| `font-serif` (Newsreader) | 400 to 700 | Masthead, headings, numerals |
| `font-sans` | Helvetica Neue stack | Nav, labels, captions |

Status text colors follow the labels the site already shows (Caution, Balanced, Watch). Never encode status by color alone, always show the label.

## Components

| Component | Change | Notes |
|-----------|--------|-------|
| `TopBar` (`src/components/layout/top-bar.tsx`) | Sticky variant, progress line, wordmark fade-in | Already a client component. Keep `aria-current` logic. |
| Home masthead | New, home only | Presentational. Lives in `src/features/dashboard`. |
| Featured analysis section | New | Chart uses live underemployment data, not hardcoded numbers. |
| `CompositesStrip` | Restyle only | Keep data props stable. |
| Indicator card row | Layout only | Keep sparkline, delta, source, and as-of date. |

## States and Interactions

| Element | State | Behavior |
|---------|-------|----------|
| Nav link | Hover | Text moves from `sub` to `ink`. Underline offset 4px on text links. |
| Nav link | Current | Existing 2px navy underline. |
| Any link or card | Focus | Existing 2px navy outline with 2px offset. Sticky nav must not cover the focused element, so set `scroll-padding-top` on `html` to the nav height. |
| Card row | Keyboard | Scroll container gets `tabIndex={0}`, a visible focus ring, and an accessible name so arrow keys scroll it. |
| Data missing | Empty | Show "Not available yet" in the card, keep the label and source. Never show 0 or a blank bar. |

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| Desktop (over 1024px) | Layout as above. Featured analysis in two columns. |
| Tablet (768 to 1024px) | Featured analysis stacks, chart below text. Composite signals stay in a row if width allows. |
| Mobile (under 768px) | Masthead scales to about 44px. Nav wraps and the sticky bar keeps only the wordmark plus a menu row that wraps to two lines at most. Composite signals stack. Tabs become the existing select. Card row shows about 1.2 cards so the next card hints at scrolling. |

## Animation and Motion

All scroll behavior is CSS only. Wrap scroll-driven rules in `@supports (animation-timeline: view())` so unsupported browsers show the finished static page. Put keyframes and the `.lp-*` classes in `globals.css`, because Tailwind has no utilities for `animation-timeline`.

| Element | Trigger | Animation | Range | Easing |
|---------|---------|-----------|-------|--------|
| Progress line | Page scroll (`scroll(root)`) | `scaleX` 0 to 1, origin left | Whole page | linear |
| Sticky nav wordmark | Page scroll (`scroll(root)`) | Opacity 0 to 1 | 120px to 260px of scroll | linear |
| Chart bars | Bar enters viewport (`view()`) | `scaleX` 0 to 1, origin left | `entry 10%` to `cover 45%` | ease-out |
| Ticker (optional) | Always | Translate left by 50%, loop | 80s per loop | linear |

Rules

- Base styles must show the finished state. Animation only changes it when a timeline is active. The progress line is the one exception, its base is `scaleX(0)`.
- Under `prefers-reduced-motion: reduce`, turn off every animation above and also set `html { scroll-behavior: auto }`. The current `globals.css` sets smooth scrolling unconditionally.
- No entrance fades or slide-ups on sections or cards. The design system bans delayed animation.

## Content Rules

- Numerals come from `getDashboardData()` and the underemployment store. Nothing in the reference is real data.
- Use existing formatters. Add a pure formatter in `src/lib` with a test if one is missing.
- Long indicator names wrap to two lines in a card. Do not truncate.
- Keep sources and as-of dates visible without hover.
- Placeholder in the reference footer reads `[CONTACT EMAIL]`. Use the real configured contact from `src/config`.

## Accessibility Notes

- Landmarks. `header`, `nav` with an accessible name, one `main`, `section` elements with `aria-labelledby`.
- The progress line is decorative, mark it `aria-hidden`.
- Bars need a text equivalent. Keep the value and label as visible text next to each bar, and give the chart a `figcaption`.
- Status chips always include the word (Caution, Balanced, Watch).
- Contrast. `sub` on `paper` and `warning` on `paper` both pass 4.5 to 1. Do not use `faint` for text.
- Test with keyboard only, with reduced motion on, and with a browser that lacks `animation-timeline`.

## Files

Expect to touch

- `src/components/layout/top-bar.tsx`
- `src/features/dashboard/dashboard-shell.tsx`
- `src/features/dashboard/dashboard-content.tsx` (layout only)
- `src/components/dashboard/composites-strip.tsx` (restyle only)
- `src/styles/globals.css`
- `docs/design-system.md`, `docs/decision-log.md`, `docs/context-brief.md`, `docs/metric-definitions.md`

Avoid

- `src/lib/analytics/**`, `src/lib/db/**`, auth, deployment config, API routes.

## Done When

- `npm run check` passes.
- Home looks right at 390, 768, and 1280 wide.
- Static fallback verified by disabling `animation-timeline` in devtools.
- Decisions 1 to 6 are logged.
