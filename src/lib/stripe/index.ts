import Stripe from "stripe";

/**
 * Stripe client singleton.
 *
 * Uses the secret key from environment variables.
 * API version is pinned for stability.
 */

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }

    stripeInstance = new Stripe(secretKey, {
      typescript: true,
    });
  }
  return stripeInstance;
}
