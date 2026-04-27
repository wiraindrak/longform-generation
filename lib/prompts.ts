import type { GenerationRequest, ImageStyle, MediaBrand } from "./types";

const STYLE_VISUAL_GUIDE: Record<ImageStyle, string> = {
  realistic: `VISUAL STYLE — PHOTOJOURNALISTIC REALISM:
Create a photorealistic, documentary-style photograph. Requirements:
- Natural or available lighting, authentic real-world settings
- Professional DSLR/medium-format camera quality with sharp focus
- Candid or carefully staged but always believably authentic composition
- Rich professional color grading, deep shadows, accurate skin tones
- Cinematic depth of field appropriate for the subject
- Quality benchmark: Reuters, Associated Press, National Geographic photography`,

  typography: `VISUAL STYLE — TYPOGRAPHY-DRIVEN DESIGN:
Create a bold typographic artwork where text is the primary visual element. Requirements:
- Oversized commanding headline typography as the absolute hero element (even though you can't add real text, simulate the visual weight and layout where text would dominate)
- Stark contrast between typographic areas and minimal background elements
- Geometric color blocks or minimal photographic fragments as supporting elements
- Magazine cover typography layout proportions
- Quality benchmark: Wired Magazine covers, NYT Magazine spreads, Pentagram studio work`,

  editorial: `VISUAL STYLE — EDITORIAL MAGAZINE:
Create a glossy, high-end editorial magazine-quality image. Requirements:
- Professional lifestyle or news photography with deliberate, controlled composition
- Studio or location lighting that feels aspirational and polished
- Clear designated zones for headline and text overlays (do not add actual text)
- Color palette that feels curated and magazine-ready
- Models or subjects styled to perfection if people are present
- Quality benchmark: Time Magazine, Vogue, Tempo Indonesia, Bloomberg Businessweek covers`,

  cinematic: `VISUAL STYLE — CINEMATIC DRAMA:
Create a dramatic, cinematic image with movie-poster quality. Requirements:
- Epic composition with strong foreground/midground/background depth
- Dramatic directional lighting with deep shadows and warm or cool highlights
- Film-quality color grade: teal-orange, desaturated cool, or rich warm tones
- Anamorphic or wide lens visual quality, slight lens flare acceptable
- Emotional gravitas in every element of the frame
- Quality benchmark: Christopher Nolan, Denis Villeneuve, or epic Hollywood poster aesthetics`,

  illustrated: `VISUAL STYLE — MODERN FLAT ILLUSTRATION:
Create a contemporary flat or semi-flat digital illustration. Requirements:
- Clean vector-art quality with geometric shapes and deliberate color palette
- Modern illustration style with bold outlines or clean fills
- Character illustration, scene building, or abstract geometric composition
- Maximum 5-7 color palette, harmonious and brand-appropriate
- Scalable, modern digital illustration feel
- Quality benchmark: Spotify campaign art, Airbnb illustrations, Medium.com feature images`,

  infographic: `VISUAL STYLE — DATA INFOGRAPHIC:
Create a data visualization and infographic-style visual composition. Requirements:
- Charts, graphs, data points, and icons as primary visual elements
- Clean grid-based layout with strong information hierarchy
- Color-coded data categories with professional palette
- Icon systems, percentage circles, bar charts, line graphs integrated naturally
- Numbers and data as visual focal points (simulate with abstract data visuals)
- Quality benchmark: Bloomberg data graphics, The Economist charts, FiveThirtyEight visuals`,

  "dark-dramatic": `VISUAL STYLE — DARK DRAMATIC:
Create a high-contrast dark-themed image with intense atmospheric mood. Requirements:
- Near-black or deep dark background as the dominant canvas
- Vibrant neon, metallic, or saturated accent colors for key focal elements
- Dramatic rim lighting, colored gels, or atmospheric light sources
- Mysterious, powerful, or futuristic mood
- High contrast ratio between darks and highlights
- Quality benchmark: Gaming brand campaigns, dark editorial fashion photography, cyberpunk aesthetics`,

  "clean-minimal": `VISUAL STYLE — CLEAN MINIMAL:
Create a minimalist image with white space as a primary design element. Requirements:
- Predominantly white, light gray, or very light background
- Single or very few focal elements with generous breathing room
- Precise geometric composition, perfect alignment
- Swiss International Style design principles
- Muted, refined color palette — one accent color maximum
- Quality benchmark: Apple product photography, Muji brand aesthetic, Swiss graphic design posters`,

  "vintage-press": `VISUAL STYLE — VINTAGE PRESS:
Create a vintage newspaper or historical print media aesthetic. Requirements:
- Aged paper or worn surface texture, authentic grain and noise
- Sepia-toned, monochrome, or very limited 2-3 color palette
- Halftone printing simulation, ink bleed artifacts
- Retro typographic layout references without actual text
- Historical documentary or archival photography feel
- Quality benchmark: LIFE Magazine 1950s-60s archives, vintage propaganda posters, old broadsheet photography`,

  "vibrant-gradient": `VISUAL STYLE — VIBRANT GRADIENT:
Create a bold, contemporary gradient-based artwork with maximum visual energy. Requirements:
- Rich, flowing, dynamic color gradients as the primary visual language
- Contemporary digital art sensibility with maximum color saturation
- Abstract or semi-abstract composition with gradient as atmosphere
- Energetic, optimistic, modern brand advertising quality
- Layered gradients with depth and dimensional feel
- Quality benchmark: Spotify playlist art, Instagram campaign visuals, modern brand identity campaigns`,
};

const BRAND_EDITORIAL_GUIDE: Record<MediaBrand, string> = {
  detikcom: `MEDIA BRAND — DETIKCOM:
Editorial voice: Fast-paced, urgent, informative, accessible to mass Indonesian audience.
Visual aesthetic: Bold red (#E00000) and white color palette. Direct and impactful visual storytelling. Breaking news energy with clarity.
Brand placement: Include detikcom's red color prominently. Clean, news-appropriate composition without clutter.`,

  "cnn-indonesia": `MEDIA BRAND — CNN INDONESIA:
Editorial voice: International perspective, balanced, sophisticated analysis, authoritative global outlook.
Visual aesthetic: Deep red and dark overlay palette. CNN's authoritative and trustworthy visual language. Professional, measured, and credible.
Brand placement: CNN's red brand color as an accent. Dark overlays with strong contrast. International news production quality.`,

  "cnbc-indonesia": `MEDIA BRAND — CNBC INDONESIA:
Editorial voice: Business-focused, data-driven, financial markets perspective, executive and professional audience.
Visual aesthetic: Navy blue (#003087) and gold/yellow accent palette. Financial and business aesthetic. Data-driven and authoritative visual tone.
Brand placement: Navy and gold color accents. Business professional setting or financial imagery. Executive-level production quality.`,
};

export function buildStorySystemPrompt(): string {
  return `You are a senior editorial content director and investigative journalist with expertise in Indonesian media. You create compelling, well-researched long-form visual content for major Indonesian media outlets.

Your story crafting must:
1. Be deeply researched and factually grounded (or compellingly creative if the topic is fictional/conceptual)
2. Match the specific media brand's editorial voice and visual identity
3. Naturally and elegantly integrate the brand partner without feeling like advertising
4. Generate vivid, cinematically specific image prompts that will produce stunning visuals
5. Write in the same language as the topic (Bahasa Indonesia if topic is in Indonesian, English if in English)

CRITICAL: Respond ONLY with valid JSON matching the exact schema. No markdown, no extra text.`;
}

export function buildStoryUserPrompt(req: GenerationRequest): string {
  const sectionCount = req.outputType === "single" ? 1 : 3;
  const mediaBrandMap: Record<MediaBrand, string> = {
    detikcom: "detikcom",
    "cnn-indonesia": "CNN Indonesia",
    "cnbc-indonesia": "CNBC Indonesia",
  };
  const styleMap: Record<string, string> = {
    realistic: "Photojournalistic Realism",
    typography: "Typography-Driven Design",
    editorial: "Editorial Magazine",
    cinematic: "Cinematic Drama",
    illustrated: "Flat Illustration",
    infographic: "Data Infographic",
    "dark-dramatic": "Dark Dramatic",
    "clean-minimal": "Clean Minimal",
    "vintage-press": "Vintage Press",
    "vibrant-gradient": "Vibrant Gradient",
  };

  return `Create compelling long-form visual content for:

TOPIC/MOMENT: ${req.topic}
MEDIA BRAND: ${mediaBrandMap[req.mediaBrand]}
BRAND PARTNER: ${req.brandTarget}
NUMBER OF SECTIONS: ${sectionCount}
VISUAL STYLE: ${styleMap[req.style]}
IMAGE RATIO: ${req.ratio}

REQUIREMENTS:
- Research the topic thoroughly and find the most compelling narrative angle
- The brand partner "${req.brandTarget}" must be woven naturally into the story content
- Each imagePrompt must be 200-300 words of highly specific visual description
- Image prompts must describe EXACTLY what to render for a ${styleMap[req.style]} visual
- Include specific colors, lighting, composition, mood, subjects, and atmosphere in each image prompt
- The image prompt should reference the ${mediaBrandMap[req.mediaBrand]} visual identity
- Image prompt should naturally include "${req.brandTarget}" brand elements (product, logo placement, brand colors, or brand context)
- Optimize composition descriptions for ${req.ratio} aspect ratio

Respond with ONLY this JSON structure (no extra text):
{
  "mainHeadline": "Compelling main headline in the topic's language",
  "language": "id or en",
  "sections": [
    {
      "headline": "Section headline",
      "subheadline": "Engaging subheadline or deck copy (1-2 sentences)",
      "body": "300-500 word editorial body copy for this section. Well-researched, engaging, journalistic quality.",
      "imagePrompt": "200-300 word hyper-specific visual description for the image generator covering: exact scene, subjects, lighting, colors, mood, composition, style markers, brand integration, and ratio-optimized framing."
    }
  ]
}`;
}

export function buildImagePrompt(
  imagePromptFromStory: string,
  req: GenerationRequest,
  sectionIndex: number
): string {
  const styleGuide = STYLE_VISUAL_GUIDE[req.style];
  const brandGuide = BRAND_EDITORIAL_GUIDE[req.mediaBrand];
  const sectionLabel =
    req.outputType === "single"
      ? "single hero image"
      : `slide ${sectionIndex + 1} of 3`;

  return `${styleGuide}

${brandGuide}

CONTENT DIRECTION (${sectionLabel}):
${imagePromptFromStory}

TECHNICAL REQUIREMENTS:
- Ultra high-resolution, professional production quality
- No visible text, watermarks, or UI elements in the image
- No borders or frames — full bleed composition
- Optimized for ${req.ratio} aspect ratio with subject placement appropriate to ratio
- Suitable for professional publication at ${req.ratio} format
- The brand partner "${req.brandTarget}" should appear naturally integrated (product visible, brand colors present, or contextually referenced) without feeling forced

Generate a single stunning image that perfectly executes all of the above.`;
}
