import type { HistoricalContext as HistoricalContextValue } from "@/types/v15";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00.000Z`));
}

export function HistoricalContext({ context }: { context: HistoricalContextValue | null }) {
  if (!context) return null;

  return (
    <section className="border-y border-rule py-5" aria-labelledby="historical-context">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Historical context</p>
          <h2 id="historical-context" className="mt-1 font-serif text-2xl font-semibold text-ink">
            {context.percentileRank}th percentile
          </h2>
          <p className="mt-2 max-w-3xl font-serif text-[15px] leading-[1.5] text-ink">{context.interpretation}</p>
        </div>
        <div className="min-w-[220px] font-sans text-sm">
          <div className="h-2 w-full border border-rule bg-paper">
            <div className="h-full bg-navy" style={{ width: `${Math.min(Math.max(context.percentileRank, 0), 100)}%` }} />
          </div>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-sub">History</dt>
              <dd className="font-semibold text-ink">{context.yearsOfHistory} years</dd>
            </div>
            {context.comparablePeriod ? (
              <div className="flex justify-between gap-4">
                <dt className="text-sub">Last comparable</dt>
                <dd className="font-semibold text-ink">{formatDate(context.comparablePeriod.date)}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </section>
  );
}
