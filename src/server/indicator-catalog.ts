import { getIndicatorById, indicatorCatalog } from "@/lib/indicators/catalog";
import type { IndicatorCategory, IndicatorMetadata } from "@/server/labor-types";

export const INDICATOR_CATALOG: IndicatorMetadata[] = indicatorCatalog.map((indicator) => ({
  id: indicator.id,
  title: indicator.title,
  shortTitle: indicator.shortTitle,
  category: indicator.category,
  source: indicator.source,
  sourceUrl: indicator.sourceUrl,
  units: indicator.units,
  unitLabel: indicator.display.unitLabel,
  frequency: indicator.frequency,
  seasonalAdjustment: indicator.seasonalAdjustment ?? null,
  isProxy: indicator.isProxy,
  methodologyNote: indicator.methodologyNote,
  stateSeriesPattern: "stateSeriesPattern" in indicator ? indicator.stateSeriesPattern ?? null : null
}));

export const CATEGORY_LABELS: Record<IndicatorCategory, { label: string; blurb: string }> = {
  lagging: {
    label: "Lagging",
    blurb: "Where the labor market is now - confirmed, slower-moving signals."
  },
  leading: {
    label: "Leading",
    blurb: "Where it may be heading - signals that tend to turn first."
  },
  tech_impact: {
    label: "Tech & AI Impact",
    blurb: "Sectors most exposed to AI, plus a direct Claude-usage signal."
  }
};

export function getCatalogIndicator(id: string): IndicatorMetadata | null {
  const indicator = getIndicatorById(id);

  if (!indicator) {
    return null;
  }

  return {
    id: indicator.id,
    title: indicator.title,
    shortTitle: indicator.shortTitle,
    category: indicator.category,
    source: indicator.source,
    sourceUrl: indicator.sourceUrl,
    units: indicator.units,
    unitLabel: indicator.display.unitLabel,
    frequency: indicator.frequency,
    seasonalAdjustment: indicator.seasonalAdjustment ?? null,
    isProxy: indicator.isProxy,
    methodologyNote: indicator.methodologyNote,
    stateSeriesPattern: "stateSeriesPattern" in indicator ? indicator.stateSeriesPattern ?? null : null
  };
}

export function getFredIndicators() {
  return INDICATOR_CATALOG.filter((indicator) => indicator.source === "FRED");
}
