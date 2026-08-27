// Scent → visual-atmosphere engine.
//
// Turns a product's existing metadata (notes, accords, family, season,
// occasion) into a small palette + motion profile that the product page
// layers *on top of* the Zuhaib editorial look — same layout, same
// components, just an atmosphere that matches how the fragrance smells.
//
// Nothing here touches structure or typography. Backgrounds stay pale so
// the espresso body text keeps its contrast; only decorative surfaces,
// glows and borders take the scent tint.

const IVORY = "#F5F0E7";

// ─── colour helpers ─────────────────────────────────────────────────────────
const clampByte = (n) => Math.min(255, Math.max(0, n));

function hexToRgb(h) {
  const x = h.replace("#", "");
  const n = x.length === 3 ? x.split("").map((c) => c + c).join("") : x;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}
function rgbToHex(rgb) {
  return "#" + rgb.map((v) => clampByte(Math.round(v)).toString(16).padStart(2, "0")).join("");
}
export function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
}
export function withAlpha(hex, a) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// Keep any generated page ground pale enough that dark body text stays legible.
function ensureLight(hex, minL = 0.9) {
  let out = hex;
  let guard = 0;
  while (luminance(out) < minL && guard++ < 14) out = mix(out, "#FFFFFF", 0.2);
  return out;
}

// ─── archetype palettes: [deep, mid, light, glow] ───────────────────────────
// All muted / warm-leaning so every page still reads as Zuhaib.
const ARCHETYPES = {
  amber:    ["#7A4A21", "#B27A42", "#EAD8BF", "#E0A85E"],
  vanilla:  ["#6E5A3E", "#B49A72", "#F1E7D5", "#EBD8B4"],
  gourmand: ["#5E3B2A", "#9C6B4C", "#EAD9C8", "#DDA063"],
  coffee:   ["#3F2A20", "#6F4C3A", "#DCC9BA", "#A9764F"],
  oud:      ["#3A3226", "#6A5A44", "#DBD3C1", "#8C6F45"],
  woody:    ["#4B3A2A", "#836B4F", "#E4DAC7", "#A98B62"],
  leather:  ["#3B2A24", "#6E463C", "#DFCEC4", "#8F5140"],
  tobacco:  ["#5A3A22", "#946039", "#E6D7C1", "#C67C43"],
  smoky:    ["#39332E", "#6B625A", "#D9D3CA", "#8A7B6A"],
  spicy:    ["#6E3A24", "#A9603B", "#EBD6C3", "#CE7C46"],
  citrus:   ["#7A7830", "#B0A044", "#EEEAcb", "#D8C556"],
  aquatic:  ["#274B5E", "#4E8598", "#D7E7EC", "#5FA6BE"],
  fresh:    ["#3C5A4E", "#6E9382", "#DEE9E2", "#7FB59C"],
  aromatic: ["#48584A", "#7C8E72", "#E1E6DA", "#93AE86"],
  green:    ["#3F5230", "#6F824E", "#E2E7CF", "#93A85E"],
  floral:   ["#7A4A55", "#AF7E87", "#F0E3E4", "#CB9AA0"],
  rose:     ["#7C3A44", "#AF6572", "#F1DFE1", "#CC8A93"],
  iris:     ["#4E4A5C", "#87839C", "#E4E2EA", "#A5A0BB"],
  powdery:  ["#5C5346", "#8E8578", "#E8E3D9", "#B5AA9A"],
  fruity:   ["#8A4436", "#BC7460", "#F1E0D4", "#DB9576"],
  tropical: ["#8A6A2E", "#BB984C", "#F0E8CF", "#DDBB6A"],
  _default: ["#6E5A3E", "#A6784E", "#EDE4D3", "#D2A66C"],
};

// keyword (lower-case, substring-matched) → archetype
const KEYWORDS = {
  amber: ["amber", "ambrox", "ambergris", "ambrette", "labdanum", "benzoin"],
  vanilla: ["vanilla", "brûlée", "brulee"],
  gourmand: ["praline", "tonka", "cacao", "chocolate", "caramel", "honey", "rum", "gourmand", "sweet", "candied", "dates", "mirabelle", "sugar"],
  coffee: ["coffee", "mocha", "espresso"],
  oud: ["oud", "agarwood"],
  woody: ["wood", "cedar", "sandal", "guaiac", "vetiver", "patchouli", "birch", "cypress", "fir ", "chestnut", "cashmeran", "moss", "oakmoss", "elemi"],
  leather: ["leather", "suede"],
  tobacco: ["tobacco"],
  smoky: ["smoky", "smoke", "incense"],
  spicy: ["spice", "spicy", "pepper", "cinnamon", "cardamom", "nutmeg", "saffron", "ginger", "cumin", "clove", "pimento", "turmeric", "coriander"],
  citrus: ["citrus", "lemon", "bergamot", "grapefruit", "mandarin", "orange", "citron", "lime", "neroli"],
  aquatic: ["aquatic", "marine", "calone", "aquozone", "cascalone", "sea ", "salt", "salty", "mineral", "water", "ozon", "mojito", "aqu"],
  fresh: ["fresh", "clean", "sporty", "breeze"],
  aromatic: ["aromatic", "lavender", "sage", "rosemary", "basil", "artemisia", "clary", "mint", "herbal", "davana"],
  green: ["green", "galbanum", "leaf", "grass"],
  floral: ["floral", "jasmine", "lily", "freesia", "violet", "blossom", "geranium", "may rose", "marigold", "rock rose", "flower"],
  rose: ["rose"],
  iris: ["iris", "orris"],
  powdery: ["powdery", "musk", "musky"],
  fruity: ["fruity", "apple", "pear", "peach", "apricot", "currant", "rhubarb", "berry", "plum"],
  tropical: ["tropical", "mango", "pineapple", "coconut"],
};

/**
 * generateFragranceTheme(product) → visual atmosphere for the product page.
 * Deterministic and cheap. Honours an optional `product.themeOverride`.
 */
export function generateFragranceTheme(product = {}) {
  const weights = {};
  const bump = (text, w) => {
    if (!text) return;
    const t = String(text).toLowerCase();
    for (const [arch, keys] of Object.entries(KEYWORDS)) {
      if (keys.some((k) => t.includes(k))) weights[arch] = (weights[arch] || 0) + w;
    }
  };

  // Base notes carry the deepest, longest-lasting character → most weight.
  (product.baseNotes || []).forEach((n) => bump(n, 3));
  (product.heartNotes || []).forEach((n) => bump(n, 2));
  (product.topNotes || []).forEach((n) => bump(n, 1));
  (product.mainAccords || []).forEach((n) => bump(n, 2.5));
  bump(product.family, 2);
  bump(product.fragranceFamily, 2);

  const ranked = Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  const domKey = ranked[0] || "_default";
  const dom = ARCHETYPES[domKey] || ARCHETYPES._default;
  const sup = ARCHETYPES[ranked[1]] || dom;
  const acc = ARCHETYPES[ranked[2]] || sup;

  const primary = mix(dom[0], sup[0], 0.18);
  const accent = mix(dom[1], sup[1], 0.26);
  const secondary = sup[1];
  const tertiary = acc[1];
  const highlight = mix(dom[2], "#FFFFFF", 0.3);
  const soft = mix(dom[2], "#FFFFFF", 0.42);
  const glow = dom[3];

  // Season / time / occasion nudges the page ground only — never the profile.
  const ctx = [
    ...(product.bestSeason || []),
    ...(product.bestTime || []),
    ...(product.bestOccasions || []),
  ]
    .join(" ")
    .toLowerCase();

  let groundT = 0.62; // 1 = pure ivory · 0 = full scent tint
  if (/winter|fall|night|evening/.test(ctx)) groundT = 0.5;
  if (/summer|spring|day|gym|sport|outdoor|vacation/.test(ctx)) groundT = 0.72;
  const background = ensureLight(mix(dom[2], IVORY, groundT), 0.9);

  const isFresh = /citrus|aquatic|fresh|aromatic|green/.test(domKey);
  const isDeepWood = /oud|woody|leather|smoky|tobacco|coffee/.test(domKey);
  const isWarmEdible = /amber|vanilla|gourmand|tobacco|coffee|spicy/.test(domKey);
  const elegant = /office|formal|business|wedding/.test(ctx);
  const lively = /party|club|night out/.test(ctx);

  const motion = {
    breath: isDeepWood ? 22 : isFresh ? 12 : elegant ? 20 : 16,
    drift: isFresh ? 26 : 34,
    glowMin: 0.2,
    glowMax: elegant ? 0.4 : lively ? 0.66 : 0.52,
    particles: isWarmEdible ? 6 : 0,
  };

  const theme = {
    primary,
    secondary,
    tertiary,
    accent,
    highlight,
    soft,
    glow,
    background,
    card: withAlpha(accent, 0.055),
    border: withAlpha(accent, 0.16),
    textAccent: primary,
    // Fragrance-pyramid tint: top note brighter → base note deeper, mirroring
    // how the scent itself unfolds.
    pyramid: {
      top: accent,
      heart: mix(accent, primary, 0.45),
      base: primary,
    },
    // pre-mixed rgba layers the page uses directly
    glowSoft: withAlpha(glow, 0.5),
    glowFaint: withAlpha(glow, 0.12),
    secondaryWash: withAlpha(secondary, 0.16),
    particleColor: withAlpha(glow, 0.5),
    archetype: domKey === "_default" ? "signature" : domKey,
    motion,
  };

  if (product.themeOverride) {
    return { ...theme, ...product.themeOverride, motion: { ...motion, ...(product.themeOverride.motion || {}) } };
  }
  return theme;
}
