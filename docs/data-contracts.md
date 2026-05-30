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

### Source: Sample Dashboard Fixture

| Field | Value |
| --- | --- |
| Owner | Data Model + Analytics Agent |
| Status | active starter, replace before production |
| Refresh frequency | Static |
| Grain | Month, segment, account |
| Access method | Local TypeScript fixture |
| Source files | `src/lib/data-processing/sample-data.ts` |

#### Schema

```ts
type RevenuePoint = {
  month: string;
  revenue: number;
  target: number;
  margin: number;
};

type SegmentPerformance = {
  segment: "Enterprise" | "Mid-market" | "SMB";
  pipeline: number;
  winRate: number;
  cycleDays: number;
  revenue: number;
};

type AccountRow = {
  id: string;
  account: string;
  region: "North America" | "EMEA" | "APAC" | "LATAM";
  segment: "Enterprise" | "Mid-market" | "SMB";
  owner: string;
  revenue: number;
  health: "Strong" | "Watch" | "At risk";
  renewalDate: string;
};
```

#### Metrics Powered

| Metric | Definition source | Owner |
| --- | --- | --- |
| Revenue | `docs/metric-definitions.md` | Data Model + Analytics Agent |
| Revenue growth | `docs/metric-definitions.md` | Data Model + Analytics Agent |
| Target attainment | `docs/metric-definitions.md` | Data Model + Analytics Agent |
| Weighted win rate | `docs/metric-definitions.md` | Data Model + Analytics Agent |

#### Transformation Logic

1. Fixture data is imported by `src/server/dashboard-data.ts`.
2. Pure calculations run through `src/lib/analytics/metrics.ts`.
3. Typed values are passed to feature and chart components.
4. Dashboard filters are applied in `src/lib/data-processing/dashboard-filters.ts`.

#### Quality Checks

- Metric edge cases are covered in `src/tests/metrics.test.ts`.
- Any real source should add validation before data reaches UI components.

#### Caveats

- Fixture values are illustrative only.
- Production data sources must define freshness, joins, filters, and access rules.
