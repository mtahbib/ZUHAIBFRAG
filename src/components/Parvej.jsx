import { useState, useRef, useEffect } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import useIsMobile from "../hooks/useIsMobile";

// ─── Quick reply chips ────────────────────────────────────────────────────────

const QUICK_REPLIES = [
  { label: "👨 For Men",        value: "suggest for men" },
  { label: "👩 For Women",      value: "suggest for women" },
  { label: "💑 Date Night",     value: "suggest for date night" },
  { label: "💼 Office Wear",    value: "suggest for office wear" },
  { label: "☀️ Summer Pick",    value: "suggest for summer" },
  { label: "❄️ Winter Pick",    value: "suggest for winter" },
  { label: "💰 Under ৳3,500",  value: "suggest under 3500" },
  { label: "🌿 Fresh Scents",   value: "suggest fresh fragrance" },
  { label: "🧪 Decant Sizes",   value: "what are decants" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsePrice(str) {
  return parseInt(String(str).replace(/[৳,\s]/g, ""));
}

// ─── Alias dictionary: misspellings / nicknames → canonical product keyword ──
const ALIASES = {
  // Sauvage
  "savage":            "sauvage",
  "savaj":             "sauvage",
  "savaje":            "sauvage",
  "suvage":            "sauvage",
  "sovage":            "sauvage",
  "sauvaj":            "sauvage",
  "souvage":           "sauvage",
  "swage":             "sauvage",
  "saveg":             "sauvage",
  "sauvge":            "sauvage",

  // Sauvage Elixir
  "savage elixir":     "sauvage elixir",
  "savaj elixir":      "sauvage elixir",

  // Baccarat Rouge 540
  "bacarat":           "baccarat",
  "backarat":          "baccarat",
  "bakarat":           "baccarat",
  "baccrat":           "baccarat",
  "bacarat rouge":     "baccarat rouge",
  "bacarat red":       "baccarat rouge",
  "baccarat red":      "baccarat rouge",
  "br540":             "baccarat rouge 540",
  "br 540":            "baccarat rouge 540",
  "rouge 540":         "baccarat rouge 540",

  // Ultra Male
  "ultra mail":        "ultra male",
  "ultramale":         "ultra male",
  "ultra mel":         "ultra male",

  // Le Male Elixir
  "le mail":           "le male",
  "lemale":            "le male",
  "le male elix":      "le male elixir",

  // Allure Homme Sport
  "allure sport":      "allure homme sport",
  "allure homme":      "allure homme sport",
  "allur":             "allure homme sport",

  // Eros
  "eros versace":      "eros versace men",
  "versace eros":      "eros versace men",
  "eros":              "eros versace men",

  // Layton
  "leighton":          "layton",
  "layeton":           "layton",
  "laiton":            "layton",

  // One Million
  "1 million":         "one million",
  "1million":          "one million",
  "onemillion":        "one million",

  // Aqua Di Gio Profumo
  "acqua di gio profumo": "aqua di gio profumo",
  "aqua gio profumo":  "aqua di gio profumo",
  "adgp":              "aqua di gio profumo",
  "aqua profumo":      "aqua di gio profumo",
  "aqua di gio profundo": "aqua di gio profumo",

  // Aqua Di Gio
  "acqua di gio":      "aqua di gio",
  "aqua gio":          "aqua di gio",
  "adg":               "aqua di gio",
  "acqua gio":         "aqua di gio",

  // Ombre Leather
  "ombre":             "ombre leather",
  "omber leather":     "ombre leather",
  "ombra leather":     "ombre leather",
  "shadow leather":    "ombre leather",

  // Tobacco Vanille
  "tobacco vanilla":   "tobacco vanille",
  "tabacco vanille":   "tobacco vanille",
  "tobacco vanil":     "tobacco vanille",
  "tobacco van":       "tobacco vanille",
  "tabaco vanille":    "tobacco vanille",

  // Oud Wood
  "oud woods":         "oud wood",
  "oudwood":           "oud wood",
  "oud":               "oud wood",

  // Aventus Absolut
  "aventus":           "aventus absolut",
  "creed aventus":     "aventus absolut",

  // Bleu De
  "blue de":           "bleu de",
  "bleu de chanel":    "bleu de",
  "blue de chanel":    "bleu de",
  "bleu":              "bleu de",

  // Pour Homme
  "pour home":         "pour homme",
  "pourhomme":         "pour homme",

  // Good Girl
  "good girl carolina": "good girl",
  "good grl":          "good girl",

  // Libre
  "libre ysl":         "libre",
  "ysl libre":         "libre",

  // Black Opium
  "black opium ysl":   "black opium",
  "blackopium":        "black opium",
  "blk opium":         "black opium",

  // Coco Mademoiselle
  "coco made":         "coco mademoiselle",
  "coco mademoisel":   "coco mademoiselle",
  "mademoiselle":      "coco mademoiselle",
  "coco":              "coco mademoiselle",

  // Pour Femme
  "pour fem":          "pour femme",
  "pour feme":         "pour femme",

  // French Oud
  "french wood":       "french oud",
  "french oudh":       "french oud",

  // Pacific Chill
  "pacific":           "pacific chill",
  "pacific chil":      "pacific chill",

  // Imagination
  "imagine":           "imagination",
  "imagin":            "imagination",

  // Wulong Cha
  "wu long cha":       "wulong cha",
  "wu long":           "wulong cha",
  "wulong":            "wulong cha",
  "green tea":         "wulong cha",

  // The One Man
  "the one":           "the one man",
  "dg the one":        "the one man",
  "dolce gabbana one": "the one man",
  "d&g one":           "the one man",

  // Flora
  "flora gucci":       "flora",
  "gucci flora":       "flora",
};

// Normalize a raw query by replacing known aliases with canonical terms
function normalizeQuery(raw) {
  let t = raw.toLowerCase().trim();
  // Try longest alias matches first (multi-word before single-word)
  const sorted = Object.keys(ALIASES).sort((a, b) => b.length - a.length);
  for (const alias of sorted) {
    if (t.includes(alias)) {
      t = t.replace(alias, ALIASES[alias]);
    }
  }
  return t;
}

// Character-level similarity score between two strings (0–1)
function strSimilarity(a, b) {
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.9;
  const longer = a.length >= b.length ? a : b;
  const shorter = a.length < b.length ? a : b;
  let matches = 0, j = 0;
  for (let i = 0; i < shorter.length; i++) {
    while (j < longer.length && longer[j] !== shorter[i]) j++;
    if (j < longer.length) { matches++; j++; }
  }
  return matches / longer.length;
}

function findProductByName(rawText) {
  // Step 1: normalize aliases first
  const t = normalizeQuery(rawText.replace(/[^a-z0-9\s]/gi, " "));
  const tWords = t.split(/\s+/).filter((w) => w.length >= 3);

  let bestProduct = null;
  let bestScore = 0;

  for (const p of products) {
    const normalized = p.name.toLowerCase()
      .replace(/^yb /, "")
      .replace(/\s*\d+ml$/, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .trim();

    // Exact substring match after normalization — highest priority
    if (t.includes(normalized)) return p;

    // Fuzzy keyword match
    const nameWords = normalized.split(/\s+/).filter((w) => w.length >= 3 && !/^\d+$/.test(w));
    if (!nameWords.length) continue;

    let matched = 0;
    for (const nw of nameWords) {
      const best = Math.max(...tWords.map((tw) => strSimilarity(tw, nw)), 0);
      if (best >= 0.75) matched++;
    }

    const score = matched / nameWords.length;
    if (score > bestScore && score >= 0.6) {
      bestScore = score;
      bestProduct = p;
    }
  }

  return bestProduct;
}

// ─── Rule-based response engine ───────────────────────────────────────────────

function getResponse(rawInput) {
  const text = rawInput.toLowerCase().trim();

  // Greeting
  if (/^(hi|hello|hey|assalam|salam|heyy|helloo|hii|yo)\b/.test(text)) {
    return {
      text: "Wa alaikum assalam! 😊 I'm **Parvej**, your personal fragrance guide at Zuhaib Fragrance.\n\nNot sure what to pick? Tell me who it's for or what vibe you're going for — I'll find your perfect match!",
      products: [],
      quickReplies: QUICK_REPLIES.slice(0, 4),
    };
  }

  // Help / what can you do
  if (/help|what can you|how do i|guide|assist/.test(text)) {
    return {
      text: "Here's what I can do for you:\n\n• 💡 Suggest fragrances by gender, occasion or season\n• 💰 Check prices instantly\n• 🎯 Recommend within your budget\n• 🌿 Find scents by type (fresh, woody, sweet…)\n\nJust ask anything!",
      products: [],
      quickReplies: QUICK_REPLIES,
    };
  }

  // Sold-out check
  if (/sold out|available|in stock|stock/.test(text)) {
    const soldOutList = products.filter((p) => p.soldOut);
    if (soldOutList.length === 0) {
      return { text: "Great news — all fragrances are currently in stock! 🎉", products: [] };
    }
    return {
      text: `The following ${soldOutList.length === 1 ? "fragrance is" : "fragrances are"} currently out of stock:`,
      products: soldOutList,
    };
  }

  const isDecantQuery = /decant|5\s*ml|10\s*ml|15\s*ml|sample|trial|small bottle|small size|mini|tester|try before/.test(text);

  // General decant info
  if (isDecantQuery && !findProductByName(text)) {
    return {
      text: "We offer **decant sizes** so you can try any fragrance before committing to a full bottle! 🧪\n\nAvailable sizes:\n• **5ml** — starting from ৳299\n• **10ml** — starting from ৳549\n• **15ml** — starting from ৳799\n\nJust tell me which fragrance you want a decant of — I'll pull up the exact price!",
      products: [],
      quickReplies: [
        { label: "🔵 Sauvage Decant",     value: "sauvage decant" },
        { label: "🔴 Baccarat Rouge Decant", value: "baccarat rouge 540 decant" },
        { label: "🟢 Layton Decant",      value: "layton decant" },
        { label: "🟣 Ultra Male Decant",  value: "ultra male decant" },
      ],
    };
  }

  // Price query for a specific product
  const namedProduct = findProductByName(text);

  // Decant price for a named product
  if (namedProduct && isDecantQuery) {
    if (!namedProduct.decants) {
      return {
        text: `Sorry, **${namedProduct.name}** doesn't have decant options listed yet. Feel free to ask on WhatsApp! 📱`,
        products: [namedProduct],
      };
    }
    const rows = namedProduct.decants.map((d) => `• **${d.size}** — ${d.price}`).join("\n");
    const status = namedProduct.soldOut ? "\n\n⚠️ Note: Full bottle currently unavailable." : "";
    return {
      text: `Decant prices for **${namedProduct.name}**:\n\n${rows}${status}`,
      products: [namedProduct],
    };
  }

  if (namedProduct && /price|cost|how much|koto|daam|taka/.test(text)) {
    const status = namedProduct.soldOut
      ? " Unfortunately it's currently out of stock."
      : " It's available now! 🛒";
    const decantNote = namedProduct.decants
      ? `\n\nAlso available as a decant — **${namedProduct.decants[0].size}** from **${namedProduct.decants[0].price}**!`
      : "";
    return {
      text: `**${namedProduct.name}** full bottle is **${namedProduct.price}**.${status}${decantNote}`,
      products: [namedProduct],
      quickReplies: [{ label: "🧪 See Decant Prices", value: `${namedProduct.name} decant` }],
    };
  }

  // Info about a specific product
  if (namedProduct) {
    const decantNote = namedProduct.decants
      ? `\n\nAlso available as a decant from **${namedProduct.decants[0].price}** (${namedProduct.decants[0].size}).`
      : "";
    return {
      text: `Here's everything about **${namedProduct.name}** ✨${decantNote}`,
      products: [namedProduct],
      quickReplies: [{ label: "🧪 See Decant Prices", value: `${namedProduct.name} decant` }],
    };
  }

  // ── Filter-based suggestion ──────────────────────────────────────────────

  const isMale    = /\b(men|male|man|him|boy|bhai|bro|husband|boyfriend|brother|gent)\b/.test(text);
  const isFemale  = /\b(women|female|woman|her|girl|apa|wife|girlfriend|sister)\b/.test(text);
  const isUnisex  = /\b(unisex|both|anyone|couple|gender neutral)\b/.test(text);

  const isDate    = /\b(date|romantic|evening|special|anniversary|dinner)\b/.test(text);
  const isOffice  = /\b(office|work|professional|meeting|business|formal)\b/.test(text);
  const isParty   = /\b(party|club|clubbing|night out|event|bash)\b/.test(text);
  const isSummer  = /\b(summer|hot|beach|vacation|heat|daytime)\b/.test(text);
  const isWinter  = /\b(winter|cold|cozy|autumn|fall)\b/.test(text);
  const isDaily   = /\b(daily|casual|everyday|regular)\b/.test(text);
  const isGym     = /\b(gym|sport|workout|active|exercise)\b/.test(text);

  const isSweet   = /\b(sweet|vanilla|gourmand|fruity|honey|candy)\b/.test(text);
  const isWoody   = /\b(woody|wood|oud|leather|dark|heavy|oriental|deep)\b/.test(text);
  const isFresh   = /\b(fresh|clean|light|aquatic|marine|cool|watery)\b/.test(text);
  const isFloral  = /\b(floral|flower|rose|jasmine|girly|soft)\b/.test(text);
  const isLuxury  = /\b(luxury|premium|expensive|best|top|finest|splurge)\b/.test(text);

  const budgetMatch = text.match(/\b(\d{3,5})\b/);
  const budget      = budgetMatch ? parseInt(budgetMatch[1]) : null;

  const wantsSuggestion = /suggest|recommend|help me|what should|what to buy|confused|pick|choose|best|good/.test(text);

  const hasAnyFilter = isMale || isFemale || isUnisex || isDate || isOffice ||
    isParty || isSummer || isWinter || isDaily || isGym ||
    isSweet || isWoody || isFresh || isFloral || isLuxury || budget;

  if (!hasAnyFilter) {
    if (wantsSuggestion) {
      return {
        text: "I'd love to help you find the right fragrance! 😊\n\nA couple of quick questions — is it for a **man** or **woman**? And do you have a **budget** in mind?",
        products: [],
        quickReplies: QUICK_REPLIES.slice(0, 6),
      };
    }
    return null;
  }

  let filtered = products.filter((p) => !p.soldOut);
  const reasons = [];

  // Gender
  if (isMale && !isFemale) {
    filtered = filtered.filter((p) => p.category === "male" || p.category === "unisex");
    reasons.push("for men");
  } else if (isFemale && !isMale) {
    filtered = filtered.filter((p) => p.category === "female" || p.category === "unisex");
    reasons.push("for women");
  } else if (isUnisex) {
    filtered = filtered.filter((p) => p.category === "unisex");
    reasons.push("unisex");
  }

  // Occasion
  if (isDate) {
    const sub = filtered.filter((p) => p.perfectFor?.some((f) => /date|night|evening|romantic|special/i.test(f)));
    if (sub.length) { filtered = sub; reasons.push("for date nights"); }
  } else if (isOffice) {
    const sub = filtered.filter((p) => p.perfectFor?.some((f) => /office|work|formal|business|professional/i.test(f)));
    if (sub.length) { filtered = sub; reasons.push("for office"); }
  } else if (isParty) {
    const sub = filtered.filter((p) => p.perfectFor?.some((f) => /party|club|night|event/i.test(f)));
    if (sub.length) { filtered = sub; reasons.push("for parties"); }
  } else if (isGym) {
    const sub = filtered.filter((p) => p.perfectFor?.some((f) => /gym|sport|active/i.test(f)));
    if (sub.length) { filtered = sub; reasons.push("for gym & sports"); }
  } else if (isSummer) {
    const sub = filtered.filter((p) => p.perfectFor?.some((f) => /summer|spring|beach/i.test(f)));
    if (sub.length) { filtered = sub; reasons.push("for summer"); }
  } else if (isWinter) {
    const sub = filtered.filter((p) => p.perfectFor?.some((f) => /winter|autumn/i.test(f)));
    if (sub.length) { filtered = sub; reasons.push("for winter"); }
  } else if (isDaily) {
    const sub = filtered.filter((p) => p.perfectFor?.some((f) => /daily|casual|everyday/i.test(f)));
    if (sub.length) { filtered = sub; reasons.push("for daily wear"); }
  }

  // Scent type
  if (isSweet) {
    const sub = filtered.filter((p) => /vanilla|sweet|honey|cacao|tonka/i.test(JSON.stringify(p)));
    if (sub.length) { filtered = sub; reasons.push("with sweet notes"); }
  } else if (isWoody) {
    const sub = filtered.filter((p) => /wood|oud|leather/i.test(JSON.stringify(p)));
    if (sub.length) { filtered = sub; reasons.push("with woody/oud notes"); }
  } else if (isFresh) {
    const sub = filtered.filter((p) => /fresh|aquatic|marine|mint|citrus|sea/i.test(JSON.stringify(p)));
    if (sub.length) { filtered = sub; reasons.push("with fresh notes"); }
  } else if (isFloral) {
    const sub = filtered.filter((p) => /floral|flower|rose|jasmine|blossom/i.test(JSON.stringify(p)));
    if (sub.length) { filtered = sub; reasons.push("with floral notes"); }
  }

  // Premium
  if (isLuxury) {
    const sub = filtered.filter((p) => parsePrice(p.price) >= 4000);
    if (sub.length) { filtered = sub; reasons.push("premium picks"); }
  }

  // Budget
  if (budget) {
    const sub = filtered.filter((p) => parsePrice(p.price) <= budget);
    if (sub.length) { filtered = sub; reasons.push(`under ৳${budget}`); }
  }

  if (filtered.length === 0) {
    return {
      text: "Hmm, I couldn't find an exact match for that! Try loosening the filters a bit — maybe a wider budget or different occasion? 😊",
      products: [],
      quickReplies: QUICK_REPLIES.slice(0, 4),
    };
  }

  const picks = [...filtered].sort(() => Math.random() - 0.5).slice(0, 3);
  return {
    text: `Here are my top picks ${reasons.join(", ")} ✨`,
    products: picks,
  };
}

// ─── Typing dots animation ────────────────────────────────────────────────────

const DOT_STYLE = `
  @keyframes parvejDot {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-5px); opacity: 1; }
  }
`;

// ─── Bold markdown renderer ───────────────────────────────────────────────────

function renderText(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: "#D4AF37", fontWeight: 600 }}>{part}</strong>
      : part
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #D4AF37, #9a6f1a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.42, fontWeight: 700, color: "#000",
      fontFamily: "'Cormorant Garamond', serif",
    }}>P</div>
  );
}

// ─── Mini product card (inside chat) ─────────────────────────────────────────

function ChatProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const accent = product.themeColor || "#D4AF37";

  const handleAdd = (e) => {
    e.stopPropagation();
    if (product.soldOut || added) return;
    onAddToCart({
      ...product,
      selectedSize: "100ml",
      cartKey: `${product.id}-100ml`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={{
      background: "#111",
      border: `1px solid ${accent}30`,
      borderRadius: "12px",
      padding: "10px 12px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}>
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "46px", height: "46px", objectFit: "contain", flexShrink: 0,
          filter: `drop-shadow(0 0 8px ${accent}55)`,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          color: "#fff", fontSize: "11px", fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400, marginBottom: "2px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{product.name}</div>
        <div style={{
          color: "rgba(255,255,255,0.3)", fontSize: "9px",
          fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
          letterSpacing: "0.5px", marginBottom: "4px",
        }}>{product.notes}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: accent, fontSize: "13px", fontFamily: "'Cormorant Garamond', serif" }}>
            {product.price}
          </span>
          {product.soldOut ? (
            <span style={{
              fontSize: "8px", color: "#E05555", letterSpacing: "1px",
              fontFamily: "'Montserrat', sans-serif", border: "1px solid rgba(220,50,50,0.3)",
              padding: "2px 7px", borderRadius: "999px",
            }}>SOLD OUT</span>
          ) : (
            <button
              onClick={handleAdd}
              style={{
                fontSize: "8px", letterSpacing: "1px",
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                background: added ? "rgba(212,175,55,0.12)" : accent,
                color: added ? accent : "#000",
                border: "none", padding: "3px 9px", borderRadius: "999px",
                cursor: "pointer", transition: "all 0.25s ease",
              }}
            >{added ? "ADDED ✓" : "+ CART"}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const WELCOME_MSG = {
  id: "welcome",
  sender: "bot",
  text: "Assalamu Alaikum! I'm **Parvej**, your personal fragrance guide at Zuhaib Fragrance. 😊\n\nNot sure what to buy? Tell me who it's for, your budget, or the vibe you're after — I'll find your perfect scent!",
  products: [],
  quickReplies: [
    ...QUICK_REPLIES.slice(0, 4),
    { label: "🧪 Decant Prices", value: "what are decants" },
  ],
};

export default function Parvej() {
  const isMobile              = useIsMobile();
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);
  const { addItem }           = useCart();

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || typing) return;

    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = getResponse(trimmed) || {
        text: "Hmm, I didn't quite catch that! 😊 Try something like:\n• \"suggest for men under ৳4000\"\n• \"best for date night\"\n• \"price of Layton\"",
        products: [],
        quickReplies: QUICK_REPLIES.slice(0, 4),
      };
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", ...response }]);
      setTyping(false);
    }, 800 + Math.random() * 500);
  };

  return (
    <>
      <style>{DOT_STYLE}</style>

      {/* ── Chat Panel ────────────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: isMobile ? 0 : "90px",
          right: isMobile ? 0 : "24px",
          width: isMobile ? "100vw" : "370px",
          height: isMobile ? "85vh" : "560px",
          background: "#0a0a0a",
          border: "1px solid rgba(212,175,55,0.18)",
          borderRadius: isMobile ? "20px 20px 0 0" : "20px",
          display: "flex", flexDirection: "column",
          zIndex: 99998,
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.06)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(212,175,55,0.1)",
            display: "flex", alignItems: "center", gap: "12px",
            background: "#111", flexShrink: 0,
          }}>
            <Avatar size={40} />
            <div>
              <div style={{
                color: "#fff", fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.15rem", fontWeight: 400, letterSpacing: "0.5px",
              }}>Parvej</div>
              <div style={{
                color: "rgba(212,175,55,0.55)", fontSize: "8px",
                letterSpacing: "3px", fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
              }}>FRAGRANCE GUIDE</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#4CAF50", boxShadow: "0 0 6px #4CAF50",
              }} />
              <span style={{
                color: "rgba(255,255,255,0.25)", fontSize: "9px",
                fontFamily: "'Montserrat', sans-serif",
              }}>Online</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none", border: "none",
                color: "rgba(255,255,255,0.3)", fontSize: "18px",
                cursor: "pointer", lineHeight: 1, marginLeft: "8px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#D4AF37"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 6px",
            display: "flex", flexDirection: "column", gap: "14px",
          }}>
            {messages.map((msg) => (
              <div key={msg.id}>
                {/* Bubble */}
                <div style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end", gap: "8px",
                }}>
                  {msg.sender === "bot" && <Avatar size={26} />}
                  <div style={{
                    maxWidth: "78%",
                    background: msg.sender === "user"
                      ? "rgba(212,175,55,0.12)"
                      : "rgba(255,255,255,0.04)",
                    border: msg.sender === "user"
                      ? "1px solid rgba(212,175,55,0.3)"
                      : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: msg.sender === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    padding: "9px 13px",
                    color: "rgba(255,255,255,0.82)",
                    fontSize: "11.5px",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300, lineHeight: "1.8",
                    whiteSpace: "pre-line",
                  }}>
                    {renderText(msg.text)}
                  </div>
                </div>

                {/* Product cards */}
                {msg.products?.length > 0 && (
                  <div style={{
                    paddingLeft: "34px", marginTop: "8px",
                    display: "flex", flexDirection: "column", gap: "7px",
                  }}>
                    {msg.products.map((p) => (
                      <ChatProductCard key={p.id} product={p} onAddToCart={addItem} />
                    ))}
                  </div>
                )}

                {/* Quick replies */}
                {msg.quickReplies?.length > 0 && (
                  <div style={{
                    paddingLeft: "34px", marginTop: "10px",
                    display: "flex", flexWrap: "wrap", gap: "6px",
                  }}>
                    {msg.quickReplies.map((qr) => (
                      <button
                        key={qr.value}
                        onClick={() => send(qr.value)}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(212,175,55,0.28)",
                          color: "#D4AF37", padding: "5px 12px",
                          borderRadius: "999px", cursor: "pointer",
                          fontSize: "10px", fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 500, letterSpacing: "0.3px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >{qr.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <Avatar size={26} />
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px 16px 16px 4px",
                  padding: "10px 14px", display: "flex", gap: "4px", alignItems: "center",
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: "5px", height: "5px", borderRadius: "50%",
                      background: "rgba(212,175,55,0.55)",
                      animation: `parvejDot 1.2s ease-in-out ${i * 0.18}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(212,175,55,0.08)",
            display: "flex", gap: "8px", flexShrink: 0,
            background: "#0a0a0a",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask Parvej anything…"
              style={{
                flex: 1, background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(212,175,55,0.18)",
                borderRadius: "999px", padding: "9px 16px",
                color: "#fff", fontSize: "11.5px",
                fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
                outline: "none", transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.18)"; }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || typing}
              style={{
                width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                background: input.trim() && !typing ? "#D4AF37" : "rgba(212,175,55,0.12)",
                border: "none",
                cursor: input.trim() && !typing ? "pointer" : "default",
                color: input.trim() && !typing ? "#000" : "rgba(212,175,55,0.35)",
                fontSize: "17px", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.25s ease",
              }}
            >↑</button>
          </div>
        </div>
      )}

      {/* ── Floating Trigger Button ────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "24px", right: "24px",
          width: "56px", height: "56px", borderRadius: "50%",
          background: open
            ? "#111"
            : "linear-gradient(135deg, #D4AF37, #9a6f1a)",
          border: open ? "1px solid rgba(212,175,55,0.4)" : "none",
          color: open ? "#D4AF37" : "#000",
          fontSize: "22px",
          cursor: "pointer", zIndex: 99999,
          boxShadow: open
            ? "none"
            : "0 4px 24px rgba(212,175,55,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease",
        }}
        title={open ? "Close Parvej" : "Chat with Parvej"}
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
