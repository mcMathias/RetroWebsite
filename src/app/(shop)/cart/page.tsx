import type { Metadata } from "next";
import { CartView } from "@/features/cart/components";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Indkøbskurv",
  description: "Din indkøbskurv hos RetroShop",
};

/**
 * Cart page.
 * Client-rendered cart with server-side validation.
 */
export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Indkøbskurv</h1>
      <CartView />
      <Toaster position="top-right" richColors />
    </div>
  );
}
