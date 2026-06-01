import type { InsightSource, InsightSourceId } from "@/lib/insights/types";

export const INSIGHT_SOURCES: InsightSource[] = [
  {
    id: "bls_employment_situation",
    name: "BLS Employment Situation",
    category: "official_data",
    url: "https://www.bls.gov/news.release/empsit.htm",
    fetchUrl: "https://www.bls.gov/news.release/empsit.htm",
    tags: ["payrolls", "unemployment", "participation", "wages"],
    cadence: "Monthly",
    access: "public_html",
    description: "Monthly official release covering payroll employment, unemployment, labor force participation, and wages."
  },
  {
    id: "bls_jolts",
    name: "BLS JOLTS",
    category: "official_data",
    url: "https://www.bls.gov/news.release/jolts.htm",
    fetchUrl: "https://www.bls.gov/news.release/jolts.htm",
    tags: ["openings", "quits", "layoffs", "hiring"],
    cadence: "Monthly",
    access: "public_html",
    description: "Monthly official release covering job openings, hires, quits, layoffs, and separations."
  },
  {
    id: "beige_book",
    name: "Federal Reserve Beige Book",
    category: "central_bank",
    url: "https://www.federalreserve.gov/monetarypolicy/publications/beige-book-default.htm",
    fetchUrl: "https://www.federalreserve.gov/monetarypolicy/publications/beige-book-default.htm",
    tags: ["regional", "wages", "labor_demand", "business_conditions"],
    cadence: "Eight times per year",
    access: "public_html",
    description: "Federal Reserve district reports summarizing qualitative economic and labor market conditions."
  },
  {
    id: "indeed_hiring_lab",
    name: "Indeed Hiring Lab",
    category: "hiring_lab",
    url: "https://www.hiringlab.org/",
    fetchUrl: "https://www.hiringlab.org/",
    tags: ["job_postings", "hiring", "wages", "remote_work"],
    cadence: "Frequent public posts",
    access: "public_html",
    description: "Labor market analysis from Indeed researchers using job posting and hiring platform data."
  },
  {
    id: "brookings_hamilton_project",
    name: "Brookings Hamilton Project",
    category: "research",
    url: "https://www.brookings.edu/projects/the-hamilton-project/",
    fetchUrl: "https://www.brookings.edu/projects/the-hamilton-project/",
    tags: ["policy", "wages", "employment", "productivity"],
    cadence: "Ad hoc research publications",
    access: "public_html",
    description: "Policy research and analysis on labor market, productivity, and economic opportunity topics."
  },
  {
    id: "nber_labor_studies",
    name: "NBER Labor Studies",
    category: "research",
    url: "https://www.nber.org/programs-projects/programs-working-groups/labor-studies",
    fetchUrl: "https://www.nber.org/programs-projects/programs-working-groups/labor-studies",
    tags: ["research", "employment", "wages", "labor_supply"],
    cadence: "Ad hoc working papers",
    access: "public_html",
    description: "Academic working papers and research activity from the NBER Labor Studies program."
  },
  {
    id: "linkedin_manual",
    name: "LinkedIn manual",
    category: "manual",
    url: "https://economicgraph.linkedin.com/",
    tags: ["skills", "job_transitions", "hiring", "professional_networks"],
    cadence: "Manual review",
    access: "manual",
    description: "Manual placeholder for public LinkedIn Economic Graph and workforce reports pending an approved feed."
  }
];

export function getInsightSource(id: InsightSourceId) {
  return INSIGHT_SOURCES.find((source) => source.id === id) ?? null;
}
