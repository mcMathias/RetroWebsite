/**
 * Application-wide constants.
 * Centralized to avoid magic strings/numbers throughout the codebase.
 */

export const APP_NAME = "RetroShop" as const;
export const APP_DESCRIPTION =
  "Danmarks bedste markedsplads for retro gaming" as const;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 24,
  MAX_PAGE_SIZE: 100,
  ADMIN_PAGE_SIZE: 50,
} as const;

/** Product condition options */
export const PRODUCT_CONDITIONS = [
  "mint",
  "near_mint",
  "very_good",
  "good",
  "acceptable",
  "poor",
  "for_parts",
] as const;

export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number];

/** Product condition display labels */
export const CONDITION_LABELS: Record<ProductCondition, string> = {
  mint: "Mint",
  near_mint: "Near Mint",
  very_good: "Very Good",
  good: "Good",
  acceptable: "Acceptable",
  poor: "Poor",
  for_parts: "For Parts",
};

/** Game region options */
export const REGIONS = ["PAL", "NTSC-U", "NTSC-J", "region_free"] as const;
export type Region = (typeof REGIONS)[number];

/** Console platforms - organized by brand */
export const PLATFORMS = {
  nintendo: [
    "nes",
    "snes",
    "n64",
    "gamecube",
    "wii",
    "wii_u",
    "switch",
    "game_boy",
    "game_boy_color",
    "game_boy_advance",
    "nintendo_ds",
    "nintendo_3ds",
  ],
  playstation: ["ps1", "ps2", "ps3", "ps4", "ps5", "psp", "ps_vita"],
  xbox: ["xbox", "xbox_360", "xbox_one", "xbox_series"],
  sega: [
    "master_system",
    "mega_drive",
    "saturn",
    "dreamcast",
    "game_gear",
  ],
} as const;

export type PlatformBrand = keyof typeof PLATFORMS;
export type Platform = (typeof PLATFORMS)[PlatformBrand][number];

/** All platforms as a flat array */
export const ALL_PLATFORMS: Platform[] = Object.values(PLATFORMS).flat() as Platform[];

/** Order statuses */
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** User roles */
export const USER_ROLES = ["admin", "employee", "customer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Image constraints */
export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_PRODUCT: 10,
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  THUMBNAIL_SIZE: { width: 300, height: 300 },
  MEDIUM_SIZE: { width: 800, height: 800 },
  LARGE_SIZE: { width: 1600, height: 1600 },
} as const;
