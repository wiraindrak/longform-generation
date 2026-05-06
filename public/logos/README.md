# Logo Library

Brand logos for post-compositing onto generated infographics.

## Directory structure

```
public/logos/
  media/          # Media brand logos (detikcom, CNN Indonesia, CNBC Indonesia)
    {brand-id}/
      meta.json
      primary-light.svg   # White/light variant — for dark backgrounds
      primary-light.png   # Raster fallback
      primary-dark.svg    # Dark variant — for light backgrounds
      primary-dark.png    # Raster fallback
  partners/       # Brand partner logos (Samsung, BCA, etc.)
    {brand-id}/
      meta.json
      primary-light.svg
      primary-light.png
      primary-dark.svg
      primary-dark.png
```

## How to add a new logo

1. **Source the files** — Official press kit SVGs only. See "Sourcing guidelines" below.

2. **Create the directory**
   ```bash
   mkdir -p public/logos/partners/{brand-id}
   ```

3. **Export two variants from the press kit**
   - `primary-light.svg` — white/reversed logo, for placement on dark backgrounds
   - `primary-dark.svg` — full-color or dark logo, for placement on light backgrounds
   - Export PNG raster fallbacks at 2× the `minWidthPx` specified in meta.json

4. **Write meta.json** using the schema below

5. **Update `lib/logos.ts`** — add an entry to `LOGO_REGISTRY` mirroring your meta.json. Set `filesPresent: true`.

6. **Test the composite** by running the app locally and generating a slide with this brand as partner.

## meta.json schema

```json
{
  "displayName": "Brand Name",
  "aliases": ["brand", "brand name", "brand-name"],
  "minWidthPx": 60,
  "preferredVariant": "light",
  "clearspaceRatio": 0.12,
  "tagline": "Official brand tagline or description",
  "lastUpdated": "YYYY-MM-DD",
  "filesPresent": true
}
```

| Field | Description |
|---|---|
| `displayName` | Canonical name used in UI and attribution |
| `aliases` | Lowercase strings the fuzzy matcher checks against user input |
| `minWidthPx` | Minimum render width — logos are never resized below this |
| `preferredVariant` | `"light"` (white logo) or `"dark"` (dark logo) — sets default when background detection is inconclusive |
| `clearspaceRatio` | Fraction of logo width added as padding on each side |
| `filesPresent` | **Set to `true` only when both SVG variants exist** |

## Sourcing guidelines

- **Official press kits only.** Download from the brand's official media/press page.
- **Never rip from website HTML.** Inline SVGs may have inline styles that break rendering.
- **Verify license.** Editorial use licenses typically permit brand logos in journalistic contexts. Confirm with legal for each new partner before publishing.
- **Do not use community-sourced SVGs** (Wikimedia, Brandslogos.net, etc.) — quality and IP status are unverified.

## Approval workflow

1. Ops creates a Notion card in **[Brand Assets]** workspace tagging the account manager.
2. AM confirms logo version matches the current brand guidelines.
3. Legal confirms editorial-use license is in order.
4. Ops sets `filesPresent: true` in meta.json and updates `LOGO_REGISTRY` in `lib/logos.ts`.
5. Deploy to staging, verify composite output, then promote to production.

## Registered brands

### Media (3)
| ID | Display name | Files present |
|---|---|---|
| `detikcom` | detikcom | No — add SVG/PNG |
| `cnn-indonesia` | CNN Indonesia | No — add SVG/PNG |
| `cnbc-indonesia` | CNBC Indonesia | No — add SVG/PNG |

### Partners (5)
| ID | Display name | Files present |
|---|---|---|
| `samsung` | Samsung | No — add SVG/PNG |
| `bca` | Bank BCA | No — add SVG/PNG |
| `pertamina` | Pertamina | No — add SVG/PNG |
| `tokopedia` | Tokopedia | No — add SVG/PNG |
| `gojek` | Gojek | No — add SVG/PNG |
