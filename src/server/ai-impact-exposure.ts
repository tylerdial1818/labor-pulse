import "server-only";

import { fetchEloundouOccupationScores } from "@/lib/ai-impact/eloundou";
import { getAiExposureScores } from "@/lib/db/queries";
import type { AiExposureScore } from "@/types/v15";

// The local seed holds only a handful of rows. Below this, the full table has
// not been ingested, so read the published CSV directly instead.
const FULL_TABLE_MIN_ROWS = 100;
const ONE_DAY = 86_400;

/** Every occupation's Eloundou et al. exposure score, most exposed first. */
export async function getExposureTable(): Promise<{ scores: AiExposureScore[]; complete: boolean }> {
  const stored = await getAiExposureScores().catch(() => [] as AiExposureScore[]);
  if (stored.length >= FULL_TABLE_MIN_ROWS) return { scores: stored, complete: true };

  try {
    const fetched = await fetchEloundouOccupationScores(undefined, ONE_DAY);
    return { scores: [...fetched].sort((a, b) => b.exposureScore - a.exposureScore), complete: true };
  } catch {
    return { scores: stored, complete: false };
  }
}
