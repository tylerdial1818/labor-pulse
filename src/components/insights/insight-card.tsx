import type { InsightSummary } from "@/types/v15";
import { normalizePublicCopy } from "@/lib/utils/public-copy";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function InsightCard({ insight }: { insight: InsightSummary }) {
  return (
    <article className="border-b border-rule py-5">
      <div className="flex flex-wrap items-center gap-2 font-sans text-[10.5px] font-bold uppercase tracking-[0.12em] text-sub">
        <span>{insight.sourceName}</span>
        <span aria-hidden="true">/</span>
        <time dateTime={insight.publishedAt}>{formatDate(insight.publishedAt)}</time>
      </div>
      <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-ink">
        <a href={insight.sourceUrl} className="hover:text-navy hover:underline">
          {insight.title}
        </a>
      </h2>
      <p className="mt-3 max-w-4xl font-serif text-[15.5px] leading-[1.55] text-ink">{normalizePublicCopy(insight.summary)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="border border-navy px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.10em] text-navy">
          {insight.category.replace("_", " ")}
        </span>
        {insight.tags.map((tag) => (
          <span key={tag} className="border border-rule px-2 py-1 font-sans text-[10px] uppercase tracking-[0.08em] text-sub">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
