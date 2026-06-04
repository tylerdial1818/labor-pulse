import { DataAsOfBadge } from "./data-as-of-badge";

export type AnalyticalInterpretationCalloutProps = {
  title: string;
  interpretation: string;
  eyebrow?: string;
  caveats?: string[];
  source?: string;
  asOf?: string;
  sourceHref?: string;
  className?: string;
};

export function AnalyticalInterpretationCallout({
  title,
  interpretation,
  eyebrow = "Analytical interpretation",
  caveats = [],
  source,
  asOf,
  sourceHref,
  className = ""
}: AnalyticalInterpretationCalloutProps) {
  return (
    <aside className={`border border-rule bg-[var(--lp-navy-tint)] px-5 py-4 ${className}`} aria-labelledby={`${slugify(title)}-callout`}>
      <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">{eyebrow}</p>
      <h3 id={`${slugify(title)}-callout`} className="mt-2 font-serif text-[24px] font-semibold leading-tight text-ink">
        {title}
      </h3>
      <p className="mt-2 font-serif text-[16px] leading-[1.5] text-ink">{interpretation}</p>
      {caveats.length > 0 ? (
        <ul className="mt-3 grid gap-2 font-sans text-xs leading-[1.45] text-sub">
          {caveats.map((caveat) => (
            <li key={caveat} className="border-l border-rule pl-3">
              {caveat}
            </li>
          ))}
        </ul>
      ) : null}
      {source && asOf ? <DataAsOfBadge className="mt-4" source={source} asOf={asOf} href={sourceHref} label="Context" /> : null}
    </aside>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
