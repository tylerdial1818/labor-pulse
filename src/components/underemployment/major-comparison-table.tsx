export type MajorComparisonRow = {
  major: string;
  underemploymentRate: string;
  medianWage?: string;
  wagePremium?: string;
  rank?: number;
  group?: string;
  sampleNote?: string;
};

export type MajorComparisonTableProps = {
  title: string;
  rows: MajorComparisonRow[];
  source: string;
  asOf: string;
  caption?: string;
  className?: string;
};

export function MajorComparisonTable({ title, rows, source, asOf, caption, className = "" }: MajorComparisonTableProps) {
  return (
    <div className={`border-y border-rule py-5 ${className}`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-serif text-[24px] font-semibold leading-tight text-ink">{title}</h3>
          {caption ? <p className="mt-1 font-sans text-xs leading-[1.45] text-sub">{caption}</p> : null}
        </div>
        <p className="font-sans text-[11px] text-sub">
          Source: <span className="font-semibold text-ink">{source}</span> | As of: {asOf}
        </p>
      </div>
      <div className="overflow-x-auto border-l border-t border-rule">
        <table className="min-w-full border-collapse font-sans text-sm">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="bg-[var(--lp-navy-tint)] text-left text-[10px] uppercase tracking-[0.12em] text-sub">
              <th className="border-b border-r border-rule px-3 py-3" scope="col">Major</th>
              <th className="border-b border-r border-rule px-3 py-3" scope="col">Rank</th>
              <th className="border-b border-r border-rule px-3 py-3" scope="col">Underemployment</th>
              <th className="border-b border-r border-rule px-3 py-3" scope="col">Median wage</th>
              <th className="border-b border-r border-rule px-3 py-3" scope="col">Wage premium</th>
              <th className="border-b border-r border-rule px-3 py-3" scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.major}-${row.rank ?? "unranked"}`}>
                <th className="border-b border-r border-rule px-3 py-3 text-left" scope="row">
                  <span className="block font-semibold text-ink">{row.major}</span>
                  {row.group ? <span className="mt-1 block text-[11px] font-normal text-sub">{row.group}</span> : null}
                </th>
                <td className="border-b border-r border-rule px-3 py-3 text-sub">{row.rank ?? "not ranked"}</td>
                <td className="border-b border-r border-rule px-3 py-3 font-semibold text-ink">{row.underemploymentRate}</td>
                <td className="border-b border-r border-rule px-3 py-3">{row.medianWage ?? "not available"}</td>
                <td className="border-b border-r border-rule px-3 py-3">{row.wagePremium ?? "not available"}</td>
                <td className="border-b border-r border-rule px-3 py-3 text-sub">{row.sampleNote ?? "No note provided"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
