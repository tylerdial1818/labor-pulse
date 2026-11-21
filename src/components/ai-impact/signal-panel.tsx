import { HeadlineTrendChart } from "@/components/underemployment/headline-trend-chart";
import { quarterLabel, type SignalSummary } from "@/lib/ai-impact/signals";

import { formatPercent, formatSignedPercent, formatSignedPoints } from "./format";

function headlineText(signal: SignalSummary) {
  if (!signal.available || signal.headline === null) return "not available";
  return signal.definition.measure === "index_growth" ? formatSignedPercent(signal.headline) : formatPercent(signal.headline);
}

export function SignalTile({ signal }: { signal: SignalSummary }) {
  const change = signal.headline !== null && signal.yearAgoHeadline !== null ? signal.headline - signal.yearAgoHeadline : null;
  return (
    <article className="border-b border-r border-rule px-5 py-5">
      <h3 className="font-serif text-lg font-semibold leading-tight">{signal.definition.title}</h3>
      <p className="mt-4 font-serif text-4xl font-semibold leading-none">{headlineText(signal)}</p>
      {signal.available ? (
        <p className="mt-2 font-sans text-xs text-sub">
          {signal.periodLabel}
          {change !== null ? ` · ${formatSignedPoints(change)} vs a year earlier` : ""}
        </p>
      ) : (
        <p className="mt-2 font-sans text-xs text-sub">The live series could not be loaded. See the source link.</p>
      )}
      <p className="mt-2 font-sans text-xs leading-[1.35] text-sub">{signal.definition.description}</p>
      <p className="mt-3 border-t border-hair pt-3 font-sans text-[10px] uppercase tracking-[0.08em] text-sub">
        Source:{" "}
        <a href={signal.sourceUrl} className="font-bold normal-case tracking-normal text-navy hover:underline">
          {signal.definition.sourceLabel}
        </a>
      </p>
    </article>
  );
}

export function SignalChart({ signal, title, description }: { signal: SignalSummary; title: string; description?: string }) {
  if (!signal.available) return null;
  return (
    <HeadlineTrendChart
      title={title}
      description={description}
      data={signal.points.map((point) => ({ date: point.date, value: point.value, label: quarterLabel(point.date) }))}
      source={signal.definition.sourceLabel}
      sourceHref={signal.sourceUrl}
      asOf={signal.periodLabel ?? ""}
      valueLabel={signal.definition.title}
      unit="%"
      height={280}
    />
  );
}
