import { Suspense } from "react";
import type { Metadata } from "next";

import { AnalyticalInterpretationCallout } from "@/components/underemployment/analytical-interpretation-callout";
import { DataAsOfBadge } from "@/components/underemployment/data-as-of-badge";
import { DefinitionalOverlapChart } from "@/components/underemployment/definitional-overlap-chart";
import { LimitationsSection } from "@/components/underemployment/limitations-section";
import { MajorComparisonTable } from "@/components/underemployment/major-comparison-table";
import { MajorLookupTool } from "@/components/underemployment/major-lookup-tool";
import { MajorRankingChart } from "@/components/underemployment/major-ranking-chart";
import { MethodologySection } from "@/components/underemployment/methodology-section";
import { PageToc } from "@/components/underemployment/page-toc";
import { TrajectoryChart } from "@/components/underemployment/trajectory-chart";
import { UnderemploymentSection } from "@/components/underemployment/section";
import { WagePremiumScatter } from "@/components/underemployment/wage-premium-scatter";
import { TopBar } from "@/components/layout/top-bar";
import { PageCitation } from "@/components/research/page-citation";
import { getUnderemploymentPageData } from "@/lib/underemployment/calculate";
import { definitionBlocks, underemploymentSections } from "@/lib/underemployment/prose";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Underemployment Analytics",
  description: "A Labor Pulse analytical guide to underemployment definitions, NY Fed recent graduate outcomes, and major-level labor market risk."
};

const source = "NY Fed Recent College Graduates";
const sourceHref = "https://www.newyorkfed.org/research/college-labor-market";

function percent(value: number) {
  return `${value.toFixed(1)} percent`;
}

function money(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default async function UnderemploymentPage() {
  const data = await getUnderemploymentPageData();
  const averageWageGap =
    data.majorRanking.reduce((sum, major) => sum + major.wagePremium, 0) / Math.max(data.majorRanking.length, 1);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Underemployment Analytics",
    datePublished: "2026-06-04",
    dateModified: "2026-07-17",
    author: { "@type": "Organization", name: "Labor Pulse Research" },
    publisher: { "@type": "Organization", name: "Dialed Intelligence LLC", url: "https://www.dialedintelligence.com/" }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <header className="border-b-2 border-ink pb-7">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-4xl">
              <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Labor Pulse special analysis</p>
              <h1 className="mt-3 font-serif text-[clamp(38px,7vw,68px)] font-bold leading-none tracking-[-0.02em] text-ink">
                Underemployment Analytics
              </h1>
              <p className="mt-4 max-w-3xl font-serif text-[18px] italic leading-[1.45] text-sub">
                A long-form analytical guide to contested definitions, recent graduate outcomes, and the majors where labor market fit is most fragile.
              </p>
              <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-sub">
                Labor Pulse Research · Published June 4, 2026 · Updated July 17, 2026
              </p>
            </div>
            <DataAsOfBadge source={source} asOf={data.headline.asOfDate} href={sourceHref} />
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-5 lg:self-start">
            <PageToc items={underemploymentSections.map((section) => ({ id: section.id, label: section.label }))} />
            <a href="#top" className="mt-4 hidden border border-rule px-3 py-2 font-sans text-xs font-semibold text-navy lg:inline-block">
              Back to top
            </a>
          </aside>

          <article id="top" className="min-w-0">
            <UnderemploymentSection id="introduction" title="Introduction and framing">
              <div className="grid gap-4 font-serif text-[17px] leading-[1.58] text-ink">
                <p>
                  Underemployment is one of the most cited and least carefully defined concepts in workforce policy. The headline numbers vary by a factor of three or more depending on which definition is used. A worker counted as underemployed under one framework is counted as fully employed under another. This page treats the disagreement as the starting point.
                </p>
                <p>
                  Three definitions dominate the labor market literature. Each measures something real. Each misses something important. Sorting out what they mean, and where they overlap, is the first step toward using the data well.
                </p>
              </div>
            </UnderemploymentSection>

            <UnderemploymentSection id="definitions" title="The three definitions">
              <div className="grid gap-4 md:grid-cols-3">
                {definitionBlocks.map((definition) => (
                  <article key={definition.name} className="border border-rule p-4">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-sub">{definition.source}</p>
                    <h3 className="mt-2 font-serif text-[21px] font-semibold text-ink">{definition.name}</h3>
                    <p className="mt-2 font-serif text-[15px] leading-[1.5] text-ink">{definition.body}</p>
                  </article>
                ))}
              </div>
            </UnderemploymentSection>

            <UnderemploymentSection id="relationship" title="How the definitions relate">
              <p className="font-serif text-[17px] leading-[1.58] text-ink">
                The three definitions measure overlapping but distinct populations. A barista with a philosophy degree working 40 hours a week is underemployed by the skills definition and not by the hours or part-time definitions. A nurse working 24 hours a week who wants 40 is underemployed by the part-time and hours definitions but not by the skills definition. The populations cannot be added together. They cannot be averaged. Each answers a different question.
              </p>
              <DefinitionalOverlapChart
                className="mt-6"
                title="Definitions are adjacent, not additive"
                data={[
                  {
                    label: "Involuntary part-time",
                    value: data.definitionalOverlap.involuntaryPartTime,
                    definition: "Workers in part-time jobs who want full-time work.",
                    includedInHeadline: false
                  },
                  {
                    label: "Skills underemployment",
                    value: data.definitionalOverlap.skillsUnderemployment,
                    definition: "College graduates in occupations classified as non-college jobs.",
                    includedInHeadline: true
                  },
                  {
                    label: "Hours pressure",
                    value: data.definitionalOverlap.hoursUnderemployment,
                    definition: "Average weekly hours proxy for pressure below desired work hours.",
                    includedInHeadline: false
                  }
                ]}
                source="BLS and NY Fed"
                asOf={data.headline.asOfDate}
                valueLabel="Magnitude"
                unit=""
                description={data.definitionalOverlap.overlapNotes}
              />
              <AnalyticalInterpretationCallout
                className="mt-5"
                title="Skills underemployment is the higher education lens"
                interpretation="Skills underemployment captures a much larger population than involuntary part-time work. For an audience focused on the return to higher education, the skills definition is the relevant one. For an audience focused on labor market slack or wage pressure, the involuntary part-time measure responds more cleanly to business cycle conditions."
              />
            </UnderemploymentSection>

            <UnderemploymentSection id="headline-data" title="The headline data">
              <p className="font-serif text-[17px] leading-[1.58] text-ink">
                As of {data.headline.asOfDate}, the underemployment rate for recent college graduates is {percent(data.headline.recentGrads)}. The rate for all college graduates is {percent(data.headline.allGrads)}. The recent graduate rate has historically run several points above the all-graduate rate.
              </p>
              <p className="mt-4 font-serif text-[17px] leading-[1.58] text-ink">
                The recent graduate underemployment rate has hovered between 38 and 45 percent for most of the past two decades. It rose sharply during the 2008 recession, partially recovered, then climbed again in the early 2020s. The all-graduate rate has been more stable, suggesting that underemployment tends to resolve as workers age into the labor market, but only partially.
              </p>
              <TrajectoryChart
                className="mt-6"
                title="Recent graduates run above all graduates"
                series={[
                  { id: "recent", label: "Recent graduates", data: data.headlineTrend.map((point) => ({ date: point.date, value: point.recentGrads })) },
                  { id: "all", label: "All graduates", data: data.headlineTrend.map((point) => ({ date: point.date, value: point.allGrads })) }
                ]}
                source={source}
                sourceHref={sourceHref}
                asOf={data.headline.asOfDate}
                valueLabel="Underemployment rate"
                unit="%"
              />
            </UnderemploymentSection>

            <UnderemploymentSection id="by-major" title="By major">
              <p className="font-serif text-[17px] leading-[1.58] text-ink">
                Among recent graduates, the underemployment rate varies from below 20 percent for some engineering and computing majors to above 60 percent for several humanities and service-oriented majors. The major-level data is updated annually and currently covers {data.majorRanking.length} major categories.
              </p>
              <p className="mt-4 font-serif text-[17px] leading-[1.58] text-ink">
                The variation across majors is the most consequential single fact in the underemployment data. The choice of major matters more than most workforce-policy conversations acknowledge. At the same time, the rankings are not destiny. Some high-underemployment majors lead to good outcomes for workers who reach graduate-level credentials. Some low-underemployment majors compress earnings even for workers who avoid underemployment. The headline ranking is the starting point, not the conclusion.
              </p>
              <MajorRankingChart
                className="mt-6"
                title="Underemployment by major"
                data={data.majorRanking.map((major) => ({
                  major: major.name,
                  value: major.current.underemploymentRate,
                  rank: major.rankAmongAllMajors,
                  group: major.category ?? undefined
                }))}
                source={source}
                sourceHref={sourceHref}
                asOf={data.headline.asOfDate}
                valueLabel="Underemployment rate"
                unit="%"
                maxItems={30}
              />
              <AnalyticalInterpretationCallout
                className="mt-5"
                title="Major choice is an information problem"
                interpretation="The persistence of certain majors at the bottom of the ranking, decade after decade, suggests that labor market signals about major choice are reaching prospective students slowly or not at all. This is a system-level information problem, not an individual rationality problem."
              />
              <MajorComparisonTable
                className="mt-6"
                title="Major comparison table"
                rows={data.majorRanking.map((major) => ({
                  major: major.name,
                  rank: major.rankAmongAllMajors,
                  group: major.category ?? undefined,
                  underemploymentRate: percent(major.current.underemploymentRate),
                  medianWage: money(major.current.medianWageCollegeJob),
                  wagePremium: money(major.wagePremium),
                  sampleNote: major.isCommonOnline ? "Common online program area" : "NY Fed major category"
                }))}
                source={source}
                asOf={data.headline.asOfDate}
              />
            </UnderemploymentSection>

            <UnderemploymentSection id="wage-premium" title="The wage premium question">
              <p className="font-serif text-[17px] leading-[1.58] text-ink">
                Underemployment is costly in part because workers in non-college jobs earn substantially less than workers in college-level jobs. As of {data.headline.asOfDate}, the median wage gap between college and non-college jobs for recent graduates is {money(averageWageGap)} per year.
              </p>
              <p className="mt-4 font-serif text-[17px] leading-[1.58] text-ink">
                The wage premium varies sharply by major. Some majors with high underemployment rates also show small wage gaps, meaning the cost of underemployment for those workers is relatively modest. Other majors combine low underemployment with very large wage premiums, meaning workers who land college-level jobs are well rewarded but workers who do not are significantly worse off than the headline rate suggests. This two-dimensional view is more useful than the underemployment rate alone.
              </p>
              <WagePremiumScatter
                className="mt-6"
                title="Underemployment and wage premium"
                data={data.wagePremiumScatter.map((point) => ({
                  major: point.majorName,
                  underemploymentRate: point.underemploymentRate,
                  wagePremium: point.wagePremium,
                  group: point.category,
                  highlight: point.underemploymentRate > 55 || point.wagePremium > 30000
                }))}
                source={source}
                sourceHref={sourceHref}
                asOf={data.headline.asOfDate}
                wagePremiumUnit="$"
              />
            </UnderemploymentSection>

            <UnderemploymentSection id="trajectory" title="Trajectory analysis">
              <p className="font-serif text-[17px] leading-[1.58] text-ink">
                Workers who begin their careers underemployed do not all stay underemployed. The data on career trajectories is thinner than the cross-sectional data, but the available evidence suggests partial resolution over the first decade of work.
              </p>
              <p className="mt-4 font-serif text-[17px] leading-[1.58] text-ink">
                The gap between recent graduate underemployment and all-graduate underemployment is the best available trajectory signal. The fact that the all-graduate rate is meaningfully lower indicates that some workers escape underemployment as they age. The fact that it is not dramatically lower indicates that escape is incomplete. For policy purposes, the more useful question is which underemployed workers escape and which do not. The available data is not granular enough to answer this directly, but the major-level patterns offer suggestive evidence.
              </p>
              <TrajectoryChart
                className="mt-6"
                title="Underemployment falls with experience, but not to zero"
                series={data.trajectory.map((series) => ({
                  id: series.ageGroup.replace(/[^a-z0-9]+/gi, "_").toLowerCase(),
                  label: series.ageGroup,
                  data: series.observations.map((point) => ({ date: point.date, value: point.rate }))
                }))}
                source={source}
                sourceHref={sourceHref}
                asOf={data.headline.asOfDate}
                valueLabel="Underemployment rate"
                unit="%"
              />
            </UnderemploymentSection>

            <UnderemploymentSection id="major-lookup" title="Major lookup tool">
              <p className="font-serif text-[17px] leading-[1.58] text-ink">
                The ranking chart shows the landscape. The lookup tool below gives the full picture for any single major. Each major has a profile including current underemployment rate, historical trend, wage data, and comparison to similar majors.
              </p>
              <Suspense fallback={<div className="mt-6 border border-rule px-4 py-8 font-sans text-sm text-sub">Loading major lookup...</div>}>
                <MajorLookupTool majors={data.allMajors} />
              </Suspense>
            </UnderemploymentSection>

            <UnderemploymentSection id="online-programs" title="Programs commonly offered by online universities">
              <p className="font-serif text-[17px] leading-[1.58] text-ink">
                Online and competency-based universities tend to concentrate their program offerings in a specific subset of majors. The most common categories include business administration, information technology, nursing and other health professions, education, and criminal justice. The underemployment landscape for these majors deserves specific attention because they represent the practical choice set for many adult learners and working students.
              </p>
              <p className="mt-4 font-serif text-[17px] leading-[1.58] text-ink">
                The majors common to online universities cluster in the middle of the underemployment distribution. They are neither the highest-return majors, which tend to be engineering and quantitative fields, nor the highest-underemployment majors, which tend to be performing arts, humanities, and some social sciences. This middle position reflects the practical orientation of online programs toward fields with clear occupational pathways, but it also means that workers in these programs face nontrivial underemployment risk and should not assume that a degree in a practical field guarantees a college-level job.
              </p>
              <MajorRankingChart
                className="mt-6"
                title="Common online program areas"
                data={data.commonOnlineMajors.map((major) => ({
                  major: major.name,
                  value: major.current.underemploymentRate,
                  rank: major.rankAmongAllMajors,
                  group: major.category ?? undefined
                }))}
                source={source}
                sourceHref={sourceHref}
                asOf={data.headline.asOfDate}
                valueLabel="Underemployment rate"
                unit="%"
              />
            </UnderemploymentSection>

            <MethodologySection />
            <LimitationsSection />

            <AnalyticalInterpretationCallout
              className="mt-8"
              title="Use the lens and keep the blind spots visible"
              interpretation="The underemployment data is most useful when read with its limitations in mind. It is a sharp lens on one slice of the workforce, recent and current college graduates whose education and occupation can both be measured cleanly. It is silent on the workers and credentials that fall outside that frame. A complete picture of underemployment in the United States would require data infrastructure that does not currently exist. Until it does, the NY Fed data is the best public source for the question of what happens to college graduates in the labor market, and the question of what to do about underemployment in workforce policy more broadly remains open."
            />

            <PageCitation
              className="mt-8"
              title="Underemployment Analytics"
              path="/underemployment"
              source="Federal Reserve Bank of New York and U.S. Bureau of Labor Statistics"
              publishedAt="2026-06-04"
              updatedAt="2026-07-17"
            />
          </article>
        </div>
      </main>
    </div>
  );
}
