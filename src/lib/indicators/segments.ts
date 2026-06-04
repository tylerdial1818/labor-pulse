import type { IndicatorDefinition, LaborPulseGeography, SegmentDimension, SegmentMetadata } from "@/types/labor-pulse";

const fredSeriesUrl = (seriesId: string) => `https://fred.stlouisfed.org/series/${seriesId}`;

const stateCodes = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VT",
  "WA",
  "WI",
  "WV",
  "WY"
] as const;

type SegmentRequest = {
  dimensions?: SegmentDimension[];
  states?: string[];
};

const genderSeries: Record<string, Array<{ id: string; label: string; seriesId: string }>> = {
  UNRATE: [
    { id: "men", label: "Men", seriesId: "LNS14000001" },
    { id: "women", label: "Women", seriesId: "LNS14000002" }
  ],
  CIVPART: [
    { id: "men", label: "Men", seriesId: "LNS11300001" },
    { id: "women", label: "Women", seriesId: "LNS11300002" }
  ],
  EMRATIO: [
    { id: "men", label: "Men", seriesId: "LNS12300001" },
    { id: "women", label: "Women", seriesId: "LNS12300002" }
  ]
};

const ageSeries: Record<string, Array<{ id: string; label: string; seriesId: string }>> = {
  UNRATE: [
    { id: "age_16_19", label: "16-19", seriesId: "LNS14000012" },
    { id: "age_20_24", label: "20-24", seriesId: "LNS14000036" },
    { id: "age_25_54", label: "25-54", seriesId: "LNS14000060" },
    { id: "age_55_over", label: "55 and over", seriesId: "LNS14024230" }
  ],
  CIVPART: [
    { id: "age_16_19", label: "16-19", seriesId: "LNS11300012" },
    { id: "age_20_24", label: "20-24", seriesId: "LNS11300036" },
    { id: "age_25_54", label: "25-54", seriesId: "LNS11300060" },
    { id: "age_55_over", label: "55 and over", seriesId: "LNS11324230" }
  ],
  EMRATIO: [
    { id: "age_16_19", label: "16-19", seriesId: "LNS12300012" },
    { id: "age_25_54", label: "25-54", seriesId: "LNS12300060" }
  ]
};

const industrySeries: Record<string, Array<{ id: string; label: string; seriesId: string }>> = {
  PAYEMS: [
    { id: "professional_business_services", label: "Professional and business services", seriesId: "USPBS" },
    { id: "information", label: "Information", seriesId: "USINFO" },
    { id: "temporary_help_services", label: "Temporary help services", seriesId: "TEMPHELPS" }
  ]
};

function unavailableSegment(dimension: SegmentDimension, indicator: IndicatorDefinition): SegmentMetadata {
  return {
    dimension,
    id: `${dimension}:unsupported`,
    label: `${dimension} breakdown unavailable`,
    seriesId: null,
    source: "FRED-compatible metadata",
    sourceUrl: null,
    units: indicator.units,
    status: "unavailable",
    unavailableReason: "unsupported_combination",
    caveat: `${indicator.shortTitle} does not have a confirmed Labor Pulse ${dimension} segment mapping.`
  };
}

function genderSegments(indicator: IndicatorDefinition): SegmentMetadata[] {
  const rows = genderSeries[indicator.id];
  if (!rows) return [unavailableSegment("gender", indicator)];

  return rows.map((row) => ({
    dimension: "gender",
    id: row.id,
    label: row.label,
    seriesId: row.seriesId,
    source: "FRED-compatible metadata",
    sourceUrl: fredSeriesUrl(row.seriesId),
    units: indicator.units,
    status: "unavailable",
    unavailableReason: "not_ingested",
    caveat: "FRED-compatible gender series is identified, but Labor Pulse only marks it available after observations are stored."
  }));
}

function ageSegments(indicator: IndicatorDefinition): SegmentMetadata[] {
  const rows = ageSeries[indicator.id];
  if (!rows) return [unavailableSegment("age", indicator)];

  return rows.map((row) => ({
    dimension: "age",
    id: row.id,
    label: row.label,
    seriesId: row.seriesId,
    source: "FRED-compatible metadata",
    sourceUrl: fredSeriesUrl(row.seriesId),
    units: indicator.units,
    status: "unavailable",
    unavailableReason: "not_ingested",
    caveat: "FRED-compatible age series is identified, but Labor Pulse only marks it available after observations are stored."
  }));
}

function industrySegments(indicator: IndicatorDefinition): SegmentMetadata[] {
  const rows = industrySeries[indicator.id];
  if (!rows) return [unavailableSegment("industry", indicator)];

  return rows.map((row) => ({
    dimension: "industry",
    id: row.id,
    label: row.label,
    seriesId: row.seriesId,
    geography: "US",
    source: "FRED",
    sourceUrl: fredSeriesUrl(row.seriesId),
    units: indicator.units,
    status: "available",
    caveat: "Industry breakdown uses an existing Labor Pulse FRED series and should be interpreted as a sector/subsector comparison, not a decomposition of total payrolls."
  }));
}

function normalizeStateCode(value: string) {
  return value.trim().toUpperCase();
}

function stateSegments(indicator: IndicatorDefinition, requestedStates?: string[]): SegmentMetadata[] {
  if (!indicator.stateSeriesPattern) return [unavailableSegment("state", indicator)];

  const selectedStates = requestedStates?.length
    ? requestedStates.map(normalizeStateCode).filter((state) => stateCodes.includes(state as (typeof stateCodes)[number]))
    : [...stateCodes];

  if (selectedStates.length === 0) {
    return [
      {
        ...unavailableSegment("state", indicator),
        unavailableReason: "source_not_confirmed",
        caveat: "Requested state codes did not match supported US state or DC abbreviations."
      }
    ];
  }

  return selectedStates.map((state) => {
    const seriesId = indicator.stateSeriesPattern?.replace("{state}", state) ?? null;
    return {
      dimension: "state",
      id: state,
      label: state,
      seriesId,
      geography: state as LaborPulseGeography,
      source: "FRED-compatible metadata",
      sourceUrl: seriesId ? fredSeriesUrl(seriesId) : null,
      units: indicator.units,
      status: "unavailable",
      unavailableReason: "not_ingested",
      caveat: "FRED-compatible state series is identified, but Labor Pulse only marks it available after observations are stored."
    };
  });
}

export function getIndicatorSegments(indicator: IndicatorDefinition, request: SegmentRequest = {}): SegmentMetadata[] {
  const dimensions = request.dimensions?.length ? request.dimensions : (["industry", "gender", "state", "age"] satisfies SegmentDimension[]);

  return dimensions.flatMap((dimension) => {
    if (dimension === "industry") return industrySegments(indicator);
    if (dimension === "gender") return genderSegments(indicator);
    if (dimension === "age") return ageSegments(indicator);
    return stateSegments(indicator, request.states);
  });
}

export function markSegmentAvailability(segment: SegmentMetadata, hasStoredObservations: boolean): SegmentMetadata {
  if (!segment.seriesId) return segment;
  if (segment.status === "available" && hasStoredObservations) return { ...segment, unavailableReason: undefined };

  return hasStoredObservations
    ? { ...segment, status: "available", unavailableReason: undefined }
    : { ...segment, status: "unavailable", unavailableReason: segment.unavailableReason ?? "not_ingested" };
}
