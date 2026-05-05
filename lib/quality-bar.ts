/**
 * Quality bar: what "good" means for this product.
 *
 * This file is documentation and a prompt resource. Import QUALITY_BAR_PROMPT
 * to inject the quality standard into any generation step.
 */

// ─── The target ───────────────────────────────────────────────────────────────

export const TARGET_PUBLICATIONS = [
  "Bloomberg Businessweek (covers and data spreads)",
  "NYT Upshot (data journalism graphics)",
  "Monocle (magazine editorial design)",
  "Reuters Graphics (news data viz)",
  "Financial Times (data journalism)",
  "Pudding.cool (narrative data essays)",
  "Katadata.co.id (Indonesian data journalism — closest local reference)",
] as const;

// ─── Stock-template vs editorial-grade ────────────────────────────────────────

export const QUALITY_SPECTRUM = {
  stockTemplate: [
    "Generic 'DATA OVERVIEW' or 'KEY METRICS' title placeholder",
    "Clip-art icon grid with rounded blobs",
    "Same template structure for every topic — layout not driven by data",
    "Brand logo stamped bottom-right as footer",
    "Bar chart with default blue/green/orange palette",
    "No typographic hierarchy — all text same weight and size",
    "Numbers without context: '72%' with no label, no source, no narrative",
    "Zero Indonesian cultural specificity — could be from any country",
    "Three slides that look like copies of each other with different numbers",
  ],
  editorialGrade: [
    "The layout is chosen because of the data, not despite it — timeline for events, bubble chart for proportional comparison",
    "The headline contains a specific surprising data point, not a topic label",
    "At least one culturally specific Indonesian detail visible in every slide",
    "Brand appears as a data actor ('BCA processed X transactions') not a sponsor overlay",
    "Typography hierarchy: display headline > deck copy > data labels > caption > source — 5 distinct levels",
    "The three slides form a narrative arc — they answer a question across the deck",
    "The chart concept serves the story — not the default chart type for the layout",
    "Source attribution is specific: 'Source: BPS, Survei Sosial Ekonomi Nasional 2024'",
    "Visual cohesion: slides 1-3 share a recurring motif and color treatment that identifies them as a series",
  ],
} as const;

// ─── Indonesian cultural specificity checklist ────────────────────────────────

export const INDONESIAN_SPECIFICITY = {
  timestamps: ["WIB (UTC+7)", "WITA (UTC+8)", "WIT (UTC+9)", "specific hours: 06:15 WIB not '6am'"],
  jakartaLocations: [
    "Sudirman corridor", "Thamrin", "Kuningan", "Kebayoran Baru",
    "Tanah Abang", "Manggarai", "Blok M", "Kemang",
    "Grogol", "Cengkareng", "Bekasi", "Depok", "Tangerang",
  ],
  transport: ["KRL Commuter Line", "Transjakarta BRT", "MRT Jakarta", "Gojek", "Grab", "ojek online"],
  localApps: ["GoFood", "GrabFood", "Tokopedia", "Shopee", "BCA Mobile", "Livin by Mandiri", "Dana", "OVO", "LinkAja"],
  dataSources: ["BPS (Badan Pusat Statistik)", "OJK", "Bank Indonesia", "Kementerian Kominfo", "APJII", "Nielsen Indonesia", "Katadata", "INDEF"],
  consumerBehavior: ["Lebaran shopping spike", "gajian cycle (25th of month)", "sahur and buka puasa windows", "akhir tahun bonuses"],
} as const;

// ─── Brand integration patterns ───────────────────────────────────────────────

export const BRAND_INTEGRATION_PATTERNS = {
  dataActor: "Brand appears in a statistic: 'X processed Y transactions during this period'",
  contextProvider: "Brand data or research cited as the source of a key insight",
  behaviorWindow: "Brand's product is the lens through which the behavior is observed",
  infrastructureRole: "Brand is named as part of the ecosystem being described",
  comparativeAnchor: "Brand's metric used as benchmark to contextualize a trend",
  logoStamp: "FORBIDDEN — brand logo placed as a design element or footer sponsorship",
} as const;

// ─── Typography hierarchy spec ────────────────────────────────────────────────

export const TYPOGRAPHY_HIERARCHY = {
  display: "Slide headline. Largest type. 1-2 lines max. Contains a specific data point.",
  deck: "Subheadline / deck copy. Second scale. One-line tension or context.",
  dataLabel: "Numbers and category labels inside charts. Tabular figures. Multiple instances.",
  caption: "Section label, pull quote annotation. Small but readable. WIB timestamp lives here.",
  source: "Source attribution. Smallest type. 'Source: [Institution], [Year]' format.",
} as const;

// ─── Smell tests: questions to ask before calling output sell-ready ───────────

export const SMELL_TESTS = [
  "Could this infographic have been produced for any country? (If yes, add Indonesian specificity until no.)",
  "Does the headline contain a specific number? (If no, rewrite with a data point in the headline.)",
  "Can you name the data source from the infographic alone? (If no, add source attribution.)",
  "Does the brand feel earned in the data story, or pasted on top? (If pasted, reframe as data actor.)",
  "Do all slides in the series feel like they belong together? (If no, enforce recurring motif.)",
  "Would a data journalist at Katadata or CNN Indonesia be comfortable with this output? (The bar.)",
  "Is the layout driven by the shape of the data, or by the default template? (Layout should be data-driven.)",
] as const;

// ─── Prompt fragment for injection into Kimi ─────────────────────────────────

export const QUALITY_BAR_PROMPT = `QUALITY STANDARD:
This output will be sold as premium branded content to Indonesian brand partners at editorial rates. The benchmark is Bloomberg Businessweek data spreads and NYT Upshot graphics — not corporate presentation templates.

Failure modes to avoid:
- Generic "DATA OVERVIEW" titles with no specific data point
- Brand name placed as a footer sponsor — brand must be a data actor
- Zero Indonesian specificity — must name real locations, apps, institutions
- Three identical slide structures with different numbers — slides must have a narrative arc
- Clip-art icons or stock illustration style — visual direction must be photographically specific`;
