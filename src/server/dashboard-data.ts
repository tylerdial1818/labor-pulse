import { accountRows, revenueSeries, segmentPerformance } from "@/lib/data-processing/sample-data";
import { accountHealthMix, revenueGrowth, sumRevenue, targetAttainment, weightedWinRate } from "@/lib/analytics/metrics";
import type { DashboardData } from "@/types/analytics";

export async function getDashboardData(): Promise<DashboardData> {
  // TODO: Replace sample data with a database or secure API adapter in src/lib/db.
  return {
    revenueSeries,
    segmentPerformance,
    accounts: accountRows,
    healthMix: accountHealthMix(accountRows),
    kpis: {
      revenue: sumRevenue(revenueSeries),
      growth: revenueGrowth(revenueSeries),
      attainment: targetAttainment(revenueSeries),
      weightedWinRate: weightedWinRate(segmentPerformance)
    },
    updatedAt: new Date("2026-05-30T14:00:00.000Z").toISOString()
  };
}
