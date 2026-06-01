import "server-only";

import type { InsightSummary, RawInsight } from "@/lib/insights/types";

const FALLBACK_TAKEAWAY_COUNT = 2;

function sentenceSplit(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40 && sentence.length < 320);
}

function deterministicSummary(raw: RawInsight): Pick<InsightSummary, "summary" | "keyTakeaways"> {
  const sentences = sentenceSplit(raw.contentText);
  const summary =
    sentences.slice(0, 2).join(" ") ||
    `${raw.sourceName} is tracked for qualitative labor market context related to ${raw.tags.slice(0, 3).join(", ")}.`;
  const takeaways = sentences.slice(2, 2 + FALLBACK_TAKEAWAY_COUNT);

  while (takeaways.length < FALLBACK_TAKEAWAY_COUNT) {
    const nextTag = raw.tags[takeaways.length] ?? "labor market context";
    takeaways.push(`Monitor ${nextTag.replace(/_/g, " ")} signals from ${raw.sourceName}.`);
  }

  return {
    summary,
    keyTakeaways: takeaways
  };
}

function coerceOpenAiSummary(value: unknown): Pick<InsightSummary, "summary" | "keyTakeaways"> | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const summary = typeof record.summary === "string" ? record.summary.trim() : "";
  const keyTakeaways = Array.isArray(record.keyTakeaways)
    ? record.keyTakeaways.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 3)
    : [];

  if (!summary || keyTakeaways.length === 0) {
    return null;
  }

  return { summary, keyTakeaways };
}

async function openAiSummary(raw: RawInsight): Promise<Pick<InsightSummary, "summary" | "keyTakeaways"> | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL_INSIGHTS ?? "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "Summarize public labor-market source text for an executive research dashboard. Keep it qualitative. Do not invent statistics, forecasts, or claims not present in the source. Return only JSON."
        },
        {
          role: "user",
          content: JSON.stringify({
            source: raw.sourceName,
            title: raw.title,
            tags: raw.tags,
            text: raw.contentText.slice(0, 4500),
            schema: { summary: "one concise paragraph", keyTakeaways: ["2-3 concise qualitative bullets"] }
          })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "insight_summary",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              keyTakeaways: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 }
            },
            required: ["summary", "keyTakeaways"]
          }
        }
      }
    })
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { output_text?: string };
  const outputText = data.output_text;
  if (!outputText) return null;

  try {
    return coerceOpenAiSummary(JSON.parse(outputText));
  } catch {
    return null;
  }
}

export async function summarizeRawInsight(raw: RawInsight): Promise<InsightSummary> {
  const generated = (await openAiSummary(raw)) ?? deterministicSummary(raw);

  return {
    id: raw.id,
    sourceId: raw.sourceId,
    sourceName: raw.sourceName,
    category: raw.category,
    title: raw.title,
    url: raw.url,
    publishedAt: raw.publishedAt,
    updatedAt: raw.fetchedAt,
    tags: raw.tags,
    summary: generated.summary,
    keyTakeaways: generated.keyTakeaways,
    sourceType: "live"
  };
}
