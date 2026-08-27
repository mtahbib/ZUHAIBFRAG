import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, FONT_SANS, FONT_SERIF, SIZE_ORDER } from "../theme";
import { useObCart } from "../context/ObCartContext";
import { useWishlist } from "../context/WishlistContext";
import FragranceBottle from "./FragranceBottle";
import { navigateWithTransition } from "../viewTransition";

export default function ObProductCard({ product }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useObCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const cheapestSize = SIZE_ORDER[0];
  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addItem({
      id: product.id,
      brand: product.brand,
      name: product.name,
      size: cheapestSize,
      price: product.sizes[cheapestSize],
      family: product.family,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigateWithTransition(navigate, `/other-brands/product/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: "18px",
        background: COLORS.white,
        border: hovered ? `1px solid rgba(166,106,76,0.3)` : `1px solid ${COLORS.espressoHairline}`,
        overflow: "hidden",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 22px 46px rgba(33,28,24,0.12), 0 0 0 3px rgba(166,106,76,0.05)" : "0 1px 0 rgba(33,28,24,0.03)",
      }}
    >
      {/* Badges */}
      <div style={{ position: "absolute", top: "14px", left: "14px", zIndex: 10, display: "flex", gap: "6px" }}>
        {product.bestseller && <Badge label="BESTSELLER" bg={COLORS.espresso} color={COLORS.ivory} />}
        {product.newArrival && <Badge label="NEW" bg={COLORS.copper} color={COLORS.ivory} />}
        {!product.inStock && <Badge label="SOLD OUT" bg={COLORS.white} color={COLORS.espressoFaint} border />}
      </div>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        aria-label="Toggle wishlist"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 10,
          background: "rgba(255,255,255,0.85)",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill={wishlisted ? COLORS.copper : "none"}
          stroke={wishlisted ? COLORS.copper : COLORS.espresso}
          strokeWidth="1.8"
        >
          <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.2 2 4.5 5.6 4c2.1-.3 4 .8 6.4 3.2C14.4 4.8 16.3 3.7 18.4 4c3.6.5 5.3 4.2 3.6 7.9C19.5 16.4 12 21 12 21z" />
        </svg>
      </button>

      {/* Image */}
      <div style={{ padding: "22px 14px 0", overflow: "hidden" }}>
        <div style={{ transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s ease" }}>
          <FragranceBottle product={product} dramatic viewTransitionId={`pimg-${product.id}`} />
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "18px 20px 22px" }}>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: "12.5px", letterSpacing: "2.5px", color: COLORS.espresso, marginBottom: "5px" }}>
          {product.brand.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: "1.4rem",
            color: COLORS.espresso,
            marginBottom: "7px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <span style={{
            background: COLORS.copperSoft,
            border: `1px solid ${COLORS.espressoHairline}`,
            color: COLORS.copper,
            fontSize: "8.5px",
            letterSpacing: "2px",
            padding: "4px 10px",
            borderRadius: "999px",
            fontFamily: FONT_SANS,
            fontWeight: 600,
            textTransform: "uppercase",
          }}>
            {product.family}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: "15px", color: COLORS.copper, fontWeight: 600 }}>
            From ৳{product.startingPrice}
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            style={{
              fontFamily: FONT_SANS,
              fontSize: "10.5px",
              letterSpacing: "1px",
              fontWeight: 600,
              padding: "10px 16px",
              borderRadius: "999px",
              border: `1px solid ${COLORS.espresso}`,
              background: justAdded ? COLORS.espresso : hovered ? COLORS.espresso : "transparent",
              color: justAdded || hovered ? COLORS.ivory : COLORS.espresso,
              cursor: product.inStock ? "pointer" : "not-allowed",
              opacity: product.inStock ? 1 : 0.4,
              transition: "all 0.25s ease",
            }}
          >
            {justAdded ? "ADDED ✓" : "QUICK ADD"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, bg, color, border }) {
  return (
    <span
      style={{
        fontFamily: FONT_SANS,
        fontSize: "8.5px",
        letterSpacing: "1px",
        fontWeight: 700,
        padding: "5px 9px",
        borderRadius: "999px",
        background: bg,
        color,
        border: border ? `1px solid ${COLORS.espressoHairline}` : "none",
      }}
    >
      {label}
    </span>
  );
}
