import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Checkout annulleret",
  description: "Din checkout blev annulleret",
};

/**
 * Checkout cancel page.
 * Shown when the customer cancels the Stripe Checkout flow.
 * The order remains PENDING and will be auto-cancelled when the session expires.
 */
export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Checkout annulleret</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Din betaling blev ikke gennemført. Dine produkter er stadig i kurven,
          så du kan prøve igen, når du er klar.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button render={<Link href="/cart" />} nativeButton={false}>
            Tilbage til kurv
          </Button>
          <Button variant="outline" render={<Link href="/products" />} nativeButton={false}>
            Fortsæt med at handle
          </Button>
        </div>
      </div>
    </div>
  );
}
