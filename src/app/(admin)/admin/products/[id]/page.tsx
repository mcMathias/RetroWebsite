import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared";
import { getProductById } from "@/features/products/repository";
import { formatPrice } from "@/lib/utils/index";
import { Pencil } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={product.title}>
        <Button render={<Link href={`/admin/products/${product.id}/edit`} />} nativeButton={false}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Product
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.description && (
                <p className="text-sm">{product.description}</p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="Platform" value={product.platform.replace(/_/g, " ")} />
                <InfoRow label="Condition" value={product.condition.replace(/_/g, " ")} />
                <InfoRow label="Region" value={product.region.replace(/_/g, "-")} />
                <InfoRow label="SKU" value={product.sku} mono />
                {product.barcode && <InfoRow label="Barcode" value={product.barcode} mono />}
                {product.serialNumber && <InfoRow label="Serial #" value={product.serialNumber} mono />}
              </div>
            </CardContent>
          </Card>

          {/* Completeness */}
          <Card>
            <CardHeader>
              <CardTitle>Completeness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant={product.isOriginal ? "default" : "secondary"}>
                  {product.isOriginal ? "Original" : "Reproduction"}
                </Badge>
                <Badge variant={product.hasManual ? "default" : "outline"}>
                  {product.hasManual ? "Manual ✓" : "No Manual"}
                </Badge>
                <Badge variant={product.hasBox ? "default" : "outline"}>
                  {product.hasBox ? "Box ✓" : "No Box"}
                </Badge>
                {product.isCib && <Badge variant="default">CIB ✓</Badge>}
              </div>
            </CardContent>
          </Card>

          {/* Reports */}
          {(product.testReport || product.cleaningReport) && (
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.testReport && (
                  <div>
                    <p className="text-sm font-medium mb-1">Test Report</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {product.testReport}
                    </p>
                  </div>
                )}
                {product.cleaningReport && (
                  <div>
                    <p className="text-sm font-medium mb-1">Cleaning Report</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {product.cleaningReport}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visibility</span>
                <Badge variant={product.isPublished ? "default" : "secondary"}>
                  {product.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              {product.isFeatured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Featured</span>
                  <Badge>Yes</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-medium">{formatPrice(product.priceInOre)}</span>
              </div>
              {product.salePriceInOre && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sale Price</span>
                  <span className="font-medium text-destructive">
                    {formatPrice(product.salePriceInOre)}
                  </span>
                </div>
              )}
              {product.costPriceInOre && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cost</span>
                  <span className="font-medium">{formatPrice(product.costPriceInOre)}</span>
                </div>
              )}
              {product.costPriceInOre && (
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm text-muted-foreground">Profit</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(product.priceInOre - product.costPriceInOre)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <span className="font-medium">{product.quantity}</span>
              </div>
              {product.weight && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Weight</span>
                  <span>{product.weight}g</span>
                </div>
              )}
              {product.inventoryLocation && (
                <div className="border-t pt-2 space-y-1">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {product.inventoryLocation.code ??
                      [
                        product.inventoryLocation.shelf,
                        product.inventoryLocation.row,
                        product.inventoryLocation.box,
                      ]
                        .filter(Boolean)
                        .join(" → ")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
