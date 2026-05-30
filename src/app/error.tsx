"use client";

import { ErrorState } from "@/components/states/error-state";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      title="Dashboard unavailable"
      description="Refresh the view or check the upstream data connection."
      actionLabel="Try again"
      onAction={reset}
    />
  );
}
