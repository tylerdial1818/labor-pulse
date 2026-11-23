import type { Metadata } from "next";

import { Term } from "@/components/glossary/term";
import { TopBar } from "@/components/layout/top-bar";
import { QuestionCard, TopicHeader } from "@/components/questions/question-card";
import { MajorRankingChart } from "@/components/underemployment/major-ranking-chart";
import { TrajectoryChart } from "@/components/underemployment/trajectory-chart";
import { WagePremiumScatter } from "@/components/underemployment/wage-premium-scatter";
import {
  answerDegreePayoff,
  answerGraduateUnderemployment,
  answerMajors,
  answerUnderemploymentWithExperience,
  type MajorSnapshot
} from "@/lib/questions/answers";
import { getTopic } from "@/lib/questions/topics";
import { getUnderemploymentPageData } from "@/lib/underemployment/calculate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Education",
  description: "Plain answers to common questions about college and the job market: graduate underemployment, outcomes by major, and the pay gap for college-level jobs."
};

const source = "NY Fed Recent College Graduates";
const sourceHref = "https://www.newyorkfed.org/research/college-labor-market";

export default async function EducationPage() {
  const topic = getTopic("education");
  const data = await getUnderemploymentPageData();
  const { recentGrads, allGrads, asOfDate } = data.headline;
  const majors: MajorSnapshot[] = data.majorRanking.map((major) => ({
    name: major.name,
    underemploymentRate: major.current.underemploymentRate,
    wagePremium: major.wagePremium
  }));

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <TopicHeader
          eyebrow="Topic"
          title="Education and the job market"
          lede="Does college lead to a job that uses the degree, and does it depend on the major? Each answer below is updated from the New York Fed's data on college graduates, with the full analysis one click away."
          questions={topic.questions}
        />

        <QuestionCard
          id="degree-jobs"
          question="Do recent college grads end up in jobs that need a degree?"
          answer={answerGraduateUnderemployment(recentGrads, asOfDate)}
          chart={
            <TrajectoryChart
              title="Underemployment rate, recent and all college graduates"
              series={[
                { id: "recent", label: "Recent graduates", data: data.headlineTrend.map((point) => ({ date: point.date, value: point.recentGrads })) },
                { id: "all", label: "All graduates", data: data.headlineTrend.map((point) => ({ date: point.date, value: point.allGrads })) }
              ]}
              source={source}
              sourceHref={sourceHref}
              asOf={data.headlineTrend.at(-1)?.date ?? asOfDate}
              valueLabel="Underemployment rate"
              unit="%"
            />
          }
          whyItMatters={
            <p>
              A degree is a large investment of time and money. <Term id="skills-underemployment">Skills underemployment</Term>, working in a job that does not
              usually need a degree, is one of the clearest signs of whether that investment is landing graduates in the jobs it is meant to prepare them for.
            </p>
          }
          howToRead={
            <p>
              <Term id="recent-graduate">Recent graduates</Term> always have higher rates than all graduates, because many people start in a stopgap job. The
              trend over time matters more than any single year.
            </p>
          }
          deeper={[
            { href: "/underemployment#headline-data", label: "Headline data and trend" },
            { href: "/underemployment#definitions", label: "Three ways to define underemployment" }
          ]}
          methods={
            <p>
              The New York Fed classifies an occupation as a college job based on how many of its workers hold a bachelor&apos;s degree. There is no official
              government measure of skills underemployment. See the <Term id="underemployment">underemployment</Term> guide for how this compares with the BLS
              hours-based measures.
            </p>
          }
        />

        <QuestionCard
          id="majors"
          question="Which majors lead to jobs that use the degree?"
          answer={answerMajors(majors, asOfDate)}
          chart={
            <MajorRankingChart
              title="Underemployment by major, recent graduates"
              data={data.majorRanking.map((major) => ({
                major: major.name,
                value: major.current.underemploymentRate,
                rank: major.rankAmongAllMajors,
                group: major.category ?? undefined
              }))}
              source={source}
              sourceHref={sourceHref}
              asOf={asOfDate}
              valueLabel="Underemployment rate"
              unit="%"
              maxItems={15}
            />
          }
          whyItMatters={<p>The major a student chooses is one of the biggest single factors in whether they land a job that uses their degree.</p>}
          howToRead={
            <p>
              A ranking is a starting point, not destiny. Some majors with high underemployment lead to good outcomes for graduates who go on to graduate school,
              and the data shows patterns rather than the effect of choosing a major (<Term id="correlation-vs-causation">correlation, not causation</Term>).
            </p>
          }
          deeper={[
            { href: "/underemployment#by-major", label: "Full ranking and table" },
            { href: "/underemployment#major-lookup", label: "Look up a major" }
          ]}
          methods={<p>Major-level data comes from the New York Fed, is updated annually, and covers recent graduates ages 22 to 27.</p>}
        />

        <QuestionCard
          id="payoff"
          question="Does landing a college-level job pay off?"
          answer={answerDegreePayoff(majors, asOfDate)}
          chart={
            <WagePremiumScatter
              title="Underemployment and wage premium by major"
              data={data.wagePremiumScatter.map((point) => ({
                major: point.majorName,
                underemploymentRate: point.underemploymentRate,
                wagePremium: point.wagePremium,
                group: point.category,
                highlight: false
              }))}
              source={source}
              sourceHref={sourceHref}
              asOf={asOfDate}
              wagePremiumUnit="$"
            />
          }
          whyItMatters={
            <p>
              The <Term id="wage-premium">wage premium</Term> shows what underemployment costs. A major with high underemployment and a large premium means
              graduates who miss out on a college-level job give up a lot of pay.
            </p>
          }
          howToRead={
            <p>
              Each dot is a major. Further right means more graduates are underemployed; higher up means a bigger pay gap between college-level and other jobs.
            </p>
          }
          deeper={[
            { href: "/underemployment#wage-premium", label: "The wage premium question" },
            { href: "/research", label: "Research on education and training returns" }
          ]}
          methods={
            <p>
              The premium is median pay in college-level jobs minus median pay in non-college jobs for graduates of the same major. It is not the causal return to
              a degree or to a major.
            </p>
          }
        />

        <QuestionCard
          id="experience"
          question="Does underemployment fade with experience?"
          answer={answerUnderemploymentWithExperience(recentGrads, allGrads, asOfDate)}
          chart={
            data.trajectory.length > 0 ? (
              <TrajectoryChart
                title="Underemployment by age group"
                series={data.trajectory.map((series) => ({
                  id: series.ageGroup.replace(/[^a-z0-9]+/gi, "_").toLowerCase(),
                  label: series.ageGroup,
                  data: series.observations.map((point) => ({ date: point.date, value: point.rate }))
                }))}
                source={source}
                sourceHref={sourceHref}
                asOf={asOfDate}
                valueLabel="Underemployment rate"
                unit="%"
              />
            ) : undefined
          }
          whyItMatters={<p>If underemployment is only a first-job problem, it matters less than if graduates stay stuck in jobs that do not use their degree.</p>}
          howToRead={
            <p>
              These are snapshots of different age groups, not the same people followed over time, so they show a pattern consistent with people moving up, not
              proof of it.
            </p>
          }
          deeper={[{ href: "/underemployment#trajectory", label: "Trajectory analysis" }]}
        />

        <QuestionCard
          id="training"
          question="Do job training programs pay for themselves?"
          lead={
            <p>
              The LaborPulse research desk estimates the costs and benefits of workforce programs from published{" "}
              <Term id="randomized-controlled-trial">randomized trials</Term>, starting with sector-based job training.
            </p>
          }
          whyItMatters={
            <p>
              Not everyone goes to college. Training programs are a major alternative, and many are publicly funded. A{" "}
              <Term id="benefit-cost-ratio">benefit-cost ratio</Term> shows whether the gains to workers and taxpayers outweigh the cost.
            </p>
          }
          deeper={[{ href: "/research", label: "Research notes" }]}
        />
      </main>
    </div>
  );
}
