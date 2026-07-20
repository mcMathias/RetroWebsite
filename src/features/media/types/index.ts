/**
 * Media types shared across the feature.
 */

export interface UploadedImage {
  id: string;
  productId: string;
  url: string;
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  alt: string | null;
  position: number;
  width: number | null;
  height: number | null;
}

export interface ImageUploadResponse {
  success: boolean;
  image?: UploadedImage;
  error?: string;
}

export interface ImageReorderPayload {
  imageId: string;
  position: number;
}
