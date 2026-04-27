"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { STYLE_INFO, RATIO_INFO } from "@/lib/types";
import type { MediaBrand, StorySection } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GeneratedImageRow {
  index: number;
  sectionHeadline: string;
  base64: string;
  filename: string;
}

interface ArchiveDetail {
  id: string;
  topic: string;
  media_brand: MediaBrand;
  brand_target: string;
  ratio: string;
  output_type: string;
  style: string;
  main_headline: string | null;
  language: string | null;
  story_sections: StorySection[];
  images: GeneratedImageRow[];
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND_CONFIG: Record<MediaBrand, { label: string; color: string; badgeBg: string; badgeText: string }> = {
  detikcom: {
    label: "detikcom",
    color: "#E00000",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
  },
  "cnn-indonesia": {
    label: "CNN Indonesia",
    color: "#CC0000",
    badgeBg: "bg-red-50",
    badgeText: "text-red-800",
  },
  "cnbc-indonesia": {
    label: "CNBC Indonesia",
    color: "#003087",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-800",
  },
};

// ─── Image Card ───────────────────────────────────────────────────────────────

function ImageCard({ image, index, total }: { image: GeneratedImageRow; index: number; total: number }) {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${image.base64}`;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [image]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="relative group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${image.base64}`}
          alt={image.sectionHeadline}
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <button
            onClick={handleDownload}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 font-semibold text-sm px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v7M7 8L5 6M7 8L9 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Download
          </button>
        </div>
      </div>
      <div className="p-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          {total > 1 && (
            <p className="text-[10px] text-gray-400 mb-0.5">Slide {index + 1} of {total}</p>
          )}
          <p className="text-sm font-medium text-gray-900 truncate">{image.sectionHeadline}</p>
        </div>
        <button
          onClick={handleDownload}
          className="shrink-0 flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v6M6 7L4 5M6 7L8 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          PNG
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ArchiveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [gen, setGen] = useState<ArchiveDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/archive/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setGen(data.generation);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this generation from the archive?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/archive/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/archive");
    } catch (err) {
      alert((err as Error).message);
      setDeleting(false);
    }
  }, [id, router]);

  const handleDownloadAll = useCallback(() => {
    if (!gen) return;
    gen.images.forEach((img) => {
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${img.base64}`;
      link.download = img.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }, [gen]);

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="shimmer h-6 w-32 rounded mb-8" />
        <div className="shimmer h-10 w-3/4 rounded mb-4" />
        <div className="shimmer h-4 w-1/2 rounded mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="shimmer aspect-video rounded-xl" />
          ))}
        </div>
      </main>
    );
  }

  if (error || !gen) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/archive" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-6">
          ← Back to Archive
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          {error ?? "Generation not found."}
        </div>
      </main>
    );
  }

  const brand = BRAND_CONFIG[gen.media_brand] ?? BRAND_CONFIG.detikcom;
  const styleLabel = STYLE_INFO[gen.style as keyof typeof STYLE_INFO]?.label ?? gen.style;
  const ratioLabel = RATIO_INFO[gen.ratio as keyof typeof RATIO_INFO]?.label ?? gen.ratio;
  const isThreeSlide = gen.output_type === "three-slide";
  const date = new Date(gen.created_at).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 pb-20">
      {/* Back */}
      <Link
        href="/archive"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6 group transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
          <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Archive
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          {/* Brand badge */}
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3",
              brand.badgeBg,
              brand.badgeText
            )}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: brand.color }}
            />
            {brand.label}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">
            {gen.main_headline ?? gen.topic}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{gen.topic}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {gen.images.length > 1 && (
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v7M7 8L5 6M7 8L9 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Download All
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 text-sm text-red-500 border border-red-200 hover:border-red-400 hover:text-red-700 px-3 py-2 rounded-lg transition-all disabled:opacity-40"
          >
            {deleting ? (
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M5 3V2h3v1M3.5 3l.5 8h5l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            Delete
          </button>
        </div>
      </div>

      {/* Meta strip */}
      <div className="flex flex-wrap gap-2 mb-8 text-xs text-gray-500">
        <span className="bg-gray-100 px-2.5 py-1 rounded-full">{styleLabel}</span>
        <span className="bg-gray-100 px-2.5 py-1 rounded-full">{ratioLabel}</span>
        <span className="bg-gray-100 px-2.5 py-1 rounded-full">
          {isThreeSlide ? "3-Slide Story" : "Single Image"}
        </span>
        <span className="bg-gray-100 px-2.5 py-1 rounded-full">
          Brand: {gen.brand_target}
        </span>
        <span className="bg-gray-100 px-2.5 py-1 rounded-full">{date}</span>
      </div>

      {/* Images */}
      {gen.images.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Generated Images
          </h2>
          <div
            className={clsx(
              "grid gap-4",
              isThreeSlide ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 max-w-xl"
            )}
          >
            {gen.images.map((img) => (
              <ImageCard
                key={img.index}
                image={img}
                index={img.index}
                total={gen.images.length}
              />
            ))}
          </div>
        </section>
      )}

      {/* Story */}
      {gen.story_sections?.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Story Content
          </h2>
          <div className="space-y-8">
            {gen.story_sections.map((section, i) => (
              <div key={i} className="pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                {isThreeSlide && (
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                    Section {i + 1}
                  </p>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{section.headline}</h3>
                <p className="text-gray-500 italic text-sm mb-4">{section.subheadline}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
