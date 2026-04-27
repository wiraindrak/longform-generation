import { NextRequest } from "next/server";
import {
  buildStorySystemPrompt,
  buildStoryUserPrompt,
  buildImagePrompt,
} from "@/lib/prompts";
import { generateStoryWithKimi, generateImageWithGPT } from "@/lib/openrouter";
import type {
  GenerationRequest,
  GeneratedStory,
  GeneratedImage,
  ProgressEvent,
  ImageRatio,
} from "@/lib/types";
import { RATIO_INFO } from "@/lib/types";

export const maxDuration = 300;

function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: ProgressEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          // stream may be closed
        }
      };

      try {
        const body: GenerationRequest = await req.json();
        const { topic, mediaBrand, brandTarget, ratio, slideCount, colorTheme, layout } = body;

        if (!topic?.trim()) throw new Error("Topic is required");
        if (!mediaBrand) throw new Error("Media brand is required");
        if (!brandTarget?.trim()) throw new Error("Brand target is required");
        if (!slideCount || ![1, 3, 5].includes(slideCount)) throw new Error("Invalid slide count");
        if (!colorTheme) throw new Error("Color theme is required");
        if (!layout) throw new Error("Layout is required");

        const sectionCount = slideCount;
        const totalSteps = 1 + sectionCount;
        let stepsDone = 0;

        // ── Step 1: Generate story ──────────────────────────────────────────
        send({ type: "progress", step: "story", message: "Researching topic and crafting infographic content…", percent: 5 });

        let storyRaw: string;
        try {
          storyRaw = await generateStoryWithKimi(buildStorySystemPrompt(), buildStoryUserPrompt(body));
        } catch (e) {
          throw new Error(`Story generation failed: ${(e as Error).message}`);
        }

        let story: GeneratedStory;
        try {
          story = JSON.parse(storyRaw);
        } catch {
          throw new Error("Story model returned malformed JSON. Please try again.");
        }

        if (!story.sections || story.sections.length === 0) {
          throw new Error("Story model returned no sections");
        }
        while (story.sections.length < sectionCount) {
          story.sections.push(story.sections[story.sections.length - 1]);
        }
        story.sections = story.sections.slice(0, sectionCount);

        stepsDone++;
        const progressAfterStory = Math.round((stepsDone / totalSteps) * 85) + 5;

        send({ type: "story_done", story });
        send({
          type: "progress",
          step: "story_done",
          message: `Story crafted. Generating ${sectionCount === 1 ? "infographic" : `${sectionCount} infographics`}…`,
          percent: progressAfterStory,
        });

        // ── Step 2+N: Generate images ───────────────────────────────────────
        const apiSize = RATIO_INFO[ratio as ImageRatio]?.apiSize ?? "1024x1024";
        const topicSlug = makeSlug(topic);

        for (let i = 0; i < sectionCount; i++) {
          const section = story.sections[i];
          const pctPerImage = (95 - progressAfterStory) / sectionCount;
          const currentPct = Math.round(progressAfterStory + i * pctPerImage);

          send({
            type: "progress",
            step: `image_${i}`,
            message: sectionCount === 1 ? "Generating infographic…" : `Generating slide ${i + 1} of ${sectionCount}…`,
            percent: currentPct,
          });

          let base64: string;
          try {
            base64 = await generateImageWithGPT(buildImagePrompt(section.imagePrompt, body, i), apiSize, ratio);
          } catch (e) {
            throw new Error(`Slide ${i + 1} generation failed: ${(e as Error).message}`);
          }

          const generatedImage: GeneratedImage = {
            index: i,
            sectionHeadline: section.headline,
            base64,
            filename: `${topicSlug}-${mediaBrand}-${layout}-slide-${i + 1}.png`,
          };

          send({ type: "image_done", image: generatedImage });
          stepsDone++;
        }

        send({ type: "progress", step: "finalizing", message: "Done!", percent: 100 });
        send({ type: "done" });
      } catch (err) {
        send({ type: "error", message: (err as Error).message ?? "An unexpected error occurred" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
