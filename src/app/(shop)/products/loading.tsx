import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for the products page.
 * Shows skeleton cards while data is being fetched.
 */
export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-32 mt-2" />
      </div>

      {/* Filter skeletons */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[160px]" />
        </div>
      </div>

      {/* Grid skeletons */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
