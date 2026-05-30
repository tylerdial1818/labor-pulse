import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="rounded-lg border border-border bg-panel p-8 text-center shadow-soft">
        <TriangleAlert aria-hidden="true" className="mx-auto h-8 w-8 text-danger" />
        <h1 className="mt-4 text-lg font-semibold">{title}</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
        {actionLabel && onAction ? (
          <Button className="mt-5" type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </main>
  );
}
