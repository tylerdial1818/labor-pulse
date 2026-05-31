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

Returns indicator metadata, full observation history, source attribution, freshness, and methodology notes for detail pages and export flows.

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

### Endpoint: `GET /api/cron/refresh-fred`

Service-only Vercel Cron route protected by `Authorization: Bearer $CRON_SECRET`. Refreshes all FRED-sourced indicators, validates responses with Zod, upserts observations, updates series freshness, writes `refresh_log`, and returns a structured summary. Partial failures must not erase last-good dashboard data.
