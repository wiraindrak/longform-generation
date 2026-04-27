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
  };
  const themeMap: Record<InfographicTheme, string> = {
    corporate: "Corporate Blue",
    "dark-neon": "Dark Neon",
    "warm-bold": "Warm Bold",
    "clean-white": "Clean Minimal",
    "vivid-pop": "Vivid Pop",
    editorial: "Editorial Muted",
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
