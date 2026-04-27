import { NextRequest } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const brand = req.nextUrl.searchParams.get("brand");
    const { rows } = await query(
      brand
        ? `SELECT id, topic, media_brand, brand_target, ratio, output_type, style,
                  main_headline, language, thumbnail, created_at,
                  jsonb_array_length(images) AS image_count
           FROM generations WHERE media_brand = $1
           ORDER BY created_at DESC LIMIT 200`
        : `SELECT id, topic, media_brand, brand_target, ratio, output_type, style,
                  main_headline, language, thumbnail, created_at,
                  jsonb_array_length(images) AS image_count
           FROM generations
           ORDER BY created_at DESC LIMIT 200`,
      brand ? [brand] : []
    );
    return Response.json({ generations: rows });
  } catch (err) {
    console.error("GET /api/archive error:", err);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic,
      mediaBrand,
      brandTarget,
      ratio,
      slideCount,
      colorTheme,
      layout,
      story,
      images,
      thumbnail,
    } = body;

    // Store layout in output_type column, colorTheme in style column for DB compatibility
    const { rows } = await query(
      `INSERT INTO generations
         (topic, media_brand, brand_target, ratio, output_type, style,
          main_headline, language, story_sections, images, thumbnail)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11)
       RETURNING id, created_at`,
      [
        topic,
        mediaBrand,
        brandTarget,
        ratio,
        layout ?? "data-chart",
        colorTheme ?? "corporate",
        story.mainHeadline ?? null,
        story.language ?? null,
        JSON.stringify(story.sections ?? []),
        JSON.stringify(images ?? []),
        thumbnail ?? null,
      ]
    );

    return Response.json({ id: rows[0].id, createdAt: rows[0].created_at });
  } catch (err) {
    console.error("POST /api/archive error:", err);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
