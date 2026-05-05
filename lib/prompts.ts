import type { GenerationRequest, InfographicTheme, InfographicLayout, MediaBrand } from "./types";

const THEME_VISUAL_GUIDE: Record<InfographicTheme, string> = {
  corporate: `COLOR THEME — CORPORATE BLUE:
Primary palette: Navy #1E3A5F (header bars, primary data), Sky blue #3B82F6 (charts, callout elements), Light blue #93C5FD (secondary data), Pure white #FFFFFF (background, text on dark), Light gray #F8FAFC (surface areas), Grid lines #E2E8F0.
Visual language: Professional, trustworthy, data-driven. Clean grid structure. Sharp rectangular data elements with 0px corner radius. Business publication quality. Every data element rendered in the navy–blue spectrum.
Typography: Bold geometric sans-serif. Heavy weight for headline. Medium for body. Numbers in condensed bold.
Gradients: None — flat solid fills only.
Accent rule: Sky blue #3B82F6 may be used on multiple elements; navy reserved for headers and dominant bars only.`,

  "dark-neon": `COLOR THEME — DARK NEON:
Primary palette: Near-black #0F0F1A (full-bleed background), Cyan #06B6D4 (primary data accent), Purple #A855F7 (secondary accent), Lime #84CC16 (tertiary accent), White #FFFFFF (headlines, labels), Dark navy #1a1a2e (section dividers).
Visual language: High-tech, bold, maximum contrast. Data bars and callout boxes have a subtle luminous glow effect. Digital dashboard aesthetic — like a live data screen. Each data category gets its own neon accent color. Tech and gaming publication energy.
Typography: Condensed bold sans-serif. Numbers rendered extra-large in neon color with slight outer glow.
Gradients: Allowed — subtle dark-to-slightly-lighter radial gradient on background panels only. Bars are solid flat fills.
Accent rule: Each data category uses a distinct neon (cyan / purple / lime). Background must remain near-black #0F0F1A throughout.`,

  "warm-bold": `COLOR THEME — WARM BOLD:
Primary palette: Dark brown #1C1917 (FULL BLEED background — the entire canvas is dark), Orange #F97316 (primary data bars, header strip, callouts), Amber #F59E0B (secondary data, highlights), White #FFFFFF (all text on dark), Light orange #FED7AA (subtle panel borders).
Visual language: DARK background with vivid orange — this is NOT a light theme. Bold tabloid urgency. Thick orange header strip. Impactful statistics in white on dark. Indonesian breaking-news energy.
Typography: Heavy condensed bold sans-serif. White text only — no dark text anywhere. Numbers in orange at hero scale.
Gradients: None — flat fills only.
Accent rule: Orange is dominant and used broadly. Amber for secondary. White for all labels and body text.`,

  "clean-white": `COLOR THEME — CLEAN MINIMAL:
Primary palette: Pure white #FFFFFF (dominant background — minimum 40% of canvas must remain empty white), Light gray #F3F4F6 (subtle surface areas only), Near-black #111827 (headlines and primary data only), Medium gray #6B7280 (body text, secondary labels), Hairline borders #E5E7EB.
Visual language: Swiss International Style — white space IS the design. Data elements use OUTLINED rectangles only (white fill, thin #111827 border) — NO solid filled bars or boxes. NO visible grid lines. NO background panels or section fills. Maximum restraint: if an element is not critical, remove it.
Typography: Light to regular weight geometric sans-serif only — NO bold fills, NO heavy strokes. Elegant and airy.
Gradients: Strictly forbidden.
Accent rule: No accent color. Near-black on white only. Contrast comes from scale and spacing, not color.`,

  "vivid-pop": `COLOR THEME — VIVID POP:
Primary palette: Coral #FF6B6B (primary data category), Yellow #FFD93D (secondary category), Teal #4ECDC4 (tertiary category), Purple #6C63FF (quaternary category), White #FFFFFF (background), Dark #2D3436 (text, headers).
Visual language: Bright, flat, maximum visual energy. Each data category gets its own saturated solid color. Social media optimized composition. Modern flat design aesthetic. Bold section dividers in dark color.
Typography: Bold rounded sans-serif. Fun and energetic. Numbers in the category color at large scale.
Gradients: None — solid fills only, no exceptions.
Accent rule: All four palette colors actively used for different data categories. No color hierarchy — all equally bold.`,

  editorial: `COLOR THEME — EDITORIAL MUTED:
Primary palette: Warm cream #F5F0E8 (background), Ochre #D4A853 (primary accent, headline bars), Sage green #7D9B6A (secondary accent), Dark brown #2D1F0E (headlines, primary text), Tan #B8966E (data elements, borders), Warm gray #C4B49A (dividers).
Visual language: Refined, warm, magazine-editorial quality. Print publication aesthetic. Natural, organic tone. Reminiscent of quality Indonesian print media like Tempo or Kompas.
Typography: Mix of serif and sans-serif — headline zone implies editorial serif presence; data zones use clean sans-serif. Moderate weight throughout.
Gradients: Subtle warm gradient allowed on header zones only (ochre to tan).
Accent rule: Ochre for 2-3 prominent elements; sage for secondary callouts; no element in full saturation.`,

  midnight: `COLOR THEME — MIDNIGHT PREMIUM:
Primary palette: Near-black #0D1117 (background), Dark panel #161B22 (header strip, section dividers), Silver #8B949E (primary data bars, body text), Gold #FFD700 (accent — key statistic, tallest bar, most important callout ONLY), Pure white #FFFFFF (headlines), Deep gray #21262D (grid lines).
Visual language: Premium, authoritative, high-contrast dark editorial. Evokes financial publications and luxury brands. Silver and gold together signal prestige and precision.
Typography: Clean geometric sans-serif. White for main headlines. Silver for body. Gold for one hero number only.
Gradients: Subtle top-to-bottom dark gradient on background panel allowed.
Accent rule: Gold is STRICTLY RESERVED for exactly one element — the single most important data point. Everything else is silver or white.`,

  nature: `COLOR THEME — NATURE GREEN:
Primary palette: Light mint #F0F7EE (background), Forest green #2D6A4F (headers, primary data bars), Medium green #52B788 (secondary data), Sage #74C69D (tertiary accent), Light sage #B7E4C7 (dividers, borders), Dark forest #1B4332 (headlines, emphasis text).
Visual language: Organic, sustainable, earthy. Natural progression from deep forest green to soft sage. Suitable for environmental topics, agriculture, wellness, sustainability, and ESG content.
Typography: Rounded or humanist sans-serif — natural, friendly weight. Green palette for all text hierarchy.
Gradients: Subtle green-to-mint gradient allowed on background or header zones to feel organic.
Accent rule: Forest green is the anchor. Multiple shades of green are all valid — the entire palette can be used freely.`,

  "bold-black": `COLOR THEME — BOLD BLACK:
Primary palette: Pure black #000000 (full-bleed background — entire canvas), White #FFFFFF (primary data bars, ALL headlines, ALL body text), Cyan #00E5FF (ONE element only — the single most important callout), Dark charcoal #222222 (panel areas, subtle section dividers).
Visual language: Maximum contrast, gallery-quality boldness. Every element is black or white — no exceptions. The cyan accent appears exactly once to mark the hero insight. Power comes from restraint. Luxury streetwear and editorial photography aesthetic.
Typography: Extra-bold condensed sans-serif. Numbers at massive scale in white. Stark, architectural.
Gradients: Strictly forbidden.
Accent rule: Cyan used on EXACTLY ONE element. Choosing the wrong element to accent is a design failure — it must be the hero statistic or most important bar.`,

  pastel: `COLOR THEME — PASTEL SOFT:
Primary palette: Near-white #FAFAFE (background), Soft blue #93C5FD (primary data), Lavender #C4B5FD (secondary data), Mint green #6EE7B7 (tertiary data), Soft purple #8B5CF6 (header strip, accent), Pale indigo #E0E7FF (dividers, card backgrounds).
Visual language: Gentle, approachable, friendly. Light and airy. High readability at low visual stress. Suitable for lifestyle, education, wellness, and social media infographics.
Typography: Rounded geometric sans-serif, medium weight. Slightly larger body text than other themes for warmth.
Gradients: Soft pastel-to-white gradients allowed on card backgrounds and header zone.
Accent rule: Up to 3 elements may use the soft purple #8B5CF6 as accent. All four palette data colors are used freely per data category.
Card style: 12px corner radius on all cards and stat boxes.`,

  "rose-coral": `COLOR THEME — ROSE CORAL:
Primary palette: Soft rose-white #FFF5F7 (LIGHT background — this is a light-background theme), Deep rose #E11D48 (header strip, primary bars), Coral #FF6B6B (secondary data), Soft pink #F9A8D4 (tertiary elements), Peach #FECDD3 (dividers, card borders), Dark neutral #1C1917 (text, labels).
Visual language: Warm, vibrant, lifestyle-forward. Light rose-white canvas with bold rose-pink headers. Strictly pink/coral/rose palette — NO orange, NO red-orange. Suitable for fashion, beauty, food, health, social-media content.
Typography: Rounded medium-weight sans-serif. Slightly stylized — approachable and feminine. Dark neutral for body text.
Gradients: Soft rose-to-white gradient allowed on card backgrounds.
Accent rule: Deep rose #E11D48 for headers and primary bars. Coral for secondary. Pink for soft backgrounds. No element uses orange.
Card style: 8-12px corner radius on all cards.`,

  "mono-grid": `COLOR THEME — MONO GRID:
Primary palette: Pure white #FFFFFF (background), Near-black #111827 (SOLID FILLED bars and headline blocks), Medium gray #6B7280 (outlined bars, body text labels), Light gray #F3F4F6 (grid line color), Accent red #EF4444 (SINGLE highlight — ONE element only).
Visual language: Blueprint precision and density — the OPPOSITE of clean-white. Explicit visible grid lines cover the entire canvas. Data bars alternate between solid black fill and white-fill-with-black-outline. Heavy bold weight throughout — thick strokes, high data density, zero wasted space. Feels like a newspaper data spread or engineering diagram.
Typography: Bold condensed sans-serif. High information density — smaller body text size to pack in more data. Heavy headline weight.
Gradients: Strictly forbidden.
Accent rule: Red #EF4444 used on EXACTLY ONE element to mark the most critical insight. Everything else is black, white, or gray only.
Card style: 0px corner radius — sharp rectangles only. Visible 1px grid lines at regular intervals.`,
};

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
  — 9:16 / 3:4 / 4:5 portrait: stacked layout — Left column header at top half, Right column header at bottom half, separated by a thick horizontal divider. Each column gets its own half of the canvas.
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
Multi-slide note: If slide 2+, rank by a DIFFERENT metric than slide 1 (e.g., slide 1 ranks by volume, slide 2 by growth rate, slide 3 by value per unit).`,

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

const BRAND_EDITORIAL_GUIDE: Record<MediaBrand, string> = {
  detikcom: `MEDIA BRAND — DETIKCOM:
Brand identity: Indonesia's #1 mass-market digital news brand. Bold, fast, tabloid urgency.
Brand colors: Detik red #E00000 (used heavily — header strip, accent bars, key stat callouts), White background (when not using dark themes).
Integration: Wide red #E00000 header strip at top (18-20% height). Red used liberally on callout boxes, key statistics highlights, and bar tops — NOT reserved sparingly. Multiple elements in red. High visual noise. Feels urgent and breaking-news.
Typography mood: Bold condensed — the layout must feel like it's shouting the headline.`,

  "cnn-indonesia": `MEDIA BRAND — CNN INDONESIA:
Brand identity: International perspective, authoritative, measured analysis — NOT tabloid urgency. Broadcast news credibility.
Brand colors: CNN Red #CC0000 (header bar ONLY — slim, top 10% height), Dark charcoal #1A1A1A (data panel overlays, section backgrounds), White #FFFFFF (text on dark panels).
Integration: Slim CNN red header bar at top (10% height only — restrained, not a thick block). Dark charcoal #1A1A1A behind all data zones — data appears as white text on dark panels, like broadcast news lower-thirds. Red is reserved for the header alone.
Typography mood: Clean authoritative sans-serif — international news production quality. Calm and credible.`,

  "cnbc-indonesia": `MEDIA BRAND — CNBC INDONESIA:
Brand identity: Business and finance focused, data-driven, executive audience.
Brand colors: Navy #003087 (header bar, primary frame elements), Gold #FFB800 (key statistics accent, most important data callout).
Integration: Navy #003087 header bar or frame element. Gold #FFB800 on the key financial statistic or most important number. Financial data visualization aesthetic — charts feel like Bloomberg or Reuters graphics.
Typography mood: Precise, data-dense, executive-level. Clean sans-serif at multiple density levels.`,
};

export function buildStorySystemPrompt(): string {
  return `You are a senior data journalist and infographic editor specializing in Indonesian media. You create structured, data-rich content designed specifically for visual infographic layouts.

Your output must:
1. Surface compelling statistics, percentages, rankings, and data points that make powerful infographic visuals
2. Structure body copy as concise bullet-point facts — NOT long prose paragraphs
3. Match the specific media brand's editorial voice and visual identity
4. Integrate the brand partner naturally without feeling like advertising
5. Generate highly specific visual descriptions for infographic image generation
6. Write headlines and body copy in the same language as the topic

CRITICAL: Respond ONLY with valid JSON matching the exact schema. No markdown, no extra text.`;
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
    corporate: "Corporate Blue",
    "dark-neon": "Dark Neon",
    "warm-bold": "Warm Bold",
    "clean-white": "Clean Minimal",
    "vivid-pop": "Vivid Pop",
    editorial: "Editorial Muted",
    midnight: "Midnight Premium",
    nature: "Nature Green",
    "bold-black": "Bold Black",
    pastel: "Pastel Soft",
    "rose-coral": "Rose Coral",
    "mono-grid": "Mono Grid",
  };

  return `Create structured infographic content for:

TOPIC: ${req.topic}
MEDIA BRAND: ${mediaBrandMap[req.mediaBrand]}
BRAND PARTNER: ${req.brandTarget}
INFOGRAPHIC LAYOUT: ${layoutMap[req.layout]}
COLOR THEME: ${themeMap[req.colorTheme]}
NUMBER OF SLIDES: ${sectionCount}
ASPECT RATIO: ${req.ratio}

REQUIREMENTS:
- Surface compelling statistics, percentages, rankings, and data points relevant to the topic
- Body copy must be 4-6 concise bullet-point facts (each starting with "• "), NOT prose paragraphs
- Include specific numbers, percentages, and verifiable data in bullet points
- The brand partner "${req.brandTarget}" must appear naturally within the data story
- Each imagePrompt must be 200-300 words describing a specific infographic visual
- Image prompts must describe EXACT infographic elements: chart types, data values, icon placements, color zones, layout structure
- CRITICAL: imagePrompt must NEVER depict accident scenes, injuries, crashes, disasters, violence, or any photorealistic event — describe only abstract data visualization, charts, icons, and graphic design elements
- Reference the ${themeMap[req.colorTheme]} color theme palette in visual descriptions
- Optimize visual descriptions for ${req.ratio} aspect ratio infographic composition
- Image prompts should reference "${req.brandTarget}" brand elements naturally (product, brand context, data attribution)

Respond with ONLY this JSON (no extra text, no markdown):
{
  "mainHeadline": "Compelling infographic headline in topic's language",
  "language": "id or en",
  "sections": [
    {
      "headline": "Slide headline — short and punchy",
      "subheadline": "One-line deck copy or key data callout",
      "body": "• Fact one with specific number\\n• Fact two with percentage\\n• Fact three with ranking or comparison\\n• Fact four with data point\\n• Fact five with trend or projection",
      "imagePrompt": "200-300 word description of the exact infographic visual: layout zones, chart types and values, data callout positions, icon placements, color applications per theme, brand integration point, typography hierarchy zones, and how the ${req.ratio} ratio frames the composition."
    }
  ]
}`;
}

// Require units or % or 2+ digit numbers to avoid single-digit noise
function extractDataPoints(text: string): string {
  const matches = text.match(
    /[\d.,]+\s*%|\d{2,}(?:[.,]\d+)?\s*(ribu|juta|miliar|triliun|km|meter|km\/h|orang|unit|tahun|ton|MW|GW|kg|liter|barrel|USD|IDR|rupiah|billion|million|thousand|km²)|\b(pertama|kedua|ketiga|ke-\d+|#\d+|no\.\s*\d+)\b/gi
  );
  if (!matches || matches.length === 0) return "";
  return matches.slice(0, 8).join(" • ");
}

// Canvas instructions keyed by ratio — injected as highest-priority context
const RATIO_CANVAS: Record<string, string> = {
  "1:1":  "CANVAS: Square 1:1. Use 2×2 grid arrangements or centered single-column. Equal visual zones top/bottom.",
  "4:5":  "CANVAS: Tall portrait 4:5. Stack ALL elements vertically in a single column. Header top 15%, body 70%, footer 15%.",
  "9:16": "CANVAS: Vertical Stories format 9:16 — TALL composition. SINGLE COLUMN ONLY. No side-by-side columns. Header strip top 10%, hero data zone 60%, supporting data 25%, footer 5%. Elements stack top-to-bottom.",
  "16:9": "CANVAS: Widescreen landscape 16:9 — WIDE composition. Use horizontal arrangements: left anchor + right content, or wide chart below a top strip. Never stack more than 2 rows vertically.",
  "3:4":  "CANVAS: Standard portrait 3:4. Single-column vertical stack. Header top 15%, body 70%, footer 15%.",
};

export function buildImagePrompt(
  section: { headline: string; body: string },
  req: GenerationRequest,
  sectionIndex: number
): string {
  const themeGuide = THEME_VISUAL_GUIDE[req.colorTheme];
  const layoutGuide = LAYOUT_VISUAL_GUIDE[req.layout];
  const brandGuide = BRAND_EDITORIAL_GUIDE[req.mediaBrand];
  const canvasGuide = RATIO_CANVAS[req.ratio] ?? `CANVAS: Aspect ratio ${req.ratio}.`;

  const slideLabel =
    req.slideCount === 1
      ? "single infographic"
      : `slide ${sectionIndex + 1} of ${req.slideCount}`;

  const dataPoints = extractDataPoints(section.body);
  const dataLine = dataPoints ? `DATA VALUES TO VISUALIZE: ${dataPoints}` : "";

  const consistencyNote =
    req.slideCount > 1
      ? `SERIES CONSISTENCY (slide ${sectionIndex + 1} of ${req.slideCount}): All slides in this series must share the IDENTICAL background color, header strip height, font treatment, and color-to-category assignments. Do NOT vary the base composition structure between slides — only the data values and chart content change.`
      : "";

  return `TASK: Generate a professional news-data infographic image.
${canvasGuide}
SLIDE: ${slideLabel}
${dataLine}

BRAND PARTNER: Feature "${req.brandTarget}" as a prominent callout box or labeled data source — visible immediately, not as small footnote text.

${themeGuide}

${layoutGuide}

${brandGuide}

${consistencyNote}

TECHNICAL REQUIREMENTS:
- Pure INFOGRAPHIC — structured data visualization only, NO photographs, NO scenes, NO people
- Apply the color theme to ALL elements: backgrounds, chart bars, text zones, dividers, icons
- Use the canvas and layout instructions as the structural skeleton — follow ratio adaptation rules exactly
- Populate charts, graphs, and callout boxes with realistic-looking numbers and statistics
- Typography hierarchy: large headline zone at top, data body zone in middle, source/brand zone at bottom
- Full-bleed, no borders, no watermarks, professional editorial publication quality

Generate a single stunning infographic that perfectly executes all of the above.`;
}
