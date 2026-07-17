import type { Metadata } from "next";

import { TopBar } from "@/components/layout/top-bar";
import { appConfig } from "@/config/app";

export const metadata: Metadata = {
  title: "About",
  description: "The mission, research principles, and stewardship behind Labor Pulse."
};

const publications = [
  {
    title: "Core indicators",
    body: "National measures of employment, unemployment, participation, earnings, labor demand, and related conditions."
  },
  {
    title: "Composite measures",
    body: "Calculated signals that bring related source series together with visible inputs and interpretation guidance."
  },
  {
    title: "Research Monitor",
    body: "Profiles and updates from recurring releases and research programs that add context to the dashboard."
  },
  {
    title: "Special analyses",
    body: "Longer studies of questions that require more than a single indicator, including definitions, trends, and limits."
  },
  {
    title: "Research exports",
    body: "Downloadable charts and data files that retain source, date, and measure information."
  }
];

const principles = [
  "Each displayed measure links to its source.",
  "Derived measures identify their inputs and limits.",
  "Unsupported comparisons are omitted rather than estimated.",
  "Source dates and refresh status remain visible."
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">About</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">About Labor Pulse</h1>
        <p className="mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          The mission, research principles, and stewardship behind Labor Pulse.
        </p>

        <section className="mt-7 grid gap-8 border-y border-rule py-7 lg:grid-cols-[1.2fr_0.8fr]" aria-labelledby="mission">
          <div>
            <h2 id="mission" className="font-serif text-2xl font-semibold">Mission</h2>
            <p className="mt-3 max-w-3xl font-serif text-[17px] leading-[1.55] text-ink">
              Labor Pulse exists to make U.S. labor market evidence easier to examine, cite, and use in policy work. It brings source-backed indicators, transparent derived measures, and focused analysis into one public workspace.
            </p>
          </div>
          <aside className="border-l border-rule pl-8 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-6">
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Who it serves</p>
            <p className="mt-2 font-serif text-[15px] leading-[1.5] text-sub">
              Labor Pulse is written for policy researchers, workforce leaders, higher education analysts, journalists, and others who need to move from a headline number to its source, history, and limits.
            </p>
          </aside>
        </section>

        <section className="py-8" aria-labelledby="publications">
          <h2 id="publications" className="font-serif text-2xl font-semibold">What Labor Pulse publishes</h2>
          <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
            {publications.map((item) => (
              <article key={item.title} className="border-t border-rule pt-4">
                <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 font-sans text-sm leading-[1.55] text-sub">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-y border-rule py-7 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="research-principles">
          <div>
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Research practice</p>
            <h2 id="research-principles" className="mt-2 font-serif text-2xl font-semibold">Research principles</h2>
          </div>
          <ul className="grid gap-3 font-sans text-sm leading-[1.5] text-ink sm:grid-cols-2">
            {principles.map((principle) => (
              <li key={principle} className="border-l-2 border-navy pl-3">{principle}</li>
            ))}
          </ul>
        </section>

        <section className="grid gap-8 py-8 lg:grid-cols-[1.2fr_0.8fr]" aria-labelledby="stewardship">
          <div>
            <h2 id="stewardship" className="font-serif text-2xl font-semibold">Stewardship</h2>
            <p className="mt-3 max-w-3xl font-serif text-[17px] leading-[1.55] text-ink">
              Labor Pulse is a public-interest initiative developed and maintained by Dialed Intelligence LLC. Dialed Intelligence builds analytical tools, economic data systems, and decision-support models for organizations working through complex questions.
            </p>
            <p className="mt-3 max-w-3xl font-sans text-sm leading-[1.55] text-sub">
              This project applies that work to a public need: clear and traceable labor market evidence.
            </p>
          </div>
          <aside className="border-l border-rule pl-8 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-6">
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Acknowledgments</p>
            <p className="mt-2 font-serif text-[15px] leading-[1.5] text-sub">
              Ruth Hardy contributed research and product feedback that helped shape the site.
            </p>
          </aside>
        </section>

        <section className="border-y border-rule py-7" aria-labelledby="collaboration">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Collaboration</p>
          <h2 id="collaboration" className="mt-2 font-serif text-2xl font-semibold">Research collaboration</h2>
          <p className="mt-3 max-w-3xl font-serif text-[17px] leading-[1.55] text-ink">
            We welcome conversations with researchers and organizations working on labor market analysis, economic modeling, program assessment, and public data tools.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="border border-navy px-4 py-2 font-sans text-sm font-semibold text-navy hover:bg-[var(--lp-navy-tint)]" href={appConfig.firmUrl}>
              Visit Dialed Intelligence
            </a>
            <a className="border border-rule px-4 py-2 font-sans text-sm font-semibold text-navy hover:bg-[var(--lp-navy-tint)]" href={`mailto:${appConfig.researchEmail}?subject=Labor%20Pulse%20research%20collaboration`}>
              Discuss a research project
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
