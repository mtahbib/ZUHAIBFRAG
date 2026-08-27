import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { COLORS, FONT_SANS, FONT_SERIF, SIZE_ORDER } from "../theme";
import { generateFragranceTheme } from "../fragranceTheme";
import { getProductBySlug, otherBrandsProducts } from "../data/products";
import { useObCart } from "../context/ObCartContext";
import { useWishlist } from "../context/WishlistContext";
import useRecentlyViewed from "../hooks/useRecentlyViewed";
import { getRecommendations, openWhatsAppOrder } from "../utils";
import useIsMobile from "../../hooks/useIsMobile";
import FragranceBottle from "../components/FragranceBottle";
import ObProductRow from "../components/ObProductRow";

const CONTENT_W = 640;

const labelStyle = {
  fontFamily: FONT_SANS,
  fontSize: "10px",
  letterSpacing: "2px",
  color: COLORS.espressoFaint,
  fontWeight: 600,
  textTransform: "uppercase",
  marginBottom: "14px",
};

function SectionLabel({ children, style }) {
  return <div style={{ ...labelStyle, ...style }}>{children}</div>;
}

function PerformanceBar({ label, value, accent }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "1.5px", color: COLORS.espressoSoft, fontWeight: 600, marginBottom: "8px" }}>
        {label.toUpperCase()}
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
              boxShadow: i < value ? `0 0 10px ${accent}40` : "none",
              transition: "all 0.3s ease",
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
        padding: "14px 20px",
        borderRadius: "14px",
        border: `1px solid ${active ? accent : COLORS.espressoHairline}`,
        background: active ? `${accent}15` : "rgba(255,255,255,0.5)",
        transform: active ? "scale(1.01)" : "scale(1)",
        transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: FONT_SANS, fontSize: "9px", letterSpacing: "3px", color: active ? accent : COLORS.espressoSoft, marginBottom: "6px", fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: "1.05rem", color: COLORS.espresso, fontStyle: active ? "italic" : "normal" }}>
        {Array.isArray(notes) && notes.length ? notes.join(" · ") : "Not specified"}
      </div>
    </div>
  );
}

export default function ObProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const isMobile = useIsMobile();
  const { addItem } = useObCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const recentlyViewedSlugs = useRecentlyViewed(product?.slug);

  const [activeSize, setActiveSize] = useState("10ml");
  const [qty, setQty] = useState(1);
  const [hoveredTier, setHoveredTier] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setQty(1);
      const availableSizes = SIZE_ORDER.filter((s) => product.sizes[s]);
      if (!availableSizes.includes(activeSize)) {
        setActiveSize(availableSizes[0] || "10ml");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug]);

  if (!product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.ivory }}>
        <p style={{ fontFamily: FONT_SANS, color: COLORS.espressoSoft }}>Product not found.</p>
      </div>
    );
  }

  // Scent-derived visual atmosphere for this fragrance. Only colours / glow /
  // motion come from here — layout and content are untouched. Cheap + pure,
  // so no memo needed.
  const theme = generateFragranceTheme(product);
  const { accent, soft } = theme;
  const price = product.sizes[activeSize];
  const wishlisted = isWishlisted(product.id);
  const hasPyramid = product.topNotes || product.heartNotes || product.baseNotes;
  const hasPerformance =
    product.longevity !== undefined || product.projection !== undefined || product.versatility !== undefined;

  const recentlyViewed = (recentlyViewedSlugs || [])
    .filter((s) => s !== product.slug)
    .map(getProductBySlug)
    .filter(Boolean);
  const recommendations = getRecommendations(product, otherBrandsProducts, 6);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        brand: product.brand,
        name: product.name,
        size: activeSize,
        price,
        family: product.family,
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const item = { brand: product.brand, name: product.name, size: activeSize, qty, price };
    openWhatsAppOrder([item], price * qty);
  };

  const pill = {
    fontFamily: FONT_SANS,
    fontSize: "11px",
    color: COLORS.espressoSoft,
    padding: "6px 12px",
    border: `1px solid ${COLORS.espressoHairline}`,
    borderRadius: "999px",
  };

  return (
    <div
      style={{
        background: theme.background,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.6s ease",
        // Scent theme exposed as CSS variables for any nested component.
        "--fragrance-primary": theme.primary,
        "--fragrance-secondary": theme.secondary,
        "--fragrance-accent": theme.accent,
        "--fragrance-highlight": theme.highlight,
        "--fragrance-background": theme.background,
        "--fragrance-glow": theme.glow,
        "--fragrance-card": theme.card,
        "--fragrance-border": theme.border,
        "--fragrance-text-accent": theme.textAccent,
      }}
    >
      <style>{`
        @keyframes frBreath {
          0%, 100% { opacity: var(--fr-gmin, 0.2); transform: translate3d(-50%, 0, 0) scale(1); }
          50%      { opacity: var(--fr-gmax, 0.5); transform: translate3d(-50%, 0, 0) scale(1.12); }
        }
        @keyframes frDrift {
          0%, 100% { transform: translate3d(-4%, 0, 0); }
          50%      { transform: translate3d(6%, 3%, 0); }
        }
        @keyframes frRise {
          0%   { opacity: 0; transform: translateY(24px) scale(0.85); }
          18%  { opacity: 0.16; }
          82%  { opacity: 0.1; }
          100% { opacity: 0; transform: translateY(-140px) scale(1); }
        }
        .fr-breath, .fr-drift, .fr-particle { will-change: opacity, transform; }
        @media (prefers-reduced-motion: reduce) {
          .fr-breath, .fr-drift, .fr-particle { animation: none !important; }
        }
      `}</style>

      {/* Ambient scent atmosphere — decorative only, sits behind all content. */}
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {/* Primary glow: slow "breathing" bloom behind the bottle */}
        <div
          className="fr-breath"
          style={{
            position: "absolute",
            top: isMobile ? "-4%" : "-12%",
            left: isMobile ? "50%" : "36%",
            width: isMobile ? "150%" : "68%",
            height: "92vh",
            background: `radial-gradient(circle at center, ${theme.glowSoft} 0%, ${theme.glowFaint} 40%, transparent 68%)`,
            animation: `frBreath ${theme.motion.breath}s ease-in-out infinite`,
            "--fr-gmin": theme.motion.glowMin,
            "--fr-gmax": theme.motion.glowMax,
          }}
        />
        {/* Secondary wash: very slow lateral drift for a sense of moving light */}
        <div
          className="fr-drift"
          style={{
            position: "absolute",
            bottom: "-24%",
            left: "-12%",
            width: isMobile ? "90%" : "76%",
            height: "78vh",
            background: `radial-gradient(ellipse at center, ${theme.secondaryWash} 0%, transparent 62%)`,
            animation: `frDrift ${theme.motion.drift}s ease-in-out infinite`,
          }}
        />
        {/* Minimal warm particles — desktop only, sparse and slow */}
        {!isMobile &&
          theme.motion.particles > 0 &&
          Array.from({ length: theme.motion.particles }).map((_, i) => (
            <span
              key={i}
              className="fr-particle"
              style={{
                position: "absolute",
                bottom: "10%",
                left: `${12 + i * (74 / theme.motion.particles)}%`,
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: theme.particleColor,
                filter: "blur(0.5px)",
                animation: `frRise ${19 + i * 3}s linear ${i * 2.6}s infinite`,
              }}
            />
          ))}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1180px",
          margin: "0 auto",
          padding: isMobile ? "100px 20px 56px" : "132px 60px 72px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "36px" : "72px",
          alignItems: "flex-start",
        }}
      >
        {/* Left: Bottle */}
        <div style={{ flex: "0 0 auto", width: isMobile ? "100%" : "420px", position: isMobile ? "static" : "sticky", top: "120px" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "24px",
              padding: "40px",
              background: `linear-gradient(135deg, ${soft} 0%, ${theme.highlight} 55%, rgba(255,255,255,0.4) 100%)`,
              boxShadow: `0 26px 60px -14px ${theme.glowFaint}, 0 8px 24px ${accent}12, inset 0 2px 4px rgba(255,255,255,0.6)`,
              transition: "box-shadow 0.6s ease, background 0.6s ease",
            }}
          >
            <FragranceBottle product={product} />
          </div>
        </div>

        {/* Right: Info */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: CONTENT_W, display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Header */}
          <div>
            <div style={{ fontFamily: FONT_SANS, fontSize: "11px", letterSpacing: "2.5px", color: COLORS.espressoSoft, marginBottom: "10px", fontWeight: 600 }}>
              {product.brand.toUpperCase()}
            </div>
            <h1 style={{ fontFamily: FONT_SERIF, fontSize: isMobile ? "2.5rem" : "3.4rem", fontWeight: 400, color: COLORS.espresso, margin: "0 0 14px", lineHeight: 1.1 }}>
              {product.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "1px", color: accent, background: soft, padding: "6px 12px", borderRadius: "999px", fontWeight: 600, border: `1px solid ${accent}30` }}>
                {product.family.toUpperCase()}
              </span>
              <span style={pill}>{product.concentration}</span>
              <span style={pill}>{product.gender}</span>
            </div>
          </div>

          {/* Inspiration + description */}
          <div>
            {product.inspiredBy && (
              <div
                style={{
                  display: "inline-block",
                  marginBottom: "16px",
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.6)",
                  borderLeft: `3px solid ${accent}`,
                  borderRadius: "4px 8px 8px 4px",
                  fontFamily: FONT_SANS,
                  fontSize: "12.5px",
                }}
              >
                <span style={{ color: COLORS.espressoSoft, marginRight: "6px" }}>Vibe &amp; Inspiration:</span>
                <strong style={{ color: COLORS.espresso }}>{product.inspiredBy}</strong>
              </div>
            )}
            <p style={{ fontFamily: FONT_SANS, fontWeight: 300, fontSize: "14.5px", color: COLORS.espressoSoft, lineHeight: 1.8, margin: 0 }}>
              {product.description}
            </p>
          </div>

          {/* Buy box */}
          <div
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: "18px",
              padding: isMobile ? "20px" : "24px",
              background: `linear-gradient(180deg, ${theme.card}, rgba(255,255,255,0.6))`,
              backdropFilter: "blur(6px)",
            }}
          >
            <SectionLabel>Select size</SectionLabel>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {SIZE_ORDER.map((size) => {
                if (!product.sizes[size]) return null;
                const active = size === activeSize;
                return (
                  <button
                    key={size}
                    onClick={() => setActiveSize(size)}
                    style={{
                      fontFamily: FONT_SANS,
                      padding: "10px 16px",
                      borderRadius: "12px",
                      border: `2px solid ${active ? COLORS.espresso : "transparent"}`,
                      background: active ? COLORS.white : "rgba(255,255,255,0.65)",
                      color: COLORS.espresso,
                      boxShadow: active ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      minWidth: "74px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{size}</div>
                    <div style={{ fontSize: "11px", color: COLORS.espressoSoft, marginTop: "2px" }}>৳{product.sizes[size]}</div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", margin: "20px 0 16px", flexWrap: "wrap" }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: "2.1rem", color: COLORS.espresso, lineHeight: 1 }}>৳{price}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", background: COLORS.white, border: `1px solid ${COLORS.espressoHairline}`, borderRadius: "999px", padding: "8px 16px" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}>−</button>
                <span style={{ fontFamily: FONT_SANS, fontSize: "14px", fontWeight: 600, color: COLORS.espresso, width: "16px", textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} style={qtyBtn}>+</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexDirection: isMobile ? "column" : "row" }}>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{ ...ctaBtn, flex: 1, color: COLORS.white, background: COLORS.espresso, opacity: product.inStock ? 1 : 0.4, cursor: product.inStock ? "pointer" : "not-allowed", boxShadow: "0 8px 20px rgba(33,28,24,0.15)" }}
                onMouseEnter={(e) => { if (product.inStock) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 24px rgba(33,28,24,0.18), 0 0 26px ${theme.glow}44`; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(33,28,24,0.15)"; }}
              >
                {justAdded ? "ADDED ✓" : "ADD TO CART"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                style={{ ...ctaBtn, flex: 1, color: "#fff", background: "#25d366", opacity: product.inStock ? 1 : 0.4, cursor: product.inStock ? "pointer" : "not-allowed", boxShadow: "0 8px 20px rgba(37,211,102,0.2)" }}
                onMouseEnter={(e) => { if (product.inStock) { e.currentTarget.style.background = "#1ebc59"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#25d366"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                WHATSAPP
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                title="Wishlist"
                style={{
                  width: "52px",
                  height: "52px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: wishlisted ? COLORS.copper : COLORS.espressoSoft,
                  background: COLORS.white,
                  border: `1px solid ${wishlisted ? COLORS.copper : COLORS.espressoHairline}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
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

          {/* Main accords */}
          {product.mainAccords && product.mainAccords.length > 0 && (
            <div>
              <SectionLabel>Main accords</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {product.mainAccords.map((accord, i) => (
                  <div
                    key={accord}
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: "11px",
                      padding: "6px 14px",
                      background: i === 0 ? accent : COLORS.white,
                      color: i === 0 ? COLORS.white : COLORS.espresso,
                      border: i === 0 ? "none" : `1px solid ${COLORS.espressoHairline}`,
                      borderRadius: "6px",
                      boxShadow: i === 0 ? `0 4px 10px ${accent}40` : "none",
                    }}
                  >
                    {accord}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fragrance pyramid */}
          {hasPyramid && (
            <div>
              <SectionLabel>Fragrance pyramid</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {product.topNotes && product.topNotes.length > 0 && (
                  <PyramidTier label="TOP NOTES" notes={product.topNotes} accent={theme.pyramid.top} active={hoveredTier === "TOP NOTES"} onHover={setHoveredTier} />
                )}
                {product.heartNotes && product.heartNotes.length > 0 && (
                  <PyramidTier label="HEART NOTES" notes={product.heartNotes} accent={theme.pyramid.heart} active={hoveredTier === "HEART NOTES"} onHover={setHoveredTier} />
                )}
                {product.baseNotes && product.baseNotes.length > 0 && (
                  <PyramidTier label="BASE NOTES" notes={product.baseNotes} accent={theme.pyramid.base} active={hoveredTier === "BASE NOTES"} onHover={setHoveredTier} />
                )}
              </div>
            </div>
          )}

          {/* Performance + best for */}
          {(hasPerformance || product.bestOccasions) && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "28px" }}>
              {hasPerformance && (
                <div>
                  <SectionLabel>Performance</SectionLabel>
                  {product.longevity !== undefined && <PerformanceBar label="Longevity" value={product.longevity} accent={accent} />}
                  {product.projection !== undefined && <PerformanceBar label="Projection" value={product.projection} accent={accent} />}
                  {product.versatility !== undefined && <PerformanceBar label="Versatility" value={product.versatility} accent={accent} />}
                </div>
              )}
              {product.bestOccasions && (
                <div>
                  <SectionLabel>Best for</SectionLabel>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: "15px", color: COLORS.espresso, fontStyle: "italic", lineHeight: 1.7 }}>
                    {product.bestOccasions.join(" · ")}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <ObProductRow eyebrow="YOU MAY ALSO LIKE" title="Pairs well with your taste." products={recommendations} background={COLORS.white} />
        {recentlyViewed.length > 0 && (
          <ObProductRow eyebrow="RECENTLY VIEWED" title="Where you left off." products={recentlyViewed} background={theme.background} />
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
  justifyContent: "center",
};

const ctaBtn = {
  fontFamily: FONT_SANS,
  fontSize: "12px",
  letterSpacing: "1.5px",
  fontWeight: 600,
  border: "none",
  borderRadius: "12px",
  padding: "18px 28px",
  transition: "all 0.25s ease",
};
