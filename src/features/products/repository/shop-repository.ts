import { db } from "@/lib/db";
import { type Prisma } from "@prisma/client";
import { type PaginatedResponse } from "@/types";
import { PLATFORMS } from "@/lib/constants";

/**
 * Shop-specific product queries.
 * All queries enforce isPublished=true and deletedAt=null.
 * These are public-facing — no admin data leaks.
 */

export interface ShopProductListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  platform?: string;
  brand?: string;
  condition?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  sale?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "name";
}

export type ShopProductCard = {
  id: string;
  slug: string;
  title: string;
  platform: string;
  condition: string;
  region: string;
  priceInOre: number;
  salePriceInOre: number | null;
  quantity: number;
  isOriginal: boolean;
  hasManual: boolean;
  hasBox: boolean;
  isCib: boolean;
  imageUrl: string | null;
  imageAlt: string | null;
};

export type ShopProductDetail = Prisma.ProductGetPayload<{
  include: {
    images: true;
    categories: { include: { category: true } };
    tags: { include: { tag: true } };
  };
}>;

/**
 * Get published products for the shop with filters and pagination.
 */
export async function getShopProducts(
  params: ShopProductListParams,
): Promise<PaginatedResponse<ShopProductCard>> {
  const {
    page = 1,
    pageSize = 24,
    search,
    platform,
    brand,
    condition,
    region,
    minPrice,
    maxPrice,
    sale,
    sort = "newest",
  } = params;

  // Build platform filter from brand
  let platformFilter: string[] | undefined;
  if (brand && brand in PLATFORMS) {
    platformFilter = PLATFORMS[brand as keyof typeof PLATFORMS] as unknown as string[];
  }

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    deletedAt: null,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(platform && { platform: platform.toUpperCase() as any }),
    ...(platformFilter && { platform: { in: platformFilter.map((p) => p.toUpperCase()) as any } }),
    ...(condition && { condition: condition.toUpperCase() as any }),
    ...(region && { region: region.toUpperCase() as any }),
    ...(minPrice !== undefined && { priceInOre: { gte: minPrice } }),
    ...(maxPrice !== undefined && {
      priceInOre: { ...(minPrice !== undefined ? { gte: minPrice } : {}), lte: maxPrice },
    }),
    ...(sale && { salePriceInOre: { not: null } }),
  };

  // Sort mapping
  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sort) {
      case "price_asc":
        return { priceInOre: "asc" as const };
      case "price_desc":
        return { priceInOre: "desc" as const };
      case "name":
        return { title: "asc" as const };
      case "newest":
      default:
        return { createdAt: "desc" as const };
    }
  })();

  const [products, totalCount] = await Promise.all([
    db.product.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        platform: true,
        condition: true,
        region: true,
        priceInOre: true,
        salePriceInOre: true,
        quantity: true,
        isOriginal: true,
        hasManual: true,
        hasBox: true,
        isCib: true,
        images: {
          select: { url: true, alt: true },
          orderBy: { position: "asc" },
          take: 1,
        },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const data: ShopProductCard[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    platform: p.platform,
    condition: p.condition,
    region: p.region,
    priceInOre: p.priceInOre,
    salePriceInOre: p.salePriceInOre,
    quantity: p.quantity,
    isOriginal: p.isOriginal,
    hasManual: p.hasManual,
    hasBox: p.hasBox,
    isCib: p.isCib,
    imageUrl: p.images[0]?.url ?? null,
    imageAlt: p.images[0]?.alt ?? null,
  }));

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

/**
 * Get a single published product by slug for the detail page.
 */
export async function getShopProductBySlug(
  slug: string,
): Promise<ShopProductDetail | null> {
  return db.product.findFirst({
    where: { slug, isPublished: true, deletedAt: null },
    include: {
      images: { orderBy: { position: "asc" } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}
