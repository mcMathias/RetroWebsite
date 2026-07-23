"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { type ClientCartItem } from "@/features/cart/types";
import {
  addToCartDbAction,
  updateCartItemDbAction,
  removeFromCartDbAction,
  clearCartDbAction,
  getDbCartAction,
} from "@/features/cart/actions";

const STORAGE_KEY = "retroshop-cart";

/**
 * Cart context state.
 */
interface CartState {
  items: ClientCartItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

type CartAction =
  | { type: "SET_ITEMS"; items: ClientCartItem[] }
  | { type: "ADD_ITEM"; productId: string; quantity: number }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "CLEAR" }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_AUTHENTICATED"; isAuthenticated: boolean };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.items, isLoading: false };
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.productId,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.productId
              ? { ...i, quantity: i.quantity + action.quantity }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { productId: action.productId, quantity: action.quantity },
        ],
      };
    }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: action.quantity }
            : i,
        ),
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.isAuthenticated };
    default:
      return state;
  }
}

/**
 * Cart context value exposed to consumers.
 */
interface CartContextValue {
  items: ClientCartItem[];
  itemCount: number;
  isLoading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Cart provider.
 *
 * Architecture:
 * - Guest users: cart stored in localStorage
 * - Authenticated users: cart persisted in database via server actions
 * - On login: localStorage cart is merged into DB cart
 * - Optimistic updates for instant UI feedback
 */
export function CartProvider({
  children,
  isAuthenticated = false,
}: {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true,
    isAuthenticated,
  });

  const initializedRef = useRef(false);

  // Initialize cart from storage or database
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    async function initCart() {
      if (isAuthenticated) {
        // Load from database
        const result = await getDbCartAction();
        if (result.success) {
          dispatch({ type: "SET_ITEMS", items: result.data });

          // Check if there are localStorage items to merge
          const localItems = getLocalStorageCart();
          if (localItems.length > 0) {
            // Merge local cart into DB
            for (const item of localItems) {
              await addToCartDbAction(item.productId, item.quantity);
            }
            clearLocalStorageCart();
            // Reload from DB after merge
            const merged = await getDbCartAction();
            if (merged.success) {
              dispatch({ type: "SET_ITEMS", items: merged.data });
            }
          }
        } else {
          dispatch({ type: "SET_LOADING", isLoading: false });
        }
      } else {
        // Load from localStorage
        const items = getLocalStorageCart();
        dispatch({ type: "SET_ITEMS", items });
      }
    }

    initCart();
  }, [isAuthenticated]);

  // Persist to localStorage when items change (guest only)
  useEffect(() => {
    if (!isAuthenticated && !state.isLoading) {
      setLocalStorageCart(state.items);
    }
  }, [state.items, isAuthenticated, state.isLoading]);

  const addItem = useCallback(
    async (productId: string, quantity: number = 1) => {
      // Optimistic update
      dispatch({ type: "ADD_ITEM", productId, quantity });

      if (isAuthenticated) {
        const result = await addToCartDbAction(productId, quantity);
        if (!result.success) {
          // Rollback on failure
          dispatch({ type: "REMOVE_ITEM", productId });
          throw new Error(result.error);
        }
      }
    },
    [isAuthenticated],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      // Optimistic update
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity });

      if (isAuthenticated) {
        const result = await updateCartItemDbAction(productId, quantity);
        if (!result.success) {
          // Reload from DB on failure
          const dbCart = await getDbCartAction();
          if (dbCart.success) {
            dispatch({ type: "SET_ITEMS", items: dbCart.data });
          }
          throw new Error(result.error);
        }
      }
    },
    [isAuthenticated],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      // Optimistic update
      dispatch({ type: "REMOVE_ITEM", productId });

      if (isAuthenticated) {
        await removeFromCartDbAction(productId);
      }
    },
    [isAuthenticated],
  );

  const clearCart = useCallback(async () => {
    dispatch({ type: "CLEAR" });

    if (isAuthenticated) {
      await clearCartDbAction();
    }
  }, [isAuthenticated]);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        isLoading: state.isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook to access cart context.
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// localStorage helpers
function getLocalStorageCart(): ClientCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ClientCartItem[];
  } catch {
    return [];
  }
}

function setLocalStorageCart(items: ClientCartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

function clearLocalStorageCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
