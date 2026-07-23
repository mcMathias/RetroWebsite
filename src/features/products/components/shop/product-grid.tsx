import { type ShopProductCard } from "@/features/products/repository";
import { ProductCard } from "./product-card";

/**
 * Responsive product grid for the shop.
 */
export function ProductGrid({ products }: { products: ShopProductCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
