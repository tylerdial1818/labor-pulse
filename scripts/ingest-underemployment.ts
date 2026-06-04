import { z } from "zod";
import * as XLSX from "xlsx";
import { loadEnvConfig } from "@next/env";

import { ensureRelationalSchema, isRelationalStoreConfigured } from "@/lib/db/relational-store";
import { majorSeeds, NY_FED_AS_OF_DATE, NY_FED_SOURCE_URL } from "@/lib/underemployment/sample-data";

loadEnvConfig(process.cwd());

const workbookUrlSchema = z.string().url();

const candidateUrls = [
  "https://www.newyorkfed.org/medialibrary/Research/Interactives/Data/college-labor-market/College-labor-data",
  "https://www.newyorkfed.org/medialibrary/Research/Interactives/Data/college-labor-market/College-labor-data.xlsx",
  "https://www.newyorkfed.org/medialibrary/Research/Interactives/Data/college-labor-market/College-labor-data_historical.xlsx"
];

async function fetchWorkbook(url: string) {
  const response = await fetch(url);
  if (!response.ok) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("spreadsheet") && !contentType.includes("excel") && !url.endsWith(".xlsx")) return null;
  return Buffer.from(await response.arrayBuffer());
}

async function findWorkbookBuffer() {
  for (const candidate of candidateUrls) {
    const url = workbookUrlSchema.parse(candidate);
    const buffer = await fetchWorkbook(url);
    if (buffer) return { buffer, sourceUrl: url };
  }

  return null;
}

function parseWorkbook(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  return workbook.SheetNames.map((name) => ({
    name,
    rows: XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[name] ?? {}, { defval: null })
  }));
}

async function main() {
  const workbook = await findWorkbookBuffer();

  if (workbook) {
    const sheets = parseWorkbook(workbook.buffer);
    console.log(`Downloaded NY Fed workbook from ${workbook.sourceUrl}`);
    console.log(`Parsed ${sheets.length} sheets: ${sheets.map((sheet) => sheet.name).join(", ")}`);
  } else {
    console.log("NY Fed workbook download was unavailable. Seed data remains available for local build and UI development.");
  }

  if (!isRelationalStoreConfigured()) {
    console.log("DATABASE_URL is not configured. Skipping normalized table upserts.");
    console.log(`Prepared ${majorSeeds.length} underemployment major seed rows as of ${NY_FED_AS_OF_DATE}. Source: ${NY_FED_SOURCE_URL}`);
    return;
  }

  await ensureRelationalSchema();
  console.log("Relational schema is ready. Normalized underemployment upserts can run once workbook sheet mapping is confirmed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
