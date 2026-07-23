"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { actionSuccess, actionError, type ActionResult } from "@/lib/errors";
import {
  type ValidatedCart,
  type ValidatedCartItem,
  type CartWarning,
  type ClientCartItem,
} from "@/features/cart/types";

/**
 * Server Action: Validate cart items against the database.
 *
 * This is the source of truth for cart data:
 * - Verifies products exist and are published
 * - Gets current prices from DB (never trusts client prices)
 * - Checks stock availability
 * - Returns warnings for unavailable/reduced stock items
 *
 * Called whenever the cart page loads or before checkout.
 */
export async function validateCartAction(
  items: ClientCartItem[],
): Promise<ActionResult<ValidatedCart>> {
  try {
    if (items.length === 0) {
      return actionSuccess({
        items: [],
        subtotalInOre: 0,
        warnings: [],
      });
    }

    const productIds = items.map((item) => item.productId);

    // Fetch current product data from database
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        platform: true,
        condition: true,
        priceInOre: true,
        salePriceInOre: true,
        quantity: true,
        isPublished: true,
        images: {
          select: { url: true },
          orderBy: { position: "asc" },
          take: 1,
        },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const validatedItems: ValidatedCartItem[] = [];
    const warnings: CartWarning[] = [];

    for (const cartItem of items) {
      const product = productMap.get(cartItem.productId);

      if (!product || !product.isPublished) {
        // Product no longer available
        warnings.push({
          productId: cartItem.productId,
          title: product?.title ?? "Ukendt produkt",
          type: "unavailable",
          message: `"${product?.title ?? "Produkt"}" er ikke længere tilgængelig`,
          availableStock: 0,
          requestedQuantity: cartItem.quantity,
        });
        continue;
      }

      const effectivePrice = product.salePriceInOre ?? product.priceInOre;
      const stockExceeded = cartItem.quantity > product.quantity;
      const isOutOfStock = product.quantity <= 0;

      if (isOutOfStock) {
        warnings.push({
          productId: product.id,
          title: product.title,
          type: "out_of_stock",
          message: `"${product.title}" er udsolgt`,
          availableStock: 0,
          requestedQuantity: cartItem.quantity,
        });
      } else if (stockExceeded) {
        warnings.push({
          productId: product.id,
          title: product.title,
          type: "stock_reduced",
          message: `Kun ${product.quantity} stk. af "${product.title}" tilgængelig`,
          availableStock: product.quantity,
          requestedQuantity: cartItem.quantity,
        });
      }

      validatedItems.push({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        platform: product.platform,
        condition: product.condition,
        imageUrl: product.images[0]?.url ?? null,
        priceInOre: product.priceInOre,
        salePriceInOre: product.salePriceInOre,
        effectivePriceInOre: effectivePrice,
        quantity: isOutOfStock ? 0 : Math.min(cartItem.quantity, product.quantity),
        availableStock: product.quantity,
        stockExceeded,
        isAvailable: !isOutOfStock,
      });
    }

    const subtotalInOre = validatedItems.reduce(
      (sum, item) => sum + item.effectivePriceInOre * item.quantity,
      0,
    );

    return actionSuccess({
      items: validatedItems,
      subtotalInOre,
      warnings,
    });
  } catch (error) {
    console.error("validateCartAction error:", error);
    return actionError("Failed to validate cart");
  }
}

/**
 * Server Action: Add item to cart for authenticated users.
 * Persists cart in database via Cart/CartItem models.
 */
export async function addToCartDbAction(
  productId: string,
  quantity: number = 1,
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return actionError("Authentication required");
    }

    // Verify product exists and has stock
    const product = await db.product.findFirst({
      where: { id: productId, isPublished: true, deletedAt: null },
      select: { id: true, quantity: true },
    });

    if (!product) {
      return actionError("Produktet er ikke tilgængeligt");
    }

    if (product.quantity <= 0) {
      return actionError("Produktet er udsolgt");
    }

    // Get or create cart
    const cart = await db.cart.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    });

    // Add or update cart item
    const existingItem = await db.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    const newQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (newQuantity > product.quantity) {
      return actionError(
        `Kun ${product.quantity} stk. tilgængelig`,
      );
    }

    await db.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: newQuantity },
    });

    return actionSuccess(undefined);
  } catch (error) {
    console.error("addToCartDbAction error:", error);
    return actionError("Kunne ikke tilføje til kurv");
  }
}

/**
 * Server Action: Update cart item quantity for authenticated users.
 */
export async function updateCartItemDbAction(
  productId: string,
  quantity: number,
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return actionError("Authentication required");
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return actionError("Cart not found");
    }

    if (quantity <= 0) {
      await db.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
    } else {
      // Verify stock
      const product = await db.product.findFirst({
        where: { id: productId, isPublished: true, deletedAt: null },
        select: { quantity: true },
      });

      if (!product) {
        return actionError("Produktet er ikke tilgængeligt");
      }

      const cappedQuantity = Math.min(quantity, product.quantity);

      await db.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity: cappedQuantity },
      });
    }

    return actionSuccess(undefined);
  } catch (error) {
    console.error("updateCartItemDbAction error:", error);
    return actionError("Kunne ikke opdatere kurv");
  }
}

/**
 * Server Action: Remove item from cart for authenticated users.
 */
export async function removeFromCartDbAction(
  productId: string,
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return actionError("Authentication required");
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) return actionSuccess(undefined);

    await db.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    }).catch(() => {
      // Item might already be deleted
    });

    return actionSuccess(undefined);
  } catch (error) {
    console.error("removeFromCartDbAction error:", error);
    return actionError("Kunne ikke fjerne fra kurv");
  }
}

/**
 * Server Action: Clear cart for authenticated users.
 */
export async function clearCartDbAction(): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return actionError("Authentication required");
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) return actionSuccess(undefined);

    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return actionSuccess(undefined);
  } catch (error) {
    console.error("clearCartDbAction error:", error);
    return actionError("Kunne ikke tømme kurv");
  }
}

/**
 * Server Action: Get cart items for authenticated users.
 * Returns raw client cart items for syncing with the context.
 */
export async function getDbCartAction(): Promise<ActionResult<ClientCartItem[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return actionSuccess([]);
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          select: { productId: true, quantity: true },
        },
      },
    });

    if (!cart) {
      return actionSuccess([]);
    }

    return actionSuccess(
      cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    );
  } catch (error) {
    console.error("getDbCartAction error:", error);
    return actionError("Kunne ikke hente kurv");
  }
}
