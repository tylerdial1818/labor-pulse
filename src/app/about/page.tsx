import { TopBar } from "@/components/layout/top-bar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">About</p>
        <h1 className="mt-3 font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">About Labor Pulse</h1>
        <section className="mt-6 grid gap-6 border-y border-rule py-6 lg:grid-cols-[1.2fr_0.8fr]" aria-label="About Labor Pulse">
          <div>
            <p className="max-w-3xl font-serif text-[19px] leading-[1.55] text-ink">
              This website was created by Dialed Intelligence LLC to support policy researchers and labor market analysts in the US. More projects coming soon. Special thanks to Ruth Hardy for her work and feedback on the site.
            </p>
          </div>
          <aside className="border-l border-rule pl-6 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-5">
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Editorial note</p>
            <p className="mt-2 font-serif text-[15.5px] italic leading-[1.45] text-sub">
              All numerical values are deterministic and source-backed. Any generated text is limited to cached explanatory prose and does not create or revise statistics.
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}
