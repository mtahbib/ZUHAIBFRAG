import { useNavigate } from "react-router-dom";
import { COLORS, FONT_SANS, FONT_SERIF, familyTheme } from "../theme";
import { otherBrandsProducts } from "../data/products";
import useIsMobile from "../../hooks/useIsMobile";
import FragranceBottle from "./FragranceBottle";
import ObProductCard from "./ObProductCard";

const FEATURED = otherBrandsProducts.find((p) => p.slug.includes("ysl")) ?? otherBrandsProducts[0];
const STRIP = otherBrandsProducts.filter((p) => p.id !== FEATURED.id && p.bestseller).slice(0, 8);

export default function ObFeatured() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { accent } = familyTheme(FEATURED.family);

  return (
    <section style={{ padding: isMobile ? "70px 6% 60px" : "140px 8% 100px", background: COLORS.white }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "40px" : "80px",
          alignItems: "center",
          maxWidth: "1320px",
          margin: "0 auto",
        }}
      >
        <div style={{ maxWidth: isMobile ? "280px" : "440px", margin: isMobile ? "0 auto" : 0 }}>
          <FragranceBottle product={FEATURED} dramatic />
        </div>

        <div>
          <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "4px", color: COLORS.copper, marginBottom: "16px" }}>
            FEATURED FRAGRANCE
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: "11px", letterSpacing: "1.5px", color: COLORS.espressoFaint, marginBottom: "10px" }}>
            {FEATURED.brand.toUpperCase()}
          </div>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 400,
              color: COLORS.espresso,
              fontSize: "clamp(2.2rem, 4.4vw, 3.6rem)",
              lineHeight: 1.05,
              margin: "0 0 18px",
            }}
          >
            {FEATURED.name}
          </h2>
          <div style={{ fontFamily: FONT_SANS, fontSize: "12px", color: accent, letterSpacing: "1px", marginBottom: "26px" }}>
            {[...FEATURED.topNotes.slice(0, 1), FEATURED.family, ...FEATURED.baseNotes.slice(0, 1)].join(" · ")}
          </div>

          <div style={{ display: "flex", gap: isMobile ? "24px" : "40px", marginBottom: "30px", flexWrap: "wrap" }}>
            <NoteColumn label="Top" notes={FEATURED.topNotes} />
            <NoteColumn label="Heart" notes={FEATURED.heartNotes} />
            <NoteColumn label="Base" notes={FEATURED.baseNotes} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: "1.6rem", color: COLORS.espresso }}>
              From ৳{FEATURED.startingPrice}
            </div>
            <button
              onClick={() => navigate(`/other-brands/product/${FEATURED.slug}`)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: FONT_SANS,
                fontSize: "11px",
                letterSpacing: "2px",
                fontWeight: 600,
                color: COLORS.espresso,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: `1px solid ${COLORS.espresso}`,
                paddingBottom: "5px",
              }}
            >
              EXPLORE FRAGRANCE
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal strip — supporting products, not the main event */}
      <div style={{ marginTop: isMobile ? "60px" : "100px", maxWidth: "1320px", margin: `${isMobile ? "60px" : "100px"} auto 0` }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "3px", color: COLORS.espressoFaint, marginBottom: "20px" }}>
          MORE TO EXPLORE
        </div>
        <div style={{ display: "flex", gap: isMobile ? "12px" : "18px", overflowX: "auto", paddingBottom: "8px" }}>
          {STRIP.map((p) => (
            <div key={p.id} style={{ width: isMobile ? "56vw" : "220px", flexShrink: 0 }}>
              <ObProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NoteColumn({ label, notes }) {
  return (
    <div>
      <div style={{ fontFamily: FONT_SANS, fontSize: "9px", letterSpacing: "2px", color: COLORS.espressoFaint, marginBottom: "6px" }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: "0.95rem", color: COLORS.espressoSoft }}>
        {notes.join(", ")}
      </div>
    </div>
  );
}
