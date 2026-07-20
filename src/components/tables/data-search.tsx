"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "@/hooks/use-debounce";

interface DataSearchProps {
  placeholder?: string;
  paramName?: string;
}

/**
 * Reusable search input for data tables.
 * Debounces input and syncs with URL search params.
 */
export function DataSearch({
  placeholder = "Search...",
  paramName = "search",
}: DataSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentValue = searchParams.get(paramName) ?? "";
  const [inputValue, setInputValue] = useState(currentValue);

  const updateUrl = useDebouncedCallback((value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(paramName, value);
        params.delete("page"); // Reset to page 1 on search
      } else {
        params.delete(paramName);
      }
      router.push(`${pathname}?${params.toString()}`);
    });
  }, 300);

  const handleChange = (value: string) => {
    setInputValue(value);
    updateUrl(value);
  };

  const handleClear = () => {
    setInputValue("");
    updateUrl("");
  };

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9 pr-9"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
