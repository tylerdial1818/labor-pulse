import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "success" && "bg-emerald-50 text-emerald-700",
        tone === "warning" && "bg-amber-50 text-amber-700",
        tone === "danger" && "bg-red-50 text-red-700",
        className
      )}
      {...props}
    />
  );
}
