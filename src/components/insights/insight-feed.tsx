import { ExternalLink } from "lucide-react";

import type { InsightSummary } from "@/lib/insights/types";

type InsightFeedProps = {
  insights: InsightSummary[];
};

function formatDate(value: string | null) {
  if (!value) return "date unavailable";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(value)
  );
}

function sourceTypeLabel(sourceType: InsightSummary["sourceType"]) {
  if (sourceType === "live") return "Live";
  if (sourceType === "manual") return "Manual";
  return "Seed";
}

export function InsightFeed({ insights }: InsightFeedProps) {
  if (insights.length === 0) {
    return (
      <section className="border-y border-rule py-10 text-center" aria-label="No insights">
        <h2 className="font-serif text-2xl font-semibold">No matching insights</h2>
        <p className="mt-2 text-sm text-sub">Adjust the category, tag, or date filters.</p>
      </section>
    );
  }

  return (
    <section className="divide-y divide-rule border-y border-rule" aria-label="Qualitative insights">
      {insights.map((insight) => (
        <article key={insight.id} className="grid gap-5 py-6 md:grid-cols-[220px_1fr]">
          <div className="text-sm text-sub">
            <p className="font-semibold text-navy">{insight.sourceName}</p>
            <p className="mt-1">{formatDate(insight.publishedAt ?? insight.updatedAt)}</p>
            <p className="mt-3 inline-flex rounded-badge bg-faint px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink">
              {sourceTypeLabel(insight.sourceType)}
            </p>
          </div>
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold leading-tight text-ink">{insight.title}</h2>
              <a
                href={insight.url}
                className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-rule text-navy"
                aria-label={`Open ${insight.sourceName}`}
              >
                <ExternalLink aria-hidden="true" size={16} />
              </a>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-ink">{insight.summary}</p>
            <ul className="mt-4 grid gap-2 text-sm text-sub">
              {insight.keyTakeaways.map((takeaway) => (
                <li key={takeaway} className="border-l-2 border-navy pl-3">
                  {takeaway}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {insight.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="rounded-badge bg-faint px-2.5 py-1 text-xs font-semibold text-sub">
                  {tag.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
