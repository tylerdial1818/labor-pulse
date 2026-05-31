import { readFile } from "node:fs/promises";

import { createDbClient } from "../src/lib/db/client";
import { upsertObservation, writeRefreshLog } from "../src/lib/db/queries";

type EconomicIndexRecord = {
  releaseDate: string;
  geography?: string;
  usageShare: number | null;
};

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      current += '"';
      index += 1;
    } else if (character === '"') {
      inQuotes = !inQuotes;
    } else if (character === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function parseEconomicIndexCsv(contents: string): EconomicIndexRecord[] {
  const [headerLine, ...lines] = contents.trim().split(/\r?\n/);

  if (!headerLine) {
    throw new Error("Economic Index CSV is empty.");
  }

  const headers = parseCsvLine(headerLine);
  const releaseDateIndex = headers.indexOf("release_date");
  const usageShareIndex = headers.indexOf("usage_share");
  const geographyIndex = headers.indexOf("geography");

  if (releaseDateIndex === -1 || usageShareIndex === -1) {
    throw new Error("Economic Index CSV requires release_date and usage_share columns.");
  }

  return lines.filter(Boolean).map((line, index) => {
    const values = parseCsvLine(line);
    const releaseDate = values[releaseDateIndex];
    const rawUsageShare = values[usageShareIndex];
    const usageShare = rawUsageShare === "" ? null : Number(rawUsageShare);

    if (!releaseDate || !/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
      throw new Error(`Invalid release_date at CSV row ${index + 2}.`);
    }

    if (usageShare !== null && !Number.isFinite(usageShare)) {
      throw new Error(`Invalid usage_share at CSV row ${index + 2}.`);
    }

    return {
      releaseDate,
      usageShare,
      geography: geographyIndex === -1 ? "US" : values[geographyIndex] || "US"
    };
  });
}

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error("Usage: tsx scripts/ingest-economic-index.ts path/to/economic-index.csv");
  }

  const startedAt = new Date().toISOString();
  const db = createDbClient();
  const records = parseEconomicIndexCsv(await readFile(filePath, "utf8"));

  for (const record of records) {
    await upsertObservation(
      {
        seriesId: "ANTHROPIC_ECONOMIC_INDEX",
        geography: record.geography ?? "US",
        date: record.releaseDate,
        value: record.usageShare
      },
      db
    );
  }

  await writeRefreshLog(
    {
      source: "Anthropic Economic Index",
      seriesId: "ANTHROPIC_ECONOMIC_INDEX",
      status: "success",
      message: `Imported ${records.length} records.`,
      startedAt,
      completedAt: new Date().toISOString()
    },
    db
  );

  console.log(`Imported ${records.length} Anthropic Economic Index records.`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
