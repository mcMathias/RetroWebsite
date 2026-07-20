import { db } from "@/lib/db";
import type { ProductImage } from "@prisma/client";
import {
  uploadToS3,
  deleteFromS3,
  deleteMultipleFromS3,
  generateImageKey,
  processImage,
  validateImageFile,
} from "@/lib/storage";
import { type UploadedImage } from "@/features/media/types";

/**
 * Media service — handles the full upload pipeline:
 * 1. Validate file
 * 2. Process into variants (thumbnail, medium, large)
 * 3. Upload all variants to S3
 * 4. Save metadata to database
 *
 * Also handles reordering, deletion, and alt text updates.
 */

export async function uploadProductImage(
  productId: string,
  file: Buffer,
  filename: string,
): Promise<UploadedImage> {
  // 1. Validate
  const validation = validateImageFile(file, filename);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 2. Process into variants
  const processed = await processImage(file);

  // 3. Upload all variants to S3
  const [originalResult, largeResult, mediumResult, thumbnailResult] =
    await Promise.all([
      uploadToS3(
        generateImageKey(productId, filename, "original"),
        processed.original.buffer,
        "image/webp",
      ),
      uploadToS3(
        generateImageKey(productId, filename, "large"),
        processed.large.buffer,
        "image/webp",
      ),
      uploadToS3(
        generateImageKey(productId, filename, "medium"),
        processed.medium.buffer,
        "image/webp",
      ),
      uploadToS3(
        generateImageKey(productId, filename, "thumbnail"),
        processed.thumbnail.buffer,
        "image/webp",
      ),
    ]);

  // 4. Determine position (append to end)
  const lastImage = await db.productImage.findFirst({
    where: { productId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  const position = (lastImage?.position ?? -1) + 1;

  // 5. Save to database
  const image = await db.productImage.create({
    data: {
      productId,
      url: largeResult.url, // Primary URL is the large variant
      alt: null,
      position,
      width: processed.large.width,
      height: processed.large.height,
    },
  });

  return {
    id: image.id,
    productId: image.productId,
    url: originalResult.url,
    largeUrl: largeResult.url,
    mediumUrl: mediumResult.url,
    thumbnailUrl: thumbnailResult.url,
    alt: image.alt,
    position: image.position,
    width: image.width,
    height: image.height,
  };
}

/**
 * Delete a product image (S3 + database).
 */
export async function deleteProductImage(imageId: string): Promise<void> {
  const image = await db.productImage.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  // Extract the base key from the URL to derive all variant keys
  const url = new URL(image.url);
  const basePath = url.pathname.replace(/^\/[^/]+\//, ""); // Remove bucket prefix
  const baseKey = basePath.replace(/\/large\//, "/VARIANT/");

  const keysToDelete = ["original", "large", "medium", "thumbnail"].map(
    (variant) => baseKey.replace("/VARIANT/", `/${variant}/`),
  );

  // Delete from S3 and database in parallel
  await Promise.all([
    deleteMultipleFromS3(keysToDelete),
    db.productImage.delete({ where: { id: imageId } }),
  ]);

  // Reorder remaining images
  const remaining = await db.productImage.findMany({
    where: { productId: image.productId },
    orderBy: { position: "asc" },
  });

  await Promise.all(
    remaining.map((img: ProductImage, index: number) =>
      db.productImage.update({
        where: { id: img.id },
        data: { position: index },
      }),
    ),
  );
}

/**
 * Reorder product images.
 */
export async function reorderProductImages(
  productId: string,
  imageIds: string[],
): Promise<void> {
  await Promise.all(
    imageIds.map((id, index) =>
      db.productImage.update({
        where: { id },
        data: { position: index },
      }),
    ),
  );
}

/**
 * Update alt text for an image.
 */
export async function updateImageAlt(
  imageId: string,
  alt: string,
): Promise<void> {
  await db.productImage.update({
    where: { id: imageId },
    data: { alt },
  });
}

/**
 * Get all images for a product.
 */
export async function getProductImages(productId: string): Promise<UploadedImage[]> {
  const images = await db.productImage.findMany({
    where: { productId },
    orderBy: { position: "asc" },
  });

  return images.map((img) => {
    // Derive variant URLs from the stored URL
    const baseUrl = img.url.replace("/large/", "");
    return {
      id: img.id,
      productId: img.productId,
      url: img.url,
      largeUrl: img.url,
      mediumUrl: img.url.replace("/large/", "/medium/"),
      thumbnailUrl: img.url.replace("/large/", "/thumbnail/"),
      alt: img.alt,
      position: img.position,
      width: img.width,
      height: img.height,
    };
  });
}
