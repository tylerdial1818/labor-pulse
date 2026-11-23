// Live FRED series behind the AI Impact page's adoption tracker and macro gauges.
//
// These are fetched straight from FRED with a one-day cache rather than stored
// by the cron ingest: there are only a few, they are quarterly, and keeping
// them out of the headline catalog leaves the dashboard and composites alone.

import type { ParsedFredObservation } from "@/lib/fred/schemas";

export type SignalId = "genai_work" | "genai_any" | "productivity" | "labor_share";

export type SignalDefinition = {
  id: SignalId;
  seriesId: string;
  title: string;
  /** How the headline number is read: a level in percent, or growth of an index over four quarters. */
  measure: "percent_level" | "index_growth";
  description: string;
  sourceLabel: string;
};

export const AI_SIGNALS: SignalDefinition[] = [
  {
    id: "genai_work",
    seriesId: "RPSGENAIUSAGESHAREWORK",
    title: "Workers using generative AI for their job",
    measure: "percent_level",
    description: "Share of employed adults aged 18 to 64 who answer yes to \"Do you use generative AI for your job?\"",
    sourceLabel: "Bick, Blandin and Deming, Real-Time Population Survey, via FRED"
  },
  {
    id: "genai_any",
    seriesId: "RPSGENAIUSAGESHAREALL",
    title: "Adults using generative AI (overall)",
    measure: "percent_level",
    description: "Overall generative AI adoption rate among working-age adults, as published by the survey.",
    sourceLabel: "Bick, Blandin and Deming, Real-Time Population Survey, via FRED"
  },
  {
    id: "productivity",
    seriesId: "OPHNFB",
    title: "Labor productivity growth",
    measure: "index_growth",
    description: "Output per hour in the nonfarm business sector, change over the past four quarters.",
    sourceLabel: "BLS Productivity and Costs, via FRED"
  },
  {
    id: "labor_share",
    seriesId: "PRS85006173",
    title: "Labor share of income",
    measure: "index_growth",
    description: "Workers' share of nonfarm business income (index), change over the past four quarters.",
    sourceLabel: "BLS Productivity and Costs, via FRED"
  }
];

export type SignalPoint = { date: string; value: number };

export type SignalSummary = {
  definition: SignalDefinition;
  sourceUrl: string;
  points: SignalPoint[];
  latest: SignalPoint | null;
  /** Percent level for percent_level; four-quarter percent growth for index_growth. */
  headline: number | null;
  /** Change in the headline versus four quarters earlier (percentage points), when available. */
  yearAgoHeadline: number | null;
  periodLabel: string | null;
  available: boolean;
};

export function fredSeriesUrl(seriesId: string) {
  return `https://fred.stlouisfed.org/series/${seriesId}`;
}

/** "2026-07-01" -> "Q3 2026". FRED dates quarterly observations by the quarter's first day. */
export function quarterLabel(date: string): string {
  const [year, month] = date.split("-").map(Number);
  if (!year || !month) return date;
  return `Q${Math.floor((month - 1) / 3) + 1} ${year}`;
}

function growthOverFourQuarters(points: SignalPoint[], index: number): number | null {
  const current = points[index];
  const base = points[index - 4];
  if (!current || !base || base.value === 0) return null;
  return ((current.value - base.value) / base.value) * 100;
}

/** Pure summary of a quarterly series. Missing values (FRED ".") are dropped first. */
export function summarizeSignal(definition: SignalDefinition, observations: ParsedFredObservation[]): SignalSummary {
  const points = observations
    .filter((o): o is { date: string; value: number } => o.value !== null && Number.isFinite(o.value))
    .map((o) => ({ date: o.date, value: o.value }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const last = points.length - 1;
  const latest = points[last] ?? null;

  const headlineAt = (index: number) =>
    definition.measure === "percent_level" ? points[index]?.value ?? null : growthOverFourQuarters(points, index);

  return {
    definition,
    sourceUrl: fredSeriesUrl(definition.seriesId),
    points,
    latest,
    headline: latest ? headlineAt(last) : null,
    yearAgoHeadline: last >= 4 ? headlineAt(last - 4) : null,
    periodLabel: latest ? quarterLabel(latest.date) : null,
    available: latest !== null
  };
}

export function emptySignal(definition: SignalDefinition): SignalSummary {
  return summarizeSignal(definition, []);
}
