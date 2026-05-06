import { NextRequest } from "next/server";
import {
  buildStorySystemPrompt,
  buildStoryUserPrompt,
  buildImagePrompt,
} from "@/lib/prompts";
import { generateStoryWithKimi, generateImageWithGPT } from "@/lib/openrouter";
import { compositeLogos, apiSizeToDimensions } from "@/lib/composite";
import type {
  GenerationRequest,
  GeneratedStory,
  GeneratedImage,
  ProgressEvent,
  ImageRatio,
} from "@/lib/types";
import { RATIO_INFO, QUALITY_CONFIG } from "@/lib/types";

// 800s = ~13 min. Covers 5 slides × 2-4 min each with margin.
// (Previous 300s limit caused slide 3 termination on 3-slide requests.)
export const maxDuration = 800;

function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function ts(): string {
  return new Date().toISOString();
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const requestStart = Date.now();

  const stream = new ReadableStream({
    async start(controller) {
      let streamClosed = false;

      const send = (event: ProgressEvent) => {
        if (streamClosed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          console.log(`[sse] ${ts()} type=${event.type}${event.type === "progress" ? ` step=${event.step} pct=${event.percent}` : ""}${event.type === "image_done" ? ` idx=${event.image.index}` : ""}${event.type === "slide_error" ? ` idx=${event.index}` : ""}`);
        } catch {
          streamClosed = true;
          console.warn(`[sse] ${ts()} stream closed — further events suppressed`);
        }
      };

      // Keepalive fires every 10s to prevent proxy idle-timeout.
      const keepAlive = setInterval(() => {
        if (streamClosed) {
          clearInterval(keepAlive);
          return;
        }
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
          console.log(`[keepalive] ${ts()} elapsed=${Math.round((Date.now() - requestStart) / 1000)}s`);
        } catch {
          streamClosed = true;
          console.warn(`[keepalive] ${ts()} stream closed by keepalive write — aborting`);
          clearInterval(keepAlive);
        }
      }, 10_000);

      try {
        const body: GenerationRequest = await req.json();
        const { topic, mediaBrand, brandTarget, ratio, slideCount, colorTheme, layout, quality, logoId } = body;

        if (!topic?.trim()) throw new Error("Topic is required");
        if (!mediaBrand) throw new Error("Media brand is required");
        if (!brandTarget?.trim()) throw new Error("Brand target is required");
        if (!slideCount || ![1, 3, 5].includes(slideCount)) throw new Error("Invalid slide count");
        if (!colorTheme) throw new Error("Color theme is required");
        if (!layout) throw new Error("Layout is required");

        const qualityPreset = quality ?? "standard";
        const { apiQuality } = QUALITY_CONFIG[qualityPreset as keyof typeof QUALITY_CONFIG] ?? QUALITY_CONFIG.standard;

        console.log(`[request] ${ts()} topic="${topic}" brand="${brandTarget}" mediaBrand=${mediaBrand} slides=${slideCount} ratio=${ratio} theme=${colorTheme} layout=${layout} quality=${qualityPreset} logoId=${logoId ?? "none"}`);

        const sectionCount = slideCount;
        const totalSteps = 1 + sectionCount;
        let stepsDone = 0;

        // ── Step 1: Generate story ──────────────────────────────────────────
        send({ type: "progress", step: "story", message: "Researching topic and crafting infographic content…", percent: 5 });

        const storyStart = Date.now();
        let storyRaw: string;
        try {
          storyRaw = await generateStoryWithKimi(buildStorySystemPrompt(), buildStoryUserPrompt(body));
        } catch (e) {
          throw new Error(`Story generation failed: ${(e as Error).message}`);
        }
        console.log(`[story] ${ts()} completed in ${Math.round((Date.now() - storyStart) / 1000)}s rawLen=${storyRaw.length}`);

        let story: GeneratedStory;
        try {
          const jsonText = (() => {
            const fenced = storyRaw.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (fenced) return fenced[1].trim();
            const start = storyRaw.indexOf("{");
            const end = storyRaw.lastIndexOf("}");
            if (start !== -1 && end > start) return storyRaw.slice(start, end + 1);
            return storyRaw.trim();
          })();
          story = JSON.parse(jsonText);
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
        const { w: imgW, h: imgH } = apiSizeToDimensions(apiSize);
        const topicSlug = makeSlug(topic);

        let anyImageSucceeded = false;
        try {
          for (let i = 0; i < sectionCount; i++) {
            // Abort if client disconnected (stream closed by proxy or maxDuration)
            if (streamClosed) {
              console.warn(`[generate] ${ts()} stream closed before slide ${i + 1} — aborting loop`);
              break;
            }

            const section = story.sections[i];
            const pctPerImage = (95 - progressAfterStory) / sectionCount;
            const currentPct = Math.round(progressAfterStory + i * pctPerImage);

            const mem = process.memoryUsage();
            console.log(`[slide-start] ${ts()} slide=${i + 1}/${sectionCount} pct=${currentPct} elapsed=${Math.round((Date.now() - requestStart) / 1000)}s rss=${Math.round(mem.rss / 1024 / 1024)}MB heap=${Math.round(mem.heapUsed / 1024 / 1024)}MB`);

            send({
              type: "progress",
              step: `image_${i}`,
              message: sectionCount === 1 ? "Generating infographic…" : `Generating slide ${i + 1} of ${sectionCount}…`,
              percent: currentPct,
            });

            const slideStart = Date.now();
            let base64: string;
            try {
              base64 = await generateImageWithGPT(buildImagePrompt(section, body, i, story.visualDNA), apiSize, ratio, apiQuality);
              console.log(`[slide-done] ${ts()} slide=${i + 1} elapsed=${Math.round((Date.now() - slideStart) / 1000)}s base64len=${base64.length}`);
            } catch (e) {
              const slideMsg = (e as Error).message;
              console.error(`[slide-error] ${ts()} slide=${i + 1} elapsed=${Math.round((Date.now() - slideStart) / 1000)}s err="${slideMsg}"`);
              send({ type: "slide_error", index: i, message: slideMsg });
              stepsDone++;
              continue;
            }

            // Post-composite media brand + partner logos
            const compositeStart = Date.now();
            try {
              base64 = await compositeLogos(base64, mediaBrand, brandTarget, imgW, imgH, layout, logoId);
              console.log(`[composite] ${ts()} slide=${i + 1} elapsed=${Math.round((Date.now() - compositeStart) / 1000)}s`);
            } catch (e) {
              console.warn(`[composite] ${ts()} slide=${i + 1} failed — using unmodified image:`, (e as Error).message);
            }

            const generatedImage: GeneratedImage = {
              index: i,
              sectionHeadline: section.headline,
              base64,
              filename: `${topicSlug}-${mediaBrand}-${layout}-slide-${i + 1}.png`,
            };

            send({ type: "image_done", image: generatedImage });
            anyImageSucceeded = true;
            stepsDone++;
          }
        } finally {
          clearInterval(keepAlive);
        }

        if (!anyImageSucceeded && sectionCount > 0 && !streamClosed) {
          throw new Error("All slides failed to generate. Check your topic or brand name and try again.");
        }

        send({ type: "progress", step: "finalizing", message: "Done!", percent: 100 });
        send({ type: "done" });

        console.log(`[request-done] ${ts()} total=${Math.round((Date.now() - requestStart) / 1000)}s succeeded=${anyImageSucceeded}`);
      } catch (err) {
        const msg = (err as Error).message ?? "An unexpected error occurred";
        console.error(`[generate-error] ${ts()} elapsed=${Math.round((Date.now() - requestStart) / 1000)}s err="${msg}"`);
        send({ type: "error", message: msg });
      } finally {
        clearInterval(keepAlive);
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
