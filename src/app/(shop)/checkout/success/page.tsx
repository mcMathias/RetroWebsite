import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils/index";

export const metadata: Metadata = {
  title: "Ordre bekræftet",
  description: "Din ordre er modtaget",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Checkout success page.
 *
 * This page DOES NOT mark the order as paid.
 * It fetches order status from the database (set by webhook).
 * If the webhook hasn't fired yet, shows a "processing" state.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/");
  }

  // Find the order by Stripe session ID
  const order = await db.order.findFirst({
    where: { stripeSessionId: sessionId },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      totalInOre: true,
      paidAt: true,
      items: {
        select: {
          title: true,
          quantity: true,
          priceInOre: true,
        },
      },
    },
  });

  // If order not found, try to get info from Stripe session
  if (!order) {
    // The webhook might not have fired yet, or there's a mismatch
    // Show a generic processing state
    return <ProcessingState />;
  }

  const isPaid = order.status === "CONFIRMED" || order.paidAt !== null;
  const isPending = order.status === "PENDING";

  if (isPending) {
    return <ProcessingState orderNumber={order.orderNumber} />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Tak for din ordre!</h1>
        <p className="text-muted-foreground mt-2">
          Din betaling er modtaget, og din ordre er bekræftet.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Ordrenummer</span>
            <span className="font-mono font-semibold">{order.orderNumber}</span>
          </div>

          <div className="border-t pt-4 space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.priceInOre * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.totalInOre)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Du modtager en ordrebekræftelse på email.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button render={<Link href="/products" />} nativeButton={false}>
            Fortsæt med at handle
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Processing state shown when webhook hasn't fired yet.
 */
function ProcessingState({ orderNumber }: { orderNumber?: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <Clock className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold">Betaling behandles</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Din betaling er modtaget og behandles. Du modtager en bekræftelse
          snarest.
        </p>
        {orderNumber && (
          <p className="text-sm text-muted-foreground mt-4">
            Ordrenummer: <span className="font-mono font-semibold">{orderNumber}</span>
          </p>
        )}
        <div className="mt-8">
          <Button variant="outline" render={<Link href="/products" />} nativeButton={false}>
            Tilbage til shoppen
          </Button>
        </div>
      </div>
    </div>
  );
}
