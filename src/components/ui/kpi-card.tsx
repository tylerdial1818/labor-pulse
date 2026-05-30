import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type KpiCardProps = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  description: string;
};

export function KpiCard({ label, value, delta, trend, description }: KpiCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
            trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          )}
        >
          <TrendIcon aria-hidden="true" className="h-3.5 w-3.5" />
          {delta}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-normal text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </Card>
  );
}
