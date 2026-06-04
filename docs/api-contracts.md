# API Contracts

Define every route handler, server action, external API adapter, and export endpoint before or alongside implementation. Keep this file aligned with `src/types`, `src/server`, and any `src/app/api` routes.

## Contract Template

### Endpoint: TODO

| Field | Value |
| --- | --- |
| Method | TODO |
| Path | TODO |
| Owner | TODO |
| Status | planned, active, deprecated |
| Authentication | public, authenticated, role-based, service-only |
| Rate limits | TODO |
| Source files | TODO |

#### Request Schema

```ts
type Request = {
  // TODO
};
```

#### Response Schema

```ts
type Response = {
  // TODO
};
```

#### Errors

| Status | Meaning | Client behavior |
| --- | --- | --- |
| TODO | TODO | TODO |

#### Notes

- TODO

## Current Contracts

### Server Function: `getDashboardData`

| Field | Value |
| --- | --- |
| Method | Server function |
| Path | `src/server/dashboard-data.ts` |
| Owner | Backend/API Agent |
| Status | planned replacement |
| Authentication | public read, server-only data access |
| Rate limits | Not applicable for local server function |
| Source files | `src/server/dashboard-data.ts`, `src/types/**`, `src/lib/db/queries.ts` |

#### Request Schema

```ts
type Request = void;
```

#### Response Schema

```ts
type Response = {
  categories: Array<{
    id: "lagging" | "leading" | "tech_impact";
    label: string;
    blurb: string;
    indicators: IndicatorCardViewModel[];
  }>;
  refreshedAt: string | null;
};

type IndicatorCardViewModel = {
  id: string;
  title: string;
  category: "lagging" | "leading" | "tech_impact";
  source: string;
  sourceUrl: string;
  frequency: "weekly" | "monthly" | "quarterly" | "ad_hoc";
  unitLabel: string;
  currentValue: number | null;
  currentValueFormatted: string;
  currentDate: string | null;
  delta: {
    value: number | null;
    formatted: string;
    periodLabel: string;
    arrowDirection: "up" | "down" | "flat" | "none";
    tone: "up" | "down" | "info" | "muted";
  };
  sparkline: Array<{ date: string; value: number | null }>;
  lastUpdated: string | null;
  isProxy: boolean;
  methodologyNote?: string;
  isStale: boolean;
};
```

#### Errors

| Status | Meaning | Client behavior |
| --- | --- | --- |
| thrown error | Data source unavailable or not configured | Show route-level error state |

#### Notes

- Replace fixture-backed implementation with validated database queries.
- The dashboard must not call FRED, Anthropic, or OpenAI from the browser.
- Any response shape change requires updates to `src/types`, dashboard components, tests, and this document.

### Endpoint: `GET /api/indicators/[id]`

| Field | Value |
| --- | --- |
| Method | GET |
| Path | `/api/indicators/[id]` |
| Owner | Backend/API Agent |
| Status | planned |
| Authentication | public |
| Rate limits | Standard platform limits |
| Source files | `src/app/api/indicators/[id]/route.ts`, `src/server/**`, `src/lib/db/queries.ts` |

Returns indicator metadata, trailing 10-year observation history where stored data exists, source attribution, freshness, and methodology notes for detail pages and export flows.

### Endpoint: `GET /api/definitions/[id]`

| Field | Value |
| --- | --- |
| Method | GET |
| Path | `/api/definitions/[id]` |
| Owner | Backend/API Agent |
| Status | planned |
| Authentication | public |
| Rate limits | Cache-first; platform/OpenAI limits apply on first generation |
| Source files | `src/app/api/definitions/[id]/route.ts`, `src/lib/llm/**`, `src/lib/db/queries.ts` |

Checks the database cache first. On cache miss, calls OpenAI using the definitions model, stores the prose result, and returns it. Prompts must prohibit numerical values, current statistics, and quantitative claims.

### Endpoint: `GET /api/export/csv/[id]`

Public CSV export for one indicator's full observation history. Include series ID, full series title, source, retrieval date, observation date, value, geography, and units.

### Endpoint: `GET /api/export/png/[id]`

Public PNG export for one indicator chart. The rendered image must include chart title, date range, and source attribution.

### Endpoint: `GET /api/export/report`

| Field | Value |
| --- | --- |
| Method | GET |
| Path | `/api/export/report` |
| Owner | Backend/API Agent + Data Model Agent |
| Status | active |
| Authentication | public |
| Rate limits | Standard platform limits |
| Source files | `src/app/api/export/report/route.ts`, `src/lib/db/queries.ts`, `src/lib/segments/catalog.ts`, `src/server/segment-data.ts` |

Public report export for the metric-detail workflow. Query params: `seriesId`/`seriesIds`, `compositeId`/`compositeIds`, `breakdowns=industry|gender|state|age`, `dimension=industry|gender|state|age`, `state`/`states`, and `format=csv|json`. CSV is the default for download links; `format=json` returns the structured report payload. Detail pages pass the selected metric and selected breakdown so exports match the on-page view.

#### Response Schema

```ts
type ReportExportResponse = {
  generatedAt: string;
  requested: {
    seriesIds: string[];
    compositeIds: string[];
    breakdowns: Array<"industry" | "gender" | "state">;
    states: string[];
  };
  indicators: Array<{
    id: string;
    title: string;
    source: string;
    sourceUrl: string | null;
    units: string;
    frequency: string;
    geography: string;
    observations: Array<{ seriesId: string; geography: string; date: string; value: number | null }>;
    caveat: string | null;
  }>;
  composites: Array<{
    id: string;
    name: string;
    source: "Labor Pulse composite";
    units: "Index";
    observations: Array<{ compositeId: string; geography: string; date: string; value: number }>;
    methodologyNote: string;
  }>;
  breakdowns: Array<{
    baseSeriesId: string;
    segments: Array<SegmentMetadata & { observations: Array<{ seriesId: string; geography: string; date: string; value: number | null }> }>;
  }>;
  liveBreakdowns?: Array<{
    baseSeriesId: string;
    availableDimensions: Array<"industry" | "gender" | "state">;
    dimension: "industry" | "gender" | "state";
    stateAbbreviation: string;
    series: Array<{
      segmentLabel: string;
      metricLabel: string;
      seriesId: string;
      units: string;
      sourceLabel: string;
      sourceUrl: string;
      caveat: string;
      observations: Array<{ seriesId: string; geography: string; date: string; value: number | null }>;
    }>;
  }>;
  unavailable: Array<{ id: string; kind: "indicator" | "composite" | "segment"; reason: string }>;
};
```

CSV rows include record type, dimension, segment, metric ID, metric label, source, source URL, retrieval timestamp, observation date, geography, units, value, availability, and caveat. Unsupported metric and breakdown combinations are omitted from the metric-detail export instead of being estimated.

### Endpoint: `GET /api/underemployment/majors`

| Field | Value |
| --- | --- |
| Method | GET |
| Path | `/api/underemployment/majors` |
| Owner | Backend/API Agent |
| Status | active in v1.7 |
| Authentication | public |
| Rate limits | Standard platform limits |
| Source files | `src/app/api/underemployment/majors/route.ts`, `src/lib/underemployment/queries.ts` |

Returns the alphabetized major list for the underemployment lookup tool.

### Endpoint: `GET /api/underemployment/majors/[id]`

| Field | Value |
| --- | --- |
| Method | GET |
| Path | `/api/underemployment/majors/[id]?cohort=recent_grads|all_grads` |
| Owner | Backend/API Agent |
| Status | active in v1.7 |
| Authentication | public |
| Rate limits | Standard platform limits |
| Source files | `src/app/api/underemployment/majors/[id]/route.ts`, `src/lib/underemployment/calculate.ts` |

#### Response Schema

```ts
type Response = {
  profile: MajorProfile;
  historicalContext: {
    percentileRank: number;
    comparablePeriod: { date: string; value: number } | null;
    yearsOfHistory: number;
  };
  similarMajors: Array<{ id: number; name: string; underemploymentRate: number; difference: number }>;
};
```

Invalid ids return `400`; unknown ids return `404`.

### Endpoint: `GET /api/cron/refresh-fred`

Service-only Vercel Cron route protected by `Authorization: Bearer $CRON_SECRET`. Refreshes all FRED-sourced indicators, validates responses with Zod, upserts observations, updates series freshness, writes `refresh_log`, and returns a structured summary. Partial failures must not erase last-good dashboard data.

When `DATABASE_URL` is configured, refresh writes to normalized Neon tables (`series`, `observations`, `refresh_log`) after ensuring schema/catalog existence. Local development without relational data falls back to the JSON store. v1.6 refreshes 11 years of history so detail pages, composites, dashboard sparklines, and exports can display at least a 10-year window.

### Endpoint: `GET /api/insights`

Public feed endpoint. Query params: `category`, `tags`, `since`, `limit`, `sort`. Returns qualitative insight summaries from the dedicated insights store.

### Endpoint: `GET /api/cron/refresh-insights`

Optional service cron route. Protected by `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is set. Fetches configured qualitative sources, summarizes new items with OpenAI when configured, and falls back to deterministic summaries.

### Endpoint: `GET /api/composites/[id]`

Public composite detail endpoint. Returns composite definition, trailing 10-year historical observations where derived data exists, current value, and deterministic interpretation.

### Endpoint: `POST /api/briefings`

Creates a deterministic local briefing from selected indicator, composite, insight, and geography inputs. When `DATABASE_URL` is configured, generated briefings are stored in normalized Neon `briefings`.
