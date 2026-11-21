import type { EvidenceStudy } from "@/lib/ai-impact/content";

import { formatSourceDate } from "./format";

function StudyCard({ study }: { study: EvidenceStudy }) {
  return (
    <article className="border-b border-hair py-4">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-sub">
        {study.publisher} · {formatSourceDate(study.date)}
      </p>
      <h4 className="mt-1 font-serif text-[17px] font-semibold leading-tight">
        <a href={study.url} className="text-ink hover:text-navy hover:underline">
          {study.title}
        </a>
      </h4>
      <p className="mt-1 font-sans text-xs text-sub">{study.authors}</p>
      <p className="mt-2 font-serif text-[15px] leading-[1.5] text-ink">{study.finding}</p>
      <p className="mt-2 font-sans text-[11px] text-sub">
        Data: {study.dataSource} ({study.dataPublic ? "public" : "not public"})
      </p>
    </article>
  );
}

export function EvidenceColumns({ slowdown, noEffect }: { slowdown: EvidenceStudy[]; noEffect: EvidenceStudy[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h3 className="border-b-2 border-ink pb-2 font-serif text-[20px] font-semibold">Finding an early hiring slowdown</h3>
        {slowdown.map((study) => (
          <StudyCard key={study.id} study={study} />
        ))}
      </div>
      <div>
        <h3 className="border-b-2 border-ink pb-2 font-serif text-[20px] font-semibold">Finding no clear effect yet</h3>
        {noEffect.map((study) => (
          <StudyCard key={study.id} study={study} />
        ))}
      </div>
    </div>
  );
}
