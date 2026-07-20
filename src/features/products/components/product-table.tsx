"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, Copy } from "lucide-react";
import { type ProductListItem } from "@/features/products/repository";
import { deleteProductAction, deleteProductsAction } from "@/features/products/actions";
import { formatPrice } from "@/lib/utils/index";
import { toast } from "sonner";

interface ProductTableProps {
  products: ProductListItem[];
}

const conditionColors: Record<string, string> = {
  MINT: "bg-green-100 text-green-800",
  NEAR_MINT: "bg-emerald-100 text-emerald-800",
  VERY_GOOD: "bg-blue-100 text-blue-800",
  GOOD: "bg-sky-100 text-sky-800",
  ACCEPTABLE: "bg-yellow-100 text-yellow-800",
  POOR: "bg-orange-100 text-orange-800",
  FOR_PARTS: "bg-red-100 text-red-800",
};

const conditionLabels: Record<string, string> = {
  MINT: "Mint",
  NEAR_MINT: "Near Mint",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
  ACCEPTABLE: "Acceptable",
  POOR: "Poor",
  FOR_PARTS: "For Parts",
};

export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const allSelected =
    products.length > 0 && selectedIds.size === products.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteProductAction(id);
      if (result.success) {
        toast.success("Product deleted");
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    startTransition(async () => {
      const result = await deleteProductsAction(Array.from(selectedIds));
      if (result.success) {
        toast.success(`${selectedIds.size} products deleted`);
        setSelectedIds(new Set());
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div>
      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 py-3 px-4 bg-muted/50 rounded-lg mb-4">
          <span className="text-sm font-medium">
            {selectedIds.size} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete selected
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear selection
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(product.id)}
                    onCheckedChange={() => toggleOne(product.id)}
                    aria-label={`Select ${product.title}`}
                  />
                </TableCell>
                <TableCell>
                  {product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt ?? product.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">N/A</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {product.sku}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {product.platform.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      conditionColors[product.condition] ?? ""
                    }`}
                  >
                    {conditionLabels[product.condition] ?? product.condition}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    {product.salePriceInOre ? (
                      <>
                        <span className="line-through text-muted-foreground text-xs">
                          {formatPrice(product.priceInOre)}
                        </span>
                        <br />
                        <span className="font-medium text-destructive">
                          {formatPrice(product.salePriceInOre)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">
                        {formatPrice(product.priceInOre)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={
                      product.quantity === 0
                        ? "text-destructive font-medium"
                        : product.quantity <= product.lowStockAt
                          ? "text-orange-600 font-medium"
                          : ""
                    }
                  >
                    {product.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {product.isPublished ? (
                    <Badge variant="default" className="text-xs">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0" />}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/admin/products/${product.id}`} />}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem render={<Link href={`/admin/products/${product.id}/edit`} />}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(product.sku);
                          toast.success("SKU copied");
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy SKU
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
