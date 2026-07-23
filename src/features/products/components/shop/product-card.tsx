import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/index";
import { type ShopProductCard } from "@/features/products/repository";

/**
 * Product card for the shop grid.
 * Shows key retro gaming info: platform, condition, CIB status, price.
 */
export function ProductCard({ product }: { product: ShopProductCard }) {
  const isOnSale = product.salePriceInOre !== null && product.salePriceInOre < product.priceInOre;
  const displayPrice = isOnSale ? product.salePriceInOre! : product.priceInOre;
  const isOutOfStock = product.quantity <= 0;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <Card className="overflow-hidden transition-shadow hover:shadow-md h-full">
        {/* Image */}
        <div className="relative aspect-square bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span className="text-4xl">🎮</span>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOnSale && (
              <Badge variant="destructive" className="text-xs">
                Tilbud
              </Badge>
            )}
            {product.isCib && (
              <Badge variant="default" className="text-xs">
                CIB
              </Badge>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Udsolgt
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <CardContent className="p-3 space-y-2">
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {product.platform.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.condition.replace(/_/g, " ")}
            </Badge>
            {product.region !== "PAL" && (
              <Badge variant="outline" className="text-xs">
                {product.region.replace(/_/g, "-")}
              </Badge>
            )}
          </div>

          {/* Completeness indicators */}
          <div className="flex gap-2 text-xs text-muted-foreground">
            {product.hasBox && <span title="Har æske">📦</span>}
            {product.hasManual && <span title="Har manual">📖</span>}
            {product.isOriginal && <span title="Original">✓</span>}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-bold text-base">
              {formatPrice(displayPrice)}
            </span>
            {isOnSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.priceInOre)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
