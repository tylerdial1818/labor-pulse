import type { IndicatorCategory, IndicatorDefinition } from "@/types/labor-pulse";

const fredSeriesUrl = (seriesId: string) => `https://fred.stlouisfed.org/series/${seriesId}`;

const techProxyMethodologyNote =
  "Proxy indicator for AI labor market exposure, not a direct measurement of AI adoption or displacement. Use as directional labor-market context only.";

const anthropicMethodologyNote =
  "Measures Claude usage in Anthropic Economic Index releases, not all AI tools or total labor-market automation. Release format and coverage can change between publications.";

export const indicatorCatalog = [
  {
    id: "UNRATE",
    title: "Unemployment Rate",
    shortTitle: "Unemployment Rate",
    category: "lagging",
    source: "FRED",
    sourceUrl: fredSeriesUrl("UNRATE"),
    units: "Percent",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    stateSeriesPattern: "{state}UR",
    display: { valueFormat: "percent", decimals: 1, unitLabel: "%", deltaUnitLabel: "pp" }
  },
  {
    id: "PAYEMS",
    title: "Nonfarm Payroll Employment",
    shortTitle: "Nonfarm Payrolls",
    category: "lagging",
    source: "FRED",
    sourceUrl: fredSeriesUrl("PAYEMS"),
    units: "Thousands of Persons",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "count", decimals: 1, multiplier: 1_000, unitLabel: "jobs", deltaUnitLabel: "jobs" }
  },
  {
    id: "CIVPART",
    title: "Labor Force Participation Rate",
    shortTitle: "Labor Force Participation",
    category: "lagging",
    source: "FRED",
    sourceUrl: fredSeriesUrl("CIVPART"),
    units: "Percent",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "percent", decimals: 1, unitLabel: "%", deltaUnitLabel: "pp" }
  },
  {
    id: "CES0500000003",
    title: "Average Hourly Earnings, Total Private",
    shortTitle: "Average Hourly Earnings",
    category: "lagging",
    source: "FRED",
    sourceUrl: fredSeriesUrl("CES0500000003"),
    units: "Dollars per Hour",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "currency", decimals: 2, unitLabel: "/hr", deltaUnitLabel: "$" }
  },
  {
    id: "EMRATIO",
    title: "Employment-Population Ratio",
    shortTitle: "Employment-Population Ratio",
    category: "lagging",
    source: "FRED",
    sourceUrl: fredSeriesUrl("EMRATIO"),
    units: "Percent",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "percent", decimals: 1, unitLabel: "%", deltaUnitLabel: "pp" }
  },
  {
    id: "U6RATE",
    title: "U-6 Total Underemployment Rate",
    shortTitle: "U-6 Underemployment",
    category: "lagging",
    source: "FRED",
    sourceUrl: fredSeriesUrl("U6RATE"),
    units: "Percent",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "percent", decimals: 1, unitLabel: "%", deltaUnitLabel: "pp" }
  },
  {
    id: "ICSA",
    title: "Initial Jobless Claims",
    shortTitle: "Initial Jobless Claims",
    category: "leading",
    source: "FRED",
    sourceUrl: fredSeriesUrl("ICSA"),
    units: "Number",
    frequency: "weekly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "count", decimals: 0, unitLabel: "claims", deltaUnitLabel: "claims" }
  },
  {
    id: "JTSJOL",
    title: "Job Openings (JOLTS)",
    shortTitle: "Job Openings",
    category: "leading",
    source: "FRED",
    sourceUrl: fredSeriesUrl("JTSJOL"),
    units: "Thousands",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "count", decimals: 1, multiplier: 1_000, unitLabel: "openings", deltaUnitLabel: "openings" }
  },
  {
    id: "JTSQUR",
    title: "Quits Rate",
    shortTitle: "Quits Rate",
    category: "leading",
    source: "FRED",
    sourceUrl: fredSeriesUrl("JTSQUR"),
    units: "Percent",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "percent", decimals: 1, unitLabel: "%", deltaUnitLabel: "pp" }
  },
  {
    id: "JTSLDR",
    title: "Layoffs and Discharges Rate",
    shortTitle: "Layoffs & Discharges",
    category: "leading",
    source: "FRED",
    sourceUrl: fredSeriesUrl("JTSLDR"),
    units: "Percent",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "percent", decimals: 1, unitLabel: "%", deltaUnitLabel: "pp" }
  },
  {
    id: "TEMPHELPS",
    title: "Temporary Help Services Employment",
    shortTitle: "Temporary Help Employment",
    category: "leading",
    source: "FRED",
    sourceUrl: fredSeriesUrl("TEMPHELPS"),
    units: "Thousands of Persons",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "count", decimals: 1, multiplier: 1_000, unitLabel: "jobs", deltaUnitLabel: "jobs" }
  },
  {
    id: "AWHAETP",
    title: "Average Weekly Hours, All Employees",
    shortTitle: "Average Weekly Hours",
    category: "leading",
    source: "FRED",
    sourceUrl: fredSeriesUrl("AWHAETP"),
    units: "Hours",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: false,
    methodologyNote: null,
    display: { valueFormat: "hours", decimals: 1, unitLabel: "hrs", deltaUnitLabel: "hrs" }
  },
  {
    id: "USPBS",
    title: "Professional and Business Services Employment",
    shortTitle: "Professional & Business Services",
    category: "tech_impact",
    source: "FRED",
    sourceUrl: fredSeriesUrl("USPBS"),
    units: "Thousands of Persons",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: true,
    methodologyNote: techProxyMethodologyNote,
    display: { valueFormat: "count", decimals: 1, multiplier: 1_000, unitLabel: "jobs", deltaUnitLabel: "jobs" }
  },
  {
    id: "USINFO",
    title: "Information Sector Employment",
    shortTitle: "Information Employment",
    category: "tech_impact",
    source: "FRED",
    sourceUrl: fredSeriesUrl("USINFO"),
    units: "Thousands of Persons",
    frequency: "monthly",
    seasonalAdjustment: "Seasonally Adjusted",
    isProxy: true,
    methodologyNote: techProxyMethodologyNote,
    display: { valueFormat: "count", decimals: 1, multiplier: 1_000, unitLabel: "jobs", deltaUnitLabel: "jobs" }
  },
  {
    id: "ANTHROPIC_ECONOMIC_INDEX",
    title: "Anthropic Economic Index",
    shortTitle: "Anthropic Economic Index",
    category: "tech_impact",
    source: "Anthropic Economic Index",
    sourceUrl: "https://www.anthropic.com/economic-index",
    units: "Usage share",
    frequency: "ad_hoc",
    seasonalAdjustment: null,
    isProxy: true,
    methodologyNote: anthropicMethodologyNote,
    display: { valueFormat: "percent", decimals: 1, unitLabel: "%", deltaUnitLabel: "pp" }
  }
] as const satisfies readonly IndicatorDefinition[];

export const indicatorCategories: IndicatorCategory[] = ["lagging", "leading", "tech_impact"];

export function getIndicatorById(seriesId: string): IndicatorDefinition | undefined {
  return indicatorCatalog.find((indicator) => indicator.id === seriesId);
}

export function getIndicatorsByCategory(category: IndicatorCategory): IndicatorDefinition[] {
  return indicatorCatalog.filter((indicator) => indicator.category === category);
}
