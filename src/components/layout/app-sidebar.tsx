import { BarChart3, FileText, Gauge, Settings, ShieldCheck } from "lucide-react";
import { appConfig } from "@/config/app";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Overview", icon: Gauge, active: true },
  { label: "Performance", icon: BarChart3, active: false },
  { label: "Reports", icon: FileText, active: false },
  { label: "Security", icon: ShieldCheck, active: false },
  { label: "Settings", icon: Settings, active: false }
];

export function AppSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-panel/90 px-4 py-5 lg:block">
      <div className="px-2">
        <p className="text-xs font-semibold uppercase text-primary">{appConfig.environment}</p>
        <h1 className="mt-2 text-xl font-semibold tracking-normal">{appConfig.name}</h1>
      </div>
      <nav aria-label="Main navigation" className="mt-8 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
              item.active ? "bg-cyan-50 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon aria-hidden="true" className="h-4 w-4" />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
