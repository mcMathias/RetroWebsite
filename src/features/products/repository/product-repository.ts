import { db } from "@/lib/db";
import { type Prisma } from "@prisma/client";
import { type PaginationInput, type PaginatedResponse } from "@/types";

/**
 * Product repository — data access layer.
 * All database queries for products go through here.
 * No business logic — just CRUD operations.
 */

export interface ProductListParams extends PaginationInput {
  search?: string;
  platform?: string;
  condition?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

export type ProductWithImages = Prisma.ProductGetPayload<{
  include: { images: true; inventoryLocation: true; categories: true; tags: true };
}>;

export type ProductListItem = Prisma.ProductGetPayload<{
  include: { images: { select: { url: true; alt: true } } };
}>;

export async function getProducts(
  params: ProductListParams,
): Promise<PaginatedResponse<ProductListItem>> {
  const {
    page = 1,
    pageSize = 50,
    search,
    platform,
    condition,
    isPublished,
    isFeatured,
    sortField = "createdAt",
    sortDirection = "desc",
  } = params;

  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(platform && { platform: platform as any }),
    ...(condition && { condition: condition as any }),
    ...(isPublished !== undefined && { isPublished }),
    ...(isFeatured !== undefined && { isFeatured }),
  };

  const [data, totalCount] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        images: {
          select: { url: true, alt: true },
          orderBy: { position: "asc" },
          take: 1,
        },
      },
      orderBy: { [sortField]: sortDirection },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getProductById(id: string): Promise<ProductWithImages | null> {
  return db.product.findFirst({
    where: { id, deletedAt: null },
    include: {
      images: { orderBy: { position: "asc" } },
      inventoryLocation: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  return db.product.findFirst({
    where: { slug, deletedAt: null },
    include: {
      images: { orderBy: { position: "asc" } },
      inventoryLocation: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function createProduct(
  data: Prisma.ProductCreateInput,
): Promise<ProductWithImages> {
  return db.product.create({
    data,
    include: {
      images: { orderBy: { position: "asc" } },
      inventoryLocation: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function updateProduct(
  id: string,
  data: Prisma.ProductUpdateInput,
): Promise<ProductWithImages> {
  return db.product.update({
    where: { id },
    data,
    include: {
      images: { orderBy: { position: "asc" } },
      inventoryLocation: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await db.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function deleteProducts(ids: string[]): Promise<void> {
  await db.product.updateMany({
    where: { id: { in: ids } },
    data: { deletedAt: new Date() },
  });
}

export async function getProductCount(): Promise<number> {
  return db.product.count({ where: { deletedAt: null } });
}

export async function checkSlugExists(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const existing = await db.product.findFirst({
    where: {
      slug,
      deletedAt: null,
      ...(excludeId && { id: { not: excludeId } }),
    },
    select: { id: true },
  });
  return !!existing;
}
