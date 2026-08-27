import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COLORS, FONT_SANS, FONT_SERIF, familyTheme } from "../theme";
import { fragranceHouses } from "../data/brands";
import { otherBrandsProducts } from "../data/products";
import useIsMobile from "../../hooks/useIsMobile";
import FragranceBottle from "./FragranceBottle";
import { prefersReducedMotion } from "../motion";

gsap.registerPlugin(ScrollTrigger);

function representativeProduct(brandName) {
  return otherBrandsProducts.find((p) => p.brand === brandName) ?? otherBrandsProducts[0];
}

export default function ObHousesWall() {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(null);
  const hoveredHouse = fragranceHouses.find((h) => h.name === hovered);
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const indexRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        Array.from(introRef.current.children),
        { y: 26, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
        }
      );
      // The house index reads like a masthead — names settle in from a
      // shared baseline, each a beat behind the last.
      gsap.fromTo(
        Array.from(indexRef.current.children),
        { y: 18, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: indexRef.current, start: "top 88%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", padding: isMobile ? "70px 6%" : "140px 8%", background: COLORS.sand, overflow: "hidden" }}>
      <div ref={introRef}>
        <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "5px", color: COLORS.copper, marginBottom: "16px" }}>
          THE FRAGRANCE HOUSES
        </div>
        <p style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.espressoFaint, maxWidth: "480px", marginBottom: isMobile ? "40px" : "72px", lineHeight: 1.8 }}>
          Zuhaib Fragrance curates and sells decants from these independent houses — each brand remains its own.
        </p>
      </div>

      <div ref={indexRef} style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: isMobile ? "10px 22px" : "16px 44px" }}>
        {fragranceHouses.map((house) => {
          const isActive = hovered === house.name;
          return (
            <button
              key={house.name}
              onMouseEnter={() => setHovered(house.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "default",
                fontFamily: FONT_SERIF,
                fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                color: isActive ? COLORS.espresso : COLORS.espressoFaint,
                opacity: hovered && !isActive ? 0.45 : 1,
                transition: "color 0.3s ease, opacity 0.3s ease",
              }}
            >
              {house.name}
            </button>
          );
        })}
      </div>

      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "6%",
            transform: "translateY(-50%)",
            width: "200px",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          {fragranceHouses.map((house) => (
            <div
              key={house.name}
              style={{
                position: "absolute",
                inset: 0,
                opacity: hovered === house.name ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            >
              <div style={{ width: "170px", margin: "0 auto" }}>
                <FragranceBottle product={representativeProduct(house.name)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: isMobile ? "36px" : "56px", minHeight: "44px" }}>
        {hoveredHouse && !isMobile && (
          <div style={{ maxWidth: "440px" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "1px", color: familyTheme(representativeProduct(hoveredHouse.name).family).accent, marginBottom: "6px" }}>
              {hoveredHouse.origin}
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.espressoSoft, lineHeight: 1.8 }}>
              {hoveredHouse.blurb}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
