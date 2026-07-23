import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ShopHeader, ShopFooter } from "@/components/layout/shop";
import { CartProvider } from "@/features/cart/context";
import { getCurrentUser } from "@/lib/auth/helpers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

/**
 * Shop layout - public-facing storefront.
 * This wraps all pages under the (shop) route group.
 */
export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <CartProvider isAuthenticated={!!user}>
      <div className="flex min-h-screen flex-col">
        <ShopHeader />
        <main className="flex-1">{children}</main>
        <ShopFooter />
      </div>
    </CartProvider>
  );
}
