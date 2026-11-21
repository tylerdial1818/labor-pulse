import { LANDMARK_PAPERS, SCORECARD_STATUS_LABELS, type ScorecardRow, type ScorecardStatus } from "@/lib/ai-impact/papers";
import type { SignalId, SignalSummary } from "@/lib/ai-impact/signals";

import { formatSignedPercent, formatSourceDate } from "./format";

const STATUS_STYLE: Record<ScorecardStatus, string> = {
  too_early: "border-rule text-sub",
  tracking: "border-navy text-navy",
  tension: "border-ink text-ink"
};

// The status label is always printed as text, so meaning never depends on the border color alone.
function StatusBadge({ status }: { status: ScorecardStatus }) {
  return <span className={`inline-block border px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.08em] ${STATUS_STYLE[status]}`}>{SCORECARD_STATUS_LABELS[status]}</span>;
}

function Reading({ row, signals }: { row: ScorecardRow; signals: Record<SignalId, SignalSummary> }) {
  if (row.signalId) {
    const signal = signals[row.signalId];
    return signal?.available ? (
      <p>
        {formatSignedPercent(signal.headline)} over the four quarters to {signal.periodLabel}.{" "}
        <a href={signal.sourceUrl} className="text-navy hover:underline">
          {signal.definition.sourceLabel}
        </a>
      </p>
    ) : (
      <p className="text-sub">Live reading unavailable right now.</p>
    );
  }
  if (row.evidence) {
    return (
      <p>
        {row.evidence.text}{" "}
        <a href={row.evidence.url} className="text-navy hover:underline">
          {row.evidence.sourceLabel}
        </a>
      </p>
    );
  }
  return null;
}

export function ScorecardTable({ rows, signals }: { rows: ScorecardRow[]; signals: Record<SignalId, SignalSummary> }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse font-sans text-sm">
        <caption className="sr-only">Predictions from landmark papers, the indicator that tests each one, and the current status</caption>
        <thead>
          <tr className="border-b-2 border-ink text-left text-[10px] uppercase tracking-[0.14em] text-sub">
            <th scope="col" className="py-2 pr-4">Prediction</th>
            <th scope="col" className="py-2 pr-4">What we check</th>
            <th scope="col" className="py-2 pr-4">Latest reading</th>
            <th scope="col" className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const paper = LANDMARK_PAPERS.find((item) => item.id === row.paperId);
            return (
              <tr key={row.paperId} className="border-b border-rule align-top">
                <td className="py-3 pr-4">
                  <p className="font-serif text-[15px] font-semibold leading-snug text-ink">{row.prediction}</p>
                  {paper ? (
                    <a href={`#paper-${paper.id}`} className="mt-1 inline-block text-xs text-navy hover:underline">
                      {paper.authors}
                    </a>
                  ) : null}
                </td>
                <td className="py-3 pr-4 text-ink">{row.indicator}</td>
                <td className="max-w-sm py-3 pr-4 leading-[1.45] text-ink">
                  <Reading row={row} signals={signals} />
                </td>
                <td className="py-3">
                  <StatusBadge status={row.status} />
                  <p className="mt-2 max-w-xs text-xs leading-[1.45] text-sub">{row.reasoning}</p>
                  <p className="mt-1 text-[11px] text-sub">Reviewed {formatSourceDate(row.reviewed)}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
