import Link from "next/link";
import type { Route } from "next";

import { relatedQuestions } from "@/lib/questions/topics";

/** "This helps answer" links from a detail page back up to the plain-language questions. */
export function RelatedQuestions({ sourceId, className = "" }: { sourceId: string; className?: string }) {
  const questions = relatedQuestions(sourceId);
  if (questions.length === 0) return null;

  return (
    <nav aria-label="Questions this helps answer" className={`font-sans text-[13px] ${className}`}>
      <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-sub">Helps answer</span>
      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
        {questions.map(({ topic, question, href }) => (
          <li key={href + question.id}>
            <Link href={href as Route} className="font-semibold text-navy hover:underline">
              {topic.label}: {question.question}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
