/** Home-only masthead: centered wordmark, the page's single H1, and the service introduction. */
export function HomeMasthead({ indicatorCount, refreshedLabel }: { indicatorCount: number; refreshedLabel: string | null }) {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-6 pt-8 text-center sm:px-6 md:pb-7 md:pt-10 lg:px-8">
      <p className="font-serif text-[44px] font-semibold leading-none tracking-[-0.025em] text-ink md:text-[64px] lg:text-[76px]">Labor Pulse</p>
      <h1 id="service-introduction" className="mt-3 font-serif text-[19px] font-normal italic leading-tight text-sub md:text-[21px]">
        U.S. Labor Market Monitor
      </h1>
      <p className="mx-auto mt-4 max-w-2xl font-serif text-base leading-[1.45] text-ink">
        Clear answers to questions about jobs, wages, education, and AI, built from official data. Labor Pulse is a continuously maintained public research service: every number links to its source, and the full indicator dashboard and methods are here for researchers.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-sub">
        <span>{indicatorCount} core indicators</span>
        <span aria-hidden="true">·</span>
        <span>U.S. national coverage</span>
        <span aria-hidden="true">·</span>
        {refreshedLabel ? (
          <span>Latest refresh {refreshedLabel}</span>
        ) : (
          <a className="text-navy hover:underline" href="/sources">
            Refresh status in Data & Methods
          </a>
        )}
      </div>
    </div>
  );
}
