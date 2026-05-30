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
| Status | active starter |
| Authentication | TODO: enforce before connecting sensitive data |
| Rate limits | Not applicable for local server function |
| Source files | `src/server/dashboard-data.ts`, `src/types/analytics.ts` |

#### Request Schema

```ts
type Request = void;
```

#### Response Schema

```ts
type Response = {
  revenueSeries: RevenuePoint[];
  segmentPerformance: SegmentPerformance[];
  accounts: AccountRow[];
  healthMix: Array<{ health: string; count: number; share: number }>;
  kpis: {
    revenue: number;
    growth: number;
    attainment: number;
    weightedWinRate: number;
  };
  updatedAt: string;
};
```

#### Errors

| Status | Meaning | Client behavior |
| --- | --- | --- |
| thrown error | Data source unavailable or not configured | Show route-level error state |

#### Notes

- TODO: Replace fixture-backed implementation with validated database or API adapter.
- Any response shape change requires updates to `src/types`, dashboard components, tests, and this document.
