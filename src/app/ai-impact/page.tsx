import type { Metadata } from "next";

import { ChainNav } from "@/components/ai-impact/chain-nav";
import { EvidenceColumns } from "@/components/ai-impact/evidence-columns";
import { ExposureLookup } from "@/components/ai-impact/exposure-lookup";
import { FeaturedResearchSection } from "@/components/ai-impact/featured-research";
import { formatSourceDate } from "@/components/ai-impact/format";
import { PaperCards } from "@/components/ai-impact/paper-cards";
import { ScorecardTable } from "@/components/ai-impact/scorecard-table";
import { ShortAnswer } from "@/components/ai-impact/short-answer";
import { SignalChart, SignalTile } from "@/components/ai-impact/signal-panel";
import { Term } from "@/components/glossary/term";
import { TopBar } from "@/components/layout/top-bar";
import { PageCitation } from "@/components/research/page-citation";
import { PageToc } from "@/components/underemployment/page-toc";
import { UnderemploymentSection as Section } from "@/components/underemployment/section";
import { AI_PAGE_SECTIONS, DISAGREEMENT_REASONS, EVIDENCE_NO_EFFECT, EVIDENCE_SLOWDOWN, FIRM_ADOPTION } from "@/lib/ai-impact/content";
import { ELOUNDOU_METHODOLOGY_NOTE } from "@/lib/ai-impact/eloundou";
import { exposureDistribution } from "@/lib/ai-impact/exposure";
import { getFeaturedResearch } from "@/lib/ai-impact/featured";
import { LANDMARK_PAPERS, SCORECARD } from "@/lib/ai-impact/papers";
import { RESEARCH_REPO_URL } from "@/lib/research/notes";
import { getExposureTable } from "@/server/ai-impact-exposure";
import { getAiImpactSignals } from "@/server/ai-impact-signals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What is AI doing to jobs? | AI Impact",
  description:
    "What the data and leading economists say about AI's effect on jobs and wages, with live adoption data, an occupation exposure lookup, and a scorecard of predictions."
};

const CURATION_GUIDE_URL = `${RESEARCH_REPO_URL}/blob/main/docs/curating-featured-research.md`;

export default async function AiImpactPage() {
  const [signals, exposure, featured] = await Promise.all([getAiImpactSignals(), getExposureTable(), getFeaturedResearch()]);
  const distribution = exposureDistribution(exposure.scores);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <header className="border-b-2 border-ink pb-7">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">AI Impact</p>
          <h1 className="mt-3 font-serif text-[clamp(36px,6vw,60px)] font-bold leading-none tracking-[-0.02em]">What is AI doing to jobs?</h1>
          <p className="mt-4 max-w-3xl font-serif text-[18px] italic leading-[1.45] text-sub">
            What the data shows so far, what leading economists predict, and how we can tell whether those predictions are coming true.
          </p>
        </header>

        <div className="mt-7 grid gap-6">
          <ShortAnswer />
          <ChainNav />
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-5 lg:self-start">
            <PageToc items={AI_PAGE_SECTIONS} />
          </aside>

          <article className="min-w-0">
            <Section
              id="employment"
              title="Is AI changing jobs yet?"
              description="Researchers agree there has been no broad wave of AI job losses. They disagree about an early warning sign: slower hiring of young workers in the jobs most exposed to AI."
            >
              <p className="mb-5 max-w-3xl font-serif text-[16px] leading-[1.55] text-ink">
                Most studies compare <Term id="ai-exposure">exposed</Term> occupations with less exposed ones before and after ChatGPT launched in late 2022, often
                focusing on <Term id="early-career-worker">early-career workers</Term> and the <Term id="job-finding-rate">job-finding rate</Term>. The findings
                below are quoted from each study.
              </p>
              <EvidenceColumns slowdown={EVIDENCE_SLOWDOWN} noEffect={EVIDENCE_NO_EFFECT} />
            </Section>

            <Section
              id="exposure"
              eyebrow="Step 1 · What AI can do"
              title="Which jobs are most exposed to AI?"
              description="Exposure measures how much of a job's work an AI language model could speed up. It is a measure of potential, not a forecast of job loss."
            >
              {exposure.complete ? (
                <p className="mb-4 max-w-3xl font-sans text-sm leading-[1.5] text-ink">
                  Of the {distribution.total} occupations scored, {distribution.high} are rated high exposure, {distribution.moderate} moderate and {distribution.low} low
                  (occupations are counted equally, not by how many people work in them).
                </p>
              ) : null}
              <ExposureLookup scores={exposure.scores} />
              <p className="mt-3 max-w-3xl font-sans text-xs leading-[1.5] text-sub">{ELOUNDOU_METHODOLOGY_NOTE}</p>
            </Section>

            <Section
              id="usage"
              eyebrow="Step 2 · Who uses it"
              title="Who is using AI?"
              description="Worker surveys and business surveys answer different questions, so their numbers differ. Both are shown here."
            >
              <div className="grid border-l border-t border-rule md:grid-cols-3">
                <SignalTile signal={signals.genai_work} />
                <SignalTile signal={signals.genai_any} />
                <article className="border-b border-r border-rule px-5 py-5">
                  <h3 className="font-serif text-lg font-semibold leading-tight">{FIRM_ADOPTION.label}</h3>
                  <p className="mt-4 font-serif text-4xl font-semibold leading-none">{FIRM_ADOPTION.value.toFixed(1)}%</p>
                  <p className="mt-2 font-sans text-xs text-sub">As of {formatSourceDate(FIRM_ADOPTION.asOf)}</p>
                  <p className="mt-2 font-sans text-xs leading-[1.35] text-sub">{FIRM_ADOPTION.caveat}</p>
                  <p className="mt-3 border-t border-hair pt-3 font-sans text-[10px] uppercase tracking-[0.08em] text-sub">
                    Source:{" "}
                    <a href={FIRM_ADOPTION.sourceUrl} className="font-bold normal-case tracking-normal text-navy hover:underline">
                      {FIRM_ADOPTION.sourceLabel}
                    </a>
                  </p>
                </article>
              </div>
              <SignalChart
                signal={signals.genai_work}
                title="Share of workers using generative AI for their job"
                description="Quarterly survey of employed adults aged 18 to 64. A single quarter can move with sampling noise; look at the trend."
              />
            </Section>

            <Section
              id="tasks"
              eyebrow="Step 3 · Which tasks change"
              title="Is AI replacing tasks or helping with them?"
              description="The same tool can do a task for someone or help them do it better. Which one happens matters more for jobs than how often AI is used."
            >
              <div className="grid max-w-3xl gap-4 font-serif text-[16px] leading-[1.55] text-ink">
                <p>
                  Researchers separate <Term id="augmentation-vs-automation">automation from augmentation</Term>. Stanford&apos;s August 2026 update finds employment declines
                  for young workers concentrated where AI use automates tasks, while employment is flat or rising where use is more complementary. Anthropic&apos;s{" "}
                  <Term id="observed-exposure">observed exposure</Term> measure counts only the tasks people already use AI for, weighting automated uses more.
                </p>
                <p>
                  Two landmark papers frame this step: <a href="#paper-brynjolfsson-li-raymond" className="text-navy hover:underline">Brynjolfsson, Li and Raymond</a> on who gains
                  inside a job, and <a href="#paper-autor-thompson" className="text-navy hover:underline">Autor and Thompson</a> on why the type of task AI takes over decides what
                  happens to wages.
                </p>
              </div>
            </Section>

            <Section
              id="economy"
              eyebrow="Steps 4 and 5 · Jobs, wages and the economy"
              title="Is AI showing up in productivity and pay?"
              description="If AI makes work more productive, output per hour should rise. Who gets the gains shows up in workers' share of income."
            >
              <div className="grid border-l border-t border-rule md:grid-cols-2">
                <SignalTile signal={signals.productivity} />
                <SignalTile signal={signals.labor_share} />
              </div>
              <p className="mt-4 max-w-3xl font-sans text-sm leading-[1.5] text-ink">
                Both series move with the business cycle for many reasons besides AI. They are early-warning gauges for two predictions on this page: Acemoglu&apos;s modest{" "}
                <Term id="total-factor-productivity">productivity</Term> gains and Korinek and Suh&apos;s risk to the <Term id="labor-share">labor share</Term>.
              </p>
            </Section>

            <Section
              id="predictions"
              title="What leading economists predict"
              description="Five papers that shape how economists think about AI and work, each making a claim about a different step. Open a card to see its assumptions."
            >
              <PaperCards papers={LANDMARK_PAPERS} />
            </Section>

            <Section
              id="scorecard"
              title="Are the predictions coming true?"
              description="Each prediction, the evidence that tests it, and our current read. Statuses are editorial judgments, reviewed when new data or studies arrive."
            >
              <ScorecardTable rows={SCORECARD} signals={signals} />
            </Section>

            <Section id="disagree" title="Why do studies disagree?" description="Most of the disagreement comes down to four choices researchers make.">
              <div className="grid gap-4 md:grid-cols-2">
                {DISAGREEMENT_REASONS.map((reason) => (
                  <article key={reason.title} className="border border-rule p-4">
                    <h3 className="font-serif text-[19px] font-semibold">{reason.title}</h3>
                    <p className="mt-2 font-serif text-[15px] leading-[1.5] text-ink">{reason.body}</p>
                  </article>
                ))}
              </div>
            </Section>

            <Section id="latest" title="Latest research" description="New studies and trackers worth reading, refreshed monthly. Older picks move to the library.">
              <FeaturedResearchSection featured={featured} curationUrl={CURATION_GUIDE_URL} />
            </Section>

            <Section id="methods" title="Methods and limits">
              <ul className="grid max-w-3xl list-disc gap-2 pl-5 font-sans text-sm leading-[1.55] text-ink">
                <li>Exposure scores are potential, not adoption. A high score does not mean a job is disappearing.</li>
                <li>Live readings come from FRED and refresh daily. Study findings are quoted from the linked source and dated.</li>
                <li>
                  Almost every study here is descriptive: it shows patterns, not proof that AI caused them. Methods such as <Term id="difference-in-differences">difference-in-differences</Term>{" "}
                  get closer to cause and effect but rely on assumptions about what would have happened without AI.
                </li>
                <li>Scorecard statuses are judgments. Each records its reasoning and review date.</li>
              </ul>
            </Section>

            <PageCitation title="What is AI doing to jobs?" path="/ai-impact" source="Labor Pulse Research" publishedAt="2026-11-21" className="mt-8" />
          </article>
        </div>
      </main>
    </div>
  );
}
