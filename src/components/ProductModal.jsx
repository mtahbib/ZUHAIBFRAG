import { useEffect, useRef, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";
import { useCart } from "../context/CartContext";

export default function ProductModal({ product, onClose }) {
  const isMobile = useIsMobile();
  const modalRef = useRef(null);
  const [hovBtn, setHovBtn] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  const notePills = product.notes
    .split(/[•,]/)
    .map((n) => n.trim())
    .filter(Boolean);

  const whatsappMessage = encodeURIComponent(
    `Assalamu Alaikum,\n\nI would like to order:\n\n${product.name}\nPrice: ${product.price}\n\nPlease provide availability.`
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        padding: "20px",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "860px",
          maxHeight: isMobile ? "90vh" : "none",
          overflowY: isMobile ? "auto" : "visible",
          background: "linear-gradient(135deg, #0d0d0d 0%, #111 100%)",
          borderRadius: isMobile ? "20px" : "28px",
          border: "1px solid rgba(212,175,55,0.25)",
          boxShadow:
            "0 0 80px rgba(212,175,55,0.08), 0 40px 120px rgba(0,0,0,0.6)",
          overflow: "hidden",
          animation: "float-up 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
          position: "relative",
        }}
      >
        {/* Top gradient accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          style={{
            position: "absolute",
            top: "20px",
            right: "22px",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.35)",
            fontSize: "22px",
            cursor: "none",
            lineHeight: 1,
            transition: "color 0.3s ease",
            zIndex: 2,
          }}
        >
          ✕
        </button>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.3fr",
            minHeight: isMobile ? "auto" : "420px",
          }}
        >
          {/* Left — image panel */}
          <div
            style={{
              background:
                "radial-gradient(circle at center, rgba(212,175,55,0.07) 0%, transparent 70%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: isMobile ? "36px 24px 20px" : "50px 30px",
              borderRight: isMobile ? "none" : "1px solid rgba(212,175,55,0.1)",
              borderBottom: isMobile ? "1px solid rgba(212,175,55,0.1)" : "none",
              position: "relative",
            }}
          >
            {/* Category badge */}
            <div
              style={{
                position: "absolute",
                top: "22px",
                left: "22px",
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.25)",
                color: "#D4AF37",
                fontSize: "8px",
                letterSpacing: "3px",
                padding: "5px 12px",
                borderRadius: "999px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {product.category}
            </div>

            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "200px",
                maxWidth: "85%",
                filter:
                  "drop-shadow(0 0 50px rgba(212,175,55,0.4)) drop-shadow(0 0 15px rgba(212,175,55,0.15))",
              }}
            />

            {/* Price below image */}
            <div
              style={{
                marginTop: "24px",
                color: "#D4AF37",
                fontSize: "1.8rem",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                letterSpacing: "1px",
              }}
            >
              {product.price}
            </div>
          </div>

          {/* Right — details panel */}
          <div
            style={{
              padding: isMobile ? "28px 24px 32px" : "50px 44px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "0",
            }}
          >
            {/* Product name */}
            <h2
              style={{
                color: "#fff",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                lineHeight: 1.2,
                margin: 0,
                paddingRight: "30px",
              }}
            >
              {product.name}
            </h2>

            {/* Gold divider */}
            <div
              style={{
                width: "45px",
                height: "1px",
                background: "linear-gradient(90deg, #D4AF37, transparent)",
                margin: "20px 0",
              }}
            />

            {/* Description */}
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "13px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                lineHeight: "2",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              {product.description}
            </p>

            {/* Notes section */}
            <div style={{ marginTop: "24px" }}>
              <div
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: "8px",
                  letterSpacing: "4px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                FRAGRANCE NOTES
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {notePills.map((note) => (
                  <span
                    key={note}
                    style={{
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.2)",
                      color: "rgba(212,175,55,0.85)",
                      padding: "5px 14px",
                      borderRadius: "999px",
                      fontSize: "10px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "1px",
                    }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "32px" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  background: added ? "rgba(212,175,55,0.15)" : "#D4AF37",
                  color: added ? "#D4AF37" : "#000",
                  border: added ? "1px solid #D4AF37" : "none",
                  padding: "16px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "4px",
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => { if (!added) e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={(e) => { if (!added) e.currentTarget.style.background = "#D4AF37"; }}
              >
                {added ? "ADDED TO CART ✓" : "ADD TO CART"}
              </button>

              <a
                href={`https://wa.me/8801790221253?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "transparent",
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "14px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "10px",
                  letterSpacing: "3px",
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
