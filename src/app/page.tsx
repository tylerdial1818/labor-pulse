import { DashboardShell } from "@/features/dashboard/dashboard-shell";

// Render per request so headline cards reflect the latest data in the store
// (e.g. immediately after a FRED refresh) instead of build-time snapshots.
export const dynamic = "force-dynamic";

export default function Home() {
  return <DashboardShell />;
}
