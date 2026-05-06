// ─── Types ────────────────────────────────────────────────────────────────────

export interface LogoMeta {
  displayName: string;
  aliases: string[];
  minWidthPx: number;
  preferredVariant: "light" | "dark";
  clearspaceRatio: number;
  tagline: string;
  lastUpdated: string;
  filesPresent: boolean;
}

export interface LogoRegistryEntry extends LogoMeta {
  brandId: string;
  type: "media" | "partner";
}

export interface LogoMatch {
  found: boolean;
  brandId: string | null;
  type: "media" | "partner" | null;
  publicPath: string | null;
  meta: LogoRegistryEntry | null;
  confidence: number;
}

// ─── Static registry ─────────────────────────────────────────────────────────
// Mirrors /public/logos/*/meta.json — update both when adding a brand.
// filesPresent: true only once SVG+PNG variants are actually in the directory.

export const LOGO_REGISTRY: readonly LogoRegistryEntry[] = [
  // ── Media brands ──────────────────────────────────────────────────────────
  {
    brandId: "detikcom",
    type: "media",
    displayName: "detikcom",
    aliases: ["detik", "detik.com", "detikcom", "detik com"],
    minWidthPx: 80,
    preferredVariant: "light",
    clearspaceRatio: 0.15,
    tagline: "#1 Indonesian Digital News",
    filesPresent: false,
    lastUpdated: "2026-05-06",
  },
  {
    brandId: "cnn-indonesia",
    type: "media",
    displayName: "CNN Indonesia",
    aliases: ["cnn", "cnn indonesia", "cnn-indonesia", "cnn ind", "cnn id"],
    minWidthPx: 80,
    preferredVariant: "light",
    clearspaceRatio: 0.15,
    tagline: "CNN Indonesia News Network",
    filesPresent: false,
    lastUpdated: "2026-05-06",
  },
  {
    brandId: "cnbc-indonesia",
    type: "media",
    displayName: "CNBC Indonesia",
    aliases: ["cnbc", "cnbc indonesia", "cnbc-indonesia", "cnbc ind", "cnbc id"],
    minWidthPx: 80,
    preferredVariant: "light",
    clearspaceRatio: 0.15,
    tagline: "CNBC Indonesia Business News",
    filesPresent: false,
    lastUpdated: "2026-05-06",
  },
  // ── Partner brands ────────────────────────────────────────────────────────
  {
    brandId: "samsung",
    type: "partner",
    displayName: "Samsung",
    aliases: ["samsung", "samsung galaxy", "samsung indonesia", "samsung electronics", "samsung id"],
    minWidthPx: 60,
    preferredVariant: "light",
    clearspaceRatio: 0.12,
    tagline: "Samsung Electronics Indonesia",
    filesPresent: false,
    lastUpdated: "2026-05-06",
  },
  {
    brandId: "bca",
    type: "partner",
    displayName: "Bank BCA",
    aliases: ["bca", "bank bca", "bank central asia", "bca mobile", "mybca", "pt bca"],
    minWidthPx: 60,
    preferredVariant: "light",
    clearspaceRatio: 0.12,
    tagline: "Bank Central Asia",
    filesPresent: false,
    lastUpdated: "2026-05-06",
  },
  {
    brandId: "pertamina",
    type: "partner",
    displayName: "Pertamina",
    aliases: ["pertamina", "pt pertamina", "pertamina persero", "pt pertamina persero"],
    minWidthPx: 60,
    preferredVariant: "light",
    clearspaceRatio: 0.12,
    tagline: "PT Pertamina (Persero)",
    filesPresent: false,
    lastUpdated: "2026-05-06",
  },
  {
    brandId: "tokopedia",
    type: "partner",
    displayName: "Tokopedia",
    aliases: ["tokopedia", "toped", "tokopedia.com", "tokped"],
    minWidthPx: 60,
    preferredVariant: "dark",
    clearspaceRatio: 0.12,
    tagline: "Tokopedia — Mulai Aja Dulu",
    filesPresent: false,
    lastUpdated: "2026-05-06",
  },
  {
    brandId: "gojek",
    type: "partner",
    displayName: "Gojek",
    aliases: ["gojek", "go-jek", "gojek indonesia", "goride", "gofood", "go jek", "goto gojek"],
    minWidthPx: 60,
    preferredVariant: "light",
    clearspaceRatio: 0.12,
    tagline: "Gojek Super App",
    filesPresent: false,
    lastUpdated: "2026-05-06",
  },
];

// ─── Matching ─────────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

export function findLogo(query: string, type: "media" | "partner"): LogoMatch {
  const q = normalize(query);
  if (!q) return { found: false, brandId: null, type: null, publicPath: null, meta: null, confidence: 0 };

  const pool = LOGO_REGISTRY.filter((e) => e.type === type);

  // Exact displayName
  for (const e of pool) {
    if (normalize(e.displayName) === q) return hit(e, 1.0);
  }
  // Exact alias
  for (const e of pool) {
    if (e.aliases.some((a) => normalize(a) === q)) return hit(e, 0.95);
  }
  // displayName contains query or query contains displayName
  for (const e of pool) {
    const dn = normalize(e.displayName);
    if (dn.startsWith(q) || q.startsWith(dn)) return hit(e, 0.8);
  }
  // Alias prefix match
  for (const e of pool) {
    for (const a of e.aliases) {
      const na = normalize(a);
      if (na.startsWith(q) || q.startsWith(na)) return hit(e, 0.7);
    }
  }

  return { found: false, brandId: null, type: null, publicPath: null, meta: null, confidence: 0 };
}

function hit(e: LogoRegistryEntry, confidence: number): LogoMatch {
  return {
    found: true,
    brandId: e.brandId,
    type: e.type,
    publicPath: getLogoPublicPath(e.brandId, e.type, e.preferredVariant),
    meta: e,
    confidence,
  };
}

// Returns the expected public URL for an img src (PNG raster for browser display).
// Does not check if the file exists — composite.ts does that server-side.
export function getLogoPublicPath(
  brandId: string,
  type: "media" | "partner",
  variant: "light" | "dark"
): string {
  return `/logos/${type}/${brandId}/primary-${variant}.png`;
}
