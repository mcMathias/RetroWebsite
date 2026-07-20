import sharp from "sharp";

/**
 * Image processing service.
 *
 * Generates multiple variants from a single uploaded image:
 * - thumbnail: 300x300 (for lists, grids)
 * - medium: 800x800 (for product cards)
 * - large: 1600x1600 (for product detail/zoom)
 *
 * All variants are converted to WebP for optimal file size.
 * Original is preserved for archival purposes.
 */

export interface ImageVariant {
  buffer: Buffer;
  width: number;
  height: number;
  size: number;
  format: string;
}

export interface ProcessedImage {
  original: ImageVariant;
  large: ImageVariant;
  medium: ImageVariant;
  thumbnail: ImageVariant;
  metadata: ImageMetadata;
}

export interface ImageMetadata {
  originalWidth: number;
  originalHeight: number;
  format: string;
  hasAlpha: boolean;
}

const VARIANT_CONFIG = {
  thumbnail: { width: 300, height: 300, quality: 80 },
  medium: { width: 800, height: 800, quality: 82 },
  large: { width: 1600, height: 1600, quality: 85 },
} as const;

/**
 * Process an uploaded image buffer into multiple variants.
 * Returns all variants ready for S3 upload.
 */
export async function processImage(
  inputBuffer: Buffer,
): Promise<ProcessedImage> {
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Invalid image: could not read dimensions");
  }

  const imageMetadata: ImageMetadata = {
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    format: metadata.format ?? "unknown",
    hasAlpha: metadata.hasAlpha ?? false,
  };

  // Generate variants in parallel
  const [thumbnail, medium, large] = await Promise.all([
    generateVariant(inputBuffer, VARIANT_CONFIG.thumbnail),
    generateVariant(inputBuffer, VARIANT_CONFIG.medium),
    generateVariant(inputBuffer, VARIANT_CONFIG.large),
  ]);

  // Optimize original (strip metadata, convert to WebP if beneficial)
  const optimizedOriginal = await sharp(inputBuffer)
    .rotate() // Auto-rotate based on EXIF
    .webp({ quality: 90 })
    .toBuffer({ resolveWithObject: true });

  return {
    original: {
      buffer: optimizedOriginal.data,
      width: optimizedOriginal.info.width,
      height: optimizedOriginal.info.height,
      size: optimizedOriginal.data.length,
      format: "webp",
    },
    large,
    medium,
    thumbnail,
    metadata: imageMetadata,
  };
}

/**
 * Generate a single image variant.
 */
async function generateVariant(
  inputBuffer: Buffer,
  config: { width: number; height: number; quality: number },
): Promise<ImageVariant> {
  const result = await sharp(inputBuffer)
    .rotate() // Auto-rotate based on EXIF
    .resize(config.width, config.height, {
      fit: "inside", // Maintain aspect ratio, fit within bounds
      withoutEnlargement: true, // Don't upscale small images
    })
    .webp({ quality: config.quality })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
    size: result.data.length,
    format: "webp",
  };
}

/**
 * Validate an image file before processing.
 */
export function validateImageFile(
  buffer: Buffer,
  filename: string,
  maxSizeBytes: number = 5 * 1024 * 1024, // 5MB default
): { valid: boolean; error?: string } {
  // Check file size
  if (buffer.length > maxSizeBytes) {
    const maxMB = (maxSizeBytes / 1024 / 1024).toFixed(0);
    return { valid: false, error: `File exceeds maximum size of ${maxMB}MB` };
  }

  // Check extension
  const ext = filename.split(".").pop()?.toLowerCase();
  const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
  if (!ext || !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`,
    };
  }

  // Check magic bytes for common image formats
  if (!isValidImageBuffer(buffer)) {
    return { valid: false, error: "File is not a valid image" };
  }

  return { valid: true };
}

/**
 * Check magic bytes to verify the buffer is actually an image.
 */
function isValidImageBuffer(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;

  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  )
    return true;

  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer.length > 11 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  )
    return true;

  // GIF: GIF87a or GIF89a
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46
  )
    return true;

  return false;
}
