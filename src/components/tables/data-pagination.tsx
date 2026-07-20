"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

/**
 * Reusable pagination component for data tables.
 * Updates URL search params for server-side pagination.
 */
export function DataPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
}: DataPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createUrl = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {totalCount} results
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => router.push(createUrl(page - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground px-2">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => router.push(createUrl(page + 1))}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
