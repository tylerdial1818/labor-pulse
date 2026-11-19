// Freshness rules for public data on Labor Pulse.
//
// Each check compares the latest date we hold with how old that date can
// reasonably be given the source's release schedule. Limits include normal
// publication lags. For example, JOLTS for September is released in early
// November, so a monthly observation can be about 80 days old and still be
// current.

export type FreshnessFrequency = "daily" | "weekly" | "monthly" | "quarterly";

export const MAX_AGE_DAYS: Record<FreshnessFrequency, number> = {
  daily: 3,
  weekly: 14,
  monthly: 100,
  quarterly: 200
};

export type FreshnessInput = {
  id: string;
  label: string;
  frequency: FreshnessFrequency;
  latestDate: string | null;
};

export type FreshnessCheck = FreshnessInput & {
  ageDays: number | null;
  maxAgeDays: number;
  status: "current" | "stale" | "missing";
};

export type FreshnessReport = {
  checkedAt: string;
  ok: boolean;
  staleCount: number;
  checks: FreshnessCheck[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function ageInDays(latestDate: string, now: Date) {
  const latest = new Date(latestDate.length === 10 ? `${latestDate}T00:00:00Z` : latestDate);
  return Math.floor((now.getTime() - latest.getTime()) / DAY_MS);
}

export function assessFreshness(inputs: FreshnessInput[], now = new Date()): FreshnessReport {
  const checks = inputs.map((input): FreshnessCheck => {
    const maxAgeDays = MAX_AGE_DAYS[input.frequency];

    if (!input.latestDate) {
      return { ...input, ageDays: null, maxAgeDays, status: "missing" };
    }

    const ageDays = ageInDays(input.latestDate, now);
    return { ...input, ageDays, maxAgeDays, status: ageDays > maxAgeDays ? "stale" : "current" };
  });

  const staleCount = checks.filter((check) => check.status !== "current").length;

  return { checkedAt: now.toISOString(), ok: staleCount === 0, staleCount, checks };
}
