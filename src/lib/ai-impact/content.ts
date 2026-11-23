// Editorial content for the AI Impact page.
//
// Every number here is quoted from the linked source (checked 2026-11-21).
// Live numbers come from FRED via signals.ts, never from this file. When a
// study is revised, update its entry and its `checked` date together.

/** `anchor` is the page section for the step; the topic hub links to the same anchors (src/lib/questions/topics.ts). */
export type ChainStep = { id: string; anchor: string; label: string; question: string };

/** The page's spine: each landmark paper makes a claim about one of these links. */
export const AI_CHAIN: ChainStep[] = [
  { id: "capability", anchor: "exposure", label: "What AI can do", question: "Which jobs could AI change?" },
  { id: "adoption", anchor: "usage", label: "Who uses it", question: "Who is using AI?" },
  { id: "tasks", anchor: "tasks", label: "Which tasks change", question: "Is AI replacing tasks or helping with them?" },
  { id: "jobs", anchor: "employment", label: "Jobs and wages", question: "Are jobs and wages changing?" },
  { id: "economy", anchor: "economy", label: "The economy", question: "Will AI make the economy more productive, and who gains?" }
];

/** Section anchors on /ai-impact, in page order. Topic hub questions link to these ids. */
export const AI_PAGE_SECTIONS = [
  { id: "employment", label: "Is AI changing jobs yet?" },
  { id: "exposure", label: "Which jobs are exposed?" },
  { id: "usage", label: "Who is using AI?" },
  { id: "tasks", label: "Replacing or helping?" },
  { id: "economy", label: "The bigger economy" },
  { id: "predictions", label: "What economists predict" },
  { id: "scorecard", label: "Predictions scorecard" },
  { id: "disagree", label: "Why studies disagree" },
  { id: "latest", label: "Latest research" },
  { id: "methods", label: "Methods and limits" }
];

export const SHORT_ANSWER = {
  reviewed: "2026-11-21",
  sentences: [
    "So far, AI has not caused broad job losses in the United States.",
    "The clearest early sign is slower hiring of young workers in the jobs most exposed to AI, which several 2026 studies find and others dispute.",
    "Use of AI at work is spreading quickly, but the large productivity and wage effects economists predict have not shown up in the data yet."
  ]
};

export type EvidenceStudy = {
  id: string;
  title: string;
  authors: string;
  publisher: string;
  /** YYYY-MM-DD, or YYYY-MM when the source gives no day. */
  date: string;
  url: string;
  dataSource: string;
  dataPublic: boolean;
  finding: string;
  checked: string;
};

/** Studies that find an early-career hiring slowdown in AI-exposed jobs. */
export const EVIDENCE_SLOWDOWN: EvidenceStudy[] = [
  {
    id: "canaries",
    title: "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence",
    authors: "Brynjolfsson, Chandar and Chen",
    publisher: "Stanford Digital Economy Lab",
    date: "2026-08-12",
    url: "https://digitaleconomy.stanford.edu/news/canariesaug26/",
    dataSource: "ADP payroll records",
    dataPublic: false,
    finding:
      "Workers aged 22 to 25 in highly exposed occupations are about 19% below where they would be had they kept pace with peers in less-exposed jobs. The gap comes mostly from fewer hires, and the authors call the pattern descriptive, not causal.",
    checked: "2026-11-21"
  },
  {
    id: "seniority-biased",
    title: "Generative AI as Seniority-Biased Technological Change",
    authors: "Hosseini and Lichtinger",
    publisher: "Harvard University working paper",
    date: "2026-05-06",
    url: "https://raw.githack.com/s-mahdihosseini/Website/b99fa2962dcc4c165bbc3c41dd283afa99c5ccfb/GenAI_SenBTC_May_2026.pdf",
    dataSource: "Revelio Labs résumés and job postings",
    dataPublic: false,
    finding:
      "At firms that adopted generative AI, junior employment fell by about 9 percent after six quarters relative to non-adopters, while senior employment did not break trend. The decline came mainly from reduced hiring.",
    checked: "2026-11-21"
  },
  {
    id: "dallas-young",
    title: "Young workers' employment drops in occupations with high AI exposure",
    authors: "Atkinson and Yamco",
    publisher: "Federal Reserve Bank of Dallas",
    date: "2026-01-06",
    url: "https://www.dallasfed.org/research/economics/2026/0106",
    dataSource: "Current Population Survey",
    dataPublic: true,
    finding:
      "Young workers (20 to 24) in the most exposed jobs fell from 16.4 percent to 15.5 percent of employment between November 2022 and September 2025, mainly because fewer young people entered those jobs.",
    checked: "2026-11-21"
  },
  {
    id: "cleveland-job-finding",
    title: "Job Finding and Unemployment in the Age of AI",
    authors: "Kaymak and Cline",
    publisher: "Federal Reserve Bank of Cleveland",
    date: "2026-11-09",
    url: "https://www.clevelandfed.org/publications/economic-commentary/2026/ec-202626-job-finding-and-unemployment-in-the-age-of-ai",
    dataSource: "Current Population Survey",
    dataPublic: true,
    finding:
      "Unemployment for workers aged 23 to 54 has risen by roughly 1 percentage point more in the most AI-exposed occupations than in the least exposed, relative to 2015 to 2019, driven by slower job finding rather than more layoffs.",
    checked: "2026-11-21"
  },
  {
    id: "anthropic-observed",
    title: "Labor market impacts of AI: A new measure and early evidence",
    authors: "Massenkoff and McCrory",
    publisher: "Anthropic",
    date: "2026-03-05",
    url: "https://www.anthropic.com/research/labor-market-impacts",
    dataSource: "Current Population Survey and Anthropic Economic Index",
    dataPublic: true,
    finding:
      "No systematic rise in unemployment for highly exposed workers since late 2022, but a 14% drop in the job-finding rate of 22 to 25 year-olds in exposed occupations, which the authors call just barely statistically significant.",
    checked: "2026-11-21"
  }
];

/** Studies that find no clear AI footprint yet. */
export const EVIDENCE_NO_EFFECT: EvidenceStudy[] = [
  {
    id: "yale-tracker",
    title: "Tracking the Impact of AI on the Labor Market",
    authors: "The Budget Lab at Yale",
    publisher: "Yale University",
    date: "2026-10-14",
    url: "https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market",
    dataSource: "Current Population Survey",
    dataPublic: true,
    finding:
      "The mix of occupations is not yet changing in ways that clearly line up with AI, and measures of AI usage show no connection to changes in employment or unemployment.",
    checked: "2026-11-21"
  },
  {
    id: "yale-sdid",
    title: "What We Do and Don't Know About How AI is Affecting the Labor Market",
    authors: "Gimbel, Kendall and Nunn",
    publisher: "The Budget Lab at Yale",
    date: "2026-05-07",
    url: "https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market",
    dataSource: "Current Population Survey",
    dataPublic: true,
    finding:
      "No employment or wage effect in exposed occupations through the first quarter of 2026. The authors add that this could change quickly.",
    checked: "2026-11-21"
  },
  {
    id: "epi-class-2026",
    title: "Class of 2026: What occupation data show about AI and the young college graduate workforce",
    authors: "Economic Policy Institute",
    publisher: "Economic Policy Institute",
    date: "2026-05",
    url: "https://www.epi.org/blog/class-of-2026-what-occupation-data-show-about-ai-and-the-young-college-graduate-workforce/",
    dataSource: "Current Population Survey",
    dataPublic: true,
    finding:
      "Unemployment rose for young workers with and without college degrees, which makes it hard to argue that AI is uniquely causing job losses for new graduates.",
    checked: "2026-11-21"
  },
  {
    id: "denmark",
    title: "Still Waters, Rapid Currents: Early Labor Market Transformation under Generative AI",
    authors: "Humlum and Vestergaard",
    publisher: "NBER Working Paper 33777",
    date: "2026-03",
    url: "https://www.nber.org/papers/w33777",
    dataSource: "Danish administrative records",
    dataPublic: false,
    finding:
      "Precise null effects on earnings and hours in Denmark, ruling out effects larger than 2% two years after ChatGPT launched. Firms absorbed AI by reorganizing tasks.",
    checked: "2026-11-21"
  }
];

export const DISAGREEMENT_REASONS = [
  {
    title: "Different data",
    body: "Payroll and résumé data (ADP, Revelio) follow millions of workers inside firms and catch changes in hiring. The Current Population Survey is a smaller household survey, so small groups such as 22 to 25 year-olds in one occupation are measured with more noise."
  },
  {
    title: "Different age bands",
    body: "\"Young\" means 22 to 25 in one study, 20 to 24 in another and 16 to 34 in a third. A hiring slowdown concentrated among the youngest workers fades when the band is wider."
  },
  {
    title: "Different exposure measures",
    body: "Some studies rank jobs by what AI could do (Eloundou and coauthors), some by how people actually use it (Anthropic Economic Index), and some combine several measures. The same job can land in different groups."
  },
  {
    title: "Other things changed at the same time",
    body: "Interest rates rose sharply in 2022 and 2023, and tech firms cut back after pandemic hiring. Stanford's February 2026 update finds that once these are controlled for, the declines in exposed jobs become statistically significant only in 2024."
  }
];

export type FirmAdoptionReading = {
  value: number;
  asOf: string;
  label: string;
  sourceLabel: string;
  sourceUrl: string;
  caveat: string;
};

/** Census BTOS headline, quoted until the research pipeline ingests BTOS directly (Phase 2). */
export const FIRM_ADOPTION: FirmAdoptionReading = {
  value: 19.8,
  asOf: "2026-05-03",
  label: "Businesses using AI",
  sourceLabel: "Census Bureau, Business Trends and Outlook Survey",
  sourceUrl: "https://census.gov/library/stories/2026/05/ai-use-businesses.html",
  caveat:
    "Census changed the question in November 2025 to ask about AI in any business function, so readings before and after that date are not directly comparable. Firm surveys count businesses, not workers, so they run lower than worker surveys."
};
