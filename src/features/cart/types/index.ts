/**
 * Cart types shared between client and server.
 */

/**
 * A validated cart item with server-verified data.
 * Prices and stock come from the database, never from the client.
 */
export interface ValidatedCartItem {
  productId: string;
  slug: string;
  title: string;
  platform: string;
  condition: string;
  imageUrl: string | null;
  priceInOre: number;
  salePriceInOre: number | null;
  /** The effective price (sale price if available, otherwise regular) */
  effectivePriceInOre: number;
  quantity: number;
  /** Available stock in database */
  availableStock: number;
  /** Whether the requested quantity exceeds available stock */
  stockExceeded: boolean;
  /** Whether the product is still published and available */
  isAvailable: boolean;
}

/**
 * Server-validated cart state.
 */
export interface ValidatedCart {
  items: ValidatedCartItem[];
  subtotalInOre: number;
  /** Items that have stock issues */
  warnings: CartWarning[];
}

export interface CartWarning {
  productId: string;
  title: string;
  type: "out_of_stock" | "stock_reduced" | "unavailable";
  message: string;
  availableStock: number;
  requestedQuantity: number;
}

/**
 * Client-side cart item (minimal - only what the client needs to track).
 * All pricing/stock is verified server-side.
 */
export interface ClientCartItem {
  productId: string;
  quantity: number;
}
