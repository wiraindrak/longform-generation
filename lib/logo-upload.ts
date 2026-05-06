// Server-side logo validation, sanitization, and in-memory session cache.
// All functions are server-only (use Node.js / sharp APIs).

import crypto from "crypto";

// ─── In-memory session cache ──────────────────────────────────────────────────

export interface LogoCacheEntry {
  logoId: string;
  originalFilename: string;
  mimeType: string;
  buffer: Buffer;           // re-encoded through sharp (EXIF stripped)
  previewBase64: string;    // 64×64 PNG data URL for dashboard thumbnail
  detectedVariant: "light" | "dark" | "ambiguous";
  width: number;
  height: number;
  fileSize: number;
  uploadedAt: number;
  warnings: string[];
}

declare global {
  // eslint-disable-next-line no-var
  var _logoCache: Map<string, LogoCacheEntry> | undefined;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const CACHE_MAX = 50;

export function getLogoCache(): Map<string, LogoCacheEntry> {
  if (!global._logoCache) global._logoCache = new Map();
  return global._logoCache;
}

export function getCachedLogo(logoId: string): LogoCacheEntry | null {
  const cache = getLogoCache();
  const entry = cache.get(logoId);
  if (!entry) return null;
  if (Date.now() - entry.uploadedAt > CACHE_TTL_MS) {
    cache.delete(logoId);
    return null;
  }
  return entry;
}

export function evictExpired(): void {
  const cache = getLogoCache();
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.uploadedAt > CACHE_TTL_MS) cache.delete(key);
  }
  // LRU approximation: if still over cap, drop oldest
  if (cache.size > CACHE_MAX) {
    const sorted = [...cache.entries()].sort((a, b) => a[1].uploadedAt - b[1].uploadedAt);
    for (const [key] of sorted.slice(0, cache.size - CACHE_MAX)) cache.delete(key);
  }
}

export function generateLogoId(): string {
  return crypto.randomUUID();
}

// ─── Validation result ────────────────────────────────────────────────────────

export interface LogoValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata: {
    width: number | null;
    height: number | null;
    format: string;
    hasAlpha: boolean | null;
    dominantBrightness: number | null;
    fileSize: number;
  };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MIN_RASTER_DIM = 500;

// ─── SVG sanitization ─────────────────────────────────────────────────────────

const SVG_DANGER_PATTERNS = [
  /<script[\s>]/i,
  /\bon\w+\s*=/i,             // onclick=, onload=, etc.
  /javascript\s*:/i,
  /<foreignObject/i,
  /xlink:href\s*=\s*["']https?:/i,
  /href\s*=\s*["']https?:/i,
  /<use[^>]+href\s*=\s*["']https?:/i,
  /data:[^,]*base64/i,        // embedded data URIs
];

export function sanitizeSVG(svgText: string): { safe: boolean; reason?: string; sanitized: string } {
  for (const pat of SVG_DANGER_PATTERNS) {
    if (pat.test(svgText)) {
      return { safe: false, reason: `Unsafe SVG content: ${pat.source}`, sanitized: "" };
    }
  }
  // Strip XML processing instructions and DOCTYPE
  const sanitized = svgText
    .replace(/<\?xml[^?]*\?>/gi, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
  return { safe: true, sanitized };
}

// ─── Main validation ──────────────────────────────────────────────────────────

export async function validateLogoUpload(
  buffer: Buffer,
  mimeType: string,
  originalFilename: string
): Promise<LogoValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fileSize = buffer.length;
  let width: number | null = null;
  let height: number | null = null;
  let hasAlpha: boolean | null = null;
  let dominantBrightness: number | null = null;
  const format = mimeType.split("/")[1]?.replace("svg+xml", "svg") ?? "unknown";

  // File size check
  if (fileSize > MAX_FILE_SIZE) {
    errors.push(`File too large — ${(fileSize / 1024 / 1024).toFixed(1)} MB exceeds the 5 MB limit`);
  }

  // Format check
  const allowed = ["svg", "png", "jpeg", "jpg", "webp"];
  if (!allowed.includes(format)) {
    errors.push(`Unsupported format "${format}" — use SVG, PNG, or JPEG`);
    return { valid: false, errors, warnings, metadata: { width, height, format, hasAlpha, dominantBrightness, fileSize } };
  }

  if (format === "svg") {
    const text = buffer.toString("utf-8");
    const { safe, reason } = sanitizeSVG(text);
    if (!safe) errors.push(reason ?? "SVG failed security scan");
  } else {
    // Raster validation via sharp
    try {
      const sharp = (await import("sharp")).default;
      const meta = await sharp(buffer).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;
      hasAlpha = (meta.channels ?? 3) >= 4;

      if (width && height) {
        if (width < MIN_RASTER_DIM || height < MIN_RASTER_DIM) {
          errors.push(`Image too small — ${width}×${height}px, minimum is ${MIN_RASTER_DIM}×${MIN_RASTER_DIM}px`);
        }
        const ratio = width / height;
        if (ratio > 4 || ratio < 0.25) {
          warnings.push(`Extreme aspect ratio (${width}×${height}) — logo may appear distorted at small sizes`);
        }
      }

      if (!hasAlpha && format !== "svg") {
        warnings.push("No transparency (alpha channel) detected — logos on complex backgrounds may look better with a transparent background");
      }

      // Sample brightness from center 50% of image
      if (width && height) {
        const sampleW = Math.round(width * 0.5);
        const sampleH = Math.round(height * 0.5);
        const sampleX = Math.round(width * 0.25);
        const sampleY = Math.round(height * 0.25);
        const { data } = await sharp(buffer)
          .extract({ left: sampleX, top: sampleY, width: sampleW, height: sampleH })
          .flatten({ background: { r: 128, g: 128, b: 128 } })
          .resize(16, 16)
          .raw()
          .toBuffer({ resolveWithObject: true });
        let total = 0;
        for (let i = 0; i < data.length; i += 3) {
          total += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        }
        dominantBrightness = total / (data.length / 3) / 255;
        if (dominantBrightness > 0.4 && dominantBrightness < 0.6) {
          warnings.push("Logo appears mid-gray — choose 'Force light' or 'Force dark' treatment below to ensure contrast");
        }
      }
    } catch (e) {
      errors.push(`Could not read image: ${(e as Error).message}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata: { width, height, format, hasAlpha, dominantBrightness, fileSize },
  };
}

// ─── Re-encode (strip EXIF, normalise) ───────────────────────────────────────

export async function reencodeRaster(buffer: Buffer, mimeType: string): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  // Re-encoding through sharp strips EXIF and neutralises embedded payloads.
  const format = mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpeg" : "png";
  if (format === "jpeg") return sharp(buffer).jpeg({ quality: 95 }).toBuffer();
  return sharp(buffer).png().toBuffer();
}
