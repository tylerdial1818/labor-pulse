export type MethodologyReference = {
  label: string;
  href: string;
};

export type MethodologySubsection = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  references: MethodologyReference[];
};

export type LimitationPoint = {
  id: string;
  title: string;
  body: string;
};

export const methodologyReferences = {
  nyFedCollegeLaborMarket: {
    label: "NY Fed Labor Market for Recent College Graduates",
    href: "https://www.newyorkfed.org/research/college-labor-market",
  },
  nyFedStaffReport: {
    label: "NY Fed staff report on early career underemployment",
    href: "https://fraser.stlouisfed.org/title/staff-reports-federal-reserve-bank-new-york-9235/underemployment-early-careers-college-graduates-following-great-recession-718744/content/fulltext/frbny_sr749",
  },
  onetEducationApi: {
    label: "O*NET education data reference",
    href: "https://services.onetcenter.org/reference/online/occupation/summary/education",
  },
  blsComputerSupport: {
    label: "BLS Occupational Outlook Handbook, computer support specialists",
    href: "https://www.bls.gov/ooh/computer-and-information-technology/computer-support-specialists.htm",
  },
  blsRegisteredNurses: {
    label: "BLS Occupational Outlook Handbook, registered nurses",
    href: "https://www.bls.gov/ooh/healthcare/registered-nurses.htm",
  },
  blsSalesEngineers: {
    label: "BLS Occupational Outlook Handbook, sales engineers",
    href: "https://www.bls.gov/ooh/sales/sales-engineers.htm",
  },
  burningGlassStrada: {
    label: "Burning Glass Institute and Strada, Talent Disrupted",
    href: "https://www.strada.org/wp-content/uploads/2024/03/Talent-Disrupted-2.pdf",
  },
  foggHarrington: {
    label: "Fogg and Harrington on mal-employment",
    href: "https://eric.ed.gov/?id=EJ967808",
  },
  mismatchLiterature: {
    label: "Education-occupation mismatch literature",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8502953/",
  },
} as const satisfies Record<string, MethodologyReference>;

export const methodologyIntro =
  "This section explains how the underemployment measure is built, why the threshold matters, and where the public data is strongest and weakest.";

export const methodologyInterpretation =
  "The NY Fed measure is the best public benchmark for college graduate underemployment, but it is still a classification system. It converts a continuous labor market into a binary college job or non-college job label. That makes the measure useful for tracking broad patterns and less reliable for judging occupations that sit near the boundary.";

export const methodologySubsections: MethodologySubsection[] = [
  {
    id: "threshold-rule",
    title: "The NY Fed 50 percent threshold rule",
    summary: "The core method classifies an occupation as a college job when at least half of workers in that occupation hold or require a bachelor's degree.",
    body: [
      "The NY Fed underemployment rate starts with an occupation-level classification. An employed college graduate counts as underemployed when they work in an occupation classified as a non-college job. The NY Fed assigns that label using a 50 percent rule, informed by Department of Labor O*NET education data and Census occupation data.",
      "The rule is transparent and repeatable, which is why it works well as a public benchmark. It also creates a hard boundary around a soft labor market fact. An occupation just above the line becomes a college job. An occupation just below the line becomes a non-college job. Small shifts in the occupational workforce can change the label without changing the lived experience of the job.",
      "The main critique is not that the rule is careless. The critique is that the rule is necessarily arbitrary. A threshold at 45 percent or 55 percent would classify some occupations differently and would move the headline underemployment rate.",
    ],
    references: [methodologyReferences.nyFedCollegeLaborMarket, methodologyReferences.nyFedStaffReport],
  },
  {
    id: "margin-matters",
    title: "Why this matters at the margin",
    summary: "Occupations near the threshold can move between college and non-college status as credentials, licensing norms, and employer requirements change.",
    body: [
      "The margin matters because several large occupations combine skilled work with multiple entry pathways. Computer user support specialists are a clear example. O*NET-derived education distributions place the bachelor's degree share just below the 50 percent line, while BLS notes that many jobs require technical knowledge but not necessarily a college degree.",
      "Registered nurses show the opposite issue. O*NET-derived education distributions place the bachelor's degree share modestly above the line, while BLS describes three common entry paths: a bachelor's degree in nursing, an associate degree in nursing, or a diploma from an approved program. The work is skilled and licensed, but the bachelor's degree is not the only route into the occupation.",
      "Technical sales roles add a third type of ambiguity. BLS classifies sales engineers as typically needing a bachelor's degree, yet it also notes that some candidates qualify through sales experience plus technical training. These examples show why threshold classifications are most defensible for broad trends and most contested for occupations near the boundary.",
    ],
    references: [
      methodologyReferences.onetEducationApi,
      methodologyReferences.blsComputerSupport,
      methodologyReferences.blsRegisteredNurses,
      methodologyReferences.blsSalesEngineers,
    ],
  },
  {
    id: "alternative-measures",
    title: "Alternative measures and how they compare",
    summary: "Different underemployment measures answer different questions about credentials, skills, wages, and job fit.",
    body: [
      "The NY Fed measure asks whether a college graduate works in an occupation that meets a college-job threshold. Burning Glass and Lightcast-style measures often use job postings, occupational skill requirements, and career pathway evidence to classify underemployment. These approaches can capture employer demand more directly, but they depend on postings data and proprietary taxonomies.",
      "Fogg and Harrington's mal-employment framework focuses on whether college graduates work in occupations that use the knowledge and skills associated with college education. It is conceptually close to the NY Fed approach, but it comes from a broader labor market underutilization literature and uses the college labor market as its organizing frame.",
      "The mismatch literature separates vertical mismatch from horizontal mismatch. Vertical mismatch asks whether the job uses the worker's education level. Horizontal mismatch asks whether the worker's field of study matches the occupation. A simple credential underemployment count asks only whether the job requires a bachelor's degree. That measure is easy to explain, but it can miss skill use, wages, licensing, and career pathways.",
    ],
    references: [
      methodologyReferences.burningGlassStrada,
      methodologyReferences.foggHarrington,
      methodologyReferences.mismatchLiterature,
    ],
  },
  {
    id: "recent-graduates",
    title: "What recent means",
    summary: "The NY Fed recent graduate cohort covers ages 22 to 27, which makes the measure especially useful for early career transitions.",
    body: [
      "Recent graduates in the NY Fed data are college graduates ages 22 to 27. This age band captures the transition from school into the early labor market and makes the recent graduate rate distinct from the all-graduate rate.",
      "The definition also excludes many adult learners and nontraditional students who complete degrees later in life. That exclusion matters for analysts studying online, part-time, and competency-based education, because those models often serve workers whose labor market history looks different from a traditional 22-year-old graduate.",
      "For this page, the recent graduate rate should be read as an early career benchmark. It should not be treated as a complete measure of outcomes for all newly credentialed workers.",
    ],
    references: [methodologyReferences.nyFedCollegeLaborMarket],
  },
  {
    id: "sample-reliability",
    title: "Sample size and statistical reliability",
    summary: "Major-level estimates are useful for comparison, but small majors can carry wider uncertainty than the ranking chart implies.",
    body: [
      "The headline underemployment rate pools many observations and is more stable than most major-level estimates. Major rankings are thinner. Some majors represent smaller samples, and those estimates can move more from survey noise, classification changes, or cohort composition.",
      "This matters most when two majors sit close together in the ranking. A one or two point gap should not be read as a precise ordering unless the underlying samples are large enough to support that distinction. The ranking is better at separating broad clusters than at adjudicating tiny differences.",
      "The page should therefore present major-level bars as estimates with methodological context. Users can still compare majors, but they should avoid treating every rank position as a statistically meaningful difference.",
    ],
    references: [methodologyReferences.nyFedCollegeLaborMarket, methodologyReferences.nyFedStaffReport],
  },
];

export const limitationsIntro =
  "The underemployment framework is powerful because it is narrow. The same narrowness creates blind spots that matter for workforce policy.";

export const limitationInterpretation =
  "These limitations do not make the NY Fed series unusable. They define its proper use. The series is strongest for comparing college graduate outcomes and weakest as a general measure of whether the labor market is using all available skill.";

export const limitationPoints: LimitationPoint[] = [
  {
    id: "workers-without-bachelors",
    title: "Workers without bachelor's degrees are outside the frame",
    body: "The measure excludes workers without bachelor's degrees, even though they make up the majority of the workforce and may face the most acute underemployment. A worker with strong technical skills, a certificate, or years of experience does not enter this calculation unless they also hold a bachelor's degree.",
  },
  {
    id: "sub-baccalaureate-credentials",
    title: "Sub-baccalaureate credentials are invisible",
    body: "Certificates, associate's degrees, industry certifications, apprenticeships, and microcredentials do not receive separate treatment in the NY Fed framework. That omission matters because many workforce development strategies rely on credentials below the bachelor's level.",
  },
  {
    id: "snapshot-not-trajectory",
    title: "The data is a snapshot, not a career path",
    body: "The cross-sectional rate does not measure career mobility, skill development on the job, or the value of an underemployed first job as a stepping stone. Some workers use a non-college job to enter an industry and move up. Others remain stuck. The headline rate does not separate those pathways.",
  },
  {
    id: "bachelors-as-unit",
    title: "The bachelor's degree remains the unit of analysis",
    body: "The framework assumes that the bachelor's degree is the relevant credential boundary. Competency-based education and skills-first hiring challenge that assumption directly. They ask whether the worker has the skill for the job, not whether the worker holds the traditional four-year credential.",
  },
  {
    id: "geographic-averaging",
    title: "Geographic variation is averaged out",
    body: "National rates flatten local labor markets. The same underemployment rate can carry different implications in a high-cost coastal metro, a lower-cost interior city, or a region with a specialized industry cluster. Wages, commuting options, occupational mix, and housing costs all change the meaning of the same headline number.",
  },
];
