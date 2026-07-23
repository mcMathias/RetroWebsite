import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for the product detail page.
 */
export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
