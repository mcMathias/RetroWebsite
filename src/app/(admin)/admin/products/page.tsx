import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared";
import { DataSearch, DataPagination } from "@/components/tables";
import { ProductTable } from "@/features/products/components";
import { EmptyState } from "@/components/shared";
import { Package } from "lucide-react";
import { getProducts } from "@/features/products/repository";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    platform?: string;
    condition?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const search = params.search ?? "";

  const { data: products, pagination } = await getProducts({
    page,
    pageSize: 50,
    search: search || undefined,
    platform: params.platform || undefined,
    condition: params.condition || undefined,
    sortField: "createdAt",
    sortDirection: "desc",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description={`${pagination.totalCount} products in catalog`}
      >
        <Button render={<Link href="/admin/products/new" />} nativeButton={false}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
        </Button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <DataSearch placeholder="Search products by title, SKU..." />
      </div>

      {/* Table or Empty State */}
      {products.length === 0 && !search ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Start adding your retro game collection to the catalog."
        >
          <Button render={<Link href="/admin/products/new" />} nativeButton={false}>
              <Plus className="h-4 w-4 mr-2" />
              Add your first product
          </Button>
        </EmptyState>
      ) : products.length === 0 && search ? (
        <EmptyState
          icon={Package}
          title="No results"
          description={`No products found for "${search}"`}
        />
      ) : (
        <>
          <ProductTable products={products} />
          <DataPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
          />
        </>
      )}
    </div>
  );
}
