const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

function getHeaders(): Record<string, string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY environment variable is not set");

  return {
    Authorization: `Bearer ${key}`,
    "HTTP-Referer":
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://longform-generation.up.railway.app",
    "X-Title": "Longform Content Generator",
    "Content-Type": "application/json",
  };
}

export async function generateStoryWithKimi(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      model: "moonshotai/kimi-k2.5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 6000,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Story generation failed (${res.status}): ${err}`);
  }

  const data = await res.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Unexpected response structure from story model");
  }

  return data.choices[0].message.content;
}

export async function generateImageWithGPT(
  prompt: string,
  size: string,
  ratio: string
): Promise<string> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 240_000); // 4-minute hard limit

  let res: Response;
  try {
    res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: getHeaders(),
      signal: abort.signal,
      body: JSON.stringify({
        model: "openai/gpt-5.4-image-2",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
        image_config: {
          aspect_ratio: ratio,
          image_size: "2K",
          quality: "high",
        },
      }),
    });
  } catch (e) {
    clearTimeout(timer);
    if ((e as Error).name === "AbortError") {
      throw new Error("Image generation timed out after 4 minutes");
    }
    throw e;
  }
  clearTimeout(timer);

  if (!res.ok) {
    const errText = await res.text();
    const preview = errText.startsWith("<!") ? "(HTML page returned — wrong endpoint or model not accessible)" : errText.slice(0, 300);
    throw new Error(`Image generation failed (${res.status}): ${preview}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const raw = await res.text();
  if (!contentType.includes("json")) {
    throw new Error(`Image generation returned non-JSON (${contentType}): ${raw.slice(0, 200)}`);
  }
  const data = JSON.parse(raw);

  const message = data.choices?.[0]?.message;
  if (!message) throw new Error("No message in image generation response");

  // OpenRouter returns images in message.images as data URLs
  if (message.images?.[0]?.image_url?.url) {
    const dataUrl: string = message.images[0].image_url.url;
    return dataUrl.split(",")[1] ?? dataUrl;
  }

  // Fallback: images may appear as image_url content blocks
  if (Array.isArray(message.content)) {
    const block = message.content.find(
      (c: { type: string }) => c.type === "image_url"
    );
    if (block?.image_url?.url) {
      const dataUrl: string = block.image_url.url;
      return dataUrl.split(",")[1] ?? dataUrl;
    }
  }

  throw new Error("Image response contained no image data");
}
