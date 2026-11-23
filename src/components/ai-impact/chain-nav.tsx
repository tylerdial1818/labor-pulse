import { AI_CHAIN } from "@/lib/ai-impact/content";

/** The five-link chain that organizes the page. Each step jumps to its section. */
export function ChainNav() {
  return (
    <nav aria-label="How AI could change jobs, step by step" className="border-y border-rule py-5">
      <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-sub">How to read this page</p>
      <p className="mt-2 max-w-3xl font-serif text-[16px] leading-[1.5] text-ink">
        AI can only change jobs through a chain of steps. Each section below takes one step, shows what the data says, and links the economists who made predictions about it.
      </p>
      <ol className="mt-4 grid gap-2 sm:grid-cols-5">
        {AI_CHAIN.map((step, index) => (
          <li key={step.id}>
            <a href={`#${step.anchor}`} className="flex h-full flex-col border border-rule px-3 py-3 hover:bg-[var(--lp-navy-tint)]">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-navy">Step {index + 1}</span>
              <span className="mt-1 font-serif text-[16px] font-semibold leading-tight text-ink">{step.label}</span>
              <span className="mt-1 font-sans text-xs leading-[1.35] text-sub">{step.question}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
