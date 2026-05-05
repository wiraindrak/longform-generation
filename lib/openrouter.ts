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
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
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
    const preview = errText.startsWith("<!") ? "(HTML error page — wrong endpoint)" : errText.slice(0, 400);
    throw new Error(`Image generation failed (${res.status}): ${preview}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const raw = await res.text();
  if (!contentType.includes("json")) {
    throw new Error(`Image generation returned non-JSON (${contentType}): ${raw.slice(0, 200)}`);
  }
  const data = JSON.parse(raw);

  // Some providers return HTTP 200 with an error body
  if (data.error) {
    throw new Error(`Image generation API error: ${JSON.stringify(data.error).slice(0, 400)}`);
  }

  // ── Try every known response shape ───────────────────────────────────────

  // Shape 1: choices[0].message.images[0].image_url.url  (OpenRouter native)
  const imgUrl1 = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (imgUrl1) return await urlOrDataToBase64(imgUrl1);

  // Shape 2: choices[0].message.content[] image_url block
  const content = data.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    const block = content.find((c: { type: string }) => c.type === "image_url");
    if (block?.image_url?.url) return await urlOrDataToBase64(block.image_url.url);
  }

  // Shape 3: choices[0].message.content as string (URL or data URL)
  if (typeof content === "string") {
    const c = content.trim();
    if (c.startsWith("data:")) return c.split(",")[1] ?? c;
    if (c.startsWith("http")) return await urlOrDataToBase64(c);
  }

  // Shape 4: top-level data[].b64_json  (OpenAI images endpoint compat)
  const b64 = data.data?.[0]?.b64_json;
  if (b64) return b64;

  // Shape 5: top-level data[].url
  const urlFallback: string | undefined = data.data?.[0]?.url;
  if (urlFallback) return await urlOrDataToBase64(urlFallback);

  // Nothing matched — dump structure for debugging
  const topKeys = Object.keys(data).join(", ");
  const msgKeys = data.choices?.[0]?.message ? Object.keys(data.choices[0].message).join(", ") : "no message";
  throw new Error(`Image response has no image data. top=${topKeys} | msg=${msgKeys} | raw=${raw.slice(0, 300)}`);
}

async function urlOrDataToBase64(urlOrData: string): Promise<string> {
  if (urlOrData.startsWith("data:")) {
    return urlOrData.split(",")[1] ?? urlOrData;
  }
  const res = await fetch(urlOrData);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf).toString("base64");
}
