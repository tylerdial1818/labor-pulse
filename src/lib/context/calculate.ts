import type { ObservationPoint } from "@/server/labor-types";
import type { HistoricalContext } from "@/types/v15";

function validRows(observations: ObservationPoint[]) {
  return observations
    .filter((row): row is ObservationPoint & { value: number } => row.value !== null && Number.isFinite(row.value))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function percentileRank(observations: ObservationPoint[], value: number) {
  const rows = validRows(observations);
  if (rows.length === 0) return 0;
  const lowerOrEqual = rows.filter((row) => row.value <= value).length;
  return Math.round((lowerOrEqual / rows.length) * 100);
}

export function yearsOfHistory(observations: ObservationPoint[]) {
  const rows = validRows(observations);
  if (rows.length < 2) return 0;
  const first = new Date(`${rows[0].date}T00:00:00.000Z`).getTime();
  const last = new Date(`${rows.at(-1)?.date}T00:00:00.000Z`).getTime();
  return Math.max(0, Math.round((last - first) / (365.25 * 24 * 60 * 60 * 1000)));
}

export function comparablePeriod(observations: ObservationPoint[], current: ObservationPoint & { value: number }) {
  const rows = validRows(observations).filter((row) => row.date < current.date);
  if (rows.length === 0) return null;
  const values = rows.map((row) => row.value);
  const average = values.reduce((total, value) => total + value, 0) / values.length;
  const deviation = Math.sqrt(values.reduce((total, value) => total + (value - average) ** 2, 0) / values.length);
  const tolerance = Math.max(Math.abs(current.value) * 0.02, deviation * 0.1, 0.05);
  return rows
    .filter((row) => Math.abs(row.value - current.value) <= tolerance)
    .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

export function buildHistoricalContext(seriesId: string, observations: ObservationPoint[]): HistoricalContext | null {
  const rows = validRows(observations);
  const current = rows.at(-1);
  if (!current) return null;

  const rank = percentileRank(rows, current.value);
  const years = yearsOfHistory(rows);
  const comparable = comparablePeriod(rows, current);
  const direction = rank >= 75 ? "high" : rank <= 25 ? "low" : "near the middle of its history";

  return {
    seriesId,
    currentValue: current.value,
    percentileRank: rank,
    yearsOfHistory: years,
    comparablePeriod: comparable ? { date: comparable.date, value: comparable.value } : null,
    interpretation: `Current value is in the ${rank}th percentile of observations across ${years} years, which is ${direction}.`
  };
}
