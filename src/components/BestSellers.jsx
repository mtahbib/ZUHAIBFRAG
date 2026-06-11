import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  { name: "Sauvage Inspired",     desc: "Fresh · Ambroxan · Masculine",    tag: "BESTSELLER" },
  { name: "Aventus Inspired",     desc: "Pineapple · Smoky · Powerful",    tag: "ICONIC" },
  { name: "Imagination Inspired", desc: "Citrus · Tea · Elegant",          tag: "FRESH" },
  { name: "Erba Pura Inspired",   desc: "Fruity · Sweet · Addictive",      tag: "SWEET" },
];

function Card({ product, index, cardRef }) {
  const [hovered, setHovered] = useState(false);
  const innerRef = useRef(null);

  const onMove = (e) => {
    const el   = innerRef.current;
    const rect = el.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.03)`;
    el.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(212,175,55,0.09), transparent 65%), #0a0a0a`;
  };

  const onLeave = () => {
    const el = innerRef.current;
    el.style.transition = "transform 0.7s cubic-bezier(0.16,1,0.3,1), background 0.5s ease";
    el.style.transform  = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.background = "#0a0a0a";
    setTimeout(() => { el.style.transition = ""; }, 700);
    setHovered(false);
  };

  return (
    <div ref={cardRef} style={{ perspective: "700px" }}>
      <div
        ref={innerRef}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        style={{
          background: "#0a0a0a",
          border: `1px solid ${hovered ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.12)"}`,
          borderRadius: "24px",
          padding: "45px 35px",
          textAlign: "center",
          willChange: "transform",
          transition: "border-color 0.3s ease",
          position: "relative",
          overflow: "hidden",
          cursor: "none",
        }}
      >
        {/* Tag */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(212,175,55,0.12)",
            border: "1px solid rgba(212,175,55,0.25)",
            color: "#D4AF37",
            fontSize: "8px",
            letterSpacing: "3px",
            padding: "5px 12px",
            borderRadius: "999px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
          }}
        >
          {product.tag}
        </div>

        {/* Number */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "24px",
            color: "rgba(212,175,55,0.15)",
            fontSize: "3rem",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          0{index + 1}
        </div>

        <img
          src="/bottle.png"
          alt={product.name}
          style={{
            width: "200px",
            maxWidth: "80%",
            marginBottom: "24px",
            marginTop: "20px",
            filter: "drop-shadow(0 0 40px rgba(212,175,55,0.3))",
            transform: hovered ? "translateY(-8px) scale(1.04)" : "translateY(0) scale(1)",
            transition: "transform 0.5s ease",
          }}
        />

        <h3
          style={{
            color: "#fff",
            marginBottom: "10px",
            fontSize: "1.3rem",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            color: "rgba(255,255,255,0.38)",
            marginBottom: "28px",
            fontSize: "11px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            letterSpacing: "1.5px",
          }}
        >
          {product.desc}
        </p>

        <button
          style={{
            background: hovered ? "#D4AF37" : "transparent",
            border: "1px solid rgba(212,175,55,0.4)",
            color: hovered ? "#000" : "#D4AF37",
            padding: "12px 28px",
            borderRadius: "999px",
            cursor: "none",
            fontWeight: 600,
            fontSize: "10px",
            letterSpacing: "3px",
            fontFamily: "'Montserrat', sans-serif",
            transition: "all 0.35s ease",
          }}
        >
          VIEW FRAGRANCE
        </button>
      </div>
    </div>
  );
}

export default function BestSellers() {
  const isMobile   = useIsMobile();
  const sectionRef = useRef(null);
  const cardsRef   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.16, ease: "power3.out", clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true } }
      );
    }, sectionRef);
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#000",
        padding: isMobile ? "80px 5%" : "140px 8%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background text watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(8rem,18vw,18rem)",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          color: "rgba(255,255,255,0.018)",
          letterSpacing: "0.3em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        YB
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
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
            BEST SELLERS
          </div>
          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(2.8rem,6vw,5rem)",
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
            }}
          >
            Yusuf Bhai Collection
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              maxWidth: "500px",
              margin: "20px auto 0",
              lineHeight: "2",
              fontSize: "12px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
            }}
          >
            Discover Dubai's most loved inspired fragrances.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {PRODUCTS.map((product, i) => (
            <Card
              key={product.name}
              product={product}
              index={i}
              cardRef={(el) => (cardsRef.current[i] = el)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
