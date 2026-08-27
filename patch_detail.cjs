const fs = require('fs');

const code = `import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { COLORS, FONT_SANS, FONT_SERIF, SIZE_ORDER, familyTheme } from "../theme";
import { getProductBySlug, otherBrandsProducts } from "../data/products";
import { useObCart } from "../context/ObCartContext";
import { useWishlist } from "../context/WishlistContext";
import useRecentlyViewed from "../hooks/useRecentlyViewed";
import { getRecommendations, openWhatsAppOrder } from "../utils";
import useIsMobile from "../../hooks/useIsMobile";
import FragranceBottle from "../components/FragranceBottle";
import ObProductRow from "../components/ObProductRow";

function PerformanceBar({ label, value, accent }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "1.5px", color: COLORS.espressoSoft, fontWeight: 600 }}>
          {label.toUpperCase()}
        </span>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "6px",
              borderRadius: "4px",
              background: i < value ? accent : COLORS.espressoHairline,
              boxShadow: i < value ? \`0 0 10px \${accent}40\` : 'none',
              transition: "all 0.3s ease"
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PyramidTier({ label, notes, accent, active, onHover }) {
  return (
    <div
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
      style={{
        padding: "16px 20px",
        borderRadius: "14px",
        border: \`1px solid \${active ? accent : COLORS.espressoHairline}\`,
        background: active ? \`\${accent}15\` : "rgba(255,255,255,0.4)",
        backdropFilter: "blur(4px)",
        transform: active ? "scale(1.02)" : "scale(1)",
        transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: FONT_SANS, fontSize: "9px", letterSpacing: "3px", color: active ? accent : COLORS.espressoSoft, marginBottom: "8px", fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: "1.1rem", color: COLORS.espresso, fontStyle: active ? "italic" : "normal" }}>
        {notes.join(" · ")}
      </div>
    </div>
  );
}

export default function ObProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const isMobile = useIsMobile();
  const { addToCart } = useObCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addRecentlyViewed, recentlyViewedSlugs } = useRecentlyViewed();

  const [activeSize, setActiveSize] = useState("10ml");
  const [qty, setQty] = useState(1);
  const [hoveredTier, setHoveredTier] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      addRecentlyViewed(product.slug);
      setQty(1);
      const availableSizes = SIZE_ORDER.filter((s) => product.sizes[s]);
      if (!availableSizes.includes(activeSize)) {
        setActiveSize(availableSizes[0] || "10ml");
      }
    }
  }, [product?.slug]);

  if (!product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.ivory }}>
        <p style={{ fontFamily: FONT_SANS, color: COLORS.espressoSoft }}>Product not found.</p>
      </div>
    );
  }

  const { accent, soft } = familyTheme(product.family);
  const price = product.sizes[activeSize];
  const wishlisted = isWishlisted(product.id);

  const recentlyViewed = recentlyViewedSlugs
    .filter((s) => s !== product.slug)
    .map(getProductBySlug)
    .filter(Boolean);
  const recommendations = getRecommendations(product, otherBrandsProducts, 6);

  const handleAddToCart = () => {
    addToCart(product, activeSize, qty, price);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    openWhatsAppOrder(product.name, activeSize, qty, price);
  };

  return (
    <div style={{ background: COLORS.ivory, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Ambient background glow based on fragrance family */}
      <div style={{
        position: "absolute", top: "-10%", left: isMobile ? "-20%" : "30%", width: "100%", height: "100vh",
        background: \`radial-gradient(circle at center, \${accent}22 0%, transparent 60%)\`,
        pointerEvents: "none", zIndex: 0
      }} />

      <div style={{
        position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto",
        padding: isMobile ? "100px 20px 60px" : "140px 60px 80px",
        display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "40px" : "80px", alignItems: "flex-start",
      }}>
        {/* Left: Bottle Image */}
        <div style={{ flex: "0 0 auto", width: isMobile ? "100%" : "440px", position: "sticky", top: "120px" }}>
          <div style={{
            position: "relative", borderRadius: "24px", padding: "40px",
            background: \`linear-gradient(135deg, \${soft} 0%, rgba(255,255,255,0.4) 100%)\`,
            boxShadow: \`0 20px 40px \${accent}15, inset 0 2px 4px rgba(255,255,255,0.6)\`,
            backdropFilter: "blur(10px)"
          }}>
            <FragranceBottle product={product} />
          </div>
        </div>

        {/* Right: Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: "11px", letterSpacing: "2.5px", color: COLORS.espressoSoft, marginBottom: "12px", fontWeight: 600 }}>
            {product.brand.toUpperCase()}
          </div>
          <h1 style={{ fontFamily: FONT_SERIF, fontSize: isMobile ? "2.5rem" : "3.5rem", fontWeight: 400, color: COLORS.espresso, margin: "0 0 16px", lineHeight: 1.1 }}>
            {product.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "1px", color: accent, background: soft, padding: "6px 12px", borderRadius: "999px", fontWeight: 600, border: \`1px solid \${accent}30\` }}>
              {product.family.toUpperCase()}
            </span>
            <span style={{ fontFamily: FONT_SANS, fontSize: "11px", color: COLORS.espressoSoft, padding: "6px 12px", border: \`1px solid \${COLORS.espressoHairline}\`, borderRadius: "999px" }}>
              {product.concentration}
            </span>
            <span style={{ fontFamily: FONT_SANS, fontSize: "11px", color: COLORS.espressoSoft, padding: "6px 12px", border: \`1px solid \${COLORS.espressoHairline}\`, borderRadius: "999px" }}>
              {product.gender}
            </span>
          </div>

          {/* Inspiration Banner */}
          {product.inspiredBy && (
            <div style={{
              display: "inline-block", marginBottom: "24px", padding: "10px 16px",
              background: "rgba(255,255,255,0.6)", borderLeft: \`3px solid \${accent}\`,
              borderRadius: "4px 8px 8px 4px", fontFamily: FONT_SANS, fontSize: "12.5px"
            }}>
              <span style={{ color: COLORS.espressoSoft, marginRight: "6px" }}>Vibe & Inspiration:</span>
              <strong style={{ color: COLORS.espresso }}>{product.inspiredBy}</strong>
            </div>
          )}

          <p style={{ fontFamily: FONT_SANS, fontWeight: 300, fontSize: "14.5px", color: COLORS.espressoSoft, lineHeight: 1.8, marginBottom: "32px", maxWidth: "560px" }}>
            {product.description}
          </p>

          {/* Main Accords Visualizer */}
          {product.mainAccords && product.mainAccords.length > 0 && (
            <div style={{ marginBottom: "40px" }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "2px", color: COLORS.espressoFaint, marginBottom: "14px", fontWeight: 600 }}>
                MAIN ACCORDS
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxWidth: "560px" }}>
                {product.mainAccords.map((accord, i) => (
                  <div key={accord} style={{
                    fontFamily: FONT_SANS, fontSize: "11px", padding: "6px 14px",
                    background: i === 0 ? accent : COLORS.white,
                    color: i === 0 ? COLORS.white : COLORS.espresso,
                    border: i === 0 ? "none" : \`1px solid \${COLORS.espressoHairline}\`,
                    borderRadius: "6px", boxShadow: i === 0 ? \`0 4px 10px \${accent}40\` : 'none'
                  }}>
                    {accord}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid for Pyramid & Performance */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: "40px", marginBottom: "40px", maxWidth: "800px" }}>
            
            {/* Fragrance pyramid */}
            <div>
              <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "2px", color: COLORS.espressoFaint, marginBottom: "16px", fontWeight: 600 }}>
                FRAGRANCE PYRAMID
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <PyramidTier label="TOP NOTES" notes={product.topNotes} accent={accent} active={hoveredTier === "TOP NOTES"} onHover={setHoveredTier} />
                <div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>
                <PyramidTier label="HEART NOTES" notes={product.heartNotes} accent={accent} active={hoveredTier === "HEART NOTES"} onHover={setHoveredTier} />
                <div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>
                <PyramidTier label="BASE NOTES" notes={product.baseNotes} accent={accent} active={hoveredTier === "BASE NOTES"} onHover={setHoveredTier} />
              </div>
            </div>

            {/* Performance & Occasions */}
            <div>
              <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "2px", color: COLORS.espressoFaint, marginBottom: "16px", fontWeight: 600 }}>
                PERFORMANCE
              </div>
              <PerformanceBar label="Longevity" value={product.longevity} accent={accent} />
              <PerformanceBar label="Projection" value={product.projection} accent={accent} />
              <PerformanceBar label="Versatility" value={product.versatility} accent={accent} />

              {product.bestOccasions && (
                <div style={{ marginTop: "30px" }}>
                  <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "2px", color: COLORS.espressoFaint, marginBottom: "12px", fontWeight: 600 }}>
                    BEST FOR
                  </div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: "15px", color: COLORS.espresso, fontStyle: "italic", lineHeight: 1.6 }}>
                    {product.bestOccasions.join(" · ")}
                  </div>
                </div>
              )}
            </div>

          </div>

          <hr style={{ border: "none", borderTop: \`1px solid \${COLORS.espressoHairline}\`, margin: "0 0 32px 0", maxWidth: "800px" }} />

          {/* Purchase Area */}
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "40px", alignItems: isMobile ? "stretch" : "flex-end", maxWidth: "800px" }}>
            
            {/* Size selector */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "2px", color: COLORS.espressoFaint, marginBottom: "14px", fontWeight: 600 }}>
                SELECT SIZE
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {SIZE_ORDER.map((size) => {
                  if (!product.sizes[size]) return null;
                  const active = size === activeSize;
                  return (
                    <button
                      key={size}
                      onClick={() => setActiveSize(size)}
                      style={{
                        fontFamily: FONT_SANS,
                        padding: "14px 20px",
                        borderRadius: "12px",
                        border: \`2px solid \${active ? COLORS.espresso : "transparent"}\`,
                        background: active ? COLORS.white : "rgba(255,255,255,0.5)",
                        color: COLORS.espresso,
                        boxShadow: active ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        minWidth: "86px",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{size}</div>
                      <div style={{ fontSize: "11px", color: COLORS.espressoSoft, marginTop: "4px" }}>৳{product.sizes[size]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Add */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "20px" }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: "2.2rem", color: COLORS.espresso }}>৳{price}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", background: COLORS.white, border: \`1px solid \${COLORS.espressoHairline}\`, borderRadius: "999px", padding: "8px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}>−</button>
                  <span style={{ fontFamily: FONT_SANS, fontSize: "14px", fontWeight: 600, color: COLORS.espresso, width: "16px", textAlign: "center" }}>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} style={qtyBtn}>+</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  style={{
                    flex: 1,
                    fontFamily: FONT_SANS, fontSize: "12px", letterSpacing: "1.5px", fontWeight: 600,
                    color: COLORS.white, background: COLORS.espresso, border: "none",
                    borderRadius: "12px", padding: "18px 32px", cursor: product.inStock ? "pointer" : "not-allowed",
                    opacity: product.inStock ? 1 : 0.4, transition: "all 0.25s ease",
                    boxShadow: "0 8px 20px rgba(33,28,24,0.15)"
                  }}
                  onMouseEnter={(e) => { if(product.inStock) e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {justAdded ? "ADDED ✓" : "ADD TO CART"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  style={{
                    flex: 1,
                    fontFamily: FONT_SANS, fontSize: "12px", letterSpacing: "1.5px", fontWeight: 600,
                    color: "#fff", background: "#25d366", border: "none",
                    borderRadius: "12px", padding: "18px 32px", cursor: product.inStock ? "pointer" : "not-allowed",
                    opacity: product.inStock ? 1 : 0.4, transition: "all 0.25s ease",
                    boxShadow: "0 8px 20px rgba(37,211,102,0.2)"
                  }}
                  onMouseEnter={(e) => { if(product.inStock) { e.currentTarget.style.background = "#1ebc59"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#25d366"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  WHATSAPP
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  title="Wishlist"
                  style={{
                    width: "52px", height: "52px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: wishlisted ? COLORS.copper : COLORS.espressoSoft, background: COLORS.white,
                    border: \`1px solid \${wishlisted ? COLORS.copper : COLORS.espressoHairline}\`, borderRadius: "12px", cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? COLORS.copper : "none"} stroke={wishlisted ? COLORS.copper : "currentColor"} strokeWidth="2">
                    <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.2 2 4.5 5.6 4c2.1-.3 4 .8 6.4 3.2C14.4 4.8 16.3 3.7 18.4 4c3.6.5 5.3 4.2 3.6 7.9C19.5 16.4 12 21 12 21z" />
                  </svg>
                </button>
              </div>
              {!product.inStock && (
                <div style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.copper, marginTop: "12px", textAlign: "center" }}>
                  Currently out of stock
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <ObProductRow eyebrow="YOU MAY ALSO LIKE" title="Pairs well with your taste." products={recommendations} background={COLORS.white} />
        {recentlyViewed.length > 0 && (
          <ObProductRow eyebrow="RECENTLY VIEWED" title="Where you left off." products={recentlyViewed} background={COLORS.ivory} />
        )}
      </div>
    </div>
  );
}

const qtyBtn = {
  background: "none",
  border: "none",
  color: COLORS.espresso,
  fontSize: "18px",
  cursor: "pointer",
  width: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
`;

fs.writeFileSync('src/otherBrands/pages/ObProductDetail.jsx', code);
