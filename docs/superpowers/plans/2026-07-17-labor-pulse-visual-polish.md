# Labor Pulse Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix five visual inconsistencies (home header hierarchy, footer type, nav logo alignment, Research Monitor tags, About page type scale) so every page reads as one deliberate editorial system.

**Architecture:** This is a pure presentation change. No data, types, props, or logic change. Every fix replaces an off-system value with the convention the codebase already uses on 5+ other pages — we are conforming to the existing design system, not inventing one. Two exceptions are explicitly called out and justified: the home page gains a visible `<h1>` (Task 2), and Research Monitor tags gain an interactive/static distinction (Task 4).

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, Tailwind CSS 3.4, TypeScript. Fonts: Newsreader (serif, via `next/font/google`, exposed as `--lp-serif`) and Helvetica Neue (sans, system stack, `--lp-sans`). Design tokens live in `src/styles/globals.css` and are mapped to Tailwind utilities in `tailwind.config.ts`.

---

## Global Constraints

These apply to **every** task. They were derived by counting actual usage across `src/`, not invented.

**The house type conventions (do not deviate):**

| Role | Exact classes | Uses |
|---|---|---|
| Page eyebrow | `font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy` | 6 pages |
| Page `h1` | `mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]` | 8 pages |
| Page lede | `mb-8 mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub` | 5 pages |
| Section `h2` | `font-serif text-2xl font-semibold` | 15 of 16 |
| Long-form prose | `font-serif text-[17px] leading-[1.55] text-ink` | cross-file |
| Secondary prose | `font-serif text-[15px] leading-[1.5] text-sub` | 10 uses |
| `<main>` wrapper | `mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8` | 9 of 11 |

**The house chip/callout language:** `border border-rule bg-[var(--lp-navy-tint)]` with `text-navy`. Used **26+ times** across `src/`. Corners are **sharp** — house chips apply no `rounded-*` class. Prefer the literal `bg-[var(--lp-navy-tint)]` over the `bg-accent` Tailwind token: `accent`/`accent-foreground` are defined in `tailwind.config.ts` but used **zero** times, and `AGENTS.md` says follow established patterns. Do not introduce a second way to say the same thing.

**Rules:**
- Never use `bg-faint`. `--lp-faint` (`#9a9186`) is a **text** color (used for de-emphasized numerals), not a background. See Task 4.
- Do not add dependencies. Do not touch `tailwind.config.ts` or `globals.css` — every value needed already exists.
- Do not change any user-facing copy except the two additions specified verbatim in Tasks 2 and 6.
- `AGENTS.md` requires: semantic landmarks, "clear hierarchy, restrained color", and "Preserve color contrast in charts and badges."

**On testing — read this before Step 1 of any task.**

This repo has **no component test harness**: `vitest.config.ts` sets `environment: "node"`, `@testing-library/react` is not installed, and all 6 files in `src/tests/` are pure-logic tests of calculation functions. `playwright` is present as a transitive dep but `@playwright/test` is not installed and no browser test config exists.

Writing a red-green unit test for a Tailwind class string would mean asserting that a string equals itself — it would restate the diff, not verify it, and would need a new test stack to do it. So this plan does **not** fake a TDD cycle. Instead each task carries verification that can actually fail:

1. **A grep assertion** that fails before the change and passes after (this is the executable red-green step).
2. **`npm run typecheck && npm run lint`** — catches real breakage.
3. **A browser check with a named, falsifiable expectation** — the actual test for visual work.

Do not skip step 3. These are visual fixes; if you have not looked at the page, you have not verified the task. Per `superpowers:verification-before-completion`: evidence before assertions.

**Setup (run once, before Task 1):**

```bash
cd /Users/tylerdial/Documents/Projects/personal/LaborPulse/labor-pulse
npm run dev
```

Leave the dev server running in a second terminal for the whole plan and reload after each task. If `npm run dev` fails to boot (this app reads a Neon store and `src/app/page.tsx` is `force-dynamic`), stop and report it — do not proceed blind, and do not substitute a source grep for looking at the page.

**Working tree note:** `git status` shows 7 of the 8 files this plan touches are already modified vs `HEAD`, and `src/components/layout/site-footer.tsx` is **untracked**. There is uncommitted work in progress here. Before Task 1, run `git stash list` and `git diff --stat` and confirm with the user that the current working tree is the intended baseline. Do not `git checkout`/`stash`/`reset` anything.

---

### Task 1: Align the masthead logo baseline

Fixes complaint #3: *"US MARKET MONITOR in the upper nav bar is misaligned with the Labor Pulse icon... it looks crooked."*

**Why it's crooked:** `src/components/layout/top-bar.tsx:32` aligns the wordmark and the tagline with `items-end`, which aligns the **bottoms of the two boxes**. But the two spans are set in different fonts (Newsreader serif at 23px vs Helvetica sans at 10.5px), and each font places its baseline at a different depth inside its own em box. Aligning box bottoms therefore leaves the two baselines at different heights — which is exactly what the eye reads as "crooked." The `pb-[1px]` on the tagline is a previous hand-tuned attempt to shim this by eye; it is a symptom, not a fix.

`items-baseline` aligns the actual text baselines regardless of font metrics. That is the correct tool, and it makes the shim unnecessary.

**Files:**
- Modify: `src/components/layout/top-bar.tsx:32-37`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing. `TopBar` keeps its exact signature `export function TopBar()`.

- [ ] **Step 1: Confirm the failing state**

```bash
grep -n 'items-end gap-3\|pb-\[1px\]' src/components/layout/top-bar.tsx
```

Expected: **2 matches** (lines 32 and 34). These are the two things this task removes.

- [ ] **Step 2: Look at it in the browser first**

Open http://localhost:3000. Zoom the browser to 200% and look at the masthead. Expected: the baseline of "Labor Pulse" and the baseline of "US LABOR MARKET MONITOR" do **not** sit on the same line — the tagline rides slightly low. Note what you see; you will compare after.

- [ ] **Step 3: Make the change**

In `src/components/layout/top-bar.tsx`, replace lines 32-37 with:

```tsx
        <Link href="/" className="inline-flex w-fit items-baseline gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">
          <span className="whitespace-nowrap font-serif text-[23px] font-bold leading-none tracking-[-0.015em] text-ink">Labor Pulse</span>
          <span className="whitespace-nowrap font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.16em] text-navy">
            US Labor Market Monitor
          </span>
        </Link>
```

Two changes only: `items-end` → `items-baseline`, and `pb-[1px]` deleted from the tagline span.

Leave the parent `<div>` on line 31 alone. Its `md:items-end` aligns the whole `<Link>` against the `<nav>` beside it — that is a different axis and it is correct.

- [ ] **Step 4: Verify the grep assertion flips**

```bash
grep -n 'items-baseline gap-3' src/components/layout/top-bar.tsx && grep -c 'pb-\[1px\]' src/components/layout/top-bar.tsx
```

Expected: line 32 matches `items-baseline gap-3`, and the `pb-[1px]` count is **0**.

- [ ] **Step 5: Verify in the browser**

Reload http://localhost:3000 at 200% zoom. Expected: the bottoms of the "L" in "Labor Pulse" and the "U" in "US LABOR MARKET MONITOR" now sit on one continuous line. Check at 320px, 768px, and 1440px widths — at `<768px` the flex direction changes to column, so confirm the logo still reads correctly stacked.

- [ ] **Step 6: Typecheck and lint**

```bash
npm run typecheck && npm run lint
```

Expected: both pass, no new errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/top-bar.tsx
git commit -m "fix(nav): align masthead wordmark and tagline on a shared baseline

items-end aligned box bottoms, which left the serif wordmark and sans
tagline on different baselines because each font seats its baseline at a
different depth. items-baseline aligns the text itself, so the hand-tuned
pb-[1px] shim is no longer needed."
```

---

### Task 2: Give the home page a visible page title

Fixes complaint #1: *"The fonts/sizing in the home page header look off."*

**What's actually wrong.** Four separate defects stack up in this one block:

1. **There is no visible `h1`.** `src/features/dashboard/dashboard-shell.tsx:26` sets the `h1` to `sr-only`. So the eyebrow (10.5px) sits directly above a 19px paragraph with no anchor between them — a 10.5px → 19px ramp where every other page goes 10.5px → **40px** → 16px. That missing 40px anchor *is* the "off" feeling. This is why the user's quoted text ran the eyebrow, the invisible heading, and the lede together: the DOM has a heading there, but the page never shows it.
2. **There are two `<h1>` elements on this page** — the `sr-only` one above, and "Labor Market Dashboard" at `dashboard-content.tsx:118`. That is an invalid document outline and an a11y defect against the `AGENTS.md` semantics rule.
3. **The lede is off-system**: `max-w-4xl font-serif text-[19px] leading-[1.5] text-ink` vs the house lede `max-w-3xl font-serif text-base italic leading-[1.4] text-sub`. Note `text-[19px]` is used exactly twice in the entire codebase (here and About).
4. **`<main>` has no top padding** — `pb-12` with no `pt-*`, while 9 of 11 pages use `py-[26px]`. The intro jams against the masthead's 2px rule.

**Decisions (confirmed with the user, do not re-litigate):**
- The visible `h1` is **"U.S. Labor Market Monitor"** — it echoes the masthead tagline and the `<title>` in `layout.tsx:10`.
- "Labor Market Dashboard" **demotes to `h2`**, becoming a section heading for the indicator region.
- The service statement **normalizes to the house lede** (16px italic grey).

**Files:**
- Modify: `src/features/dashboard/dashboard-shell.tsx:23-43`
- Modify: `src/features/dashboard/dashboard-content.tsx:114-121`

**Interfaces:**
- Consumes: `getDashboardData()` and `getCurrentHeadlineRates()` — unchanged, do not touch the data layer.
- Produces: nothing. `DashboardShell` and `DashboardContent` keep their exact signatures. `PageHeader` stays a private function in `dashboard-content.tsx`.

- [ ] **Step 1: Confirm the failing state**

```bash
grep -rn '<h1' src/features/dashboard/
```

Expected: **2 matches** — `dashboard-shell.tsx:26` (`sr-only`) and `dashboard-content.tsx:118`. Two `h1`s on one page is the bug. After this task the same grep must return exactly **1**.

- [ ] **Step 2: Replace the intro block**

In `src/features/dashboard/dashboard-shell.tsx`, replace lines 23-43 with:

```tsx
      <main className="mx-auto max-w-[1180px] px-4 pb-12 pt-[26px] sm:px-6 lg:px-8">
        <section className="border-b border-rule pb-6" aria-labelledby="service-introduction">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Public labor market research</p>
          <h1 id="service-introduction" className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">
            U.S. Labor Market Monitor
          </h1>
          <p className="mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
            Labor Pulse is a continuously maintained public research service for understanding change in the U.S. labor market. It brings official indicators, transparent composite measures, and careful analysis into one citable workspace for policy researchers and workforce leaders.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-sub">
            <span>{indicatorCount} core indicators</span>
            <span aria-hidden="true">·</span>
            <span>U.S. national coverage</span>
            <span aria-hidden="true">·</span>
            {data.refreshedAt ? (
              <span>Latest refresh {formatPublicDate(data.refreshedAt)}</span>
            ) : (
              <a className="text-navy hover:underline" href="/sources">
                Refresh status in Data & Methods
              </a>
            )}
          </div>
        </section>
```

Five changes, each deliberate:
- `<main>`: `pb-12` → `pb-12 pt-[26px]`. This adds the missing top padding. We keep `pb-12` rather than moving to the canonical `py-[26px]` because the bottom gap above the footer is not part of this complaint and 48px reads correctly under this page's dense content — don't change what isn't broken.
- `<section>`: `py-6` → `pb-6`. The top spacing now comes from `<main>`'s `pt-[26px]`; keeping both would stack 26px + 24px = 50px above the eyebrow.
- `h1`: `sr-only` → the house `h1` classes, with new visible text. Keep `id="service-introduction"` — the section's `aria-labelledby` on the same line still points at it and now names the section with visible text, which is strictly better.
- Lede: `max-w-4xl ... text-[19px] leading-[1.5] text-ink` → `max-w-3xl ... text-base italic leading-[1.4] text-sub`. Copy is unchanged. No `mb-8` — the meta row's `mt-4` handles that gap.
- Meta row: `text-[11px] font-semibold tracking-[0.1em]` → `text-[10.5px] font-bold tracking-[0.14em]`. It was a near-miss of the eyebrow directly above it (11 vs 10.5px, 0.1 vs 0.14em, semibold vs bold) — three tiny mismatches that read as sloppy rather than deliberate. Now it is the *same* micro-style in `text-sub` instead of `text-navy`, so the pair reads as one intentional system: navy label above, grey meta below.

- [ ] **Step 3: Demote the dashboard heading to `h2`**

In `src/features/dashboard/dashboard-content.tsx`, replace lines 114-121 with:

```tsx
function PageHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5 py-[26px]">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-ink">Labor Market Dashboard</h2>
        <p className="mt-2 font-serif text-base italic leading-[1.4] text-sub">Current conditions, leading signals, and measures of technological change.</p>
      </div>
```

`h1` → `h2`, and `text-[clamp(32px,5vw,40px)] font-bold leading-none tracking-[-0.02em]` → the house `h2` style `text-2xl font-semibold` (24px). Drop `whitespace-nowrap` and the clamp: both existed to manage a 40px heading, and at 24px the text no longer needs either — `whitespace-nowrap` would now be a latent overflow risk on narrow screens for no benefit.

Do not touch anything below line 121 — the legend `<div>`, `LegendDot`, and the rest of `PageHeader` stay exactly as they are.

- [ ] **Step 4: Verify the grep assertion flips**

```bash
grep -rn '<h1' src/features/dashboard/
```

Expected: exactly **1** match — `dashboard-shell.tsx`, the visible "U.S. Labor Market Monitor". Also confirm the orphaned sizes are gone:

```bash
grep -rn 'sr-only\|text-\[19px\]\|clamp(32px' src/features/dashboard/
```

Expected: **1** match only — the pre-existing `<h2 id="dashboard-tabs" className="sr-only">Indicator groups</h2>` at `dashboard-content.tsx:61`. That one is correct and must stay: it names the tablist region for screen readers.

- [ ] **Step 5: Verify in the browser**

Reload http://localhost:3000. Expected, in order down the page:
1. Navy 10.5px eyebrow "PUBLIC LABOR MARKET RESEARCH", with clear breathing room below the masthead rule (not jammed against it).
2. **A large 40px serif "U.S. Labor Market Monitor"** — this is the fix; it was invisible before.
3. The service statement in 16px grey italic serif.
4. The uppercase meta row, visibly the same micro-type as the eyebrow but grey.
5. Further down, "Labor Market Dashboard" now clearly *smaller* (24px) than the page title, reading as a section heading beside the legend.

Confirm the heading ramp reads 40 → 24, not 19 → 40 (which is what it did before — the page's biggest text used to be *below* its intro).

- [ ] **Step 6: Verify the document outline**

```bash
curl -s http://localhost:3001/ | grep -o '<h1[^>]*>[^<]*' | grep -v 'Preparing dashboard'
```

Expected: exactly **one** line, the visible title `U.S. Labor Market Monitor`.

The `grep -v` is not fudging the result. `src/app/loading.tsx` renders `LoadingState`, whose own `<h1>Preparing dashboard</h1>` is this route's Suspense loading boundary; because `page.tsx` is `force-dynamic`, that boundary is streamed into the initial HTML and swapped out client-side. So raw `curl` always sees it, and a bare `grep -c '<h1'` reports **2** even when the page is correct. It is a separate document that never coexists with the real title in the live DOM. Excluding it by name is precise; counting it would make this check permanently red.

If curl returns nothing the dev server isn't serving — use the browser devtools Elements panel and confirm one `<h1>` instead.

- [ ] **Step 7: Typecheck and lint**

```bash
npm run typecheck && npm run lint
```

Expected: both pass.

- [ ] **Step 8: Commit**

```bash
git add src/features/dashboard/dashboard-shell.tsx src/features/dashboard/dashboard-content.tsx
git commit -m "fix(home): give the home page a visible h1 and a single document outline

The h1 was sr-only, so the header ramped 10.5px straight to a 19px lede
with no anchor, while a second h1 sat further down the page. Promote the
intro to a visible 40px house h1, demote 'Labor Market Dashboard' to h2,
normalize the lede and meta row to house type, and restore the missing
top padding on main."
```

---

### Task 3: Match the footer to the page type system

Fixes complaint #2: *"The footer doesn't seamlessly match the content on the pages in terms of fonts/sizing. Only requires subtle tweaks."*

The user is right that this is subtle — and it is genuinely only **two** values. Counting actual usage found only two off-system numbers, and it disproved a third assumption worth recording:

- **`text-[10px]` column heads** (lines 25, 37) vs the house eyebrow `text-[10.5px]`. Everything else about them already matches (`font-bold uppercase tracking-[0.14em] text-navy`) — it's a 0.5px near-miss, which is exactly the kind of thing that reads as "not quite right" without being nameable.
- **The wordmark** (line 19) is `font-serif text-xl font-semibold` — 20px/600, no tracking — while the masthead wordmark is 23px/700 with `tracking-[-0.015em]`. Same two words, three different values. Matching them makes the footer close the page the way the masthead opens it.
- **Do NOT change the 15px blurb on line 20.** I assumed it should be 15.5px and checked: `text-[15px]` has **10** uses sitewide and `text-[15.5px]` has 7, so 15px *is* the dominant idiom and the footer is already correct. Leave it alone.
- **Do NOT change `text-sm` on lines 26, 38, 45.** `text-sm` has 64 uses — it's the established sans idiom, not an anomaly.

**Files:**
- Modify: `src/components/layout/site-footer.tsx:19`, `:25`, `:37`

**Interfaces:**
- Consumes: `appConfig` from `@/config/app` — unchanged.
- Produces: nothing. `SiteFooter` keeps its signature and its slot in `layout.tsx:34`.

- [ ] **Step 1: Confirm the failing state**

```bash
grep -n 'text-\[10px\]\|text-xl font-semibold' src/components/layout/site-footer.tsx
```

Expected: **3 matches** — line 19 (wordmark), lines 25 and 37 (column heads).

- [ ] **Step 2: Match the wordmark to the masthead**

In `src/components/layout/site-footer.tsx`, replace line 19:

```tsx
          <p className="font-serif text-[23px] font-bold leading-none tracking-[-0.015em]">Labor Pulse</p>
```

These are the exact classes from `top-bar.tsx:33` minus `whitespace-nowrap` and `text-ink` (the footer's parent already sets `text-ink` on line 16).

- [ ] **Step 3: Match both column heads to the house eyebrow**

Line 25 becomes:

```tsx
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Explore</p>
```

Line 37 becomes:

```tsx
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Stewardship</p>
```

Only `text-[10px]` → `text-[10.5px]` in each. These are now character-identical to the page eyebrows.

- [ ] **Step 4: Verify the grep assertion flips**

```bash
grep -c 'text-\[10px\]\|text-xl' src/components/layout/site-footer.tsx
```

Expected: **0**.

```bash
grep -c 'font-sans text-\[10.5px\] font-bold uppercase tracking-\[0.14em\] text-navy' src/components/layout/site-footer.tsx
```

Expected: **2**.

- [ ] **Step 5: Verify in the browser**

Scroll to the footer on http://localhost:3000, then compare it against the masthead at the top of the same page. Expected: "Labor Pulse" in the footer is now the same size and weight as "Labor Pulse" in the masthead — the page opens and closes on the same mark. Expected: "EXPLORE" and "STEWARDSHIP" are visibly the same micro-type as the "PUBLIC LABOR MARKET RESEARCH" eyebrow above them. The 15px serif blurb should look unchanged (it was already right).

- [ ] **Step 6: Typecheck and lint**

```bash
npm run typecheck && npm run lint
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/site-footer.tsx
git commit -m "fix(footer): match footer type to the page system

Column heads were 10px against the 10.5px house eyebrow, and the footer
wordmark was 20px/600 untracked against the masthead's 23px/700/-0.015em.
Left the 15px serif blurb alone — 15px is the dominant body idiom, so it
was already correct."
```

---

### Task 4: Rebuild the Research Monitor tags

Fixes complaint #4: *"The tags on the Research Monitor page are a visually unappealing dark grey. Please make them look better (whatever change you recommend)."*

**Why they're grey — and why it's worse than it looks.** All three tag styles use `bg-faint`. But `--lp-faint` (`#9a9186`) is defined as a **text** colour for de-emphasized content — its only other uses are the greyed numerals in `limitations-section.tsx` and `methodology-section.tsx`. Used as a *background* it produces a muddy mid-taupe block on `#fbfaf6` paper. That's the "unappealing dark grey."

The real problem is contrast. `insight-feed.tsx:76` puts `text-sub` (`#6b6258`) on `bg-faint` (`#9a9186`): that is **1.93:1**, a clear WCAG AA failure (needs 4.5:1) and a direct violation of the `AGENTS.md` rule "Preserve color contrast in charts and badges." So this is an accessibility bug, not only a taste issue. They are also `rounded-badge` (10px) blobs on a site whose 26 other chips are sharp-cornered.

**The recommendation.** Don't invent a new tag style — the codebase already contains the right answer in two places, and these three are the only holdouts. Adopt the house chip language (`border border-rule bg-[var(--lp-navy-tint)]`, navy text, sharp corners), and use it to encode a distinction the page currently lacks:

- **Interactive tags** (the Topics filter links, which navigate) get the **navy tint + navy text + hover** treatment. Navy on navy-tint measures **8.69:1**.
- **Static tags** (the card's descriptive tags, which do nothing) get the **outlined grey** treatment — copied verbatim from `insight-card.tsx:27`, which already had this right. `text-sub` on paper is **5.72:1**, passing AA.

So the filters now *look* clickable and the card tags look like metadata, which is what each actually is. That earns the visual change instead of just repainting it.

**Files:**
- Modify: `src/components/insights/insight-filters.tsx:54`
- Modify: `src/components/insights/insight-feed.tsx:51`, `:76`

**Interfaces:**
- Consumes: `getInsightFilterOptions()`, `buildHref()`, `InsightSummary` — all unchanged.
- Produces: nothing. `InsightFilters` and `InsightFeed` keep their exact props.

- [ ] **Step 1: Confirm the failing state**

```bash
grep -rn 'bg-faint' src/
```

Expected: **3 matches** — `insight-filters.tsx:54`, `insight-feed.tsx:51`, `insight-feed.tsx:76`. After this task the same grep must return **0**.

- [ ] **Step 2: Look at the damage first**

Open http://localhost:3000/insights. Expected: a row of rounded dark-taupe pills after the word "Topics", plus taupe pills on each card. On the card tags specifically, note how the grey text nearly disappears into the grey background — that's the 1.93:1 failure.

- [ ] **Step 3: Restyle the interactive Topics filter tags**

In `src/components/insights/insight-filters.tsx`, replace line 54:

```tsx
            className="border border-rule bg-[var(--lp-navy-tint)] px-2.5 py-1 font-semibold text-navy transition-colors hover:border-navy hover:bg-paper"
```

`rounded-badge bg-faint ... text-ink` → house chip. Font size still comes from the parent `<div>`'s `text-xs` on line 48 — do not add a size here. The `hover:` pair is new and intentional: these are `<a>` links that had **no** hover feedback at all.

- [ ] **Step 4: Restyle the source-type label**

In `src/components/insights/insight-feed.tsx`, replace line 51:

```tsx
              <p className="mt-3 inline-flex border border-rule bg-[var(--lp-navy-tint)] px-2.5 py-1 font-sans text-[10.5px] font-bold uppercase tracking-[0.12em] text-navy">
```

This one is a *label*, not a tag, so it keeps the navy-tint fill to hold its own in the left column. `text-xs` (12px) → `text-[10.5px] font-bold` brings it onto the house micro-type scale; 12px uppercase at `0.12em` tracking was chunky.

- [ ] **Step 5: Restyle the static card tags**

In `src/components/insights/insight-feed.tsx`, replace line 76:

```tsx
                  <span key={tag} className="border border-rule px-2 py-1 font-sans text-[10px] uppercase tracking-[0.08em] text-sub">
```

These classes are copied character-for-character from `insight-card.tsx:27`. This is the fix for the 1.93:1 contrast failure.

- [ ] **Step 6: Verify the grep assertions flip**

```bash
grep -rn 'bg-faint\|rounded-badge' src/components/insights/
```

Expected: **0** matches.

```bash
grep -rn 'bg-faint' src/
```

Expected: **0** matches anywhere in the codebase. `--lp-faint` remains defined in `globals.css` and correctly used as `text-faint` in two files — that is fine and must not be removed.

- [ ] **Step 7: Verify in the browser**

Reload http://localhost:3000/insights. Expected:
- The Topics row is now sharp-cornered, very pale navy-tinted chips with navy text — legible, quiet, and obviously clickable. Hover one: border darkens to navy and the fill goes to paper.
- The source-type label ("Source profile" / "Latest source update") is a small navy-tinted uppercase label.
- The card tags at the bottom of each entry are outlined grey, clearly readable, and clearly *not* interactive.
- Nothing on the page is taupe anymore. The filter chips above ("All", "curated sources") should now look like they belong to the same family as the Topics chips.

Tab through the Topics links and confirm focus rings still show (`:focus-visible` is global in `globals.css`).

- [ ] **Step 8: Typecheck and lint**

```bash
npm run typecheck && npm run lint
```

Expected: both pass.

- [ ] **Step 9: Commit**

```bash
git add src/components/insights/insight-filters.tsx src/components/insights/insight-feed.tsx
git commit -m "fix(insights): replace bg-faint tags with the house chip language

--lp-faint is a text color; used as a background it produced muddy taupe
pills, and text-sub on it measured 1.93:1 — a WCAG AA failure against the
AGENTS.md badge-contrast rule. Adopt the navy-tint chip used 26x elsewhere
and split the treatment by behavior: interactive filter tags get navy tint
+ hover (8.69:1), static card tags get the outlined grey already used in
insight-card (5.72:1)."
```

---

### Task 5: Normalize the About page type scale

Fixes complaint #5: *"Fonts/styling on the about page aren't perfectly consistent with the other pages."*

**What's actually inconsistent — and what only looks it.** Auditing all 12 serif declarations on the page:

- The four `font-serif text-2xl font-semibold` `h2`s are **correct** (15 of 16 sitewide). Do not touch them.
- The `h1` on line 47 is **correct** (matches 8 pages). Do not touch it.
- `text-lg font-semibold` on line 69 is a fine `h3` idiom (`text-lg` has 8 uses). Leave it.
- **Line 52 is `text-[19px]`.** `text-[19px]` exists in only two places sitewide: here and the home page — and Task 2 just removed the home one. So after Task 2 this is the **only 19px on the entire site**, an orphan size. Worse, it's the same kind of prose as lines 91 and 109 on this very page, which are 17px. One page, three sizes (19/17/15.5) for equivalent body copy.
- **Lines 58 and 100 are `text-[15.5px]`** where the dominant secondary-prose size is `text-[15px]` (10 uses vs 7). Another 0.5px near-miss.

This task collapses the page onto two body sizes: **17px** for prose, **15px** for asides.

**Files:**
- Modify: `src/app/about/page.tsx:52`, `:58`, `:100`

**Interfaces:**
- Consumes: `appConfig`, the local `publications` and `principles` arrays — all unchanged.
- Produces: nothing. `AboutPage` keeps its default export.

- [ ] **Step 1: Confirm the failing state**

```bash
grep -c 'text-\[19px\]\|text-\[15.5px\]' src/app/about/page.tsx
```

Expected: **3** (lines 52, 58, 100).

- [ ] **Step 2: Bring the Mission paragraph onto the house prose size**

In `src/app/about/page.tsx`, replace line 52:

```tsx
            <p className="mt-3 max-w-3xl font-serif text-[17px] leading-[1.55] text-ink">
```

Only `text-[19px]` → `text-[17px]`. This now matches lines 91 and 109 on the same page, and `text-[17px] leading-[1.55] text-ink` is a real cross-file pattern (About plus the underemployment sections). Copy unchanged.

- [ ] **Step 3: Bring both asides onto the house aside size**

Line 58 becomes:

```tsx
            <p className="mt-2 font-serif text-[15px] leading-[1.5] text-sub">
```

Line 100 becomes:

```tsx
            <p className="mt-2 font-serif text-[15px] leading-[1.5] text-sub">
```

Only `text-[15.5px]` → `text-[15px]` in each. `font-serif text-[15px] leading-[1.5] text-sub` is now character-identical to the footer blurb and `featured-analysis-card.tsx:13`.

- [ ] **Step 4: Verify the grep assertions flip**

```bash
grep -c 'text-\[19px\]\|text-\[15.5px\]' src/app/about/page.tsx
```

Expected: **0**.

```bash
grep -rn 'text-\[19px\]' src/
```

Expected: **0** matches sitewide — the orphan size is fully retired.

- [ ] **Step 5: Verify in the browser**

Open http://localhost:3000/about and compare against http://localhost:3000/sources side by side. Expected: the Mission paragraph is now the same size as the Stewardship and Collaboration paragraphs further down (it was noticeably larger). The two right-hand asides ("Who it serves", "Acknowledgments") match the footer blurb's size. Section headings are unchanged. The page should read as the same document as `/sources`.

- [ ] **Step 6: Typecheck and lint**

```bash
npm run typecheck && npm run lint
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "fix(about): collapse the page onto the house body type scale

The page used three sizes (19/17/15.5px) for equivalent prose. text-[19px]
was an orphan — the only other use was the home lede, now normalized — and
15.5px was a near-miss of the dominant 15px aside size. Now 17px prose and
15px asides throughout."
```

---

### Task 6: Add the missing About page lede

This completes complaint #5. It is split from Task 5 because it is the one change here that **adds visible copy** — a reviewer could reasonably approve Task 5's size normalization and reject this, so it gets its own gate.

**Why:** every other page runs eyebrow → `h1` → **italic lede** → content. About runs eyebrow → `h1` → straight into a bordered `<section>`. It is the only page whose title has nothing under it, and that structural gap is a real part of "not consistent with the other pages."

**The copy is not invented.** `src/app/about/page.tsx:8` already contains the page's own meta description: *"The mission, research principles, and stewardship behind Labor Pulse."* Other pages' ledes echo their meta descriptions (compare `insights/page.tsx:13` against `:49-51`), so reusing it here follows the established pattern rather than inventing voice. It is also not redundant with the Mission section: the lede previews the page's three sections; the Mission states the mission.

**Files:**
- Modify: `src/app/about/page.tsx:47-49`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing.

- [ ] **Step 1: Confirm the failing state**

```bash
grep -A1 '<h1' src/app/about/page.tsx | grep -c 'italic'
```

Expected: **0** — no lede follows the `h1`. Compare with a page that has one:

```bash
grep -A2 '<h1' src/app/sources/page.tsx | grep -c 'italic'
```

Expected: **1**. That's the gap this task closes.

- [ ] **Step 2: Add the lede**

In `src/app/about/page.tsx`, insert a new paragraph directly after the `h1` on line 47, so lines 46-49 read:

```tsx
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">About</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">About Labor Pulse</h1>
        <p className="mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          The mission, research principles, and stewardship behind Labor Pulse.
        </p>
```

The classes are the house lede minus `mb-8`: the following `<section>` already carries `mt-7`, and adjacent sibling margins collapse to the larger of the two, so `mb-8` would be a redundant declaration that changes spacing by 4px. Do not modify the `<section className="mt-7 ...">` on the next line.

- [ ] **Step 3: Verify the grep assertion flips**

```bash
grep -A1 '<h1' src/app/about/page.tsx | grep -c 'italic'
```

Expected: **1**.

- [ ] **Step 4: Verify in the browser**

Reload http://localhost:3000/about and compare the top ~200px against `/sources`, `/ai-impact`, and `/insights`. Expected: all four now show the identical eyebrow → 40px title → 16px grey italic lede structure. About should no longer be the odd one out.

- [ ] **Step 5: Full check**

```bash
npm run check
```

Expected: typecheck, lint, and all 6 existing logic test suites pass. (`npm run check` runs all three — see `package.json:14`.)

- [ ] **Step 6: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "fix(about): add the house lede under the page title

About was the only page whose h1 had no lede beneath it. Copy is the page's
own existing meta description, matching how other pages' ledes echo theirs."
```

---

### Task 7: Final verification across the site

No code changes. This task exists because the previous six each verified one page in isolation, and the point of the work is that the pages agree **with each other**.

- [ ] **Step 1: Confirm every off-system value is retired**

```bash
grep -rn 'bg-faint\|text-\[19px\]\|clamp(32px' src/ ; echo "exit: $?"
```

Expected: no output, `exit: 1` (grep found nothing). Any match here means a task regressed.

Then the `rounded-badge` sweep, which has **one known survivor**:

```bash
grep -rn 'rounded-badge' src/
```

Expected: exactly **1** match — `src/features/dashboard/dashboard-content.tsx:82`, the indicator-count badge on the dashboard tabs. No task in this plan touches it and that is deliberate: its `text-faint` is a correct *text*-colour use, and the user did not flag it. It is the last rounded chip on a sharp-cornered site, so it is listed in "Out of scope" below as a follow-up. If this grep returns **0**, someone exceeded the plan; if it returns **2+**, Task 4 regressed.

- [ ] **Step 2: Confirm one h1 per page**

```bash
for p in "" about insights sources ai-impact underemployment; do
  n=$(curl -s "http://localhost:3001/$p" | grep -o '<h1[^>]*>[^<]*' | grep -vc 'Preparing dashboard')
  echo "/$p → $n h1"
done
```

Expected: every route reports exactly `1`. See Task 2 Step 6 for why `Preparing dashboard` is excluded — it is the streamed loading boundary from `src/app/loading.tsx`, not a page title.

If curl returns 0 for every route the dev server isn't up — check the browser devtools Elements panel per page instead rather than skipping this.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: build succeeds with no new errors or warnings. This is the last gate before deploy — per the project memory, pushes to GitHub auto-deploy to Vercel, so a broken build here becomes a broken site.

- [ ] **Step 4: Walk every page in the browser**

Visit each of `/`, `/about`, `/insights`, `/sources`, `/ai-impact`, `/underemployment` at 1440px, then at 375px. For each, confirm:
- The masthead wordmark and tagline share one baseline (Task 1).
- Eyebrow → 40px title → 16px italic lede, in that order, with one visible title.
- The footer wordmark matches the masthead wordmark, and the column heads match the page eyebrow.
- Nothing taupe remains on `/insights`.

- [ ] **Step 5: Report before/after**

Capture the home header, the `/insights` Topics row, and the footer. Report what changed against the five original complaints — and flag anything that still looks off rather than declaring done. If a fix didn't land visually, say so with the screenshot; do not report success you haven't seen.

---

## Out of scope — read before you "helpfully" fix these

Do **not** address these in this plan. They are real, but they are not what was asked, and each deserves its own decision.

1. **`src/components/insights/insight-card.tsx` is dead code.** It is defined but never imported or rendered anywhere — `insights/page.tsx` renders `InsightFeed`, not `InsightCard`. This plan *reads* it as the reference for the correct tag style (Task 4, Step 5) but must not modify it. It is a trap: editing it changes nothing on screen. Worth proposing for deletion separately — a dead component that duplicates a live one's job is how the Task 4 inconsistency arose in the first place.
2. **`accent` / `accent-foreground` are defined in `tailwind.config.ts` and used zero times**, while 26 call sites hand-write `bg-[var(--lp-navy-tint)]`. Collapsing those onto the token would be a genuine improvement — and a genuine sitewide refactor. Not now.
3. **`--lp-faint` has no background-safe counterpart.** If chips ever need a neutral fill, the system needs a new token; don't reach for `--lp-faint` again.
4. **`dashboard-content.tsx:82` keeps `rounded-badge`.** After Task 4 it is the only rounded chip left on a site whose other 26 chips are sharp — so it will eventually look like the odd one out. But its `text-faint` usage is *correct* (a text colour used as a text colour), it wasn't flagged, and squaring it is a visual change to the dashboard tabs that deserves its own look. Task 7 asserts it survives so nobody "tidies" it mid-plan.
4. **`underemployment/page.tsx` uses `pb-16 pt-8`** and a 13-use `leading-[1.58]` rhythm found nowhere else. It's the other `<main>` padding outlier. The user didn't flag it and it's self-consistent.
5. **`src/components/layout/app-sidebar.tsx` is dead code** — never imported, same trap as `insight-card.tsx`. It contains a fourth `<h1>` (`text-xl font-semibold`) that renders nowhere. Two dead components both carrying off-system styling is a pattern worth a cleanup pass of its own.
6. **`loading-state.tsx` / `error-state.tsx` use `text-lg`/`text-xl` headings** off the house scale. They're real (rendered by `loading.tsx` and `error.tsx`) but only appear transiently or on error, and neither was flagged.

---

## Self-Review

**Spec coverage** — all five complaints map to tasks:

| # | Complaint | Task |
|---|---|---|
| 1 | Home header fonts/sizing off | Task 2 |
| 2 | Footer doesn't match, subtle tweaks | Task 3 |
| 3 | "US LABOR MARKET MONITOR" misaligned | Task 1 |
| 4 | Research Monitor tags dark grey | Task 4 |
| 5 | About page inconsistent | Tasks 5 and 6 |

**Placeholder scan:** No TBDs. Every step names an exact file and line, shows the literal replacement code, and gives a command with a stated expected result.

**Type consistency:** No types, signatures, or props change anywhere in this plan — it is presentation-only. `TopBar`, `SiteFooter`, `DashboardShell`, `DashboardContent`, `PageHeader`, `InsightFilters`, `InsightFeed`, and `AboutPage` all keep their exact existing signatures. The only structural DOM change is `h1` → `h2` at `dashboard-content.tsx:118`, whose `aria-labelledby` dependency was checked: it has none, and the section's own `sr-only` `h2#dashboard-tabs` at line 61 is untouched. `dashboard-shell.tsx`'s `aria-labelledby="service-introduction"` continues to resolve — Task 2 keeps the `id` on the now-visible `h1`.

**Ordering:** Tasks are independent and can be reviewed or reverted individually. Task 5 before Task 6 only because Step 4 of Task 5 asserts `text-[19px]` is retired sitewide, which depends on Task 2 having landed.
