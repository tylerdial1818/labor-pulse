import "server-only";

import type { DbClient } from "@/lib/db/client";
import { readLocalStore, resetLocalStore, writeLocalStore } from "@/lib/db/local-store";
import {
  applyRelationalFredRefresh,
  createRelationalBriefing,
  getRelationalBriefing,
  hasRelationalSeries,
  isRelationalStoreConfigured,
  listRelationalBriefings,
  readRelationalAiExposureScores,
  readRelationalCompositeObservations,
  readRelationalObservations,
  readRelationalRefreshLog,
  readRelationalSeries,
  replaceRelationalCompositeObservations,
  seedRelationalCatalog
} from "@/lib/db/relational-store";
import { calculateAllComposites, COMPOSITE_DEFINITIONS, interpretComposite } from "@/lib/composites/calculate";
import { buildHistoricalContext } from "@/lib/context/calculate";
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
import type { BriefingInput, HistoricalContext, InsightCategory, StoredBriefing } from "@/types/v15";

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
    plainLanguage: series.plainLanguage,
    whyItMatters: series.whyItMatters,
    interpretation: series.interpretation,
    sourceLabel: series.sourceLabel,
    sourceDetail: series.sourceDetail,
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
  if (isRelationalStoreConfigured()) {
    await seedRelationalCatalog();
  }
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

  const useRelational = await hasRelationalSeries();
  const store = useRelational ? null : await readLocalStore();
  const storedSeries = useRelational
    ? (await readRelationalSeries()).find((series) => series.id === seriesId)
    : store?.series.find((series) => series.id === seriesId);
  const series = storedSeries ?? { ...catalog, lastRefreshedAt: null };
  const observations = useRelational
    ? await readRelationalObservations(seriesId)
    : (store?.observations ?? [])
        .filter((observation) => observation.seriesId === seriesId && observation.geography === "US")
        .sort((a, b) => a.date.localeCompare(b.date));

  return {
    series,
    observations,
    refreshedAt: series.lastRefreshedAt,
    context: buildHistoricalContext(seriesId, observations)
  };
}

export async function getDashboardData(db?: DbClient): Promise<LaborDashboardData> {
  void db;
  const useRelational = await hasRelationalSeries();
  const store = useRelational ? null : await readLocalStore();
  const seriesRows = useRelational ? await readRelationalSeries() : store?.series ?? [];
  const allObservations = useRelational ? await readRelationalObservations() : store?.observations ?? [];
  const cards = seriesRows.map((series) => {
    const observations = allObservations
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
    refreshedAt,
    composites: await getCompositeSummaries()
  };
}

export async function recomputeComposites() {
  if (await hasRelationalSeries()) {
    const observations = await readRelationalObservations();
    const compositeObservations = calculateAllComposites(observations);
    await replaceRelationalCompositeObservations(compositeObservations);
    return compositeObservations;
  }

  const store = await readLocalStore();
  store.composites = COMPOSITE_DEFINITIONS;
  store.compositeObservations = calculateAllComposites(store.observations);
  await writeLocalStore(store);
  return store.compositeObservations;
}

export async function getCompositeSummaries() {
  const useRelational = await hasRelationalSeries();
  const store = useRelational ? null : await readLocalStore();
  const storedComposites = useRelational ? await readRelationalCompositeObservations() : store?.compositeObservations ?? [];
  const sourceObservations = useRelational ? await readRelationalObservations() : store?.observations ?? [];
  const observations = storedComposites.length > 0 ? storedComposites : calculateAllComposites(sourceObservations);

  return COMPOSITE_DEFINITIONS.map((definition) => {
    const history = observations.filter((row) => row.compositeId === definition.id).sort((a, b) => a.date.localeCompare(b.date));
    const current = history.at(-1);
    return current
      ? {
          id: definition.id,
          name: definition.name,
          description: definition.description,
          currentValue: current.value,
          asOfDate: current.date,
          interpretation: interpretComposite(definition, current.value),
          methodologyNote: definition.methodologyNote,
          history: history.slice(-36)
        }
      : null;
  }).filter((summary): summary is NonNullable<typeof summary> => summary !== null);
}

export async function getCompositeDetail(id: string) {
  const useRelational = await hasRelationalSeries();
  const store = useRelational ? null : await readLocalStore();
  const definition = COMPOSITE_DEFINITIONS.find((item) => item.id === id);
  if (!definition) return null;
  const storedComposites = useRelational ? await readRelationalCompositeObservations() : store?.compositeObservations ?? [];
  const sourceObservations = useRelational ? await readRelationalObservations() : store?.observations ?? [];
  const observations = (storedComposites.length > 0 ? storedComposites : calculateAllComposites(sourceObservations))
    .filter((row) => row.compositeId === id)
    .sort((a, b) => a.date.localeCompare(b.date));
  const current = observations.at(-1);
  return {
    definition,
    observations,
    current: current
      ? {
          value: current.value,
          date: current.date,
          interpretation: interpretComposite(definition, current.value)
        }
      : null
  };
}

export async function getHistoricalContext(seriesId: string): Promise<HistoricalContext | null> {
  if (await hasRelationalSeries()) {
    return buildHistoricalContext(seriesId, await readRelationalObservations(seriesId));
  }

  const store = await readLocalStore();
  return buildHistoricalContext(
    seriesId,
    store.observations.filter((observation) => observation.seriesId === seriesId && observation.geography === "US")
  );
}

export async function listInsights(filters: { category?: InsightCategory; tags?: string[]; since?: string; limit?: number; sort?: "asc" | "desc" } = {}) {
  const store = await readLocalStore();
  const limit = Math.min(Math.max(filters.limit ?? 20, 1), 100);
  return store.insights
    .filter((insight) => (filters.category ? insight.category === filters.category : true))
    .filter((insight) => (filters.since ? insight.publishedAt >= filters.since : true))
    .filter((insight) => (filters.tags?.length ? filters.tags.every((tag) => insight.tags.includes(tag)) : true))
    .sort((a, b) => (filters.sort === "asc" ? a.publishedAt.localeCompare(b.publishedAt) : b.publishedAt.localeCompare(a.publishedAt)))
    .slice(0, limit);
}

export async function getAiExposureScores() {
  if (isRelationalStoreConfigured()) {
    const relationalScores = await readRelationalAiExposureScores();
    if (relationalScores.length > 0) {
      return relationalScores;
    }
  }

  const store = await readLocalStore();
  return store.aiExposureScores.sort((a, b) => b.exposureScore - a.exposureScore);
}

export async function createBriefing(input: BriefingInput, content: string, model: string): Promise<StoredBriefing> {
  if (isRelationalStoreConfigured()) {
    return createRelationalBriefing({
      theme: input.theme,
      selectedSeriesIds: input.seriesIds,
      selectedCompositeIds: input.compositeIds,
      selectedInsightIds: input.insightIds,
      geography: input.geography,
      content,
      model
    });
  }

  const store = await readLocalStore();
  const briefing: StoredBriefing = {
    id: store.briefings.reduce((max, item) => Math.max(max, item.id), 0) + 1,
    theme: input.theme,
    selectedSeriesIds: input.seriesIds,
    selectedCompositeIds: input.compositeIds,
    selectedInsightIds: input.insightIds,
    geography: input.geography,
    content,
    model,
    createdAt: new Date().toISOString()
  };
  store.briefings.push(briefing);
  await writeLocalStore(store);
  return briefing;
}

export async function listBriefings() {
  if (isRelationalStoreConfigured()) {
    return listRelationalBriefings();
  }

  const store = await readLocalStore();
  return store.briefings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getBriefing(id: number) {
  if (isRelationalStoreConfigured()) {
    return getRelationalBriefing(id);
  }

  const store = await readLocalStore();
  return store.briefings.find((briefing) => briefing.id === id) ?? null;
}

export async function getSourcesData(): Promise<SourcesPageData> {
  const useRelational = await hasRelationalSeries();
  const store = useRelational ? null : await readLocalStore();
  const seriesRows = useRelational ? await readRelationalSeries() : store?.series ?? [];
  const sources = Array.from(new Set(seriesRows.map((series) => series.source))).map((source) => {
    const indicators = seriesRows.filter((series) => series.source === source);
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
    refreshLog: useRelational
      ? (await readRelationalRefreshLog()).map((entry) => ({
          id: entry.id,
          source: entry.source,
          seriesId: entry.series_id,
          status: entry.status,
          message: entry.message,
          startedAt: new Date(entry.started_at).toISOString(),
          completedAt: entry.completed_at ? new Date(entry.completed_at).toISOString() : null
        }))
      : (store?.refreshLog ?? []).sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 20)
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

export type FredRefreshResult = {
  seriesId: string;
  observations: ObservationPoint[] | null;
  status: RefreshStatus;
  message: string | null;
  startedAt: string;
  completedAt: string;
};

// Applies a full FRED refresh in a SINGLE read-modify-write. Per-observation
// writes would rewrite the entire store on every call (catastrophic against the
// Neon-backed JSONB store), so all series, observations, and log entries are
// merged in memory and persisted once.
export async function applyFredRefresh(results: FredRefreshResult[], refreshedAt: string) {
  if (isRelationalStoreConfigured()) {
    await applyRelationalFredRefresh(results, refreshedAt);
    return;
  }

  const store = await readLocalStore();

  // Keep the series catalog in sync (preserving last-refreshed timestamps).
  const existingById = new Map(store.series.map((series) => [series.id, series]));
  store.series = INDICATOR_CATALOG.map((indicator) => ({
    ...indicator,
    lastRefreshedAt: existingById.get(indicator.id)?.lastRefreshedAt ?? null
  }));
  const seriesById = new Map(store.series.map((series) => [series.id, series]));

  let nextLogId = store.refreshLog.reduce((max, entry) => Math.max(max, entry.id), 0) + 1;

  for (const result of results) {
    if (result.observations) {
      const incomingKeys = new Set(
        result.observations.map((point) => `${point.seriesId}|${point.geography}|${point.date}`)
      );
      store.observations = store.observations.filter(
        (point) => !incomingKeys.has(`${point.seriesId}|${point.geography}|${point.date}`)
      );
      store.observations.push(...result.observations);

      const series = seriesById.get(result.seriesId);
      if (series) {
        series.lastRefreshedAt = refreshedAt;
      }
    }

    store.refreshLog.push({
      id: nextLogId++,
      source: "FRED",
      seriesId: result.seriesId,
      status: result.status,
      message: result.message,
      startedAt: result.startedAt,
      completedAt: result.completedAt
    });
  }

  await writeLocalStore(store);
}
