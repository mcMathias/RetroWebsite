import { DashboardSkeleton } from "@/components/shared/skeletons";

/**
 * Loading state for the admin dashboard.
 * Shown while server data is being fetched.
 */
export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
