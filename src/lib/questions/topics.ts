/**
 * The site's topics and the plain-language questions each one answers.
 *
 * Topic hubs render a card per question (anchored by `id`), and the home page
 * lists the `featured` questions under each topic door. Keep questions short and
 * in everyday words; technical detail lives on the card and its linked pages.
 */

export type TopicId = "jobs" | "wages" | "education" | "ai";

export type TopicQuestion = {
  id: string;
  question: string;
  featured?: boolean;
};

export type Topic = {
  id: TopicId;
  label: string;
  href: string;
  summary: string;
  questions: TopicQuestion[];
  /** False while the hub page does not yet anchor each question (AI Impact is being rebuilt separately). */
  anchoredQuestions?: boolean;
};

export const TOPICS: Topic[] = [
  {
    id: "jobs",
    label: "Jobs",
    href: "/jobs",
    summary: "Unemployment, hiring, layoffs, and whether a recession is coming.",
    questions: [
      { id: "right-now", question: "How is the job market doing right now?", featured: true },
      { id: "recession", question: "Are we heading into a recession?", featured: true },
      { id: "finding-a-job", question: "Is it easy or hard to find a job right now?", featured: true },
      { id: "layoffs", question: "Are layoffs rising?" },
      { id: "unemployment-measures", question: "Why do unemployment numbers disagree?" },
      { id: "states", question: "How does my state compare?" },
      { id: "who", question: "Who is the job market working for?" }
    ]
  },
  {
    id: "wages",
    label: "Wages",
    href: "/wages",
    summary: "Pay growth, pay differences across industries, and hours worked.",
    questions: [
      { id: "paychecks", question: "Are paychecks growing?", featured: true },
      { id: "industries", question: "Which industries pay more?", featured: true },
      { id: "hours", question: "Are people working more or fewer hours?", featured: true }
    ]
  },
  {
    id: "education",
    label: "Education",
    href: "/education",
    summary: "What happens to college graduates in the job market, by major.",
    questions: [
      { id: "degree-jobs", question: "Do recent college grads end up in jobs that need a degree?", featured: true },
      { id: "majors", question: "Which majors lead to jobs that use the degree?", featured: true },
      { id: "payoff", question: "Does landing a college-level job pay off?", featured: true },
      { id: "experience", question: "Does underemployment fade with experience?" },
      { id: "training", question: "Do job training programs pay for themselves?" }
    ]
  },
  {
    id: "ai",
    label: "AI",
    href: "/ai-impact",
    summary: "Which jobs AI touches, how people use it at work, and what the evidence shows so far.",
    anchoredQuestions: false,
    questions: [
      { id: "exposure", question: "Which jobs are most exposed to AI?", featured: true },
      { id: "usage", question: "How are people actually using AI at work?", featured: true },
      { id: "employment", question: "Is AI showing up in employment numbers yet?", featured: true }
    ]
  }
];

export function getTopic(id: TopicId): Topic {
  const topic = TOPICS.find((item) => item.id === id);
  if (!topic) throw new Error(`Unknown topic ${id}`);
  return topic;
}

export function questionHref(topic: Topic, questionId: string) {
  return topic.anchoredQuestions === false ? topic.href : `${topic.href}#${questionId}`;
}

type QuestionRef = { topicId: TopicId; questionId: string };

/** Which topic questions each indicator or composite helps answer, so detail pages can link back up. */
const QUESTIONS_BY_SOURCE: Record<string, QuestionRef[]> = {
  UNRATE: [
    { topicId: "jobs", questionId: "right-now" },
    { topicId: "jobs", questionId: "unemployment-measures" },
    { topicId: "jobs", questionId: "states" }
  ],
  U6RATE: [{ topicId: "jobs", questionId: "unemployment-measures" }],
  EMRATIO: [{ topicId: "jobs", questionId: "unemployment-measures" }],
  CIVPART: [{ topicId: "jobs", questionId: "who" }],
  PAYEMS: [{ topicId: "jobs", questionId: "states" }],
  ICSA: [
    { topicId: "jobs", questionId: "layoffs" },
    { topicId: "jobs", questionId: "recession" }
  ],
  JTSJOL: [{ topicId: "jobs", questionId: "finding-a-job" }],
  JTSQUR: [{ topicId: "jobs", questionId: "finding-a-job" }],
  JTSLDR: [{ topicId: "jobs", questionId: "layoffs" }],
  TEMPHELPS: [{ topicId: "jobs", questionId: "recession" }],
  CES0500000003: [
    { topicId: "wages", questionId: "paychecks" },
    { topicId: "wages", questionId: "industries" }
  ],
  AWHAETP: [{ topicId: "wages", questionId: "hours" }],
  USPBS: [{ topicId: "ai", questionId: "employment" }],
  USINFO: [{ topicId: "ai", questionId: "employment" }],
  ANTHROPIC_ECONOMIC_INDEX: [{ topicId: "ai", questionId: "usage" }],
  sahm_rule: [{ topicId: "jobs", questionId: "recession" }],
  labor_tightness: [
    { topicId: "jobs", questionId: "finding-a-job" },
    { topicId: "jobs", questionId: "right-now" }
  ],
  labor_stress: [{ topicId: "jobs", questionId: "layoffs" }]
};

export type RelatedQuestion = { topic: Topic; question: TopicQuestion; href: string };

/** Questions an indicator (FRED id) or composite id helps answer, in display order. */
export function relatedQuestions(sourceId: string): RelatedQuestion[] {
  return (QUESTIONS_BY_SOURCE[sourceId] ?? []).flatMap(({ topicId, questionId }) => {
    const topic = getTopic(topicId);
    const question = topic.questions.find((item) => item.id === questionId);
    return question ? [{ topic, question, href: questionHref(topic, questionId) }] : [];
  });
}
