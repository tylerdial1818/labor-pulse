import "server-only";

import { headlineTrend, majorSeeds, NY_FED_AS_OF_DATE, toMajorProfile, trajectorySeries } from "@/lib/underemployment/sample-data";
import type { DefinitionalOverlap, MajorListItem, MajorProfile, UnderemploymentCohort } from "@/types/underemployment";

function rankedProfiles(cohort: UnderemploymentCohort) {
  return [...majorSeeds]
    .sort((a, b) => (cohort === "recent_grads" ? b.recentRate - a.recentRate : b.allRate - a.allRate))
    .map((seed, index) => toMajorProfile(seed, cohort, index + 1));
}

export async function readHeadlineTrend() {
  return headlineTrend;
}

export async function readMajorProfiles(cohort: UnderemploymentCohort = "recent_grads"): Promise<MajorProfile[]> {
  return rankedProfiles(cohort);
}

export async function readMajorProfile(id: number, cohort: UnderemploymentCohort = "recent_grads") {
  return rankedProfiles(cohort).find((major) => major.id === id) ?? null;
}

export async function readMajorList(): Promise<MajorListItem[]> {
  return [...majorSeeds]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((major) => ({
      id: major.id,
      name: major.name,
      category: major.category,
      isCommonOnline: toMajorProfile(major, "recent_grads", 1).isCommonOnline
    }));
}

export async function readTrajectorySeries() {
  return trajectorySeries;
}

export async function readDefinitionalOverlap(): Promise<DefinitionalOverlap> {
  return {
    involuntaryPartTime: 4577,
    skillsUnderemployment: 41.5,
    hoursUnderemployment: 34.3,
    overlapNotes:
      "Definitions use different denominators. Involuntary part-time work is a worker count, skills underemployment is a college-graduate share, and hours pressure is proxied with average weekly hours."
  };
}

export async function readRelatedUnderemploymentInsights() {
  return [
    {
      title: "NY Fed labor market outcomes for recent graduates",
      sourceName: "Federal Reserve Bank of New York",
      sourceUrl: "https://www.newyorkfed.org/research/college-labor-market"
    },
    {
      title: "Underemployment in the early careers of college graduates",
      sourceName: "NBER and New York Fed",
      sourceUrl: "https://www.nber.org/books-and-chapters/education-skills-and-technical-change-implications-future-us-gdp-growth/underemployment-early-careers-college-graduates-following-great-recession"
    }
  ];
}

export function getUnderemploymentAsOfDate() {
  return NY_FED_AS_OF_DATE;
}
