/**
 * Shared glossary for LaborPulse.
 *
 * One typed list feeds the /glossary page and every inline <Term> tooltip, so a
 * definition is written once and reads the same everywhere (including the AI
 * Impact page). Each entry links to the source page its wording is based on.
 *
 * Writing rules:
 * - `plain` is one or two sentences a reader with no economics background can follow.
 * - `technical` is optional and stays close to the publisher's official wording.
 * - Do not put live statistics in a definition; they go stale. Fixed thresholds
 *   that are part of a definition (e.g. the Sahm Rule trigger) are fine.
 */

export const GLOSSARY_TOPICS = [
  { id: "jobs", label: "Jobs and unemployment" },
  { id: "wages", label: "Wages and hours" },
  { id: "education", label: "Education and skills" },
  { id: "ai", label: "AI and technology" },
  { id: "methods", label: "Reading the data" }
] as const;

export type GlossaryTopicId = (typeof GLOSSARY_TOPICS)[number]["id"];

export type GlossaryTerm = {
  /** URL-safe slug, used as the /glossary anchor. */
  id: string;
  term: string;
  topic: GlossaryTopicId;
  plain: string;
  technical?: string;
  sourceLabel: string;
  sourceUrl: string;
  related?: string[];
  /** Indicator detail page this term describes, if any (FRED series id). */
  indicatorId?: string;
};

const BLS_CPS = "https://www.bls.gov/cps/definitions.htm";
const BLS_GLOSSARY = "https://www.bls.gov/bls/glossary.htm";
const BLS_JOLTS = "https://www.bls.gov/jlt/jltdef.htm";
const BLS_CES = "https://www.bls.gov/ces/";
const NY_FED_GRADS = "https://www.newyorkfed.org/research/college-labor-market";

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Jobs and unemployment
  {
    id: "labor-force",
    term: "Labor force",
    topic: "jobs",
    plain: "Everyone age 16 and older who either has a job or is actively looking for one. People who are retired, in school full time, or not looking are outside the labor force.",
    technical: "Civilian labor force: people ages 16 and older classified as employed or unemployed in the Current Population Survey.",
    sourceLabel: "BLS, CPS definitions",
    sourceUrl: `${BLS_CPS}#laborforce`,
    related: ["unemployment-rate", "labor-force-participation-rate"]
  },
  {
    id: "unemployment-rate",
    term: "Unemployment rate",
    topic: "jobs",
    plain: "The share of the labor force that has no job but is available and looking for one. It does not depend on whether someone receives unemployment benefits.",
    technical: "Unemployed people as a percentage of the labor force. Unemployed means not employed in the survey reference week, available for work, and having actively searched in the prior four weeks (or on temporary layoff awaiting recall).",
    sourceLabel: "BLS, CPS definitions",
    sourceUrl: `${BLS_CPS}#ur`,
    related: ["labor-force", "u-6", "household-survey"],
    indicatorId: "UNRATE"
  },
  {
    id: "u-6",
    term: "U-6",
    topic: "jobs",
    plain: "A broader version of the unemployment rate. On top of the unemployed, it counts people who want a job but have stopped looking recently, and part-time workers who want full-time work.",
    technical: "The broadest BLS measure of labor underutilization: unemployed plus marginally attached workers plus those employed part time for economic reasons, as a percent of the labor force plus all marginally attached workers.",
    sourceLabel: "BLS, alternative measures of labor underutilization",
    sourceUrl: `${BLS_CPS}#altmeasures`,
    related: ["unemployment-rate", "marginally-attached", "part-time-for-economic-reasons"],
    indicatorId: "U6RATE"
  },
  {
    id: "marginally-attached",
    term: "Marginally attached and discouraged workers",
    topic: "jobs",
    plain: "People who want a job and looked for one in the past year, but not in the past four weeks, so they are not counted as unemployed. Discouraged workers are the subset who stopped looking because they believe no jobs are available.",
    technical: "A subset of those not in the labor force who currently want a job, are available, and searched in the prior 12 months but not the prior 4 weeks.",
    sourceLabel: "BLS, CPS definitions",
    sourceUrl: `${BLS_CPS}#marginallyattached`,
    related: ["u-6", "labor-force"]
  },
  {
    id: "part-time-for-economic-reasons",
    term: "Part time for economic reasons",
    topic: "jobs",
    plain: "People working part time who want and are available for full-time work but cannot get it, for example because their hours were cut or they can only find part-time jobs. Also called involuntary part-time work.",
    sourceLabel: "BLS, CPS definitions",
    sourceUrl: `${BLS_CPS}#pter`,
    related: ["u-6", "underemployment"]
  },
  {
    id: "labor-force-participation-rate",
    term: "Labor force participation rate",
    topic: "jobs",
    plain: "The share of the adult population that is working or looking for work. It falls when people retire, go back to school, or give up looking, even if the unemployment rate does not change.",
    technical: "The labor force as a percentage of the civilian noninstitutional population ages 16 and older.",
    sourceLabel: "BLS, CPS definitions",
    sourceUrl: `${BLS_CPS}#lfpr`,
    related: ["labor-force", "employment-population-ratio", "prime-age"],
    indicatorId: "CIVPART"
  },
  {
    id: "employment-population-ratio",
    term: "Employment-population ratio",
    topic: "jobs",
    plain: "The share of the adult population that has a job. Because it does not depend on who is counted as looking for work, many economists treat it as a cleaner read on how many people are working.",
    technical: "Employed people as a percentage of the civilian noninstitutional population ages 16 and older.",
    sourceLabel: "BLS, CPS definitions",
    sourceUrl: `${BLS_CPS}#epop`,
    related: ["labor-force-participation-rate", "prime-age"],
    indicatorId: "EMRATIO"
  },
  {
    id: "prime-age",
    term: "Prime-age workers",
    topic: "jobs",
    plain: "People ages 25 to 54. Looking only at this group sets aside students and retirees, so changes are more likely to reflect the job market itself than an aging population.",
    sourceLabel: "BLS via FRED, prime-age employment-population ratio",
    sourceUrl: "https://fred.stlouisfed.org/series/LNS12300060",
    related: ["employment-population-ratio", "labor-force-participation-rate"]
  },
  {
    id: "nonfarm-payrolls",
    term: "Nonfarm payrolls",
    topic: "jobs",
    plain: "The number of jobs on employer payrolls outside farming. The monthly change is the headline \"jobs added\" figure in the jobs report.",
    technical: "Employment estimate from the Current Employment Statistics (CES) establishment survey of employers. It counts jobs, not people, so a person with two jobs is counted twice.",
    sourceLabel: "BLS, Current Employment Statistics",
    sourceUrl: BLS_CES,
    related: ["establishment-survey", "household-survey", "revisions"],
    indicatorId: "PAYEMS"
  },
  {
    id: "household-survey",
    term: "Household survey (CPS)",
    topic: "methods",
    plain: "A monthly survey of households run by the Census Bureau for BLS. It asks people whether they are working or looking for work, and is the source of the unemployment rate.",
    technical: "The Current Population Survey (CPS), which counts people. Its employment figures can differ month to month from the establishment survey, which counts jobs.",
    sourceLabel: "BLS, CPS definitions",
    sourceUrl: BLS_CPS,
    related: ["establishment-survey", "unemployment-rate"]
  },
  {
    id: "establishment-survey",
    term: "Establishment survey (CES)",
    topic: "methods",
    plain: "A monthly survey of employers about how many people they pay, how many hours those workers put in, and what they earn. It is the source of payroll jobs and average hourly earnings.",
    technical: "The Current Employment Statistics (CES) program: industry estimates of nonfarm employment, hours, and earnings of workers on payrolls.",
    sourceLabel: "BLS, Current Employment Statistics",
    sourceUrl: BLS_CES,
    related: ["household-survey", "nonfarm-payrolls", "average-hourly-earnings"]
  },
  {
    id: "initial-claims",
    term: "Initial jobless claims",
    topic: "jobs",
    plain: "The number of people filing a new claim for unemployment insurance in a week. Because it comes out weekly, it is one of the fastest signs that layoffs are picking up.",
    sourceLabel: "U.S. Department of Labor via FRED",
    sourceUrl: "https://fred.stlouisfed.org/series/ICSA",
    related: ["layoffs-and-discharges", "leading-indicator"],
    indicatorId: "ICSA"
  },
  {
    id: "jolts",
    term: "JOLTS",
    topic: "jobs",
    plain: "The Job Openings and Labor Turnover Survey. It tracks how many jobs employers are trying to fill and how many people are hired, quit, or are laid off each month.",
    sourceLabel: "BLS, JOLTS definitions",
    sourceUrl: BLS_JOLTS,
    related: ["job-openings", "quits-rate", "layoffs-and-discharges"]
  },
  {
    id: "job-openings",
    term: "Job openings",
    topic: "jobs",
    plain: "Positions an employer is actively trying to fill with someone from outside the company, which could start within 30 days.",
    technical: "All positions open (not filled) on the last business day of the month, where a specific position exists, work could start within 30 days, and the employer is actively recruiting from outside the establishment.",
    sourceLabel: "BLS, JOLTS definitions",
    sourceUrl: `${BLS_JOLTS}#jo`,
    related: ["jolts", "labor-market-tightness"],
    indicatorId: "JTSJOL"
  },
  {
    id: "quits-rate",
    term: "Quits rate",
    topic: "jobs",
    plain: "The share of workers who leave their job voluntarily in a month. People quit more when they are confident they can find something better, so a high quits rate usually signals a strong market for workers.",
    technical: "Quits are employees who left voluntarily; retirements and transfers are counted separately as other separations. The rate is quits as a percent of total employment.",
    sourceLabel: "BLS, JOLTS definitions",
    sourceUrl: `${BLS_JOLTS}#seps`,
    related: ["jolts", "labor-market-tightness"],
    indicatorId: "JTSQUR"
  },
  {
    id: "layoffs-and-discharges",
    term: "Layoffs and discharges",
    topic: "jobs",
    plain: "Job separations the employer starts, such as layoffs, position cuts, and firings. The rate is the share of workers who lost a job this way in a month.",
    technical: "Involuntary separations initiated by the employer, including layoffs with no intent to rehire, discharges from eliminated positions, firings for cause, and layoffs lasting more than 7 days.",
    sourceLabel: "BLS, JOLTS definitions",
    sourceUrl: `${BLS_JOLTS}#seps`,
    related: ["jolts", "initial-claims", "labor-market-stress"],
    indicatorId: "JTSLDR"
  },
  {
    id: "temporary-help",
    term: "Temporary help services",
    topic: "jobs",
    plain: "Jobs at staffing agencies that place workers with other companies. Employers often cut temps before permanent staff, so this series tends to turn down early.",
    sourceLabel: "BLS via FRED",
    sourceUrl: "https://fred.stlouisfed.org/series/TEMPHELPS",
    related: ["leading-indicator", "nonfarm-payrolls"],
    indicatorId: "TEMPHELPS"
  },
  {
    id: "labor-market-slack",
    term: "Labor market slack",
    topic: "jobs",
    plain: "Unused capacity in the workforce: people who want work, or more hours, and cannot get it. More slack means employers have an easier time hiring and workers have less bargaining power.",
    sourceLabel: "BLS, alternative measures of labor underutilization",
    sourceUrl: `${BLS_CPS}#altmeasures`,
    related: ["labor-market-tightness", "u-6"]
  },
  {
    id: "labor-market-tightness",
    term: "Labor market tightness",
    topic: "jobs",
    plain: "How hard it is for employers to find workers. A tight market has many openings per job seeker, frequent quitting, and rising pay. LaborPulse's tightness composite blends job openings, the quits rate, and wage growth.",
    sourceLabel: "LaborPulse composite methods",
    sourceUrl: "/composites",
    related: ["labor-market-slack", "composite-index", "job-openings", "quits-rate"]
  },
  {
    id: "labor-market-stress",
    term: "Labor market stress",
    topic: "jobs",
    plain: "LaborPulse's composite measure of signs that workers are being let go or losing hours. It blends initial jobless claims, the layoffs rate, and (inverted) average weekly hours.",
    sourceLabel: "LaborPulse composite methods",
    sourceUrl: "/composites",
    related: ["composite-index", "initial-claims", "layoffs-and-discharges", "average-weekly-hours"]
  },
  {
    id: "sahm-rule",
    term: "Sahm Rule",
    topic: "jobs",
    plain: "A recession warning based only on unemployment. It compares the last three months of the unemployment rate with its lowest point over the past year. A rise of half a percentage point or more has historically meant a recession has started.",
    technical: "Three-month moving average of the unemployment rate minus its minimum over the prior 12 months. A reading of 0.50 or more triggers the signal. Developed by economist Claudia Sahm.",
    sourceLabel: "FRED, Sahm Rule recession indicator",
    sourceUrl: "https://fred.stlouisfed.org/series/SAHMREALTIME",
    related: ["unemployment-rate", "percentage-point", "leading-indicator"]
  },

  // Wages and hours
  {
    id: "average-hourly-earnings",
    term: "Average hourly earnings",
    topic: "wages",
    plain: "Average pay per hour for private-sector workers, before taxes. It is a quick read on wage growth, but it can rise simply because lower-paid workers lose jobs and drop out of the average.",
    technical: "Total payroll divided by the total hours for which employees received pay, from the establishment survey.",
    sourceLabel: "BLS glossary",
    sourceUrl: `${BLS_GLOSSARY}#A`,
    related: ["nominal-vs-real", "establishment-survey", "composition-effect"],
    indicatorId: "CES0500000003"
  },
  {
    id: "average-weekly-hours",
    term: "Average weekly hours",
    topic: "wages",
    plain: "How many hours a typical worker is paid for each week. Employers often trim hours before they cut jobs, so a drop can be an early warning.",
    technical: "Total hours worked over a period divided by the number of weeks worked in that period.",
    sourceLabel: "BLS glossary",
    sourceUrl: `${BLS_GLOSSARY}#A`,
    related: ["labor-market-stress", "leading-indicator"],
    indicatorId: "AWHAETP"
  },
  {
    id: "nominal-vs-real",
    term: "Nominal vs real wages",
    topic: "wages",
    plain: "Nominal wages are the dollar amount on a paycheck. Real wages adjust that amount for inflation, so they show whether pay actually buys more than before.",
    technical: "Real (constant-dollar) earnings are nominal earnings deflated by a price index such as the Consumer Price Index.",
    sourceLabel: "BLS glossary",
    sourceUrl: `${BLS_GLOSSARY}#C`,
    related: ["average-hourly-earnings"]
  },
  {
    id: "composition-effect",
    term: "Composition effect",
    topic: "methods",
    plain: "A change in an average caused by who is being counted rather than by anyone's situation changing. If many low-wage workers lose jobs, average pay rises even though no one got a raise.",
    sourceLabel: "LaborPulse Data & Methods",
    sourceUrl: "/sources",
    related: ["average-hourly-earnings"]
  },
  {
    id: "wage-premium",
    term: "Wage premium",
    topic: "education",
    plain: "How much more one group earns than a comparison group. On LaborPulse's underemployment page it is the gap between median pay in college-level jobs and in non-college jobs for graduates of a major. It describes a pattern, not the effect of choosing that major.",
    sourceLabel: "NY Fed, labor market for recent college graduates",
    sourceUrl: NY_FED_GRADS,
    related: ["underemployment", "correlation-vs-causation"]
  },

  // Education and skills
  {
    id: "underemployment",
    term: "Underemployment",
    topic: "education",
    plain: "Having a job that underuses you. It can mean working fewer hours than you want, working part time when you want full time, or working in a job that does not need your degree. Each meaning gives a very different number.",
    technical: "LaborPulse uses three definitions: involuntary part-time work (BLS), hours underemployment, and skills underemployment (NY Fed). They overlap and cannot be added together.",
    sourceLabel: "LaborPulse underemployment guide",
    sourceUrl: "/underemployment#definitions",
    related: ["skills-underemployment", "part-time-for-economic-reasons", "u-6"]
  },
  {
    id: "skills-underemployment",
    term: "Skills underemployment",
    topic: "education",
    plain: "A college graduate working in a job that does not usually require a college degree, such as a graduate working as a barista. There is no official government measure; the New York Fed publishes the most widely cited research version.",
    sourceLabel: "NY Fed, labor market for recent college graduates",
    sourceUrl: NY_FED_GRADS,
    related: ["underemployment", "recent-graduate", "wage-premium"]
  },
  {
    id: "recent-graduate",
    term: "Recent college graduate",
    topic: "education",
    plain: "In the New York Fed data, a person ages 22 to 27 with a bachelor's degree or higher.",
    sourceLabel: "NY Fed, labor market for recent college graduates",
    sourceUrl: NY_FED_GRADS,
    related: ["skills-underemployment"]
  },
  {
    id: "benefit-cost-ratio",
    term: "Benefit-cost ratio",
    topic: "education",
    plain: "A program's total benefits divided by its total costs, in dollars. A ratio above 1 means the program returns more than it costs; the answer depends on whose benefits and costs are counted, such as participants, taxpayers, or society as a whole.",
    sourceLabel: "LaborPulse Research",
    sourceUrl: "/research",
    related: ["randomized-controlled-trial"]
  },
  {
    id: "randomized-controlled-trial",
    term: "Randomized controlled trial (RCT)",
    topic: "methods",
    plain: "A study that randomly assigns people to get a program or not, then compares outcomes. Because chance decides who gets in, differences between the groups can be credited to the program itself.",
    sourceLabel: "LaborPulse Research",
    sourceUrl: "/research",
    related: ["correlation-vs-causation", "benefit-cost-ratio"]
  },

  // AI and technology
  {
    id: "ai-exposure",
    term: "AI exposure",
    topic: "ai",
    plain: "How much of a job's tasks AI tools could, in principle, help do faster. High exposure does not mean the job will disappear; it can mean the job changes, gets more productive, or both.",
    technical: "LaborPulse uses occupation-level scores from Eloundou et al. (2023), which rate whether large language models could cut the time for each O*NET task by at least half.",
    sourceLabel: "Eloundou et al., GPTs are GPTs (2023)",
    sourceUrl: "https://arxiv.org/abs/2303.10130",
    related: ["augmentation-vs-automation", "proxy-indicator"]
  },
  {
    id: "augmentation-vs-automation",
    term: "Augmentation vs automation",
    topic: "ai",
    plain: "Automation is when AI does a task in place of a person. Augmentation is when a person uses AI to do their own work better or faster. The same tool can do either, and the mix matters for whether jobs are replaced or reshaped.",
    sourceLabel: "Anthropic Economic Index",
    sourceUrl: "https://www.anthropic.com/economic-index",
    related: ["ai-exposure"]
  },
  {
    id: "proxy-indicator",
    term: "Proxy indicator",
    topic: "methods",
    plain: "A measure used to stand in for something that cannot be measured directly. LaborPulse marks proxies clearly: for example, employment in the information sector is a rough stand-in for AI's labor market effect, not a direct measure of it.",
    sourceLabel: "LaborPulse Data & Methods",
    sourceUrl: "/sources",
    related: ["ai-exposure"]
  },

  {
    id: "observed-exposure",
    term: "Observed exposure",
    topic: "ai",
    plain: "AI exposure that counts only the tasks people are already using AI for at work, rather than every task researchers predict AI could do. It shows where AI is being used now, not where it might be used later.",
    technical: "Massenkoff and McCrory (Anthropic, 2026) count a task as covered when it is rated feasible for an LLM (Eloundou et al. beta score) and has enough work-related usage in the Anthropic Economic Index. Automated uses get full weight, augmentative uses half weight, and task coverage is averaged to occupations by time share.",
    sourceLabel: "Massenkoff and McCrory, Anthropic (2026)",
    sourceUrl: "https://www.anthropic.com/research/labor-market-impacts",
    related: ["ai-exposure", "augmentation-vs-automation"]
  },
  {
    id: "early-career-worker",
    term: "Early-career worker",
    topic: "ai",
    plain: "A worker near the start of their career. Studies define the group by age or by years since finishing school, and each states its own cutoff. They are watched closely in AI research because entry-level tasks may be the easiest for AI to take on.",
    technical: "Cutoffs differ by study: Brynjolfsson, Chandar and Chen use ages 22 to 25 in ADP payroll data; the Dallas Fed uses ages 20 to 24 in the Current Population Survey. Compare results only when the age bands match.",
    sourceLabel: "Brynjolfsson, Chandar and Chen, Stanford Digital Economy Lab",
    sourceUrl: "https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/",
    related: ["ai-exposure", "experience-premium", "recent-graduate"]
  },
  {
    id: "experience-premium",
    term: "Experience premium",
    topic: "wages",
    plain: "The extra pay that comes with more years of work experience. If AI makes less experienced workers more productive, this gap could narrow; if AI replaces entry-level tasks, it could widen.",
    technical: "The Dallas Fed measures it as the percentage difference between experienced and entry-level wages in an occupation, using BLS modeled wage estimates.",
    sourceLabel: "Davis, Federal Reserve Bank of Dallas (2026)",
    sourceUrl: "https://www.dallasfed.org/research/economics/2026/0224",
    related: ["wage-premium", "early-career-worker"]
  },
  {
    id: "job-finding-rate",
    term: "Job-finding rate",
    topic: "jobs",
    plain: "The share of unemployed people in one month who have a job by the next month. It shows how quickly people get back to work, which the unemployment rate alone does not.",
    technical: "Computed from Current Population Survey labor force status flows: unemployed-to-employed transitions as a share of the unemployed in the prior month.",
    sourceLabel: "BLS, labor force status flows",
    sourceUrl: "https://www.bls.gov/cps/cps_flows.htm",
    related: ["unemployment-rate", "household-survey"]
  },
  {
    id: "occupational-mix",
    term: "Occupational mix",
    topic: "jobs",
    plain: "How employment is spread across different kinds of jobs, such as the share of workers who are nurses, software developers, or cashiers. Shifts in the mix show which kinds of work are growing or shrinking.",
    sourceLabel: "BLS, Occupational Employment and Wage Statistics",
    sourceUrl: "https://www.bls.gov/oes/",
    related: ["ai-exposure", "composition-effect"]
  },
  {
    id: "labor-share",
    term: "Labor share",
    topic: "wages",
    plain: "The portion of the income an economy produces that goes to workers as pay and benefits, with the rest going to owners of capital as profits, interest, and rent.",
    sourceLabel: "BLS, productivity program",
    sourceUrl: "https://www.bls.gov/productivity/",
    related: ["total-factor-productivity"]
  },
  {
    id: "total-factor-productivity",
    term: "Total factor productivity (TFP)",
    topic: "methods",
    plain: "Growth in output that is not explained by adding more workers, hours, or equipment. It is often read as a measure of better technology and better ways of working, which is why it is central to forecasts of AI's economic effect.",
    sourceLabel: "BLS, productivity program",
    sourceUrl: "https://www.bls.gov/productivity/",
    related: ["labor-share"]
  },
  {
    id: "difference-in-differences",
    term: "Difference-in-differences",
    topic: "methods",
    plain: "A way to estimate an effect without an experiment. It compares how outcomes changed over time for a group that was affected (for example, highly AI-exposed jobs) with how they changed for a similar group that was not.",
    technical: "The estimate is the change in the treated group minus the change in the comparison group. It relies on the assumption that both groups would have followed parallel trends without the treatment.",
    sourceLabel: "LaborPulse Data & Methods",
    sourceUrl: "/sources",
    related: ["correlation-vs-causation", "randomized-controlled-trial"]
  },

  // Reading the data
  {
    id: "seasonally-adjusted",
    term: "Seasonally adjusted",
    topic: "methods",
    plain: "Adjusted to remove regular calendar patterns, like holiday hiring or summer jobs for students, so that the change from one month to the next reflects real movement in the economy.",
    technical: "Seasonal adjustment is a statistical procedure that removes the effects of normal seasonal variation from a time series.",
    sourceLabel: "BLS, CPS definitions",
    sourceUrl: `${BLS_CPS}#sa`,
    related: ["year-over-year"]
  },
  {
    id: "year-over-year",
    term: "Year-over-year change",
    topic: "methods",
    plain: "The change compared with the same month or week one year earlier. It smooths out short-term noise and seasonal swings.",
    sourceLabel: "LaborPulse metric definitions",
    sourceUrl: "/sources",
    related: ["seasonally-adjusted", "percentage-point"]
  },
  {
    id: "percentage-point",
    term: "Percentage point vs percent",
    topic: "methods",
    plain: "When a rate moves from 4% to 5%, it rose by 1 percentage point, which is a 25 percent increase. LaborPulse reports changes in rates in percentage points, shown as \"pp\".",
    sourceLabel: "LaborPulse metric definitions",
    sourceUrl: "/sources",
    related: ["year-over-year", "unemployment-rate"]
  },
  {
    id: "revisions",
    term: "Revisions",
    topic: "methods",
    plain: "Updates to previously published numbers as more complete data arrives. Payroll job counts in particular are revised in the following two months and again once a year, so early figures can change.",
    sourceLabel: "BLS, Current Employment Statistics",
    sourceUrl: BLS_CES,
    related: ["nonfarm-payrolls"]
  },
  {
    id: "leading-indicator",
    term: "Leading vs lagging indicator",
    topic: "methods",
    plain: "Leading indicators tend to change before the overall economy does, such as jobless claims or temp jobs. Lagging indicators, such as the unemployment rate, confirm a shift after it is underway.",
    sourceLabel: "LaborPulse dashboard",
    sourceUrl: "/",
    related: ["initial-claims", "temporary-help", "sahm-rule"]
  },
  {
    id: "composite-index",
    term: "Composite index",
    topic: "methods",
    plain: "A single number built by combining several related indicators, so that one noisy series does not dominate. LaborPulse lists the inputs and method for every composite it publishes.",
    sourceLabel: "LaborPulse composite methods",
    sourceUrl: "/composites",
    related: ["z-score", "labor-market-tightness", "labor-market-stress"]
  },
  {
    id: "z-score",
    term: "Z-score",
    topic: "methods",
    plain: "How far a value is from its usual level, measured in standard deviations. A z-score of 0 is typical, +1 is unusually high, and -1 is unusually low. It lets indicators with different units be compared and combined.",
    sourceLabel: "LaborPulse composite methods",
    sourceUrl: "/composites",
    related: ["composite-index"]
  },
  {
    id: "correlation-vs-causation",
    term: "Correlation vs causation",
    topic: "methods",
    plain: "Two things moving together (correlation) does not show that one causes the other (causation). Many LaborPulse comparisons are descriptive; pages say so when a result is not causal.",
    sourceLabel: "LaborPulse Data & Methods",
    sourceUrl: "/sources",
    related: ["randomized-controlled-trial", "wage-premium"]
  }
];

const TERMS_BY_ID = new Map(GLOSSARY_TERMS.map((entry) => [entry.id, entry]));

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return TERMS_BY_ID.get(id);
}

export function getTermsForIndicator(indicatorId: string): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((entry) => entry.indicatorId === indicatorId);
}

/** Terms grouped by topic in display order, each group sorted alphabetically. */
export function groupTermsByTopic(terms: GlossaryTerm[] = GLOSSARY_TERMS) {
  return GLOSSARY_TOPICS.map((topic) => ({
    ...topic,
    terms: terms.filter((entry) => entry.topic === topic.id).sort((a, b) => a.term.localeCompare(b.term))
  })).filter((group) => group.terms.length > 0);
}

/** Case-insensitive match on the term name and both definitions. */
export function searchGlossary(query: string, terms: GlossaryTerm[] = GLOSSARY_TERMS): GlossaryTerm[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return terms;
  return terms.filter((entry) =>
    [entry.term, entry.plain, entry.technical ?? ""].some((text) => text.toLowerCase().includes(needle))
  );
}

export function glossaryHref(id: string) {
  return `/glossary#${id}`;
}
