"use client";

import { useState, useCallback } from "react";
import clsx from "clsx";
import type {
  MediaBrand,
  OutputType,
  ImageRatio,
  ImageStyle,
  GenerationRequest,
  GeneratedStory,
  GeneratedImage,
  ProgressEvent,
} from "@/lib/types";
import { STYLE_INFO, RATIO_INFO, MEDIA_BRAND_LABELS } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────────────────────

type GenerationStatus =
  | { phase: "idle" }
  | {
      phase: "generating";
      step: string;
      message: string;
      percent: number;
      story: GeneratedStory | null;
      images: GeneratedImage[];
    }
  | { phase: "done"; story: GeneratedStory; images: GeneratedImage[] }
  | { phase: "error"; message: string };

// ─── Style SVG Previews ───────────────────────────────────────────────────────

function StylePreview({ style }: { style: ImageStyle }) {
  switch (style) {
    case "realistic":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="real-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A90D9" />
              <stop offset="100%" stopColor="#F7C59F" />
            </linearGradient>
            <linearGradient id="real-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7D9B6A" />
              <stop offset="100%" stopColor="#4A6741" />
            </linearGradient>
          </defs>
          <rect width="200" height="52" fill="url(#real-sky)" />
          <rect y="52" width="200" height="28" fill="url(#real-ground)" />
          {/* mountain silhouettes */}
          <polygon points="0,52 40,22 80,52" fill="#3a5f32" opacity="0.7" />
          <polygon points="60,52 110,18 160,52" fill="#2d4f28" opacity="0.85" />
          <polygon points="130,52 175,28 200,52" fill="#3a5f32" opacity="0.7" />
          {/* sun */}
          <circle cx="160" cy="18" r="9" fill="#FFD166" opacity="0.95" />
          <circle cx="160" cy="18" r="14" fill="#FFD166" opacity="0.15" />
          {/* clouds */}
          <ellipse cx="60" cy="14" rx="20" ry="7" fill="white" opacity="0.7" />
          <ellipse cx="75" cy="11" rx="14" ry="6" fill="white" opacity="0.6" />
        </svg>
      );

    case "typography":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#0a0a0a" />
          <text x="8" y="66" fontFamily="Georgia,serif" fontSize="58" fontWeight="900" fill="white" opacity="0.95">Aa</text>
          {/* decorative accent line */}
          <rect x="8" y="71" width="50" height="2" fill="#e11d48" />
          {/* text lines on right */}
          <rect x="118" y="22" width="72" height="5" rx="2" fill="white" opacity="0.4" />
          <rect x="118" y="33" width="60" height="4" rx="2" fill="white" opacity="0.25" />
          <rect x="118" y="42" width="68" height="4" rx="2" fill="white" opacity="0.25" />
          <rect x="118" y="51" width="45" height="4" rx="2" fill="white" opacity="0.2" />
          <rect x="118" y="60" width="55" height="4" rx="2" fill="white" opacity="0.15" />
        </svg>
      );

    case "editorial":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#fafafa" />
          {/* photo block */}
          <rect x="5" y="5" width="88" height="70" rx="3" fill="#d1d5db" />
          {/* photo overlay gradient */}
          <rect x="5" y="45" width="88" height="30" rx="3" fill="#1e293b" opacity="0.4" />
          {/* photo caption */}
          <rect x="12" y="60" width="50" height="4" rx="2" fill="white" opacity="0.8" />
          <rect x="12" y="67" width="35" height="3" rx="1.5" fill="white" opacity="0.5" />
          {/* headline */}
          <rect x="102" y="8" width="90" height="7" rx="2" fill="#111827" />
          <rect x="102" y="19" width="78" height="6" rx="2" fill="#111827" opacity="0.6" />
          {/* body text */}
          <rect x="102" y="34" width="90" height="3" rx="1" fill="#9ca3af" />
          <rect x="102" y="41" width="84" height="3" rx="1" fill="#9ca3af" />
          <rect x="102" y="48" width="90" height="3" rx="1" fill="#9ca3af" />
          <rect x="102" y="55" width="70" height="3" rx="1" fill="#9ca3af" />
          {/* brand bar */}
          <rect x="102" y="66" width="28" height="5" rx="2" fill="#E00000" />
        </svg>
      );

    case "cinematic":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="cin-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0d2535" />
              <stop offset="55%" stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#3d1c0a" />
            </linearGradient>
            <radialGradient id="cin-light" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="80" fill="url(#cin-bg)" />
          <rect width="200" height="80" fill="url(#cin-light)" />
          {/* letterbox bars */}
          <rect width="200" height="9" fill="#000" />
          <rect y="71" width="200" height="9" fill="#000" />
          {/* figure silhouette */}
          <circle cx="100" cy="36" r="10" fill="#000" opacity="0.75" />
          <path d="M84,64 Q100,48 116,64" fill="#000" opacity="0.7" />
          {/* horizon glow */}
          <rect x="0" y="52" width="200" height="8" fill="#f59e0b" opacity="0.06" />
          {/* teal flare top-left */}
          <circle cx="15" cy="25" r="18" fill="#0d9488" opacity="0.08" />
        </svg>
      );

    case "illustrated":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#EEF2FF" />
          {/* sky */}
          <rect width="200" height="45" fill="#DBEAFE" opacity="0.6" />
          {/* buildings */}
          <rect x="10" y="32" width="28" height="42" fill="#6366F1" />
          <rect x="22" y="26" width="10" height="6" fill="#4338CA" />
          <rect x="44" y="20" width="36" height="54" fill="#8B5CF6" />
          <rect x="50" y="14" width="22" height="6" fill="#7C3AED" />
          <rect x="86" y="34" width="24" height="40" fill="#A78BFA" />
          <rect x="116" y="24" width="32" height="50" fill="#6366F1" opacity="0.85" />
          <rect x="154" y="38" width="22" height="36" fill="#818CF8" />
          <rect x="180" y="30" width="18" height="44" fill="#6366F1" opacity="0.7" />
          {/* windows */}
          <rect x="48" y="30" width="5" height="5" rx="1" fill="white" opacity="0.5" />
          <rect x="58" y="30" width="5" height="5" rx="1" fill="white" opacity="0.5" />
          <rect x="48" y="40" width="5" height="5" rx="1" fill="white" opacity="0.5" />
          <rect x="58" y="40" width="5" height="5" rx="1" fill="white" opacity="0.5" />
          {/* sun */}
          <circle cx="168" cy="14" r="8" fill="#FDE68A" />
          {/* ground strip */}
          <rect x="0" y="73" width="200" height="7" fill="#4ADE80" opacity="0.5" />
        </svg>
      );

    case "infographic":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#f8fafc" />
          {/* bar chart */}
          <rect x="12" y="48" width="14" height="22" rx="2" fill="#3B82F6" />
          <rect x="32" y="32" width="14" height="38" rx="2" fill="#6366F1" />
          <rect x="52" y="40" width="14" height="30" rx="2" fill="#8B5CF6" />
          <rect x="72" y="18" width="14" height="52" rx="2" fill="#3B82F6" />
          <rect x="92" y="28" width="14" height="42" rx="2" fill="#6366F1" />
          <rect x="112" y="44" width="14" height="26" rx="2" fill="#8B5CF6" />
          {/* baseline */}
          <line x1="8" y1="70" x2="134" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* pie / donut chart */}
          <circle cx="170" cy="38" r="22" fill="none" stroke="#E2E8F0" strokeWidth="14" />
          <circle cx="170" cy="38" r="22" fill="none" stroke="#3B82F6" strokeWidth="14"
            strokeDasharray="48 90" strokeDashoffset="22" />
          <circle cx="170" cy="38" r="22" fill="none" stroke="#6366F1" strokeWidth="14"
            strokeDasharray="24 114" strokeDashoffset="-26" />
          <circle cx="170" cy="38" r="22" fill="none" stroke="#A78BFA" strokeWidth="14"
            strokeDasharray="18 120" strokeDashoffset="-50" />
          {/* stat callouts */}
          <rect x="10" y="6" width="28" height="4" rx="2" fill="#94a3b8" />
          <rect x="42" y="6" width="20" height="4" rx="2" fill="#94a3b8" opacity="0.6" />
        </svg>
      );

    case "dark-dramatic":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="dd-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06000f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="80" fill="#06000f" />
          <rect width="200" height="80" fill="url(#dd-glow)" />
          {/* concentric rings */}
          <circle cx="100" cy="40" r="36" fill="none" stroke="#a855f7" strokeWidth="0.8" opacity="0.5" />
          <circle cx="100" cy="40" r="26" fill="none" stroke="#7c3aed" strokeWidth="0.6" opacity="0.4" />
          <circle cx="100" cy="40" r="16" fill="none" stroke="#e879f9" strokeWidth="0.5" opacity="0.35" />
          {/* central glow */}
          <circle cx="100" cy="40" r="6" fill="#a855f7" opacity="0.6" />
          {/* horizontal lines */}
          <line x1="0" y1="40" x2="58" y2="40" stroke="#a855f7" strokeWidth="0.8" opacity="0.4" />
          <line x1="142" y1="40" x2="200" y2="40" stroke="#a855f7" strokeWidth="0.8" opacity="0.4" />
          {/* particles */}
          <circle cx="28" cy="14" r="1.5" fill="#e879f9" opacity="0.9" />
          <circle cx="172" cy="66" r="1.5" fill="#a855f7" opacity="0.9" />
          <circle cx="155" cy="12" r="1" fill="#7c3aed" opacity="0.7" />
          <circle cx="44" cy="68" r="1" fill="#e879f9" opacity="0.7" />
          <circle cx="185" cy="22" r="2" fill="#a855f7" opacity="0.5" />
          <circle cx="16" cy="58" r="1.5" fill="#7c3aed" opacity="0.6" />
        </svg>
      );

    case "clean-minimal":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#ffffff" />
          {/* single circle element */}
          <circle cx="100" cy="34" r="22" fill="none" stroke="#111827" strokeWidth="1.5" />
          <circle cx="100" cy="34" r="14" fill="#111827" opacity="0.06" />
          {/* baseline text mockup */}
          <rect x="62" y="63" width="76" height="2.5" rx="1.25" fill="#111827" opacity="0.8" />
          <rect x="78" y="69" width="44" height="2" rx="1" fill="#9ca3af" />
          {/* corner marks */}
          <line x1="8" y1="8" x2="20" y2="8" stroke="#111827" strokeWidth="1" opacity="0.3" />
          <line x1="8" y1="8" x2="8" y2="20" stroke="#111827" strokeWidth="1" opacity="0.3" />
          <line x1="192" y1="8" x2="180" y2="8" stroke="#111827" strokeWidth="1" opacity="0.3" />
          <line x1="192" y1="8" x2="192" y2="20" stroke="#111827" strokeWidth="1" opacity="0.3" />
        </svg>
      );

    case "vintage-press":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#f2e4c4" />
          {/* paper texture lines */}
          {[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76].map(y => (
            <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#c9a96e" strokeWidth="0.3" opacity="0.3" />
          ))}
          {/* header masthead */}
          <rect x="5" y="5" width="190" height="13" rx="1" fill="#2d1f0e" />
          <rect x="15" y="8" width="80" height="4" rx="1" fill="white" opacity="0.6" />
          <rect x="105" y="8" width="40" height="4" rx="1" fill="white" opacity="0.3" />
          {/* column dividers */}
          <line x1="68" y1="22" x2="68" y2="75" stroke="#8B7355" strokeWidth="0.6" opacity="0.5" />
          <line x1="133" y1="22" x2="133" y2="75" stroke="#8B7355" strokeWidth="0.6" opacity="0.5" />
          {/* col 1 text */}
          <rect x="8" y="24" width="54" height="4" rx="1" fill="#2d1f0e" opacity="0.75" />
          <rect x="8" y="31" width="50" height="2.5" rx="1" fill="#2d1f0e" opacity="0.4" />
          <rect x="8" y="36" width="52" height="2.5" rx="1" fill="#2d1f0e" opacity="0.4" />
          <rect x="8" y="41" width="46" height="2.5" rx="1" fill="#2d1f0e" opacity="0.4" />
          <rect x="8" y="46" width="54" height="2.5" rx="1" fill="#2d1f0e" opacity="0.35" />
          {/* col 2 image block */}
          <rect x="73" y="24" width="54" height="34" rx="1" fill="#8B7355" opacity="0.45" />
          <rect x="73" y="24" width="54" height="34" rx="1" fill="none" stroke="#8B7355" strokeWidth="0.5" />
          {/* col 3 text */}
          <rect x="138" y="24" width="54" height="4" rx="1" fill="#2d1f0e" opacity="0.6" />
          <rect x="138" y="31" width="50" height="2.5" rx="1" fill="#2d1f0e" opacity="0.35" />
          <rect x="138" y="36" width="52" height="2.5" rx="1" fill="#2d1f0e" opacity="0.35" />
          <rect x="138" y="41" width="46" height="2.5" rx="1" fill="#2d1f0e" opacity="0.35" />
          {/* footer rule */}
          <line x1="5" y1="72" x2="195" y2="72" stroke="#8B7355" strokeWidth="0.6" opacity="0.5" />
        </svg>
      );

    case "vibrant-gradient":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="vg-base" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="40%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="vg-circle1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <rect width="200" height="80" fill="url(#vg-base)" />
          {/* overlapping circles */}
          <circle cx="55" cy="40" r="48" fill="url(#vg-circle1)" opacity="0.55" />
          <circle cx="155" cy="36" r="42" fill="#8b5cf6" opacity="0.38" />
          <circle cx="100" cy="55" r="32" fill="#ec4899" opacity="0.25" />
          {/* highlight blob */}
          <ellipse cx="100" cy="32" rx="65" ry="18" fill="rgba(255,255,255,0.12)" />
          {/* sparkle dots */}
          <circle cx="30" cy="15" r="2.5" fill="white" opacity="0.7" />
          <circle cx="170" cy="65" r="2" fill="white" opacity="0.6" />
          <circle cx="155" cy="12" r="1.5" fill="white" opacity="0.5" />
        </svg>
      );
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-3">
      {children}
    </p>
  );
}

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      {children}
    </div>
  );
}

// Media brand card
function BrandCard({
  brand,
  selected,
  onClick,
}: {
  brand: MediaBrand;
  selected: boolean;
  onClick: () => void;
}) {
  const config: Record<MediaBrand, { bg: string; accent: string; tagline: string }> = {
    detikcom: {
      bg: "from-red-50 to-white",
      accent: "#E00000",
      tagline: "Indonesia's #1 News",
    },
    "cnn-indonesia": {
      bg: "from-red-50 to-white",
      accent: "#CC0000",
      tagline: "International Perspective",
    },
    "cnbc-indonesia": {
      bg: "from-blue-50 to-white",
      accent: "#003087",
      tagline: "Business & Finance",
    },
  };

  const c = config[brand];

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "relative w-full text-left rounded-lg p-4 border transition-all duration-200 bg-gradient-to-b",
        c.bg,
        selected
          ? "border-gray-800 ring-1 ring-gray-900/10 shadow-sm"
          : "border-gray-200 hover:border-gray-400"
      )}
    >
      <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: c.accent }} />
      <p className="font-semibold text-sm text-gray-900">
        {MEDIA_BRAND_LABELS[brand]}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{c.tagline}</p>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}

// Ratio card — proportionally correct rectangle in fixed bounding box
function RatioCard({
  ratio,
  selected,
  onClick,
}: {
  ratio: ImageRatio;
  selected: boolean;
  onClick: () => void;
}) {
  const info = RATIO_INFO[ratio];
  const BOX = 36; // fixed bounding box px
  const aspect = info.w / info.h;
  const boxW = aspect >= 1 ? BOX : Math.round(BOX * aspect);
  const boxH = aspect >= 1 ? Math.round(BOX / aspect) : BOX;

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center gap-2 py-3 px-1 rounded-lg border transition-all duration-200",
        selected
          ? "border-gray-800 bg-gray-50 ring-1 ring-gray-900/10 shadow-sm"
          : "border-gray-200 hover:border-gray-400 bg-white"
      )}
    >
      {/* ratio rectangle — proportionally correct */}
      <div
        className="flex items-center justify-center"
        style={{ width: BOX, height: BOX }}
      >
        <div
          className={clsx(
            "rounded-sm border-2 transition-colors",
            selected ? "border-gray-800 bg-gray-200" : "border-gray-400 bg-gray-100"
          )}
          style={{ width: boxW, height: boxH }}
        />
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-900">{info.label}</p>
        <p className="text-[10px] text-gray-400 leading-tight">{info.desc}</p>
      </div>
    </button>
  );
}

// Style card with real SVG preview
function StyleCard({
  style,
  selected,
  onClick,
}: {
  style: ImageStyle;
  selected: boolean;
  onClick: () => void;
}) {
  const info = STYLE_INFO[style];

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "relative text-left rounded-lg border overflow-hidden transition-all duration-200 group",
        selected
          ? "border-gray-800 ring-1 ring-gray-900/10 shadow-md"
          : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
      )}
    >
      {/* SVG visual preview */}
      <div className={clsx(
        "h-20 overflow-hidden transition-opacity duration-200 bg-gray-100",
        selected ? "opacity-100" : "opacity-85 group-hover:opacity-100"
      )}>
        <StylePreview style={style} />
      </div>
      {/* style info */}
      <div className="p-3 bg-white">
        <p className="text-xs font-semibold text-gray-900">{info.label}</p>
        <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
          {info.description}
        </p>
        <p className="text-[10px] text-gray-400 mt-1.5">{info.keywords}</p>
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}

// Progress bar
function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gray-900 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

// Image output card
function ImageCard({ image }: { image: GeneratedImage }) {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${image.base64}`;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [image]);

  return (
    <div className="group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="relative image-wrapper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${image.base64}`}
          alt={image.sectionHeadline}
          className="w-full h-auto block"
        />
        <div className="image-hover-overlay absolute inset-0 bg-black/40 flex items-center justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 13H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Download PNG
          </button>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-1">
          Slide {image.index + 1} · {image.filename}
        </p>
        <p className="text-sm font-medium text-gray-900 leading-snug">
          {image.sectionHeadline}
        </p>
        <button
          onClick={handleDownload}
          className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg py-2.5 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 1.5V8.5M6.5 8.5L4 6M6.5 8.5L9 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.5 11H11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Download PNG
        </button>
      </div>
    </div>
  );
}

// Skeleton placeholder
function ImageSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="shimmer aspect-video w-full" />
      <div className="p-4 space-y-2">
        <div className="shimmer h-3 w-20 rounded" />
        <div className="shimmer h-4 w-3/4 rounded" />
        <div className="shimmer h-8 w-full rounded-lg mt-3" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [topic, setTopic] = useState("");
  const [mediaBrand, setMediaBrand] = useState<MediaBrand>("detikcom");
  const [brandTarget, setBrandTarget] = useState("");
  const [ratio, setRatio] = useState<ImageRatio>("16:9");
  const [outputType, setOutputType] = useState<OutputType>("single");
  const [style, setStyle] = useState<ImageStyle>("editorial");
  const [status, setStatus] = useState<GenerationStatus>({ phase: "idle" });

  const isGenerating = status.phase === "generating";
  const isReady = topic.trim().length > 5 && brandTarget.trim().length > 1 && !isGenerating;

  const handleGenerate = useCallback(async () => {
    if (!isReady) return;

    setStatus({
      phase: "generating",
      step: "start",
      message: "Starting generation…",
      percent: 2,
      story: null,
      images: [],
    });

    const req: GenerationRequest = {
      topic: topic.trim(),
      mediaBrand,
      brandTarget: brandTarget.trim(),
      ratio,
      outputType,
      style,
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let currentStory: GeneratedStory | null = null;
      const currentImages: GeneratedImage[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let event: ProgressEvent;
          try {
            event = JSON.parse(line.slice(6));
          } catch {
            continue;
          }

          if (event.type === "error") {
            setStatus({ phase: "error", message: event.message });
            return;
          }

          if (event.type === "progress") {
            setStatus((prev) => ({
              phase: "generating",
              step: event.type === "progress" ? event.step : "",
              message: event.type === "progress" ? event.message : "",
              percent: event.type === "progress" ? event.percent : 0,
              story: prev.phase === "generating" ? prev.story : null,
              images: prev.phase === "generating" ? prev.images : [],
            }));
          }

          if (event.type === "story_done") {
            currentStory = event.story;
            setStatus((prev) => ({
              ...(prev as Extract<GenerationStatus, { phase: "generating" }>),
              story: event.story,
            }));
          }

          if (event.type === "image_done") {
            currentImages.push(event.image);
            const imagesCopy = [...currentImages];
            setStatus((prev) => ({
              ...(prev as Extract<GenerationStatus, { phase: "generating" }>),
              images: imagesCopy,
            }));
          }

          if (event.type === "done" && currentStory) {
            setStatus({ phase: "done", story: currentStory, images: currentImages });
          }
        }
      }
    } catch (err) {
      setStatus({
        phase: "error",
        message: (err as Error).message ?? "Connection error. Please try again.",
      });
    }
  }, [isReady, topic, mediaBrand, brandTarget, ratio, outputType, style]);

  const handleReset = () => setStatus({ phase: "idle" });

  const pendingImageSlots =
    status.phase === "generating"
      ? Math.max(0, (outputType === "three-slide" ? 3 : 1) - status.images.length)
      : 0;

  const activeStory =
    status.phase === "done"
      ? status.story
      : status.phase === "generating"
      ? status.story
      : null;

  const activeImages =
    status.phase === "done"
      ? status.images
      : status.phase === "generating"
      ? status.images
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="5" height="5" fill="white" />
              <rect x="8" y="1" width="5" height="5" fill="white" />
              <rect x="1" y="8" width="5" height="5" fill="white" />
              <rect x="8" y="8" width="5" height="5" fill="white" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold tracking-[0.1em] text-gray-900">LONGFORM</p>
            <p className="text-[10px] text-gray-400 tracking-wider">AI CONTENT GENERATOR</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-400">Kimi K2.5 · GPT Image</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 pb-20">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-3">
            Long-Form Visual Content
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From topic to publication-ready images — crafted for Indonesian media brands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Topic */}
            <FieldCard>
              <SectionLabel>01 — Topic or Moment</SectionLabel>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Kemacetan Jakarta makin parah di era kendaraan listrik — atau — How Indonesia's youth are reshaping democracy through social media"
                rows={3}
                disabled={isGenerating}
                className="w-full bg-transparent text-gray-900 text-sm placeholder:text-gray-400 resize-none outline-none leading-relaxed"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-gray-400">In English or Bahasa Indonesia</p>
                <p className={clsx("text-[10px]", topic.length > 300 ? "text-amber-500" : "text-gray-400")}>
                  {topic.length} chars
                </p>
              </div>
            </FieldCard>

            {/* Media Brand */}
            <FieldCard>
              <SectionLabel>02 — Media Brand</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                {(["detikcom", "cnn-indonesia", "cnbc-indonesia"] as MediaBrand[]).map((b) => (
                  <BrandCard
                    key={b}
                    brand={b}
                    selected={mediaBrand === b}
                    onClick={() => !isGenerating && setMediaBrand(b)}
                  />
                ))}
              </div>
            </FieldCard>

            {/* Brand Target */}
            <FieldCard>
              <SectionLabel>03 — Brand Partner</SectionLabel>
              <input
                type="text"
                value={brandTarget}
                onChange={(e) => setBrandTarget(e.target.value)}
                placeholder="e.g. Samsung Galaxy, Pertamina, Bank BCA, Toyota Innova"
                disabled={isGenerating}
                className="w-full bg-transparent text-gray-900 text-sm placeholder:text-gray-400 outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-2">
                The brand to align the story with and place naturally in the visuals
              </p>
            </FieldCard>

            {/* Style selector */}
            <FieldCard>
              <SectionLabel>06 — Visual Style</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {(Object.keys(STYLE_INFO) as ImageStyle[]).map((s) => (
                  <StyleCard
                    key={s}
                    style={s}
                    selected={style === s}
                    onClick={() => !isGenerating && setStyle(s)}
                  />
                ))}
              </div>
            </FieldCard>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-[73px]">
            {/* Ratio */}
            <FieldCard>
              <SectionLabel>04 — Image Ratio</SectionLabel>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(RATIO_INFO) as ImageRatio[]).map((r) => (
                  <RatioCard
                    key={r}
                    ratio={r}
                    selected={ratio === r}
                    onClick={() => !isGenerating && setRatio(r)}
                  />
                ))}
              </div>
            </FieldCard>

            {/* Output type */}
            <FieldCard>
              <SectionLabel>05 — Output Format</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => !isGenerating && setOutputType("single")}
                  className={clsx(
                    "p-3 rounded-lg border text-left transition-all",
                    outputType === "single"
                      ? "border-gray-800 bg-gray-50 ring-1 ring-gray-900/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                >
                  <div className="w-8 h-8 mb-2 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                    <div className="w-4 h-4 bg-gray-300 rounded-sm" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900">Single Image</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">1 hero visual</p>
                </button>
                <button
                  type="button"
                  onClick={() => !isGenerating && setOutputType("three-slide")}
                  className={clsx(
                    "p-3 rounded-lg border text-left transition-all",
                    outputType === "three-slide"
                      ? "border-gray-800 bg-gray-50 ring-1 ring-gray-900/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                >
                  <div className="h-8 mb-2 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex-1 h-full bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-300 rounded-sm" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-gray-900">3-Slide Story</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">3 sequential images</p>
                </button>
              </div>
            </FieldCard>

            {/* Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-400 space-y-1.5 shadow-sm">
              <div className="flex justify-between">
                <span>Story model</span>
                <span className="text-gray-700 font-medium">Kimi K2.5</span>
              </div>
              <div className="flex justify-between">
                <span>Image model</span>
                <span className="text-gray-700 font-medium">GPT 5.4 Image</span>
              </div>
              <div className="flex justify-between">
                <span>Output</span>
                <span className="text-gray-700 font-medium">
                  {outputType === "single" ? "1" : "3"} × {ratio} ({RATIO_INFO[ratio].apiSize})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Est. time</span>
                <span className="text-gray-700 font-medium">
                  {outputType === "single" ? "~30–60s" : "~90–180s"}
                </span>
              </div>
            </div>

            {/* Generate button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!isReady}
              className={clsx(
                "w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200",
                isGenerating
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed glow-active border border-gray-200"
                  : isReady
                  ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              )}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </span>
              ) : (
                "Generate Content"
              )}
            </button>

            {!isReady && !isGenerating && (
              <p className="text-center text-[10px] text-gray-400">
                {!topic.trim()
                  ? "Enter a topic to get started"
                  : !brandTarget.trim()
                  ? "Enter a brand partner name"
                  : "Fill in all fields"}
              </p>
            )}
          </div>
        </div>

        {/* ── Progress & Results ─────────────────────────────────────────────── */}
        {(status.phase === "generating" || status.phase === "done" || status.phase === "error") && (
          <div className="mt-10 border-t border-gray-200 pt-10">
            {/* Progress bar */}
            {status.phase === "generating" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">{status.message}</p>
                  <p className="text-sm font-mono text-gray-400">{status.percent}%</p>
                </div>
                <ProgressBar percent={status.percent} />
              </div>
            )}

            {/* Error */}
            {status.phase === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <p className="text-red-700 font-semibold mb-1">Generation Failed</p>
                <p className="text-red-600/80 text-sm">{status.message}</p>
                <button onClick={handleReset} className="mt-4 text-sm text-red-600 hover:text-red-800 underline">
                  Try again
                </button>
              </div>
            )}

            {/* Story */}
            {activeStory && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">
                      {status.phase === "done" ? "Generated Story" : "Story Crafted"}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900">{activeStory.mainHeadline}</h2>
                  </div>
                  {status.phase === "done" && (
                    <button
                      onClick={handleReset}
                      className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg transition-all"
                    >
                      Start Over
                    </button>
                  )}
                </div>

                {activeStory.sections.map((section, i) => (
                  <div key={i} className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                      {outputType === "three-slide" ? `Section ${i + 1}` : "Story"}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{section.headline}</h3>
                    <p className="text-gray-500 text-sm italic mb-3">{section.subheadline}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Images */}
            {(status.phase === "generating" || status.phase === "done") && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                    {status.phase === "done" ? "Generated Images" : "Generating Images"}
                  </p>
                  {status.phase === "done" && (
                    <p className="text-xs text-gray-400">
                      {activeImages.length} {activeImages.length === 1 ? "image" : "images"} ready
                    </p>
                  )}
                </div>
                <div className={clsx(
                  "grid gap-4",
                  outputType === "three-slide"
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 max-w-xl"
                )}>
                  {activeImages.map((img) => (
                    <ImageCard key={img.index} image={img} />
                  ))}
                  {Array.from({ length: pendingImageSlots }).map((_, i) => (
                    <ImageSkeleton key={`sk-${i}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white py-6 px-6 text-center">
        <p className="text-xs text-gray-400">
          LONGFORM · Powered by{" "}
          <span className="text-gray-600">Moonshot Kimi K2.5</span> &amp;{" "}
          <span className="text-gray-600">OpenAI GPT Image</span> via OpenRouter
        </p>
      </footer>
    </div>
  );
}
