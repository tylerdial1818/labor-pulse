import Link from "next/link";
import type { Route } from "next";

type CompositeSummary = {
  id: string;
  name: string;
  currentValue: number;
  asOfDate: string;
  interpretation: {
    label: string;
    color: "green" | "yellow" | "orange" | "red" | "gray";
  };
};

const colorClass = {
  green: "text-up",
  yellow: "text-navy",
  orange: "text-navy",
  red: "text-down",
  gray: "text-sub"
} as const;

export function CompositesStrip({ composites }: { composites: CompositeSummary[] }) {
  if (composites.length === 0) return null;

  return (
    <section aria-labelledby="composite-signals" className="mb-7 border-y border-rule py-4">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 id="composite-signals" className="font-serif text-xl font-semibold text-ink">
            Composite Signals
          </h2>
          <p className="mt-1 font-sans text-xs text-sub">Calculated by Labor Pulse from source observations.</p>
        </div>
      </div>
      <div className="grid border-l border-t border-rule md:grid-cols-3">
        {composites.map((composite) => (
          <Link
            key={composite.id}
            href={`/composites/${composite.id}` as Route}
            className="border-b border-r border-rule bg-paper px-4 py-4 transition-colors hover:bg-[var(--lp-navy-tint)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-[16px] font-semibold leading-tight text-ink">{composite.name}</h3>
              <span className={`font-sans text-[10px] font-bold uppercase tracking-[0.12em] ${colorClass[composite.interpretation.color]}`}>
                {composite.interpretation.label}
              </span>
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold leading-none text-ink">{composite.currentValue.toFixed(2)}</p>
            <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.08em] text-sub">As of {composite.asOfDate}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
