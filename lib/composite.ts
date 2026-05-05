/**
 * Post-compositing: overlays media brand and partner brand lozenges on
 * the AI-generated base image.
 *
 * Media brand lozenges are generated from SVG in-code (no external files).
 * Partner logos are read from public/logos/partners/<slug>.png if present;
 * otherwise a styled text lozenge is generated.
 *
 * Falls back to unmodified image if sharp fails (e.g., SVG support not
 * compiled into the deployed binary).
 */

import path from "path";
import fs from "fs";

// ─── Logo placement zones (fractions of image dimensions) ────────────────────

export interface LogoZone {
  xFrac: number;
  yFrac: number;
  wFrac: number;
  hFrac: number;
  anchor: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const MEDIA_LOGO_ZONE: LogoZone = {
  xFrac: 0.02,
  yFrac: 0.015,
  wFrac: 0.22,
  hFrac: 0.065,
  anchor: "top-left",
};

export const PARTNER_LOGO_ZONE: LogoZone = {
  xFrac: 0.02,
  yFrac: 0.915,
  wFrac: 0.3,
  hFrac: 0.055,
  anchor: "bottom-left",
};

// Keep these corners clean in the image prompt so logos composite cleanly
export const SAFE_ZONE_INSTRUCTION =
  "Keep top-left corner and bottom-left corner clean — no important visual content in 25% × 8% areas at those positions. These are reserved for editorial brand overlays.";

// ─── SVG lozenge builders ─────────────────────────────────────────────────────

type MediaBrand = "detikcom" | "cnn-indonesia" | "cnbc-indonesia";

function mediaLozengeSvg(brand: MediaBrand, w: number, h: number): string {
  const pad = Math.round(h * 0.15);
  const r = Math.round(h * 0.18);
  const fs = Math.round(h * 0.48);
  const cy = Math.round(h * 0.64);

  const configs: Record<MediaBrand, { bg: string; fg: string; label: string; subLabel?: string; subFg?: string }> = {
    detikcom: {
      bg: "#E00000",
      fg: "#FFFFFF",
      label: "detikcom",
    },
    "cnn-indonesia": {
      bg: "#CC0000",
      fg: "#FFFFFF",
      label: "CNN",
      subLabel: "Indonesia",
      subFg: "#FFFFFF",
    },
    "cnbc-indonesia": {
      bg: "#003087",
      fg: "#FFFFFF",
      label: "CNBC",
      subLabel: "Indonesia",
      subFg: "#FFB800",
    },
  };

  const c = configs[brand];
  const subLabelX = c.label.length <= 3 ? Math.round(w * 0.42) : Math.round(w * 0.52);
  const subLabelSize = Math.round(fs * 0.58);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${c.bg}" opacity="0.92"/>
  <text x="${pad}" y="${cy}"
    font-family="Arial Black,Helvetica Neue,sans-serif"
    font-size="${fs}" font-weight="900"
    fill="${c.fg}" letter-spacing="-0.5">${c.label}</text>
  ${c.subLabel ? `<text x="${subLabelX}" y="${cy}"
    font-family="Arial,Helvetica Neue,sans-serif"
    font-size="${subLabelSize}" font-weight="700"
    fill="${c.subFg ?? c.fg}">${c.subLabel}</text>` : ""}
</svg>`;
}

function partnerLozengeSvg(name: string, w: number, h: number): string {
  const r = Math.round(h * 0.18);
  const labelSize = Math.round(h * 0.3);
  const nameSize = Math.round(h * 0.42);
  const labelY = Math.round(h * 0.42);
  const nameY = Math.round(h * 0.82);
  const pad = Math.round(w * 0.05);
  // Truncate long names
  const display = name.length > 20 ? name.slice(0, 19) + "…" : name;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#1a1a1a" opacity="0.72"/>
  <text x="${pad}" y="${labelY}"
    font-family="Arial,Helvetica Neue,sans-serif"
    font-size="${labelSize}" font-weight="400"
    fill="#aaaaaa" letter-spacing="1">IN PARTNERSHIP WITH</text>
  <text x="${pad}" y="${nameY}"
    font-family="Arial Black,Helvetica Neue,sans-serif"
    font-size="${nameSize}" font-weight="900"
    fill="#FFFFFF">${display}</text>
</svg>`;
}

// ─── Public compositing function ──────────────────────────────────────────────

export async function compositeLogos(
  base64Image: string,
  mediaBrand: string,
  brandPartner: string,
  imageWidth: number,
  imageHeight: number
): Promise<string> {
  try {
    const sharp = (await import("sharp")).default;

    const imgBuf = Buffer.from(base64Image, "base64");

    const mZone = MEDIA_LOGO_ZONE;
    const pZone = PARTNER_LOGO_ZONE;

    const mW = Math.round(imageWidth * mZone.wFrac);
    const mH = Math.round(imageHeight * mZone.hFrac);
    const mLeft = Math.round(imageWidth * mZone.xFrac);
    const mTop = Math.round(imageHeight * mZone.yFrac);

    const pW = Math.round(imageWidth * pZone.wFrac);
    const pH = Math.round(imageHeight * pZone.hFrac);
    const pLeft = Math.round(imageWidth * pZone.xFrac);
    const pTop = Math.round(imageHeight * pZone.yFrac);

    const composites: import("sharp").OverlayOptions[] = [];

    // ── Media brand lozenge ───────────────────────────────────────────────────
    const brandKey = mediaBrand as MediaBrand;
    const validBrands: MediaBrand[] = ["detikcom", "cnn-indonesia", "cnbc-indonesia"];

    // Check for a static logo file first (public/logos/media/<brand>.png)
    const staticMediaPath = path.join(process.cwd(), "public", "logos", "media", `${mediaBrand}.png`);
    if (validBrands.includes(brandKey) || fs.existsSync(staticMediaPath)) {
      let mediaBuf: Buffer;
      if (fs.existsSync(staticMediaPath)) {
        mediaBuf = await sharp(staticMediaPath).resize(mW, mH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
      } else {
        const svgStr = mediaLozengeSvg(brandKey, mW, mH);
        mediaBuf = await sharp(Buffer.from(svgStr)).resize(mW, mH).png().toBuffer();
      }
      composites.push({ input: mediaBuf, left: mLeft, top: mTop });
    }

    // ── Partner brand lozenge ─────────────────────────────────────────────────
    if (brandPartner && brandPartner !== "the featured brand") {
      const partnerSlug = brandPartner.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const staticPartnerPath = path.join(process.cwd(), "public", "logos", "partners", `${partnerSlug}.png`);

      let partnerBuf: Buffer;
      if (fs.existsSync(staticPartnerPath)) {
        partnerBuf = await sharp(staticPartnerPath)
          .resize(pW, pH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
      } else {
        const svgStr = partnerLozengeSvg(brandPartner, pW, pH);
        partnerBuf = await sharp(Buffer.from(svgStr)).resize(pW, pH).png().toBuffer();
      }
      composites.push({ input: partnerBuf, left: pLeft, top: pTop });
    }

    if (composites.length === 0) return base64Image;

    const result = await sharp(imgBuf).composite(composites).png().toBuffer();
    return result.toString("base64");
  } catch (e) {
    console.warn("[composite] Logo overlay skipped:", (e as Error).message);
    return base64Image;
  }
}

// ─── Lookup image dimensions from apiSize string ──────────────────────────────

export function apiSizeToDimensions(apiSize: string): { w: number; h: number } {
  const [ws, hs] = apiSize.split("x");
  return { w: parseInt(ws, 10) || 1024, h: parseInt(hs, 10) || 1024 };
}
