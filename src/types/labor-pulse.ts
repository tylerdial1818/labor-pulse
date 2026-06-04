export const LABOR_PULSE_GEOGRAPHY_DEFAULT = "US" as const;

export type LaborPulseGeography = typeof LABOR_PULSE_GEOGRAPHY_DEFAULT | string;

export type IndicatorCategory = "lagging" | "leading" | "tech_impact";

export type IndicatorFrequency = "weekly" | "monthly" | "quarterly" | "ad_hoc";

export type IndicatorSource = "FRED" | "Anthropic Economic Index";

export type IndicatorValueFormat = "percent" | "count" | "currency" | "hours" | "index" | "numeric";

export type DateString = `${number}-${number}-${number}`;

export type SegmentDimension = "industry" | "gender" | "state" | "age";

export type SegmentAvailabilityStatus = "available" | "unavailable";

export type SegmentMetadata = {
  dimension: SegmentDimension;
  id: string;
  label: string;
  seriesId: string | null;
  geography?: LaborPulseGeography;
  source: IndicatorSource | "FRED-compatible metadata";
  sourceUrl: string | null;
  units: string | null;
  status: SegmentAvailabilityStatus;
  unavailableReason?: "unsupported_combination" | "not_ingested" | "source_not_confirmed";
  caveat: string;
};

export type IndicatorDisplayConfig = {
  valueFormat: IndicatorValueFormat;
  decimals: number;
  multiplier?: number;
  unitLabel: string;
  deltaUnitLabel: string;
};

export type IndicatorDefinition = {
  id: string;
  title: string;
  shortTitle: string;
  category: IndicatorCategory;
  source: IndicatorSource;
  sourceUrl: string;
  units: string;
  frequency: IndicatorFrequency;
  seasonalAdjustment?: string | null;
  isProxy: boolean;
  methodologyNote: string | null;
  stateSeriesPattern?: string | null;
  segments?: Partial<Record<SegmentDimension, SegmentMetadata[]>>;
  display: IndicatorDisplayConfig;
};

export type Observation = {
  seriesId: string;
  geography: LaborPulseGeography;
  date: DateString;
  value: number | null;
};

export type CurrentObservation = {
  seriesId: string;
  geography: LaborPulseGeography;
  date: DateString;
  value: number;
};

export type MetricAvailability = "available" | "unavailable";

export type DeltaMetric =
  | {
      status: "available";
      value: number;
      percentChange: number | null;
      currentDate: DateString;
      comparisonDate: DateString;
      comparisonValue: number;
    }
  | {
      status: "unavailable";
      reason: "no_current_value" | "unsupported_frequency" | "missing_comparison_observation";
      currentDate?: DateString;
      comparisonDate?: DateString;
    };

export type SparklinePoint = {
  date: DateString;
  value: number | null;
};

export type IndicatorMetricSummary = {
  indicator: IndicatorDefinition;
  geography: LaborPulseGeography;
  current: CurrentObservation | null;
  delta: DeltaMetric;
  sparkline: SparklinePoint[];
  lastUpdatedAt: DateString | null;
};

export type FormattedMetricValue =
  | {
      status: "available";
      text: string;
    }
  | {
      status: "unavailable";
      text: "not available";
    };
