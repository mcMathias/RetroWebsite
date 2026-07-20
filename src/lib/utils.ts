import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 * This is the standard utility for all component className props.
 * Also re-exported from @/lib/utils/index.ts for convenience.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
