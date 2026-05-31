# Data Contracts

Define source data, refresh frequency, schemas, transformations, metric ownership, and caveats. Keep this file aligned with `docs/metric-definitions.md`, `src/types`, `src/lib/data-processing`, and `src/lib/analytics`.

## Source Contract Template

### Source: TODO

| Field | Value |
| --- | --- |
| Owner | TODO |
| Status | planned, active, deprecated |
| Refresh frequency | TODO |
| Grain | TODO |
| Access method | TODO |
| Source files | TODO |

#### Schema

```ts
type SourceRecord = {
  // TODO
};
```

#### Metrics Powered

| Metric | Definition source | Owner |
| --- | --- | --- |
| TODO | `docs/metric-definitions.md` | TODO |

#### Transformation Logic

1. TODO

#### Quality Checks

- TODO

#### Caveats

- TODO

## Current Sources

### Source: FRED API

| Field | Value |
| --- | --- |
| Owner | Backend/API Agent + Data Model + Analytics Agent |
| Status | planned |
| Refresh frequency | Daily app refresh; source series are weekly or monthly |
| Grain | series, geography, observation date |
| Access method | Server-side FRED API client using `FRED_API_KEY` |
| Source files | `src/lib/fred/**`, `src/lib/db/**`, `src/server/**` |

#### Schema

```ts
type FredObservation = {
  date: string;
  value: string; // "." means missing and is stored as null
};

type Series = {
  id: string;
  title: string;
  shortTitle: string;
  category: "lagging" | "leading" | "tech_impact";
  source: "FRED" | "Anthropic Economic Index";
  sourceUrl: string;
  units: string;
  frequency: "weekly" | "monthly" | "quarterly" | "ad_hoc";
  seasonalAdjustment?: string | null;
  isProxy: boolean;
  methodologyNote?: string | null;
  lastRefreshedAt?: string | null;
};

type Observation = {
  seriesId: string;
  geography: "US" | string;
  date: string;
  value: number | null;
};
```

#### Metrics Powered

| Metric | Definition source | Owner |
| --- | --- | --- |
| Current value | `docs/metric-definitions.md` | Data Model + Analytics Agent |
| Delta vs comparison period | `docs/metric-definitions.md` | Data Model + Analytics Agent |
| Sparkline history | `docs/metric-definitions.md` | Data Model + Analytics Agent |

#### Transformation Logic

1. Fetch FRED series metadata and observations server-side.
2. Validate response payloads with Zod before insertion.
3. Convert `"."` observation values to `null`.
4. Upsert by `(seriesId, geography, date)`.
5. Compute current value as the latest non-null observation.
6. Compute monthly deltas against 12 months prior and weekly deltas against 4 weeks prior.

#### Quality Checks

- Zod validation covers external response shape.
- Missing values are retained as null, not coerced to 0.
- Delta returns unavailable when comparison history is insufficient.
- Refresh failures are logged without deleting last-good values.

#### Caveats

- FRED values can be revised by source agencies; freshness and source links must be visible.
- Frequency differs by series, so UI labels must not imply daily data.

### Source: Anthropic Economic Index

| Field | Value |
| --- | --- |
| Owner | Data Model + Analytics Agent |
| Status | planned, file shape to confirm |
| Refresh frequency | Ad hoc manual import |
| Grain | release date, occupation or published category, usage share |
| Access method | Downloaded public release ingested by `scripts/ingest-economic-index.ts` |
| Source files | `scripts/ingest-economic-index.ts`, `src/lib/data-processing/**`, `src/lib/db/**` |

#### Caveats

- Measures Claude usage specifically, not all AI tools.
- Treat as directional context only.
- Do not merge with FRED observations unless the schema explicitly preserves release/source semantics.
