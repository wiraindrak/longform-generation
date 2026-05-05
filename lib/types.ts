export type MediaBrand = "detikcom" | "cnn-indonesia" | "cnbc-indonesia";
export type ImageRatio = "1:1" | "4:5" | "9:16" | "16:9" | "3:4";
export type SlideCount = 1 | 3 | 5;

export type InfographicTheme =
  | "broadsheet"
  | "neo-tokyo"
  | "jakarta-heat"
  | "white-cube"
  | "pop-idol"
  | "monocle-editorial"
  | "the-vault"
  | "forest-sky"
  | "high-contrast"
  | "sunday-brunch"
  | "the-heartthrob"
  | "the-dossier";

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

// ─── Editorial content model ──────────────────────────────────────────────────

export interface VisualDirection {
  heroImage: string;
  chartConcept: string;
  recurringMotif: string;
  moodTone: string;
  culturalDetails: string[];
  brandIntegration: string;
}

export interface EditorialMeta {
  pullQuote: string;
  sourceAttribution: string;
  sectionLabel: string;
}

export interface SeriesVisualDNA {
  paletteNotes: string;
  typographyPairing: string;
  illustrationStyle: string;
  recurringMotif: string;
  narrativeArc: string;
}

// ─── Request / Response ───────────────────────────────────────────────────────

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
  visualDirection?: VisualDirection;
  editorialMeta?: EditorialMeta;
}

export interface GeneratedStory {
  mainHeadline: string;
  language: "id" | "en";
  visualDNA?: SeriesVisualDNA;
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
  | { type: "slide_error"; index: number; message: string }
  | { type: "done" }
  | { type: "error"; message: string };

// ─── Labels ───────────────────────────────────────────────────────────────────

export const MEDIA_BRAND_LABELS: Record<MediaBrand, string> = {
  detikcom: "detikcom",
  "cnn-indonesia": "CNN Indonesia",
  "cnbc-indonesia": "CNBC Indonesia",
};

// Maps old DB theme IDs → new IDs (archive backward compat)
export const THEME_MIGRATION: Partial<Record<string, InfographicTheme>> = {
  corporate: "broadsheet",
  "dark-neon": "neo-tokyo",
  "warm-bold": "jakarta-heat",
  "clean-white": "white-cube",
  "vivid-pop": "pop-idol",
  editorial: "monocle-editorial",
  midnight: "the-vault",
  nature: "forest-sky",
  "bold-black": "high-contrast",
  pastel: "sunday-brunch",
  "rose-coral": "the-heartthrob",
  "mono-grid": "the-dossier",
};

// ─── Theme design system ──────────────────────────────────────────────────────

export interface ThemeDesignSystem {
  displayName: string;
  positioning: string;
  brandFitExamples: string[];
  paletteHex: string[];
  typographyPairing: string;
  chartPersonality: string;
  photographyMood: string;
  illustrationStyle: string;
  layoutDNA: string;
  doNot: string[];
  // Legacy compat for UI (.label, .description, .colors still used in some places)
  label: string;
  description: string;
  colors: string[];
}

export const THEME_INFO: Record<InfographicTheme, ThemeDesignSystem> = {
  broadsheet: {
    displayName: "Broadsheet",
    positioning: "National newspaper meets Bloomberg Terminal. Institutional gravitas.",
    brandFitExamples: ["BCA", "Bank Mandiri", "Pertamina", "Bank Indonesia"],
    paletteHex: ["#1E3A5F", "#3B82F6", "#93C5FD", "#F8FAFC"],
    typographyPairing: "Serif display (Playfair/Lora) + condensed sans body. Nikkei / FT production feel.",
    chartPersonality: "Precise annotated line graphs and understated bar charts. FT horizontal-rule style. Data label annotations in gray.",
    photographyMood: "Documentary gravitas. Boardrooms, trading floors, aerial Jakarta at dusk.",
    illustrationStyle: "Architectural data illustration. Muted navy spectrum. Grid-registered precision. Nothing playful.",
    layoutDNA: "Column-grid system. Generous whitespace. Dateline convention top-left. Source attribution in caption style.",
    doNot: ["Bright gradient fills", "Rounded icon blobs", "Playful illustration", "All-caps display headings"],
    label: "Broadsheet",
    description: "Institutional gravitas for financial and government brand partners.",
    colors: ["#1E3A5F", "#3B82F6", "#93C5FD", "#F8FAFC"],
  },
  "neo-tokyo": {
    displayName: "Neo-Tokyo",
    positioning: "High-tech Jakarta-meets-Shinjuku. For digital-native and fintech brands.",
    brandFitExamples: ["Gojek", "Tokopedia", "Telkomsel", "Grab"],
    paletteHex: ["#0F0F1A", "#06B6D4", "#A855F7", "#84CC16"],
    typographyPairing: "Extra-condensed bold sans for headlines. Monospace for timestamps and numeric data.",
    chartPersonality: "Neon luminous data bars. Digital dashboard aesthetic. Each data category its own neon. Dark surfaces lit from within.",
    photographyMood: "Neon rain reflections on Jakarta asphalt. Phone screens in darkness. Server corridor lighting.",
    illustrationStyle: "Vector cyberpunk. Hard edges, neon outlines, deep black fill. No gradients on data elements.",
    layoutDNA: "Dark canvas. Data zones that appear to glow. Asymmetric composition. Motion implied.",
    doNot: ["White or light backgrounds", "Warm colors", "Serif type", "Soft illustration", "Gradient-filled bars"],
    label: "Neo-Tokyo",
    description: "Digital-native energy for tech, fintech, and platform brands.",
    colors: ["#0F0F1A", "#06B6D4", "#A855F7", "#84CC16"],
  },
  "jakarta-heat": {
    displayName: "Jakarta Heat",
    positioning: "Urban tabloid pulse. Mass-market Indonesian urgency. Made for volume reach.",
    brandFitExamples: ["Indomie", "Indofood", "Mayora", "Alfamart"],
    paletteHex: ["#1C1917", "#F97316", "#F59E0B", "#FFFFFF"],
    typographyPairing: "Heavy condensed bold display at shouting scale. White text only on dark background.",
    chartPersonality: "Bold filled bars at aggressive height. Every stat at maximum visual weight. Urgency over elegance.",
    photographyMood: "Crowded Tanah Abang at noon. Motorbikes weaving Sudirman. Street food under harsh fluorescent light.",
    illustrationStyle: "Flat bold vector. High contrast. Tabloid urgency — breaking-news visual energy.",
    layoutDNA: "Dark canvas with dominant orange. Wide header strip 18-20%. Thick callout boxes. Maximum density.",
    doNot: ["Whitespace-dominant layouts", "Light type weights", "Pastel or muted colors", "Serif type"],
    label: "Jakarta Heat",
    description: "High-impact tabloid energy for mass-market consumer brands.",
    colors: ["#1C1917", "#F97316", "#F59E0B", "#FFFFFF"],
  },
  "white-cube": {
    displayName: "White Cube",
    positioning: "Gallery-grade minimalism. For premium brands that speak through restraint.",
    brandFitExamples: ["Apple Indonesia", "Astra Land", "OCBC NISP", "premium positioning"],
    paletteHex: ["#FFFFFF", "#F3F4F6", "#6B7280", "#111827"],
    typographyPairing: "Light serif display + hairline sans body. Wallpaper* / Kinfolk production feel.",
    chartPersonality: "Outlined rectangles only — no solid fills. Charts float in whitespace. Minimum 40% canvas empty.",
    photographyMood: "Architectural shadow on white wall. Single product in empty studio. Material close-up.",
    illustrationStyle: "Line-only. Hairline weight. No fills. Objects breathe. Less is everything.",
    layoutDNA: "Swiss International Style. Minimum 40% empty canvas. No background panels. No grid lines.",
    doNot: ["Solid filled bars", "Bright accent colors", "Rounded corners", "Gradients", "Any decorative elements"],
    label: "White Cube",
    description: "Gallery minimalism for luxury and premium positioning.",
    colors: ["#FFFFFF", "#F3F4F6", "#6B7280", "#111827"],
  },
  "pop-idol": {
    displayName: "Pop Idol",
    positioning: "Indonesian Gen Z social-first. Optimized for saves and shares.",
    brandFitExamples: ["Shopee", "TikTok Shop", "Wardah", "JCO Donuts"],
    paletteHex: ["#FF6B6B", "#FFD93D", "#4ECDC4", "#6C63FF"],
    typographyPairing: "Rounded bold display + rounded medium body. Fun, approachable, never corporate.",
    chartPersonality: "Flat bright solid blocks — each category its own saturated color. Maximum visual energy.",
    photographyMood: "Flat lay on bright pastel surface. Daylight product photography. Instagram-optimized.",
    illustrationStyle: "Bold flat vector with thick outlines. Color blocking. No shadows. Maximum saturation.",
    layoutDNA: "Social card format. Bold dark section dividers. High saturation throughout. Designed for repost.",
    doNot: ["Dark backgrounds", "Serif type", "Muted or desaturated colors", "Dense data annotation"],
    label: "Pop Idol",
    description: "Gen Z social energy for entertainment, youth, and consumer brands.",
    colors: ["#FF6B6B", "#FFD93D", "#4ECDC4", "#6C63FF"],
  },
  "monocle-editorial": {
    displayName: "Monocle Editorial",
    positioning: "Considered magazine craft. For B2B brands and premium lifestyle.",
    brandFitExamples: ["Astra", "luxury hotel brands", "premium F&B", "financial services"],
    paletteHex: ["#F5F0E8", "#D4A853", "#7D9B6A", "#2D1F0E"],
    typographyPairing: "Editorial serif display (Cormorant feel) + humanist sans body. Monocle / Kinfolk quality.",
    chartPersonality: "Warm-toned annotation over understated charts. Data feels found, not designed.",
    photographyMood: "Golden hour through plantation shutters. Artisan hands on natural material. Indonesian textile texture.",
    illustrationStyle: "Hand-crafted feel. Warm ink-wash illustration. Grain and texture. Analog warmth.",
    layoutDNA: "Editorial grid. Text-image integration. Print publication DNA. Unhurried pacing. Warm grain.",
    doNot: ["Cold digital aesthetics", "Synthetic neon", "Dense data grids", "Flat vector illustration", "Hard clean edges"],
    label: "Monocle Editorial",
    description: "Considered magazine craft for premium B2B and lifestyle brands.",
    colors: ["#F5F0E8", "#D4A853", "#7D9B6A", "#2D1F0E"],
  },
  "the-vault": {
    displayName: "The Vault",
    positioning: "Prestige dark. For wealth management, luxury, and exclusivity positioning.",
    brandFitExamples: ["BCA Prioritas", "Mercedes Indonesia", "Citibank Ultima", "premium spirits"],
    paletteHex: ["#0D1117", "#8B949E", "#FFD700", "#FFFFFF"],
    typographyPairing: "Elegant geometric serif display + clean sans body. Bloomberg / private banking aesthetic.",
    chartPersonality: "Silver-toned precision. One gold accent on the hero data point only. Everything else recedes.",
    photographyMood: "Black marble desk with single gold object. Boardroom after dark. Watch crown macro.",
    illustrationStyle: "Architectural black, silver line-work. One moment of gold. Studio perfection.",
    layoutDNA: "Near-black canvas. Silver throughout. One gold datum. Deliberate emptiness. Prestige requires space.",
    doNot: ["Multiple bright colors", "Playful illustration", "Warm tones", "Crowded layouts", "More than one gold element"],
    label: "The Vault",
    description: "Prestige dark aesthetic for wealth, luxury, and exclusivity.",
    colors: ["#0D1117", "#8B949E", "#FFD700", "#FFFFFF"],
  },
  "forest-sky": {
    displayName: "Forest & Sky",
    positioning: "Sustainability credibility. For ESG, green energy, and nature brands.",
    brandFitExamples: ["PLN EBT", "Pertamina NRE", "Danone Aqua", "agricultural brands"],
    paletteHex: ["#F0F7EE", "#2D6A4F", "#52B788", "#74C69D"],
    typographyPairing: "Rounded humanist sans — natural, organic, not corporate. Generous line-height.",
    chartPersonality: "Organic green progression from deep forest to light sage. Charts feel grown, not built.",
    photographyMood: "Indonesian rice terraces at sunrise. Mangrove aerial. Clean river over volcanic rock.",
    illustrationStyle: "Botanical illustration meets data. Organic forms. Leaf and growth motifs woven into charts.",
    layoutDNA: "Organic asymmetry. Green gradient canvas. Growth metaphors in data. Breathing room.",
    doNot: ["Industrial color", "Hard edges", "Dense data grids", "Synthetic palette", "Orange or red anywhere"],
    label: "Forest & Sky",
    description: "Sustainability credibility for ESG, green energy, and nature brands.",
    colors: ["#F0F7EE", "#2D6A4F", "#52B788", "#74C69D"],
  },
  "high-contrast": {
    displayName: "High Contrast",
    positioning: "Maximum editorial impact. For bold launches and sports activations.",
    brandFitExamples: ["Nike Indonesia", "Toyota GR", "Red Bull", "product launches"],
    paletteHex: ["#000000", "#FFFFFF", "#00E5FF", "#333333"],
    typographyPairing: "Extra-condensed display at brutal scale (Bebas Neue aesthetic) + mono for data.",
    chartPersonality: "Black and white stark contrast. One cyan punctuation mark. Data at gallery scale.",
    photographyMood: "Black studio. Single product under dramatic directional light. No background noise.",
    illustrationStyle: "Brutalist. Black dominant. White as counter-form. Cyan as single punctuation mark.",
    layoutDNA: "Oversized type as visual element. Black-white-black rhythm. One cyan moment. Gallery energy.",
    doNot: ["Multiple accent colors", "Warm tones", "Gradients", "Soft illustration", "More than one accent"],
    label: "High Contrast",
    description: "Brutalist impact for bold product launches and sports brands.",
    colors: ["#000000", "#FFFFFF", "#00E5FF", "#333333"],
  },
  "sunday-brunch": {
    displayName: "Sunday Brunch",
    positioning: "Approachable lifestyle warmth. For F&B, wellness, and everyday consumer brands.",
    brandFitExamples: ["Kopi Kenangan", "Fore Coffee", "Alodokter", "FMCG wellness"],
    paletteHex: ["#FAFAFE", "#93C5FD", "#C4B5FD", "#6EE7B7"],
    typographyPairing: "Rounded geometric sans — warm, medium weight. Feels hand-selected, not AI-generated.",
    chartPersonality: "Soft pastel blocks with 12px rounded corners. Charts feel casual and inviting.",
    photographyMood: "Natural window light on linen. Coffee cup and journal. Sunday morning stillness.",
    illustrationStyle: "Soft watercolor-meets-vector. Gentle shapes, no hard edges. Lifestyle warmth.",
    layoutDNA: "Light and airy. 12px radius everywhere. Generous spacing. Designed for Instagram saves.",
    doNot: ["Dark or intense backgrounds", "Harsh contrast", "Dense data annotation", "Industrial or corporate feel"],
    label: "Sunday Brunch",
    description: "Warm lifestyle energy for F&B, wellness, and everyday consumer brands.",
    colors: ["#FAFAFE", "#93C5FD", "#C4B5FD", "#6EE7B7"],
  },
  "the-heartthrob": {
    displayName: "The Heartthrob",
    positioning: "Premium feminine lifestyle. For beauty, fashion, and women's health brands.",
    brandFitExamples: ["Wardah", "Sociolla", "HijaUp", "Halodoc women's"],
    paletteHex: ["#FFF5F7", "#F9A8D4", "#FF6B6B", "#E11D48"],
    typographyPairing: "Stylized serif display (Playfair feel) + light rounded sans. Vogue Indonesia editorial quality.",
    chartPersonality: "Rose-to-coral gradient bars with 8px radius. Data feels curated. Elegant editorial numbers.",
    photographyMood: "Warm studio with soft rose diffusion. Beauty product on marble. Hands cradling botanicals.",
    illustrationStyle: "Fashion editorial vector. Elegant line work. Rose and coral only — no warm orange or red.",
    layoutDNA: "Light rose canvas. Deep rose headers. Feminine editorial grid. 8-12px radius on all elements.",
    doNot: ["Orange tones", "Blue or cold colors", "Industrial layouts", "Dark backgrounds", "Heavy condensed display"],
    label: "The Heartthrob",
    description: "Premium feminine editorial for beauty, fashion, and women's health.",
    colors: ["#FFF5F7", "#F9A8D4", "#FF6B6B", "#E11D48"],
  },
  "the-dossier": {
    displayName: "The Dossier",
    positioning: "Technical precision. For consultancies, data products, and engineering brands.",
    brandFitExamples: ["Accenture Indonesia", "McKinsey Jakarta", "Tokio Marine", "data analytics brands"],
    paletteHex: ["#FFFFFF", "#111827", "#6B7280", "#EF4444"],
    typographyPairing: "Monospace + condensed bold sans. Engineering report precision, not design award winner.",
    chartPersonality: "Dense visible grid lines. Alternating solid/outlined bars. Blueprint density. Every pixel has data.",
    photographyMood: "Overhead blueprint on white desk. Server rack close-up. Process diagram on whiteboard.",
    illustrationStyle: "Technical diagram meets infographic. Grid-first. No organic curves. Sharp rectangles.",
    layoutDNA: "0px corner radius. Visible 1px grid lines at regular intervals. Dense. One red accent on critical insight.",
    doNot: ["Rounded corners", "Gradients", "Warm colors", "Organic shapes", "Decorative illustration"],
    label: "The Dossier",
    description: "Blueprint precision for consultancies, data products, and engineering brands.",
    colors: ["#FFFFFF", "#111827", "#6B7280", "#EF4444"],
  },
};

// ─── Layout info ──────────────────────────────────────────────────────────────

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
