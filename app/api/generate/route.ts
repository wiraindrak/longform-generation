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

export const maxDuration = 300; // 5 min — Railway supports this

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
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          );
        } catch {
          // stream may be closed
        }
      };

      try {
        const body: GenerationRequest = await req.json();
        const { topic, mediaBrand, brandTarget, ratio, outputType, style } =
          body;

        // Validate
        if (!topic?.trim()) throw new Error("Topic is required");
        if (!mediaBrand) throw new Error("Media brand is required");
        if (!brandTarget?.trim()) throw new Error("Brand target is required");

        const sectionCount = outputType === "three-slide" ? 3 : 1;
        const totalSteps = 1 + sectionCount; // 1 story + N images
        let stepsDone = 0;

        // ── Step 1: Generate story ──────────────────────────────────────────
        send({
          type: "progress",
          step: "story",
          message: "Researching your topic and crafting the story…",
          percent: 5,
        });

        const systemPrompt = buildStorySystemPrompt();
        const userPrompt = buildStoryUserPrompt(body);

        let storyRaw: string;
        try {
          storyRaw = await generateStoryWithKimi(systemPrompt, userPrompt);
        } catch (e) {
          throw new Error(`Story generation failed: ${(e as Error).message}`);
        }

        let story: GeneratedStory;
        try {
          story = JSON.parse(storyRaw);
        } catch {
          throw new Error(
            "Story model returned malformed JSON. Please try again."
          );
        }

        // Ensure we have the right number of sections
        if (!story.sections || story.sections.length === 0) {
          throw new Error("Story model returned no sections");
        }
        if (story.sections.length < sectionCount) {
          // Duplicate last section to fill if model returned fewer
          while (story.sections.length < sectionCount) {
            story.sections.push(story.sections[story.sections.length - 1]);
          }
        }
        story.sections = story.sections.slice(0, sectionCount);

        stepsDone++;
        const progressAfterStory = Math.round((stepsDone / totalSteps) * 85) + 5;

        send({ type: "story_done", story });
        send({
          type: "progress",
          step: "story_done",
          message: `Story crafted. Generating ${sectionCount === 1 ? "image" : `${sectionCount} images`}…`,
          percent: progressAfterStory,
        });

        // ── Step 2+N: Generate images ───────────────────────────────────────
        const apiSize =
          RATIO_INFO[ratio as ImageRatio]?.apiSize ?? "1024x1024";
        const topicSlug = makeSlug(topic);

        for (let i = 0; i < sectionCount; i++) {
          const section = story.sections[i];
          const imageProgressBase = progressAfterStory;
          const imageProgressEnd = 95;
          const pctPerImage = (imageProgressEnd - imageProgressBase) / sectionCount;
          const currentPct = Math.round(imageProgressBase + i * pctPerImage);

          send({
            type: "progress",
            step: `image_${i}`,
            message:
              sectionCount === 1
                ? "Generating your image…"
                : `Generating image ${i + 1} of ${sectionCount}…`,
            percent: currentPct,
          });

          const imgPrompt = buildImagePrompt(section.imagePrompt, body, i);

          let base64: string;
          try {
            base64 = await generateImageWithGPT(imgPrompt, apiSize);
          } catch (e) {
            throw new Error(
              `Image ${i + 1} generation failed: ${(e as Error).message}`
            );
          }

          const generatedImage: GeneratedImage = {
            index: i,
            sectionHeadline: section.headline,
            base64,
            filename: `${topicSlug}-${mediaBrand}-slide-${i + 1}.png`,
          };

          send({ type: "image_done", image: generatedImage });
          stepsDone++;
        }

        send({
          type: "progress",
          step: "finalizing",
          message: "Done!",
          percent: 100,
        });
        send({ type: "done" });
      } catch (err) {
        send({
          type: "error",
          message: (err as Error).message ?? "An unexpected error occurred",
        });
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
      "X-Accel-Buffering": "no", // Disable nginx buffering (Railway uses nginx)
    },
  });
}
