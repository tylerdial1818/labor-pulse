import type { AiExposureScore } from "@/types/v15";

export const EXPOSURE_LOOKUP_LIMIT = 12;

/** Case-insensitive title match, or SOC code prefix match. Keeps the input order (most exposed first). */
export function filterExposureScores(scores: AiExposureScore[], query: string, limit = EXPOSURE_LOOKUP_LIMIT): AiExposureScore[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return scores.slice(0, limit);
  return scores
    .filter((score) => score.occupationTitle.toLowerCase().includes(needle) || score.occupationSocCode.startsWith(needle))
    .slice(0, limit);
}

export type ExposureDistribution = { total: number; high: number; moderate: number; low: number };

/** Count occupations (unweighted by employment) in each exposure band. */
export function exposureDistribution(scores: AiExposureScore[]): ExposureDistribution {
  const counts: ExposureDistribution = { total: scores.length, high: 0, moderate: 0, low: 0 };
  for (const score of scores) counts[score.exposureCategory] += 1;
  return counts;
}
