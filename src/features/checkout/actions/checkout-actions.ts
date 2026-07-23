"use server";

import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { actionSuccess, actionError, type ActionResult } from "@/lib/errors";
import { type ClientCartItem } from "@/features/cart/types";
import { nanoid } from "nanoid";

/**
 * Server Action: Create a Stripe Checkout Session.
 *
 * Security flow:
 * 1. Receives cart items (only productId + quantity) from client
 * 2. Fetches current prices from database (NEVER trusts client prices)
 * 3. Validates stock availability
 * 4. Creates a PENDING order in the database
 * 5. Creates Stripe Checkout Session with server-verified prices
 * 6. Returns the Stripe session URL for redirect
 *
 * Inventory strategy (MVP):
 * - Stock is NOT reserved at checkout creation
 * - Stock is reduced atomically ONLY on successful payment (webhook)
 * - This means a product could sell out between checkout start and payment
 * - The webhook handles this gracefully (refund if stock unavailable)
 */
export async function createCheckoutSessionAction(
  cartItems: ClientCartItem[],
): Promise<ActionResult<{ url: string }>> {
  try {
    if (cartItems.length === 0) {
      return actionError("Kurven er tom");
    }

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return actionError("Du skal være logget ind for at gennemføre et køb");
    }

    // 1. Fetch products from database with current prices
    const productIds = cartItems.map((item) => item.productId);
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        isPublished: true,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        priceInOre: true,
        salePriceInOre: true,
        quantity: true,
        costPriceInOre: true,
        images: {
          select: { url: true },
          orderBy: { position: "asc" },
          take: 1,
        },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // 2. Validate all items exist, are available, and have stock
    const errors: string[] = [];
    const validatedItems: Array<{
      productId: string;
      title: string;
      priceInOre: number;
      costPriceInOre: number | null;
      quantity: number;
      imageUrl: string | null;
    }> = [];

    for (const cartItem of cartItems) {
      const product = productMap.get(cartItem.productId);

      if (!product) {
        errors.push(`Produktet er ikke længere tilgængeligt`);
        continue;
      }

      if (product.quantity <= 0) {
        errors.push(`"${product.title}" er udsolgt`);
        continue;
      }

      if (cartItem.quantity > product.quantity) {
        errors.push(
          `Kun ${product.quantity} stk. af "${product.title}" tilgængelig`,
        );
        continue;
      }

      const effectivePrice = product.salePriceInOre ?? product.priceInOre;

      validatedItems.push({
        productId: product.id,
        title: product.title,
        priceInOre: effectivePrice,
        costPriceInOre: product.costPriceInOre,
        quantity: cartItem.quantity,
        imageUrl: product.images[0]?.url ?? null,
      });
    }

    if (errors.length > 0) {
      return actionError(errors.join(". "));
    }

    if (validatedItems.length === 0) {
      return actionError("Ingen gyldige produkter i kurven");
    }

    // 3. Calculate server-side totals
    const subtotalInOre = validatedItems.reduce(
      (sum, item) => sum + item.priceInOre * item.quantity,
      0,
    );

    // 4. Generate order number
    const orderNumber = `RS-${nanoid(8).toUpperCase()}`;

    // 5. Create pending order in database
    const order = await db.order.create({
      data: {
        orderNumber,
        userId,
        status: "PENDING",
        subtotalInOre,
        shippingInOre: 0, // Will be calculated when shipping is implemented
        discountInOre: 0,
        totalInOre: subtotalInOre,
        items: {
          create: validatedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceInOre: item.priceInOre,
            title: item.title,
          })),
        },
        history: {
          create: {
            status: "PENDING",
            note: "Order created — awaiting payment",
          },
        },
      },
    });

    // 6. Create Stripe Checkout Session with server-verified prices
    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session?.user?.email ?? undefined,
      line_items: validatedItems.map((item) => ({
        price_data: {
          currency: "dkk",
          unit_amount: item.priceInOre, // Already in øre (smallest unit)
          product_data: {
            name: item.title,
            ...(item.imageUrl && { images: [item.imageUrl] }),
          },
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: order.id,
        orderNumber,
      },
      // Collect shipping address from customer
      shipping_address_collection: {
        allowed_countries: ["DK"],
      },
      // Collect billing address
      billing_address_collection: "required",
      // URLs
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel?order_id=${order.id}`,
      // Link Stripe session to our order
      client_reference_id: order.id,
      // Expiration (30 minutes)
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    // 7. Save Stripe session ID on the order
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    if (!stripeSession.url) {
      return actionError("Kunne ikke oprette checkout-session");
    }

    return actionSuccess({ url: stripeSession.url });
  } catch (error) {
    console.error("createCheckoutSessionAction error:", error);
    return actionError(
      error instanceof Error ? error.message : "Checkout fejlede",
    );
  }
}
