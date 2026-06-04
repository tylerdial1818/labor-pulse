import "server-only";

import { getCachedDefinition, cacheDefinition } from "@/lib/db/queries";
import { MODELS } from "@/lib/llm/models";
import type { DefinitionResponse, IndicatorSeries } from "@/server/labor-types";

type OpenAITextResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractOutputText(payload: unknown) {
  if (!isRecord(payload)) {
    return null;
  }

  if (typeof payload.output_text === "string") {
    return payload.output_text.trim();
  }

  const response = payload as OpenAITextResponse;
  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter((value): value is string => typeof value === "string")
    .join("\n")
    .trim();

  return text && text.length > 0 ? text : null;
}

function validateDefinitionText(content: string) {
  if (/\d/.test(content)) {
    throw new Error("Generated definition contained numeric content.");
  }

  const bannedQuantitativeTerms = ["percent", "percentage", "rate of", "increase of", "decrease of"];
  const lower = content.toLowerCase();
  const bannedTerm = bannedQuantitativeTerms.find((term) => lower.includes(term));

  if (bannedTerm) {
    throw new Error(`Generated definition contained quantitative language: ${bannedTerm}.`);
  }
}

async function callOpenAIForDefinition(series: IndicatorSeries) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required to generate definitions.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: MODELS.definitions,
      instructions:
        "Write plain-English methodology definitions for executive readers. Do not include any numerical values, current statistics, dates, rankings, percentages, thresholds, or quantitative claims.",
      input: `Define the labor market indicator "${series.shortTitle}". Cover what it measures, why it matters, source context, and common misinterpretations. Keep it concise and prose-only.`
    }),
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    throw new Error(`OpenAI definition request failed with status ${response.status}.`);
  }

  const text = extractOutputText((await response.json()) as unknown);

  if (!text) {
    throw new Error("OpenAI definition response did not include text output.");
  }

  validateDefinitionText(text);
  return text;
}

export async function getOrCreateDefinition(series: IndicatorSeries): Promise<DefinitionResponse> {
  const cached = await getCachedDefinition(series.id);

  if (cached) {
    return cached;
  }

  if (process.env.ENABLE_LIVE_DEFINITION_GENERATION !== "true") {
    return {
      seriesId: series.id,
      content: `${series.plainLanguage} ${series.whyItMatters} ${series.sourceDetail}`,
      model: "deterministic-fallback",
      generatedAt: null,
      cached: false
    };
  }

  try {
    const content = await callOpenAIForDefinition(series);
    const generatedAt = new Date().toISOString();
    const response: DefinitionResponse = {
      seriesId: series.id,
      content,
      model: MODELS.definitions,
      generatedAt,
      cached: false
    };

    await cacheDefinition(response);
    return response;
  } catch (error) {
    console.error("Definition generation failed", {
      seriesId: series.id,
      message: error instanceof Error ? error.message : "Unknown definition generation error."
    });

    return {
      seriesId: series.id,
      content: `${series.plainLanguage} ${series.whyItMatters} ${series.sourceDetail}`,
      model: "deterministic-fallback",
      generatedAt: null,
      cached: false
    };
  }
}
