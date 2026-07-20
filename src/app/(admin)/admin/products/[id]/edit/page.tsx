import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared";
import { ProductForm } from "@/features/products/components";
import { getProductById } from "@/features/products/repository";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Product"
        description={product.title}
      />
      <ProductForm product={product} mode="edit" />
    </div>
  );
}
