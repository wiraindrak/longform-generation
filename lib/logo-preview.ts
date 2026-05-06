// Server-side: generate a 64×64 PNG preview thumbnail and detect logo variant.
// Only imported in server contexts (API routes, composite).

const PREVIEW_SIZE = 64;

export type LogoVariant = "light" | "dark" | "ambiguous";

export interface PreviewResult {
  previewBase64: string;   // PNG data URL "data:image/png;base64,..."
  detectedVariant: LogoVariant;
  width: number;
  height: number;
}

// Average brightness threshold: >0.6 = light logo, <0.4 = dark logo, else ambiguous
const LIGHT_THRESHOLD = 0.6;
const DARK_THRESHOLD = 0.4;

export async function generateLogoPreview(
  buffer: Buffer,
  mimeType: string
): Promise<PreviewResult> {
  const sharp = (await import("sharp")).default;

  let inputBuffer = buffer;

  // SVG: rasterise to PNG first — never inline SVG to the browser.
  if (mimeType.includes("svg")) {
    inputBuffer = await sharp(buffer, { density: 300 })
      .resize(PREVIEW_SIZE * 2, PREVIEW_SIZE * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  // Resize to preview thumbnail with transparent background
  const previewBuf = await sharp(inputBuffer)
    .resize(PREVIEW_SIZE, PREVIEW_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const previewBase64 = `data:image/png;base64,${previewBuf.toString("base64")}`;

  // Brightness detection: sample non-transparent pixels only
  // Flatten onto a mid-gray background so fully-transparent = 128
  const { data, info } = await sharp(inputBuffer)
    .resize(32, 32, { fit: "contain", background: { r: 128, g: 128, b: 128 } })
    .flatten({ background: { r: 128, g: 128, b: 128 } })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  let totalBrightness = 0;
  let pixelCount = 0;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Skip mid-gray background pixels (r≈g≈b≈128) — those are empty space
    const isBg = Math.abs(r - 128) < 10 && Math.abs(g - 128) < 10 && Math.abs(b - 128) < 10;
    if (!isBg) {
      totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      pixelCount++;
    }
  }

  let detectedVariant: LogoVariant = "ambiguous";
  if (pixelCount > 0) {
    const avg = totalBrightness / pixelCount;
    if (avg > LIGHT_THRESHOLD) detectedVariant = "light";
    else if (avg < DARK_THRESHOLD) detectedVariant = "dark";
  }

  const meta = await sharp(inputBuffer).metadata();
  return {
    previewBase64,
    detectedVariant,
    width: meta.width ?? PREVIEW_SIZE,
    height: meta.height ?? PREVIEW_SIZE,
  };
}
