import { TopBar } from "@/components/layout/top-bar";
import { DashboardContent } from "@/features/dashboard/dashboard-content";
import { getDashboardData } from "@/server/dashboard-data";

export async function DashboardShell() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-4 pb-12 sm:px-6 lg:px-8">
        <DashboardContent data={data} />
      </main>
    </div>
  );
}
