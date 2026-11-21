import "server-only";

import type { CompositeSnapshot } from "@/lib/questions/answers";
import { getDashboardData } from "@/server/dashboard-data";
import type { IndicatorCardViewModel, LaborDashboardData } from "@/server/labor-types";

type DashboardComposite = NonNullable<LaborDashboardData["composites"]>[number];

export type TopicData = {
  indicator: (id: string) => IndicatorCardViewModel | undefined;
  composite: (id: string) => (DashboardComposite & CompositeSnapshot) | undefined;
};

/** Indicator and composite lookups for the topic hubs, read from the same store as the dashboard. */
export async function getTopicData(): Promise<TopicData> {
  const data = await getDashboardData();
  const indicators = new Map(data.categories.flatMap((category) => category.indicators).map((indicator) => [indicator.id, indicator]));
  const composites = new Map((data.composites ?? []).map((composite) => [composite.id, composite]));

  return {
    indicator: (id) => indicators.get(id),
    composite: (id) => composites.get(id)
  };
}

export function compositeHistory(composite: DashboardComposite | undefined) {
  return (composite?.history ?? []).map((point) => ({ date: point.date, value: point.value }));
}
