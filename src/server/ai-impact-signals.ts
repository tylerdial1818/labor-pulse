import "server-only";

import { AI_SIGNALS, emptySignal, summarizeSignal, type SignalId, type SignalSummary } from "@/lib/ai-impact/signals";
import { createFredClient } from "@/lib/fred/client";

const ONE_DAY = 86_400;

/** Fetch every AI Impact signal from FRED. A failed series comes back as unavailable instead of failing the page. */
export async function getAiImpactSignals(): Promise<Record<SignalId, SignalSummary>> {
  let client: ReturnType<typeof createFredClient> | null = null;
  try {
    client = createFredClient({ revalidateSeconds: ONE_DAY });
  } catch {
    client = null;
  }

  const entries = await Promise.all(
    AI_SIGNALS.map(async (definition) => {
      if (!client) return [definition.id, emptySignal(definition)] as const;
      try {
        const observations = await client.getObservations(definition.seriesId, { observationStart: "2015-01-01" });
        return [definition.id, summarizeSignal(definition, observations)] as const;
      } catch (error) {
        console.error("AI Impact signal unavailable", { seriesId: definition.seriesId, message: error instanceof Error ? error.message : "unknown" });
        return [definition.id, emptySignal(definition)] as const;
      }
    })
  );

  return Object.fromEntries(entries) as Record<SignalId, SignalSummary>;
}
