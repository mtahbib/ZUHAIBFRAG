import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, FONT_SERIF, familyTheme } from "../theme";
import { MOODS } from "../moodMap";
import { otherBrandsProducts } from "../data/products";
import useIsMobile from "../../hooks/useIsMobile";
import FragranceBottle from "./FragranceBottle";

function representativeProduct(mood) {
  return otherBrandsProducts.find((p) => mood.families.includes(p.family)) ?? otherBrandsProducts[0];
}

export default function ObMoodWords() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const activeTheme = hovered ? familyTheme(moodFamilyFor(hovered)) : null;

  function moodFamilyFor(key) {
    return MOODS.find((m) => m.key === key)?.families[0];
  }

  const goToMood = (key) => navigate(`/other-brands/shop?mood=${key}`);

  return (
    <section
      style={{
        position: "relative",
        padding: isMobile ? "80px 6% 70px" : "150px 8% 130px",
        background: activeTheme ? activeTheme.soft : COLORS.ivory,
        transition: "background 0.6s ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 400,
          color: COLORS.espresso,
          fontSize: "clamp(1.9rem, 4.6vw, 3.4rem)",
          lineHeight: 1.05,
          marginBottom: isMobile ? "44px" : "80px",
          maxWidth: "700px",
        }}
      >
        What do you want
        <br />
        to smell like?
      </div>

      <div style={{ position: "relative" }}>
        {MOODS.map((mood) => {
          const isActive = hovered === mood.key;
          return (
            <button
              key={mood.key}
              onClick={() => goToMood(mood.key)}
              onMouseEnter={() => setHovered(mood.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                borderTop: `1px solid ${COLORS.espressoHairline}`,
                padding: isMobile ? "20px 0" : "26px 0",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontStyle: isActive ? "italic" : "normal",
                  fontWeight: 400,
                  fontSize: "clamp(2.4rem, 7.5vw, 5.2rem)",
                  color: isActive ? familyTheme(mood.families[0]).accent : COLORS.espresso,
                  transition: "color 0.3s ease, font-style 0.3s ease, transform 0.3s ease",
                  display: "inline-block",
                  transform: isActive && !isMobile ? "translateX(18px)" : "translateX(0)",
                }}
              >
                {mood.label}
              </span>
            </button>
          );
        })}
        <div style={{ borderTop: `1px solid ${COLORS.espressoHairline}` }} />

        {!isMobile && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "4%",
              transform: "translateY(-50%)",
              width: "220px",
              height: "220px",
              pointerEvents: "none",
            }}
          >
            {MOODS.map((mood) => (
              <div
                key={mood.key}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: hovered === mood.key ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              >
                <FragranceBottle product={representativeProduct(mood)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
