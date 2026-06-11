import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import useIsMobile from "../hooks/useIsMobile";
import SplitHeading from "./SplitHeading";

gsap.registerPlugin(ScrollTrigger);

const COLLECTIONS = [
  {
    title: "Male",
    count: "16 Fragrances",
    icon: "♂",
    products: ["Ultra Male", "Le Male Elixir", "Sauvage Elixir", "Aventus Absolut"],
    category: "male",
  },
  {
    title: "Female",
    count: "6 Fragrances",
    icon: "♀",
    products: ["Good Girl", "Libre", "Black Opium", "Coco Mademoiselle"],
    category: "female",
  },
  {
    title: "Unisex",
    count: "5 Fragrances",
    icon: "◈",
    products: ["Baccarat Rouge 540", "Pacific Chill", "Wulong Cha", "French Oud"],
    category: "unisex",
  },
];

export default function Collections() {
  const isMobile   = useIsMobile();
  const sectionRef = useRef(null);
  const cardsRef   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.18, ease: "power3.out", clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true } }
      );
    }, sectionRef);
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  return (
    <section
      id="collection"
      ref={sectionRef}
      style={{ background: "#000", padding: isMobile ? "80px 5%" : "140px 8%", position: "relative" }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "90px" }}>
        <div
          style={{
            color: "#D4AF37",
            letterSpacing: "8px",
            marginBottom: "20px",
            fontSize: "10px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
          }}
        >
          SHOP BY COLLECTION
        </div>
        <SplitHeading
          text="Find Your Signature Scent"
          style={{
            color: "#fff",
            fontSize: "clamp(2.8rem,6vw,5rem)",
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "28px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {COLLECTIONS.map((col, i) => (
          <CollectionCard
            key={col.title}
            col={col}
            ref={(el) => (cardsRef.current[i] = el)}
          />
        ))}
      </div>
    </section>
  );
}

import { forwardRef, useState } from "react";

const CollectionCard = forwardRef(function CollectionCard({ col }, ref) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(212,175,55,0.04)"
          : "#0a0a0a",
        border: `1px solid ${hovered ? "rgba(212,175,55,0.45)" : "rgba(212,175,55,0.12)"}`,
        borderRadius: "24px",
        padding: "50px 40px",
        transition: "all 0.4s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 60px rgba(212,175,55,0.08)"
          : "none",
        cursor: "none",
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: "2.2rem",
          color: "#D4AF37",
          marginBottom: "20px",
          opacity: 0.8,
        }}
      >
        {col.icon}
      </div>

      <h3
        style={{
          color: "#fff",
          fontSize: "2rem",
          marginBottom: "6px",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
        }}
      >
        {col.title}
      </h3>

      <div
        style={{
          color: "#D4AF37",
          marginBottom: "28px",
          fontSize: "11px",
          letterSpacing: "3px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
        }}
      >
        {col.count}
      </div>

      <div
        style={{
          width: "30px",
          height: "1px",
          background: "rgba(212,175,55,0.3)",
          marginBottom: "24px",
        }}
      />

      {col.products.map((p) => (
        <div
          key={p}
          style={{
            color: "rgba(255,255,255,0.4)",
            marginBottom: "12px",
            fontSize: "12px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ color: "#D4AF37", fontSize: "8px" }}>◆</span>
          {p}
        </div>
      ))}

      <button
        onClick={() =>
          document
            .getElementById("catalog")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        style={{
          marginTop: "30px",
          background: hovered ? "#D4AF37" : "transparent",
          color: hovered ? "#000" : "#D4AF37",
          border: "1px solid rgba(212,175,55,0.4)",
          padding: "13px 30px",
          borderRadius: "999px",
          cursor: "none",
          fontWeight: 600,
          fontSize: "10px",
          letterSpacing: "3px",
          fontFamily: "'Montserrat', sans-serif",
          transition: "all 0.35s ease",
        }}
      >
        VIEW COLLECTION
      </button>
    </div>
  );
});
