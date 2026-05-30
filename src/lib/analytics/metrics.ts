import type { AccountRow, RevenuePoint, SegmentPerformance } from "@/types/analytics";

export function sumRevenue(points: Pick<RevenuePoint, "revenue">[]) {
  return points.reduce((total, point) => total + point.revenue, 0);
}

export function revenueGrowth(points: Pick<RevenuePoint, "revenue">[]) {
  if (points.length < 2) return 0;
  const first = points[0]?.revenue ?? 0;
  const last = points.at(-1)?.revenue ?? 0;
  return first === 0 ? 0 : (last - first) / first;
}

export function targetAttainment(points: Pick<RevenuePoint, "revenue" | "target">[]) {
  const revenue = points.reduce((total, point) => total + point.revenue, 0);
  const target = points.reduce((total, point) => total + point.target, 0);
  return target === 0 ? 0 : revenue / target;
}

export function weightedWinRate(rows: SegmentPerformance[]) {
  const totalPipeline = rows.reduce((total, row) => total + row.pipeline, 0);
  if (totalPipeline === 0) return 0;
  return rows.reduce((total, row) => total + row.winRate * row.pipeline, 0) / totalPipeline;
}

export function accountHealthMix(rows: AccountRow[]) {
  const counts = rows.reduce<Record<AccountRow["health"], number>>(
    (acc, row) => {
      acc[row.health] += 1;
      return acc;
    },
    { Strong: 0, Watch: 0, "At risk": 0 }
  );

  return Object.entries(counts).map(([health, count]) => ({
    health,
    count,
    share: rows.length === 0 ? 0 : count / rows.length
  }));
}
