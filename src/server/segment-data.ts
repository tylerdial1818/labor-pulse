import "server-only";

import { readRelationalObservations, hasRelationalSeries } from "@/lib/db/relational-store";
import { createFredClient } from "@/lib/fred/client";
import {
  getSegmentsForDimension,
  getSegmentsForMetric,
  getSupportedBreakdownDimensionsForMetric,
  type BreakdownDimension,
  type SegmentDefinition
} from "@/lib/segments/catalog";
import type { ObservationPoint } from "@/server/labor-types";

const HISTORY_YEARS = 10;

export type SegmentSeriesViewModel = SegmentDefinition & {
  observations: ObservationPoint[];
  currentValue: number | null;
  currentValueFormatted: string;
  currentDate: string | null;
  available: boolean;
  unavailableReason: string | null;
};

export type SegmentBreakdownData = {
  dimension: BreakdownDimension;
  stateAbbreviation: string;
  series: SegmentSeriesViewModel[];
  retrievedAt: string;
};

export type MetricSegmentBreakdownData = SegmentBreakdownData & {
  baseSeriesId: string;
  availableDimensions: BreakdownDimension[];
};

function observationStartDate() {
  const start = new Date();
  start.setUTCFullYear(start.getUTCFullYear() - HISTORY_YEARS);
  return start.toISOString().slice(0, 10);
}

function latestNonNull(observations: ObservationPoint[]) {
  return observations.filter((observation) => observation.value !== null).sort((a, b) => a.date.localeCompare(b.date)).at(-1) ?? null;
}

function formatSegmentValue(units: string, value: number | null) {
  if (value === null) return "not available";

  if (units.toLowerCase().includes("thousands")) {
    return `${(value / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
  }

  if (units.toLowerCase().includes("percent")) {
    return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
  }

  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

async function readStoredObservations(seriesId: string, useStoredObservations: boolean) {
  if (!useStoredObservations) return [];
  return readRelationalObservations(seriesId);
}

async function fetchFredObservations(series: SegmentDefinition): Promise<ObservationPoint[]> {
  const fred = createFredClient();
  const fetched = await fred.getObservations(series.seriesId, { observationStart: observationStartDate() });

  return fetched.map((observation) => ({
    seriesId: series.seriesId,
    geography: series.dimension === "state" ? series.segmentLabel : "US",
    date: observation.date,
    value: observation.value
  }));
}

async function getSegmentSeries(series: SegmentDefinition, options: { useStoredObservations: boolean; allowLiveFallback: boolean }): Promise<SegmentSeriesViewModel> {
  try {
    const stored = await readStoredObservations(series.seriesId, options.useStoredObservations);
    const observations = stored.length > 0 ? stored.filter((observation) => observation.date >= observationStartDate()) : options.allowLiveFallback ? await fetchFredObservations(series) : [];
    const current = latestNonNull(observations);

    return {
      ...series,
      observations,
      currentValue: current?.value ?? null,
      currentValueFormatted: formatSegmentValue(series.units, current?.value ?? null),
      currentDate: current?.date ?? null,
      available: observations.some((observation) => observation.value !== null),
      unavailableReason: observations.length > 0 ? null : "Run the FRED refresh to load this segment history."
    };
  } catch (error) {
    return {
      ...series,
      observations: [],
      currentValue: null,
      currentValueFormatted: "not available",
      currentDate: null,
      available: false,
      unavailableReason: error instanceof Error ? error.message : "Series unavailable."
    };
  }
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, mapper: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let nextIndex = 0;

  async function worker() {
    for (;;) {
      const index = nextIndex;
      nextIndex += 1;

      if (index >= items.length) return;

      results[index] = await mapper(items[index] as T);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

export async function getSegmentBreakdownData(input: { dimension?: string; state?: string } = {}): Promise<SegmentBreakdownData> {
  const dimension: BreakdownDimension = input.dimension === "gender" || input.dimension === "state" || input.dimension === "age" ? input.dimension : "industry";
  const stateAbbreviation = typeof input.state === "string" && input.state.length > 0 ? input.state.toUpperCase() : "CA";
  const definitions = getSegmentsForDimension(dimension, stateAbbreviation);
  const useStoredObservations = await hasRelationalSeries();
  const series = await mapWithConcurrency(definitions, 8, (definition) =>
    getSegmentSeries(definition, {
      useStoredObservations,
      allowLiveFallback: definitions.length <= 12
    })
  );

  return {
    dimension,
    stateAbbreviation,
    series,
    retrievedAt: new Date().toISOString()
  };
}

function normalizeDimension(value: string | undefined, options: BreakdownDimension[]): BreakdownDimension | null {
  if (value === "industry" || value === "gender" || value === "state" || value === "age") {
    return options.includes(value) ? value : options[0] ?? null;
  }

  return options[0] ?? null;
}

export async function getMetricSegmentBreakdownData(input: {
  seriesId: string;
  dimension?: string;
  state?: string;
}): Promise<MetricSegmentBreakdownData | null> {
  const availableDimensions = getSupportedBreakdownDimensionsForMetric(input.seriesId);
  const dimension = normalizeDimension(input.dimension, availableDimensions);

  if (!dimension) return null;

  const stateAbbreviation = typeof input.state === "string" && input.state.length > 0 ? input.state.toUpperCase() : "CA";
  const definitions = getSegmentsForMetric(input.seriesId, dimension, stateAbbreviation);
  const useStoredObservations = await hasRelationalSeries();
  const series = await mapWithConcurrency(definitions, 8, (definition) =>
    getSegmentSeries(definition, {
      useStoredObservations,
      allowLiveFallback: definitions.length <= 12
    })
  );

  return {
    baseSeriesId: input.seriesId,
    availableDimensions,
    dimension,
    stateAbbreviation,
    series,
    retrievedAt: new Date().toISOString()
  };
}

export async function getMetricSegmentBreakdownsData(input: { seriesId: string; state?: string }): Promise<MetricSegmentBreakdownData[]> {
  const availableDimensions = getSupportedBreakdownDimensionsForMetric(input.seriesId);

  return Promise.all(
    availableDimensions.map((dimension) =>
      getMetricSegmentBreakdownData({
        seriesId: input.seriesId,
        dimension,
        state: input.state
      })
    )
  ).then((results) => results.filter((result): result is MetricSegmentBreakdownData => result !== null));
}
