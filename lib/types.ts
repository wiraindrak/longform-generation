export type MediaBrand = "detikcom" | "cnn-indonesia" | "cnbc-indonesia";
export type OutputType = "single" | "three-slide";
export type ImageRatio = "1:1" | "4:5" | "9:16" | "16:9" | "3:4";
export type ImageStyle =
  | "realistic"
  | "typography"
  | "editorial"
  | "cinematic"
  | "illustrated"
  | "infographic"
  | "dark-dramatic"
  | "clean-minimal"
  | "vintage-press"
  | "vibrant-gradient";

export interface GenerationRequest {
  topic: string;
  mediaBrand: MediaBrand;
  brandTarget: string;
  ratio: ImageRatio;
  outputType: OutputType;
  style: ImageStyle;
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

export const STYLE_INFO: Record<
  ImageStyle,
  { label: string; description: string; keywords: string; gradient: string }
> = {
  realistic: {
    label: "Realistic",
    description:
      "Photojournalistic photography with natural lighting and authentic documentary feel.",
    keywords: "Photography · Documentary · Natural",
    gradient: "from-sky-900 via-blue-800 to-amber-800",
  },
  typography: {
    label: "Typography",
    description:
      "Bold oversized text as the hero visual element. Text IS the art.",
    keywords: "Bold Text · Contrast · Graphic",
    gradient: "from-zinc-900 via-zinc-800 to-zinc-950",
  },
  editorial: {
    label: "Editorial Magazine",
    description:
      "Glossy magazine-quality imagery with space for headlines and overlays.",
    keywords: "Magazine · Polished · Aspirational",
    gradient: "from-rose-900 via-pink-800 to-orange-800",
  },
  cinematic: {
    label: "Cinematic Drama",
    description:
      "Movie-poster composition with dramatic lighting and epic color grading.",
    keywords: "Film · Epic · High Contrast",
    gradient: "from-teal-950 via-slate-800 to-orange-900",
  },
  illustrated: {
    label: "Flat Illustration",
    description:
      "Modern flat vector illustration with clean shapes and contemporary colors.",
    keywords: "Vector · Flat · Geometric",
    gradient: "from-blue-900 via-violet-800 to-purple-900",
  },
  infographic: {
    label: "Data Infographic",
    description:
      "Charts, statistics, and icons as the primary visual elements. Data as art.",
    keywords: "Data · Charts · Icons",
    gradient: "from-cyan-900 via-blue-900 to-indigo-900",
  },
  "dark-dramatic": {
    label: "Dark Dramatic",
    description:
      "High-contrast dark background with neon or bold accent colors. Intense mood.",
    keywords: "Dark · Neon · Moody",
    gradient: "from-purple-950 via-violet-900 to-fuchsia-950",
  },
  "clean-minimal": {
    label: "Clean Minimal",
    description:
      "White-space dominant with precise geometry and Swiss design principles.",
    keywords: "White Space · Swiss · Elegant",
    gradient: "from-gray-800 via-slate-700 to-gray-900",
  },
  "vintage-press": {
    label: "Vintage Press",
    description:
      "Old newspaper and print media aesthetic with grain, sepia, and retro typography.",
    keywords: "Retro · Grain · Sepia",
    gradient: "from-yellow-900 via-amber-800 to-stone-900",
  },
  "vibrant-gradient": {
    label: "Vibrant Gradient",
    description:
      "Bold flowing color gradients with contemporary digital art energy.",
    keywords: "Gradient · Vivid · Dynamic",
    gradient: "from-pink-900 via-rose-800 to-orange-700",
  },
};

export const RATIO_INFO: Record<
  ImageRatio,
  { label: string; desc: string; w: number; h: number; apiSize: string }
> = {
  "1:1": {
    label: "1:1",
    desc: "Square",
    w: 1,
    h: 1,
    apiSize: "1024x1024",
  },
  "4:5": {
    label: "4:5",
    desc: "Portrait",
    w: 4,
    h: 5,
    apiSize: "1024x1024",
  },
  "9:16": {
    label: "9:16",
    desc: "Stories",
    w: 9,
    h: 16,
    apiSize: "1024x1792",
  },
  "16:9": {
    label: "16:9",
    desc: "Landscape",
    w: 16,
    h: 9,
    apiSize: "1792x1024",
  },
  "3:4": {
    label: "3:4",
    desc: "Standard",
    w: 3,
    h: 4,
    apiSize: "1024x1024",
  },
};
