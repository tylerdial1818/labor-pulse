import Link from "next/link";
import type { Route } from "next";

import type { ShortAnswer } from "@/lib/questions/answers";
import { TOPICS, questionHref } from "@/lib/questions/topics";

/** Home page front door: today's one-sentence answer, then the four topics and their main questions. */
export function HomeQuestions({ rightNow }: { rightNow: ShortAnswer | null }) {
  return (
    <>
      {rightNow ? (
        <section aria-labelledby="right-now" className="border-b border-rule py-6">
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">Right now</p>
          <h2 id="right-now" className="mt-2 font-serif text-2xl font-semibold text-ink">
            How is the job market doing?
          </h2>
          <p className="mt-2 max-w-3xl font-serif text-[20px] leading-[1.45] text-ink">{rightNow.text}</p>
          <p className="mt-2 font-sans text-[12px] text-sub">
            {rightNow.asOf ? `Latest data: ${rightNow.asOf} · ` : null}
            <Link href={"/jobs#right-now" as Route} className="font-semibold text-navy hover:underline">
              What this means
            </Link>
          </p>
        </section>
      ) : null}

      <section aria-labelledby="explore-by-question" className="border-b border-rule py-6">
        <h2 id="explore-by-question" className="font-serif text-2xl font-semibold text-ink">
          Find answers by topic
        </h2>
        <p className="mt-1 font-serif text-[15px] italic text-sub">Plain answers first, with the data and methods behind them one click away.</p>
        <div className="mt-5 grid border-l border-t border-rule sm:grid-cols-2 xl:grid-cols-4">
          {TOPICS.map((topic) => (
            <div key={topic.id} className="flex flex-col border-b border-r border-rule px-5 py-[18px]">
              <h3 className="font-serif text-[21px] font-semibold text-ink">
                <Link href={topic.href as Route} className="hover:underline">
                  {topic.label}
                </Link>
              </h3>
              <p className="mt-1 font-sans text-[12.5px] leading-[1.4] text-sub">{topic.summary}</p>
              <ul className="mt-4 space-y-2.5 font-serif text-[15.5px] leading-[1.35]">
                {topic.questions
                  .filter((item) => item.featured)
                  .map((item) => (
                    <li key={item.id}>
                      <Link href={questionHref(topic, item.id) as Route} className="text-navy hover:underline">
                        {item.question}
                      </Link>
                    </li>
                  ))}
              </ul>
              <Link href={topic.href as Route} className="mt-auto pt-4 font-sans text-[12px] font-semibold text-navy hover:underline">
                {`Explore ${topic.label} ->`}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
