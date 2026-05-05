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
  _ratio: string
): Promise<string> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 240_000); // 4-minute hard limit

  // Map apiSize → FLUX aspect_ratio and width/height
  const sizeConfig: Record<string, { aspect_ratio: string; width: number; height: number }> = {
    "1024x1024": { aspect_ratio: "1:1",  width: 1024, height: 1024 },
    "1024x1792": { aspect_ratio: "9:16", width: 1024, height: 1792 },
    "1792x1024": { aspect_ratio: "16:9", width: 1792, height: 1024 },
  };
  const cfg = sizeConfig[size] ?? sizeConfig["1024x1024"];

  let res: Response;
  try {
    res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: getHeaders(),
      signal: abort.signal,
      body: JSON.stringify({
        model: "black-forest-labs/flux-1.1-pro",
        messages: [{ role: "user", content: prompt }],
        // FLUX image-size params passed at top level (OpenRouter forwards them)
        width: cfg.width,
        height: cfg.height,
        aspect_ratio: cfg.aspect_ratio,
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
    const preview = errText.startsWith("<!") ? "(HTML error page — endpoint or model not accessible)" : errText.slice(0, 400);
    throw new Error(`Image generation failed (${res.status}): ${preview}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const raw = await res.text();
  if (!contentType.includes("json")) {
    throw new Error(`Image generation returned non-JSON (${contentType}): ${raw.slice(0, 200)}`);
  }
  const data = JSON.parse(raw);

  const message = data.choices?.[0]?.message;
  if (!message) {
    throw new Error(`No message in image response. Top-level keys: ${Object.keys(data).join(", ")}`);
  }

  // FLUX via OpenRouter returns image as an image_url block in content array
  if (Array.isArray(message.content)) {
    const block = message.content.find((c: { type: string }) => c.type === "image_url");
    if (block?.image_url?.url) {
      return await urlOrDataToBase64(block.image_url.url);
    }
  }

  // Some models return content as a string (URL or data URL)
  if (typeof message.content === "string") {
    const c = message.content.trim();
    if (c.startsWith("data:")) return c.split(",")[1] ?? c;
    if (c.startsWith("http")) return await urlOrDataToBase64(c);
  }

  throw new Error(`Image response contained no image data. Message keys: ${Object.keys(message).join(", ")}`);
}

async function urlOrDataToBase64(urlOrData: string): Promise<string> {
  if (urlOrData.startsWith("data:")) {
    return urlOrData.split(",")[1] ?? urlOrData;
  }
  const res = await fetch(urlOrData);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf).toString("base64");
}
