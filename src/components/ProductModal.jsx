import { useEffect, useRef, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";
import { useCart } from "../context/CartContext";

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function ProductModal({ product, onClose }) {
  const isMobile = useIsMobile();
  const modalRef = useRef(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const accent    = product?.themeColor || "#D4AF37";
  const accentRgb = product?.themeColor ? hexToRgb(product.themeColor) : "212,175,55";

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  // Use structured notes if available, else parse from notes string
  const hasStructuredNotes = product.topNotes || product.heartNotes || product.baseNotes;
  const simplePills = hasStructuredNotes ? [] : product.notes.split(/[•,]/).map((n) => n.trim()).filter(Boolean);

  const whatsappMessage = encodeURIComponent(
    `Assalamu Alaikum,\n\nI would like to order:\n\n${product.name}\nPrice: ${product.price}\n\nPlease provide availability.`
  );

  const pillStyle = {
    background: `rgba(${accentRgb},0.08)`,
    border: `1px solid rgba(${accentRgb},0.25)`,
    color: accent,
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "10px",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 400,
    letterSpacing: "1px",
  };

  const labelStyle = {
    color: "rgba(255,255,255,0.25)",
    fontSize: "8px",
    letterSpacing: "4px",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    marginBottom: "8px",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 99999, padding: "20px",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "1080px",
          maxHeight: "92vh",
          overflowX: "hidden", overflowY: "auto",
          background: "linear-gradient(135deg, #0d0d0d 0%, #111 100%)",
          borderRadius: isMobile ? "20px" : "28px",
          border: `1px solid rgba(${accentRgb},0.25)`,
          boxShadow: `0 0 80px rgba(${accentRgb},0.1), 0 40px 120px rgba(0,0,0,0.6)`,
          animation: "float-up 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.7), transparent)`,
        }} />

        {/* Close */}
        <button
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          style={{
            position: "absolute", top: "20px", right: "22px",
            background: "none", border: "none",
            color: "rgba(255,255,255,0.35)", fontSize: "22px",
            cursor: "pointer", lineHeight: 1, transition: "color 0.3s ease", zIndex: 2,
          }}
        >✕</button>

        {/* Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr",
          minHeight: isMobile ? "auto" : "540px",
        }}>
          {/* Left — image */}
          <div style={{
            background: `radial-gradient(circle at center, rgba(${accentRgb},0.08) 0%, transparent 70%)`,
            display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            padding: isMobile ? "40px 28px 24px" : "60px 40px",
            borderRight: isMobile ? "none" : `1px solid rgba(${accentRgb},0.12)`,
            borderBottom: isMobile ? `1px solid rgba(${accentRgb},0.12)` : "none",
            position: "relative",
          }}>
            {/* Category badge */}
            <div style={{
              position: "absolute", top: "22px", left: "22px",
              background: `rgba(${accentRgb},0.1)`,
              border: `1px solid rgba(${accentRgb},0.3)`,
              color: accent, fontSize: "8px", letterSpacing: "3px",
              padding: "5px 12px", borderRadius: "999px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600, textTransform: "uppercase",
            }}>
              {product.category}
            </div>

            {/* Fragrance family badge */}
            {product.fragranceFamily && (
              <div style={{
                position: "absolute", top: "22px", right: "22px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.3)", fontSize: "7px", letterSpacing: "2px",
                padding: "5px 10px", borderRadius: "999px",
                fontFamily: "'Montserrat', sans-serif", fontWeight: 400,
              }}>
                {product.fragranceFamily}
              </div>
            )}

            <img
              src={product.modalImage || product.image}
              alt={product.name}
              style={{
                width: "280px", maxWidth: "88%",
                filter: `drop-shadow(0 0 70px rgba(${accentRgb},0.45)) drop-shadow(0 0 20px rgba(${accentRgb},0.18))`,
              }}
            />

            <div style={{
              marginTop: "28px", color: accent,
              fontSize: "2.2rem", fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400, letterSpacing: "1px",
            }}>
              {product.price}
            </div>

            {/* Tagline */}
            {product.tagline && (
              <div style={{
                marginTop: "12px",
                color: `rgba(${accentRgb},0.55)`,
                fontSize: "9px", letterSpacing: "2px",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic", textAlign: "center",
              }}>
                "{product.tagline}"
              </div>
            )}
          </div>

          {/* Right — details */}
          <div style={{
            padding: isMobile ? "30px 28px 36px" : "50px 48px 50px",
            display: "flex", flexDirection: "column",
            justifyContent: "center", gap: "0",
            overflowY: "auto",
          }}>
            <h2 style={{
              color: "#fff", fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400, lineHeight: 1.2, margin: 0, paddingRight: "30px",
            }}>
              {product.name}
            </h2>

            <div style={{
              width: "45px", height: "1px",
              background: `linear-gradient(90deg, ${accent}, transparent)`,
              margin: "18px 0",
            }} />

            {product.inspiration && (
              <div style={{ marginBottom: "16px" }}>
                <div style={labelStyle}>ORIGINAL INSPIRATION</div>
                <div style={{
                  color: `rgba(${accentRgb},0.7)`,
                  fontSize: "11px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.5px",
                }}>
                  {product.inspiration}
                </div>
              </div>
            )}

            <p style={{
              color: "rgba(255,255,255,0.45)", fontSize: "12px",
              fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
              lineHeight: "2", letterSpacing: "0.4px", margin: 0,
            }}>
              {product.description}
            </p>

            {/* Structured top/heart/base notes */}
            {hasStructuredNotes && (
              <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={labelStyle}>FRAGRANCE NOTES</div>
                {[
                  { tier: "TOP", notes: product.topNotes },
                  { tier: "HEART", notes: product.heartNotes },
                  { tier: "BASE", notes: product.baseNotes },
                ].map(({ tier, notes }) => notes?.length > 0 && (
                  <div key={tier} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{
                      color: `rgba(${accentRgb},0.5)`, fontSize: "7px",
                      letterSpacing: "3px", fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600, paddingTop: "5px", minWidth: "32px",
                    }}>{tier}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {notes.map((n) => <span key={n} style={pillStyle}>{n}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Simple pills fallback */}
            {!hasStructuredNotes && simplePills.length > 0 && (
              <div style={{ marginTop: "22px" }}>
                <div style={labelStyle}>FRAGRANCE NOTES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {simplePills.map((n) => <span key={n} style={pillStyle}>{n}</span>)}
                </div>
              </div>
            )}

            {/* Perfect For */}
            {product.perfectFor?.length > 0 && (
              <div style={{ marginTop: "18px" }}>
                <div style={labelStyle}>PERFECT FOR</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {product.perfectFor.map((item) => (
                    <span key={item} style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.45)",
                      padding: "4px 12px", borderRadius: "999px",
                      fontSize: "9px", fontFamily: "'Montserrat', sans-serif",
                      letterSpacing: "1px",
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Performance */}
            {product.performance?.length > 0 && (
              <div style={{ marginTop: "18px" }}>
                <div style={labelStyle}>PERFORMANCE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {product.performance.map((item) => (
                    <div key={item} style={{
                      color: "rgba(255,255,255,0.38)", fontSize: "10px",
                      fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
                      letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <span style={{ color: accent, fontSize: "6px" }}>◆</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "28px" }}>
              <button
                onClick={product.soldOut ? undefined : handleAddToCart}
                disabled={product.soldOut}
                style={{
                  background: product.soldOut ? "rgba(220,50,50,0.08)" : added ? `rgba(${accentRgb},0.15)` : accent,
                  color: product.soldOut ? "#E05555" : added ? accent : "#000",
                  border: product.soldOut ? "1px solid rgba(220,50,50,0.35)" : added ? `1px solid ${accent}` : "none",
                  padding: "16px", borderRadius: "999px",
                  fontWeight: 700, fontSize: "11px", letterSpacing: "4px",
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: product.soldOut ? "not-allowed" : "pointer",
                  transition: "all 0.35s ease", width: "100%",
                  opacity: product.soldOut ? 0.8 : 1,
                }}
                onMouseEnter={(e) => { if (!added && !product.soldOut) e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={(e) => { if (!added && !product.soldOut) e.currentTarget.style.background = accent; }}
              >
                {product.soldOut ? "CURRENTLY UNAVAILABLE" : added ? "ADDED TO CART ✓" : "ADD TO CART"}
              </button>

              <a
                href={`https://wa.me/8801790221253?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block", textAlign: "center",
                  background: "transparent", color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "14px", borderRadius: "999px",
                  textDecoration: "none", fontWeight: 500,
                  fontSize: "10px", letterSpacing: "3px",
                  fontFamily: "'Montserrat', sans-serif",
                  transition: "all 0.35s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#25d366"; e.currentTarget.style.color = "#25d366"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
              >
                ORDER DIRECTLY ON WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
