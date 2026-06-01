import type { CompositeDefinition, CompositeObservation } from "@/types/v15";
import type { ObservationPoint } from "@/server/labor-types";

type SeriesMap = Map<string, ObservationPoint[]>;

export const COMPOSITE_DEFINITIONS: CompositeDefinition[] = [
  {
    id: "sahm_rule",
    name: "Sahm Rule Recession Indicator",
    description: "Three-month average unemployment rate minus its prior 12-month low.",
    category: "recession_signal",
    inputSeries: ["UNRATE"],
    methodologyNote:
      "Calculated as the three-month moving average of the unemployment rate less the lowest value of that average over the prior 12 months.",
    thresholdInterpretation: [
      { label: "Normal", range: [null, 0], color: "green" },
      { label: "Caution", range: [0, 0.5], color: "yellow" },
      { label: "Recession signal", range: [0.5, null], color: "red" }
    ]
  },
  {
    id: "labor_tightness",
    name: "Labor Market Tightness",
    description: "Standardized blend of openings, quits, and wage pressure.",
    category: "tightness",
    inputSeries: ["JTSJOL", "JTSQUR", "CES0500000003"],
    methodologyNote:
      "A z-score blend of job openings, quits, and wage growth proxies. Higher readings indicate tighter labor-market conditions.",
    thresholdInterpretation: [
      { label: "Slack", range: [null, -0.5], color: "green" },
      { label: "Balanced", range: [-0.5, 0.5], color: "yellow" },
      { label: "Tight", range: [0.5, null], color: "orange" }
    ]
  },
  {
    id: "labor_stress",
    name: "Labor Market Stress",
    description: "Standardized blend of claims, layoffs, and weekly-hours pressure.",
    category: "stress",
    inputSeries: ["ICSA", "JTSLDR", "AWHAETP"],
    methodologyNote:
      "A z-score blend of initial claims, layoffs and discharges, and the inverse of weekly hours. Higher readings indicate more labor-market stress.",
    thresholdInterpretation: [
      { label: "Low stress", range: [null, -0.5], color: "green" },
      { label: "Watch", range: [-0.5, 0.5], color: "yellow" },
      { label: "Elevated stress", range: [0.5, null], color: "red" }
    ]
  }
];

function validRows(rows: ObservationPoint[]) {
  return rows
    .filter((row): row is ObservationPoint & { value: number } => row.value !== null && Number.isFinite(row.value))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function groupBySeries(observations: ObservationPoint[]): SeriesMap {
  const grouped = new Map<string, ObservationPoint[]>();
  for (const row of observations) {
    const rows = grouped.get(row.seriesId) ?? [];
    rows.push(row);
    grouped.set(row.seriesId, rows);
  }
  return grouped;
}

function mean(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function standardDeviation(values: number[]) {
  if (values.length < 2) return 0;
  const average = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - average) ** 2)));
}

function zScores(rows: Array<{ date: string; value: number }>) {
  if (rows.length < 2) return new Map<string, number>();

  const values = rows.map((row) => row.value);
  const average = mean(values);
  const deviation = standardDeviation(values);
  return new Map(rows.map((row) => [row.date, deviation === 0 ? 0 : (row.value - average) / deviation]));
}

export function calculateSahmRule(observations: ObservationPoint[]): CompositeObservation[] {
  const rows = validRows(observations.filter((row) => row.seriesId === "UNRATE"));
  const averages = rows.flatMap((row, index) => {
    if (index < 2) return [];
    const window = rows.slice(index - 2, index + 1).map((item) => item.value);
    return [{ date: row.date, value: mean(window) }];
  });

  return averages.flatMap((row, index) => {
    if (index < 12) return [];
    const priorLow = Math.min(...averages.slice(index - 12, index).map((item) => item.value));
    return [{ compositeId: "sahm_rule", geography: "US", date: row.date, value: Number((row.value - priorLow).toFixed(3)) }];
  });
}

function calculateZBlend(observations: ObservationPoint[], compositeId: "labor_tightness" | "labor_stress", inputs: string[], inverted: string[] = []) {
  const grouped = groupBySeries(observations);
  const scoreSeries = inputs.map((seriesId) => {
    const rows = validRows(grouped.get(seriesId) ?? []).map((row) => ({
      date: row.date,
      value: inverted.includes(seriesId) ? -row.value : row.value
    }));
    const scores = zScores(rows);
    return Array.from(scores.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  if (scoreSeries.some((series) => series.length === 0)) {
    return [];
  }

  const dates = Array.from(new Set(scoreSeries.flatMap((series) => series.map((row) => row.date)))).sort();

  return dates.flatMap((date) => {
    const values = scoreSeries.flatMap((series) => {
      const latest = series.filter((row) => row.date <= date).at(-1);
      return latest ? [latest.value] : [];
    });

    if (values.length !== scoreSeries.length) {
      return [];
    }

    return [
      {
        compositeId,
        geography: "US",
        date,
        value: Number(mean(values).toFixed(3))
      }
    ];
  });
}

export function calculateTightness(observations: ObservationPoint[]): CompositeObservation[] {
  return calculateZBlend(observations, "labor_tightness", ["JTSJOL", "JTSQUR", "CES0500000003"]);
}

export function calculateStress(observations: ObservationPoint[]): CompositeObservation[] {
  return calculateZBlend(observations, "labor_stress", ["ICSA", "JTSLDR", "AWHAETP"], ["AWHAETP"]);
}

export function calculateAllComposites(observations: ObservationPoint[]): CompositeObservation[] {
  return [...calculateSahmRule(observations), ...calculateTightness(observations), ...calculateStress(observations)];
}

export function interpretComposite(definition: CompositeDefinition, value: number) {
  return (
    definition.thresholdInterpretation.find((threshold) => {
      const [min, max] = threshold.range;
      return (min === null || value >= min) && (max === null || value < max);
    }) ?? { label: "Not classified", color: "gray" as const, range: [null, null] as [null, null] }
  );
}
