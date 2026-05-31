import "server-only";

export const MODELS = {
  definitions: process.env.OPENAI_MODEL_DEFINITIONS ?? "gpt-4o-mini"
} as const;
