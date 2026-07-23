import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

/**
 * POST /api/webhooks/stripe
 *
 * Stripe webhook handler — the SOURCE OF TRUTH for payment status.
 *
 * This endpoint:
 * 1. Verifies the webhook signature (security)
 * 2. Handles checkout.session.completed events
 * 3. Confirms the order (PENDING → CONFIRMED)
 * 4. Atomically reduces inventory (with race condition protection)
 * 5. Is fully idempotent (safe to receive duplicate events)
 *
 * IMPORTANT: This endpoint must NOT require authentication.
 * It is called directly by Stripe's servers.
 */
export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    // 1. Verify webhook signature
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    const stripe = getStripe();

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 },
      );
    }

    // 2. Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "checkout.session.expired": {
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;
      }
      default:
        // Ignore other events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

/**
 * Handle successful checkout session.
 *
 * Idempotency: If the order is already CONFIRMED (or beyond),
 * we skip processing entirely. This handles duplicate webhook delivery.
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId ?? session.client_reference_id;

  if (!orderId) {
    console.error("Webhook: No orderId in session metadata");
    return;
  }

  // Fetch the order
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    console.error(`Webhook: Order ${orderId} not found`);
    return;
  }

  // Idempotency check: skip if already processed
  if (order.status !== "PENDING") {
    console.log(`Webhook: Order ${orderId} already processed (status: ${order.status})`);
    return;
  }

  // Atomically reduce inventory for each order item
  // Use a transaction to ensure all-or-nothing
  try {
    await db.$transaction(async (tx) => {
      for (const item of order.items) {
        // Atomic decrement with check for sufficient stock
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            quantity: { gte: item.quantity }, // Only if stock is sufficient
          },
          data: {
            quantity: { decrement: item.quantity },
          },
        });

        if (updated.count === 0) {
          // Stock insufficient — this is a race condition edge case
          // For MVP: log it and continue (product may have been oversold)
          // In production: trigger automatic refund
          console.warn(
            `Webhook: Insufficient stock for product ${item.productId} ` +
            `(wanted ${item.quantity}). Order ${orderId} may need manual review.`,
          );
        }
      }

      // Update order status to CONFIRMED
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED",
          stripePaymentId: session.payment_intent as string ?? null,
          paidAt: new Date(),
          // Store customer info from Stripe
          customerNote: session.customer_details?.name
            ? `${session.customer_details.name} (${session.customer_details.email})`
            : null,
        },
      });

      // Add order history entry
      await tx.orderHistory.create({
        data: {
          orderId,
          status: "CONFIRMED",
          note: `Payment confirmed via Stripe (${session.payment_intent})`,
        },
      });
    });

    console.log(`Webhook: Order ${orderId} confirmed successfully`);
  } catch (error) {
    console.error(`Webhook: Transaction failed for order ${orderId}:`, error);
    throw error; // Retry the webhook
  }
}

/**
 * Handle expired checkout session.
 * Cancel the pending order if payment was never completed.
 */
async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId ?? session.client_reference_id;

  if (!orderId) return;

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });

  if (!order || order.status !== "PENDING") return;

  await db.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  await db.orderHistory.create({
    data: {
      orderId,
      status: "CANCELLED",
      note: "Checkout session expired without payment",
    },
  });

  console.log(`Webhook: Order ${orderId} cancelled (session expired)`);
}
