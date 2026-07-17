import type { IndicatorCardViewModel, LaborDashboardData } from "@/server/labor-types";

export const BRIEFING_AUDIENCES = ["executive", "policy", "research"] as const;
export const BRIEFING_HORIZONS = ["current", "near_term", "structural"] as const;

export type BriefingAudience = (typeof BRIEFING_AUDIENCES)[number];
export type BriefingHorizon = (typeof BRIEFING_HORIZONS)[number];

export type BriefingRequest = {
  title: string;
  audience: BriefingAudience;
  horizon: BriefingHorizon;
  geography: string;
  indicatorIds: string[];
  includeMethodology: boolean;
};

export type BriefingResult = {
  markdown: string;
  generatedAt: string;
  mode: "deterministic";
  citedIndicatorIds: string[];
};

const audienceLabels: Record<BriefingAudience, string> = {
  executive: "Executive",
  policy: "Policy",
  research: "Research"
};

const horizonLabels: Record<BriefingHorizon, string> = {
  current: "Current conditions",
  near_term: "Near-term watch",
  structural: "Structural context"
};

function normalizeTitle(title: string) {
  return title.trim().replace(/\s+/g, " ").slice(0, 120);
}

function indicatorLine(indicator: IndicatorCardViewModel) {
  const date = indicator.currentDate ?? "date unavailable";
  return `- **${indicator.title}:** ${indicator.currentValueFormatted}${indicator.unitLabel ? ` ${indicator.unitLabel}` : ""} as of ${date}. ${indicator.delta.formatted} ${indicator.delta.periodLabel}. Source: ${indicator.source}.`;
}

function methodologyLine(indicator: IndicatorCardViewModel) {
  if (!indicator.methodologyNote) return null;
  return `- **${indicator.title}:** ${indicator.methodologyNote}`;
}

export function generateDeterministicBriefing(input: BriefingRequest, data: LaborDashboardData, generatedAt = new Date()): BriefingResult {
  const cards = data.categories.flatMap((category) => category.indicators);
  const requestedIds = new Set(input.indicatorIds);
  const selected = cards.filter((card) => requestedIds.has(card.id));
  const ordered = selected.length > 0 ? selected : cards.slice(0, 6);
  const proxyNotes = ordered.map(methodologyLine).filter((line): line is string => Boolean(line));
  const title = normalizeTitle(input.title) || "Labor Pulse Briefing";

  const sections = [
    `# ${title}`,
    `Created: ${generatedAt.toISOString()}`,
    `Audience: ${audienceLabels[input.audience]}`,
    `Frame: ${horizonLabels[input.horizon]}`,
    `Geography: ${input.geography}`,
    "## Evidence Snapshot",
    ...ordered.map(indicatorLine),
    "## Readout",
    "This briefing draws from the Labor Pulse indicator store. It reports only values, dates, changes, sources, and caveats already present in the application data model.",
    "## Watch Items",
    "- Compare exposed-sector employment signals with leading labor indicators before inferring broader labor-market impact.",
    "- Treat proxy and ad hoc AI indicators as context, not as direct displacement or adoption measures."
  ];

  if (input.includeMethodology && proxyNotes.length > 0) {
    sections.push("## Methodology Caveats", ...proxyNotes);
  }

  sections.push("## Source Note", "No new numerical claims were added beyond the selected Labor Pulse indicators.");

  return {
    markdown: `${sections.join("\n\n")}\n`,
    generatedAt: generatedAt.toISOString(),
    mode: "deterministic",
    citedIndicatorIds: ordered.map((indicator) => indicator.id)
  };
}

export function getBriefingIndicatorOptions(data: LaborDashboardData) {
  return data.categories.flatMap((category) =>
    category.indicators.map((indicator) => ({
      id: indicator.id,
      label: indicator.title,
      category: category.label,
      source: indicator.source,
      isProxy: indicator.isProxy
    }))
  );
}
