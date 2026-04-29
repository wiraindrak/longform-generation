"use client";

import { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import type {
  MediaBrand,
  ImageRatio,
  InfographicTheme,
  InfographicLayout,
  SlideCount,
  GenerationRequest,
  GeneratedStory,
  GeneratedImage,
  ProgressEvent,
} from "@/lib/types";
import { THEME_INFO, LAYOUT_INFO, RATIO_INFO, MEDIA_BRAND_LABELS } from "@/lib/types";

// ─── Status type ─────────────────────────────────────────────────────────────

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

// ─── Color Theme SVG Previews ─────────────────────────────────────────────────

function ThemePreview({ theme }: { theme: InfographicTheme }) {
  switch (theme) {
    case "corporate":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#F8FAFC" />
          <rect width="200" height="11" fill="#1E3A5F" />
          <rect x="8" y="14" width="52" height="4" rx="1" fill="#3B82F6" opacity="0.5" />
          <rect x="8" y="21" width="36" height="3" rx="1" fill="#93C5FD" opacity="0.4" />
          <rect x="12" y="50" width="14" height="20" rx="1" fill="#3B82F6" />
          <rect x="30" y="38" width="14" height="32" rx="1" fill="#1E3A5F" />
          <rect x="48" y="44" width="14" height="26" rx="1" fill="#93C5FD" />
          <rect x="66" y="28" width="14" height="42" rx="1" fill="#3B82F6" opacity="0.85" />
          <rect x="84" y="42" width="14" height="28" rx="1" fill="#1E3A5F" opacity="0.65" />
          <line x1="8" y1="72" x2="106" y2="72" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#E2E8F0" strokeWidth="9" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#3B82F6" strokeWidth="9" strokeDasharray="42 72" strokeDashoffset="18" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#1E3A5F" strokeWidth="9" strokeDasharray="24 90" strokeDashoffset="-24" />
          <rect x="145" y="9" width="40" height="3" rx="1" fill="#93C5FD" opacity="0.4" />
        </svg>
      );

    case "dark-neon":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#0F0F1A" />
          <rect width="200" height="11" fill="#1a1a2e" />
          <circle cx="10" cy="5.5" r="2.5" fill="#06B6D4" />
          <circle cx="20" cy="5.5" r="2.5" fill="#A855F7" />
          <circle cx="30" cy="5.5" r="2.5" fill="#84CC16" />
          <rect x="8" y="15" width="44" height="3" rx="1" fill="#06B6D4" opacity="0.45" />
          <rect x="8" y="21" width="30" height="2.5" rx="1" fill="#A855F7" opacity="0.3" />
          <rect x="12" y="50" width="14" height="22" rx="1" fill="#06B6D4" />
          <rect x="30" y="36" width="14" height="36" rx="1" fill="#A855F7" />
          <rect x="48" y="44" width="14" height="28" rx="1" fill="#84CC16" />
          <rect x="66" y="26" width="14" height="46" rx="1" fill="#06B6D4" opacity="0.75" />
          <rect x="84" y="38" width="14" height="34" rx="1" fill="#A855F7" opacity="0.75" />
          <line x1="8" y1="74" x2="106" y2="74" stroke="#1e2040" strokeWidth="1" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#1e2040" strokeWidth="9" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#06B6D4" strokeWidth="9" strokeDasharray="42 72" strokeDashoffset="18" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#A855F7" strokeWidth="9" strokeDasharray="24 90" strokeDashoffset="-24" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#84CC16" strokeWidth="9" strokeDasharray="14 100" strokeDashoffset="-48" />
        </svg>
      );

    case "warm-bold":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#FFF7ED" />
          <rect width="200" height="11" fill="#F97316" />
          <rect x="8" y="14" width="50" height="4" rx="1" fill="#1C1917" opacity="0.5" />
          <rect x="8" y="21" width="34" height="3" rx="1" fill="#F97316" opacity="0.45" />
          <rect x="12" y="50" width="14" height="20" rx="1" fill="#F97316" />
          <rect x="30" y="38" width="14" height="32" rx="1" fill="#EF4444" />
          <rect x="48" y="44" width="14" height="26" rx="1" fill="#F59E0B" />
          <rect x="66" y="28" width="14" height="42" rx="1" fill="#F97316" opacity="0.8" />
          <rect x="84" y="40" width="14" height="30" rx="1" fill="#EF4444" opacity="0.7" />
          <line x1="8" y1="72" x2="106" y2="72" stroke="#FED7AA" strokeWidth="1" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#FED7AA" strokeWidth="9" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#F97316" strokeWidth="9" strokeDasharray="42 72" strokeDashoffset="18" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#EF4444" strokeWidth="9" strokeDasharray="24 90" strokeDashoffset="-24" />
          <rect x="145" y="9" width="40" height="3" rx="1" fill="#FED7AA" opacity="0.5" />
        </svg>
      );

    case "clean-white":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#FFFFFF" />
          <line x1="0" y1="11" x2="200" y2="11" stroke="#E5E7EB" strokeWidth="1" />
          <rect x="8" y="14" width="50" height="4" rx="1" fill="#111827" opacity="0.65" />
          <rect x="8" y="21" width="32" height="2.5" rx="1" fill="#9CA3AF" />
          <rect x="12" y="50" width="14" height="20" rx="1" fill="none" stroke="#374151" strokeWidth="1.5" />
          <rect x="30" y="38" width="14" height="32" rx="1" fill="#111827" opacity="0.1" stroke="#111827" strokeWidth="1.5" />
          <rect x="48" y="44" width="14" height="26" rx="1" fill="none" stroke="#374151" strokeWidth="1.5" />
          <rect x="66" y="28" width="14" height="42" rx="1" fill="#111827" opacity="0.15" stroke="#111827" strokeWidth="1.5" />
          <rect x="84" y="40" width="14" height="30" rx="1" fill="none" stroke="#374151" strokeWidth="1.5" />
          <line x1="8" y1="72" x2="106" y2="72" stroke="#E5E7EB" strokeWidth="1" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#F3F4F6" strokeWidth="9" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#111827" strokeWidth="9" strokeDasharray="42 72" strokeDashoffset="18" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#6B7280" strokeWidth="9" strokeDasharray="24 90" strokeDashoffset="-24" />
        </svg>
      );

    case "vivid-pop":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#FFFFFF" />
          <rect width="200" height="11" fill="#2D3436" />
          <circle cx="10" cy="5.5" r="2.5" fill="#FF6B6B" />
          <circle cx="20" cy="5.5" r="2.5" fill="#FFD93D" />
          <circle cx="30" cy="5.5" r="2.5" fill="#4ECDC4" />
          <circle cx="40" cy="5.5" r="2.5" fill="#6C63FF" />
          <rect x="12" y="50" width="14" height="20" rx="1" fill="#FF6B6B" />
          <rect x="30" y="38" width="14" height="32" rx="1" fill="#FFD93D" />
          <rect x="48" y="44" width="14" height="26" rx="1" fill="#4ECDC4" />
          <rect x="66" y="28" width="14" height="42" rx="1" fill="#6C63FF" />
          <rect x="84" y="40" width="14" height="30" rx="1" fill="#FF6B6B" opacity="0.65" />
          <line x1="8" y1="72" x2="106" y2="72" stroke="#E5E7EB" strokeWidth="1" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#F3F4F6" strokeWidth="9" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#FF6B6B" strokeWidth="9" strokeDasharray="42 72" strokeDashoffset="18" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#4ECDC4" strokeWidth="9" strokeDasharray="24 90" strokeDashoffset="-24" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#FFD93D" strokeWidth="9" strokeDasharray="14 100" strokeDashoffset="-48" />
          <rect x="50" y="14" width="30" height="3" rx="1" fill="#2D3436" opacity="0.2" />
        </svg>
      );

    case "editorial":
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="200" height="80" fill="#F5F0E8" />
          <rect width="200" height="11" fill="#2D1F0E" />
          <rect x="8" y="14" width="52" height="4" rx="1" fill="#2D1F0E" opacity="0.5" />
          <rect x="8" y="21" width="38" height="3" rx="1" fill="#B8966E" opacity="0.55" />
          <rect x="12" y="50" width="14" height="20" rx="1" fill="#D4A853" />
          <rect x="30" y="38" width="14" height="32" rx="1" fill="#2D1F0E" opacity="0.65" />
          <rect x="48" y="44" width="14" height="26" rx="1" fill="#7D9B6A" />
          <rect x="66" y="28" width="14" height="42" rx="1" fill="#D4A853" opacity="0.75" />
          <rect x="84" y="40" width="14" height="30" rx="1" fill="#B8966E" />
          <line x1="8" y1="72" x2="106" y2="72" stroke="#D4C4A8" strokeWidth="1" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#D4C4A8" strokeWidth="9" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#D4A853" strokeWidth="9" strokeDasharray="42 72" strokeDashoffset="18" />
          <circle cx="158" cy="48" r="18" fill="none" stroke="#7D9B6A" strokeWidth="9" strokeDasharray="24 90" strokeDashoffset="-24" />
          <rect x="145" y="9" width="40" height="3" rx="1" fill="#B8966E" opacity="0.35" />
        </svg>
      );
  }
}

// ─── Layout Type Icons ────────────────────────────────────────────────────────

function LayoutIcon({ layout }: { layout: InfographicLayout }) {
  switch (layout) {
    case "data-chart":
      return (
        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor">
          <rect x="1" y="24" width="7" height="10" rx="1" opacity="0.55" />
          <rect x="10" y="17" width="7" height="17" rx="1" />
          <rect x="19" y="21" width="7" height="13" rx="1" opacity="0.7" />
          <rect x="28" y="11" width="7" height="23" rx="1" />
          <rect x="0" y="35" width="36" height="1.5" rx="0.75" opacity="0.4" />
        </svg>
      );
    case "key-stats":
      return (
        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor">
          <rect x="0" y="4" width="16" height="14" rx="2" opacity="0.12" />
          <rect x="20" y="4" width="16" height="14" rx="2" opacity="0.12" />
          <rect x="2" y="7" width="12" height="7" rx="1" opacity="0.7" />
          <rect x="22" y="7" width="12" height="7" rx="1" opacity="0.7" />
          <rect x="2" y="16" width="8" height="2" rx="1" opacity="0.35" />
          <rect x="22" y="16" width="8" height="2" rx="1" opacity="0.35" />
          <rect x="0" y="24" width="36" height="9" rx="2" opacity="0.08" />
          <rect x="2" y="27" width="16" height="3.5" rx="1" opacity="0.4" />
        </svg>
      );
    case "timeline":
      return (
        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor">
          <line x1="3" y1="18" x2="33" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <circle cx="7" cy="18" r="3.5" />
          <circle cx="18" cy="18" r="3.5" opacity="0.7" />
          <circle cx="29" cy="18" r="3.5" opacity="0.45" />
          <rect x="3" y="23" width="8" height="2" rx="1" opacity="0.4" />
          <rect x="14" y="23" width="8" height="2" rx="1" opacity="0.3" />
          <rect x="25" y="23" width="8" height="2" rx="1" opacity="0.25" />
          <rect x="3" y="9" width="8" height="2" rx="1" opacity="0.3" />
          <rect x="14" y="9" width="8" height="2" rx="1" opacity="0.25" />
          <rect x="25" y="9" width="8" height="2" rx="1" opacity="0.2" />
        </svg>
      );
    case "comparison":
      return (
        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor">
          <rect x="0" y="3" width="15" height="30" rx="2" opacity="0.1" />
          <rect x="21" y="3" width="15" height="30" rx="2" opacity="0.1" />
          <rect x="2" y="5" width="11" height="4" rx="1" opacity="0.65" />
          <rect x="23" y="5" width="11" height="4" rx="1" opacity="0.65" />
          <rect x="2" y="12" width="9" height="2" rx="1" opacity="0.3" />
          <rect x="23" y="12" width="9" height="2" rx="1" opacity="0.3" />
          <rect x="2" y="16" width="11" height="2" rx="1" opacity="0.25" />
          <rect x="23" y="16" width="11" height="2" rx="1" opacity="0.25" />
          <rect x="2" y="20" width="8" height="2" rx="1" opacity="0.2" />
          <rect x="23" y="20" width="8" height="2" rx="1" opacity="0.2" />
          <line x1="18" y1="3" x2="18" y2="33" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
        </svg>
      );
    case "step-process":
      return (
        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor">
          <circle cx="7" cy="13" r="5" />
          <circle cx="18" cy="13" r="5" opacity="0.6" />
          <circle cx="29" cy="13" r="5" opacity="0.35" />
          <line x1="12" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="23" y1="13" x2="24" y2="13" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <rect x="2" y="21" width="10" height="2" rx="1" opacity="0.4" />
          <rect x="13" y="21" width="10" height="2" rx="1" opacity="0.3" />
          <rect x="24" y="21" width="10" height="2" rx="1" opacity="0.2" />
          <rect x="2" y="25" width="8" height="2" rx="1" opacity="0.25" />
          <rect x="13" y="25" width="8" height="2" rx="1" opacity="0.18" />
          <rect x="24" y="25" width="8" height="2" rx="1" opacity="0.12" />
        </svg>
      );
    case "fact-icons":
      return (
        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor">
          <circle cx="6" cy="9" r="4" opacity="0.75" />
          <circle cx="6" cy="19" r="4" opacity="0.5" />
          <circle cx="6" cy="29" r="4" opacity="0.3" />
          <rect x="13" y="6" width="20" height="3" rx="1" opacity="0.65" />
          <rect x="13" y="11" width="15" height="2" rx="1" opacity="0.3" />
          <rect x="13" y="16" width="20" height="3" rx="1" opacity="0.5" />
          <rect x="13" y="21" width="13" height="2" rx="1" opacity="0.25" />
          <rect x="13" y="26" width="20" height="3" rx="1" opacity="0.35" />
          <rect x="13" y="31" width="14" height="2" rx="1" opacity="0.18" />
        </svg>
      );
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
    detikcom:       { bg: "from-red-50 to-white",  accent: "#E00000", tagline: "Indonesia's #1 News" },
    "cnn-indonesia":  { bg: "from-red-50 to-white",  accent: "#CC0000", tagline: "International Perspective" },
    "cnbc-indonesia": { bg: "from-blue-50 to-white", accent: "#003087", tagline: "Business & Finance" },
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
      <p className="font-semibold text-sm text-gray-900">{MEDIA_BRAND_LABELS[brand]}</p>
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
  const BOX = 32;
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
      <div className="flex items-center justify-center" style={{ width: BOX, height: BOX }}>
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

function ThemeCard({
  theme,
  selected,
  onClick,
}: {
  theme: InfographicTheme;
  selected: boolean;
  onClick: () => void;
}) {
  const info = THEME_INFO[theme];

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
      <div
        className={clsx(
          "h-[72px] overflow-hidden transition-opacity duration-200",
          selected ? "opacity-100" : "opacity-85 group-hover:opacity-100"
        )}
      >
        <ThemePreview theme={theme} />
      </div>
      <div className="p-2.5 bg-white">
        <div className="flex items-center gap-1 mb-1">
          {info.colors.map((c) => (
            <span
              key={c}
              className="w-2.5 h-2.5 rounded-full border border-white/50 shadow-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <p className="text-[11px] font-semibold text-gray-900">{info.label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2">
          {info.description}
        </p>
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

function LayoutCard({
  layout,
  selected,
  onClick,
}: {
  layout: InfographicLayout;
  selected: boolean;
  onClick: () => void;
}) {
  const info = LAYOUT_INFO[layout];

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "relative flex flex-col items-center text-center gap-2 p-3 rounded-lg border transition-all duration-200",
        selected
          ? "border-gray-800 bg-gray-50 ring-1 ring-gray-900/10 shadow-sm"
          : "border-gray-200 hover:border-gray-400 bg-white"
      )}
    >
      <div className={clsx("transition-colors", selected ? "text-gray-900" : "text-gray-400")}>
        <LayoutIcon layout={layout} />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-gray-900">{info.label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2">
          {info.description}
        </p>
      </div>
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}

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

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: GeneratedImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const image = images[idx];
  const hasPrev = idx > 0;
  const hasNext = idx < images.length - 1;

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${image.base64}`;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [image]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) setIdx((i) => i - 1);
      if (e.key === "ArrowRight" && hasNext) setIdx((i) => i + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, hasPrev, hasNext]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="w-full max-w-5xl flex items-center justify-between mb-3 px-1 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          {images.length > 1 && (
            <span className="text-white/40 text-xs font-mono shrink-0">
              {idx + 1} / {images.length}
            </span>
          )}
          <p className="text-white/70 text-sm truncate">{image.sectionHeadline}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5V8.5M6.5 8.5L4 6M6.5 8.5L9 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.5 11H11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Download PNG
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image + prev/next */}
      <div
        className="relative flex items-center justify-center w-full max-w-5xl min-h-0 flex-1"
        onClick={(e) => e.stopPropagation()}
      >
        {hasPrev && (
          <button
            onClick={() => setIdx((i) => i - 1)}
            className="absolute left-0 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors -translate-x-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={image.index}
          src={`data:image/png;base64,${image.base64}`}
          alt={image.sectionHeadline}
          className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
        />

        {hasNext && (
          <button
            onClick={() => setIdx((i) => i + 1)}
            className="absolute right-0 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors translate-x-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Dot indicators for multi-slide */}
      {images.length > 1 && (
        <div
          className="flex items-center gap-2 mt-4 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={clsx(
                "w-1.5 h-1.5 rounded-full transition-all",
                i === idx ? "bg-white scale-125" : "bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Image Card ───────────────────────────────────────────────────────────────

function ImageCard({
  image,
  onExpand,
}: {
  image: GeneratedImage;
  onExpand: () => void;
}) {
  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${image.base64}`;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [image]
  );

  return (
    <div className="group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image — click to expand */}
      <div
        className="relative cursor-zoom-in"
        onClick={onExpand}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${image.base64}`}
          alt={image.sectionHeadline}
          className="w-full h-auto block"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 bg-black/60 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 5V1H5M8 1H12V5M12 8V12H8M5 12H1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View full
          </span>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-white text-gray-900 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5V8.5M6.5 8.5L4 6M6.5 8.5L9 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.5 11H11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            PNG
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 truncate">Slide {image.index + 1} · {image.filename}</p>
          <p className="text-sm font-medium text-gray-900 leading-snug mt-0.5 line-clamp-1">{image.sectionHeadline}</p>
        </div>
        <button
          onClick={handleDownload}
          className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v6M6 7L4 5M6 7L8 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}

function ImageSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="shimmer aspect-[9/16] w-full" />
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="shimmer h-3 w-24 rounded" />
          <div className="shimmer h-4 w-3/4 rounded" />
        </div>
        <div className="shimmer h-8 w-20 rounded-lg shrink-0" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [topic, setTopic] = useState("");
  const [mediaBrand, setMediaBrand] = useState<MediaBrand>("detikcom");
  const [brandTarget, setBrandTarget] = useState("");
  const [ratio, setRatio] = useState<ImageRatio>("9:16");
  const [slideCount, setSlideCount] = useState<SlideCount>(1);
  const [colorTheme, setColorTheme] = useState<InfographicTheme>("corporate");
  const [layout, setLayout] = useState<InfographicLayout>("data-chart");
  const [status, setStatus] = useState<GenerationStatus>({ phase: "idle" });
  const [archiveSave, setArchiveSave] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isGenerating = status.phase === "generating";
  const isReady = topic.trim().length > 5 && brandTarget.trim().length > 1 && !isGenerating;

  const handleGenerate = useCallback(async () => {
    if (!isReady) return;

    setArchiveSave("idle");
    setStatus({ phase: "generating", step: "start", message: "Starting generation…", percent: 2, story: null, images: [] });

    const req: GenerationRequest = {
      topic: topic.trim(),
      mediaBrand,
      brandTarget: brandTarget.trim(),
      ratio,
      slideCount,
      colorTheme,
      layout,
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

            setArchiveSave("saving");
            (async () => {
              try {
                let thumbnail: string | null = null;
                if (currentImages[0]?.base64) {
                  thumbnail = await new Promise<string>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      const maxW = 480;
                      canvas.width = maxW;
                      canvas.height = Math.round(maxW / (img.width / img.height));
                      const ctx = canvas.getContext("2d");
                      if (!ctx) { resolve(""); return; }
                      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                      resolve(canvas.toDataURL("image/jpeg", 0.72).split(",")[1] ?? "");
                    };
                    img.onerror = () => resolve("");
                    img.src = `data:image/png;base64,${currentImages[0].base64}`;
                  });
                }
                const res = await fetch("/api/archive", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    topic: topic.trim(),
                    mediaBrand,
                    brandTarget: brandTarget.trim(),
                    ratio,
                    slideCount,
                    colorTheme,
                    layout,
                    story: currentStory,
                    images: currentImages,
                    thumbnail,
                  }),
                });
                if (!res.ok) throw new Error("Save failed");
                const saved = await res.json();
                setArchiveId(saved.id ?? null);
                setArchiveSave("saved");
              } catch {
                setArchiveSave("error");
              }
            })();
          }
        }
      }
    } catch (err) {
      setStatus({ phase: "error", message: (err as Error).message ?? "Connection error. Please try again." });
    }
  }, [isReady, topic, mediaBrand, brandTarget, ratio, slideCount, colorTheme, layout]);

  const handleReset = () => {
    setStatus({ phase: "idle" });
    setArchiveSave("idle");
    setArchiveId(null);
    setLightboxIndex(null);
  };

  const pendingImageSlots =
    status.phase === "generating"
      ? Math.max(0, slideCount - status.images.length)
      : 0;

  const activeStory =
    status.phase === "done" ? status.story :
    status.phase === "generating" ? status.story : null;

  const activeImages =
    status.phase === "done" ? status.images :
    status.phase === "generating" ? status.images : [];

  const estTime =
    slideCount === 1 ? "~30–60s" :
    slideCount === 3 ? "~90–180s" : "~4–6 min";

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-10 pb-20">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 mb-4 shadow-sm">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0.5" y="0.5" width="4.5" height="4.5" rx="1" fill="#3B82F6" />
              <rect x="7" y="0.5" width="4.5" height="4.5" rx="1" fill="#6366F1" />
              <rect x="0.5" y="7" width="4.5" height="4.5" rx="1" fill="#06B6D4" />
              <rect x="7" y="7" width="4.5" height="4.5" rx="1" fill="#3B82F6" opacity="0.5" />
            </svg>
            <span className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Infographic Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-3">
            Visual Data Storytelling
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Turn any topic into a publication-ready infographic — styled for Indonesian media brands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Topic */}
            <FieldCard>
              <SectionLabel>01 — Topic or Story</SectionLabel>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Kemacetan Jakarta makin parah di era kendaraan listrik — atau — How Indonesia's youth are reshaping democracy through social media"
                rows={3}
                disabled={isGenerating}
                className="w-full bg-transparent text-gray-900 text-sm placeholder:text-gray-400 resize-none outline-none leading-relaxed"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-gray-400">Bahasa Indonesia or English</p>
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
                  <BrandCard key={b} brand={b} selected={mediaBrand === b} onClick={() => !isGenerating && setMediaBrand(b)} />
                ))}
              </div>
            </FieldCard>

            {/* Brand Partner */}
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
                The brand woven naturally into the data story and visuals
              </p>
            </FieldCard>

            {/* Layout Type */}
            <FieldCard>
              <SectionLabel>04 — Infographic Layout</SectionLabel>
              <div className="grid grid-cols-3 gap-2.5">
                {(Object.keys(LAYOUT_INFO) as InfographicLayout[]).map((l) => (
                  <LayoutCard key={l} layout={l} selected={layout === l} onClick={() => !isGenerating && setLayout(l)} />
                ))}
              </div>
            </FieldCard>

            {/* Color Theme */}
            <FieldCard>
              <SectionLabel>05 — Color Theme</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.keys(THEME_INFO) as InfographicTheme[]).map((t) => (
                  <ThemeCard key={t} theme={t} selected={colorTheme === t} onClick={() => !isGenerating && setColorTheme(t)} />
                ))}
              </div>
            </FieldCard>

          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-[73px]">

            {/* Ratio */}
            <FieldCard>
              <SectionLabel>06 — Aspect Ratio</SectionLabel>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(RATIO_INFO) as ImageRatio[]).map((r) => (
                  <RatioCard key={r} ratio={r} selected={ratio === r} onClick={() => !isGenerating && setRatio(r)} />
                ))}
              </div>
            </FieldCard>

            {/* Slide count */}
            <FieldCard>
              <SectionLabel>07 — Number of Slides</SectionLabel>
              <div className="grid grid-cols-3 gap-2">
                {([1, 3, 5] as SlideCount[]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => !isGenerating && setSlideCount(n)}
                    className={clsx(
                      "py-2.5 rounded-lg border text-sm font-semibold transition-all",
                      slideCount === n
                        ? "border-gray-800 bg-gray-900 text-white shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                {slideCount === 5 ? "5 slides takes ~4–6 min" : slideCount === 3 ? "3 slides takes ~90–180s" : "Single slide ~30–60s"}
              </p>
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
                <span>Layout</span>
                <span className="text-gray-700 font-medium">{LAYOUT_INFO[layout].label}</span>
              </div>
              <div className="flex justify-between">
                <span>Theme</span>
                <span className="text-gray-700 font-medium">{THEME_INFO[colorTheme].label}</span>
              </div>
              <div className="flex justify-between">
                <span>Output</span>
                <span className="text-gray-700 font-medium">
                  {slideCount} × {ratio} ({RATIO_INFO[ratio].apiSize})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Est. time</span>
                <span className="text-gray-700 font-medium">{estTime}</span>
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
                "Generate Infographic"
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

            {/* Archive save status */}
            {archiveSave !== "idle" && (
              <div className={clsx(
                "inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-6",
                archiveSave === "saving" && "bg-gray-100 text-gray-500",
                archiveSave === "saved"  && "bg-emerald-50 text-emerald-700",
                archiveSave === "error"  && "bg-red-50 text-red-600",
              )}>
                {archiveSave === "saving" && (
                  <><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving to archive…</>
                )}
                {archiveSave === "saved" && (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Saved to archive
                    {archiveId && <a href={`/archive/${archiveId}`} className="ml-1 underline font-semibold">View →</a>}
                  </>
                )}
                {archiveSave === "error" && "⚠ Archive save failed"}
              </div>
            )}

            {/* Progress */}
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
                    {slideCount > 1 && (
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                        Slide {i + 1}
                      </p>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{section.headline}</h3>
                    <p className="text-gray-500 text-sm italic mb-3">{section.subheadline}</p>
                    <div className="text-gray-600 text-sm leading-relaxed space-y-1">
                      {section.body.split("\n").map((line, j) => (
                        <p key={j}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Images */}
            {(status.phase === "generating" || status.phase === "done") && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                    {status.phase === "done" ? "Generated Infographics" : "Generating Infographics"}
                  </p>
                  {status.phase === "done" && (
                    <p className="text-xs text-gray-400">
                      {activeImages.length} {activeImages.length === 1 ? "slide" : "slides"} ready · click to expand
                    </p>
                  )}
                </div>
                <div className={clsx(
                  "grid gap-5",
                  slideCount >= 3
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 max-w-lg"
                )}>
                  {activeImages.map((img) => (
                    <ImageCard
                      key={img.index}
                      image={img}
                      onExpand={() => setLightboxIndex(img.index)}
                    />
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
          INFOGRAPHIC · Powered by{" "}
          <span className="text-gray-600">Moonshot Kimi K2.5</span> &amp;{" "}
          <span className="text-gray-600">OpenAI GPT Image</span> via OpenRouter
        </p>
      </footer>

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && activeImages.length > 0 && (
        <Lightbox
          images={activeImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
