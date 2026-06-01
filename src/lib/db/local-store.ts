import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { neon } from "@neondatabase/serverless";

import { INDICATOR_CATALOG } from "@/server/indicator-catalog";
import type { DefinitionResponse, IndicatorSeries, ObservationPoint, RefreshStatus } from "@/server/labor-types";
import type { AiExposureScore, CompositeDefinition, CompositeObservation, StoredBriefing, StoredInsight } from "@/types/v15";

type StoredDefinition = Omit<DefinitionResponse, "cached">;

export type RefreshLogEntry = {
  id: number;
  source: string;
  seriesId: string | null;
  status: RefreshStatus;
  message: string | null;
  startedAt: string;
  completedAt: string | null;
};

export type LocalStoreData = {
  series: IndicatorSeries[];
  observations: ObservationPoint[];
  definitions: StoredDefinition[];
  composites: CompositeDefinition[];
  compositeObservations: CompositeObservation[];
  insights: StoredInsight[];
  briefings: StoredBriefing[];
  aiExposureScores: AiExposureScore[];
  refreshLog: RefreshLogEntry[];
};

const STORE_PATH = path.join(process.cwd(), "data", "labor-pulse-store.json");
const DEFAULT_REFRESHED_AT = "2026-05-30T08:00:00.000Z";

const finalValues: Record<string, number> = {
  UNRATE: 4.1,
  PAYEMS: 159_200,
  CIVPART: 62.6,
  CES0500000003: 35.2,
  EMRATIO: 60.0,
  U6RATE: 7.4,
  ICSA: 221_000,
  JTSJOL: 8_100,
  JTSQUR: 2.1,
  JTSLDR: 1.1,
  TEMPHELPS: 2_700,
  AWHAETP: 34.3,
  USPBS: 23_100,
  USINFO: 3_000,
  ANTHROPIC_ECONOMIC_INDEX: 23
};

const comparisonDeltas: Record<string, number> = {
  UNRATE: 0.2,
  PAYEMS: 1_500,
  CIVPART: -0.1,
  CES0500000003: 1.31,
  EMRATIO: 0.1,
  U6RATE: 0.3,
  ICSA: 6_000,
  JTSJOL: -400,
  JTSQUR: -0.1,
  JTSLDR: 0.1,
  TEMPHELPS: -120,
  AWHAETP: 0,
  USPBS: 180,
  USINFO: -15,
  ANTHROPIC_ECONOMIC_INDEX: 3
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function monthDate(indexFromEnd: number) {
  const base = new Date(Date.UTC(2026, 3, 1));
  base.setUTCMonth(base.getUTCMonth() - indexFromEnd);
  return `${base.getUTCFullYear()}-${pad(base.getUTCMonth() + 1)}-01`;
}

function weekDate(indexFromEnd: number) {
  const base = new Date(Date.UTC(2026, 4, 23));
  base.setUTCDate(base.getUTCDate() - indexFromEnd * 7);
  return `${base.getUTCFullYear()}-${pad(base.getUTCMonth() + 1)}-${pad(base.getUTCDate())}`;
}

function buildTrend(seriesId: string, points: number, comparisonOffset: number) {
  const finalValue = finalValues[seriesId] ?? 0;
  const delta = comparisonDeltas[seriesId] ?? 0;
  const comparisonValue = finalValue - delta;
  const rows: ObservationPoint[] = [];

  for (let position = 0; position < points; position += 1) {
    const indexFromEnd = points - 1 - position;
    const date = seriesId === "ICSA" ? weekDate(indexFromEnd) : monthDate(indexFromEnd);
    const seasonal = Math.sin(position / 3) * Math.max(Math.abs(finalValue) * 0.006, 0.03);
    let value = comparisonValue + (delta * position) / Math.max(points - 1, 1) + seasonal;

    if (position === points - 1 - comparisonOffset) {
      value = comparisonValue;
    }

    if (position === points - 1) {
      value = finalValue;
    }

    rows.push({
      seriesId,
      geography: "US",
      date,
      value: Number(value.toFixed(seriesId === "ICSA" ? 0 : 3))
    });
  }

  return rows;
}

function buildAnthropicRows(): ObservationPoint[] {
  return [
    { seriesId: "ANTHROPIC_ECONOMIC_INDEX", geography: "US", date: "2025-09-30", value: 18 },
    { seriesId: "ANTHROPIC_ECONOMIC_INDEX", geography: "US", date: "2025-12-31", value: 20 },
    { seriesId: "ANTHROPIC_ECONOMIC_INDEX", geography: "US", date: "2026-03-27", value: 23 }
  ];
}

const compositeDefinitions: CompositeDefinition[] = [
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
    description: "Percentile-style blend of openings, quits, and wage pressure.",
    category: "tightness",
    inputSeries: ["JTSJOL", "UNRATE", "JTSQUR", "CES0500000003"],
    methodologyNote:
      "A standardized blend of job openings, quits, and wage growth proxies. Higher readings indicate tighter labor-market conditions.",
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
      "A standardized blend of initial claims, layoffs and discharges, and the inverse of weekly hours. Higher readings indicate more labor-market stress.",
    thresholdInterpretation: [
      { label: "Low stress", range: [null, -0.5], color: "green" },
      { label: "Watch", range: [-0.5, 0.5], color: "yellow" },
      { label: "Elevated stress", range: [0.5, null], color: "red" }
    ]
  }
];

const seededInsights: StoredInsight[] = [
  {
    id: 1,
    sourceName: "BLS Employment Situation",
    sourceUrl: "https://www.bls.gov/news.release/empsit.htm",
    title: "Payroll growth remains the main read on labor-market momentum",
    publishedAt: "2026-05-01T12:30:00.000Z",
    summary:
      "The employment situation release remains the primary monthly checkpoint for payroll growth, unemployment, labor-force participation, and wage pressure. Labor Pulse treats it as a quantitative anchor and avoids inferring hiring-practice shifts without supporting qualitative evidence.",
    category: "employment_situation",
    tags: ["payrolls", "unemployment", "wages"],
    rawContent: "Seeded local placeholder for the Employment Situation insight source.",
    ingestedAt: DEFAULT_REFRESHED_AT,
    summaryModel: "deterministic-seed"
  },
  {
    id: 2,
    sourceName: "Federal Reserve Beige Book",
    sourceUrl: "https://www.federalreserve.gov/monetarypolicy/beigebook/",
    title: "Regional hiring anecdotes add texture to national data",
    publishedAt: "2026-04-30T18:00:00.000Z",
    summary:
      "Regional reports can reveal employer behavior that national time series do not capture directly, including hiring standards, wage bargaining, and staffing constraints. Labor Pulse uses these qualitative notes as context, not as substitutes for measured indicators.",
    category: "beige_book",
    tags: ["regional", "hiring-practices", "wages"],
    rawContent: "Seeded local placeholder for Beige Book insight context.",
    ingestedAt: DEFAULT_REFRESHED_AT,
    summaryModel: "deterministic-seed"
  },
  {
    id: 3,
    sourceName: "Anthropic Economic Index",
    sourceUrl: "https://www.anthropic.com/economic-index",
    title: "AI usage signals are directional, not a displacement measure",
    publishedAt: "2026-03-27T12:00:00.000Z",
    summary:
      "Claude usage patterns can help analysts identify where AI tools are entering work activity, but they do not measure economy-wide adoption or job displacement. Labor Pulse surfaces these signals with explicit methodology caveats and keeps them separate from official labor statistics.",
    category: "ai_impact",
    tags: ["ai", "claude", "methodology"],
    rawContent: "Seeded local placeholder for Anthropic Economic Index context.",
    ingestedAt: DEFAULT_REFRESHED_AT,
    summaryModel: "deterministic-seed"
  }
];

const seededAiExposureScores: AiExposureScore[] = [
  { occupationSocCode: "15-1252", occupationTitle: "Software Developers", exposureScore: 0.82, exposureCategory: "high" },
  { occupationSocCode: "13-1111", occupationTitle: "Management Analysts", exposureScore: 0.74, exposureCategory: "high" },
  { occupationSocCode: "43-4051", occupationTitle: "Customer Service Representatives", exposureScore: 0.58, exposureCategory: "moderate" },
  { occupationSocCode: "29-1141", occupationTitle: "Registered Nurses", exposureScore: 0.29, exposureCategory: "low" }
];

function buildInitialStore(): LocalStoreData {
  const series = INDICATOR_CATALOG.map((indicator) => ({
    ...indicator,
    lastRefreshedAt: DEFAULT_REFRESHED_AT
  }));
  const observations = INDICATOR_CATALOG.flatMap((indicator) => {
    if (indicator.id === "ANTHROPIC_ECONOMIC_INDEX") {
      return buildAnthropicRows();
    }

    return buildTrend(indicator.id, indicator.frequency === "weekly" ? 60 : 72, indicator.frequency === "weekly" ? 4 : 12);
  });

  return {
    series,
    observations,
    definitions: [],
    composites: compositeDefinitions,
    compositeObservations: [],
    insights: seededInsights,
    briefings: [],
    aiExposureScores: seededAiExposureScores,
    refreshLog: [
      {
        id: 1,
        source: "Local seed",
        seriesId: null,
        status: "success",
        message: "Seeded v1 indicator catalog and sample observation history.",
        startedAt: DEFAULT_REFRESHED_AT,
        completedAt: DEFAULT_REFRESHED_AT
      }
    ]
  };
}

// Persistence backend selection.
//
// Vercel's serverless filesystem is read-only, so the bundled JSON file works
// for reads but every write throws EROFS. When DATABASE_URL is present we
// persist the store as a single JSONB row in Postgres (Neon) instead, which
// keeps all existing query logic intact while making writes durable. The
// file-backed path remains the default for local development.

const STORE_KEY = "labor-pulse";
const databaseUrl = process.env.DATABASE_URL;
const useNeon = Boolean(databaseUrl);

type NeonSql = ReturnType<typeof neon>;
let cachedSql: NeonSql | null = null;
let schemaReady: Promise<void> | null = null;

function getSql(): NeonSql {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for the Neon-backed store.");
  }

  if (!cachedSql) {
    cachedSql = neon(databaseUrl);
  }

  return cachedSql;
}

async function ensureSchema(sql: NeonSql) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`create table if not exists app_store (id text primary key, data jsonb not null)`;
    })();
  }

  await schemaReady;
}

async function readNeonStore(): Promise<LocalStoreData> {
  const sql = getSql();
  await ensureSchema(sql);

  const rows = (await sql`select data from app_store where id = ${STORE_KEY}`) as { data: LocalStoreData }[];

  if (rows.length > 0) {
    return normalizeStore(rows[0].data);
  }

  const seeded = buildInitialStore();
  await writeNeonStore(seeded);
  return seeded;
}

async function writeNeonStore(data: LocalStoreData) {
  const sql = getSql();
  await ensureSchema(sql);

  await sql`
    insert into app_store (id, data)
    values (${STORE_KEY}, ${JSON.stringify(data)}::jsonb)
    on conflict (id) do update set data = excluded.data
  `;
}

async function ensureStoreFile() {
  try {
    await readFile(STORE_PATH, "utf8");
  } catch {
    await mkdir(path.dirname(STORE_PATH), { recursive: true });
    await writeFile(STORE_PATH, `${JSON.stringify(buildInitialStore(), null, 2)}\n`);
  }
}

export async function readLocalStore(): Promise<LocalStoreData> {
  if (useNeon) {
    return readNeonStore();
  }

  await ensureStoreFile();
  return normalizeStore(JSON.parse(await readFile(STORE_PATH, "utf8")) as LocalStoreData);
}

function normalizeStore(data: LocalStoreData): LocalStoreData {
  return {
    ...data,
    composites: data.composites ?? compositeDefinitions,
    compositeObservations: data.compositeObservations ?? [],
    insights: data.insights ?? seededInsights,
    briefings: data.briefings ?? [],
    aiExposureScores: data.aiExposureScores ?? seededAiExposureScores
  };
}

export async function writeLocalStore(data: LocalStoreData) {
  if (useNeon) {
    await writeNeonStore(data);
    return;
  }

  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(data, null, 2)}\n`);
}

export async function resetLocalStore() {
  const data = buildInitialStore();
  await writeLocalStore(data);
  return data;
}
