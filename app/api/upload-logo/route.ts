import { NextRequest } from "next/server";
import {
  generateLogoId,
  validateLogoUpload,
  reencodeRaster,
  evictExpired,
  getLogoCache,
} from "@/lib/logo-upload";
import { generateLogoPreview } from "@/lib/logo-preview";

export const maxDuration = 30;

const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/jpg", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return Response.json({ success: false, errors: ["Request must be multipart/form-data"] }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ success: false, errors: ["No file provided"] }, { status: 400 });
    }

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return Response.json(
        { success: false, errors: [`File must be SVG, PNG, or JPEG — received "${mimeType}"`] },
        { status: 400 }
      );
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());

    // Validate (dimensions, SVG safety, size)
    const validation = await validateLogoUpload(rawBuffer, mimeType, file.name);
    if (!validation.valid) {
      return Response.json({ success: false, errors: validation.errors, warnings: validation.warnings }, { status: 422 });
    }

    // Re-encode raster to strip EXIF and neutralise payloads (SVG already sanitized in validate)
    const safeBuffer = mimeType.includes("svg") ? rawBuffer : await reencodeRaster(rawBuffer, mimeType);
    const safeMime = mimeType.includes("svg") ? "image/svg+xml" : "image/png";

    // Generate preview thumbnail + detect variant
    const preview = await generateLogoPreview(safeBuffer, safeMime);

    // Store in session cache
    evictExpired();
    const logoId = generateLogoId();
    getLogoCache().set(logoId, {
      logoId,
      originalFilename: file.name,
      mimeType: safeMime,
      buffer: safeBuffer,
      previewBase64: preview.previewBase64,
      detectedVariant: preview.detectedVariant,
      width: preview.width,
      height: preview.height,
      fileSize: safeBuffer.length,
      uploadedAt: Date.now(),
      warnings: validation.warnings,
    });

    return Response.json({
      success: true,
      logoId,
      previewBase64: preview.previewBase64,
      detectedVariant: preview.detectedVariant,
      warnings: validation.warnings,
      metadata: {
        ...validation.metadata,
        width: preview.width,
        height: preview.height,
        originalFilename: file.name,
      },
    });
  } catch (err) {
    console.error("[upload-logo]", (err as Error).message);
    return Response.json({ success: false, errors: ["Upload failed — " + (err as Error).message] }, { status: 500 });
  }
}
