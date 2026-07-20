import { type CreateProductInput, type UpdateProductInput } from "@/lib/validation/product";
import {
  createProduct as repoCreate,
  updateProduct as repoUpdate,
  deleteProduct as repoDelete,
  deleteProducts as repoDeleteMany,
  checkSlugExists,
  getProductById,
  type ProductWithImages,
} from "@/features/products/repository";
import { slugify } from "@/lib/utils/index";
import { ConflictError, NotFoundError } from "@/lib/errors";

/**
 * Product service — business logic layer.
 * Handles slug generation, SKU generation, validation rules,
 * and orchestrates repository calls.
 */

/**
 * Generate a unique slug from a title.
 * Appends a numeric suffix if the slug already exists.
 */
async function generateUniqueSlug(
  title: string,
  excludeId?: string,
): Promise<string> {
  let slug = slugify(title);
  let suffix = 0;
  let candidateSlug = slug;

  while (await checkSlugExists(candidateSlug, excludeId)) {
    suffix++;
    candidateSlug = `${slug}-${suffix}`;
  }

  return candidateSlug;
}

/**
 * Generate a SKU from platform and an incrementing number.
 * Format: PLATFORM-XXXXX (e.g., SNES-00042)
 */
export function generateSku(platform: string, sequence: number): string {
  const prefix = platform.replace(/_/g, "").slice(0, 4).toUpperCase();
  return `${prefix}-${String(sequence).padStart(5, "0")}`;
}

/**
 * Create a new product with auto-generated slug and optional SKU.
 */
export async function createProductService(
  input: CreateProductInput & { sku?: string },
): Promise<ProductWithImages> {
  const slug = await generateUniqueSlug(input.title);

  const product = await repoCreate({
    title: input.title,
    slug,
    description: input.description ?? null,
    platform: input.platform,
    condition: input.condition,
    region: input.region,
    isOriginal: input.isOriginal,
    hasManual: input.hasManual,
    hasBox: input.hasBox,
    isCib: input.isCib,
    priceInOre: input.priceInOre,
    salePriceInOre: input.salePriceInOre ?? null,
    costPriceInOre: input.costPriceInOre ?? null,
    quantity: input.quantity,
    lowStockAt: input.lowStockAt,
    weight: input.weight ?? null,
    isPublished: input.isPublished,
    isFeatured: input.isFeatured,
    testReport: input.testReport ?? null,
    cleaningReport: input.cleaningReport ?? null,
    videoUrl: input.videoUrl || null,
    barcode: input.barcode ?? null,
    sku: input.sku ?? slug, // Temporary SKU, can be updated
    serialNumber: input.serialNumber ?? null,
    purchaseDate: input.purchaseDate ?? null,
    ...(input.supplierId && {
      supplier: { connect: { id: input.supplierId } },
    }),
  });

  return product;
}

/**
 * Update an existing product.
 */
export async function updateProductService(
  id: string,
  input: UpdateProductInput,
): Promise<ProductWithImages> {
  const existing = await getProductById(id);
  if (!existing) {
    throw new NotFoundError("Product");
  }

  // If title changed, regenerate slug
  let slug: string | undefined;
  if (input.title && input.title !== existing.title) {
    slug = await generateUniqueSlug(input.title, id);
  }

  const product = await repoUpdate(id, {
    ...(input.title !== undefined && { title: input.title }),
    ...(slug && { slug }),
    ...(input.description !== undefined && { description: input.description ?? null }),
    ...(input.platform !== undefined && { platform: input.platform }),
    ...(input.condition !== undefined && { condition: input.condition }),
    ...(input.region !== undefined && { region: input.region }),
    ...(input.isOriginal !== undefined && { isOriginal: input.isOriginal }),
    ...(input.hasManual !== undefined && { hasManual: input.hasManual }),
    ...(input.hasBox !== undefined && { hasBox: input.hasBox }),
    ...(input.isCib !== undefined && { isCib: input.isCib }),
    ...(input.priceInOre !== undefined && { priceInOre: input.priceInOre }),
    ...(input.salePriceInOre !== undefined && { salePriceInOre: input.salePriceInOre ?? null }),
    ...(input.costPriceInOre !== undefined && { costPriceInOre: input.costPriceInOre ?? null }),
    ...(input.quantity !== undefined && { quantity: input.quantity }),
    ...(input.lowStockAt !== undefined && { lowStockAt: input.lowStockAt }),
    ...(input.weight !== undefined && { weight: input.weight ?? null }),
    ...(input.isPublished !== undefined && {
      isPublished: input.isPublished,
      ...(input.isPublished && !existing.publishedAt && { publishedAt: new Date() }),
    }),
    ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
    ...(input.testReport !== undefined && { testReport: input.testReport ?? null }),
    ...(input.cleaningReport !== undefined && { cleaningReport: input.cleaningReport ?? null }),
    ...(input.videoUrl !== undefined && { videoUrl: input.videoUrl || null }),
    ...(input.barcode !== undefined && { barcode: input.barcode ?? null }),
    ...(input.serialNumber !== undefined && { serialNumber: input.serialNumber ?? null }),
    ...(input.purchaseDate !== undefined && { purchaseDate: input.purchaseDate ?? null }),
  });

  return product;
}

/**
 * Soft-delete a product.
 */
export async function deleteProductService(id: string): Promise<void> {
  const existing = await getProductById(id);
  if (!existing) {
    throw new NotFoundError("Product");
  }
  await repoDelete(id);
}

/**
 * Bulk soft-delete products.
 */
export async function deleteProductsService(ids: string[]): Promise<void> {
  await repoDeleteMany(ids);
}
