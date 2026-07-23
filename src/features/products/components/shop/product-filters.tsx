"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect } from "react";

const platforms = [
  { value: "NES", label: "NES" },
  { value: "SNES", label: "SNES" },
  { value: "N64", label: "N64" },
  { value: "GAMECUBE", label: "GameCube" },
  { value: "WII", label: "Wii" },
  { value: "SWITCH", label: "Switch" },
  { value: "GAME_BOY", label: "Game Boy" },
  { value: "GAME_BOY_COLOR", label: "Game Boy Color" },
  { value: "GAME_BOY_ADVANCE", label: "GBA" },
  { value: "PS1", label: "PS1" },
  { value: "PS2", label: "PS2" },
  { value: "PS3", label: "PS3" },
  { value: "PS4", label: "PS4" },
  { value: "PS5", label: "PS5" },
  { value: "PSP", label: "PSP" },
  { value: "XBOX", label: "Xbox" },
  { value: "XBOX_360", label: "Xbox 360" },
  { value: "XBOX_ONE", label: "Xbox One" },
  { value: "MEGA_DRIVE", label: "Mega Drive" },
  { value: "DREAMCAST", label: "Dreamcast" },
  { value: "SATURN", label: "Saturn" },
  { value: "GAME_GEAR", label: "Game Gear" },
];

const conditions = [
  { value: "MINT", label: "Mint" },
  { value: "NEAR_MINT", label: "Near Mint" },
  { value: "VERY_GOOD", label: "Very Good" },
  { value: "GOOD", label: "Good" },
  { value: "ACCEPTABLE", label: "Acceptable" },
  { value: "POOR", label: "Poor" },
];

const regions = [
  { value: "PAL", label: "PAL" },
  { value: "NTSC_U", label: "NTSC-U" },
  { value: "NTSC_J", label: "NTSC-J" },
  { value: "REGION_FREE", label: "Region Free" },
];

const sortOptions = [
  { value: "newest", label: "Nyeste først" },
  { value: "price_asc", label: "Pris: Lav → Høj" },
  { value: "price_desc", label: "Pris: Høj → Lav" },
  { value: "name", label: "Navn: A → Z" },
];

/**
 * Product filter toolbar.
 * Uses URL search params for state (SSR-friendly).
 */
export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // Reset pagination on filter change
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams],
  );

  // Sync debounced search to URL
  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    if (debouncedSearch !== currentSearch) {
      updateParam("search", debouncedSearch || null);
    }
  }, [debouncedSearch, searchParams, updateParam]);

  const hasActiveFilters =
    searchParams.has("platform") ||
    searchParams.has("condition") ||
    searchParams.has("region") ||
    searchParams.has("search") ||
    searchParams.has("brand") ||
    searchParams.has("sale");

  function clearFilters() {
    const sort = searchParams.get("sort");
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    router.push(`/products?${params.toString()}`);
    setSearchInput("");
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Søg efter spil, konsol..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select
          value={searchParams.get("platform") ?? ""}
          onValueChange={(v) => updateParam("platform", v || null)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("condition") ?? ""}
          onValueChange={(v) => updateParam("condition", v || null)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("region") ?? ""}
          onValueChange={(v) => updateParam("region", v || null)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("sort") ?? "newest"}
          onValueChange={(v) => updateParam("sort", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sortering" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Ryd filtre
          </Button>
        )}
      </div>
    </div>
  );
}
