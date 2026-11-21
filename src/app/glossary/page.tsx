import type { Metadata } from "next";

import { GlossaryBrowser } from "@/components/glossary/glossary-browser";
import { TopBar } from "@/components/layout/top-bar";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Plain-language definitions of the labor market, wage, education, and AI terms used across LaborPulse, with links to official sources."
};

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Reference</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">Glossary</h1>
        <p className="mb-8 mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          The terms used across LaborPulse, in plain language first and official wording second. Underlined terms on other pages link here.
        </p>
        <GlossaryBrowser />
      </main>
    </div>
  );
}
