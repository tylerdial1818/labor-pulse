import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { DashboardContent } from "@/features/dashboard/dashboard-content";
import { getDashboardData } from "@/server/dashboard-data";

export async function DashboardShell() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen lg:flex">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <TopBar />
        <main className="space-y-6 px-4 py-6 lg:px-8">
          <DashboardContent data={data} />
        </main>
      </div>
    </div>
  );
}
