import "server-only";

import {
  getUnderemploymentAsOfDate,
  readDefinitionalOverlap,
  readHeadlineTrend,
  readMajorList,
  readMajorProfile,
  readMajorProfiles,
  readRelatedUnderemploymentInsights,
  readTrajectorySeries
} from "@/lib/underemployment/queries";
import type { MajorProfile, UnderemploymentCohort, UnderemploymentPageData } from "@/types/underemployment";

type MajorSort = "underemployment_desc" | "underemployment_asc" | "wage_premium_desc" | "alphabetical";

function sortProfiles(profiles: MajorProfile[], sortBy: MajorSort) {
  return [...profiles].sort((a, b) => {
    if (sortBy === "underemployment_asc") return a.current.underemploymentRate - b.current.underemploymentRate;
    if (sortBy === "wage_premium_desc") return b.wagePremium - a.wagePremium;
    if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
    return b.current.underemploymentRate - a.current.underemploymentRate;
  });
}

export async function getCurrentHeadlineRates() {
  const trend = await readHeadlineTrend();
  const latest = trend.at(-1);

  return {
    recentGrads: latest?.recentGrads ?? 41.5,
    allGrads: latest?.allGrads ?? 33.4,
    asOfDate: latest?.date ?? getUnderemploymentAsOfDate()
  };
}

export async function getMajorRanking(cohort: UnderemploymentCohort = "recent_grads", sortBy: MajorSort = "underemployment_desc", limit?: number) {
  const profiles = sortProfiles(await readMajorProfiles(cohort), sortBy);
  return typeof limit === "number" ? profiles.slice(0, limit) : profiles;
}

export async function getWagePremiumScatter(cohort: UnderemploymentCohort = "recent_grads") {
  const profiles = await readMajorProfiles(cohort);
  return profiles.map((major) => ({
    majorName: major.name,
    underemploymentRate: major.current.underemploymentRate,
    wagePremium: major.wagePremium,
    category: major.category ?? "Other"
  }));
}

export async function getMajorProfile(majorId: number, cohort: UnderemploymentCohort = "recent_grads") {
  return readMajorProfile(majorId, cohort);
}

export async function getTrajectoryByAgeGroup() {
  return readTrajectorySeries();
}

export async function getDefinitionalOverlap() {
  return readDefinitionalOverlap();
}

export async function getCommonOnlineMajorsView() {
  return (await readMajorProfiles("recent_grads")).filter((major) => major.isCommonOnline);
}

export async function getHistoricalContext(majorId: number, cohort: UnderemploymentCohort = "recent_grads") {
  const profile = await readMajorProfile(majorId, cohort);
  if (!profile) return { percentileRank: 0, comparablePeriod: null, yearsOfHistory: 0 };

  const values = profile.history.map((point) => point.underemploymentRate).sort((a, b) => a - b);
  const current = profile.current.underemploymentRate;
  const belowOrEqual = values.filter((value) => value <= current).length;
  const comparable = profile.history.find((point) => Math.abs(point.underemploymentRate - current) <= 0.4 && point.date !== profile.current.date);

  return {
    percentileRank: Math.round((belowOrEqual / Math.max(values.length, 1)) * 100),
    comparablePeriod: comparable ? { date: comparable.date, value: comparable.underemploymentRate } : null,
    yearsOfHistory: values.length > 1 ? new Date(profile.current.date).getUTCFullYear() - new Date(profile.history[0].date).getUTCFullYear() : 0
  };
}

export async function getUnderemploymentPageData(): Promise<UnderemploymentPageData> {
  const [headline, headlineTrend, majorRanking, allMajors, wagePremiumScatter, trajectory, definitionalOverlap, commonOnlineMajors, relatedInsights] =
    await Promise.all([
      getCurrentHeadlineRates(),
      readHeadlineTrend(),
      getMajorRanking("recent_grads", "underemployment_desc"),
      readMajorList(),
      getWagePremiumScatter("recent_grads"),
      getTrajectoryByAgeGroup(),
      getDefinitionalOverlap(),
      getCommonOnlineMajorsView(),
      readRelatedUnderemploymentInsights()
    ]);

  return {
    headline,
    headlineTrend,
    majorRanking,
    allMajors,
    wagePremiumScatter,
    trajectory,
    definitionalOverlap,
    commonOnlineMajors,
    relatedInsights
  };
}
