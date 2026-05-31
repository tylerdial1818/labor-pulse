import type { AccountRow, RevenuePoint, SegmentPerformance } from "@/types/analytics";
import { LABOR_PULSE_GEOGRAPHY_DEFAULT } from "@/types/labor-pulse";
import type {
  CurrentObservation,
  DateString,
  DeltaMetric,
  FormattedMetricValue,
  IndicatorDefinition,
  IndicatorMetricSummary,
  LaborPulseGeography,
  Observation,
  SparklinePoint
} from "@/types/labor-pulse";

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

function compareObservationDates(a: Pick<Observation, "date">, b: Pick<Observation, "date">) {
  return a.date.localeCompare(b.date);
}

function isSameSeriesAndGeography(
  observation: Pick<Observation, "seriesId" | "geography">,
  seriesId: string,
  geography: LaborPulseGeography
) {
  return observation.seriesId === seriesId && observation.geography === geography;
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function shiftMonths(date: DateString, monthOffset: number): DateString {
  const [yearPart, monthPart, dayPart] = date.split("-").map(Number);
  const monthIndex = (monthPart ?? 1) - 1 + monthOffset;
  const shiftedYear = (yearPart ?? 0) + Math.floor(monthIndex / 12);
  const shiftedMonthIndex = ((monthIndex % 12) + 12) % 12;

  return `${shiftedYear}-${padDatePart(shiftedMonthIndex + 1)}-${padDatePart(dayPart ?? 1)}` as DateString;
}

function shiftDays(date: DateString, dayOffset: number): DateString {
  const [yearPart, monthPart, dayPart] = date.split("-").map(Number);
  const shifted = new Date(Date.UTC(yearPart ?? 0, (monthPart ?? 1) - 1, dayPart ?? 1));
  shifted.setUTCDate(shifted.getUTCDate() + dayOffset);

  return `${shifted.getUTCFullYear()}-${padDatePart(shifted.getUTCMonth() + 1)}-${padDatePart(
    shifted.getUTCDate()
  )}` as DateString;
}

export function getComparisonDate(currentDate: DateString, frequency: IndicatorDefinition["frequency"]): DateString | null {
  if (frequency === "monthly") return shiftMonths(currentDate, -12);
  if (frequency === "weekly") return shiftDays(currentDate, -28);
  return null;
}

export function getCurrentObservation(
  indicator: Pick<IndicatorDefinition, "id">,
  observations: Observation[],
  geography: LaborPulseGeography = LABOR_PULSE_GEOGRAPHY_DEFAULT
): CurrentObservation | null {
  const current = observations
    .filter((observation) => isSameSeriesAndGeography(observation, indicator.id, geography) && observation.value !== null)
    .sort(compareObservationDates)
    .at(-1);

  if (!current || current.value === null) return null;

  return {
    seriesId: current.seriesId,
    geography: current.geography,
    date: current.date,
    value: current.value
  };
}

export function calculateDeltaMetric(
  indicator: Pick<IndicatorDefinition, "id" | "frequency">,
  observations: Observation[],
  geography: LaborPulseGeography = LABOR_PULSE_GEOGRAPHY_DEFAULT
): DeltaMetric {
  const current = getCurrentObservation(indicator, observations, geography);

  if (!current) {
    return { status: "unavailable", reason: "no_current_value" };
  }

  const comparisonDate = getComparisonDate(current.date, indicator.frequency);

  if (!comparisonDate) {
    return { status: "unavailable", reason: "unsupported_frequency", currentDate: current.date };
  }

  const comparison = observations.find(
    (observation) =>
      isSameSeriesAndGeography(observation, indicator.id, geography) &&
      observation.date === comparisonDate &&
      observation.value !== null
  );

  if (!comparison || comparison.value === null) {
    return {
      status: "unavailable",
      reason: "missing_comparison_observation",
      currentDate: current.date,
      comparisonDate
    };
  }

  const value = current.value - comparison.value;

  return {
    status: "available",
    value,
    percentChange: comparison.value === 0 ? null : value / comparison.value,
    currentDate: current.date,
    comparisonDate,
    comparisonValue: comparison.value
  };
}

export function buildSparklineHistory(
  indicator: Pick<IndicatorDefinition, "id">,
  observations: Observation[],
  limit = 24,
  geography: LaborPulseGeography = LABOR_PULSE_GEOGRAPHY_DEFAULT
): SparklinePoint[] {
  return observations
    .filter((observation) => isSameSeriesAndGeography(observation, indicator.id, geography))
    .sort(compareObservationDates)
    .slice(-limit)
    .map((observation) => ({
      date: observation.date,
      value: observation.value
    }));
}

export function buildIndicatorMetricSummary(
  indicator: IndicatorDefinition,
  observations: Observation[],
  geography: LaborPulseGeography = LABOR_PULSE_GEOGRAPHY_DEFAULT
): IndicatorMetricSummary {
  const scopedObservations = observations.filter((observation) =>
    isSameSeriesAndGeography(observation, indicator.id, geography)
  );

  return {
    indicator,
    geography,
    current: getCurrentObservation(indicator, scopedObservations, geography),
    delta: calculateDeltaMetric(indicator, scopedObservations, geography),
    sparkline: buildSparklineHistory(indicator, scopedObservations, 24, geography),
    lastUpdatedAt: scopedObservations.sort(compareObservationDates).at(-1)?.date ?? null
  };
}

function applyDisplayMultiplier(value: number, indicator: Pick<IndicatorDefinition, "display">) {
  return value * (indicator.display.multiplier ?? 1);
}

function formatNumber(value: number, decimals: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    ...options
  }).format(value);
}

function formatSignedNumber(value: number, decimals: number, options?: Intl.NumberFormatOptions) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatNumber(Math.abs(value), decimals, options)}`;
}

function compactOptions(value: number): Intl.NumberFormatOptions {
  return Math.abs(value) >= 1_000_000 ? { notation: "compact" } : {};
}

export function formatIndicatorValue(
  indicator: Pick<IndicatorDefinition, "display">,
  value: number | null
): FormattedMetricValue {
  if (value === null) return { status: "unavailable", text: "not available" };

  const displayValue = applyDisplayMultiplier(value, indicator);
  const { decimals, unitLabel, valueFormat } = indicator.display;

  if (valueFormat === "currency") {
    return { status: "available", text: `$${formatNumber(displayValue, decimals)}${unitLabel}` };
  }

  if (valueFormat === "percent") {
    return { status: "available", text: `${formatNumber(displayValue, decimals)}${unitLabel}` };
  }

  if (valueFormat === "count") {
    return {
      status: "available",
      text: `${formatNumber(displayValue, decimals, compactOptions(displayValue))} ${unitLabel}`
    };
  }

  return { status: "available", text: `${formatNumber(displayValue, decimals)} ${unitLabel}` };
}

export function formatDeltaMetric(
  indicator: Pick<IndicatorDefinition, "display">,
  delta: DeltaMetric
): FormattedMetricValue {
  if (delta.status === "unavailable") return { status: "unavailable", text: "not available" };

  const displayValue = applyDisplayMultiplier(delta.value, indicator);
  const { decimals, deltaUnitLabel, valueFormat } = indicator.display;

  if (valueFormat === "currency") {
    return {
      status: "available",
      text: formatSignedNumber(displayValue, decimals, { style: "currency", currency: "USD" })
    };
  }

  if (valueFormat === "count") {
    return {
      status: "available",
      text: `${formatSignedNumber(displayValue, decimals, compactOptions(displayValue))} ${deltaUnitLabel}`
    };
  }

  return {
    status: "available",
    text: `${formatSignedNumber(displayValue, decimals)} ${deltaUnitLabel}`
  };
}
