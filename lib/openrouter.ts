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
  size: string
): Promise<string> {
  const res = await fetch(`${OPENROUTER_BASE}/images/generations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      model: "openai/gpt-5.4-image-2",
      prompt,
      n: 1,
      size,
      response_format: "b64_json",
      quality: "hd",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Image generation failed (${res.status}): ${errText}`);
  }

  const data = await res.json();

  if (!data.data?.[0]) {
    throw new Error("No image data returned from image model");
  }

  const imageItem = data.data[0];

  // Handle both b64_json and url response formats
  if (imageItem.b64_json) {
    return imageItem.b64_json;
  }

  if (imageItem.url) {
    const imgRes = await fetch(imageItem.url);
    if (!imgRes.ok) throw new Error("Failed to fetch generated image URL");
    const buffer = await imgRes.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  }

  throw new Error("Image response contained neither b64_json nor url");
}
