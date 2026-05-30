import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-panel p-8 text-center">
      <Inbox aria-hidden="true" className="h-8 w-8 text-muted-foreground" />
      <h2 className="mt-3 text-base font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
