import type { AccountRow, DashboardFilters, RevenuePoint, SegmentPerformance } from "@/types/analytics";

const periodWindow: Record<DashboardFilters["period"], number> = {
  "30d": 2,
  "90d": 3,
  "12m": 12
};

export function filterRevenueByPeriod(points: RevenuePoint[], period: DashboardFilters["period"]) {
  return points.slice(-periodWindow[period]);
}

export function filterAccounts(rows: AccountRow[], filters: DashboardFilters) {
  return rows.filter((row) => {
    const segmentMatch = filters.segment === "All" || row.segment === filters.segment;
    const regionMatch = filters.region === "All" || row.region === filters.region;
    return segmentMatch && regionMatch;
  });
}

export function filterSegmentPerformance(rows: SegmentPerformance[], filters: DashboardFilters) {
  return filters.segment === "All" ? rows : rows.filter((row) => row.segment === filters.segment);
}
