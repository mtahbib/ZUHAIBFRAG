import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COLORS, FONT_SANS, FONT_SERIF } from "../theme";
import { otherBrandsProducts } from "../data/products";
import useIsMobile from "../../hooks/useIsMobile";
import FragranceBottle from "./FragranceBottle";
import { prefersReducedMotion } from "../motion";

gsap.registerPlugin(ScrollTrigger);

const CTA_PRODUCT = otherBrandsProducts.find((p) => p.slug.includes("oud-wood")) ?? otherBrandsProducts[0];

export default function ObFinalCta() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const lineRefs = [useRef(null), useRef(null), useRef(null)];
  const ctaRef = useRef(null);
  const bottleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      gsap.set(eyebrowRef.current, { opacity: 0, y: 12 });
      gsap.set(lineRefs.map((r) => r.current), { yPercent: 110 });
      gsap.set(ctaRef.current, { opacity: 0, y: 10 });
      if (bottleRef.current) gsap.set(bottleRef.current, { opacity: 0, scale: 0.92, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
      });

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0)
        .to(lineRefs[0].current, { yPercent: 0, duration: 0.8, ease: "power3.out" }, 0.15)
        .to(lineRefs[1].current, { yPercent: 0, duration: 0.8, ease: "power3.out" }, 0.3)
        .to(lineRefs[2].current, { yPercent: 0, duration: 0.8, ease: "power3.out" }, 0.45)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.75);

      if (bottleRef.current) {
        tl.to(bottleRef.current, { opacity: 0.9, scale: 1, y: 0, duration: 1.1, ease: "power2.out" }, 0.2);
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        padding: isMobile ? "90px 6%" : "170px 8%",
        background: COLORS.espresso,
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <div ref={bottleRef} style={{ position: "absolute", top: "50%", right: "4%", transform: "translateY(-50%)", width: "300px" }}>
          <FragranceBottle product={CTA_PRODUCT} dramatic />
        </div>
      )}

      <div style={{ position: "relative", maxWidth: "820px" }}>
        <div ref={eyebrowRef} style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "5px", color: COLORS.copper, marginBottom: "26px" }}>
          ZUHAIB FRAGRANCE
        </div>
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 400,
            color: COLORS.ivory,
            fontSize: "clamp(2.4rem, 6.4vw, 5rem)",
            lineHeight: 1.08,
            margin: "0 0 46px",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div ref={lineRefs[0]}>Find the fragrance</div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div ref={lineRefs[1]}>that becomes</div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div ref={lineRefs[2]}>your signature.</div>
          </div>
        </h2>
        <div ref={ctaRef}>
          <button
            onClick={() => navigate("/other-brands/shop")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: FONT_SANS,
              fontSize: "12px",
              letterSpacing: "2.5px",
              fontWeight: 600,
              color: COLORS.ivory,
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: `1px solid ${COLORS.ivory}`,
              paddingBottom: "6px",
            }}
          >
            EXPLORE THE COLLECTION
            <span style={{ fontSize: "15px" }}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
