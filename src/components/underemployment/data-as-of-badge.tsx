export type DataAsOfBadgeProps = {
  source: string;
  asOf: string;
  label?: string;
  href?: string;
  className?: string;
};

export function DataAsOfBadge({ source, asOf, label = "Data", href, className = "" }: DataAsOfBadgeProps) {
  const sourceContent = href ? (
    <a className="font-semibold text-navy underline-offset-4 hover:underline" href={href}>
      {source}
    </a>
  ) : (
    <span className="font-semibold text-ink">{source}</span>
  );

  return (
    <p className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 border border-rule bg-[var(--lp-navy-tint)] px-2.5 py-1.5 font-sans text-[11px] leading-tight text-sub ${className}`}>
      <span className="font-bold uppercase tracking-[0.12em] text-navy">{label}</span>
      <span>Source: {sourceContent}</span>
      <span aria-hidden="true">|</span>
      <span>As of: {asOf}</span>
    </p>
  );
}
