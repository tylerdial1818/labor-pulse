import "server-only";

import type { DbClient } from "@/lib/db/client";
import { readLocalStore, resetLocalStore, writeLocalStore } from "@/lib/db/local-store";
import { CATEGORY_LABELS, INDICATOR_CATALOG, getCatalogIndicator } from "@/server/indicator-catalog";
import type {
  DefinitionResponse,
  IndicatorCardViewModel,
  IndicatorDetailResponse,
  IndicatorSeries,
  LaborDashboardData,
  ObservationPoint,
  RefreshStatus,
  SourcesPageData
} from "@/server/labor-types";

const STALE_AFTER_MS = 1000 * 60 * 60 * 24 * 10;
const unfavorableWhenRising = new Set(["UNRATE", "U6RATE", "ICSA", "JTSLDR"]);
const informationalSeries = new Set(["CES0500000003", "USPBS", "USINFO", "ANTHROPIC_ECONOMIC_INDEX"]);

function toNumber(value: number | null) {
  return value === null || !Number.isFinite(value) ? null : value;
}

function formatUpdatedDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

function formatObservationDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00.000Z`));
}

function latestNonNull(observations: ObservationPoint[]) {
  return observations.filter((observation) => observation.value !== null).sort((a, b) => a.date.localeCompare(b.date)).at(-1) ?? null;
}

function comparisonDate(date: string, frequency: IndicatorSeries["frequency"]) {
  const parsed = new Date(`${date}T00:00:00.000Z`);

  if (frequency === "weekly") {
    parsed.setUTCDate(parsed.getUTCDate() - 28);
  } else if (frequency === "monthly") {
    parsed.setUTCFullYear(parsed.getUTCFullYear() - 1);
  } else {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function displayValue(series: IndicatorSeries, value: number | null) {
  const safeValue = toNumber(value);

  if (safeValue === null) {
    return { value: "not available", unit: "" };
  }

  if (series.id === "ICSA") {
    return { value: Math.round(safeValue / 1_000).toLocaleString("en-US"), unit: "K" };
  }

  if (["PAYEMS", "JTSJOL", "TEMPHELPS", "USPBS", "USINFO"].includes(series.id)) {
    return { value: (safeValue / 1_000).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }), unit: "M" };
  }

  if (series.id === "CES0500000003") {
    return { value: safeValue.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }), unit: "/hr" };
  }

  if (series.id === "AWHAETP") {
    return { value: safeValue.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }), unit: "hrs" };
  }

  return { value: safeValue.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }), unit: "%" };
}

function formatDelta(series: IndicatorSeries, value: number | null, comparisonValue?: number | null) {
  if (value === null) {
    return "not available";
  }

  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const abs = Math.abs(value);

  if (series.id === "ICSA") {
    return `${sign}${Math.round(abs / 1_000).toLocaleString("en-US")}K`;
  }

  if (["PAYEMS", "JTSJOL", "TEMPHELPS", "USPBS", "USINFO"].includes(series.id)) {
    return `${sign}${(abs / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
  }

  if (series.id === "CES0500000003") {
    const percent = comparisonValue ? (abs / comparisonValue) * 100 : abs;
    return `${sign}${percent.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
  }

  if (series.id === "AWHAETP") {
    return value === 0 ? "flat" : `${sign}${abs.toLocaleString("en-US", { maximumFractionDigits: 1 })} hrs`;
  }

  return `${sign}${abs.toLocaleString("en-US", { maximumFractionDigits: 1 })} pp`;
}

function deltaTone(series: IndicatorSeries, value: number | null): IndicatorCardViewModel["delta"]["tone"] {
  if (value === null) return "muted";
  if (value === 0 || informationalSeries.has(series.id)) return "info";
  const favorable = unfavorableWhenRising.has(series.id) ? value < 0 : value > 0;
  return favorable ? "up" : "down";
}

function calculateDelta(series: IndicatorSeries, observations: ObservationPoint[]): IndicatorCardViewModel["delta"] {
  const current = latestNonNull(observations);
  const targetDate = current ? comparisonDate(current.date, series.frequency) : null;
  const comparison = targetDate
    ? observations.find((observation) => observation.date === targetDate && observation.value !== null)
    : undefined;
  const value = current?.value !== null && current?.value !== undefined && comparison?.value !== null && comparison?.value !== undefined ? current.value - comparison.value : null;

  return {
    value,
    formatted: formatDelta(series, value, comparison?.value),
    periodLabel:
      series.frequency === "weekly" ? "vs. 4 weeks ago" : series.frequency === "ad_hoc" ? "since last release" : "vs. year ago",
    arrowDirection: value === null ? "none" : value > 0 ? "up" : value < 0 ? "down" : "flat",
    tone: deltaTone(series, value)
  };
}

function toIndicatorCard(series: IndicatorSeries, observations: ObservationPoint[]): IndicatorCardViewModel {
  const current = latestNonNull(observations);
  const lastUpdated = series.lastRefreshedAt;
  const isStale = lastUpdated ? Date.now() - new Date(lastUpdated).getTime() > STALE_AFTER_MS : true;
  const currentDisplay = displayValue(series, current?.value ?? null);

  return {
    id: series.id,
    title: series.shortTitle,
    category: series.category,
    source: series.source,
    sourceUrl: series.sourceUrl,
    frequency: series.frequency,
    unitLabel: currentDisplay.unit,
    currentValue: current?.value ?? null,
    currentValueFormatted: currentDisplay.value,
    currentDate: formatObservationDate(current?.date ?? null),
    delta: calculateDelta(series, observations),
    sparkline: observations.slice(-36).map((point) => ({ date: point.date, value: point.value })),
    lastUpdated: formatUpdatedDate(lastUpdated),
    isProxy: series.isProxy,
    methodologyNote: series.methodologyNote ?? undefined,
    isStale
  };
}

export async function seedCatalog(db?: DbClient) {
  void db;
  const store = await readLocalStore();
  const existingById = new Map(store.series.map((series) => [series.id, series]));
  store.series = INDICATOR_CATALOG.map((indicator) => ({
    ...indicator,
    lastRefreshedAt: existingById.get(indicator.id)?.lastRefreshedAt ?? null
  }));
  await writeLocalStore(store);
}

export async function seedLocalData() {
  await resetLocalStore();
}

export async function getIndicatorDetail(seriesId: string, db?: DbClient): Promise<IndicatorDetailResponse | null> {
  void db;
  const catalog = getCatalogIndicator(seriesId);

  if (!catalog) {
    return null;
  }

  const store = await readLocalStore();
  const storedSeries = store.series.find((series) => series.id === seriesId);
  const series = storedSeries ?? { ...catalog, lastRefreshedAt: null };
  const observations = store.observations
    .filter((observation) => observation.seriesId === seriesId && observation.geography === "US")
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    series,
    observations,
    refreshedAt: series.lastRefreshedAt
  };
}

export async function getDashboardData(db?: DbClient): Promise<LaborDashboardData> {
  void db;
  const store = await readLocalStore();
  const cards = store.series.map((series) => {
    const observations = store.observations
      .filter((observation) => observation.seriesId === series.id && observation.geography === "US")
      .sort((a, b) => a.date.localeCompare(b.date));

    return toIndicatorCard(series, observations);
  });
  const refreshedAt = cards
    .map((card) => card.lastUpdated)
    .filter((value): value is string => value !== null)
    .sort()
    .at(-1) ?? null;

  return {
    categories: (["lagging", "leading", "tech_impact"] as const).map((category) => ({
      id: category,
      ...CATEGORY_LABELS[category],
      indicators: cards.filter((card) => card.category === category)
    })),
    refreshedAt
  };
}

export async function getSourcesData(): Promise<SourcesPageData> {
  const store = await readLocalStore();
  const sources = Array.from(new Set(store.series.map((series) => series.source))).map((source) => {
    const indicators = store.series.filter((series) => series.source === source);
    const lastRefresh = indicators
      .map((indicator) => indicator.lastRefreshedAt)
      .filter((value): value is string => value !== null)
      .sort()
      .at(-1) ?? null;

    return {
      source,
      indicators: indicators.map((indicator) => indicator.shortTitle),
      lastRefresh,
      refreshCadence: source === "FRED" ? "Daily at 08:00 UTC" : "Manual release import",
      sourceUrl: source === "FRED" ? "https://fred.stlouisfed.org/" : "https://www.anthropic.com/economic-index"
    };
  });

  return {
    sources,
    refreshLog: store.refreshLog.sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 20)
  };
}

export async function getCachedDefinition(seriesId: string, db?: DbClient): Promise<DefinitionResponse | null> {
  void db;
  const store = await readLocalStore();
  const row = store.definitions.find((definition) => definition.seriesId === seriesId);

  if (!row) {
    return null;
  }

  return {
    ...row,
    cached: true
  };
}

export async function cacheDefinition(input: Omit<DefinitionResponse, "cached">, db?: DbClient) {
  void db;
  const store = await readLocalStore();
  store.definitions = store.definitions.filter((definition) => definition.seriesId !== input.seriesId);
  store.definitions.push(input);
  await writeLocalStore(store);
}

export async function upsertObservation(point: ObservationPoint, db?: DbClient) {
  void db;
  const store = await readLocalStore();
  store.observations = store.observations.filter(
    (observation) =>
      !(observation.seriesId === point.seriesId && observation.geography === point.geography && observation.date === point.date)
  );
  store.observations.push(point);
  await writeLocalStore(store);
}

export async function markSeriesRefreshed(seriesId: string, db?: DbClient) {
  void db;
  const store = await readLocalStore();
  store.series = store.series.map((series) => (series.id === seriesId ? { ...series, lastRefreshedAt: new Date().toISOString() } : series));
  await writeLocalStore(store);
}

export async function writeRefreshLog(
  input: {
    source: string;
    seriesId: string | null;
    status: RefreshStatus;
    message: string | null;
    startedAt: string;
    completedAt: string;
  },
  db?: DbClient
) {
  void db;
  const store = await readLocalStore();
  store.refreshLog.push({
    id: store.refreshLog.length + 1,
    ...input
  });
  await writeLocalStore(store);
}
