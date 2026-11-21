import type { Metadata } from "next";

import { TimeSeriesChart } from "@/components/charts/labor-pulse-charts";
import { Term } from "@/components/glossary/term";
import { TopBar } from "@/components/layout/top-bar";
import { QuestionCard, TopicHeader } from "@/components/questions/question-card";
import { answerHours, answerPaychecks } from "@/lib/questions/answers";
import { getTopic } from "@/lib/questions/topics";
import { getTopicData } from "@/server/topic-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wages",
  description: "Plain answers to common questions about U.S. pay: wage growth, pay by industry, and hours worked, updated from official data."
};

export default async function WagesPage() {
  const topic = getTopic("wages");
  const data = await getTopicData();
  const earnings = data.indicator("CES0500000003");
  const hours = data.indicator("AWHAETP");

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <TopicHeader
          eyebrow="Topic"
          title="Wages and hours"
          lede="Are workers getting raises, and where does work pay the most? Each answer below is updated from official data, with the technical detail one click away."
          questions={topic.questions}
        />

        <QuestionCard
          id="paychecks"
          question="Are paychecks growing?"
          answer={answerPaychecks(earnings)}
          chart={<TimeSeriesChart data={earnings?.sparkline ?? []} label="Average hourly earnings, last 10 years" units="Dollars per hour" />}
          whyItMatters={
            <p>
              Pay growth shows how much bargaining power workers have. When employers struggle to hire, they raise pay to attract and keep people, so wage growth
              tends to rise when the job market is <Term id="labor-market-tightness">tight</Term>.
            </p>
          }
          howToRead={
            <p>
              This is <Term id="nominal-vs-real">nominal</Term> pay, so part of any increase is inflation. Averages can also shift because of who is working, not
              because anyone got a raise (a <Term id="composition-effect">composition effect</Term>).
            </p>
          }
          deeper={[
            { href: "/indicators/CES0500000003", label: "Average hourly earnings detail" },
            { href: "/glossary#nominal-vs-real", label: "Nominal vs real wages" }
          ]}
          methods={
            <>
              <p>
                <Term id="average-hourly-earnings">Average hourly earnings</Term> for all private-sector employees, from the BLS{" "}
                <Term id="establishment-survey">establishment survey</Term>, seasonally adjusted. The change is the percent difference from the same month a year
                earlier.
              </p>
              <p>An inflation-adjusted version of this answer is planned once consumer price data is added to LaborPulse.</p>
            </>
          }
        />

        <QuestionCard
          id="industries"
          question="Which industries pay more?"
          lead={<p>Average hourly earnings by industry show both pay levels and where pay is growing fastest.</p>}
          whyItMatters={
            <p>
              Pay differs a lot across industries, and so does pay growth. Comparing industries shows whether raises are broad or concentrated in a few sectors
              competing hard for workers.
            </p>
          }
          howToRead={
            <p>
              Industry averages mix many occupations, so a high-paying industry still includes lower-paid jobs. Compare growth rates as well as levels.
            </p>
          }
          deeper={[{ href: "/indicators/CES0500000003#metric-breakdowns-industry", label: "Earnings by industry" }]}
          methods={<p>Industry series are published by BLS and republished by FRED. They are comparisons across sectors, not a breakdown that sums to the national average.</p>}
        />

        <QuestionCard
          id="hours"
          question="Are people working more or fewer hours?"
          answer={answerHours(hours)}
          chart={<TimeSeriesChart data={hours?.sparkline ?? []} label="Average weekly hours, last 10 years" units="Hours per week" />}
          whyItMatters={
            <p>
              Employers often trim hours before they cut jobs, and add hours before they hire, so <Term id="average-weekly-hours">weekly hours</Term> can turn
              before the headline numbers do.
            </p>
          }
          howToRead={
            <p>
              Small moves matter here. Because the average covers millions of workers, a change of a few tenths of an hour adds up to a large amount of total work.
            </p>
          }
          deeper={[
            { href: "/indicators/AWHAETP", label: "Average weekly hours detail" },
            { href: "/composites/labor_stress", label: "Stress measure (uses hours)" }
          ]}
          methods={<p>Average weekly hours for all private-sector employees, from the BLS establishment survey, seasonally adjusted. The change compares with the same month a year earlier.</p>}
        />
      </main>
    </div>
  );
}
