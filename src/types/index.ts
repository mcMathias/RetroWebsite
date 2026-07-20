/**
 * Shared application types.
 * These are framework-agnostic types used across features.
 */

/**
 * Standard paginated response shape.
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Standard pagination input.
 */
export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

/**
 * Sort direction.
 */
export type SortDirection = "asc" | "desc";

/**
 * Standard sort input.
 */
export interface SortInput<T extends string = string> {
  field: T;
  direction: SortDirection;
}

/**
 * Standard filter operator for advanced filtering.
 */
export type FilterOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in";

/**
 * Base entity with common fields.
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Breadcrumb item for navigation.
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Select option used in forms.
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * Async state for UI loading patterns.
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
