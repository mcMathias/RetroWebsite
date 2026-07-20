import { z } from "zod";

/**
 * Product validation schemas.
 * Used in both Server Actions (server-side) and forms (client-side).
 */

export const createProductSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().optional(),
  platform: z.enum([
    "NES", "SNES", "N64", "GAMECUBE", "WII", "WII_U", "SWITCH",
    "GAME_BOY", "GAME_BOY_COLOR", "GAME_BOY_ADVANCE",
    "NINTENDO_DS", "NINTENDO_3DS",
    "PS1", "PS2", "PS3", "PS4", "PS5", "PSP", "PS_VITA",
    "XBOX", "XBOX_360", "XBOX_ONE", "XBOX_SERIES",
    "MASTER_SYSTEM", "MEGA_DRIVE", "SATURN", "DREAMCAST", "GAME_GEAR",
  ]),
  condition: z.enum([
    "MINT", "NEAR_MINT", "VERY_GOOD", "GOOD", "ACCEPTABLE", "POOR", "FOR_PARTS",
  ]),
  region: z.enum(["PAL", "NTSC_U", "NTSC_J", "REGION_FREE"]).default("PAL"),
  isOriginal: z.boolean().default(true),
  hasManual: z.boolean().default(false),
  hasBox: z.boolean().default(false),
  isCib: z.boolean().default(false),
  priceInOre: z
    .number()
    .int("Price must be a whole number")
    .min(100, "Price must be at least 1 DKK"),
  salePriceInOre: z
    .number()
    .int()
    .min(0)
    .optional()
    .nullable(),
  costPriceInOre: z
    .number()
    .int()
    .min(0)
    .optional()
    .nullable(),
  quantity: z.number().int().min(0).default(0),
  lowStockAt: z.number().int().min(0).default(2),
  weight: z.number().int().min(0).optional().nullable(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  testReport: z.string().optional().nullable(),
  cleaningReport: z.string().optional().nullable(),
  videoUrl: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  barcode: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

/**
 * Inventory location schema.
 */
export const inventoryLocationSchema = z.object({
  shelf: z.string().max(10).optional().nullable(),
  row: z.string().max(10).optional().nullable(),
  box: z.string().max(10).optional().nullable(),
  code: z.string().max(20).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export type InventoryLocationInput = z.infer<typeof inventoryLocationSchema>;
