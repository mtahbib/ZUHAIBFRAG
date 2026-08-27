import { useState, useRef, useEffect } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import useIsMobile from "../hooks/useIsMobile";
import { askParvej } from "../lib/askParvej";

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

// ─── Deterministic quick-answers ─────────────────────────────────────────────
// The rule engine only handles unambiguous fact lookups. Anything needing
// judgement (recommendations, comparisons, "something like X", vague or
// multi-constraint asks) returns null and goes to Parvej's AI, which has the
// full catalog + fragrance knowledge and can actually reason about it.

const truncate = (str, n) => (str && str.length > n ? str.slice(0, n - 1).trimEnd() + "…" : str || "");
const coreName = (name) => name.replace(/^YB\s+/i, "").replace(/\s*\d+ml$/i, "").trim();

function decantRows(product) {
  if (!product.decants?.length) return null;
  return product.decants.map((d) => `• **${d.size}** — ${d.price}`).join("\n");
}

// Pull catalog products that the AI named in its reply, so their cards
// (with +CART) render under the message.
function matchProductsInText(text, limit = 4) {
  if (!text) return [];
  const t = text.toLowerCase();
  const out = [];
  for (const p of products) {
    const core = coreName(p.name).toLowerCase();
    if (core.length < 3) continue;
    if (t.includes(core)) {
      if (!out.some((x) => x.id === p.id)) out.push(p);
      if (out.length >= limit) break;
    }
  }
  return out;
}

function getResponse(rawInput) {
  const text = rawInput.toLowerCase().trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Greeting — only for genuinely short greeting messages
  if (/^(hi+|hey+|hello+|helloo+|yo|salam|assalam|assalamu|asslamu|hii)\b/.test(text) && wordCount <= 3) {
    const islamic = /salam/.test(text);
    return {
      text: `${islamic ? "Wa alaikum assalam!" : "Assalamu Alaikum!"} 😊 I'm **Parvej**, your fragrance guide at Zuhaib Fragrance.\n\nTell me who it's for, your budget, or the vibe you're after — I'll find your match.`,
      products: [],
      quickReplies: QUICK_REPLIES.slice(0, 4),
    };
  }

  // What can you do
  if (/^(help|menu|what can you do|what do you do|how (do|does) (you|this|it) work|how to use)/.test(text)) {
    return {
      text: "Here's how I can help:\n\n• 💡 Recommend by occasion, budget, weather or vibe\n• 🔁 Find something close to a designer scent you like\n• 🧪 Show decant sizes & exact prices\n• 🛒 Add picks straight to your cart\n\nJust tell me what you're after.",
      products: [],
      quickReplies: QUICK_REPLIES,
    };
  }

  // Stock / sold-out list
  if (/\b(sold ?out|out of stock|in stock|stock status)\b/.test(text)) {
    const soldOut = products.filter((p) => p.soldOut);
    return soldOut.length
      ? { text: "These are currently out of stock:", products: soldOut }
      : { text: "Good news — everything is in stock right now. 🎉", products: [] };
  }

  const named = findProductByName(text);
  const isPriceQ = /\b(price|prices|cost|how much|koto|dam|daam|dhaam|taka|tk|rate)\b/.test(text);
  const isDecantWord = /\b(decant|decants|sample|tester|trial|travel size|try before)\b/.test(text);
  const wantsJudgement = /\b(suggest|recommend|recommendation|option|options|idea|ideas|similar|like|alternative|dupe|clone|vs|versus|compare|which (one|is|should)|better|best|help me (find|pick|choose)|ki nibo|konta|kon ?ta|kemn|kmn)\b/.test(text);

  // Generic "what are decants" — no product, not a judgement ask
  if (isDecantWord && !named && !isPriceQ && !wantsJudgement) {
    return {
      text: "We sell **decant sizes** so you can try a fragrance before buying a full bottle — 5ml, 6ml, 10ml and 15ml depending on the scent.\n\nTell me which fragrance you want a decant of and I'll pull the exact price.",
      products: [],
      quickReplies: [
        { label: "Ultra Male decant", value: "ultra male decant price" },
        { label: "Layton decant", value: "layton decant price" },
        { label: "Aventus decant", value: "aventus decant price" },
      ],
    };
  }

  // Direct price / decant-price lookup for a confidently-matched product
  if (named && (isPriceQ || (isDecantWord && !wantsJudgement))) {
    const rows = decantRows(named);
    const parts = [];
    if (rows) parts.push(`Decant prices for **${coreName(named.name)}**:\n\n${rows}`);
    parts.push(`Full bottle: **${named.price}**.${named.soldOut ? " _(full bottle currently unavailable)_" : ""}`);
    return { text: parts.join("\n\n"), products: [named] };
  }

  // Bare product mention with no judgement intent — show its card
  if (named && !wantsJudgement && wordCount <= 6) {
    const rows = decantRows(named);
    return {
      text: `**${coreName(named.name)}** — ${named.fragranceFamily}.\n\n${truncate(named.description, 160)}${rows ? `\n\nDecants from **${named.decants[0].price}**.` : ""}`,
      products: [named],
      quickReplies: [{ label: "🧪 Decant prices", value: `${named.name} decant price` }],
    };
  }

  // Everything else → smart AI
  return null;
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
      overflow: "hidden",
      border: "1px solid rgba(212,175,55,0.4)"
    }}>
      <img src="/parvex.png" alt="Parvez" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

// ─── Mini product card (inside chat) ─────────────────────────────────────────

function ChatProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const accent = product.themeColor || "#D4AF37";

  const hasDecants = product.decants && product.decants.length > 0;
  const displaySize = hasDecants ? product.decants[0].size : "100ml";
  const displayPrice = hasDecants ? product.decants[0].price : product.price;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (product.soldOut || added) return;
    onAddToCart({
      ...product,
      selectedSize: displaySize,
      cartKey: `${product.id}-${displaySize}`,
      price: hasDecants ? parseInt(String(displayPrice).replace(/[^0-9]/g, '')) : product.price, // ensure price is passed correctly to cart
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
        }}>{product.name} {displaySize}</div>
        <div style={{
          color: "rgba(255,255,255,0.3)", fontSize: "9px",
          fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
          letterSpacing: "0.5px", marginBottom: "4px",
        }}>{product.notes}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: accent, fontSize: "13px", fontFamily: "'Cormorant Garamond', serif" }}>
            {displayPrice}
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

  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || typing) return;

    const history = messages;
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    const minDelay = new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
    const ruleResponse = getResponse(trimmed);

    let response;
    if (ruleResponse) {
      await minDelay;
      response = ruleResponse;
    } else {
      try {
        const [aiText] = await Promise.all([askParvej(trimmed, history, "yusuf-bhai"), minDelay]);
        response = { text: aiText, products: matchProductsInText(aiText) };
      } catch {
        response = {
          text: "I'm having trouble reaching my notes right now — give it a moment and try again. Meanwhile you could ask:\n• \"something for men under ৳4000\"\n• \"best for a date night\"\n• \"price of Layton\"",
          products: [],
          quickReplies: QUICK_REPLIES.slice(0, 4),
        };
      }
    }

    setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", ...response }]);
    setTyping(false);
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
