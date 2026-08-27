import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COLORS, FONT_SANS, FONT_SERIF } from "../theme";
import { customerReviews } from "../data/reviews";
import useIsMobile from "../../hooks/useIsMobile";
import MaskedHeading from "./MaskedHeading";
import { prefersReducedMotion } from "../motion";

gsap.registerPlugin(ScrollTrigger);

// An editorial pull-quote card — the quote itself is the typographic
// event; rating and byline stay small and out of the way, the way a
// magazine credits a source rather than badges it.
function QuoteCard({ review }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={review.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: COLORS.ivory,
        border: `1px solid ${hov ? COLORS.copper : COLORS.espressoHairline}`,
        borderRadius: "4px",
        padding: "34px 30px 26px",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 18px 38px rgba(33,28,24,0.09)" : "0 0 0 rgba(0,0,0,0)",
        transition: "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease",
        textDecoration: "none",
        display: "block",
      }}
    >
      <div style={{ fontFamily: FONT_SERIF, fontSize: "2.4rem", lineHeight: 1, color: COLORS.copperSoft, marginBottom: "-6px" }}>
        "
      </div>
      <p
        style={{
          fontFamily: FONT_SERIF,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: hov ? "1.14rem" : "1.08rem",
          color: COLORS.espresso,
          lineHeight: 1.55,
          marginBottom: "22px",
          transition: "font-size 0.4s ease",
        }}
      >
        {review.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", paddingTop: "16px", borderTop: `1px solid ${COLORS.espressoHairline}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {review.image && (
            <img src={review.image} alt={review.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
          )}
          <div>
            <div style={{ fontFamily: FONT_SANS, fontSize: "10.5px", letterSpacing: "0.5px", color: COLORS.espressoSoft, fontWeight: 600 }}>
              {review.name}
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: "9.5px", color: COLORS.espressoFaint }}>{review.location}</div>
          </div>
        </div>
        <div style={{ color: COLORS.copper, fontSize: "10px", letterSpacing: "1px", whiteSpace: "nowrap" }}>
          {"★".repeat(review.rating)}
          <span style={{ color: COLORS.espressoHairline }}>{"★".repeat(5 - review.rating)}</span>
        </div>
      </div>
    </a>
  );
}

export default function ObReviews() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(gridRef.current.children),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: isMobile ? "70px 6%" : "120px 8%", background: COLORS.white }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? "36px" : "56px" }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "5px", color: COLORS.copper, marginBottom: "16px" }}>
          CUSTOMER REVIEWS
        </div>
        <MaskedHeading
          as="h2"
          text="Loved across Bangladesh."
          style={{
            fontFamily: FONT_SERIF, fontWeight: 400, color: COLORS.espresso,
            fontSize: "clamp(1.9rem, 4vw, 3rem)", margin: 0,
          }}
        />
      </div>

      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        {customerReviews.map((r) => (
          <QuoteCard key={r.name} review={r} />
        ))}
      </div>
    </section>
  );
}
