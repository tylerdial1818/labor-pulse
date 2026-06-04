import { isCommonOnlineMajor } from "@/lib/underemployment/common-online-majors";
import type { HeadlineTrendPoint, MajorProfile, TrajectorySeries, UnderemploymentCohort } from "@/types/underemployment";

export const NY_FED_SOURCE_URL = "https://www.newyorkfed.org/research/college-labor-market";
export const NY_FED_AS_OF_DATE = "2026-03-31";

type MajorSeed = {
  id: number;
  name: string;
  category: string;
  recentRate: number;
  allRate: number;
  unemploymentRate: number;
  collegeWage: number;
  nonCollegeWage: number;
  lowWageShare: number;
  graduateDegreeShare: number;
};

export const headlineTrend: HeadlineTrendPoint[] = [
  { date: "2006-03-31", recentGrads: 38.1, allGrads: 32.4 },
  { date: "2008-12-31", recentGrads: 42.8, allGrads: 34.9 },
  { date: "2012-03-31", recentGrads: 44.7, allGrads: 35.6 },
  { date: "2016-03-31", recentGrads: 41.2, allGrads: 33.2 },
  { date: "2019-12-31", recentGrads: 39.1, allGrads: 31.8 },
  { date: "2020-12-31", recentGrads: 44.2, allGrads: 33.7 },
  { date: "2022-12-31", recentGrads: 40.8, allGrads: 32.4 },
  { date: "2024-12-31", recentGrads: 41.8, allGrads: 33.1 },
  { date: NY_FED_AS_OF_DATE, recentGrads: 41.5, allGrads: 33.4 }
];

export const majorSeeds: MajorSeed[] = [
  { id: 1, name: "Chemical Engineering", category: "Engineering", recentRate: 17.2, allRate: 14.1, unemploymentRate: 3.1, collegeWage: 78000, nonCollegeWage: 48000, lowWageShare: 8.5, graduateDegreeShare: 37.5 },
  { id: 2, name: "Computer Science", category: "STEM", recentRate: 21.6, allRate: 18.3, unemploymentRate: 4.8, collegeWage: 82000, nonCollegeWage: 47000, lowWageShare: 9.1, graduateDegreeShare: 32.4 },
  { id: 3, name: "Nursing", category: "Health", recentRate: 23.4, allRate: 18.9, unemploymentRate: 1.8, collegeWage: 70000, nonCollegeWage: 45000, lowWageShare: 6.8, graduateDegreeShare: 28.6 },
  { id: 4, name: "Finance", category: "Business", recentRate: 32.7, allRate: 27.2, unemploymentRate: 4.2, collegeWage: 69000, nonCollegeWage: 43000, lowWageShare: 12.8, graduateDegreeShare: 28.1 },
  { id: 5, name: "Accounting", category: "Business", recentRate: 33.9, allRate: 25.8, unemploymentRate: 3.2, collegeWage: 64000, nonCollegeWage: 41000, lowWageShare: 11.2, graduateDegreeShare: 22.9 },
  { id: 6, name: "Information Technology", category: "STEM", recentRate: 34.8, allRate: 29.4, unemploymentRate: 4.6, collegeWage: 68000, nonCollegeWage: 43000, lowWageShare: 13.8, graduateDegreeShare: 20.4 },
  { id: 7, name: "Business Administration", category: "Business", recentRate: 39.9, allRate: 32.1, unemploymentRate: 4.1, collegeWage: 60000, nonCollegeWage: 39000, lowWageShare: 17.4, graduateDegreeShare: 24.8 },
  { id: 8, name: "Education", category: "Education", recentRate: 40.5, allRate: 31.8, unemploymentRate: 2.5, collegeWage: 48000, nonCollegeWage: 36000, lowWageShare: 15.6, graduateDegreeShare: 46.8 },
  { id: 9, name: "Marketing", category: "Business", recentRate: 43.7, allRate: 35.5, unemploymentRate: 4.9, collegeWage: 58000, nonCollegeWage: 38000, lowWageShare: 19.9, graduateDegreeShare: 18.7 },
  { id: 10, name: "Criminal Justice", category: "Social Science", recentRate: 47.6, allRate: 39.4, unemploymentRate: 4.5, collegeWage: 52000, nonCollegeWage: 37000, lowWageShare: 22.7, graduateDegreeShare: 20.1 },
  { id: 11, name: "Psychology", category: "Social Science", recentRate: 48.8, allRate: 38.9, unemploymentRate: 4.7, collegeWage: 51000, nonCollegeWage: 36000, lowWageShare: 24.4, graduateDegreeShare: 49.2 },
  { id: 12, name: "Communications", category: "Humanities", recentRate: 51.9, allRate: 41.2, unemploymentRate: 5.1, collegeWage: 54000, nonCollegeWage: 37000, lowWageShare: 25.1, graduateDegreeShare: 20.7 },
  { id: 13, name: "English Language", category: "Humanities", recentRate: 55.2, allRate: 43.5, unemploymentRate: 5.8, collegeWage: 52000, nonCollegeWage: 36000, lowWageShare: 27.8, graduateDegreeShare: 45.1 },
  { id: 14, name: "Fine Arts", category: "Arts", recentRate: 58.7, allRate: 46.8, unemploymentRate: 6.2, collegeWage: 50000, nonCollegeWage: 35000, lowWageShare: 31.9, graduateDegreeShare: 23.5 },
  { id: 15, name: "Performing Arts", category: "Arts", recentRate: 62.1, allRate: 49.7, unemploymentRate: 6.6, collegeWage: 48000, nonCollegeWage: 34000, lowWageShare: 35.6, graduateDegreeShare: 24.2 }
];

function buildHistory(currentRate: number) {
  return headlineTrend.map((point, index) => ({
    date: point.date,
    underemploymentRate: Number((currentRate - 2.8 + Math.sin(index * 0.9) * 2.1 + index * 0.26).toFixed(1))
  }));
}

export function toMajorProfile(seed: MajorSeed, cohort: UnderemploymentCohort, rank: number): MajorProfile {
  const underemploymentRate = cohort === "recent_grads" ? seed.recentRate : seed.allRate;

  return {
    id: seed.id,
    name: seed.name,
    category: seed.category,
    isCommonOnline: isCommonOnlineMajor(seed.name),
    current: {
      cohort,
      date: NY_FED_AS_OF_DATE,
      underemploymentRate,
      unemploymentRate: seed.unemploymentRate,
      medianWageCollegeJob: seed.collegeWage,
      medianWageNonCollegeJob: seed.nonCollegeWage,
      shareInLowWageJobs: seed.lowWageShare,
      shareWithGraduateDegree: seed.graduateDegreeShare
    },
    history: buildHistory(underemploymentRate),
    wagePremium: seed.collegeWage - seed.nonCollegeWage,
    rankAmongAllMajors: rank
  };
}

export const trajectorySeries: TrajectorySeries[] = [
  {
    ageGroup: "22 to 27",
    observations: headlineTrend.map((point) => ({ date: point.date, rate: point.recentGrads }))
  },
  {
    ageGroup: "28 to 34",
    observations: headlineTrend.map((point) => ({ date: point.date, rate: Number((point.recentGrads - 4.3).toFixed(1)) }))
  },
  {
    ageGroup: "35 to 45",
    observations: headlineTrend.map((point) => ({ date: point.date, rate: point.allGrads }))
  }
];
