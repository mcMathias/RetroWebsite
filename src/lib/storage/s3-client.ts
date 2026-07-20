import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

/**
 * S3-compatible storage client.
 * Works with MinIO (local), Cloudflare R2, AWS S3, etc.
 *
 * All images are stored with public-read ACL for CDN delivery.
 * Structure: /products/{productId}/{variant}/{filename}.webp
 */

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.S3_REGION ?? "auto",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true, // Required for MinIO
    });
  }
  return s3Client;
}

function getBucket(): string {
  return process.env.S3_BUCKET ?? "retroshop";
}

function getCdnUrl(): string {
  return process.env.NEXT_PUBLIC_CDN_URL ?? `${process.env.S3_ENDPOINT}/${getBucket()}`;
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
}

/**
 * Upload a buffer to S3.
 */
export async function uploadToS3(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<UploadResult> {
  const client = getS3Client();
  const bucket = getBucket();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: `${getCdnUrl()}/${key}`,
    size: body.length,
  };
}

/**
 * Delete a single object from S3.
 */
export async function deleteFromS3(key: string): Promise<void> {
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: getBucket(),
      Key: key,
    }),
  );
}

/**
 * Delete multiple objects from S3.
 */
export async function deleteMultipleFromS3(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  const client = getS3Client();
  await client.send(
    new DeleteObjectsCommand({
      Bucket: getBucket(),
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    }),
  );
}

/**
 * Check if an object exists in S3.
 */
export async function existsInS3(key: string): Promise<boolean> {
  const client = getS3Client();
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: getBucket(),
        Key: key,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a storage key for a product image.
 * Format: products/{productId}/{variant}/{filename}.webp
 */
export function generateImageKey(
  productId: string,
  filename: string,
  variant: "original" | "large" | "medium" | "thumbnail",
): string {
  // Sanitize filename
  const sanitized = filename
    .replace(/[^a-z0-9.-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  const nameWithoutExt = sanitized.replace(/\.[^.]+$/, "");
  const extension = variant === "original" ? sanitized.split(".").pop() : "webp";

  return `products/${productId}/${variant}/${nameWithoutExt}.${extension}`;
}
