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

  // Map RATIO_INFO apiSize values to dall-e-3 valid sizes
  const sizeMap: Record<string, string> = {
    "1024x1024": "1024x1024",
    "1024x1792": "1024x1792",
    "1792x1024": "1792x1024",
  };
  const dalleSize = sizeMap[size] ?? "1024x1024";

  let res: Response;
  try {
    res = await fetch(`${OPENROUTER_BASE}/images/generations`, {
      method: "POST",
      headers: getHeaders(),
      signal: abort.signal,
      body: JSON.stringify({
        model: "openai/dall-e-3",
        prompt,
        n: 1,
        size: dalleSize,
        response_format: "b64_json",
        quality: "hd",
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
    const preview = errText.startsWith("<!") ? "(HTML page returned — wrong endpoint or model not accessible)" : errText.slice(0, 400);
    throw new Error(`Image generation failed (${res.status}): ${preview}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const raw = await res.text();
  if (!contentType.includes("json")) {
    throw new Error(`Image generation returned non-JSON (${contentType}): ${raw.slice(0, 200)}`);
  }
  const data = JSON.parse(raw);

  const b64 = data.data?.[0]?.b64_json;
  if (b64) return b64;

  // Some providers return a URL instead of b64
  const url: string | undefined = data.data?.[0]?.url;
  if (url) {
    const imgRes = await fetch(url);
    const buf = await imgRes.arrayBuffer();
    return Buffer.from(buf).toString("base64");
  }

  throw new Error(`Image response contained no image data. Keys: ${Object.keys(data).join(", ")}`);
}
