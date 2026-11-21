/**
 * Shapes the home page "Three measures, three definitions" bar chart.
 * Pure so the scaling and missing-data rules are testable. See
 * docs/metric-definitions.md ("Underemployment measures comparison").
 */

export type MeasureInput = {
  id: string;
  label: string;
  /** Percent value, or null when the source has no observation yet. */
  value: number | null;
  asOf: string | null;
  sourceLabel: string;
  emphasized?: boolean;
};

export type MeasureBar = MeasureInput & {
  valueLabel: string;
  /** Bar length as a share of the largest available value (0 to 100), or null when missing. */
  widthPercent: number | null;
};

export const MISSING_VALUE_LABEL = "Not available yet";

export function formatPercentValue(value: number | null, digits = 1): string {
  if (value === null || !Number.isFinite(value)) return MISSING_VALUE_LABEL;
  return `${value.toFixed(digits)}%`;
}

export function buildMeasureBars(measures: MeasureInput[]): MeasureBar[] {
  const available = measures
    .map((measure) => measure.value)
    .filter((value): value is number => value !== null && Number.isFinite(value) && value >= 0);
  const max = available.length > 0 ? Math.max(...available) : 0;

  return measures.map((measure) => {
    const hasValue = measure.value !== null && Number.isFinite(measure.value) && measure.value >= 0;
    const widthPercent = hasValue && max > 0 ? Number((((measure.value as number) / max) * 100).toFixed(2)) : null;

    return {
      ...measure,
      valueLabel: formatPercentValue(hasValue ? measure.value : null),
      widthPercent
    };
  });
}

/** "2026-03-31" -> "Mar 2026", matching the indicator cards' as-of format. Other strings pass through. */
export function formatMonthYear(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
