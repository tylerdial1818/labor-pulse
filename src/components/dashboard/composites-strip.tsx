import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/lib/utils/cn";

type CompositeSummary = {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  asOfDate: string;
  methodologyNote: string;
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
    <section aria-labelledby="composite-signals" className="border-b border-rule py-10">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="composite-signals" className="font-serif text-[30px] font-semibold tracking-[-0.01em] text-ink md:text-[36px]">
          Composite signals
        </h2>
        <p className="font-sans text-[13.5px] text-sub">Measures Labor Pulse calculates from public data</p>
      </div>
      <div className="grid md:grid-cols-3">
        {composites.map((composite, index) => (
          <Link
            key={composite.id}
            href={`/composites/${composite.id}` as Route}
            className={cn(
              "border-rule py-5 transition-colors hover:bg-[var(--lp-navy-tint)] md:px-7 md:py-1",
              index > 0 && "border-t md:border-l md:border-t-0",
              index === 0 && "md:pl-0",
              index === composites.length - 1 && "md:pr-0"
            )}
          >
            <h3 className="font-sans text-[14.5px] font-semibold leading-tight text-ink">{composite.name}</h3>
            <p className="mt-2 font-serif text-[56px] font-normal leading-[1.05] tracking-[-0.01em] text-ink md:text-[64px]">{composite.currentValue.toFixed(2)}</p>
            <p className={cn("font-sans text-[14px] font-semibold", colorClass[composite.interpretation.color])}>{composite.interpretation.label}</p>
            <p className="mt-2 font-sans text-[12px] leading-[1.4] text-sub">{composite.description}</p>
            <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.08em] text-sub">Calculated by Labor Pulse · As of {composite.asOfDate}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
