"use server";

import { revalidatePath } from "next/cache";
import { createProductSchema, updateProductSchema } from "@/lib/validation/product";
import {
  createProductService,
  updateProductService,
  deleteProductService,
  deleteProductsService,
} from "@/features/products/service";
import { getProducts, type ProductListParams } from "@/features/products/repository";
import { actionSuccess, actionError, type ActionResult } from "@/lib/errors";
import { type ProductWithImages } from "@/features/products/repository";
import { requireRole } from "@/lib/auth/helpers";

/**
 * Server Action: Create a new product.
 */
export async function createProductAction(
  formData: unknown,
): Promise<ActionResult<ProductWithImages>> {
  try {
    await requireRole("ADMIN", "EMPLOYEE");

    const parsed = createProductSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return actionError("Validation failed", fieldErrors);
    }

    const product = await createProductService(parsed.data);
    revalidatePath("/admin/products");
    return actionSuccess(product);
  } catch (error) {
    console.error("createProductAction error:", error);
    return actionError(
      error instanceof Error ? error.message : "Failed to create product",
    );
  }
}

/**
 * Server Action: Update an existing product.
 */
export async function updateProductAction(
  id: string,
  formData: unknown,
): Promise<ActionResult<ProductWithImages>> {
  try {
    await requireRole("ADMIN", "EMPLOYEE");

    const parsed = updateProductSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return actionError("Validation failed", fieldErrors);
    }

    const product = await updateProductService(id, parsed.data);
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    return actionSuccess(product);
  } catch (error) {
    console.error("updateProductAction error:", error);
    return actionError(
      error instanceof Error ? error.message : "Failed to update product",
    );
  }
}

/**
 * Server Action: Delete a product (soft delete).
 */
export async function deleteProductAction(
  id: string,
): Promise<ActionResult<void>> {
  try {
    await requireRole("ADMIN", "EMPLOYEE");

    await deleteProductService(id);
    revalidatePath("/admin/products");
    return actionSuccess(undefined);
  } catch (error) {
    console.error("deleteProductAction error:", error);
    return actionError(
      error instanceof Error ? error.message : "Failed to delete product",
    );
  }
}

/**
 * Server Action: Bulk delete products.
 */
export async function deleteProductsAction(
  ids: string[],
): Promise<ActionResult<void>> {
  try {
    await requireRole("ADMIN", "EMPLOYEE");

    if (ids.length === 0) {
      return actionError("No products selected");
    }
    await deleteProductsService(ids);
    revalidatePath("/admin/products");
    return actionSuccess(undefined);
  } catch (error) {
    console.error("deleteProductsAction error:", error);
    return actionError(
      error instanceof Error ? error.message : "Failed to delete products",
    );
  }
}

/**
 * Server Action: Fetch products (for server-side table).
 */
export async function getProductsAction(params: ProductListParams) {
  return getProducts(params);
}
