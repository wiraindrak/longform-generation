"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { MediaBrand } from "@/lib/types";
import { STYLE_INFO, RATIO_INFO } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArchiveEntry {
  id: string;
  topic: string;
  media_brand: MediaBrand;
  brand_target: string;
  ratio: string;
  output_type: string;
  style: string;
  main_headline: string | null;
  language: string | null;
  thumbnail: string | null;
  created_at: string;
  image_count: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND_CONFIG: Record<
  MediaBrand,
  { label: string; color: string; badgeBg: string; badgeText: string; dot: string }
> = {
  detikcom: {
    label: "detikcom",
    color: "#E00000",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
    dot: "bg-red-500",
  },
  "cnn-indonesia": {
    label: "CNN Indonesia",
    color: "#CC0000",
    badgeBg: "bg-red-50",
    badgeText: "text-red-800",
    dot: "bg-red-700",
  },
  "cnbc-indonesia": {
    label: "CNBC Indonesia",
    color: "#003087",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-800",
    dot: "bg-blue-700",
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Archive Card ─────────────────────────────────────────────────────────────

function ArchiveCard({ entry }: { entry: ArchiveEntry }) {
  const brand = BRAND_CONFIG[entry.media_brand] ?? BRAND_CONFIG.detikcom;
  const styleLabel = STYLE_INFO[entry.style as keyof typeof STYLE_INFO]?.label ?? entry.style;
  const ratioLabel = RATIO_INFO[entry.ratio as keyof typeof RATIO_INFO]?.label ?? entry.ratio;

  return (
    <Link
      href={`/archive/${entry.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {entry.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/jpeg;base64,${entry.thumbnail}`}
            alt={entry.main_headline ?? entry.topic}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: brand.color + "20" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" fill={brand.color} opacity="0.6" />
                <rect x="9" y="1" width="6" height="6" rx="1" fill={brand.color} opacity="0.4" />
                <rect x="1" y="9" width="6" height="6" rx="1" fill={brand.color} opacity="0.4" />
                <rect x="9" y="9" width="6" height="6" rx="1" fill={brand.color} opacity="0.6" />
              </svg>
            </div>
            <p className="text-xs text-gray-400">No preview</p>
          </div>
        )}
        {/* Image count badge */}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
          {entry.image_count} {entry.image_count === 1 ? "image" : "images"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        {/* Brand + time */}
        <div className="flex items-center justify-between">
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full",
              brand.badgeBg,
              brand.badgeText
            )}
          >
            <span className={clsx("w-1.5 h-1.5 rounded-full", brand.dot)} />
            {brand.label}
          </span>
          <span className="text-[10px] text-gray-400">{timeAgo(entry.created_at)}</span>
        </div>

        {/* Headline */}
        <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
          {entry.main_headline ?? entry.topic}
        </p>

        {/* Topic */}
        <p className="text-xs text-gray-500 line-clamp-1">{entry.topic}</p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {styleLabel}
          </span>
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {ratioLabel}
          </span>
          {entry.brand_target && (
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full truncate max-w-[100px]">
              {entry.brand_target}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="aspect-video shimmer" />
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <div className="shimmer h-4 w-24 rounded-full" />
          <div className="shimmer h-3 w-12 rounded" />
        </div>
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-3/4 rounded" />
        <div className="shimmer h-3 w-1/2 rounded mt-1" />
        <div className="flex gap-1 pt-2">
          <div className="shimmer h-4 w-16 rounded-full" />
          <div className="shimmer h-4 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ brand }: { brand: string | null }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="2" width="10" height="10" rx="2" fill="#d1d5db" />
          <rect x="16" y="2" width="10" height="10" rx="2" fill="#d1d5db" />
          <rect x="2" y="16" width="10" height="10" rx="2" fill="#d1d5db" />
          <rect x="16" y="16" width="10" height="10" rx="2" fill="#e5e7eb" />
        </svg>
      </div>
      <p className="text-gray-900 font-semibold mb-1">No generations yet</p>
      <p className="text-gray-400 text-sm max-w-xs">
        {brand
          ? `No content generated for ${brand} yet.`
          : "Generate your first long-form content to see it here."}
      </p>
      <Link
        href="/"
        className="mt-6 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Generate Content
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type BrandFilter = "all" | MediaBrand;

const TABS: { value: BrandFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "detikcom", label: "detikcom" },
  { value: "cnn-indonesia", label: "CNN Indonesia" },
  { value: "cnbc-indonesia", label: "CNBC Indonesia" },
];

export default function ArchivePage() {
  const [allEntries, setAllEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<BrandFilter>("all");

  const fetchArchive = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/archive");
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setAllEntries(data.generations ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchive();
  }, [fetchArchive]);

  // Client-side brand filter
  const filtered =
    activeTab === "all"
      ? allEntries
      : allEntries.filter((e) => e.media_brand === activeTab);

  // Count per brand for tab badges
  const counts = {
    all: allEntries.length,
    detikcom: allEntries.filter((e) => e.media_brand === "detikcom").length,
    "cnn-indonesia": allEntries.filter((e) => e.media_brand === "cnn-indonesia").length,
    "cnbc-indonesia": allEntries.filter((e) => e.media_brand === "cnbc-indonesia").length,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-1">Archive</h1>
        <p className="text-gray-500">
          All generated content — browse by media brand.
        </p>
      </div>

      {/* Brand tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={clsx(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors",
              activeTab === tab.value
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            )}
          >
            {tab.label}
            {!loading && (
              <span
                className={clsx(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-semibold min-w-[20px] text-center",
                  activeTab === tab.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {counts[tab.value]}
              </span>
            )}
          </button>
        ))}

        {/* Refresh */}
        <button
          onClick={fetchArchive}
          disabled={loading}
          className="ml-auto p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
          title="Refresh"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={loading ? "animate-spin" : ""}
          >
            <path
              d="M13 7A6 6 0 1 1 7 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d="M7 1L10 4M7 1L4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
          Failed to load archive: {error}
          <button onClick={fetchArchive} className="ml-3 underline">
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <EmptyState brand={activeTab === "all" ? null : BRAND_CONFIG[activeTab as MediaBrand]?.label ?? null} />
        ) : (
          filtered.map((entry) => <ArchiveCard key={entry.id} entry={entry} />)
        )}
      </div>
    </main>
  );
}
