import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { neon } from "@neondatabase/serverless";

import { buildSeedInsights } from "@/lib/insights/seed";
import type { InsightRefreshResult, InsightSummary } from "@/lib/insights/types";

export type InsightStoreData = {
  insights: InsightSummary[];
  refreshLog: InsightRefreshResult[];
};

const STORE_PATH = path.join(process.cwd(), "data", "labor-pulse-insights.json");
const STORE_KEY = "labor-pulse-insights";
const databaseUrl = process.env.DATABASE_URL;
const useNeon = Boolean(databaseUrl);

type NeonSql = ReturnType<typeof neon>;
let cachedSql: NeonSql | null = null;
let schemaReady: Promise<void> | null = null;

function buildInitialStore(): InsightStoreData {
  return {
    insights: buildSeedInsights(),
    refreshLog: [
      {
        sourceId: "linkedin_manual",
        sourceName: "LinkedIn manual",
        status: "skipped",
        message: "Seed insights loaded; LinkedIn source remains manual until an approved feed exists.",
        fetchedAt: "2026-05-30T08:00:00.000Z",
        summaryId: "seed-linkedin_manual"
      }
    ]
  };
}

function getSql(): NeonSql {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for the Neon-backed insights store.");
  }

  if (!cachedSql) {
    cachedSql = neon(databaseUrl);
  }

  return cachedSql;
}

async function ensureSchema(sql: NeonSql) {
  if (!schemaReady) {
    schemaReady = sql`create table if not exists app_store (id text primary key, data jsonb not null)`.then(() => undefined);
  }

  await schemaReady;
}

async function readNeonStore(): Promise<InsightStoreData> {
  const sql = getSql();
  await ensureSchema(sql);

  const rows = (await sql`select data from app_store where id = ${STORE_KEY}`) as { data: InsightStoreData }[];

  if (rows.length > 0) {
    return rows[0].data;
  }

  const seeded = buildInitialStore();
  await writeNeonStore(seeded);
  return seeded;
}

async function writeNeonStore(data: InsightStoreData) {
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

export async function readInsightStore(): Promise<InsightStoreData> {
  if (useNeon) {
    return readNeonStore();
  }

  await ensureStoreFile();
  return JSON.parse(await readFile(STORE_PATH, "utf8")) as InsightStoreData;
}

export async function writeInsightStore(data: InsightStoreData) {
  if (useNeon) {
    await writeNeonStore(data);
    return;
  }

  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(data, null, 2)}\n`);
}

export async function upsertInsightSummaries(summaries: InsightSummary[], refreshLog: InsightRefreshResult[]) {
  const store = await readInsightStore();
  const incomingIds = new Set(summaries.map((summary) => summary.id));
  const seedIdsToReplace = new Set(summaries.map((summary) => `seed-${summary.sourceId}`));

  store.insights = store.insights.filter((summary) => !incomingIds.has(summary.id) && !seedIdsToReplace.has(summary.id));
  store.insights.push(...summaries);
  store.refreshLog = [...refreshLog, ...store.refreshLog].slice(0, 100);

  await writeInsightStore(store);
  return store;
}
