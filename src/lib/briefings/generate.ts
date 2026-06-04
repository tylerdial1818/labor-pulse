import { getCompositeSummaries, getIndicatorDetail } from "@/lib/db/queries";
import { getInsightFeed } from "@/lib/insights/queries";
import { getCurrentHeadlineRates, getDefinitionalOverlap, getMajorProfile } from "@/lib/underemployment/calculate";
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
  const underemploymentMajorIds = input.underemploymentMajorIds ?? [];
  const [underemploymentHeadline, underemploymentOverlap, underemploymentMajors] = await Promise.all([
    input.includeUnderemploymentHeadline ? getCurrentHeadlineRates() : Promise.resolve(null),
    input.includeUnderemploymentDefinitions ? getDefinitionalOverlap() : Promise.resolve(null),
    Promise.all(underemploymentMajorIds.slice(0, 5).map((majorId) => getMajorProfile(majorId)))
  ]);

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

  const validUnderemploymentMajors = underemploymentMajors.filter((major): major is NonNullable<typeof major> => major !== null);

  if (underemploymentHeadline || underemploymentOverlap || validUnderemploymentMajors.length > 0) {
    lines.push("", "## Underemployment Context", "");

    if (underemploymentHeadline) {
      lines.push(
        `- **Headline skills underemployment:** Recent college graduates were at ${underemploymentHeadline.recentGrads.toFixed(1)} percent and all college graduates were at ${underemploymentHeadline.allGrads.toFixed(1)} percent as of ${underemploymentHeadline.asOfDate}. Source: New York Fed.`
      );
    }

    if (underemploymentOverlap) {
      lines.push(
        `- **Definition frame:** Involuntary part-time work was ${underemploymentOverlap.involuntaryPartTime.toLocaleString("en-US")} thousand workers, while NY Fed skills underemployment was ${underemploymentOverlap.skillsUnderemployment.toFixed(1)} percent. These denominators should not be summed.`
      );
    }

    for (const major of validUnderemploymentMajors) {
      lines.push(
        `- **${major.name}:** ${major.current.underemploymentRate.toFixed(1)} percent underemployed, ${major.current.unemploymentRate.toFixed(1)} percent unemployed, and ${major.wagePremium.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} wage premium as of ${major.current.date}.`
      );
    }
  }

  lines.push("", "## Methodology", "", "All series values are pulled from the Labor Pulse store with source attribution. AI and qualitative signals are context layers, not direct official measures.");

  return {
    content: lines.join("\n"),
    model: process.env.OPENAI_API_KEY ? MODELS.briefing : "deterministic-local"
  };
}
