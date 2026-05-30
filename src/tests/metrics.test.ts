import { describe, expect, it } from "vitest";
import { revenueGrowth, sumRevenue, targetAttainment, weightedWinRate } from "@/lib/analytics/metrics";
import { filterAccounts, filterRevenueByPeriod, filterSegmentPerformance } from "@/lib/data-processing/dashboard-filters";
import { accountRows, revenueSeries, segmentPerformance } from "@/lib/data-processing/sample-data";

describe("analytics metrics", () => {
  it("sums revenue points", () => {
    expect(sumRevenue([{ revenue: 100 }, { revenue: 250 }])).toBe(350);
  });

  it("calculates revenue growth", () => {
    expect(revenueGrowth([{ revenue: 100 }, { revenue: 150 }])).toBe(0.5);
  });

  it("guards against zero target attainment", () => {
    expect(targetAttainment([{ revenue: 100, target: 0 }])).toBe(0);
  });

  it("weights win rate by pipeline", () => {
    const result = weightedWinRate([
      { segment: "Enterprise", pipeline: 100, winRate: 0.2, cycleDays: 10, revenue: 1000 },
      { segment: "SMB", pipeline: 300, winRate: 0.4, cycleDays: 5, revenue: 500 }
    ]);

    expect(result).toBe(0.35);
  });

  it("filters revenue points by reporting period", () => {
    expect(filterRevenueByPeriod(revenueSeries, "90d")).toHaveLength(3);
    expect(filterRevenueByPeriod(revenueSeries, "12m")).toHaveLength(12);
  });

  it("filters accounts by segment and region", () => {
    const result = filterAccounts(accountRows, {
      segment: "Mid-market",
      region: "APAC",
      period: "12m"
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.account).toBe("Atlas Retail Group");
  });

  it("filters segment performance by selected segment", () => {
    expect(filterSegmentPerformance(segmentPerformance, { segment: "SMB", region: "All", period: "12m" })).toEqual([
      { segment: "SMB", pipeline: 4_200_000, winRate: 0.46, cycleDays: 29, revenue: 5_300_000 }
    ]);
  });
});
