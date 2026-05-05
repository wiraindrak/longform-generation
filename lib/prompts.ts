import type {
  GenerationRequest,
  InfographicTheme,
  InfographicLayout,
  MediaBrand,
  StorySection,
  SeriesVisualDNA,
} from "./types";

// ─── Theme visual guide (image prompt fragments) ──────────────────────────────

const THEME_VISUAL_GUIDE: Record<InfographicTheme, string> = {
  broadsheet: `DESIGN SYSTEM — BROADSHEET:
Palette: Navy #1E3A5F (authority headers, primary bars), Sky blue #3B82F6 (data elements, callouts), Light blue #93C5FD (secondary data), Pure white #FFFFFF (canvas), Pale gray #F8FAFC (surface areas), Grid line #E2E8F0.
Typography: Serif display for headline zone — Nikkei / Financial Times production quality. Condensed sans for data body. Numbers in tabular figures, never decorative.
Chart personality: Precise annotated line graphs and understated bar charts. Horizontal rule dividers in FT-style. Data label annotations placed inline in medium gray. No decorative fills or gradients.
Illustration direction: Architectural editorial precision. Muted navy spectrum. Grid-registered composition. Nothing playful, nothing rounded.
Layout DNA: Column-grid system with generous breathing room. Dateline convention top-left. Source attribution in small caption style at bottom-right.
DO NOT: Bright gradient fills, rounded icon shapes, playful illustration, all-caps display headings, warm tones.`,

  "neo-tokyo": `DESIGN SYSTEM — NEO-TOKYO:
Palette: Near-black #0F0F1A (full-bleed canvas), Cyan #06B6D4 (primary data), Purple #A855F7 (secondary), Lime #84CC16 (tertiary), White #FFFFFF (type only), Navy divider #1a1a2e.
Typography: Extra-condensed bold sans for headlines — aggressive scale. Monospace for timestamps, percentages, and numeric labels. Numbers in neon color with subtle outer glow.
Chart personality: Neon luminous flat-fill data bars — each category its own neon color. Digital dashboard aesthetic, like a live analytics screen. Bars never use gradients — solid neon on black.
Illustration direction: Neon rain reflections on Jakarta asphalt, phone screens glowing in dark rooms, server corridor side-lighting. No daylight. No organic forms.
Layout DNA: Deep black canvas. Data zones appear to emit light. Asymmetric composition. Motion implied through diagonal elements or offset grids.
DO NOT: White or light backgrounds, warm colors, serif type, soft illustration, gradient-filled bars, gradients of any kind.`,

  "jakarta-heat": `DESIGN SYSTEM — JAKARTA HEAT:
Palette: Dark brown #1C1917 (FULL BLEED background — entire canvas), Orange #F97316 (dominant — headers, bars, callouts, everywhere), Amber #F59E0B (secondary data), White #FFFFFF (all body text), Light orange border #FED7AA.
Typography: Heavy condensed bold — shouting scale throughout. White text only on dark background. Numbers in orange at hero size. Nothing light, nothing delicate.
Chart personality: Bold solid-filled bars at aggressive height. Thick callout borders. Every data point at maximum visual weight. Urgency over elegance, always.
Illustration direction: Crowded Tanah Abang, motorbikes weaving through Sudirman, street food vendors under harsh fluorescent light, Commuter Line packed at 07:00 WIB. Urban momentum.
Layout DNA: Dark canvas with dominant orange. Wide #E00000 or #F97316 header strip 18-20% canvas height. Orange used on multiple elements — callout boxes, bar tops, key stats. High density.
DO NOT: Whitespace-dominant layouts, light type weights, any pastel or muted tones, serif type.`,

  "white-cube": `DESIGN SYSTEM — WHITE CUBE:
Palette: Pure white #FFFFFF (dominant canvas — minimum 40% must remain empty white), Light gray #F3F4F6 (subtle surface only), Near-black #111827 (outlines and primary type only), Medium gray #6B7280 (secondary labels), Hairline border #E5E7EB.
Typography: Light serif display + hairline sans body. Wallpaper* / Kinfolk production feel. Type IS the decoration — proportions and spacing are the design.
Chart personality: OUTLINED rectangles only — NO solid fills anywhere. Bars: white fill + 1px near-black border. Charts float in whitespace with no background panel. Data breathes.
Illustration direction: Architectural shadow on empty white wall. Single product in blank studio. Material close-up with no context. Negative space as composition.
Layout DNA: Swiss International Style. Minimum 40% empty canvas at all times. Zero background panels, zero grid lines, zero visual noise. If an element isn't critical, remove it.
DO NOT: Solid filled bars, bright accent colors, rounded corners, gradients, any decorative element, any background panels.`,

  "pop-idol": `DESIGN SYSTEM — POP IDOL:
Palette: Coral #FF6B6B (primary category), Yellow #FFD93D (secondary), Teal #4ECDC4 (tertiary), Purple #6C63FF (quaternary), White #FFFFFF (background), Dark #2D3436 (headers, text).
Typography: Rounded bold display + rounded medium body. Fun, expressive, never corporate. Category color used on the associated type labels.
Chart personality: Flat bright solid fills — each data category its own maximally saturated color. No data hierarchy — all categories equally bold and present. High visual energy.
Illustration direction: Flat lay on bright pastel surface. Daylight product photography. Instagram-optimized composition. Bold vector character illustration with thick outlines.
Layout DNA: Social card format. Bold dark section dividers. High saturation throughout. Designed for thumb-stopping social media repost.
DO NOT: Dark backgrounds, serif type, muted or desaturated colors, data annotation labels, corporate grid structure.`,

  "monocle-editorial": `DESIGN SYSTEM — MONOCLE EDITORIAL:
Palette: Warm cream #F5F0E8 (background), Ochre #D4A853 (primary accent, headline bars), Sage green #7D9B6A (secondary accent), Dark brown #2D1F0E (primary type), Tan #B8966E (data elements, borders), Warm gray #C4B49A (dividers).
Typography: Editorial serif display (Cormorant / Playfair feel) + humanist sans body. Mix of weights across hierarchy. Monocle / Kinfolk quality. Generous paragraph spacing and leading.
Chart personality: Warm-toned annotation over understated charts. Data feels discovered, not constructed. Handwritten-annotation character on key callout numbers.
Illustration direction: Golden hour filtering through plantation shutters. Artisan hands on natural Indonesian material. Batik or rattan texture as background element.
Layout DNA: Editorial grid system. Print publication DNA. Text and image integrated, not separated. Unhurried composition. Subtle paper grain texture on backgrounds.
DO NOT: Cold digital aesthetics, synthetic neon, dense packed data grids, flat geometric vector illustration, sharp clean edges.`,

  "the-vault": `DESIGN SYSTEM — THE VAULT:
Palette: Near-black #0D1117 (background), Dark panel #161B22 (header strip, dividers), Silver #8B949E (primary data bars, body text), Gold #FFD700 (SINGLE accent — the one most important datum only), Pure white #FFFFFF (headlines).
Typography: Elegant geometric serif display + clean sans body. Bloomberg terminal / private banking aesthetic. Gold appears on exactly one number — the hero insight.
Chart personality: Silver-toned precision data. One gold element marks the singular hero insight. Everything else recedes into silver. Deliberate restraint signals prestige.
Illustration direction: Black marble surface with a single gold object. Boardroom after hours with city lights outside. Watch crown macro on dark fabric. Dramatic directional studio light.
Layout DNA: Near-black canvas. Silver throughout with one gold moment. Deliberate, considered emptiness. Prestige is communicated through what is removed, not added.
DO NOT: Multiple bright colors, warm or organic tones, playful illustration, more than one gold element, dense or crowded layouts.`,

  "forest-sky": `DESIGN SYSTEM — FOREST & SKY:
Palette: Light mint #F0F7EE (background), Forest green #2D6A4F (headers, primary bars), Medium green #52B788 (secondary data), Sage #74C69D (tertiary), Light sage #B7E4C7 (dividers, borders), Dark forest #1B4332 (emphasis type).
Typography: Rounded humanist sans — natural, organic, never corporate. Generous line-height throughout. Full green palette used across text hierarchy.
Chart personality: Organic green progression from deep forest to light sage. Charts appear grown rather than built. Leaf, branch, and growth motifs woven into chart structure.
Illustration direction: Indonesian rice terraces at sunrise. Mangrove from above. Clean river over volcanic rock at Bromo foothills. Hands in dark Javanese soil.
Layout DNA: Organic asymmetry in composition. Green gradient canvas from deep to light. Growth metaphors present in data layout. Breathing room and organic spacing.
DO NOT: Industrial or synthetic colors, hard sharp corners, dense packed data grids, any orange or red element.`,

  "high-contrast": `DESIGN SYSTEM — HIGH CONTRAST:
Palette: Pure black #000000 (full-bleed canvas), White #FFFFFF (primary data bars, all text), Cyan #00E5FF (SINGLE accent — one element only, the hero), Dark charcoal #222222 (subtle panel differentiation).
Typography: Extra-condensed display at brutal architectural scale (Bebas Neue aesthetic) + monospace for data labels. Type used as primary visual element, not just label.
Chart personality: Black-and-white maximum contrast. One cyan punctuation mark on the hero datum. Data at gallery exhibition scale. Architecture replaces decoration.
Illustration direction: Black studio environment. Single product under dramatic directional key light. No background. Product rendered as sculpture on black void.
Layout DNA: Oversized display type as the composition's primary visual element. Black-white-black alternating rhythm. Single cyan moment. Gallery-quality whitespace around data.
DO NOT: Multiple accent colors, any warm tone, gradients of any kind, soft illustration, rounded corners, more than one cyan element.`,

  "sunday-brunch": `DESIGN SYSTEM — SUNDAY BRUNCH:
Palette: Near-white #FAFAFE (background), Soft blue #93C5FD (primary data), Lavender #C4B5FD (secondary), Mint green #6EE7B7 (tertiary), Soft purple #8B5CF6 (accent header strip), Pale indigo #E0E7FF (card backgrounds, dividers).
Typography: Rounded geometric sans — warm, medium weight. Feels personally curated, not system-generated. Slightly larger body text for approachable warmth.
Chart personality: Soft pastel solid fills with 12px corner radius on all bar and card elements. Charts feel casual and inviting, like a weekend menu, not a quarterly report.
Illustration direction: Natural window light on linen tablecloth. Coffee cup beside handwritten notes. Soft Sunday morning stillness in a Jakarta apartment.
Layout DNA: Light and airy throughout. 12px corner radius on every card, bar, and stat element. Generous spacing. Soft pastel-to-white gradient backgrounds on cards.
DO NOT: Dark or intense backgrounds, harsh contrast, heavy bold sans-serif, dense data annotation, industrial or corporate feel.`,

  "the-heartthrob": `DESIGN SYSTEM — THE HEARTTHROB:
Palette: Soft rose-white #FFF5F7 (light canvas), Deep rose #E11D48 (header strip, primary bars), Coral #FF6B6B (secondary data), Soft pink #F9A8D4 (tertiary elements), Peach #FECDD3 (card borders, dividers), Dark neutral #1C1917 (all text).
Typography: Stylized serif display (Playfair feel) + light rounded sans body. Vogue Indonesia / Harper's Bazaar editorial quality. Feminine and considered.
Chart personality: Rose-to-coral gradient progression on bars, 8px corner radius. Numbers in serif or elegant figure style. Data feels curated, not extracted.
Illustration direction: Warm studio with soft rose-diffused lighting. Beauty product on white marble slab. Hands cradling fresh botanicals from a Kebun Raya greenhouse.
Layout DNA: Light rose-white canvas. Deep rose headers and primary bars. Editorial feminine grid with 8-12px radius on all elements. Soft rose-to-white gradient on backgrounds.
DO NOT: Any orange tones, blue or cold colors, industrial chart layouts, dark or heavy backgrounds, heavy condensed display type.`,

  "the-dossier": `DESIGN SYSTEM — THE DOSSIER:
Palette: Pure white #FFFFFF (background), Near-black #111827 (SOLID FILLED bars and headline blocks), Medium gray #6B7280 (outlined bars, body text), Light gray #F3F4F6 (grid line color), Accent red #EF4444 (SINGLE critical insight only).
Typography: Monospace + condensed bold sans. Engineering report precision, not design award winner. Tight tracking. Maximum information density.
Chart personality: Dense visible grid lines covering entire canvas. Alternating solid-fill and outlined bars. Blueprint data density — every pixel holds data. Sharp 0px corner radius everywhere.
Illustration direction: Overhead blueprint on white desk. Server rack close-up. Process diagram on whiteboard. SCADA dashboard screenshot aesthetic.
Layout DNA: 0px corner radius on every element. Visible 1px grid lines at regular intervals. Dense packing. Sharp rectangles only. One red element marks the single critical insight.
DO NOT: Rounded corners, gradients of any kind, warm or pastel colors, organic shapes, decorative illustration, more than one red accent element.`,
};

// ─── Layout visual guide (unchanged) ─────────────────────────────────────────

const LAYOUT_VISUAL_GUIDE: Record<InfographicLayout, string> = {
  "data-chart": `LAYOUT TYPE — DATA VISUALIZATION:
Structure: A single primary chart (bar, line, or donut) occupies 55-65% of the composition. Labeled axes with grid lines. The chart is the undisputed visual hero. Supporting text in compact zones.
Visual hierarchy: Chart area → Headline strip → Key statistic callout → Caption/source line.
Specific elements: Choose ONE chart type and commit — vertical bar chart with 4-6 bars OR horizontal bar chart OR single line graph. Legend inline with bars. Baseline axis clearly marked. One small donut as secondary element is optional in a corner.
Ratio adaptation: For 9:16 portrait — horizontal bar chart works best (bars extend left-to-right). For 16:9 landscape — vertical bar chart in wide format. For 1:1 — vertical bar chart centered with stat callout beside it.
Multi-slide note: If slide 2+, use a DIFFERENT chart type and different data metric than slide 1.`,

  "key-stats": `LAYOUT TYPE — KEY STATISTICS:
Structure: 2-4 oversized statistics as the dominant design feature. Each number at hero scale. Each stat paired with a 2-4 word label below. Stats in a clean grid.
Visual hierarchy: Hero statistic number → Stat label → Context headline at top → Brief body text at bottom.
Specific elements: Rectangular stat cards. Large percentage or number as absolute focal point of each card. Bold divider lines separating cards.
Ratio adaptation: For 9:16 portrait — stack 2-4 stat cards vertically in single column. For 16:9 landscape — 4 cards side-by-side in one row. For 1:1 — 2×2 grid of cards. For 4:5 / 3:4 — 2×2 grid or 3 cards stacked.
Multi-slide note: Each slide in a series shows a completely different set of statistics — never repeat a number.`,

  timeline: `LAYOUT TYPE — TIMELINE:
Structure: Chronological flow with 3-5 marked time points. A visual spine line connecting all points. Each node: date/label + event headline + 1-2 line description.
Visual hierarchy: Timeline spine → Date/milestone markers → Event headlines → Brief descriptions.
Specific elements: Circular or diamond node markers at each event point. Alternating text placement (above/below or left/right of spine). Directional arrow at end showing continuation.
Ratio adaptation:
  — 16:9 landscape: horizontal spine across the full width, events labeled above and below alternating.
  — 9:16 / 3:4 / 4:5 portrait: vertical spine down center, dates on left, descriptions on right.
  — 1:1 square: vertical spine centered, maximum 3 events, large node circles, text to the right only.
Multi-slide note: Each slide covers a different era or phase of the timeline — never repeat the same time points.`,

  comparison: `LAYOUT TYPE — COMPARISON:
Structure: Two clearly labeled columns (A vs B, Before vs After, Option 1 vs 2). Matching rows of data for direct comparison. Summary callout at bottom spanning both columns.
Visual hierarchy: Column headers → Comparative data rows → Highlight row (key differentiator) → Summary callout.
Specific elements: Vertical dividing line between columns. Checkmarks or icons indicating advantages. Equal visual weight per column. Color tinting to distinguish columns.
Ratio adaptation:
  — 16:9 landscape: two wide columns with extra row depth — up to 5 comparison rows.
  — 9:16 / 3:4 / 4:5 portrait: stacked layout — Left column header at top half, Right column header at bottom half, separated by a thick horizontal divider.
  — 1:1 square: two equal columns side by side, 3 rows max to avoid crowding.`,

  "step-process": `LAYOUT TYPE — STEP-BY-STEP PROCESS:
Structure: 3-6 numbered steps in sequential flow. Each step: large circle with step number + headline + 1-2 line description. Arrows connect steps.
Visual hierarchy: Step number → Step headline → Brief description → Connecting arrow.
Specific elements: Numbered circles in primary theme color. Final step visually emphasized as goal/destination. Progress connector line through all steps.
Ratio adaptation:
  — 16:9 landscape: steps arranged LEFT-TO-RIGHT in a single horizontal row (3-4 steps max).
  — 9:16 / 3:4 / 4:5 portrait: steps stacked TOP-TO-BOTTOM in a single column (up to 5 steps).
  — 1:1 square: 2×2 grid of step cards (4 steps) or 3 steps in an L-shape.`,

  "fact-icons": `LAYOUT TYPE — FACT + ICON LIST:
Structure: 4-6 rows, each: circular icon placeholder + bold fact headline (1 line) + 1-2 lines supporting detail. All rows on a clean grid.
Visual hierarchy: Icon circle → Bold fact headline → Supporting detail → Row divider.
Specific elements: Icon circles in primary theme color with abstract shapes implying category. Each row separated by fine horizontal line. Alternating subtle background tints optional. Source credit at bottom.
Ratio adaptation:
  — 9:16 portrait: 5-6 rows, generous vertical spacing between rows.
  — 16:9 landscape: 3 rows max OR 2 columns of 3 rows each (6 facts total in grid).
  — 1:1 square: 4 rows with medium spacing.
Multi-slide note: Each slide covers a different category of facts. Icon circles use different colors per slide.`,

  "ranked-list": `LAYOUT TYPE — RANKED LIST:
Structure: 3-8 items ranked vertically by value. Each item: bold rank number + category label + horizontal bar proportional to value. #1 at top with longest bar.
Visual hierarchy: Rank number (large, bold) → Item label → Proportional horizontal bar → Value at bar end.
Specific elements: Large bold rank numbers left column. Bars decrease top-to-bottom. Top item bar in primary theme accent. Optional gold/silver/bronze medals for top 3. Source line at bottom.
Ratio adaptation:
  — 9:16 portrait: 6-8 items, generous bar height, vertical rhythm.
  — 16:9 landscape: 4-5 items max, bars extend across full width.
  — 1:1 square: 5 items, moderate bar width.
Multi-slide note: If slide 2+, rank by a DIFFERENT metric than slide 1.`,

  "magazine-cover": `LAYOUT TYPE — MAGAZINE COVER:
Structure and ratio adaptation:
  — PORTRAIT (9:16, 3:4, 4:5): Classic vertical magazine layout. Header brand strip occupies top 12%. Central rich gradient/textured visual zone occupies 55% of middle. Bold headline overlay at bottom 25%. 2-3 data badge pills float near the headline zone.
  — LANDSCAPE (16:9): Editorial spread layout. Left 40%: bold oversized headline text and 2-3 data badge pills stacked vertically. Right 60%: rich textured visual field with color gradient. Brand header strip runs full width at top edge only.
  — SQUARE (1:1): Centered composition. Header strip top 12%. Central visual zone center 50%. Headline bottom 30%. Two data badges flanking the headline.
Visual hierarchy: Brand header strip → Central visual hero zone → Headline (dominant scale) → Data callout badges.
Specific elements: "Data pill" badges showing statistics (e.g., "+72%", "3.2M"). Central zone is abstract color/gradient — NOT a photograph.`,

  flowchart: `LAYOUT TYPE — FLOWCHART:
Structure: Process diagram. Rounded rectangle start node. Rectangular process boxes connected by arrows. Diamond decision shape with YES/NO branches. Rounded end node.
Visual hierarchy: Start → Process boxes → Decision diamond → Branch outcomes → End.
Specific elements: Consistent box sizing. Directional arrows. Decision diamond with two labeled exit paths. Colors differentiate flow paths. All text zones sized for short labels (3-5 words each).
Ratio adaptation:
  — 9:16 / 3:4 portrait: top-to-bottom flow works naturally. Use the full vertical space for 4-5 process levels.
  — 16:9 landscape: left-to-right flow. Start node on far left, end node on far right. Decision diamond in center with branches going up/down.
  — 1:1 square: compact top-to-bottom, 3 levels max. Wide boxes.`,

  "bubble-chart": `LAYOUT TYPE — BUBBLE CHART:
Structure: Proportional circles where diameter represents data value. One dominant large bubble. 3-6 medium bubbles. 2-3 small bubbles. Bubbles overlap slightly, arranged organically.
Visual hierarchy: Largest bubble (hero data) → Medium bubbles → Small bubbles → Labels on each.
Specific elements: 5-8 bubbles total. Each labeled with category name and numeric value centered inside. Each bubble uses a distinct theme palette color. Organic scattered arrangement filling the full canvas.
Ratio adaptation:
  — 9:16 portrait: arrange bubbles in a tall vertical cluster — dominant bubble upper-center, smaller bubbles below and to sides.
  — 16:9 landscape: wide horizontal spread — dominant bubble left-center, others fanning right.
  — 1:1 square: clustered center composition, most natural ratio for bubble charts.`,

  "pull-quote": `LAYOUT TYPE — PULL QUOTE:
Structure: ONE oversized hero statistic dominates 50-60% of the composition at massive scale. Brief 2-4 word label below the hero. Two or three smaller supporting stat cards below.
Visual hierarchy: Hero stat (massive, fills the eye) → Brief label → 2-3 supporting stat cards → Source line.
Specific elements: Hero statistic at extreme scale (e.g., "72%" spans most of the width or height). Supporting cards side-by-side below. Generous empty space around the hero amplifies its presence.
Ratio adaptation:
  — 9:16 portrait: hero stat in top 50%, occupying full width. Two supporting cards stacked below.
  — 16:9 landscape: hero stat on left 55% in enormous scale. Two supporting cards stacked on right 40%.
  — 1:1 square: hero stat top 50% centered. Two cards side-by-side bottom half.`,

  "two-panel": `LAYOUT TYPE — TWO PANEL:
Structure: Composition split into two zones by a clear visual divider (color shift or thick line).
Ratio adaptation — CRITICAL:
  — 16:9 / 1:1 / 3:4 / 4:5: VERTICAL split — left panel 50%, right panel 50%. Left panel: one bold visual (bar chart, large stat, or donut). Right panel: structured 3-5 row data breakdown.
  — 9:16 portrait: HORIZONTAL split — top panel 50%, bottom panel 50%. Top panel: one bold visual element. Bottom panel: structured data rows. NEVER use side-by-side columns in 9:16 — they become too narrow.
Visual hierarchy: Primary panel hero element → Divider → Secondary panel header → Secondary panel data rows → Footer.
Specific elements: Both panels use same color theme but different visual treatments. A shared accent color connects the panels.`,
};

// ─── Brand publication style (no brand names — image-safe) ───────────────────

const BRAND_IMAGE_STYLE: Record<MediaBrand, string> = {
  detikcom: `PUBLICATION STYLE:
Header strip: Wide solid #E00000 strip at top (18-20% of canvas height). Red #E00000 used liberally across the design — callout boxes, stat highlights, bar tops, key number backgrounds. NOT reserved sparingly.
Surface: White background panels between red elements. High visual density and urgency.
Typography: Bold condensed weight — the composition must feel impactful and immediate. Numbers at aggressive scale.`,

  "cnn-indonesia": `PUBLICATION STYLE:
Header strip: Slim #CC0000 strip at top edge only (10% height — narrow, not thick). Red appears ONLY on this header strip.
Data zones: Dark charcoal #1A1A1A panels behind all data areas. All data text in white on dark panels (broadcast news lower-third aesthetic). No red anywhere except the slim header.
Typography: Clean authoritative sans-serif. Measured and credible — NOT tabloid. Calm, precise layout.`,

  "cnbc-indonesia": `PUBLICATION STYLE:
Header strip: Navy #003087 header bar or full-width top frame element.
Key accent: Gold #FFB800 applied to exactly ONE primary financial metric — the most important number only.
Surface: Dense financial data layout — chart-heavy, Bloomberg/Reuters-style precision. Executive-audience data density.
Typography: Precise clean sans-serif at multiple size levels. Data-dense composition.`,
};

// ─── Brand editorial guide (story prompt only — NOT sent to image model) ──────

const BRAND_EDITORIAL_GUIDE: Record<MediaBrand, string> = {
  detikcom: `MEDIA BRAND — DETIKCOM:
Editorial voice: Bold, fast, Indonesian mass-market urgency. #1 digital news in Indonesia.
Integration: Thick red header strip, red accent elements throughout. Tabloid energy — high visual noise, urgent headline tone.`,
  "cnn-indonesia": `MEDIA BRAND — CNN INDONESIA:
Editorial voice: International perspective, authoritative analysis, measured broadcast credibility.
Integration: Slim red header only, dark data panels, broadcast news lower-third aesthetic.`,
  "cnbc-indonesia": `MEDIA BRAND — CNBC INDONESIA:
Editorial voice: Business and finance focused, data-driven, executive Indonesian audience.
Integration: Navy header, gold on single hero financial metric. Bloomberg/Reuters chart aesthetic.`,
};

// ─── Canvas ratio guide ───────────────────────────────────────────────────────

const RATIO_CANVAS: Record<string, string> = {
  "1:1":  "CANVAS: Square 1:1. Use 2×2 grid arrangements or centered single-column. Equal visual zones top/bottom.",
  "4:5":  "CANVAS: Tall portrait 4:5. Stack ALL elements vertically in a single column. Header top 15%, body 70%, footer 15%.",
  "9:16": "CANVAS: Vertical Stories format 9:16 — TALL composition. SINGLE COLUMN ONLY. No side-by-side columns. Header strip top 10%, hero data zone 60%, supporting data 25%, footer 5%. Elements stack top-to-bottom.",
  "16:9": "CANVAS: Widescreen landscape 16:9 — WIDE composition. Use horizontal arrangements: left anchor + right content, or wide chart below a top strip. Never stack more than 2 rows vertically.",
  "3:4":  "CANVAS: Standard portrait 3:4. Single-column vertical stack. Header top 15%, body 70%, footer 15%.",
};

// ─── Kimi story prompt (creative director mode) ───────────────────────────────

export function buildStorySystemPrompt(): string {
  return `You are the creative director and senior data journalist at a premium Indonesian editorial production studio. You produce branded content that brand partners pay premium rates for because it reads like real journalism, not advertising.

Your output drives editorial infographic generation that must meet Bloomberg Businessweek / NYT Upshot / Monocle quality standards. Every output will be sold to an Indonesian brand partner as custom media content.

CREATIVE DIRECTOR RESPONSIBILITIES:
1. Find the data story — the surprising angle, the number that reframes everything, the human insight hidden in the statistics
2. Art direct the visual — describe hero compositions with photographic specificity ("pre-dawn Jakarta from Kuningan, rain on glass, phone glow below"), not design-speak ("blue background with data elements")
3. Ground it in Indonesian reality — specific WIB timestamps, real Jakarta neighborhoods, local apps (GoFood, Tokopedia, BCA Mobile), named transport lines (KRL, Transjakarta), local institutions (BPS, OJK, Bank Indonesia)
4. Integrate the brand partner as a data actor, not a sponsor — the brand earns its presence through contextual role in the data story
5. Define a Visual DNA that creates genuine cohesion across all slides — a recurring motif, a specific mood, a narrative arc

CULTURAL SPECIFICITY REQUIREMENT:
Every slide must contain ≥3 specific Indonesian / Jakarta details. Failure mode: "urban professional checks phone in morning." Success: "KRL commuter on the Bogor line at 06:15 WIB scrolls GoFood before Manggarai."

BRAND INTEGRATION PRINCIPLE:
The brand partner appears as a natural actor in the data story, not as a sponsor overlay. Think: "BCA Mobile processed 4.7M micro-transactions in this behavior window" — not "BCA presents this data."

VISUAL DIRECTION REQUIREMENT:
Describe heroImage as a photographer briefing a cinematographer. Specific location, lighting condition, subject in frame, emotional register. 50-80 words minimum.

CRITICAL: Respond ONLY with valid JSON matching the exact schema. No markdown, no extra text, no commentary.`;
}

export function buildStoryUserPrompt(req: GenerationRequest): string {
  const sectionCount = req.slideCount;
  const mediaBrandMap: Record<MediaBrand, string> = {
    detikcom: "detikcom",
    "cnn-indonesia": "CNN Indonesia",
    "cnbc-indonesia": "CNBC Indonesia",
  };
  const layoutMap: Record<InfographicLayout, string> = {
    "data-chart": "Data Visualization Charts",
    "key-stats": "Key Statistics Showcase",
    timeline: "Timeline / Sequential Flow",
    comparison: "Side-by-Side Comparison",
    "step-process": "Step-by-Step Process",
    "fact-icons": "Fact + Icon List",
    "ranked-list": "Ranked List",
    "magazine-cover": "Magazine Cover",
    flowchart: "Flowchart",
    "bubble-chart": "Bubble Chart",
    "pull-quote": "Pull Quote",
    "two-panel": "Two Panel Split",
  };
  const themeMap: Record<InfographicTheme, string> = {
    broadsheet: "Broadsheet",
    "neo-tokyo": "Neo-Tokyo",
    "jakarta-heat": "Jakarta Heat",
    "white-cube": "White Cube",
    "pop-idol": "Pop Idol",
    "monocle-editorial": "Monocle Editorial",
    "the-vault": "The Vault",
    "forest-sky": "Forest & Sky",
    "high-contrast": "High Contrast",
    "sunday-brunch": "Sunday Brunch",
    "the-heartthrob": "The Heartthrob",
    "the-dossier": "The Dossier",
  };

  const brandGuide = BRAND_EDITORIAL_GUIDE[req.mediaBrand];

  return `Art direct an editorial infographic series for direct brand-partner sale.

TOPIC: ${req.topic}
MEDIA BRAND: ${mediaBrandMap[req.mediaBrand]}
BRAND PARTNER: ${req.brandTarget}
INFOGRAPHIC LAYOUT: ${layoutMap[req.layout]}
DESIGN SYSTEM: ${themeMap[req.colorTheme]}
NUMBER OF SLIDES: ${sectionCount}
ASPECT RATIO: ${req.ratio}

${brandGuide}

CREATIVE BRIEF:
1. Find the data angle that would surprise an educated Indonesian professional — not the obvious take
2. Ground statistics in verifiable Indonesian context — cite sources by name (BPS, OJK, Bank Indonesia, Katadata, Nielsen Indonesia, APJII, etc.)
3. Brand partner "${req.brandTarget}" must appear as a data actor in at least one slide — specific, contextual, not generic sponsor
4. heroImage descriptions must be photographically specific — real Jakarta locations, time of day, lighting condition, human subject
5. Cultural details must name real neighborhoods, apps, transport lines, institutions — no generic "urban Indonesians"
6. imagePrompt field: leave as empty string — visual direction comes from visualDirection object

Respond with ONLY this JSON (no markdown, no extra text):
{
  "mainHeadline": "Headline in topic language — journalistic, specific data point embedded, publishable",
  "language": "id or en",
  "visualDNA": {
    "paletteNotes": "How the ${themeMap[req.colorTheme]} design system specifically serves this story's emotional register",
    "typographyPairing": "The exact character of display font and body font for this story's mood",
    "illustrationStyle": "Specific photographic or illustration direction that unifies all ${sectionCount} slides",
    "recurringMotif": "The one visual element, symbol, or composition pattern that appears across all slides — specific and tangible",
    "narrativeArc": "${sectionCount === 1 ? "Single slide story beat: what insight does this one frame carry?" : Array.from({length: sectionCount}, (_, i) => `Slide ${i+1}: [story beat]`).join(". ")}"
  },
  "sections": [
    {
      "headline": "Slide headline — specific, surprising, publishable in a premium Indonesian outlet",
      "subheadline": "One-line deck copy with a specific number or named tension that makes the reader lean in",
      "body": "• Specific stat with named Indonesian source\\n• Percentage with behavioral context\\n• Named Jakarta location or institution + data\\n• Fact featuring ${req.brandTarget} as data actor\\n• Trend or projection with year",
      "imagePrompt": "",
      "visualDirection": {
        "heroImage": "Photographically specific hero visual description. Real Jakarta location, exact time of day, lighting condition, human subject or object in frame, emotional register. 50-80 words.",
        "chartConcept": "The visual metaphor that carries the data — not the chart type, but the concept. E.g., 'notification badges accumulate across a phone lock screen as the hour advances' rather than 'bar chart of hourly data'",
        "recurringMotif": "How the series recurring motif appears specifically in this slide — location in frame, size, treatment",
        "moodTone": "One evocative phrase capturing this slide's emotional register",
        "culturalDetails": ["Specific WIB timestamp or Jakarta neighborhood", "Named Indonesian app, service, or institution", "Brand-specific Indonesian behavioral context"],
        "brandIntegration": "Exactly how ${req.brandTarget} appears in this slide's data narrative — specific role, specific number if possible"
      },
      "editorialMeta": {
        "pullQuote": "The one memorable sentence from this slide — 5-12 words, quotable, shareable on social",
        "sourceAttribution": "Source: [Full institution name], [Year]",
        "sectionLabel": "SECTION TITLE / HH:MM WIB"
      }
    }
  ]
}`;
}

// ─── Data extraction (strict — numbers + units only) ─────────────────────────

function sanitizeBrandTarget(raw: string): string {
  return raw
    .replace(/\b(kecelakaan|tabrakan|banjir|gempa|tsunami|kebakaran|terorisme|bom|ledakan|tewas|korban|darurat)\b/gi, "")
    .replace(/\b(accident|crash|flood|earthquake|fire|terror|bomb|explosion|casualt|victim|emergency|disaster|killed|dead)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    || "the featured brand";
}

function extractDataPoints(text: string): string {
  const matches = text.match(
    /[\d.,]+\s*%|\d{2,}(?:[.,]\d+)?\s*(ribu|juta|miliar|triliun|km|meter|km\/h|orang|unit|tahun|ton|MW|GW|kg|liter|barrel|USD|IDR|rupiah|billion|million|thousand|km²)|\b(pertama|kedua|ketiga|ke-\d+|#\d+|no\.\s*\d+)\b/gi
  );
  if (!matches || matches.length === 0) return "";
  return matches.slice(0, 8).join(" • ");
}

// ─── Image prompt builder ─────────────────────────────────────────────────────

export function buildImagePrompt(
  section: StorySection,
  req: GenerationRequest,
  sectionIndex: number,
  visualDNA?: SeriesVisualDNA
): string {
  const themeGuide = THEME_VISUAL_GUIDE[req.colorTheme];
  const layoutGuide = LAYOUT_VISUAL_GUIDE[req.layout];
  const pubStyle = BRAND_IMAGE_STYLE[req.mediaBrand];
  const canvasGuide = RATIO_CANVAS[req.ratio] ?? `CANVAS: Aspect ratio ${req.ratio}.`;

  const slideLabel = req.slideCount === 1
    ? "single infographic"
    : `slide ${sectionIndex + 1} of ${req.slideCount}`;

  const safeBrand = sanitizeBrandTarget(req.brandTarget);
  const vd = section.visualDirection;
  const em = section.editorialMeta;

  // Hero composition block — rich if Kimi returned visualDirection, sparse fallback otherwise
  const heroBlock = vd
    ? `[HERO COMPOSITION]
${vd.heroImage}
Mood: ${vd.moodTone}
Cultural specifics: ${vd.culturalDetails.join(" · ")}
Recurring series motif: ${vd.recurringMotif}`
    : (() => {
        const dp = extractDataPoints(section.body);
        return dp ? `[DATA VALUES TO VISUALIZE]\n${dp}` : "";
      })();

  const dataBlock = vd
    ? `[DATA NARRATIVE]
Chart concept: ${vd.chartConcept}
Brand integration: ${vd.brandIntegration}`
    : "";

  const typographyBlock = em
    ? `[EDITORIAL TYPOGRAPHY ZONES]
Headline (display scale): "${section.headline}"
Subhead (body scale): "${section.subheadline}"
Pull quote (feature callout): "${em.pullQuote}"
Section label (caption scale): "${em.sectionLabel}"
Source attribution (smallest): "${em.sourceAttribution}"
Direction: editorial hierarchy — display > body > caption > source. Leave zones clean if text rendering is uncertain.`
    : `[TYPOGRAPHY ZONES]
Headline: "${section.headline}"
Subhead: "${section.subheadline}"`;

  const dnaBlock = visualDNA
    ? `[SERIES VISUAL DNA — apply consistently across all slides]
Illustration style: ${visualDNA.illustrationStyle}
Recurring motif treatment: ${visualDNA.recurringMotif}
Palette notes: ${visualDNA.paletteNotes}
This slide's narrative position: ${visualDNA.narrativeArc}`
    : req.slideCount > 1
    ? `[SERIES CONSISTENCY — slide ${sectionIndex + 1} of ${req.slideCount}]
All slides in this series must share identical background treatment, header strip height, font character, and color assignments. Only data content changes between slides.`
    : "";

  const sourceAttr = safeBrand
    ? `[DATA SOURCE ATTRIBUTION]\nLabel "${safeBrand}" as data source in a small, clean attribution callout at the footer or corner. Do not treat as a sponsor logo — treat as a citation.`
    : "";

  return `[VISUAL TREATMENT]
Editorial photo-illustration for premium Indonesian publication. ${slideLabel}.
Style reference: Bloomberg Businessweek covers, Monocle magazine spreads, NYT Upshot data journalism, Reuters Graphics.
NOT generic infographic templates. NOT stock icon clip-art. NOT corporate presentation slides.

${canvasGuide}

${heroBlock}

${dataBlock}

${typographyBlock}

${themeGuide}

${layoutGuide}

${pubStyle}

${dnaBlock}

${sourceAttr}

[TECHNICAL REQUIREMENTS]
- Pure infographic editorial image — data visualization with publication-quality illustration
- Apply the design system to ALL elements: background, data structures, type zones, dividers
- Follow canvas ratio and layout structure exactly — ratio adaptation rules are non-negotiable
- Populate charts and callouts with internally consistent, realistic-looking numbers
- Full-bleed composition, no white border frame, no watermark

[DO NOT]
- Do not produce generic "DATA OVERVIEW" or "KEY METRICS" template aesthetics
- Do not use clip-art icons or stock icon library shapes
- Do not stamp a brand logo — brand appears only as a data attribution text label
- Do not render inconsistent or garbled text — leave typography zones as clean layout space if uncertain

Generate a single premium editorial infographic that executes all of the above.`;
}
