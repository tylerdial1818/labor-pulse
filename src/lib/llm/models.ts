import "server-only";

export const MODELS = {
  definitions: process.env.OPENAI_MODEL_DEFINITIONS ?? "gpt-4o-mini",
  insightSummary: process.env.OPENAI_MODEL_INSIGHTS ?? "gpt-4o-mini",
  dashboardSummary: process.env.OPENAI_MODEL_DASHBOARD ?? "gpt-4o-mini",
  briefing: process.env.OPENAI_MODEL_BRIEFING ?? "gpt-4o"
} as const;
