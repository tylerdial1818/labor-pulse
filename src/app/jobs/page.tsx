import type { Metadata } from "next";

import { ComparisonTimeSeriesChart, TimeSeriesChart } from "@/components/charts/labor-pulse-charts";
import { Term } from "@/components/glossary/term";
import { TopBar } from "@/components/layout/top-bar";
import { QuestionCard, TopicHeader } from "@/components/questions/question-card";
import {
  answerFindingAJob,
  answerJobMarketNow,
  answerLayoffs,
  answerRecessionRisk,
  answerUnemploymentMeasures
} from "@/lib/questions/answers";
import { getTopic } from "@/lib/questions/topics";
import { compositeHistory, getTopicData } from "@/server/topic-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Plain answers to common questions about the U.S. job market: unemployment, hiring, layoffs, and recession risk, updated from official data."
};

export default async function JobsPage() {
  const topic = getTopic("jobs");
  const data = await getTopicData();
  const unemployment = data.indicator("UNRATE");
  const u6 = data.indicator("U6RATE");
  const openings = data.indicator("JTSJOL");
  const quits = data.indicator("JTSQUR");
  const claims = data.indicator("ICSA");
  const layoffs = data.indicator("JTSLDR");
  const sahm = data.composite("sahm_rule");
  const tightness = data.composite("labor_tightness");
  const stress = data.composite("labor_stress");

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <TopicHeader
          eyebrow="Topic"
          title="Jobs and unemployment"
          lede="Is it a good time to be looking for work, and is the economy heading for trouble? Each answer below is updated from official data, with the technical detail one click away."
          questions={topic.questions}
        />

        <QuestionCard
          id="right-now"
          question="How is the job market doing right now?"
          answer={answerJobMarketNow(unemployment, tightness)}
          chart={<TimeSeriesChart data={unemployment?.sparkline ?? []} label="Unemployment rate, last 10 years" units="Percent" />}
          whyItMatters={
            <p>
              The <Term id="unemployment-rate">unemployment rate</Term> is the most familiar single read on the job market. It is paired here with our{" "}
              <Term id="labor-market-tightness">tightness</Term> measure, which looks at the hiring side: how many jobs employers are trying to fill, how often
              workers quit, and how fast pay is rising.
            </p>
          }
          howToRead={
            <p>
              Lower unemployment is generally better for workers, but the direction of change matters as much as the level. A rate that is rising steadily from a
              low point is an early warning even when the level still looks low.
            </p>
          }
          deeper={[
            { href: "/indicators/UNRATE", label: "Unemployment rate detail" },
            { href: "/composites/labor_tightness", label: "Tightness measure and inputs" },
            { href: "/", label: "Full indicator dashboard" }
          ]}
          methods={
            <>
              <p>Unemployment comes from the monthly household survey (BLS Current Population Survey) and is seasonally adjusted. The change shown compares the latest month with the same month a year earlier.</p>
              <p>The tightness measure is a LaborPulse composite: a blend of standardized job openings, quits, and earnings. Readings above 0.5 are labeled Tight and below -0.5 Slack.</p>
            </>
          }
        />

        <QuestionCard
          id="recession"
          question="Are we heading into a recession?"
          answer={answerRecessionRisk(sahm)}
          chart={<TimeSeriesChart data={compositeHistory(sahm)} label="Sahm Rule reading, last 10 years" units="Percentage points" />}
          whyItMatters={
            <p>
              Recessions are usually declared months after they start. The <Term id="sahm-rule">Sahm Rule</Term> gives a real-time warning from data people
              already watch: a sustained rise in unemployment from its recent low.
            </p>
          }
          howToRead={
            <p>
              Readings near zero mean unemployment is close to its low of the past year. The signal triggers at 0.50. No single rule is a forecast; read it
              together with <Term id="initial-claims">jobless claims</Term> and the layoffs question below.
            </p>
          }
          deeper={[
            { href: "/composites/sahm_rule", label: "Sahm Rule detail" },
            { href: "/indicators/ICSA", label: "Initial jobless claims" },
            { href: "/indicators/TEMPHELPS", label: "Temporary help jobs" }
          ]}
          methods={
            <p>
              LaborPulse computes the reading from the national unemployment rate: the three-month moving average minus its lowest value over the prior 12 months.
              It can differ slightly from FRED&apos;s real-time series, which uses the unemployment rate as first published rather than as later revised.
            </p>
          }
        />

        <QuestionCard
          id="finding-a-job"
          question="Is it easy or hard to find a job right now?"
          answer={answerFindingAJob(openings, quits, tightness)}
          chart={<TimeSeriesChart data={compositeHistory(tightness)} label="Labor market tightness, last 10 years" units="Standardized score" />}
          whyItMatters={
            <p>
              <Term id="job-openings">Job openings</Term> show how many positions employers are trying to fill. The{" "}
              <Term id="quits-rate">quits rate</Term> shows how confident workers are: people quit more when they expect to find something better.
            </p>
          }
          howToRead={
            <p>
              The chart is a <Term id="z-score">standardized score</Term>: zero is a typical market, positive is tighter than usual (good for job seekers), and
              negative is looser.
            </p>
          }
          deeper={[
            { href: "/indicators/JTSJOL", label: "Job openings" },
            { href: "/indicators/JTSQUR", label: "Quits rate" },
            { href: "/composites/labor_tightness", label: "Tightness measure" }
          ]}
          methods={
            <p>
              Openings and quits come from the BLS <Term id="jolts">JOLTS</Term> survey, which is released with roughly a one-month lag, so these answers trail
              the unemployment rate by a month.
            </p>
          }
        />

        <QuestionCard
          id="layoffs"
          question="Are layoffs rising?"
          answer={answerLayoffs(claims, layoffs, stress)}
          chart={<TimeSeriesChart data={claims?.sparkline ?? []} label="Initial jobless claims, last 10 years" units="Claims per week" />}
          whyItMatters={
            <p>
              <Term id="initial-claims">Initial jobless claims</Term> are published every week, so they are among the first places rising layoffs show up. The
              monthly <Term id="layoffs-and-discharges">layoffs rate</Term> confirms the trend with a broader survey of employers.
            </p>
          }
          howToRead={
            <p>
              Weekly claims are noisy, so look at the trend over several weeks rather than one release. Our{" "}
              <Term id="labor-market-stress">stress measure</Term> combines claims, layoffs, and hours to smooth out that noise.
            </p>
          }
          deeper={[
            { href: "/indicators/ICSA", label: "Initial claims" },
            { href: "/indicators/JTSLDR", label: "Layoffs and discharges rate" },
            { href: "/composites/labor_stress", label: "Stress measure" }
          ]}
          methods={
            <p>
              Claims changes compare the latest week with four weeks earlier; the layoffs rate compares with a year earlier. Claims count new filings for state
              unemployment insurance, so people who are not eligible for benefits do not appear in them.
            </p>
          }
        />

        <QuestionCard
          id="unemployment-measures"
          question="Why do unemployment numbers disagree?"
          answer={answerUnemploymentMeasures(unemployment, u6)}
          chart={
            <ComparisonTimeSeriesChart
              label="Headline unemployment rate and U-6, last 10 years"
              units="Percent"
              series={[
                { id: "UNRATE", label: "Unemployment rate", data: unemployment?.sparkline ?? [] },
                { id: "U6RATE", label: "U-6", data: u6?.sparkline ?? [] }
              ]}
            />
          }
          whyItMatters={
            <p>
              The headline rate only counts people who are actively looking for work. <Term id="u-6">U-6</Term> adds people who want a job but have given up
              looking recently and people working <Term id="part-time-for-economic-reasons">part time who want full-time hours</Term>.
            </p>
          }
          howToRead={
            <p>
              U-6 is always higher than the headline rate. A widening gap between the two can signal hidden weakness, such as employers cutting hours instead of
              jobs. The <Term id="employment-population-ratio">employment-population ratio</Term> is a third view that avoids the question of who is looking.
            </p>
          }
          deeper={[
            { href: "/indicators/U6RATE", label: "U-6 detail" },
            { href: "/indicators/EMRATIO", label: "Employment-population ratio" },
            { href: "/indicators/CIVPART", label: "Participation rate" }
          ]}
          methods={
            <p>
              Both rates come from the same household survey. Payroll job counts come from a different survey of employers, which is why the jobs number and the
              unemployment rate can point in different directions in a given month (see <Term id="household-survey">household survey</Term> and{" "}
              <Term id="establishment-survey">establishment survey</Term>).
            </p>
          }
        />

        <QuestionCard
          id="states"
          question="How does my state compare?"
          lead={<p>Pick a state on the indicator pages to compare its unemployment rate, payroll jobs, participation, and jobless claims with the national numbers.</p>}
          whyItMatters={
            <p>
              National averages hide large differences between states. A slowdown can start in a few regions or industries before it shows up in the national
              data.
            </p>
          }
          deeper={[
            { href: "/indicators/UNRATE#metric-breakdowns-state", label: "Unemployment by state" },
            { href: "/indicators/PAYEMS#metric-breakdowns-state", label: "Payroll jobs by state" },
            { href: "/indicators/ICSA#metric-breakdowns-state", label: "Jobless claims by state" }
          ]}
          methods={<p>State jobless claims are not seasonally adjusted, so compare them with the same week in past years rather than with recent weeks.</p>}
        />

        <QuestionCard
          id="who"
          question="Who is the job market working for?"
          lead={<p>Unemployment and participation broken out by age and gender show which groups are gaining or losing ground.</p>}
          whyItMatters={
            <p>
              Young workers and workers with less experience usually feel a downturn first. Looking at <Term id="prime-age">prime-age workers</Term> separately
              also removes the effect of an aging population on participation.
            </p>
          }
          deeper={[
            { href: "/indicators/UNRATE#metric-breakdowns-age", label: "Unemployment by age" },
            { href: "/indicators/UNRATE#metric-breakdowns-gender", label: "Unemployment by gender" },
            { href: "/indicators/CIVPART#metric-breakdowns-age", label: "Participation by age" }
          ]}
          methods={<p>Breakdowns use the categories BLS publishes. Only groups with verified public series are shown; others are left out rather than estimated.</p>}
        />
      </main>
    </div>
  );
}
