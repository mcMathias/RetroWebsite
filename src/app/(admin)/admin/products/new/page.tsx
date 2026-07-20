import { PageHeader } from "@/components/shared";
import { ProductForm } from "@/features/products/components";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Product"
        description="Create a new product in your catalog."
      />
      <ProductForm mode="create" />
    </div>
  );
}
