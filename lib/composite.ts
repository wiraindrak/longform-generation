/**
 * Post-compositing: overlays media brand and partner brand logos on
 * the AI-generated base image.
 *
 * Priority order for each logo slot:
 *   1. Uploaded logo (logoId from session cache)
 *   2. File on disk from logo library  (public/logos/{type}/{brandId}/primary-{variant}.{svg|png})
 *   3. SVG lozenge generated in-code (text-based fallback)
 *
 * Logo placement: media brand top-right, partner bottom-right (defaults).
 * Falls back to unmodified image if sharp fails.
 */

import path from "path";
import fs from "fs";
import { findLogo } from "./logos";
import { getCachedLogo } from "./logo-upload";
import type { MediaBrand, InfographicLayout } from "./types";

// ─── Zone definitions ─────────────────────────────────────────────────────────

interface LogoZone {
  anchor: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  offsetX: number;    // px from anchor edge
  offsetY: number;
  maxW: number;       // max logo width px
  maxH: number;       // max logo height px
  padding: number;    // background pill padding px
}

const MEDIA_ZONE: LogoZone  = { anchor: "top-right",    offsetX: 20, offsetY: 20, maxW: 140, maxH: 52, padding: 10 };
const PARTNER_ZONE: LogoZone = { anchor: "bottom-right", offsetX: 20, offsetY: 20, maxW: 120, maxH: 44, padding: 10 };

// magazine-cover: media logo bottom-left as a publication mark
const MAGAZINE_MEDIA_ZONE: LogoZone   = { anchor: "bottom-left", offsetX: 20, offsetY: 20, maxW: 100, maxH: 40, padding: 8 };
const MAGAZINE_PARTNER_ZONE: LogoZone = { anchor: "bottom-right", offsetX: 20, offsetY: 20, maxW: 100, maxH: 40, padding: 8 };

function getZones(layout: InfographicLayout | undefined): { media: LogoZone; partner: LogoZone } {
  if (layout === "magazine-cover") return { media: MAGAZINE_MEDIA_ZONE, partner: MAGAZINE_PARTNER_ZONE };
  return { media: MEDIA_ZONE, partner: PARTNER_ZONE };
}

// ─── Safe-zone instruction for image prompts ──────────────────────────────────

export function getSafeZoneInstruction(layout?: InfographicLayout): string {
  if (layout === "magazine-cover") {
    return "Keep bottom-left corner clean for media publication mark and bottom-right corner clean for brand partner attribution — no important visual content in 20% × 8% areas at those positions.";
  }
  return "Keep top-right corner and bottom-right corner clean — no important visual content in 20% × 8% areas at those positions. These are reserved for editorial brand overlays.";
}

// Legacy static export (used by prompts.ts fallback)
export const SAFE_ZONE_INSTRUCTION = getSafeZoneInstruction();

// ─── Position calculation ─────────────────────────────────────────────────────

function computePosition(
  zone: LogoZone,
  logoW: number,
  logoH: number,
  imgW: number,
  imgH: number
): { left: number; top: number } {
  const pillW = logoW + zone.padding * 2;
  const pillH = logoH + zone.padding * 2;
  let left: number, top: number;
  switch (zone.anchor) {
    case "top-left":    left = zone.offsetX; top = zone.offsetY; break;
    case "top-right":   left = imgW - zone.offsetX - pillW; top = zone.offsetY; break;
    case "bottom-left": left = zone.offsetX; top = imgH - zone.offsetY - pillH; break;
    case "bottom-right": left = imgW - zone.offsetX - pillW; top = imgH - zone.offsetY - pillH; break;
  }
  return { left: Math.max(0, left), top: Math.max(0, top) };
}

// ─── SVG lozenge builders (text fallback) ─────────────────────────────────────

type MediaBrandId = "detikcom" | "cnn-indonesia" | "cnbc-indonesia";

function mediaLozengeSvg(brand: MediaBrandId, w: number, h: number): string {
  const r = Math.round(h * 0.18);
  const fs = Math.round(h * 0.48);
  const cy = Math.round(h * 0.64);
  const pad = Math.round(h * 0.15);
  const configs: Record<MediaBrandId, { bg: string; fg: string; label: string; sub?: string; subFg?: string }> = {
    detikcom:         { bg: "#E00000", fg: "#FFFFFF", label: "detikcom" },
    "cnn-indonesia":  { bg: "#CC0000", fg: "#FFFFFF", label: "CNN", sub: "Indonesia", subFg: "#FFFFFF" },
    "cnbc-indonesia": { bg: "#003087", fg: "#FFFFFF", label: "CNBC", sub: "Indonesia", subFg: "#FFB800" },
  };
  const c = configs[brand];
  const subX = c.label.length <= 3 ? Math.round(w * 0.42) : Math.round(w * 0.52);
  const subSize = Math.round(fs * 0.58);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${c.bg}" opacity="0.92"/>
  <text x="${pad}" y="${cy}" font-family="Arial Black,Helvetica Neue,sans-serif" font-size="${fs}" font-weight="900" fill="${c.fg}" letter-spacing="-0.5">${c.label}</text>
  ${c.sub ? `<text x="${subX}" y="${cy}" font-family="Arial,Helvetica Neue,sans-serif" font-size="${subSize}" font-weight="700" fill="${c.subFg ?? c.fg}">${c.sub}</text>` : ""}
</svg>`;
}

function partnerLozengeSvg(name: string, w: number, h: number): string {
  const r = Math.round(h * 0.18);
  const labelSize = Math.round(h * 0.28);
  const nameSize = Math.round(h * 0.40);
  const labelY = Math.round(h * 0.40);
  const nameY = Math.round(h * 0.80);
  const pad = Math.round(w * 0.05);
  const display = name.length > 22 ? name.slice(0, 21) + "…" : name;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#1a1a1a" opacity="0.75"/>
  <text x="${pad}" y="${labelY}" font-family="Arial,Helvetica Neue,sans-serif" font-size="${labelSize}" font-weight="400" fill="#aaaaaa" letter-spacing="1">IN PARTNERSHIP WITH</text>
  <text x="${pad}" y="${nameY}" font-family="Arial Black,Helvetica Neue,sans-serif" font-size="${nameSize}" font-weight="900" fill="#FFFFFF">${display}</text>
</svg>`;
}

// ─── Logo buffer resolution ────────────────────────────────────────────────────

async function resolveLogoBuffer(opts: {
  logoId?: string;
  brandId?: string | null;
  brandType: "media" | "partner";
  zone: LogoZone;
  fallbackSvg: () => string;
}): Promise<Buffer | null> {
  const sharp = (await import("sharp")).default;
  const targetW = opts.zone.maxW;
  const targetH = opts.zone.maxH;
  const fit = "contain" as const;
  const bg = { r: 0, g: 0, b: 0, alpha: 0 };

  // 1. Uploaded logo from session cache
  if (opts.logoId) {
    const cached = getCachedLogo(opts.logoId);
    if (cached) {
      return sharp(cached.buffer).resize(targetW, targetH, { fit, background: bg }).png().toBuffer();
    }
  }

  // 2. File from logo library — tries: primary-light, primary-dark, icon-light, icon-dark (SVG before PNG each)
  if (opts.brandId) {
    const candidates = ["primary-light", "primary-dark", "primary", "icon-light", "icon-dark", "icon"];
    for (const name of candidates) {
      for (const ext of ["svg", "png"]) {
        const p = path.join(process.cwd(), "public", "logos", opts.brandType, opts.brandId, `${name}.${ext}`);
        if (fs.existsSync(p)) {
          return sharp(p).resize(targetW, targetH, { fit, background: bg }).png().toBuffer();
        }
      }
    }
  }

  // 3. SVG lozenge text fallback
  const pillW = targetW + opts.zone.padding * 2;
  const pillH = targetH + opts.zone.padding * 2;
  return sharp(Buffer.from(opts.fallbackSvg())).resize(pillW, pillH).png().toBuffer();
}

// ─── Background pill for real logo files ─────────────────────────────────────

async function pillBuffer(w: number, h: number): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const r = Math.round(h * 0.2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#000000" opacity="0.55"/>
</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

// ─── Public compositing function ──────────────────────────────────────────────

export async function compositeLogos(
  base64Image: string,
  mediaBrand: string,
  brandPartner: string,
  imageWidth: number,
  imageHeight: number,
  layout?: InfographicLayout,
  partnerLogoId?: string
): Promise<string> {
  try {
    const sharp = (await import("sharp")).default;
    const imgBuf = Buffer.from(base64Image, "base64");
    const { media: mZone, partner: pZone } = getZones(layout);

    const composites: import("sharp").OverlayOptions[] = [];

    // ── Media brand ────────────────────────────────────────────────────────────
    const mediaBrandId = findLogo(mediaBrand, "media");
    const validMediaIds: MediaBrandId[] = ["detikcom", "cnn-indonesia", "cnbc-indonesia"];
    const mediaId = validMediaIds.includes(mediaBrand as MediaBrandId)
      ? (mediaBrand as MediaBrandId)
      : (mediaBrandId.found ? mediaBrandId.brandId as MediaBrandId : null);

    if (mediaId) {
      const hasFile = (() => {
        for (const v of ["light", "dark"]) {
          for (const ext of ["svg", "png"]) {
            if (fs.existsSync(path.join(process.cwd(), "public", "logos", "media", mediaId, `primary-${v}.${ext}`))) return true;
          }
        }
        return false;
      })();

      let mediaLogoBuf: Buffer;
      if (hasFile) {
        const logoBuf = await resolveLogoBuffer({
          brandId: mediaId, brandType: "media", zone: mZone,
          fallbackSvg: () => mediaLozengeSvg(mediaId, mZone.maxW + mZone.padding * 2, mZone.maxH + mZone.padding * 2),
        });
        const pill = await pillBuffer(mZone.maxW + mZone.padding * 2, mZone.maxH + mZone.padding * 2);
        mediaLogoBuf = await sharp(pill).composite([{ input: logoBuf!, gravity: "center" }]).png().toBuffer();
      } else {
        mediaLogoBuf = await resolveLogoBuffer({
          brandId: null, brandType: "media", zone: mZone,
          fallbackSvg: () => mediaLozengeSvg(mediaId, mZone.maxW + mZone.padding * 2, mZone.maxH + mZone.padding * 2),
        }) as Buffer;
      }

      const pillW = mZone.maxW + mZone.padding * 2;
      const pillH = mZone.maxH + mZone.padding * 2;
      const { left, top } = computePosition(mZone, mZone.maxW, mZone.maxH, imageWidth, imageHeight);
      composites.push({ input: mediaLogoBuf, left, top, blend: "over" });
      console.log(`[composite] media=${mediaId} pillSize=${pillW}×${pillH} pos=(${left},${top})`);
    }

    // ── Partner brand ──────────────────────────────────────────────────────────
    if (brandPartner && brandPartner !== "the featured brand") {
      const partnerMatch = findLogo(brandPartner, "partner");
      const hasFile = partnerMatch.found && (() => {
        for (const v of ["light", "dark"]) {
          for (const ext of ["svg", "png"]) {
            if (fs.existsSync(path.join(process.cwd(), "public", "logos", "partners", partnerMatch.brandId!, `primary-${v}.${ext}`))) return true;
          }
        }
        return false;
      })();

      const hasCachedUpload = !!partnerLogoId && !!getCachedLogo(partnerLogoId);

      let partnerLogoBuf: Buffer;
      if (hasCachedUpload || hasFile) {
        const logoBuf = await resolveLogoBuffer({
          logoId: partnerLogoId,
          brandId: partnerMatch.found ? partnerMatch.brandId : null,
          brandType: "partner",
          zone: pZone,
          fallbackSvg: () => partnerLozengeSvg(brandPartner, pZone.maxW + pZone.padding * 2, pZone.maxH + pZone.padding * 2),
        });
        const pill = await pillBuffer(pZone.maxW + pZone.padding * 2, pZone.maxH + pZone.padding * 2);
        partnerLogoBuf = await sharp(pill).composite([{ input: logoBuf!, gravity: "center" }]).png().toBuffer();
      } else {
        partnerLogoBuf = await resolveLogoBuffer({
          brandId: null, brandType: "partner", zone: pZone,
          fallbackSvg: () => partnerLozengeSvg(brandPartner, pZone.maxW + pZone.padding * 2, pZone.maxH + pZone.padding * 2),
        }) as Buffer;
      }

      const { left, top } = computePosition(pZone, pZone.maxW, pZone.maxH, imageWidth, imageHeight);
      composites.push({ input: partnerLogoBuf, left, top, blend: "over" });
      console.log(`[composite] partner="${brandPartner}" logoId=${partnerLogoId ?? "none"} pos=(${left},${top})`);
    }

    if (composites.length === 0) return base64Image;
    const result = await sharp(imgBuf).composite(composites).png().toBuffer();
    return result.toString("base64");
  } catch (e) {
    console.warn("[composite] Logo overlay skipped:", (e as Error).message);
    return base64Image;
  }
}

// ─── Dimension helper ─────────────────────────────────────────────────────────

export function apiSizeToDimensions(apiSize: string): { w: number; h: number } {
  const [ws, hs] = apiSize.split("x");
  return { w: parseInt(ws, 10) || 1024, h: parseInt(hs, 10) || 1024 };
}
