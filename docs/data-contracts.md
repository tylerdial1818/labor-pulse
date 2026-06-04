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

type SegmentMetadata = {
  dimension: "industry" | "gender" | "state";
  id: string;
  label: string;
  seriesId: string | null;
  geography?: "US" | string;
  source: "FRED" | "Anthropic Economic Index" | "FRED-compatible metadata";
  sourceUrl: string | null;
  units: string | null;
  status: "available" | "unavailable";
  unavailableReason?: "unsupported_combination" | "not_ingested" | "source_not_confirmed";
  caveat: string;
};
```

#### Metrics Powered

| Metric | Definition source | Owner |
| --- | --- | --- |
| Current value | `docs/metric-definitions.md` | Data Model + Analytics Agent |
| Delta vs comparison period | `docs/metric-definitions.md` | Data Model + Analytics Agent |
| Sparkline history | `docs/metric-definitions.md` | Data Model + Analytics Agent |

#### Transformation Logic

1. Fetch FRED series metadata and observations server-side. v1.6 FRED refresh requests 11 years so indicator and composite read models can expose at least a 10-year window where source data exists.
2. Validate response payloads with Zod before insertion.
3. Convert `"."` observation values to `null`.
4. Upsert by `(seriesId, geography, date)` into normalized `observations` when `DATABASE_URL` is configured; local development can still fall back to the JSON store.
5. Compute current value as the latest non-null observation.
6. Compute monthly deltas against 12 months prior and weekly deltas against 4 weeks prior.

#### Quality Checks

- Zod validation covers external response shape.
- Missing values are retained as null, not coerced to 0.
- Delta returns unavailable when comparison history is insufficient.
- Refresh failures are logged without deleting last-good values.
- Metric-detail breakdowns are shown only when Labor Pulse has an explicit source mapping for the selected metric and dimension.

#### Caveats

- FRED values can be revised by source agencies; freshness and source links must be visible.
- Frequency differs by series, so UI labels must not imply daily data.
- v1.6 segment support is source-backed but uneven: industry is exposed for payrolls, earnings, JOLTS openings, quits, layoffs where mapped, and weekly hours; gender is exposed for unemployment, participation, and employment-population; state is exposed for unemployment, payrolls, participation, and initial claims; age is exposed for unemployment, participation, and partial employment-population coverage. Unsupported metric/breakdown combinations are not inferred.
- v1.6 stores and displays at least 10 years of history for core FRED indicators after the next successful FRED refresh.

### Source: FRED Breakdown Series

| Field | Value |
| --- | --- |
| Owner | Backend/API Agent + Data Model + Analytics Agent |
| Status | active in v1.6 |
| Refresh frequency | Metric detail pages may fetch supported FRED series server-side; report export uses the same metric-specific mappings |
| Grain | series, segment, observation date |
| Access method | Server-side FRED API client using `FRED_API_KEY` |
| Source files | `src/lib/segments/catalog.ts`, `src/lib/indicators/segments.ts`, `src/server/segment-data.ts`, `src/components/indicators/metric-breakdowns-panel.tsx`, `src/app/api/export/report/route.ts` |

#### Supported Dimensions

| Dimension | Supported metrics | Caveat |
| --- | --- | --- |
| Industry | `PAYEMS`, `CES0500000003`, `JTSJOL`, `JTSQUR`, `JTSLDR`, `AWHAETP` where public FRED sector series are mapped | Sector series can differ in seasonal adjustment and are comparisons, not always decompositions |
| Gender | `UNRATE`, `CIVPART`, and `EMRATIO` | Uses BLS/FRED published gender categories |
| State | `UNRATE`, `PAYEMS`, `CIVPART`, and `ICSA` | State initial claims are not seasonally adjusted |
| Age | `UNRATE`, `CIVPART`, and partial `EMRATIO` | Uses BLS/FRED published age groups. Employment-population age coverage is partial |

Unsupported combinations must be omitted or marked unavailable. Do not synthesize state, gender, or industry splits from national metrics.

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

### Source: Eloundou et al. GPTs are GPTs Occupation Exposure

| Field | Value |
| --- | --- |
| Owner | Data Model + Analytics Agent |
| Status | scaffolded |
| Refresh frequency | Manual or ad hoc when upstream repository changes |
| Grain | O*NET-SOC occupation |
| Access method | Original OpenAI GitHub CSV: `https://raw.githubusercontent.com/openai/GPTs-are-GPTs/main/data/occ_level.csv` |
| Source files | `src/lib/ai-impact/eloundou.ts`, `scripts/ingest-eloundou-exposure.ts`, `src/lib/db/relational-store.ts` |

#### Schema

```ts
type AiExposureScore = {
  occupationSocCode: string;
  occupationTitle: string;
  exposureScore: number; // dv_rating_beta, 0-1
  exposureCategory: "low" | "moderate" | "high";
};
```

#### Transformation Logic

1. Fetch original `occ_level.csv`.
2. Validate required columns: `O*NET-SOC Code`, `Title`, and `dv_rating_beta`.
3. Use `dv_rating_beta` as the default exposure score.
4. Categorize scores as low `<0.33`, moderate `0.33-0.66`, high `>=0.66`.
5. Upsert into relational `ai_exposure_scores`.

#### Caveats

- This is potential task exposure to LLMs and complementary tools, not observed adoption or employment displacement.
- Do not present exposure scores as layoff risk, automation probability, or net job impact.
- Keep source attribution visible on AI Impact surfaces.

### Source: NY Fed Labor Market for Recent College Graduates

| Field | Value |
| --- | --- |
| Owner | Data Model + Analytics Agent + Backend/API Agent |
| Status | scaffolded in v1.7 |
| Refresh frequency | Quarterly for headline unemployment and underemployment, annual for outcomes by major |
| Grain | date, cohort, major where available |
| Access method | Public NY Fed workbook downloaded by `scripts/ingest-underemployment.ts`; deterministic seed data backs local builds |
| Source files | `src/lib/underemployment/**`, `src/types/underemployment.ts`, `scripts/ingest-underemployment.ts` |

#### Schema

```ts
type MajorProfile = {
  id: number;
  name: string;
  category: string | null;
  isCommonOnline: boolean;
  current: {
    cohort: "recent_grads" | "all_grads";
    date: string;
    underemploymentRate: number;
    unemploymentRate: number;
    medianWageCollegeJob: number;
    medianWageNonCollegeJob: number;
    shareInLowWageJobs: number;
    shareWithGraduateDegree: number;
  };
  history: Array<{ date: string; underemploymentRate: number }>;
  wagePremium: number;
  rankAmongAllMajors: number;
};
```

#### Transformation Logic

1. Locate the NY Fed workbook from the college labor market page.
2. Parse workbook sheets with `xlsx` and validate discovered URLs with Zod.
3. Preserve public source attribution and as-of dates on every display.
4. Use deterministic seed rows when the workbook is unavailable so local builds and UI tests remain stable.

#### Caveats

- The current v1.7 build includes normalized schema and ingestion scaffolding, but the workbook sheet-to-table mapping still needs a production hardening pass before relying on live NY Fed rows.
- Major-level rates are estimates and should be interpreted as broad clusters rather than precise rank positions.
