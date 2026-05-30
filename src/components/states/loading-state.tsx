import { LoaderCircle } from "lucide-react";

export function LoadingState({ title, description }: { title: string; description: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="rounded-lg border border-border bg-panel p-8 text-center shadow-soft">
        <LoaderCircle aria-hidden="true" className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h1 className="mt-4 text-lg font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </main>
  );
}
