import { CalendarDays, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="flex flex-col gap-4 border-b border-border bg-panel/80 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Executive overview</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-normal text-foreground">Revenue and account health</h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" type="button">
          <Search aria-hidden="true" className="h-4 w-4" />
          Search
        </Button>
        <Button variant="secondary" type="button">
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          May 2026
        </Button>
        <Button type="button">
          <Download aria-hidden="true" className="h-4 w-4" />
          Export
        </Button>
      </div>
    </header>
  );
}
