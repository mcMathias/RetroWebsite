import type { Metadata } from "next";
import { Suspense } from "react";
import { Package } from "lucide-react";
import { getShopProducts, type ShopProductListParams } from "@/features/products/repository";
import { ProductGrid, ProductFilters } from "@/features/products/components/shop";
import { EmptyState } from "@/components/shared";
import { DataPagination } from "@/components/tables";

export const metadata: Metadata = {
  title: "Produkter",
  description: "Udforsk vores udvalg af retro gaming spil og konsoller. Nintendo, PlayStation, Xbox, Sega og meget mere.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    platform?: string;
    brand?: string;
    condition?: string;
    region?: string;
    minPrice?: string;
    maxPrice?: string;
    sale?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const queryParams: ShopProductListParams = {
    page: params.page ? parseInt(params.page, 10) : 1,
    pageSize: 24,
    search: params.search || undefined,
    platform: params.platform || undefined,
    brand: params.brand || undefined,
    condition: params.condition || undefined,
    region: params.region || undefined,
    minPrice: params.minPrice ? parseInt(params.minPrice, 10) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : undefined,
    sale: params.sale === "true" ? true : undefined,
    sort: (params.sort as ShopProductListParams["sort"]) || "newest",
  };

  const { data: products, pagination } = await getShopProducts(queryParams);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Produkter
        </h1>
        <p className="text-muted-foreground mt-1">
          {pagination.totalCount > 0
            ? `${pagination.totalCount} produkt${pagination.totalCount !== 1 ? "er" : ""} fundet`
            : "Ingen produkter fundet"}
        </p>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <ProductFilters />
      </Suspense>

      {/* Product Grid or Empty State */}
      <div className="mt-6">
        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Ingen produkter fundet"
            description="Prøv at ændre dine filtre eller søgekriterier."
          />
        ) : (
          <>
            <ProductGrid products={products} />
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <DataPagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  totalCount={pagination.totalCount}
                  pageSize={pagination.pageSize}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
