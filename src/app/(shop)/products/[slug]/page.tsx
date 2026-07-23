import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, X, Package } from "lucide-react";
import { getShopProductBySlug } from "@/features/products/repository";
import { AddToCartButton } from "@/features/cart/components";
import { formatPrice } from "@/lib/utils/index";
import { siteConfig } from "@/config/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate dynamic metadata for SEO.
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getShopProductBySlug(slug);

  if (!product) {
    return { title: "Produkt ikke fundet" };
  }

  const price = product.salePriceInOre ?? product.priceInOre;

  return {
    title: product.title,
    description:
      product.description ??
      `${product.title} - ${product.platform.replace(/_/g, " ")} - ${product.condition.replace(/_/g, " ")} - ${formatPrice(price)}`,
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : undefined,
      type: "website",
      locale: siteConfig.locale,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getShopProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isOnSale =
    product.salePriceInOre !== null && product.salePriceInOre < product.priceInOre;
  const displayPrice = isOnSale ? product.salePriceInOre! : product.priceInOre;
  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Package className="h-24 w-24" />
              </div>
            )}

            {isOnSale && (
              <Badge variant="destructive" className="absolute top-3 left-3">
                Tilbud
              </Badge>
            )}
          </div>

          {/* Thumbnail Grid */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-md overflow-hidden bg-muted border-2 border-transparent hover:border-primary transition-colors cursor-pointer"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? `${product.title} billede ${index + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Platform */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>{product.platform.replace(/_/g, " ")}</Badge>
              <Badge variant="outline">
                {product.region.replace(/_/g, "-")}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {product.title}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              {formatPrice(displayPrice)}
            </span>
            {isOnSale && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.priceInOre)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <>
                <X className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">
                  Udsolgt
                </span>
              </>
            ) : product.quantity <= 3 ? (
              <>
                <Check className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-500 font-medium">
                  Kun {product.quantity} tilbage
                </span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  På lager
                </span>
              </>
            )}
          </div>

          {/* Add to Cart */}
          <AddToCartButton
            productId={product.id}
            productTitle={product.title}
            isOutOfStock={isOutOfStock}
            maxQuantity={product.quantity}
          />

          <Separator />

          {/* Condition & Completeness */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="font-semibold">Stand & Komplethed</h2>
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Condition" value={product.condition.replace(/_/g, " ")} />
                <InfoItem
                  label="Original"
                  value={product.isOriginal ? "Ja" : "Reproduktion"}
                />
                <InfoItem
                  label="Æske"
                  value={product.hasBox ? "Inkluderet" : "Ikke inkluderet"}
                  positive={product.hasBox}
                />
                <InfoItem
                  label="Manual"
                  value={product.hasManual ? "Inkluderet" : "Ikke inkluderet"}
                  positive={product.hasManual}
                />
                {product.isCib && (
                  <InfoItem label="CIB" value="Complete In Box ✓" positive />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <h2 className="font-semibold">Beskrivelse</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Categories & Tags */}
          {(product.categories.length > 0 || product.tags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {product.categories.map((pc) => (
                <Badge key={pc.categoryId} variant="secondary">
                  {pc.category.name}
                </Badge>
              ))}
              {product.tags.map((pt) => (
                <Badge key={pt.tagId} variant="outline">
                  {pt.tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${positive === true ? "text-green-600" : positive === false ? "text-muted-foreground" : ""}`}>
        {value}
      </p>
    </div>
  );
}
