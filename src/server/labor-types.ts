export type IndicatorCategory = "lagging" | "leading" | "tech_impact";

export type IndicatorFrequency = "weekly" | "monthly" | "quarterly" | "ad_hoc";

export type IndicatorSource = "FRED" | "Anthropic Economic Index";

export type RefreshStatus = "success" | "partial" | "failed";

export type IndicatorMetadata = {
  id: string;
  title: string;
  shortTitle: string;
  plainLanguage: string;
  whyItMatters: string;
  interpretation: string;
  sourceLabel: string;
  sourceDetail: string;
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
  plainLanguage: string;
  whyItMatters: string;
  interpretation: string;
  sourceLabel: string;
  sourceDetail: string;
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
  composites?: Array<{
    id: string;
    name: string;
    description: string;
    currentValue: number;
    asOfDate: string;
    interpretation: { label: string; color: "green" | "yellow" | "orange" | "red" | "gray" };
    methodologyNote: string;
    history: Array<{ compositeId: string; geography: string; date: string; value: number }>;
  }>;
};

export type IndicatorDetailResponse = {
  series: IndicatorSeries;
  observations: ObservationPoint[];
  refreshedAt: string | null;
  context?: import("@/types/v15").HistoricalContext | null;
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

export type SegmentDimension = import("@/types/labor-pulse").SegmentDimension;

export type ExportObservationSeries = {
  id: string;
  title: string;
  source: IndicatorSource | "Labor Pulse composite";
  sourceUrl: string | null;
  units: string;
  frequency: IndicatorFrequency | "derived";
  geography: string;
  observations: ObservationPoint[];
  caveat: string | null;
};

export type ExportSegmentSeries = import("@/types/labor-pulse").SegmentMetadata & {
  observations: ObservationPoint[];
};

export type ReportExportResponse = {
  generatedAt: string;
  requested: {
    seriesIds: string[];
    compositeIds: string[];
    breakdowns: SegmentDimension[];
    states: string[];
  };
  indicators: ExportObservationSeries[];
  composites: Array<{
    id: string;
    name: string;
    source: "Labor Pulse composite";
    units: "Index";
    observations: Array<{ compositeId: string; geography: string; date: string; value: number }>;
    methodologyNote: string;
  }>;
  breakdowns: Array<{
    baseSeriesId: string;
    segments: ExportSegmentSeries[];
  }>;
  unavailable: Array<{
    id: string;
    kind: "indicator" | "composite" | "segment";
    reason: string;
  }>;
};
