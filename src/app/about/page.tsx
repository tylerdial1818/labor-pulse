import { TopBar } from "@/components/layout/top-bar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 py-[26px] sm:px-6 lg:px-8">
        <h1 className="font-serif text-[40px] font-bold leading-none tracking-[-0.02em]">About Labor Pulse</h1>
        <p className="mt-3 max-w-3xl font-serif text-base italic leading-[1.4] text-sub">
          Labor Pulse is a public US labor market monitor for researchers. Its numerical values are deterministic and source-backed; generated text is limited to cached explanatory prose.
        </p>
      </main>
    </div>
  );
}
