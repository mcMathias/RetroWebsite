import { NextRequest, NextResponse } from "next/server";
import { uploadProductImage } from "@/features/media/service";
import { validateImageFile } from "@/lib/storage";
import { auth } from "@/lib/auth";

/**
 * POST /api/media/upload
 *
 * Handles multipart file upload for product images.
 * Accepts: multipart/form-data with fields:
 *   - file: The image file
 *   - productId: The product to attach the image to
 *
 * Security: Requires ADMIN or EMPLOYEE role.
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file
    const validation = validateImageFile(buffer, file.name);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // Upload and process
    const image = await uploadProductImage(productId, buffer, file.name);

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    );
  }
}

/**
 * Set max body size for uploads (10MB to account for base64 overhead).
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
