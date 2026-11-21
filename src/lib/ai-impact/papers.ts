// The five landmark papers and the predictions scorecard.
//
// Paper claims are quoted or closely paraphrased from each paper's abstract
// (checked 2026-11-21). Scorecard statuses are editorial judgments: change
// them only in a reviewed PR, and update `reviewed` and the reasoning together.

import type { SignalId } from "@/lib/ai-impact/signals";

export type LandmarkPaper = {
  id: string;
  shortName: string;
  title: string;
  authors: string;
  venue: string;
  url: string;
  chainStep: "capability" | "adoption" | "tasks" | "jobs" | "economy";
  /** One-line headline for the card. */
  claim: string;
  /** Plain-language explanation for a reader new to economics. */
  explainer: string;
  assumptions: string[];
  /** What evidence would show the paper is wrong or incomplete. */
  wouldChallengeIt: string;
};

export const LANDMARK_PAPERS: LandmarkPaper[] = [
  {
    id: "eloundou",
    shortName: "GPTs are GPTs",
    title: "GPTs are GPTs: Labor market impact potential of LLMs",
    authors: "Eloundou, Manning, Mishkin and Rock",
    venue: "Science, 2024",
    url: "https://arxiv.org/abs/2303.10130",
    chainStep: "capability",
    claim: "Large language models could touch a large share of work.",
    explainer:
      "The authors rated every task in the government's occupation database for whether an LLM could do it much faster at the same quality. They estimate around 80% of U.S. workers could have at least 10% of their tasks affected, and about 19% could see at least half their tasks affected. This is the exposure measure most other studies, and this page, use.",
    assumptions: [
      "Exposure means potential time savings, not that firms will adopt AI or cut jobs.",
      "Ratings by people and by GPT-4 are a fair guide to what the technology can do.",
      "Tasks listed in O*NET describe what workers actually spend time on."
    ],
    wouldChallengeIt: "Real-world AI use concentrating in jobs the measure rates as low exposure, or exposed jobs showing no change years after adoption."
  },
  {
    id: "acemoglu",
    shortName: "Simple Macroeconomics of AI",
    title: "The Simple Macroeconomics of AI",
    authors: "Daron Acemoglu",
    venue: "Economic Policy, 2025",
    url: "https://nber.org/papers/w32487",
    chainStep: "economy",
    claim: "AI's boost to the economy over the next decade will be real but modest.",
    explainer:
      "Acemoglu multiplies the share of tasks AI affects by how much it saves on each one. Using 20% of tasks exposed, 23% of those profitable to automate, and about 27% labor cost savings, he gets no more than a 0.66% increase in total factor productivity over 10 years.",
    assumptions: [
      "Economy-wide gains come only from cost savings on tasks AI performs.",
      "Exposure estimates from earlier studies are about right.",
      "Hard-to-learn tasks see much smaller gains than easy ones."
    ],
    wouldChallengeIt: "A sustained jump in productivity growth that lines up with AI adoption, or AI creating many new tasks rather than only cheapening old ones."
  },
  {
    id: "brynjolfsson-li-raymond",
    shortName: "Generative AI at Work",
    title: "Generative AI at Work",
    authors: "Brynjolfsson, Li and Raymond",
    venue: "Quarterly Journal of Economics, 2025",
    url: "https://www.nber.org/papers/w31161",
    chainStep: "tasks",
    claim: "AI helps less experienced workers the most.",
    explainer:
      "When a firm gave 5,179 customer support agents an AI assistant, issues resolved per hour rose 14% on average, including a 34% improvement for novice and low-skilled workers, with minimal impact on the most experienced. The AI spread the know-how of top workers to new ones.",
    assumptions: [
      "One firm and one task (customer support) tell us about other jobs.",
      "It measures productivity of people already hired, not whether firms hire more or fewer of them."
    ],
    wouldChallengeIt: "Firms responding to more productive juniors by hiring fewer of them, so the gains never reach new workers."
  },
  {
    id: "autor-thompson",
    shortName: "Expertise",
    title: "Beyond Job Displacement: How AI Could Reshape the Value of Human Expertise",
    authors: "David Autor and Neil Thompson",
    venue: "Digitalist Papers, 2025",
    url: "https://economics.mit.edu/sites/default/files/2026-04/Digitalist-Autor-Thompson-Beyond%20Job%20Displacement_%20How%20AI%20Could%20Reshape%20the%20Value%20of%20Human%20Expertise%20%E2%80%94%20Digitalist%20Papers.pdf",
    chainStep: "jobs",
    claim: "What matters is which tasks AI takes over, not how many.",
    explainer:
      "Looking at 303 occupations from 1980 to 2018, the authors find that when technology took over a job's expert tasks, wages fell and more people could do the work. When it took over the routine tasks, the remaining work got more expert, wages rose and employment shrank. So wages and jobs can move in opposite directions.",
    assumptions: [
      "Expertise can be measured from the wording of task descriptions.",
      "The pattern from past technologies carries over to AI."
    ],
    wouldChallengeIt: "Wages and employment in exposed jobs falling together regardless of whether AI handles expert or routine tasks."
  },
  {
    id: "korinek-suh",
    shortName: "Scenarios for AGI",
    title: "Scenarios for the Transition to AGI",
    authors: "Anton Korinek and Donghyun Suh",
    venue: "NBER Working Paper 32255, 2024",
    url: "https://www.nber.org/papers/w32255",
    chainStep: "economy",
    claim: "If AI can eventually do nearly every task, wages could fall even as the economy booms.",
    explainer:
      "This is the transformative view. Wages depend on a race between automation and the build-up of capital. If there is always new work only humans can do, wages keep rising. If AI can eventually do nearly all tasks, wages can collapse near full automation, even while output grows fast.",
    assumptions: [
      "Work is a ladder of tasks ordered by complexity, and AI climbs it steadily.",
      "Whether that ladder has a top is the key unknown."
    ],
    wouldChallengeIt: "Workers' share of income and real wages holding up as AI capabilities and adoption keep growing."
  }
];

export type ScorecardStatus = "too_early" | "tracking" | "tension";

export const SCORECARD_STATUS_LABELS: Record<ScorecardStatus, string> = {
  too_early: "Too early to tell",
  tracking: "Tracking so far",
  tension: "In tension with the data"
};

export type ScorecardRow = {
  paperId: string;
  prediction: string;
  indicator: string;
  /** Live FRED reading shown with this row, if any. */
  signalId?: SignalId;
  /** Quoted reading from a study, with its link, when no live series tests the claim. */
  evidence?: { text: string; url: string; sourceLabel: string };
  status: ScorecardStatus;
  reasoning: string;
  reviewed: string;
};

export const SCORECARD: ScorecardRow[] = [
  {
    paperId: "eloundou",
    prediction: "AI use will concentrate in the occupations rated most exposed.",
    indicator: "Where people actually use AI at work (observed exposure)",
    evidence: {
      text: "Computer programmers top observed exposure, but AI is far from reaching its theoretical capability: actual coverage remains a fraction of what's feasible.",
      url: "https://www.anthropic.com/research/labor-market-impacts",
      sourceLabel: "Massenkoff and McCrory, Anthropic (2026)"
    },
    status: "tracking",
    reasoning: "Usage is showing up first in the jobs the measure flagged, but it covers far fewer tasks than the measure says AI could do.",
    reviewed: "2026-11-21"
  },
  {
    paperId: "acemoglu",
    prediction: "Productivity gains over the next decade will be modest.",
    indicator: "Labor productivity growth, nonfarm business",
    signalId: "productivity",
    status: "too_early",
    reasoning:
      "Spread over ten years, the predicted gain is a small fraction of a point per year, too small to separate from normal swings in productivity this early. Watch for a sustained break in the trend.",
    reviewed: "2026-11-21"
  },
  {
    paperId: "brynjolfsson-li-raymond",
    prediction: "AI will help less experienced workers the most.",
    indicator: "Employment of young workers in AI-exposed jobs",
    evidence: {
      text: "Workers aged 22 to 25 in highly exposed occupations are about 19% below where they would be had they kept pace with peers in less-exposed jobs.",
      url: "https://digitaleconomy.stanford.edu/news/canariesaug26/",
      sourceLabel: "Brynjolfsson, Chandar and Chen (2026)"
    },
    status: "tension",
    reasoning:
      "The paper measured workers already on the job. The newer evidence is about hiring: firms seem to be taking on fewer young workers in exposed jobs. Both can be true, but the benefit to novices is not reaching new entrants.",
    reviewed: "2026-11-21"
  },
  {
    paperId: "autor-thompson",
    prediction: "AI's wage effects will depend on whether it handles a job's expert or routine tasks.",
    indicator: "Wage growth by AI exposure and experience premium",
    evidence: {
      text: "Across 205 occupations, wage growth since 2022 is flat against AI exposure overall, but falls with exposure where experience pays little and rises where experience pays a lot.",
      url: "https://www.dallasfed.org/research/economics/2026/0224",
      sourceLabel: "Davis, Federal Reserve Bank of Dallas (2026)"
    },
    status: "tracking",
    reasoning: "Early wage data split the way the expertise framework suggests, though it is one descriptive study.",
    reviewed: "2026-11-21"
  },
  {
    paperId: "korinek-suh",
    prediction: "If automation outruns new work, workers' share of income will fall.",
    indicator: "Labor share of income, nonfarm business",
    signalId: "labor_share",
    status: "too_early",
    reasoning: "The labor share moves with the business cycle for many reasons. A long, steady decline as AI spreads would be the warning sign.",
    reviewed: "2026-11-21"
  }
];
