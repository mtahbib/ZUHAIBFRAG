import { useState, useRef, useEffect } from "react";
import { otherBrandsProducts } from "../data/products";
import { useObCart } from "../context/ObCartContext";
import { SIZE_ORDER } from "../theme";
import { openWhatsAppOrder } from "../utils";
import useIsMobile from "../../hooks/useIsMobile";
import { askParvej } from "../../lib/askParvej";
import FragranceBottle from "./FragranceBottle";

// ─── Quick reply chips ────────────────────────────────────────────────────────

const QUICK_REPLIES = [
  { label: "👨 For Men",      value: "suggest for men" },
  { label: "👩 For Women",    value: "suggest for women" },
  { label: "🤝 Unisex",       value: "suggest unisex" },
  { label: "💑 Date Night",   value: "suggest for date night" },
  { label: "☀️ Summer Pick",  value: "suggest for summer" },
  { label: "❄️ Winter Pick",  value: "suggest for winter" },
  { label: "🌿 Fresh Scents", value: "suggest fresh fragrance" },
  { label: "🪵 Woody Scents", value: "suggest woody fragrance" },
  { label: "🧪 Decant Sizes", value: "what are decants" },
];

// ─── Fuzzy name matching (brand + product name) ──────────────────────────────

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
  const t = rawText.toLowerCase().replace(/[^a-z0-9\s]/gi, " ");
  const tWords = t.split(/\s+/).filter((w) => w.length >= 3);

  let bestProduct = null;
  let bestScore = 0;

  for (const p of otherBrandsProducts) {
    const normalized = `${p.brand} ${p.name}`.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();

    if (t.includes(normalized) || t.includes(p.name.toLowerCase())) return p;

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
// The rule engine only handles unambiguous, fact-lookup intents. Anything that
// needs judgement (recommendations, comparisons, "something like X", vague or
// multi-constraint asks) returns null and is handled by Parvej's AI, which has
// the full catalog + fragrance knowledge and can actually reason about it.

const truncate = (str, n) => (str && str.length > n ? str.slice(0, n - 1).trimEnd() + "…" : str || "");

function priceLine(product) {
  const rows = SIZE_ORDER.filter((s) => product.sizes?.[s]).map((s) => `• **${s}** — ৳${product.sizes[s]}`);
  if (!rows.length) {
    return `Pricing for **${product.brand} — ${product.name}** is being finalised — message us on WhatsApp for the latest. 📱`;
  }
  const stock = product.inStock ? "" : "\n\n_Currently out of stock._";
  return `Decant prices for **${product.brand} — ${product.name}**:\n\n${rows.join("\n")}${stock}`;
}

// Pull catalog products that Parvej's AI named in its reply, so we can render
// their cards (with +CART) under the message.
function matchProductsInText(text, limit = 4) {
  if (!text) return [];
  const t = text.toLowerCase();
  const out = [];
  for (const p of otherBrandsProducts) {
    const name = p.name.toLowerCase();
    if (name.length < 3) continue;
    if (t.includes(name) || t.includes(`${p.brand} ${p.name}`.toLowerCase())) {
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
      text: `${islamic ? "Wa alaikum assalam!" : "Assalamu Alaikum!"} 😊 I'm **Parvej**, your fragrance guide for Zuhaib's Other Brands collection.\n\nTell me who it's for, your budget, or the vibe you're after — I'll pull up a few picks.`,
      products: [],
      quickReplies: QUICK_REPLIES.slice(0, 4),
    };
  }

  // What can you do
  if (/^(help|menu|what can you do|what do you do|how (do|does) (you|this|it) work|how to use)/.test(text)) {
    return {
      text: "Here's how I can help:\n\n• 💡 Recommend fragrances by occasion, budget, weather or vibe\n• 🔁 Find something close to a designer scent you like\n• 🧪 Show decant sizes & exact prices\n• 🛒 Add picks straight to your cart\n\nJust tell me what you're after.",
      products: [],
      quickReplies: QUICK_REPLIES,
    };
  }

  // Stock / sold-out list
  if (/\b(sold ?out|out of stock|in stock|stock status|what('?s| is) (sold ?out|unavailable|available))\b/.test(text)) {
    const soldOut = otherBrandsProducts.filter((p) => !p.inStock);
    return soldOut.length
      ? { text: "These are currently out of stock:", products: soldOut }
      : { text: "Good news — everything in the Other Brands collection is in stock right now. 🎉", products: [] };
  }

  const named = findProductByName(text);
  const isPriceQ = /\b(price|prices|cost|how much|koto|dam|daam|dhaam|taka|tk|rate)\b/.test(text);
  const isDecantWord = /\b(decant|decants|sample|tester|trial|travel size|try before)\b/.test(text);
  const wantsJudgement = /\b(suggest|recommend|recommendation|option|options|idea|ideas|similar|like|alternative|dupe|clone|vs|versus|compare|which (one|is|should)|better|best|help me (find|pick|choose)|ki nibo|konta|kon ?ta|kemn|kmn)\b/.test(text);

  // Generic "what are decants" — no product, not a judgement ask
  if (isDecantWord && !named && !isPriceQ && !wantsJudgement) {
    return {
      text: "Every fragrance in this collection is sold as a **decant** — a smaller share of the real bottle, so you can try it before committing. Sizes run 5ml → 15ml.\n\nTell me which one you want a decant of and I'll pull the exact price.",
      products: [],
      quickReplies: otherBrandsProducts.slice(0, 4).map((p) => ({ label: `${p.brand} ${p.name}`, value: `${p.brand} ${p.name} price` })),
    };
  }

  // Direct price / decant-price lookup for a confidently-matched product
  if (named && (isPriceQ || (isDecantWord && !wantsJudgement))) {
    return { text: priceLine(named), products: [named] };
  }

  // Bare product mention with no judgement intent — show its card
  if (named && !wantsJudgement && wordCount <= 6) {
    return {
      text: `**${named.brand} — ${named.name}** — ${named.fragranceFamily || named.family}.${named.inStock ? "" : " _(currently out of stock)_"}\n\n${truncate(named.description, 160)}`,
      products: [named],
      quickReplies: [
        { label: "🧪 Decant prices", value: `${named.brand} ${named.name} price` },
        { label: "🔁 Something similar", value: `something similar to ${named.name}` },
      ],
    };
  }

  // Everything else → smart AI
  return null;
}

// ─── Typing dots animation ────────────────────────────────────────────────────

const DOT_STYLE = `
  @keyframes obParvejDot {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-5px); opacity: 1; }
  }
`;

// ─── Bold markdown renderer ───────────────────────────────────────────────────

function renderText(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: "#A66A4C", fontWeight: 600 }}>{part}</strong>
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
  const cheapestSize = SIZE_ORDER[0];

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!product.inStock || added) return;
    onAddToCart({
      id: product.id,
      brand: product.brand,
      name: product.name,
      size: cheapestSize,
      price: product.sizes[cheapestSize],
      family: product.family,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={{
      background: "#FFFBF3",
      border: "1px solid rgba(33,28,24,0.1)",
      borderRadius: "12px",
      padding: "10px 12px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}>
      <div style={{ width: "46px", height: "46px", flexShrink: 0 }}>
        <FragranceBottle product={product} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          color: "#211C18", fontSize: "11px", fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400, marginBottom: "2px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{product.brand} — {product.name}</div>
        <div style={{
          color: "rgba(33,28,24,0.42)", fontSize: "9px",
          fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
          letterSpacing: "0.5px", marginBottom: "4px",
        }}>{product.fragranceFamily || product.family}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#A66A4C", fontSize: "13px", fontFamily: "'Cormorant Garamond', serif" }}>
            {product.startingPrice ? `From ৳${product.startingPrice}` : "Pricing soon"}
          </span>
          {!product.inStock ? (
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
                background: added ? "rgba(166,106,76,0.12)" : "#A66A4C",
                color: added ? "#A66A4C" : "#FFFBF3",
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
  text: "Assalamu Alaikum! I'm **Parvej**, your fragrance guide for Zuhaib's Other Brands collection. 😊\n\nNot sure what to pick? Tell me who it's for, your budget, or the vibe you're after — I'll find your match!",
  products: [],
  quickReplies: [
    ...QUICK_REPLIES.slice(0, 4),
    { label: "🧪 Decant Prices", value: "what are decants" },
  ],
};

export default function ObParvej() {
  const isMobile                = useIsMobile();
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);
  const { addItem }             = useObCart();

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
        const [aiText] = await Promise.all([askParvej(trimmed, history, "other-brands"), minDelay]);
        response = { text: aiText, products: matchProductsInText(aiText) };
      } catch {
        response = {
          text: "I'm having trouble reaching my notes right now — give it a moment and try again. Meanwhile you could ask:\n• \"something woody for men, budget 400\"\n• \"best for a date night\"\n• \"price of Hawas Fire\"",
          products: [],
          quickReplies: QUICK_REPLIES.slice(0, 4),
        };
      }
    }

    setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", ...response }]);
    setTyping(false);
  };

  const orderOnWhatsApp = () => {
    openWhatsAppOrder(
      [{ brand: "Zuhaib Fragrance", name: "General enquiry", size: "-", qty: 1, price: 0 }],
      0
    );
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
          background: "#FFFBF3",
          border: "1px solid rgba(166,106,76,0.22)",
          borderRadius: isMobile ? "20px 20px 0 0" : "20px",
          display: "flex", flexDirection: "column",
          zIndex: 99998,
          boxShadow: "0 24px 80px rgba(33,28,24,0.25), 0 0 0 1px rgba(166,106,76,0.06)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(166,106,76,0.14)",
            display: "flex", alignItems: "center", gap: "12px",
            background: "#F5F0E7", flexShrink: 0,
          }}>
            <Avatar size={40} />
            <div>
              <div style={{
                color: "#211C18", fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.15rem", fontWeight: 400, letterSpacing: "0.5px",
              }}>Parvej</div>
              <div style={{
                color: "rgba(166,106,76,0.8)", fontSize: "8px",
                letterSpacing: "3px", fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
              }}>FRAGRANCE GUIDE</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#4CAF50", boxShadow: "0 0 6px #4CAF50",
              }} />
              <span style={{
                color: "rgba(33,28,24,0.4)", fontSize: "9px",
                fontFamily: "'Montserrat', sans-serif",
              }}>Online</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none", border: "none",
                color: "rgba(33,28,24,0.4)", fontSize: "18px",
                cursor: "pointer", lineHeight: 1, marginLeft: "8px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#A66A4C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(33,28,24,0.4)"; }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 6px",
            display: "flex", flexDirection: "column", gap: "14px",
          }}>
            {messages.map((msg) => (
              <div key={msg.id}>
                <div style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end", gap: "8px",
                }}>
                  {msg.sender === "bot" && <Avatar size={26} />}
                  <div style={{
                    maxWidth: "78%",
                    background: msg.sender === "user"
                      ? "rgba(166,106,76,0.12)"
                      : "rgba(33,28,24,0.04)",
                    border: msg.sender === "user"
                      ? "1px solid rgba(166,106,76,0.3)"
                      : "1px solid rgba(33,28,24,0.08)",
                    borderRadius: msg.sender === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    padding: "9px 13px",
                    color: "rgba(33,28,24,0.85)",
                    fontSize: "11.5px",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300, lineHeight: "1.8",
                    whiteSpace: "pre-line",
                  }}>
                    {renderText(msg.text)}
                  </div>
                </div>

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
                          border: "1px solid rgba(166,106,76,0.32)",
                          color: "#A66A4C", padding: "5px 12px",
                          borderRadius: "999px", cursor: "pointer",
                          fontSize: "10px", fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 500, letterSpacing: "0.3px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(166,106,76,0.1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >{qr.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <Avatar size={26} />
                <div style={{
                  background: "rgba(33,28,24,0.04)",
                  border: "1px solid rgba(33,28,24,0.08)",
                  borderRadius: "16px 16px 16px 4px",
                  padding: "10px 14px", display: "flex", gap: "4px", alignItems: "center",
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: "5px", height: "5px", borderRadius: "50%",
                      background: "rgba(166,106,76,0.6)",
                      animation: `obParvejDot 1.2s ease-in-out ${i * 0.18}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Order on WhatsApp shortcut */}
          <button
            onClick={orderOnWhatsApp}
            style={{
              margin: "0 12px 8px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: "transparent",
              border: "1px solid rgba(33,28,24,0.14)",
              color: "rgba(33,28,24,0.55)",
              borderRadius: "999px", padding: "9px",
              fontSize: "10px", letterSpacing: "1.5px", fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              cursor: "pointer", transition: "all 0.25s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#25d366"; e.currentTarget.style.color = "#25d366"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(33,28,24,0.14)"; e.currentTarget.style.color = "rgba(33,28,24,0.55)"; }}
          >
            ORDER DIRECTLY ON WHATSAPP
          </button>

          {/* Input */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(166,106,76,0.14)",
            display: "flex", gap: "8px", flexShrink: 0,
            background: "#FFFBF3",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask Parvej anything…"
              style={{
                flex: 1, background: "rgba(33,28,24,0.04)",
                border: "1px solid rgba(166,106,76,0.25)",
                borderRadius: "999px", padding: "9px 16px",
                color: "#211C18", fontSize: "11.5px",
                fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
                outline: "none", transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(166,106,76,0.55)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(166,106,76,0.25)"; }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || typing}
              style={{
                width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                background: input.trim() && !typing ? "#A66A4C" : "rgba(166,106,76,0.14)",
                border: "none",
                cursor: input.trim() && !typing ? "pointer" : "default",
                color: input.trim() && !typing ? "#FFFBF3" : "rgba(166,106,76,0.4)",
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
            ? "#FFFBF3"
            : "linear-gradient(135deg, #A66A4C, #6b4028)",
          border: open ? "1px solid rgba(166,106,76,0.4)" : "none",
          color: open ? "#A66A4C" : "#FFFBF3",
          fontSize: "22px",
          cursor: "pointer", zIndex: 99999,
          boxShadow: open
            ? "0 4px 20px rgba(33,28,24,0.15)"
            : "0 4px 24px rgba(166,106,76,0.4)",
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
