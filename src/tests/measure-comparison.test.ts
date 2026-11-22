import { describe, expect, it } from "vitest";

import { MISSING_VALUE_LABEL, buildMeasureBars, formatMonthYear, formatPercentValue } from "@/lib/home/measure-comparison";

const base = { asOf: "2026-10-01", sourceLabel: "BLS via FRED" };

describe("formatPercentValue", () => {
  it("formats to one decimal with a percent sign", () => {
    expect(formatPercentValue(41.5)).toBe("41.5%");
    expect(formatPercentValue(4)).toBe("4.0%");
  });

  it("never renders a missing value as zero", () => {
    expect(formatPercentValue(null)).toBe(MISSING_VALUE_LABEL);
    expect(formatPercentValue(Number.NaN)).toBe(MISSING_VALUE_LABEL);
  });
});

describe("buildMeasureBars", () => {
  it("scales bars to the largest available value", () => {
    const bars = buildMeasureBars([
      { ...base, id: "a", label: "A", value: 40 },
      { ...base, id: "b", label: "B", value: 8 },
      { ...base, id: "c", label: "C", value: 4 }
    ]);

    expect(bars.map((bar) => bar.widthPercent)).toEqual([100, 20, 10]);
    expect(bars[1].valueLabel).toBe("8.0%");
  });

  it("gives missing values no bar and the not-available label, without rescaling others to zero", () => {
    const bars = buildMeasureBars([
      { ...base, id: "a", label: "A", value: null },
      { ...base, id: "b", label: "B", value: 8 }
    ]);

    expect(bars[0].widthPercent).toBeNull();
    expect(bars[0].valueLabel).toBe(MISSING_VALUE_LABEL);
    expect(bars[1].widthPercent).toBe(100);
  });

  it("returns no bars when every value is missing", () => {
    const bars = buildMeasureBars([{ ...base, id: "a", label: "A", value: null }]);
    expect(bars[0].widthPercent).toBeNull();
  });
});

describe("formatMonthYear", () => {
  it("formats ISO dates as short month and year", () => {
    expect(formatMonthYear("2026-03-31")).toBe("Mar 2026");
  });

  it("passes through values that are already formatted or missing", () => {
    expect(formatMonthYear("Apr 2026")).toBe("Apr 2026");
    expect(formatMonthYear(null)).toBeNull();
  });
});
