# LONGFORM — AI Visual Content Generator

Generate publication-ready long-form visual content for Indonesian media brands in seconds. Powered by **Moonshot Kimi K2.5** (story + research) and **OpenAI GPT 5.4 Image** via OpenRouter.

**Live demo:** https://longform-generation.up.railway.app (after deployment)  
**GitHub:** https://github.com/wiraindrak/longform-generation

---

## Features

- **3 Media Brands** — detikcom, CNN Indonesia, CNBC Indonesia with tuned editorial voices
- **10 Visual Styles** — Realistic, Typography, Editorial Magazine, Cinematic Drama, Flat Illustration, Data Infographic, Dark Dramatic, Clean Minimal, Vintage Press, Vibrant Gradient
- **5 Aspect Ratios** — 1:1, 4:5, 9:16, 16:9, 3:4
- **1 or 3-slide output** — Single hero image or full 3-slide story sequence
- **Real-time streaming** — SSE progress updates so you see the story and each image as they complete
- **One-click PNG download** — Full-res PNG per image, no compression

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS 3 |
| Story/Research | `moonshotai/kimi-k2.5` via OpenRouter |
| Image Generation | `openai/gpt-5.4-image-2` via OpenRouter |
| Deployment | Railway |
| Streaming | Server-Sent Events (SSE) |

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/wiraindrak/longform-generation.git
cd longform-generation
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Get your OpenRouter API key at: https://openrouter.ai/keys

### 3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Railway

### Option A: Deploy from GitHub (Recommended)

1. Go to [railway.app](https://railway.app) → **New Project**
2. Select **Deploy from GitHub repo**
3. Connect your GitHub account and select `wiraindrak/longform-generation`
4. Railway auto-detects Next.js and configures the build

### Option B: Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Environment Variables in Railway

In your Railway project dashboard → **Variables**, add:

| Variable | Value |
|----------|-------|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` |
| `NEXT_PUBLIC_SITE_URL` | Your Railway public URL (e.g. `https://longform-generation.up.railway.app`) |

Railway auto-sets `PORT` and `NODE_ENV=production`.

### Railway Settings

The `railway.toml` in this repo already configures:
- Builder: Nixpacks (auto Node.js detection)
- Start command: `npm start`
- Health check: `/`
- Restart policy: On failure, max 10 retries

---

## How It Works

```
User Input
    │
    ▼
┌─────────────────────────────────────────────────┐
│  POST /api/generate  (SSE streaming)             │
│                                                  │
│  1. Build story prompt from inputs               │
│  2. Call Kimi K2.5 → JSON story + image prompts │
│  3. For each section (1 or 3):                  │
│     - Build detailed image prompt                │
│     - Call GPT 5.4 Image → base64 PNG           │
│     - Stream image to client as SSE event        │
└─────────────────────────────────────────────────┘
    │
    ▼
PNG images (downloadable) + Editorial story text
```

### Prompt Architecture

**Story Prompt (→ Kimi K2.5):**
- System: Senior editorial director persona with Indonesian media expertise
- User: Topic + Media Brand + Brand Partner + Section count + Visual Style
- Output: JSON with `mainHeadline`, `language`, and `sections[]` each containing `headline`, `subheadline`, `body`, `imagePrompt`

**Image Prompt (→ GPT 5.4 Image):**
- Style visual guide (200-word style specification per style)
- Media brand visual identity guide (colors, tone, composition)
- Section's `imagePrompt` from Kimi K2.5 (the "content direction")
- Technical requirements (ratio, no text, no watermarks, brand integration)

---

## Project Structure

```
longform-generation/
├── app/
│   ├── api/generate/route.ts   # SSE streaming generation endpoint
│   ├── globals.css             # Tailwind base + custom animations
│   ├── layout.tsx              # Root layout with Inter font
│   └── page.tsx                # Full UI — form + results
├── lib/
│   ├── types.ts                # All TypeScript types + display configs
│   ├── prompts.ts              # Prompt engineering for both models
│   └── openrouter.ts           # OpenRouter API client
├── railway.toml                # Railway deployment config
├── next.config.ts              # Next.js config
└── .env.example                # Environment variables template
```

---

## Known Limitations & Notes

- **Model availability:** `openai/gpt-5.4-image-2` must be available on OpenRouter. If not, check https://openrouter.ai/models and update the model ID in `lib/openrouter.ts` line with `model: "openai/gpt-5.4-image-2"`.
- **API sizes:** The image API sizes supported are `1024x1024`, `1792x1024`, `1024x1792`. Ratios 4:5 and 3:4 map to `1024x1024` as closest available.
- **Generation time:** 1 image ≈ 30–60 seconds. 3 images ≈ 90–180 seconds. The SSE stream keeps the connection alive during this time.
- **Railway timeout:** Railway has a 30s HTTP timeout for standard plans. The `X-Accel-Buffering: no` header and SSE streaming bypass this. If you hit timeouts on 3-image generations, upgrade your Railway plan or reduce to single-image output.
- **Response format:** If the image model returns URLs instead of base64, the server fetches and converts automatically.

---

## Customization

### Adding new styles
Edit `lib/types.ts` — add to `ImageStyle` union and `STYLE_INFO` object.  
Edit `lib/prompts.ts` — add the style guide to `STYLE_VISUAL_GUIDE`.

### Adding new media brands
Edit `lib/types.ts` — add to `MediaBrand` union and `MEDIA_BRAND_LABELS`.  
Edit `lib/prompts.ts` — add the brand editorial guide to `BRAND_EDITORIAL_GUIDE`.

### Changing models
- Story model: `lib/openrouter.ts` → `generateStoryWithKimi()` → change `model`
- Image model: `lib/openrouter.ts` → `generateImageWithGPT()` → change `model`

---

## License

MIT
