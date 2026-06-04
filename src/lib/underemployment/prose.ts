export const underemploymentSections = [
  { id: "introduction", label: "Introduction" },
  { id: "definitions", label: "Three definitions" },
  { id: "relationship", label: "How they relate" },
  { id: "headline-data", label: "Headline data" },
  { id: "by-major", label: "By major" },
  { id: "wage-premium", label: "Wage premium" },
  { id: "trajectory", label: "Trajectory" },
  { id: "major-lookup", label: "Major lookup" },
  { id: "online-programs", label: "Online programs" },
  { id: "methodology", label: "Methodology" },
  { id: "limitations", label: "What this misses" }
] as const;

export const definitionBlocks = [
  {
    name: "Involuntary part-time work",
    source: "BLS Current Population Survey",
    body:
      "Workers who hold part-time jobs and want full-time hours. This is the cleanest definition because it relies on a worker's stated preference rather than an analyst's judgment about whether a job matches the worker's skills. The Bureau of Labor Statistics tracks it monthly through the Current Population Survey and includes it as a component of the U-6 measure."
  },
  {
    name: "Skills underemployment",
    source: "New York Fed Recent College Graduates",
    body:
      "Workers in jobs that do not use their education or skills. This is what most policy analysts mean by underemployment, and it is the most relevant to higher education planning. There is no official measure. The Federal Reserve Bank of New York publishes the most widely cited research version, defining a college job as one where at least 50 percent of workers hold a bachelor's degree."
  },
  {
    name: "Hours underemployment",
    source: "BLS Current Employment Statistics",
    body:
      "Workers who want more hours than they currently receive, regardless of full-time or part-time status. This overlaps heavily with involuntary part-time work but extends to full-time workers whose hours have been cut. The BLS Current Employment Statistics program publishes average weekly hours by industry, which serves as the standard data foundation."
  }
] as const;
