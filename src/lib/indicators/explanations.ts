export type IndicatorExplanation = {
  plainLanguage: string;
  whyItMatters: string;
  sourceLabel: string;
  sourceDetail: string;
  interpretation: string;
};

export const INDICATOR_EXPLANATIONS: Record<string, IndicatorExplanation> = {
  UNRATE: {
    plainLanguage: "The share of people in the labor force who are looking for work but do not have a job.",
    whyItMatters: "It is the most familiar snapshot of labor-market slack. Rising unemployment usually means it is getting harder for workers to find jobs.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics unemployment rate, republished by FRED.",
    interpretation: "Lower is generally stronger, but very low unemployment can also coincide with hiring pressure."
  },
  PAYEMS: {
    plainLanguage: "The number of jobs on nonfarm employer payrolls across the US economy.",
    whyItMatters: "It shows whether employers are adding or cutting jobs. This is one of the headline measures in the monthly jobs report.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics payroll employment series, republished by FRED.",
    interpretation: "Higher payroll employment usually signals job growth; declines are a warning sign."
  },
  CIVPART: {
    plainLanguage: "The share of people age 16 and older who are working or actively looking for work.",
    whyItMatters: "It helps explain whether changes in unemployment reflect jobs, worker participation, retirements, schooling, or people leaving the labor force.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics labor force participation rate, republished by FRED.",
    interpretation: "Higher participation usually means more people are attached to the labor market."
  },
  CES0500000003: {
    plainLanguage: "Average hourly pay for private-sector workers.",
    whyItMatters: "It is a simple read on wage growth and worker bargaining power, though it does not show how pay differs across occupations or income groups.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics average hourly earnings series, republished by FRED.",
    interpretation: "Rising wages can be good for workers; very rapid growth can also feed inflation concerns."
  },
  EMRATIO: {
    plainLanguage: "The share of the civilian population age 16 and older that is employed.",
    whyItMatters: "It shows how broadly employment is spread across the population, not just among people actively looking for work.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics employment-population ratio, republished by FRED.",
    interpretation: "Higher values generally mean more people are working."
  },
  U6RATE: {
    plainLanguage: "A broader unemployment measure that includes unemployed workers, discouraged workers, and people working part-time for economic reasons.",
    whyItMatters: "It captures underemployment that the headline unemployment rate can miss.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics U-6 underemployment rate, republished by FRED.",
    interpretation: "Lower is generally stronger; a gap with headline unemployment can signal hidden weakness."
  },
  ICSA: {
    plainLanguage: "The number of people filing new claims for unemployment insurance in a week.",
    whyItMatters: "It is one of the fastest official signals of layoffs and labor-market stress.",
    sourceLabel: "US Department of Labor via FRED",
    sourceDetail: "Initial unemployment insurance claims, republished by FRED.",
    interpretation: "Higher claims usually mean more layoffs; lower claims usually mean steadier employment."
  },
  JTSJOL: {
    plainLanguage: "The number of open jobs employers say they are trying to fill.",
    whyItMatters: "It measures labor demand from employers. Falling openings can mean companies are becoming more cautious.",
    sourceLabel: "BLS JOLTS via FRED",
    sourceDetail: "Bureau of Labor Statistics Job Openings and Labor Turnover Survey, republished by FRED.",
    interpretation: "Higher openings usually indicate stronger demand for workers."
  },
  JTSQUR: {
    plainLanguage: "The share of workers who voluntarily quit their jobs.",
    whyItMatters: "Workers tend to quit more when they feel confident they can find better work.",
    sourceLabel: "BLS JOLTS via FRED",
    sourceDetail: "Bureau of Labor Statistics quits rate from JOLTS, republished by FRED.",
    interpretation: "Higher quits can signal worker confidence; falling quits can signal caution."
  },
  JTSLDR: {
    plainLanguage: "The share of workers laid off or discharged by employers.",
    whyItMatters: "It helps separate a healthy slowdown from a labor market where employers are actively cutting staff.",
    sourceLabel: "BLS JOLTS via FRED",
    sourceDetail: "Bureau of Labor Statistics layoffs and discharges rate from JOLTS, republished by FRED.",
    interpretation: "Higher layoffs are generally a warning sign."
  },
  TEMPHELPS: {
    plainLanguage: "Employment in temporary help services.",
    whyItMatters: "Temporary staffing often turns before the broader labor market because employers can adjust it quickly.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics temporary help employment, republished by FRED.",
    interpretation: "Declines can be an early sign that employers are pulling back."
  },
  AWHAETP: {
    plainLanguage: "The average number of hours worked each week by private-sector employees.",
    whyItMatters: "Employers often reduce hours before they reduce headcount, so hours can show softening early.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics average weekly hours, republished by FRED.",
    interpretation: "Falling hours can signal weaker labor demand."
  },
  USPBS: {
    plainLanguage: "Employment in professional and business services, a large knowledge-work-heavy sector.",
    whyItMatters: "This sector is useful context for white-collar hiring and AI-exposed work, but it is not a direct AI adoption measure.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics sector employment, republished by FRED.",
    interpretation: "Use as directional context for exposed sectors, not as proof of AI displacement."
  },
  USINFO: {
    plainLanguage: "Employment in the information sector, including software, publishing, media, and related industries.",
    whyItMatters: "It provides context for a sector with high exposure to digital tools and AI-driven workflow changes.",
    sourceLabel: "BLS via FRED",
    sourceDetail: "Bureau of Labor Statistics sector employment, republished by FRED.",
    interpretation: "Use as a proxy context signal, not a direct measure of AI effects."
  },
  ANTHROPIC_ECONOMIC_INDEX: {
    plainLanguage: "A published signal about how Claude is used across work activities.",
    whyItMatters: "It gives direct context on one AI tool's workplace use, but it does not represent all AI tools or the entire labor market.",
    sourceLabel: "Anthropic",
    sourceDetail: "Anthropic Economic Index publication.",
    interpretation: "Use as a directional AI usage signal, not a measure of automation or job loss."
  }
};

export function getIndicatorExplanation(seriesId: string): IndicatorExplanation {
  return (
    INDICATOR_EXPLANATIONS[seriesId] ?? {
      plainLanguage: "A labor-market indicator tracked by Labor Pulse.",
      whyItMatters: "Use this number alongside source, date, trend, and methodology notes.",
      sourceLabel: "Source",
      sourceDetail: "See original source for methodology.",
      interpretation: "Interpret changes in context rather than from one number alone."
    }
  );
}
