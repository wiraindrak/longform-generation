import type { GenerationRequest, InfographicTheme, InfographicLayout, MediaBrand } from "./types";

const THEME_VISUAL_GUIDE: Record<InfographicTheme, string> = {
  corporate: `COLOR THEME — CORPORATE BLUE:
Primary palette: Navy #1E3A5F (header bars, primary data), Sky blue #3B82F6 (charts, callout elements), Light blue #93C5FD (secondary data), Pure white #FFFFFF (background, text on dark), Light gray #F8FAFC (surface areas), Grid lines #E2E8F0.
Visual language: Professional, trustworthy, data-driven. Clean grid structure. Sharp rectangular data elements. Business publication quality. Every data element rendered in the navy–blue spectrum.`,

  "dark-neon": `COLOR THEME — DARK NEON:
Primary palette: Near-black #0F0F1A (background), Cyan #06B6D4 (primary data accent), Purple #A855F7 (secondary accent), Lime #84CC16 (tertiary accent), White #FFFFFF (headlines, labels), Dark navy #1a1a2e (section dividers).
Visual language: High-tech, bold, maximum contrast. Data visualization with a luminous/glowing quality. Digital dashboard aesthetic. Each data category gets its own neon accent color. Tech and gaming publication energy.`,

  "warm-bold": `COLOR THEME — WARM BOLD:
Primary palette: Warm off-white #FFF7ED (background), Orange #F97316 (primary data bars, callouts), Red #EF4444 (accent elements), Amber #F59E0B (highlights, tertiary data), Dark brown #1C1917 (text, headers), Light orange #FED7AA (dividers, backgrounds).
Visual language: Energetic, urgent, bold editorial feel. Thick header strips in orange. Impactful statistics. Indonesian news media energy. Strong typographic presence implied through visual hierarchy.`,

  "clean-white": `COLOR THEME — CLEAN MINIMAL:
Primary palette: Pure white #FFFFFF (dominant background), Light gray #F3F4F6 (surface areas, panel backgrounds), Medium gray #6B7280 (body text, secondary elements), Near-black #111827 (headlines, primary data), Slate #94A3B8 (grid lines, subtle borders).
Visual language: Swiss International Style. White space is a deliberate design element. Precise alignment. Minimal use of color — black and gray only with occasional single accent. High-end design publication quality. Data presented through outline and form rather than fill color.`,

  "vivid-pop": `COLOR THEME — VIVID POP:
Primary palette: Coral #FF6B6B (primary data category), Yellow #FFD93D (secondary category), Teal #4ECDC4 (tertiary category), Purple #6C63FF (quaternary category), White #FFFFFF (background), Dark #2D3436 (text, headers).
Visual language: Bright, flat, maximum visual energy. Each data category gets its own saturated color. Social media optimized composition. Modern flat design aesthetic. Bold section dividers in dark color. No gradients — solid fills only.`,

  editorial: `COLOR THEME — EDITORIAL MUTED:
Primary palette: Warm cream #F5F0E8 (background), Ochre #D4A853 (primary accent, headline bars), Sage green #7D9B6A (secondary accent), Dark brown #2D1F0E (headlines, primary text), Tan #B8966E (data elements, borders), Warm gray #C4B49A (dividers).
Visual language: Refined, warm, magazine-editorial quality. Print publication aesthetic. Natural, organic tone. Reminiscent of quality Indonesian print media like Tempo or Kompas. Suitable for cultural, lifestyle, and in-depth analysis content.`,

  midnight: `COLOR THEME — MIDNIGHT PREMIUM:
Primary palette: Near-black #0D1117 (background), Dark panel #161B22 (header strip, section dividers), Silver #8B949E (primary data bars, body text), Gold #FFD700 (accent — key statistic, tallest bar, most important callout), Pure white #FFFFFF (headlines), Deep gray #21262D (grid lines).
Visual language: Premium, authoritative, high-contrast dark editorial. Evokes financial publications and luxury brands. Silver and gold together signal prestige and precision. Use gold sparingly — only the single most important data element gets it.`,

  nature: `COLOR THEME — NATURE GREEN:
Primary palette: Light mint #F0F7EE (background), Forest green #2D6A4F (headers, primary data bars), Medium green #52B788 (secondary data), Sage #74C69D (tertiary accent), Light sage #B7E4C7 (dividers, borders), Dark forest #1B4332 (headlines, emphasis text).
Visual language: Organic, sustainable, earthy. Natural progression from deep forest green to soft sage. Suitable for environmental topics, agriculture, wellness, sustainability, and ESG content. Palette feels grown rather than designed.`,

  "bold-black": `COLOR THEME — BOLD BLACK:
Primary palette: Pure black #000000 (background — full coverage), White #FFFFFF (primary data bars, headlines, all text), Cyan #00E5FF (ONE vivid accent — the single most important element only), Dark charcoal #222222 (panel areas, subtle dividers).
Visual language: Maximum contrast, gallery-quality boldness. Every element is strictly black or white. Exactly one element (the hero statistic, top bar, or key callout) gets the cyan accent. The visual power comes entirely from this restraint. Luxury streetwear and editorial photography aesthetic.`,

  pastel: `COLOR THEME — PASTEL SOFT:
Primary palette: Near-white #FAFAFE (background), Soft blue #93C5FD (primary data), Lavender #C4B5FD (secondary data), Mint green #6EE7B7 (tertiary data), Soft purple #8B5CF6 (header, accent strip), Pale indigo #E0E7FF (dividers, borders).
Visual language: Gentle, approachable, friendly. Soft color reduces visual weight while maintaining clear data hierarchy. Suitable for lifestyle, education, wellness, consumer apps, and social media infographics where warmth matters more than authority.`,

  "rose-coral": `COLOR THEME — ROSE CORAL:
Primary palette: Soft rose-white #FFF5F7 (background), Deep rose #E11D48 (header strip, primary bars), Coral #FF6B6B (secondary data), Soft pink #F9A8D4 (tertiary elements), Peach border #FECDD3 (dividers), Dark neutral #1C1917 (text, labels).
Visual language: Warm, vibrant, lifestyle-forward. Deep rose creates strong editorial presence while coral and soft pink add warmth and approachability. Suitable for fashion, beauty, food, health, and social-media-first content in Indonesian lifestyle media.`,

  "mono-grid": `COLOR THEME — MONO GRID:
Primary palette: Pure white #FFFFFF (background), Near-black #111827 (filled bars, headlines), Medium gray #6B7280 (outlined bars, body text), Light gray #F3F4F6 (grid lines, panel backgrounds), Accent red #EF4444 (SINGLE highlight — ONE element only).
Visual language: Technical, architectural, Swiss grid precision. All data elements are either black-filled or white-outlined. Visible grid lines create structure. Exactly one element receives the red accent to mark the most important insight. Blueprint-meets-editorial design language.`,
};

const LAYOUT_VISUAL_GUIDE: Record<InfographicLayout, string> = {
  "data-chart": `LAYOUT TYPE — DATA VISUALIZATION:
Structure: Bar charts, line graphs, or pie/donut charts occupy 60% of the composition. Labeled axes with grid lines. Charts are the clear visual hero of every panel. Supporting text in compact zones around the chart.
Visual hierarchy: Chart area → Headline strip → Key statistic callout → Caption/source line.
Specific elements: Vertical or horizontal bar chart with 4-6 bars, legend, baseline axis. Optional: small donut chart as secondary element in corner. All data elements sized to be clearly readable.`,

  "key-stats": `LAYOUT TYPE — KEY STATISTICS:
Structure: 2-4 oversized statistics (percentages, numbers, monetary values) as the dominant design feature. Each number rendered at hero scale (visually 60-80pt weight). Each stat paired with a short 2-4 word label below it. Stats arranged in a clean grid.
Visual hierarchy: Hero statistic number → Stat label → Context headline → Brief supporting body text.
Specific elements: Rectangular stat cards arranged 2×1 or 2×2. Bold divider line separating cards. Large percentage or number value as the absolute focal point of each card.`,

  timeline: `LAYOUT TYPE — TIMELINE:
Structure: Chronological flow with 3-5 clearly marked time points (years, dates, or numbered stages). A visual spine line connecting all points — horizontal for landscape ratios, vertical for portrait. Each node: date label + event headline + 1-2 line description.
Visual hierarchy: Timeline spine → Date/milestone markers → Event headlines → Brief descriptions.
Specific elements: Circular or diamond node markers at each event point. Alternating text placement (above/below or left/right of spine). Directional arrow at end of timeline showing continuation.`,

  comparison: `LAYOUT TYPE — COMPARISON:
Structure: Two equal-width columns, clearly labeled (A vs B, Option 1 vs Option 2, Before vs After, etc.). Matching rows of data points that allow direct visual comparison. A verdict or summary callout at the bottom spanning both columns.
Visual hierarchy: Column headers (bold, contrasting color) → Comparative data rows → Highlight row for key differentiator → Summary callout.
Specific elements: Vertical dividing line between columns. Checkmarks or icons indicating advantages. Equal visual weight per column. Color tinting to distinguish columns.`,

  "step-process": `LAYOUT TYPE — STEP-BY-STEP PROCESS:
Structure: 3-6 numbered steps in sequential flow. Each step: large circle with step number + icon area + headline + 1-2 line description. Arrows or connecting lines flow from step to step.
Visual hierarchy: Step number (bold, prominent) → Step headline → Brief description → Connecting arrow to next step.
Specific elements: Numbered circles styled in primary theme color. Step cards with clear left-to-right or top-to-bottom reading flow. Final step visually emphasized as destination/goal. Progress connector line running through all steps.`,

  "fact-icons": `LAYOUT TYPE — FACT + ICON LIST:
Structure: 4-6 rows, each containing: a circular icon placeholder (representing the category), a bold fact headline (1 line), and 1-2 lines of supporting detail text. All rows aligned to a clean grid.
Visual hierarchy: Icon circle → Bold fact headline → Supporting detail text → Subtle row divider.
Specific elements: Icon circles in primary theme color, icon is implied through abstract circle fill. Each row separated by fine horizontal line. Alternating subtle background tints optional. Source credit at bottom.`,

  "ranked-list": `LAYOUT TYPE — RANKED LIST:
Structure: 3-8 items ranked vertically by value or importance. Each item has a bold rank number, a category label, and a horizontal bar proportional to its value. #1 is at the top with the longest bar. Values displayed at bar ends.
Visual hierarchy: Rank number (large, bold) → Item label → Proportional horizontal bar → Value at end.
Specific elements: Rank numbers in large bold type on the left column. Horizontal bars decrease in length from top to bottom. Top-ranked item bar uses the primary theme accent color; others use progressively lighter versions. Optional medal icons (gold/silver/bronze) for top 3. Source line at bottom.`,

  "magazine-cover": `LAYOUT TYPE — MAGAZINE COVER:
Structure: Full composition styled as a magazine cover. Bold branded header at very top. Large central visual/image zone occupies 55-65% of space. Dramatic headline overlay at the bottom third. 2-3 data callout pills or badges scattered around the headline.
Visual hierarchy: Brand header strip → Central visual hero zone → Headline (dominant scale) → Data callout badges → Issue identifier.
Specific elements: Header bar at top with brand name zone. Central area rendered as a rich textured or gradient visual field. Headline text zone at bottom with maximum typographic scale implied. "Data pill" badges (e.g., "+72%" or "3.2M readers") floating over the visual. Magazine grid proportions throughout.`,

  flowchart: `LAYOUT TYPE — FLOWCHART:
Structure: Top-to-bottom process diagram. Rounded rectangle start node at top. Rectangular process boxes connected by arrows. At least one diamond decision shape with YES/NO or A/B branches. Side branches loop or terminate. Rounded end node at bottom.
Visual hierarchy: Start → Process boxes → Decision diamond → Branch outcomes → End node.
Specific elements: Consistent box sizing with brief label zones inside each shape. Arrows clearly show directionality. Decision diamond has two labeled exit paths. YES branch continues primary flow; NO branch leads to alternative path. Colors differentiate flow paths. Start and end nodes are rounded/oval. All text zones are sized for short labels.`,

  "bubble-chart": `LAYOUT TYPE — BUBBLE CHART:
Structure: Multiple circles scattered across the composition where circle diameter is proportional to the data value. One dominant large bubble in the center or upper-left. 3-6 medium bubbles. 2-3 small bubbles. Bubbles may overlap slightly and are arranged organically.
Visual hierarchy: Largest bubble (hero data) → Medium bubbles → Small bubbles → Category labels on/beside each.
Specific elements: 5-8 bubbles total. Each bubble labeled with category name and numeric value centered inside. Bubble colors use the full theme palette — each category gets its own color. Largest bubble may have additional detail text. Legend optional. Overall composition feels organic and proportional.`,

  "pull-quote": `LAYOUT TYPE — PULL QUOTE:
Structure: One oversized hero statistic or statement dominates 50-60% of the composition at massive scale — the number or phrase should visually overwhelm the space. Brief label below the hero element. Two or three smaller supporting statistic cards below.
Visual hierarchy: Hero stat/quote (massive, fills the eye) → Brief label → 2-3 supporting stat cards → Source/attribution line.
Specific elements: The hero statistic rendered at extreme scale (e.g., "72%" occupies most of the width). A 2-4 word label directly below explains what the number means. Two smaller cards each containing their own metric + label arranged side-by-side below. Generous white space around the hero element amplifies its presence.`,

  "two-panel": `LAYOUT TYPE — TWO PANEL:
Structure: Composition split into two equal vertical halves by a clear visual divider (color shift, line, or white space gap). Left panel: one bold visual element — a bar chart, single large statistic, or icon + number. Right panel: structured data breakdown with 3-5 labeled rows or a secondary visualization.
Visual hierarchy: Left panel hero element → Divider → Right panel header → Right panel data rows → Footer.
Specific elements: Clear 50/50 vertical split. Left panel uses one strong visual — single bar chart, donut with percentage, or oversized number. Right panel has text + bar or text + icon rows. Both panels use the same color theme but with different visual treatments. A connecting element (shared color, arrow, or callout line) ties them together.`,
};

const BRAND_EDITORIAL_GUIDE: Record<MediaBrand, string> = {
  detikcom: `MEDIA BRAND — DETIKCOM:
Brand identity: Indonesia's #1 digital news brand. Bold red #E00000 and white. Mass market, fast-paced, impactful.
Integration: Include a red #E00000 header strip or brand bar. Bold headline zone. News-urgency visual energy. Brand color accents key statistics or callout boxes.`,

  "cnn-indonesia": `MEDIA BRAND — CNN INDONESIA:
Brand identity: International perspective, authoritative, balanced analysis. Deep CNN red and dark overlays.
Integration: CNN red accent strip in header or footer. Dark professional overlays on data sections. International data journalism production quality. Authoritative and trustworthy color language.`,

  "cnbc-indonesia": `MEDIA BRAND — CNBC INDONESIA:
Brand identity: Business and finance focused, data-driven, executive audience. Navy #003087 and gold #FFB800.
Integration: Navy #003087 header bar or frame element. Gold #FFB800 accent on key statistics. Financial data visualization aesthetic. Executive-level presentation quality. Market and business data emphasis.`,
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

export function buildImagePrompt(
  imagePromptFromStory: string,
  req: GenerationRequest,
  sectionIndex: number
): string {
  const themeGuide = THEME_VISUAL_GUIDE[req.colorTheme];
  const layoutGuide = LAYOUT_VISUAL_GUIDE[req.layout];
  const brandGuide = BRAND_EDITORIAL_GUIDE[req.mediaBrand];
  const slideLabel =
    req.slideCount === 1
      ? "single infographic"
      : `slide ${sectionIndex + 1} of ${req.slideCount}`;

  return `TASK: Generate a professional infographic image.

${themeGuide}

${layoutGuide}

${brandGuide}

CONTENT DIRECTION (${slideLabel}):
${imagePromptFromStory}

TECHNICAL REQUIREMENTS:
- This is an INFOGRAPHIC — structured data visualization, NOT a photograph or illustration
- Apply the specified color theme consistently to ALL elements: backgrounds, bars, text zones, dividers
- Apply the specified layout type as the structural skeleton of the entire composition
- Include realistic data visualization elements: charts with visible data, numbers, icons, callout boxes
- No photographic elements — pure graphic/typographic infographic design
- The brand partner "${req.brandTarget}" integrated naturally (data source attribution, featured brand callout, or contextual reference)
- Aspect ratio: ${req.ratio} — the infographic layout must be fully optimized for this format
- Full-bleed composition — no borders, frames, or watermarks
- Professional publication quality suitable for ${req.mediaBrand}

Generate a single stunning infographic that perfectly executes all of the above.`;
}
