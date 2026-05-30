"use client";

import { useId } from "react";

export function useStableId(prefix: string) {
  const id = useId().replaceAll(":", "");
  return `${prefix}-${id}`;
}
