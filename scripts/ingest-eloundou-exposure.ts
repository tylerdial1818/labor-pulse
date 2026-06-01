import { insertRelationalAiExposureScores } from "../src/lib/db/relational-store";
import { ELOUNDOU_METHODOLOGY_NOTE, fetchEloundouOccupationScores } from "../src/lib/ai-impact/eloundou";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to ingest Eloundou exposure scores into the relational store.");
  }

  const scores = await fetchEloundouOccupationScores();
  await insertRelationalAiExposureScores(scores, ELOUNDOU_METHODOLOGY_NOTE);
  console.log(`Imported ${scores.length} Eloundou occupation exposure scores.`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
