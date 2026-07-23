"use client";

import { useCart } from "@/features/cart/context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
  productTitle: string;
  isOutOfStock: boolean;
  /** Maximum available quantity (for future quantity selector) */
  maxQuantity: number;
}

/**
 * Add to cart button used on product detail pages.
 * Handles optimistic adding with error feedback.
 */
export function AddToCartButton({
  productId,
  productTitle,
  isOutOfStock,
  // maxQuantity reserved for future quantity selector
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddToCart() {
    if (isOutOfStock) return;
    setIsAdding(true);
    try {
      await addItem(productId);
      toast.success(`"${productTitle}" tilføjet til kurv`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Kunne ikke tilføje til kurv",
      );
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      disabled={isOutOfStock || isAdding}
      onClick={handleAddToCart}
    >
      {isAdding ? (
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="h-5 w-5 mr-2" />
      )}
      {isOutOfStock ? "Udsolgt" : "Læg i kurv"}
    </Button>
  );
}
