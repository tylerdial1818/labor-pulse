import { US_STATE_OPTIONS, getStateByAbbreviation } from "@/lib/geo/states";

export type BreakdownDimension = "industry" | "gender" | "state" | "age";

export type SegmentDefinition = {
  dimension: BreakdownDimension;
  baseSeriesId?: string;
  segmentLabel: string;
  metricLabel: string;
  seriesId: string;
  units: string;
  frequency: "weekly" | "monthly";
  seasonalAdjustment?: string;
  sourceLabel: string;
  sourceUrl: string;
  caveat: string;
};

const fredSeriesUrl = (seriesId: string) => `https://fred.stlouisfed.org/series/${seriesId}`;

function fredSegment(input: Omit<SegmentDefinition, "sourceLabel" | "sourceUrl" | "frequency"> & { frequency?: SegmentDefinition["frequency"] }): SegmentDefinition {
  return {
    ...input,
    frequency: input.frequency ?? "monthly",
    sourceLabel: "FRED",
    sourceUrl: fredSeriesUrl(input.seriesId)
  };
}

export const industrySegments = [
  fredSegment({
    dimension: "industry",
    segmentLabel: "Goods-producing",
    metricLabel: "Payroll employment",
    seriesId: "USGOOD",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Mining and logging",
    metricLabel: "Payroll employment",
    seriesId: "USMINE",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Construction",
    metricLabel: "Payroll employment",
    seriesId: "USCONS",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Manufacturing",
    metricLabel: "Payroll employment",
    seriesId: "MANEMP",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Trade, transportation, and utilities",
    metricLabel: "Payroll employment",
    seriesId: "USTRADE",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Information",
    metricLabel: "Payroll employment",
    seriesId: "USINFO",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Financial activities",
    metricLabel: "Payroll employment",
    seriesId: "USFIRE",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Professional and business services",
    metricLabel: "Payroll employment",
    seriesId: "USPBS",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Education and health services",
    metricLabel: "Payroll employment",
    seriesId: "USEHS",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Leisure and hospitality",
    metricLabel: "Payroll employment",
    seriesId: "USLAH",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Government",
    metricLabel: "Payroll employment",
    seriesId: "USGOVT",
    units: "Thousands of persons",
    caveat: "Industry payroll series count jobs, not unique workers."
  })
] as const satisfies readonly SegmentDefinition[];

const payrollIndustrySegments = industrySegments;

const earningsIndustrySegments = [
  fredSegment({
    dimension: "industry",
    segmentLabel: "Goods-producing",
    metricLabel: "Average hourly earnings",
    seriesId: "CES0600000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Mining and logging",
    metricLabel: "Average hourly earnings",
    seriesId: "CES1000000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Construction",
    metricLabel: "Average hourly earnings",
    seriesId: "CES2000000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Manufacturing",
    metricLabel: "Average hourly earnings",
    seriesId: "CES3000000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Trade, transportation, and utilities",
    metricLabel: "Average hourly earnings",
    seriesId: "CES4000000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Information",
    metricLabel: "Average hourly earnings",
    seriesId: "CES5000000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Financial activities",
    metricLabel: "Average hourly earnings",
    seriesId: "CES5500000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Professional and business services",
    metricLabel: "Average hourly earnings",
    seriesId: "CES6000000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Education and health services",
    metricLabel: "Average hourly earnings",
    seriesId: "CES6500000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Leisure and hospitality",
    metricLabel: "Average hourly earnings",
    seriesId: "CES7000000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  }),
  fredSegment({
    dimension: "industry",
    segmentLabel: "Other services",
    metricLabel: "Average hourly earnings",
    seriesId: "CES8000000003",
    units: "Dollars per hour",
    caveat: "Industry earnings compare average hourly pay for all employees in each sector."
  })
] as const satisfies readonly SegmentDefinition[];

const jobOpeningsIndustrySegments = [
  ["Construction", "JTS2300JOL"],
  ["Manufacturing", "JTS3000JOL"],
  ["Trade, transportation, and utilities", "JTS4000JOL"],
  ["Education and health services", "JTS6000JOL"],
  ["Leisure and hospitality", "JTS7000JOL"],
  ["Government", "JTS9000JOL"]
].map(([segmentLabel, seriesId]) =>
  fredSegment({
    dimension: "industry",
    segmentLabel,
    metricLabel: "Job openings",
    seriesId,
    units: "Thousands",
    caveat: "JOLTS industry openings compare published sector series where FRED exposes seasonally adjusted data."
  })
) satisfies SegmentDefinition[];

const quitsIndustrySegments = [
  ["Construction", "JTS2300QUR"],
  ["Manufacturing", "JTS3000QUR"],
  ["Trade, transportation, and utilities", "JTS4000QUR"],
  ["Education and health services", "JTS6000QUR"],
  ["Leisure and hospitality", "JTS7000QUR"],
  ["Government", "JTS9000QUR"]
].map(([segmentLabel, seriesId]) =>
  fredSegment({
    dimension: "industry",
    segmentLabel,
    metricLabel: "Quits rate",
    seriesId,
    units: "Percent",
    caveat: "JOLTS industry quits compare published sector rates where FRED exposes seasonally adjusted data."
  })
) satisfies SegmentDefinition[];

const layoffsIndustrySegments = [
  ["Construction", "JTU2300LDR"],
  ["Manufacturing", "JTU3000LDR"],
  ["Government", "JTS9000LDR"]
].map(([segmentLabel, seriesId]) =>
  fredSegment({
    dimension: "industry",
    segmentLabel,
    metricLabel: "Layoffs and discharges rate",
    seriesId,
    units: "Percent",
    seasonalAdjustment: seriesId.startsWith("JTU") ? "Not seasonally adjusted" : "Seasonally adjusted",
    caveat: "Some JOLTS industry layoff rates are not seasonally adjusted, so month-to-month movement can be noisier than the headline rate."
  })
) satisfies SegmentDefinition[];

const weeklyHoursIndustrySegments = [
  ["Manufacturing", "AWHAEMAN"],
  ["Information", "AWHAEINFO"],
  ["Professional and business services", "AWHAEPBS"],
  ["Education and health services", "AWHAEEHS"],
  ["Leisure and hospitality", "AWHAELAH"]
].map(([segmentLabel, seriesId]) =>
  fredSegment({
    dimension: "industry",
    segmentLabel,
    metricLabel: "Average weekly hours",
    seriesId,
    units: "Hours",
    caveat: "Industry weekly-hours series compare average hours for all employees where FRED exposes seasonally adjusted sector data."
  })
) satisfies SegmentDefinition[];

export const genderSegments = [
  fredSegment({
    dimension: "gender",
    baseSeriesId: "UNRATE",
    segmentLabel: "Men",
    metricLabel: "Unemployment rate",
    seriesId: "LNS14000001",
    units: "Percent",
    caveat: "Gender series use the source categories published by BLS through FRED."
  }),
  fredSegment({
    dimension: "gender",
    baseSeriesId: "UNRATE",
    segmentLabel: "Women",
    metricLabel: "Unemployment rate",
    seriesId: "LNS14000002",
    units: "Percent",
    caveat: "Gender series use the source categories published by BLS through FRED."
  }),
  fredSegment({
    dimension: "gender",
    baseSeriesId: "CIVPART",
    segmentLabel: "Men",
    metricLabel: "Labor force participation rate",
    seriesId: "LNS11300001",
    units: "Percent",
    caveat: "Gender series use the source categories published by BLS through FRED."
  }),
  fredSegment({
    dimension: "gender",
    baseSeriesId: "CIVPART",
    segmentLabel: "Women",
    metricLabel: "Labor force participation rate",
    seriesId: "LNS11300002",
    units: "Percent",
    caveat: "Gender series use the source categories published by BLS through FRED."
  }),
  fredSegment({
    dimension: "gender",
    baseSeriesId: "EMRATIO",
    segmentLabel: "Men",
    metricLabel: "Employment-population ratio",
    seriesId: "LNS12300001",
    units: "Percent",
    caveat: "Gender series use the source categories published by BLS through FRED."
  }),
  fredSegment({
    dimension: "gender",
    baseSeriesId: "EMRATIO",
    segmentLabel: "Women",
    metricLabel: "Employment-population ratio",
    seriesId: "LNS12300002",
    units: "Percent",
    caveat: "Gender series use the source categories published by BLS through FRED."
  })
] as const satisfies readonly SegmentDefinition[];

const ageCaveat =
  "Age series use BLS age groups published through FRED. Compare them as labor-market signals for broad age bands, not as a complete life-stage profile.";

const unemploymentAgeSegments = [
  ["16-19", "LNS14000012"],
  ["20-24", "LNS14000036"],
  ["25-54", "LNS14000060"],
  ["55 and over", "LNS14024230"]
].map(([segmentLabel, seriesId]) =>
  fredSegment({
    dimension: "age",
    baseSeriesId: "UNRATE",
    segmentLabel,
    metricLabel: "Unemployment rate",
    seriesId,
    units: "Percent",
    caveat: ageCaveat
  })
) satisfies SegmentDefinition[];

const participationAgeSegments = [
  ["16-19", "LNS11300012"],
  ["20-24", "LNS11300036"],
  ["25-54", "LNS11300060"],
  ["55 and over", "LNS11324230"]
].map(([segmentLabel, seriesId]) =>
  fredSegment({
    dimension: "age",
    baseSeriesId: "CIVPART",
    segmentLabel,
    metricLabel: "Labor force participation rate",
    seriesId,
    units: "Percent",
    caveat: ageCaveat
  })
) satisfies SegmentDefinition[];

const employmentPopulationAgeSegments = [
  ["16-19", "LNS12300012"],
  ["25-54", "LNS12300060"]
].map(([segmentLabel, seriesId]) =>
  fredSegment({
    dimension: "age",
    baseSeriesId: "EMRATIO",
    segmentLabel,
    metricLabel: "Employment-population ratio",
    seriesId,
    units: "Percent",
    caveat: "Age coverage for this metric is partial in FRED. Labor Pulse shows only the verified age bands and leaves other bands out."
  })
) satisfies SegmentDefinition[];

export function stateSegmentsFor(stateAbbreviation: string): SegmentDefinition[] {
  const state = getStateByAbbreviation(stateAbbreviation) ?? getStateByAbbreviation("CA") ?? US_STATE_OPTIONS[0];

  return [
    fredSegment({
      dimension: "state",
      baseSeriesId: "UNRATE",
      segmentLabel: "United States",
      metricLabel: "Unemployment rate",
      seriesId: "UNRATE",
      units: "Percent",
      caveat: "State comparisons use unemployment rates only in v1.6."
    }),
    fredSegment({
      dimension: "state",
      baseSeriesId: "UNRATE",
      segmentLabel: state.name,
      metricLabel: "Unemployment rate",
      seriesId: `${state.abbreviation}UR`,
      units: "Percent",
      caveat: "State comparisons use unemployment rates only in v1.6."
    })
  ];
}

function stateSeriesForMetric(seriesId: string): SegmentDefinition[] {
  if (seriesId === "UNRATE") {
    return US_STATE_OPTIONS.map((state) =>
      fredSegment({
        dimension: "state",
        baseSeriesId: seriesId,
        segmentLabel: state.name,
        metricLabel: "Unemployment rate",
        seriesId: `${state.abbreviation}UR`,
        units: "Percent",
        caveat: "State unemployment rates are published by BLS through FRED and are seasonally adjusted."
      })
    );
  }

  if (seriesId === "PAYEMS") {
    return US_STATE_OPTIONS.map((state) =>
      fredSegment({
        dimension: "state",
        baseSeriesId: seriesId,
        segmentLabel: state.name,
        metricLabel: "Nonfarm payroll employment",
        seriesId: `${state.abbreviation}NA`,
        units: "Thousands of persons",
        caveat: "State payroll series count jobs, not unique workers."
      })
    );
  }

  if (seriesId === "CIVPART") {
    return US_STATE_OPTIONS.map((state) =>
      fredSegment({
        dimension: "state",
        baseSeriesId: seriesId,
        segmentLabel: state.name,
        metricLabel: "Labor force participation rate",
        seriesId: `LBSSA${state.fips}`,
        units: "Percent",
        caveat: "State participation rates are published by BLS through FRED and are seasonally adjusted."
      })
    );
  }

  if (seriesId === "ICSA") {
    return US_STATE_OPTIONS.map((state) =>
      fredSegment({
        dimension: "state",
        baseSeriesId: seriesId,
        segmentLabel: state.name,
        metricLabel: "Initial claims",
        seriesId: `${state.abbreviation}ICLAIMS`,
        units: "Number",
        frequency: "weekly",
        seasonalAdjustment: "Not seasonally adjusted",
        caveat: "State initial claims are not seasonally adjusted, so weekly movement can reflect recurring calendar effects."
      })
    );
  }

  return [];
}

export function getSegmentsForDimension(dimension: BreakdownDimension, stateAbbreviation = "CA"): SegmentDefinition[] {
  if (dimension === "age") return [...unemploymentAgeSegments, ...participationAgeSegments, ...employmentPopulationAgeSegments];
  if (dimension === "gender") return [...genderSegments];
  if (dimension === "state") return stateSegmentsFor(stateAbbreviation);
  return [...industrySegments];
}

export function getSupportedBreakdownDimensionsForMetric(seriesId: string): BreakdownDimension[] {
  if (seriesId === "UNRATE") return ["gender", "age", "state"];
  if (seriesId === "PAYEMS") return ["industry", "state"];
  if (seriesId === "CIVPART") return ["gender", "age", "state"];
  if (seriesId === "EMRATIO") return ["gender", "age"];
  if (seriesId === "CES0500000003" || seriesId === "JTSJOL" || seriesId === "JTSQUR" || seriesId === "JTSLDR" || seriesId === "AWHAETP") return ["industry"];
  if (seriesId === "ICSA") return ["state"];
  return [];
}

function industrySegmentsForMetric(seriesId: string): SegmentDefinition[] {
  if (seriesId === "PAYEMS") return [...payrollIndustrySegments];
  if (seriesId === "CES0500000003") return [...earningsIndustrySegments];
  if (seriesId === "JTSJOL") return [...jobOpeningsIndustrySegments];
  if (seriesId === "JTSQUR") return [...quitsIndustrySegments];
  if (seriesId === "JTSLDR") return [...layoffsIndustrySegments];
  if (seriesId === "AWHAETP") return [...weeklyHoursIndustrySegments];
  return [];
}

export function getSegmentsForMetric(seriesId: string, dimension: BreakdownDimension, stateAbbreviation = "CA"): SegmentDefinition[] {
  const supported = getSupportedBreakdownDimensionsForMetric(seriesId);
  if (!supported.includes(dimension)) return [];

  if (dimension === "industry") {
    return industrySegmentsForMetric(seriesId).map((segment) => ({ ...segment, baseSeriesId: seriesId }));
  }

  if (dimension === "gender") {
    return genderSegments.filter((segment) => segment.baseSeriesId === seriesId);
  }

  if (dimension === "age") {
    if (seriesId === "UNRATE") return [...unemploymentAgeSegments];
    if (seriesId === "CIVPART") return [...participationAgeSegments];
    if (seriesId === "EMRATIO") return [...employmentPopulationAgeSegments];
    return [];
  }

  if (seriesId === "UNRATE" && stateAbbreviation) {
    return stateSeriesForMetric(seriesId);
  }

  return stateSeriesForMetric(seriesId);
}

export function getAllMetricSegmentDefinitions(): SegmentDefinition[] {
  const seen = new Map<string, SegmentDefinition>();

  for (const seriesId of ["UNRATE", "PAYEMS", "CIVPART", "EMRATIO", "CES0500000003", "ICSA", "JTSJOL", "JTSQUR", "JTSLDR", "AWHAETP"]) {
    for (const dimension of getSupportedBreakdownDimensionsForMetric(seriesId)) {
      for (const segment of getSegmentsForMetric(seriesId, dimension)) {
        seen.set(segment.seriesId, segment);
      }
    }
  }

  return [...seen.values()];
}
