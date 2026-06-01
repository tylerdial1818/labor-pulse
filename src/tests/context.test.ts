import { describe, expect, it } from "vitest";

import { buildHistoricalContext, comparablePeriod, percentileRank, yearsOfHistory } from "@/lib/context/calculate";
import type { ObservationPoint } from "@/server/labor-types";

const observations: ObservationPoint[] = [
  { seriesId: "UNRATE", geography: "US", date: "2020-01-01", value: 2 },
  { seriesId: "UNRATE", geography: "US", date: "2021-01-01", value: null },
  { seriesId: "UNRATE", geography: "US", date: "2022-01-01", value: 4 },
  { seriesId: "UNRATE", geography: "US", date: "2023-01-01", value: 8 },
  { seriesId: "UNRATE", geography: "US", date: "2024-01-01", value: 10 }
];

describe("historical context calculations", () => {
  it("calculates percentile rank from non-null observations", () => {
    expect(percentileRank(observations, 8)).toBe(75);
  });

  it("calculates rounded years of available numeric history", () => {
    expect(yearsOfHistory(observations)).toBe(4);
  });

  it("finds the most recent comparable prior period", () => {
    const current = { seriesId: "UNRATE", geography: "US", date: "2024-01-01", value: 4.02 };

    expect(comparablePeriod(observations, current)).toMatchObject({
      date: "2022-01-01",
      value: 4
    });
  });

  it("builds deterministic context prose without mutating missing observations to zero", () => {
    expect(buildHistoricalContext("UNRATE", observations)).toMatchObject({
      seriesId: "UNRATE",
      currentValue: 10,
      percentileRank: 100,
      yearsOfHistory: 4,
      comparablePeriod: null
    });
  });

  it("returns null when no numeric history is available", () => {
    expect(buildHistoricalContext("UNRATE", [{ seriesId: "UNRATE", geography: "US", date: "2024-01-01", value: null }])).toBeNull();
  });
});
