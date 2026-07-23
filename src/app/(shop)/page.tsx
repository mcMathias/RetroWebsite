import Link from "next/link";
import { Gamepad2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getShopProducts } from "@/features/products/repository";
import { ProductGrid } from "@/features/products/components/shop";

/**
 * Shop landing page.
 * Shows hero section and featured/newest products.
 */
export default async function HomePage() {
  // Fetch newest published products for the homepage
  const { data: newestProducts } = await getShopProducts({
    pageSize: 8,
    sort: "newest",
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Gamepad2 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              RetroShop
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Danmarks bedste markedsplads for retro gaming. Find dine yndlingsspil
              fra Nintendo, PlayStation, Xbox og Sega — alle testet og graded med ærlig vurdering.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" render={<Link href="/products" />} nativeButton={false}>
                  Se alle produkter
                  <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/products?brand=nintendo" />} nativeButton={false}>
                Nintendo
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/products?brand=playstation" />} nativeButton={false}>
                PlayStation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newest Products */}
      {newestProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Nyeste produkter</h2>
            <Button variant="ghost" render={<Link href="/products?sort=newest" />} nativeButton={false}>
              Se alle
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <ProductGrid products={newestProducts} />
        </section>
      )}
    </div>
  );
}
