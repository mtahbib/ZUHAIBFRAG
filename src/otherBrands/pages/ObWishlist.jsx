import { Link } from "react-router-dom";
import { COLORS, FONT_SANS, FONT_SERIF } from "../theme";
import { otherBrandsProducts } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import useIsMobile from "../../hooks/useIsMobile";
import ObProductCard from "../components/ObProductCard";

export default function ObWishlist() {
  const isMobile = useIsMobile();
  const { ids } = useWishlist();
  const items = otherBrandsProducts.filter((p) => ids.includes(p.id));

  return (
    <div style={{ background: COLORS.ivory, minHeight: "60vh", padding: isMobile ? "50px 6% 80px" : "80px 8% 120px" }}>
      <div style={{ textAlign: "center", marginBottom: "44px" }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "5px", color: COLORS.copper, marginBottom: "16px" }}>
          YOUR WISHLIST
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: "clamp(1.9rem, 4vw, 3rem)", color: COLORS.espresso }}>
          Saved for later.
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", color: COLORS.espressoFaint, fontFamily: FONT_SANS, fontSize: "13px" }}>
          Nothing saved yet.{" "}
          <Link to="/other-brands" style={{ color: COLORS.copper }}>
            Explore fragrances →
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(240px, 1fr))",
            gap: isMobile ? "12px" : "22px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {items.map((p) => (
            <ObProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
