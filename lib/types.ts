export type MediaBrand = "detikcom" | "cnn-indonesia" | "cnbc-indonesia";
export type ImageRatio = "1:1" | "4:5" | "9:16" | "16:9" | "3:4";
export type SlideCount = 1 | 3 | 5;

export type InfographicTheme =
  | "corporate"
  | "dark-neon"
  | "warm-bold"
  | "clean-white"
  | "vivid-pop"
  | "editorial"
  | "midnight"
  | "nature"
  | "bold-black"
  | "pastel"
  | "rose-coral"
  | "mono-grid";

export type InfographicLayout =
  | "data-chart"
  | "key-stats"
  | "timeline"
  | "comparison"
  | "step-process"
  | "fact-icons"
  | "ranked-list"
  | "magazine-cover"
  | "flowchart"
  | "bubble-chart"
  | "pull-quote"
  | "two-panel";

export interface GenerationRequest {
  topic: string;
  mediaBrand: MediaBrand;
  brandTarget: string;
  ratio: ImageRatio;
  slideCount: SlideCount;
  colorTheme: InfographicTheme;
  layout: InfographicLayout;
}

export interface StorySection {
  headline: string;
  subheadline: string;
  body: string;
  imagePrompt: string;
}

export interface GeneratedStory {
  mainHeadline: string;
  language: "id" | "en";
  sections: StorySection[];
}

export interface GeneratedImage {
  index: number;
  sectionHeadline: string;
  base64: string;
  filename: string;
}

export type ProgressEvent =
  | { type: "progress"; step: string; message: string; percent: number }
  | { type: "story_done"; story: GeneratedStory }
  | { type: "image_done"; image: GeneratedImage }
  | { type: "done" }
  | { type: "error"; message: string };

export const MEDIA_BRAND_LABELS: Record<MediaBrand, string> = {
  detikcom: "detikcom",
  "cnn-indonesia": "CNN Indonesia",
  "cnbc-indonesia": "CNBC Indonesia",
};

export const THEME_INFO: Record<
  InfographicTheme,
  { label: string; description: string; colors: string[] }
> = {
  corporate: {
    label: "Corporate Blue",
    description: "Professional navy & blue palette for business and institutional content.",
    colors: ["#1E3A5F", "#3B82F6", "#93C5FD", "#F8FAFC"],
  },
  "dark-neon": {
    label: "Dark Neon",
    description: "Dark background with vivid neon accents for high-impact data storytelling.",
    colors: ["#0F0F1A", "#06B6D4", "#A855F7", "#84CC16"],
  },
  "warm-bold": {
    label: "Warm Bold",
    description: "Energetic orange and red tones with bold editorial punch.",
    colors: ["#FFF7ED", "#F97316", "#EF4444", "#1C1917"],
  },
  "clean-white": {
    label: "Clean Minimal",
    description: "White-space dominant with Swiss grid precision and elegant restraint.",
    colors: ["#FFFFFF", "#F3F4F6", "#6B7280", "#111827"],
  },
  "vivid-pop": {
    label: "Vivid Pop",
    description: "Multi-color bright flat palette optimized for social media impact.",
    colors: ["#FF6B6B", "#FFD93D", "#4ECDC4", "#6C63FF"],
  },
  editorial: {
    label: "Editorial Muted",
    description: "Warm cream, ochre, and sage for a refined magazine editorial feel.",
    colors: ["#F5F0E8", "#D4A853", "#7D9B6A", "#2D1F0E"],
  },
  midnight: {
    label: "Midnight Premium",
    description: "Near-black with silver and gold accents for premium authoritative content.",
    colors: ["#0D1117", "#8B949E", "#FFD700", "#FFFFFF"],
  },
  nature: {
    label: "Nature Green",
    description: "Forest green and sage tones for sustainability and environment topics.",
    colors: ["#F0F7EE", "#2D6A4F", "#52B788", "#74C69D"],
  },
  "bold-black": {
    label: "Bold Black",
    description: "Pure black canvas with stark white text and a single vivid accent. Maximum contrast.",
    colors: ["#000000", "#FFFFFF", "#00E5FF", "#333333"],
  },
  pastel: {
    label: "Pastel Soft",
    description: "Gentle blues and lavender for approachable lifestyle and consumer content.",
    colors: ["#FAFAFE", "#93C5FD", "#C4B5FD", "#6EE7B7"],
  },
  "rose-coral": {
    label: "Rose Coral",
    description: "Pink and coral tones for lifestyle, fashion, beauty, and food content.",
    colors: ["#FFF5F7", "#F9A8D4", "#FF6B6B", "#E11D48"],
  },
  "mono-grid": {
    label: "Mono Grid",
    description: "Strict monochrome with grid structure and a single red accent. Technical precision.",
    colors: ["#FFFFFF", "#111827", "#6B7280", "#EF4444"],
  },
};

export const LAYOUT_INFO: Record<
  InfographicLayout,
  { label: string; description: string }
> = {
  "data-chart": {
    label: "Data Charts",
    description: "Bar graphs, line charts, and pie charts as primary visual elements.",
  },
  "key-stats": {
    label: "Key Statistics",
    description: "Large hero numbers and percentages dominate the composition.",
  },
  timeline: {
    label: "Timeline",
    description: "Chronological events or milestones with clear sequential flow.",
  },
  comparison: {
    label: "Comparison",
    description: "Side-by-side visual comparison of two or more items.",
  },
  "step-process": {
    label: "Step Process",
    description: "Numbered sequential steps guiding through a process or journey.",
  },
  "fact-icons": {
    label: "Fact + Icons",
    description: "Icon-driven fact list with short descriptive text per point.",
  },
  "ranked-list": {
    label: "Ranked List",
    description: "Top N ranking with position numbers and proportional horizontal bars.",
  },
  "magazine-cover": {
    label: "Magazine Cover",
    description: "Hero visual zone with branded header strip and bold headline overlay.",
  },
  flowchart: {
    label: "Flowchart",
    description: "Decision flow with connected boxes, diamond choices, and directional arrows.",
  },
  "bubble-chart": {
    label: "Bubble Chart",
    description: "Proportional circles where size represents data quantity at a glance.",
  },
  "pull-quote": {
    label: "Pull Quote",
    description: "Oversized hero statistic or statement with 2–3 supporting data cards.",
  },
  "two-panel": {
    label: "Two Panel",
    description: "Split layout: bold visual or chart on the left, data breakdown on the right.",
  },
};

export const RATIO_INFO: Record<
  ImageRatio,
  { label: string; desc: string; w: number; h: number; apiSize: string }
> = {
  "1:1": { label: "1:1", desc: "Square", w: 1, h: 1, apiSize: "1024x1024" },
  "4:5": { label: "4:5", desc: "Portrait", w: 4, h: 5, apiSize: "1024x1024" },
  "9:16": { label: "9:16", desc: "Stories", w: 9, h: 16, apiSize: "1024x1792" },
  "16:9": { label: "16:9", desc: "Landscape", w: 16, h: 9, apiSize: "1792x1024" },
  "3:4": { label: "3:4", desc: "Standard", w: 3, h: 4, apiSize: "1024x1024" },
};
