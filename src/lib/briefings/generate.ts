import { getCompositeSummaries, getIndicatorDetail } from "@/lib/db/queries";
import { getInsightFeed } from "@/lib/insights/queries";
import { MODELS } from "@/lib/llm/models";
import type { BriefingInput } from "@/types/v15";

export async function generateBriefingMarkdown(input: BriefingInput) {
  const [seriesDetails, composites, insights] = await Promise.all([
    Promise.all(input.seriesIds.map((seriesId) => getIndicatorDetail(seriesId))),
    getCompositeSummaries(),
    getInsightFeed({ limit: 100 })
  ]);
  const selectedComposites = composites.filter((composite) => input.compositeIds.includes(composite.id));
  const selectedInsights = insights.insights.filter((insight) => input.insightIds.includes(insight.id));
  const validSeries = seriesDetails.filter((detail): detail is NonNullable<typeof detail> => detail !== null);

  const lines = [
    `# ${input.theme}`,
    "",
    `Geography: ${input.geography}`,
    "",
    "## Executive Readout",
    "",
    "Labor Pulse generated this briefing from selected source data and deterministic local summaries. It does not add numerical claims beyond the selected indicators and composites.",
    "",
    "## Selected Indicators",
    ""
  ];

  for (const detail of validSeries) {
    const latest = detail.observations.filter((row) => row.value !== null).at(-1);
    lines.push(`- **${detail.series.shortTitle}**: ${latest?.value ?? "not available"} ${detail.series.units} as of ${latest?.date ?? "not available"}. Source: ${detail.series.source}.`);
  }

  lines.push("", "## Composite Signals", "");
  for (const composite of selectedComposites) {
    lines.push(`- **${composite.name}**: ${composite.currentValue.toFixed(2)} as of ${composite.asOfDate}; interpretation: ${composite.interpretation.label}.`);
  }

  lines.push("", "## Qualitative Context", "");
  for (const insight of selectedInsights) {
    lines.push(`- **${insight.title}** (${insight.sourceName}): ${insight.summary}`);
  }

  lines.push("", "## Methodology", "", "All series values are pulled from the Labor Pulse store with source attribution. AI and qualitative signals are context layers, not direct official measures.");

  return {
    content: lines.join("\n"),
    model: process.env.OPENAI_API_KEY ? MODELS.briefing : "deterministic-local"
  };
}
