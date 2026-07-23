"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type ValidatedCartItem } from "@/features/cart/types";
import { useCart } from "@/features/cart/context";
import { formatPrice } from "@/lib/utils/index";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Single cart item row with quantity controls and remove button.
 */
export function CartItemRow({ item }: { item: ValidatedCartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleQuantityChange(newQuantity: number) {
    if (newQuantity < 0) return;
    setIsUpdating(true);
    try {
      await updateQuantity(item.productId, newQuantity);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fejl ved opdatering");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemove() {
    try {
      await removeItem(item.productId);
      toast.success(`"${item.title}" fjernet fra kurv`);
    } catch {
      toast.error("Kunne ikke fjerne produkt");
    }
  }

  const isUnavailable = !item.isAvailable;

  return (
    <div className={`flex gap-4 py-4 ${isUnavailable ? "opacity-60" : ""}`}>
      {/* Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl">
            🎮
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/products/${item.slug}`}
            className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
          >
            {item.title}
          </Link>
          <div className="flex gap-1 mt-1">
            <Badge variant="outline" className="text-xs">
              {item.platform.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {item.condition.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>

        {/* Stock warning */}
        {item.stockExceeded && item.isAvailable && (
          <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
            <AlertTriangle className="h-3 w-3" />
            <span>Kun {item.availableStock} tilgængelig</span>
          </div>
        )}
        {isUnavailable && (
          <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
            <AlertTriangle className="h-3 w-3" />
            <span>Ikke længere tilgængelig</span>
          </div>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <span className="font-semibold text-sm">
          {formatPrice(item.effectivePriceInOre * item.quantity)}
        </span>

        {item.isAvailable && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.availableStock}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleRemove}
              className="ml-2 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        {isUnavailable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-destructive text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Fjern
          </Button>
        )}
      </div>
    </div>
  );
}
