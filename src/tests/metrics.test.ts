import { describe, expect, it } from "vitest";
import {
  buildIndicatorMetricSummary,
  buildSparklineHistory,
  calculateDeltaMetric,
  formatDeltaMetric,
  formatIndicatorValue,
  getComparisonDate,
  getCurrentObservation,
  revenueGrowth,
  sumRevenue,
  targetAttainment,
  weightedWinRate
} from "@/lib/analytics/metrics";
import { filterAccounts, filterRevenueByPeriod, filterSegmentPerformance } from "@/lib/data-processing/dashboard-filters";
import { parseFredObservationValue, toLaborPulseObservations } from "@/lib/data-processing/observations";
import { accountRows, revenueSeries, segmentPerformance } from "@/lib/data-processing/sample-data";
import { getIndicatorById, getIndicatorsByCategory, indicatorCatalog } from "@/lib/indicators/catalog";
import { getIndicatorSegments, markSegmentAvailability } from "@/lib/indicators/segments";
import type { Observation } from "@/types/labor-pulse";

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

describe("labor pulse indicator catalog", () => {
  it("defines the v1 15-indicator catalog across the required categories", () => {
    expect(indicatorCatalog).toHaveLength(15);
    expect(getIndicatorsByCategory("lagging")).toHaveLength(6);
    expect(getIndicatorsByCategory("leading")).toHaveLength(6);
    expect(getIndicatorsByCategory("tech_impact")).toHaveLength(3);
  });

  it("requires methodology notes for Tech and AI proxy indicators", () => {
    const techIndicators = getIndicatorsByCategory("tech_impact");

    expect(techIndicators.every((indicator) => indicator.isProxy)).toBe(true);
    expect(techIndicators.every((indicator) => Boolean(indicator.methodologyNote))).toBe(true);
  });
});

describe("labor pulse segment model", () => {
  it("exposes FRED-compatible gender metadata without marking missing observations as available", () => {
    const unemployment = getIndicatorById("UNRATE");
    if (!unemployment) throw new Error("Expected UNRATE to exist in the catalog.");

    const segments = getIndicatorSegments(unemployment, { dimensions: ["gender"] });

    expect(segments).toHaveLength(2);
    expect(segments.map((segment) => segment.seriesId)).toEqual(["LNS14000001", "LNS14000002"]);
    expect(segments.every((segment) => segment.status === "unavailable" && segment.unavailableReason === "not_ingested")).toBe(true);
  });

  it("marks unsupported indicator and breakdown combinations unavailable", () => {
    const claims = getIndicatorById("ICSA");
    if (!claims) throw new Error("Expected ICSA to exist in the catalog.");

    expect(getIndicatorSegments(claims, { dimensions: ["gender"] })).toEqual([
      expect.objectContaining({
        dimension: "gender",
        seriesId: null,
        status: "unavailable",
        unavailableReason: "unsupported_combination"
      })
    ]);
  });

  it("exposes source-backed age metadata for supported household-survey metrics", () => {
    const unemployment = getIndicatorById("UNRATE");
    if (!unemployment) throw new Error("Expected UNRATE to exist in the catalog.");

    const segments = getIndicatorSegments(unemployment, { dimensions: ["age"] });

    expect(segments).toHaveLength(4);
    expect(segments.map((segment) => segment.seriesId)).toEqual(["LNS14000012", "LNS14000036", "LNS14000060", "LNS14024230"]);
    expect(segments.every((segment) => segment.status === "unavailable" && segment.unavailableReason === "not_ingested")).toBe(true);
  });

  it("only marks a segment available when stored observations exist", () => {
    const payrolls = getIndicatorById("PAYEMS");
    if (!payrolls) throw new Error("Expected PAYEMS to exist in the catalog.");

    const [segment] = getIndicatorSegments(payrolls, { dimensions: ["industry"] });
    if (!segment) throw new Error("Expected PAYEMS industry segment metadata.");

    expect(markSegmentAvailability(segment, false)).toMatchObject({ status: "unavailable", unavailableReason: "not_ingested" });
    expect(markSegmentAvailability(segment, true)).toMatchObject({ status: "available", unavailableReason: undefined });
  });
});

describe("labor pulse metric helpers", () => {
  const unemployment = getIndicatorById("UNRATE");
  const claims = getIndicatorById("ICSA");

  if (!unemployment || !claims) {
    throw new Error("Expected test indicators to exist in the catalog.");
  }

  const observations: Observation[] = [
    { seriesId: "UNRATE", geography: "US", date: "2024-04-01", value: 3.5 },
    { seriesId: "UNRATE", geography: "US", date: "2025-04-01", value: 3.8 },
    { seriesId: "UNRATE", geography: "US", date: "2025-05-01", value: null },
    { seriesId: "UNRATE", geography: "CA", date: "2025-05-01", value: 5.1 },
    { seriesId: "ICSA", geography: "US", date: "2025-04-05", value: 225_000 },
    { seriesId: "ICSA", geography: "US", date: "2025-05-03", value: 210_000 }
  ];

  it("uses the latest non-null observation as the current value", () => {
    expect(getCurrentObservation(unemployment, observations)).toEqual({
      seriesId: "UNRATE",
      geography: "US",
      date: "2025-04-01",
      value: 3.8
    });
  });

  it("compares monthly indicators to the same date 12 months prior", () => {
    const delta = calculateDeltaMetric(unemployment, observations);

    expect(getComparisonDate("2025-04-01", "monthly")).toBe("2024-04-01");
    expect(delta).toMatchObject({
      status: "available",
      value: 0.2999999999999998,
      currentDate: "2025-04-01",
      comparisonDate: "2024-04-01",
      comparisonValue: 3.5
    });
  });

  it("compares weekly indicators to four weeks prior", () => {
    expect(calculateDeltaMetric(claims, observations)).toMatchObject({
      status: "available",
      value: -15_000,
      currentDate: "2025-05-03",
      comparisonDate: "2025-04-05",
      comparisonValue: 225_000
    });
  });

  it("returns unavailable instead of zero when comparison history is missing", () => {
    const delta = calculateDeltaMetric(unemployment, [
      { seriesId: "UNRATE", geography: "US", date: "2025-04-01", value: 3.8 }
    ]);

    expect(delta).toEqual({
      status: "unavailable",
      reason: "missing_comparison_observation",
      currentDate: "2025-04-01",
      comparisonDate: "2024-04-01"
    });
  });

  it("preserves null observations as sparkline gaps", () => {
    expect(buildSparklineHistory(unemployment, observations)).toEqual([
      { date: "2024-04-01", value: 3.5 },
      { date: "2025-04-01", value: 3.8 },
      { date: "2025-05-01", value: null }
    ]);
  });

  it("builds a deterministic indicator metric summary", () => {
    expect(buildIndicatorMetricSummary(unemployment, observations)).toMatchObject({
      geography: "US",
      current: { date: "2025-04-01", value: 3.8 },
      delta: { status: "available", comparisonDate: "2024-04-01" },
      lastUpdatedAt: "2025-05-01"
    });
  });

  it("formats current values and deltas from stored numeric values", () => {
    const payrolls = getIndicatorById("PAYEMS");

    expect(formatIndicatorValue(unemployment, 3.8)).toEqual({ status: "available", text: "3.8%" });
    expect(formatDeltaMetric(unemployment, calculateDeltaMetric(unemployment, observations))).toEqual({
      status: "available",
      text: "+0.3 pp"
    });

    if (!payrolls) throw new Error("Expected PAYEMS to exist in the catalog.");

    expect(formatIndicatorValue(payrolls, 158_000)).toEqual({ status: "available", text: "158.0M jobs" });
    expect(formatIndicatorValue(payrolls, null)).toEqual({ status: "unavailable", text: "not available" });
  });
});

describe("labor pulse observation processing", () => {
  it("maps FRED missing values to null, not zero", () => {
    expect(parseFredObservationValue(".")).toBeNull();
    expect(parseFredObservationValue("0")).toBe(0);
    expect(parseFredObservationValue("not-a-number")).toBeNull();
  });

  it("defaults observations to US geography for v1.5 readiness", () => {
    expect(
      toLaborPulseObservations("UNRATE", [
        { date: "2025-01-01", value: "4.0" },
        { date: "2025-02-01", value: "." }
      ])
    ).toEqual([
      { seriesId: "UNRATE", geography: "US", date: "2025-01-01", value: 4 },
      { seriesId: "UNRATE", geography: "US", date: "2025-02-01", value: null }
    ]);
  });
});
