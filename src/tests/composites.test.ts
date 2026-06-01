import { describe, expect, it } from "vitest";

import { calculateSahmRule, calculateStress, calculateTightness } from "@/lib/composites/calculate";
import type { ObservationPoint } from "@/server/labor-types";

function monthly(seriesId: string, values: Array<number | null>, startYear = 2024): ObservationPoint[] {
  return values.map((value, index) => {
    const date = new Date(Date.UTC(startYear, index, 1));
    return {
      seriesId,
      geography: "US",
      date: date.toISOString().slice(0, 10),
      value
    };
  });
}

function weekly(seriesId: string, values: number[], startDate = "2024-01-06"): ObservationPoint[] {
  const start = new Date(`${startDate}T00:00:00.000Z`);

  return values.map((value, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index * 7);

    return {
      seriesId,
      geography: "US",
      date: date.toISOString().slice(0, 10),
      value
    };
  });
}

describe("composite calculations", () => {
  it("calculates Sahm Rule against the prior twelve three-month averages", () => {
    const result = calculateSahmRule(monthly("UNRATE", [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4.2, 4.6, 5.2]));

    expect(result.at(-1)).toMatchObject({
      compositeId: "sahm_rule",
      date: "2025-03-01",
      value: 0.667
    });
  });

  it("returns no Sahm readings when unemployment history is insufficient or null", () => {
    expect(calculateSahmRule(monthly("UNRATE", [4, null, 4.2, 4.3]))).toEqual([]);
  });

  it("calculates tightness when all monthly components have numeric history", () => {
    const result = calculateTightness([
      ...monthly("JTSJOL", Array.from({ length: 18 }, (_, index) => 7000 + index * 20)),
      ...monthly("JTSQUR", Array.from({ length: 18 }, (_, index) => 2 + index * 0.01)),
      ...monthly("CES0500000003", Array.from({ length: 18 }, (_, index) => 30 + index * 0.1))
    ]);

    expect(result).toHaveLength(18);
    expect(result.at(-1)?.value).toBeGreaterThan(1);
  });

  it("aligns weekly and monthly components by carrying latest available z-scores forward for stress", () => {
    const result = calculateStress([
      ...weekly("ICSA", Array.from({ length: 80 }, (_, index) => 200_000 + index * 500)),
      ...monthly("JTSLDR", Array.from({ length: 18 }, (_, index) => 1 + index * 0.01)),
      ...monthly("AWHAETP", Array.from({ length: 18 }, (_, index) => 35 - index * 0.02))
    ]);

    expect(result.length).toBeGreaterThan(0);
    expect(result.at(-1)?.compositeId).toBe("labor_stress");
    expect(result.at(-1)?.value).toBeGreaterThan(1);
  });

  it("does not emit z-score composites when any required component is missing", () => {
    expect(calculateTightness(monthly("JTSJOL", [7000, 7100, 7200]))).toEqual([]);
  });
});
