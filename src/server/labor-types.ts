export type IndicatorCategory = "lagging" | "leading" | "tech_impact";

export type IndicatorFrequency = "weekly" | "monthly" | "quarterly" | "ad_hoc";

export type IndicatorSource = "FRED" | "Anthropic Economic Index";

export type RefreshStatus = "success" | "partial" | "failed";

export type IndicatorMetadata = {
  id: string;
  title: string;
  shortTitle: string;
  category: IndicatorCategory;
  source: IndicatorSource;
  sourceUrl: string;
  units: string;
  unitLabel: string;
  frequency: IndicatorFrequency;
  seasonalAdjustment: string | null;
  isProxy: boolean;
  methodologyNote: string | null;
  stateSeriesPattern: string | null;
};

export type ObservationPoint = {
  seriesId: string;
  geography: string;
  date: string;
  value: number | null;
};

export type IndicatorSeries = IndicatorMetadata & {
  lastRefreshedAt: string | null;
};

export type DeltaViewModel = {
  value: number | null;
  formatted: string;
  periodLabel: string;
  arrowDirection: "up" | "down" | "flat" | "none";
  tone: "up" | "down" | "info" | "muted";
};

export type IndicatorCardViewModel = {
  id: string;
  title: string;
  category: IndicatorCategory;
  source: IndicatorSource;
  sourceUrl: string;
  frequency: IndicatorFrequency;
  unitLabel: string;
  currentValue: number | null;
  currentValueFormatted: string;
  currentDate: string | null;
  delta: DeltaViewModel;
  sparkline: Array<{ date: string; value: number | null }>;
  lastUpdated: string | null;
  isProxy: boolean;
  methodologyNote?: string;
  isStale: boolean;
};

export type DashboardCategoryViewModel = {
  id: IndicatorCategory;
  label: string;
  blurb: string;
  indicators: IndicatorCardViewModel[];
};

export type LaborDashboardData = {
  categories: DashboardCategoryViewModel[];
  refreshedAt: string | null;
};

export type IndicatorDetailResponse = {
  series: IndicatorSeries;
  observations: ObservationPoint[];
  refreshedAt: string | null;
};

export type DefinitionResponse = {
  seriesId: string;
  content: string;
  generatedAt: string | null;
  model: string | null;
  cached: boolean;
};

export type RefreshAttemptSummary = {
  seriesId: string;
  status: RefreshStatus;
  observationsFetched: number;
  observationsUpserted: number;
  message: string | null;
};

export type FredRefreshSummary = {
  source: "FRED";
  status: RefreshStatus;
  startedAt: string;
  completedAt: string;
  attempts: RefreshAttemptSummary[];
};

export type SourceSummary = {
  source: string;
  indicators: string[];
  lastRefresh: string | null;
  refreshCadence: string;
  sourceUrl: string;
};

export type RefreshLogViewModel = {
  id: number;
  source: string;
  seriesId: string | null;
  status: RefreshStatus;
  message: string | null;
  startedAt: string;
  completedAt: string | null;
};

export type SourcesPageData = {
  sources: SourceSummary[];
  refreshLog: RefreshLogViewModel[];
};
