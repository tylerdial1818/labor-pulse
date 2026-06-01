export type InterpretationColor = "green" | "yellow" | "orange" | "red" | "gray";

export type CompositeThreshold = {
  label: string;
  range: [number | null, number | null];
  color: InterpretationColor;
};

export type CompositeDefinition = {
  id: "sahm_rule" | "labor_tightness" | "labor_stress";
  name: string;
  description: string;
  category: "recession_signal" | "tightness" | "stress";
  inputSeries: string[];
  methodologyNote: string;
  thresholdInterpretation: CompositeThreshold[];
};

export type CompositeObservation = {
  compositeId: CompositeDefinition["id"];
  geography: string;
  date: string;
  value: number;
};

export type CompositeReading = {
  id: string;
  name: string;
  currentValue: number;
  asOfDate: string;
  interpretation: { label: string; color: InterpretationColor };
  methodologyNote: string;
};

export type HistoricalContext = {
  seriesId: string;
  currentValue: number;
  percentileRank: number;
  yearsOfHistory: number;
  comparablePeriod: { date: string; value: number } | null;
  interpretation: string;
};

export type InsightCategory =
  | "employment_situation"
  | "jolts"
  | "beige_book"
  | "hiring_practices"
  | "skills_demand"
  | "ai_impact"
  | "research"
  | "other";

export type RawInsight = {
  sourceName: string;
  sourceUrl: string;
  title: string;
  publishedAt: string;
  rawContent: string;
};

export type InsightSummary = {
  id: number;
  sourceName: string;
  title: string;
  summary: string;
  category: InsightCategory;
  tags: string[];
  publishedAt: string;
  sourceUrl: string;
};

export type StoredInsight = InsightSummary & {
  rawContent?: string | null;
  ingestedAt: string;
  summaryModel?: string | null;
};

export type BriefingInput = {
  theme: string;
  seriesIds: string[];
  compositeIds: string[];
  insightIds: string[];
  geography: string;
};

export type StoredBriefing = {
  id: number;
  theme: string;
  selectedSeriesIds: string[];
  selectedCompositeIds: string[];
  selectedInsightIds: string[];
  geography: string;
  content: string;
  model: string;
  createdAt: string;
};

export type AiExposureScore = {
  occupationSocCode: string;
  occupationTitle: string;
  exposureScore: number;
  exposureCategory: "low" | "moderate" | "high";
};
