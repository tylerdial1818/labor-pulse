import type { FeaturedItem, FeaturedResearch } from "@/lib/ai-impact/featured";

import { formatSourceDate } from "./format";

function FeaturedCard({ item }: { item: FeaturedItem }) {
  return (
    <article className="border border-rule p-4">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-sub">
        {item.publisher} · {formatSourceDate(item.published)}
      </p>
      <h3 className="mt-2 font-serif text-lg font-semibold leading-tight">
        <a href={item.url} className="text-ink hover:text-navy hover:underline">
          {item.title}
        </a>
      </h3>
      <p className="mt-1 font-sans text-xs text-sub">{item.authors}</p>
      <p className="mt-2 font-serif text-sm leading-[1.5] text-ink">{item.summary}</p>
      <p className="mt-2 font-sans text-[11px] text-sub">Data: {item.data_access === "public" ? "public" : "not public"}</p>
    </article>
  );
}

export function FeaturedResearchSection({ featured, curationUrl }: { featured: FeaturedResearch; curationUrl: string }) {
  if (!featured.available) {
    return <p className="font-sans text-sm text-sub">The featured research list could not be loaded right now.</p>;
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {featured.active.map((item) => (
          <FeaturedCard key={item.id} item={item} />
        ))}
      </div>
      {featured.active.length === 0 ? <p className="font-sans text-sm text-sub">No research is featured this month. See the library below.</p> : null}
      <p className="mt-3 font-sans text-[11px] text-sub">
        Curated monthly from open research feeds{featured.updated ? `; last updated ${formatSourceDate(featured.updated)}` : ""}.{" "}
        <a href={curationUrl} className="text-navy hover:underline">
          How we pick these
        </a>
      </p>
      {featured.library.length > 0 ? (
        <details className="mt-5 border-t border-rule pt-4">
          <summary className="cursor-pointer font-sans text-xs font-bold uppercase tracking-[0.12em] text-sub">Research library ({featured.library.length})</summary>
          <ul className="mt-3 grid gap-2">
            {featured.library.map((item) => (
              <li key={item.id} className="font-sans text-sm">
                <a href={item.url} className="font-semibold text-navy hover:underline">
                  {item.title}
                </a>{" "}
                <span className="text-sub">
                  · {item.publisher}, {formatSourceDate(item.published)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
