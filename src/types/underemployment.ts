export type UnderemploymentCohort = "recent_grads" | "all_grads";

export type MajorProfile = {
  id: number;
  name: string;
  category: string | null;
  isCommonOnline: boolean;
  current: {
    cohort: UnderemploymentCohort;
    date: string;
    underemploymentRate: number;
    unemploymentRate: number;
    medianWageCollegeJob: number;
    medianWageNonCollegeJob: number;
    shareInLowWageJobs: number;
    shareWithGraduateDegree: number;
  };
  history: Array<{
    date: string;
    underemploymentRate: number;
  }>;
  wagePremium: number;
  rankAmongAllMajors: number;
};

export type DefinitionalOverlap = {
  involuntaryPartTime: number;
  skillsUnderemployment: number;
  hoursUnderemployment: number;
  overlapNotes: string;
};

export type TrajectorySeries = {
  ageGroup: string;
  observations: Array<{ date: string; rate: number }>;
};

export type MajorListItem = {
  id: number;
  name: string;
  category: string | null;
  isCommonOnline: boolean;
};

export type HeadlineTrendPoint = {
  date: string;
  recentGrads: number;
  allGrads: number;
};

export type UnderemploymentPageData = {
  headline: {
    recentGrads: number;
    allGrads: number;
    asOfDate: string;
  };
  headlineTrend: HeadlineTrendPoint[];
  majorRanking: MajorProfile[];
  allMajors: MajorListItem[];
  wagePremiumScatter: Array<{
    majorName: string;
    underemploymentRate: number;
    wagePremium: number;
    category: string;
  }>;
  trajectory: TrajectorySeries[];
  definitionalOverlap: DefinitionalOverlap;
  commonOnlineMajors: MajorProfile[];
  relatedInsights: Array<{ title: string; sourceName: string; sourceUrl: string }>;
};
