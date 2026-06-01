import { neon } from "@neondatabase/serverless";

import { COMPOSITE_DEFINITIONS } from "@/lib/composites/calculate";
import { LABOR_PULSE_SCHEMA_STATEMENTS } from "@/lib/db/schema";
import { INDICATOR_CATALOG } from "@/server/indicator-catalog";
import type { IndicatorSeries, ObservationPoint, RefreshStatus } from "@/server/labor-types";
import type { AiExposureScore, CompositeObservation, StoredBriefing } from "@/types/v15";

type NeonSql = ReturnType<typeof neon>;
type Row = Record<string, unknown>;

let cachedSql: NeonSql | null = null;
let schemaReady: Promise<void> | null = null;

export function isRelationalStoreConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for the relational store.");
  }

  if (!cachedSql) {
    cachedSql = neon(databaseUrl);
  }

  return cachedSql;
}

export async function ensureRelationalSchema() {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = (async () => {
      for (const statement of LABOR_PULSE_SCHEMA_STATEMENTS) {
        await sql.query(statement);
      }
    })();
  }

  await schemaReady;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function nullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function dateValue(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : null;
}

function dateOnly(value: unknown) {
  const resolved = dateValue(value);
  return resolved ? resolved.slice(0, 10) : "";
}

function numberValue(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function jsonArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toSeries(row: Row): IndicatorSeries {
  return {
    id: stringValue(row.id),
    title: stringValue(row.title),
    shortTitle: stringValue(row.short_title),
    category: stringValue(row.category) as IndicatorSeries["category"],
    source: stringValue(row.source) as IndicatorSeries["source"],
    sourceUrl: stringValue(row.source_url),
    units: stringValue(row.units),
    unitLabel: stringValue(row.unit_label),
    frequency: stringValue(row.frequency) as IndicatorSeries["frequency"],
    seasonalAdjustment: nullableString(row.seasonal_adjustment),
    isProxy: row.is_proxy === true,
    methodologyNote: nullableString(row.methodology_note),
    stateSeriesPattern: nullableString(row.state_series_pattern),
    lastRefreshedAt: dateValue(row.last_refreshed_at)
  };
}

function toObservation(row: Row): ObservationPoint {
  return {
    seriesId: stringValue(row.series_id),
    geography: stringValue(row.geography) || "US",
    date: dateOnly(row.date),
    value: numberValue(row.value)
  };
}

export async function seedRelationalCatalog() {
  await ensureRelationalSchema();
  const sql = getSql();

  for (const series of INDICATOR_CATALOG) {
    await sql`
      insert into series (
        id,
        title,
        short_title,
        category,
        source,
        source_url,
        units,
        unit_label,
        frequency,
        seasonal_adjustment,
        is_proxy,
        methodology_note,
        state_series_pattern
      )
      values (
        ${series.id},
        ${series.title},
        ${series.shortTitle},
        ${series.category}::series_category,
        ${series.source},
        ${series.sourceUrl},
        ${series.units},
        ${series.unitLabel},
        ${series.frequency}::frequency,
        ${series.seasonalAdjustment},
        ${series.isProxy},
        ${series.methodologyNote},
        ${series.stateSeriesPattern}
      )
      on conflict (id) do update set
        title = excluded.title,
        short_title = excluded.short_title,
        category = excluded.category,
        source = excluded.source,
        source_url = excluded.source_url,
        units = excluded.units,
        unit_label = excluded.unit_label,
        frequency = excluded.frequency,
        seasonal_adjustment = excluded.seasonal_adjustment,
        is_proxy = excluded.is_proxy,
        methodology_note = excluded.methodology_note,
        state_series_pattern = excluded.state_series_pattern
    `;
  }

  for (const composite of COMPOSITE_DEFINITIONS) {
    await sql`
      insert into composites (id, name, description, category, input_series, methodology_note, threshold_interpretation)
      values (
        ${composite.id},
        ${composite.name},
        ${composite.description},
        ${composite.category},
        ${JSON.stringify(composite.inputSeries)}::jsonb,
        ${composite.methodologyNote},
        ${JSON.stringify(composite.thresholdInterpretation)}::jsonb
      )
      on conflict (id) do update set
        name = excluded.name,
        description = excluded.description,
        category = excluded.category,
        input_series = excluded.input_series,
        methodology_note = excluded.methodology_note,
        threshold_interpretation = excluded.threshold_interpretation
    `;
  }
}

export async function hasRelationalSeries() {
  if (!isRelationalStoreConfigured()) return false;
  await seedRelationalCatalog();
  const sql = getSql();
  const rows = (await sql`select exists(select 1 from observations limit 1) as has_rows`) as Row[];
  return rows[0]?.has_rows === true;
}

export async function readRelationalSeries() {
  await seedRelationalCatalog();
  const sql = getSql();
  const rows = (await sql`
    select
      id,
      title,
      short_title,
      category::text as category,
      source,
      source_url,
      units,
      unit_label,
      frequency::text as frequency,
      seasonal_adjustment,
      is_proxy,
      methodology_note,
      state_series_pattern,
      last_refreshed_at
    from series
    order by id
  `) as Row[];
  return rows.map(toSeries);
}

export async function readRelationalObservations(seriesId?: string, geography = "US") {
  await seedRelationalCatalog();
  const sql = getSql();
  const rows = seriesId
    ? ((await sql`
        select series_id, geography, date, value
        from observations
        where series_id = ${seriesId} and geography = ${geography}
        order by date
      `) as Row[])
    : ((await sql`
        select series_id, geography, date, value
        from observations
        where geography = ${geography}
        order by series_id, date
      `) as Row[]);
  return rows.map(toObservation);
}

export async function readRelationalRefreshLog() {
  await seedRelationalCatalog();
  const sql = getSql();
  return (await sql`
    select id, source, series_id, status::text as status, message, started_at, completed_at
    from refresh_log
    order by started_at desc
    limit 50
  `) as Array<{
    id: number;
    source: string;
    series_id: string | null;
    status: RefreshStatus;
    message: string | null;
    started_at: Date | string;
    completed_at: Date | string | null;
  }>;
}

export async function applyRelationalFredRefresh(
  results: Array<{
    seriesId: string;
    observations: ObservationPoint[] | null;
    status: RefreshStatus;
    message: string | null;
    startedAt: string;
    completedAt: string;
  }>,
  refreshedAt: string
) {
  await seedRelationalCatalog();
  const sql = getSql();

  for (const result of results) {
    if (result.observations) {
      for (const point of result.observations) {
        await sql`
          insert into observations (series_id, geography, date, value)
          values (${point.seriesId}, ${point.geography}, ${point.date}, ${point.value})
          on conflict (series_id, geography, date) do update set value = excluded.value
        `;
      }

      await sql`update series set last_refreshed_at = ${refreshedAt} where id = ${result.seriesId}`;
    }

    await sql`
      insert into refresh_log (source, series_id, status, message, started_at, completed_at)
      values ('FRED', ${result.seriesId}, ${result.status}::refresh_status, ${result.message}, ${result.startedAt}, ${result.completedAt})
    `;
  }
}

export async function replaceRelationalCompositeObservations(observations: CompositeObservation[]) {
  await seedRelationalCatalog();
  const sql = getSql();
  await sql`delete from composite_observations`;

  for (const point of observations) {
    await sql`
      insert into composite_observations (composite_id, geography, date, value)
      values (${point.compositeId}, ${point.geography}, ${point.date}, ${point.value})
      on conflict (composite_id, geography, date) do update set value = excluded.value
    `;
  }
}

export async function readRelationalCompositeObservations() {
  await seedRelationalCatalog();
  const sql = getSql();
  const rows = (await sql`
    select composite_id, geography, date, value
    from composite_observations
    order by composite_id, date
  `) as Row[];
  return rows.map((row) => ({
    compositeId: stringValue(row.composite_id) as CompositeObservation["compositeId"],
    geography: stringValue(row.geography) || "US",
    date: dateOnly(row.date),
    value: numberValue(row.value) ?? 0
  }));
}

export async function readRelationalAiExposureScores(): Promise<AiExposureScore[]> {
  await seedRelationalCatalog();
  const sql = getSql();
  const rows = (await sql`
    select occupation_soc_code, occupation_title, exposure_score, exposure_category
    from ai_exposure_scores
    order by exposure_score desc
  `) as Row[];
  return rows.map((row) => ({
    occupationSocCode: stringValue(row.occupation_soc_code),
    occupationTitle: stringValue(row.occupation_title),
    exposureScore: numberValue(row.exposure_score) ?? 0,
    exposureCategory: stringValue(row.exposure_category) as AiExposureScore["exposureCategory"]
  }));
}

export async function insertRelationalAiExposureScores(scores: AiExposureScore[], methodologyNote: string) {
  await seedRelationalCatalog();
  const sql = getSql();

  for (const score of scores) {
    await sql`
      insert into ai_exposure_scores (
        occupation_soc_code,
        occupation_title,
        exposure_score,
        exposure_category,
        methodology_note
      )
      values (
        ${score.occupationSocCode},
        ${score.occupationTitle},
        ${score.exposureScore},
        ${score.exposureCategory},
        ${methodologyNote}
      )
      on conflict (occupation_soc_code) do update set
        occupation_title = excluded.occupation_title,
        exposure_score = excluded.exposure_score,
        exposure_category = excluded.exposure_category,
        methodology_note = excluded.methodology_note
    `;
  }
}

export async function createRelationalBriefing(input: {
  theme: string;
  selectedSeriesIds: string[];
  selectedCompositeIds: string[];
  selectedInsightIds: string[];
  geography: string;
  content: string;
  model: string;
}): Promise<StoredBriefing> {
  await seedRelationalCatalog();
  const sql = getSql();
  const rows = (await sql`
    insert into briefings (
      theme,
      selected_series_ids,
      selected_composite_ids,
      selected_insight_ids,
      geography,
      content,
      model
    )
    values (
      ${input.theme},
      ${JSON.stringify(input.selectedSeriesIds)}::jsonb,
      ${JSON.stringify(input.selectedCompositeIds)}::jsonb,
      ${JSON.stringify(input.selectedInsightIds)}::jsonb,
      ${input.geography},
      ${input.content},
      ${input.model}
    )
    returning id, theme, selected_series_ids, selected_composite_ids, selected_insight_ids, geography, content, model, created_at
  `) as Row[];
  return toBriefing(rows[0]);
}

function toBriefing(row: Row): StoredBriefing {
  return {
    id: Number(row.id),
    theme: stringValue(row.theme),
    selectedSeriesIds: jsonArray<string>(row.selected_series_ids),
    selectedCompositeIds: jsonArray<string>(row.selected_composite_ids),
    selectedInsightIds: jsonArray<string>(row.selected_insight_ids),
    geography: stringValue(row.geography) || "US",
    content: stringValue(row.content),
    model: stringValue(row.model),
    createdAt: dateValue(row.created_at) ?? new Date().toISOString()
  };
}

export async function listRelationalBriefings() {
  await seedRelationalCatalog();
  const sql = getSql();
  const rows = (await sql`
    select id, theme, selected_series_ids, selected_composite_ids, selected_insight_ids, geography, content, model, created_at
    from briefings
    order by created_at desc
  `) as Row[];
  return rows.map(toBriefing);
}

export async function getRelationalBriefing(id: number) {
  await seedRelationalCatalog();
  const sql = getSql();
  const rows = (await sql`
    select id, theme, selected_series_ids, selected_composite_ids, selected_insight_ids, geography, content, model, created_at
    from briefings
    where id = ${id}
  `) as Row[];
  return rows[0] ? toBriefing(rows[0]) : null;
}
