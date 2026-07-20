"use server";

import { revalidatePath } from "next/cache";
import {
  deleteProductImage,
  reorderProductImages,
  updateImageAlt,
} from "@/features/media/service";
import { actionSuccess, actionError, type ActionResult } from "@/lib/errors";

/**
 * Server Action: Delete a product image.
 */
export async function deleteImageAction(
  imageId: string,
  productId: string,
): Promise<ActionResult<void>> {
  try {
    await deleteProductImage(imageId);
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath(`/admin/products/${productId}/edit`);
    return actionSuccess(undefined);
  } catch (error) {
    console.error("deleteImageAction error:", error);
    return actionError(
      error instanceof Error ? error.message : "Failed to delete image",
    );
  }
}

/**
 * Server Action: Reorder product images.
 */
export async function reorderImagesAction(
  productId: string,
  imageIds: string[],
): Promise<ActionResult<void>> {
  try {
    await reorderProductImages(productId, imageIds);
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath(`/admin/products/${productId}/edit`);
    return actionSuccess(undefined);
  } catch (error) {
    console.error("reorderImagesAction error:", error);
    return actionError(
      error instanceof Error ? error.message : "Failed to reorder images",
    );
  }
}

/**
 * Server Action: Update image alt text.
 */
export async function updateImageAltAction(
  imageId: string,
  productId: string,
  alt: string,
): Promise<ActionResult<void>> {
  try {
    await updateImageAlt(imageId, alt);
    revalidatePath(`/admin/products/${productId}`);
    return actionSuccess(undefined);
  } catch (error) {
    console.error("updateImageAltAction error:", error);
    return actionError(
      error instanceof Error ? error.message : "Failed to update alt text",
    );
  }
}
