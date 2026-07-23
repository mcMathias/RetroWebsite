"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/features/cart/context";
import { validateCartAction } from "@/features/cart/actions";
import { createCheckoutSessionAction } from "@/features/checkout/actions";
import { type ValidatedCart, type CartWarning } from "@/features/cart/types";
import { CartItemRow } from "./cart-item-row";
import { formatPrice } from "@/lib/utils/index";
import { toast } from "sonner";

/**
 * Full cart view with validated items, totals, and stock warnings.
 */
export function CartView() {
  const { items, isLoading, clearCart } = useCart();
  const [validatedCart, setValidatedCart] = useState<ValidatedCart | null>(null);
  const [, startValidation] = useTransition();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Validate cart whenever items change
  useEffect(() => {
    if (isLoading) return;

    startValidation(async () => {
      const result = await validateCartAction(items);
      if (result.success) {
        setValidatedCart(result.data);
      }
    });
  }, [items, isLoading]);

  async function handleClearCart() {
    try {
      await clearCart();
      toast.success("Kurv tømt");
    } catch {
      toast.error("Kunne ikke tømme kurv");
    }
  }

  async function handleCheckout() {
    setIsCheckingOut(true);
    try {
      const result = await createCheckoutSessionAction(items);
      if (result.success) {
        // Clear cart client-side (order is now in DB)
        await clearCart();
        // Redirect to Stripe Checkout
        window.location.href = result.data.url;
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Checkout fejlede. Prøv igen.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  // Loading state
  if (isLoading || (items.length > 0 && !validatedCart)) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Din kurv er tom</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Udforsk vores udvalg af retro gaming produkter og find dine yndlingsspil.
        </p>
        <Button render={<Link href="/products" />} nativeButton={false}>
          Se produkter
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (!validatedCart) return null;

  const hasWarnings = validatedCart.warnings.length > 0;
  const hasAvailableItems = validatedCart.items.some((i) => i.isAvailable && i.quantity > 0);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        {/* Warnings */}
        {hasWarnings && (
          <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30">
            <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2">
              ⚠️ Bemærk
            </h3>
            <ul className="space-y-1">
              {validatedCart.warnings.map((warning: CartWarning) => (
                <li
                  key={warning.productId}
                  className="text-sm text-orange-700 dark:text-orange-300"
                >
                  {warning.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Items list */}
        <div className="divide-y">
          {validatedCart.items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}
        </div>

        {/* Clear cart */}
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleClearCart}>
            <Trash2 className="h-4 w-4 mr-1" />
            Tøm kurv
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Ordresammendrag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatPrice(validatedCart.subtotalInOre)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fragt</span>
              <span className="text-muted-foreground">Beregnes ved checkout</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(validatedCart.subtotalInOre)}</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!hasAvailableItems || hasWarnings || isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {isCheckingOut ? "Opretter checkout..." : "Gå til checkout"}
            </Button>

            {hasWarnings && (
              <p className="text-xs text-muted-foreground text-center">
                Ret venligst problemerne ovenfor, før du fortsætter.
              </p>
            )}

            <div className="text-center">
              <Link
                href="/products"
                className="text-sm text-primary hover:underline"
              >
                Fortsæt med at handle
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
