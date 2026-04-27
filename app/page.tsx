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
  | {
      phase: "done";
      story: GeneratedStory;
      images: GeneratedImage[];
    }
  | { phase: "error"; message: string };

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-3">
      {children}
    </p>
  );
}

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#101010] border border-[#222] rounded-xl p-5">
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
  const config: Record<
    MediaBrand,
    { bg: string; accent: string; tagline: string }
  > = {
    detikcom: {
      bg: "from-red-950/60 to-[#101010]",
      accent: "#E00000",
      tagline: "Indonesia's #1 News",
    },
    "cnn-indonesia": {
      bg: "from-red-900/40 to-[#101010]",
      accent: "#CC0000",
      tagline: "International Perspective",
    },
    "cnbc-indonesia": {
      bg: "from-blue-950/60 to-[#101010]",
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
          ? "border-white/30 ring-1 ring-white/20"
          : "border-[#222] hover:border-[#404040]"
      )}
    >
      <div
        className="w-2 h-2 rounded-full mb-3"
        style={{ backgroundColor: c.accent }}
      />
      <p className="font-semibold text-sm text-white">
        {MEDIA_BRAND_LABELS[brand]}
      </p>
      <p className="text-xs text-zinc-500 mt-0.5">{c.tagline}</p>
      {selected && (
        <div className="absolute top-2 right-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="7" cy="7" r="7" fill="white" fillOpacity="0.15" />
            <path
              d="M4 7L6 9L10 5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

// Ratio card with visual aspect ratio indicator
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
  const scale = 32;
  const w = Math.min(info.w * scale, 48);
  const h = Math.min(info.h * scale, 48);

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center gap-2.5 p-3 rounded-lg border transition-all duration-200",
        selected
          ? "border-white/30 bg-white/5 ring-1 ring-white/10"
          : "border-[#222] hover:border-[#404040] bg-[#0c0c0c]"
      )}
    >
      <div
        className={clsx(
          "rounded border-2 transition-colors",
          selected ? "border-white/60 bg-white/10" : "border-zinc-600"
        )}
        style={{ width: w, height: h, minWidth: 16, minHeight: 16 }}
      />
      <div className="text-center">
        <p className="text-xs font-semibold text-white">{info.label}</p>
        <p className="text-[10px] text-zinc-500 whitespace-nowrap">{info.desc}</p>
      </div>
    </button>
  );
}

// Style card with gradient representation
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
          ? "border-white/30 ring-1 ring-white/15"
          : "border-[#222] hover:border-[#404040]"
      )}
    >
      {/* Gradient preview */}
      <div
        className={clsx(
          "h-20 bg-gradient-to-br",
          info.gradient,
          "transition-opacity duration-200",
          selected ? "opacity-100" : "opacity-70 group-hover:opacity-85"
        )}
      />
      {/* Style info */}
      <div className="p-3 bg-[#0d0d0d]">
        <p className="text-xs font-semibold text-white">{info.label}</p>
        <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">
          {info.description}
        </p>
        <p className="text-[10px] text-zinc-600 mt-1.5">{info.keywords}</p>
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5L4 7L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

// Progress bar component
function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
      <div
        className="h-full bg-white rounded-full transition-all duration-500 ease-out"
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
    <div className="group rounded-xl overflow-hidden border border-[#222] bg-[#101010]">
      <div className="relative image-wrapper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${image.base64}`}
          alt={image.sectionHeadline}
          className="w-full h-auto block"
        />
        <div className="image-hover-overlay absolute inset-0 bg-black/50 flex items-center justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2V10M8 10L5 7M8 10L11 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 13H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Download PNG
          </button>
        </div>
      </div>
      <div className="p-4 border-t border-[#1a1a1a]">
        <p className="text-xs text-zinc-500 mb-1">
          Slide {image.index + 1} · {image.filename}
        </p>
        <p className="text-sm font-medium text-white leading-snug">
          {image.sectionHeadline}
        </p>
        <button
          onClick={handleDownload}
          className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-medium text-zinc-400 border border-[#2a2a2a] rounded-lg py-2.5 hover:border-[#404040] hover:text-white transition-all"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 1.5V8.5M6.5 8.5L4 6M6.5 8.5L9 6"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.5 11H11.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Download PNG
        </button>
      </div>
    </div>
  );
}

// Skeleton placeholder for loading image
function ImageSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-[#222] bg-[#101010]">
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
  const isReady =
    topic.trim().length > 5 &&
    brandTarget.trim().length > 1 &&
    !isGenerating;

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

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

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

          if (event.type === "done") {
            if (currentStory) {
              setStatus({
                phase: "done",
                story: currentStory,
                images: currentImages,
              });
            }
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

  const handleReset = () => {
    setStatus({ phase: "idle" });
  };

  const pendingImageSlots =
    status.phase === "generating"
      ? Math.max(
          0,
          (outputType === "three-slide" ? 3 : 1) - status.images.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1" width="5" height="5" fill="black" />
              <rect x="8" y="1" width="5" height="5" fill="black" />
              <rect x="1" y="8" width="5" height="5" fill="black" />
              <rect x="8" y="8" width="5" height="5" fill="black" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold tracking-[0.1em] text-white">
              LONGFORM
            </p>
            <p className="text-[10px] text-zinc-600 tracking-wider">
              AI CONTENT GENERATOR
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-zinc-500">Powered by Kimi K2.5 + GPT Image</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 pb-20">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Long-Form Visual Content
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            From topic to publication-ready images — crafted for Indonesian
            media brands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* ── Form ──────────────────────────────────────────────────────── */}
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
                className="w-full bg-transparent text-white text-sm placeholder:text-zinc-600 resize-none outline-none leading-relaxed"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-zinc-600">
                  In English or Bahasa Indonesia
                </p>
                <p
                  className={clsx(
                    "text-[10px]",
                    topic.length > 300 ? "text-amber-500" : "text-zinc-600"
                  )}
                >
                  {topic.length} chars
                </p>
              </div>
            </FieldCard>

            {/* Media Brand */}
            <FieldCard>
              <SectionLabel>02 — Media Brand</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                {(["detikcom", "cnn-indonesia", "cnbc-indonesia"] as MediaBrand[]).map(
                  (b) => (
                    <BrandCard
                      key={b}
                      brand={b}
                      selected={mediaBrand === b}
                      onClick={() => !isGenerating && setMediaBrand(b)}
                    />
                  )
                )}
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
                className="w-full bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none"
              />
              <p className="text-[10px] text-zinc-600 mt-2">
                The brand to align the story with and place naturally in the
                visuals
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
          <div className="space-y-4 lg:sticky lg:top-6">
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
                      ? "border-white/30 bg-white/5 ring-1 ring-white/10"
                      : "border-[#222] hover:border-[#404040]"
                  )}
                >
                  <div className="w-8 h-8 mb-2 bg-[#1a1a1a] rounded flex items-center justify-center border border-[#2a2a2a]">
                    <div className="w-4 h-4 bg-white/20 rounded-sm" />
                  </div>
                  <p className="text-xs font-semibold text-white">
                    Single Image
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    1 hero visual
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => !isGenerating && setOutputType("three-slide")}
                  className={clsx(
                    "p-3 rounded-lg border text-left transition-all",
                    outputType === "three-slide"
                      ? "border-white/30 bg-white/5 ring-1 ring-white/10"
                      : "border-[#222] hover:border-[#404040]"
                  )}
                >
                  <div className="w-auto h-8 mb-2 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-full bg-[#1a1a1a] rounded border border-[#2a2a2a] flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white/20 rounded-sm" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-white">
                    3-Slide Story
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    3 sequential images
                  </p>
                </button>
              </div>
            </FieldCard>

            {/* Summary card */}
            <div className="bg-[#0c0c0c] border border-[#1e1e1e] rounded-xl p-4 text-xs text-zinc-500 space-y-1.5">
              <div className="flex justify-between">
                <span>Story model</span>
                <span className="text-zinc-300">Kimi K2.5</span>
              </div>
              <div className="flex justify-between">
                <span>Image model</span>
                <span className="text-zinc-300">GPT 5.4 Image</span>
              </div>
              <div className="flex justify-between">
                <span>Images</span>
                <span className="text-zinc-300">
                  {outputType === "single" ? "1" : "3"} × {ratio}{" "}
                  {RATIO_INFO[ratio].apiSize}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Est. time</span>
                <span className="text-zinc-300">
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
                  ? "bg-[#1a1a1a] text-zinc-500 cursor-not-allowed glow-active"
                  : isReady
                  ? "bg-white text-black hover:bg-zinc-100 active:scale-[0.98]"
                  : "bg-[#141414] text-zinc-600 cursor-not-allowed border border-[#222]"
              )}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating…
                </span>
              ) : (
                "Generate Content"
              )}
            </button>

            {!isReady && !isGenerating && (
              <p className="text-center text-[10px] text-zinc-600">
                {!topic.trim()
                  ? "Enter a topic to get started"
                  : !brandTarget.trim()
                  ? "Enter a brand partner name"
                  : "Fill in all fields"}
              </p>
            )}
          </div>
        </div>

        {/* ── Progress & Results ────────────────────────────────────────────── */}
        {(status.phase === "generating" ||
          status.phase === "done" ||
          status.phase === "error") && (
          <div className="mt-10">
            <div className="border-t border-[#1a1a1a] pt-10">
              {/* Progress bar */}
              {status.phase === "generating" && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-zinc-400">{status.message}</p>
                    <p className="text-sm font-mono text-zinc-500">
                      {status.percent}%
                    </p>
                  </div>
                  <ProgressBar percent={status.percent} />
                </div>
              )}

              {/* Error state */}
              {status.phase === "error" && (
                <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6 mb-8">
                  <p className="text-red-400 font-semibold mb-1">
                    Generation Failed
                  </p>
                  <p className="text-red-400/70 text-sm">{status.message}</p>
                  <button
                    onClick={handleReset}
                    className="mt-4 text-sm text-red-400 hover:text-red-300 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Story details (shown once story is ready) */}
              {(status.phase === "done" ||
                (status.phase === "generating" && status.story)) && (
                <div className="mb-10">
                  {status.phase === "done" && (
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-[10px] text-zinc-600 tracking-widest uppercase mb-1">
                          Generated Story
                        </p>
                        <h2 className="text-2xl font-bold text-white">
                          {status.story.mainHeadline}
                        </h2>
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-xs text-zinc-500 hover:text-white border border-[#2a2a2a] hover:border-[#404040] px-4 py-2 rounded-lg transition-all"
                      >
                        Start Over
                      </button>
                    </div>
                  )}
                  {status.phase === "generating" && status.story && (
                    <div className="mb-6">
                      <p className="text-[10px] text-zinc-600 tracking-widest uppercase mb-1">
                        Story Crafted
                      </p>
                      <h2 className="text-2xl font-bold text-white">
                        {status.story.mainHeadline}
                      </h2>
                    </div>
                  )}

                  {/* Section bodies */}
                  {(status.phase === "done"
                    ? status.story
                    : (status as Extract<GenerationStatus, { phase: "generating" }>).story
                  )?.sections.map((section, i) => (
                    <div
                      key={i}
                      className="mb-6 pb-6 border-b border-[#1a1a1a] last:border-0 last:pb-0"
                    >
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">
                        {outputType === "three-slide"
                          ? `Section ${i + 1}`
                          : "Story"}
                      </p>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {section.headline}
                      </h3>
                      <p className="text-zinc-400 text-sm italic mb-3">
                        {section.subheadline}
                      </p>
                      <p className="text-zinc-500 text-sm leading-relaxed">
                        {section.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Images grid */}
              {(status.phase === "generating" || status.phase === "done") && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] text-zinc-600 tracking-widest uppercase">
                      {status.phase === "done" ? "Generated Images" : "Generating Images"}
                    </p>
                    {status.phase === "done" && (
                      <p className="text-xs text-zinc-500">
                        {status.images.length}{" "}
                        {status.images.length === 1 ? "image" : "images"} ready
                      </p>
                    )}
                  </div>
                  <div
                    className={clsx(
                      "grid gap-4",
                      outputType === "three-slide"
                        ? "grid-cols-1 md:grid-cols-3"
                        : "grid-cols-1 max-w-xl"
                    )}
                  >
                    {/* Completed images */}
                    {(status.phase === "done"
                      ? status.images
                      : (status as Extract<GenerationStatus, { phase: "generating" }>).images
                    ).map((img) => (
                      <ImageCard key={img.index} image={img} />
                    ))}
                    {/* Loading skeletons */}
                    {Array.from({ length: pendingImageSlots }).map((_, i) => (
                      <ImageSkeleton key={`skeleton-${i}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1a1a1a] py-6 px-6 text-center">
        <p className="text-xs text-zinc-700">
          LONGFORM · Powered by{" "}
          <span className="text-zinc-500">Moonshot Kimi K2.5</span> &amp;{" "}
          <span className="text-zinc-500">OpenAI GPT Image</span> via OpenRouter
        </p>
      </footer>
    </div>
  );
}
