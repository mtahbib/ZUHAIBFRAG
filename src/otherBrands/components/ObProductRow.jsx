import { COLORS, FONT_SANS, FONT_SERIF } from "../theme";
import useIsMobile from "../../hooks/useIsMobile";
import SplitHeading from "../../components/SplitHeading";
import ObProductCard from "./ObProductCard";

// Shared horizontal-scroll product row, used for both Best Sellers and New
// Arrivals — same presentation, different data feeding it.
export default function ObProductRow({ eyebrow, title, products, background = COLORS.ivory }) {
  const isMobile = useIsMobile();
  if (!products.length) return null;

  return (
    <section style={{ padding: isMobile ? "60px 0 60px 6%" : "110px 0 110px 8%", background }}>
      <div style={{ marginBottom: isMobile ? "28px" : "44px", paddingRight: isMobile ? "6%" : "8%" }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "5px", color: COLORS.copper, marginBottom: "16px" }}>
          {eyebrow}
        </div>
        <SplitHeading
          text={title}
          style={{
            fontFamily: FONT_SERIF, fontWeight: 400, color: COLORS.espresso,
            fontSize: "clamp(1.9rem, 4vw, 3rem)", margin: 0,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: isMobile ? "12px" : "20px",
          overflowX: "auto",
          paddingBottom: "10px",
          scrollSnapType: "x proximity",
        }}
      >
        {products.map((p) => (
          <div key={p.id} style={{ width: isMobile ? "58vw" : "260px", flexShrink: 0, scrollSnapAlign: "start" }}>
            <ObProductCard product={p} />
          </div>
        ))}
        <div style={{ width: isMobile ? "1px" : "1px", flexShrink: 0 }} />
      </div>
    </section>
  );
}
