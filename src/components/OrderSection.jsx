import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import useIsMobile from "../hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

export default function OrderSection() {
  const isMobile   = useIsMobile();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(contentRef.current.children),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: "power3.out", clearProps: "opacity,transform",
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
        padding: isMobile ? "80px 5%" : "160px 8%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Pulsing rings */}
      {[260, 420, 600].map((size, i) => (
        <div
          key={size}
          style={{
            position: "absolute",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: "1px solid rgba(212,175,55,0.08)",
            top: "50%",
            left: "50%",
            animation: `order-ring ${3.5 + i * 0.8}s ease-in-out ${i * 0.6}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "pulse-glow 5s ease-in-out infinite",
        }}
      />

      <div
        ref={contentRef}
        style={{
          maxWidth: "800px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: "#D4AF37",
            letterSpacing: "10px",
            marginBottom: "20px",
            fontSize: "10px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
          }}
        >
          ORDER NOW
        </div>

        <h2
          style={{
            color: "#fff",
            fontSize: "clamp(3rem,7vw,6rem)",
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            lineHeight: 1.1,
          }}
        >
          Authentic Yusuf Bhai
        </h2>

        <h2
          style={{
            color: "#D4AF37",
            fontSize: "clamp(2rem,5vw,4rem)",
            marginTop: "8px",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          Delivered Across Bangladesh
        </h2>

        <div
          style={{
            width: "55px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            margin: "30px auto",
          }}
        />

        <p
          style={{
            color: "rgba(255,255,255,0.38)",
            maxWidth: "580px",
            margin: "0 auto",
            lineHeight: "2.2",
            fontSize: "13px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.8px",
          }}
        >
          Message us directly on WhatsApp to place your order, check
          availability, and receive personal fragrance recommendations.
        </p>

        <a
          href="https://wa.me/8801790221253"
          target="_blank"
          rel="noreferrer"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.color = "#000";
            e.currentTarget.style.letterSpacing = "5px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#D4AF37";
            e.currentTarget.style.color = "#000";
            e.currentTarget.style.letterSpacing = "4px";
          }}
          style={{
            display: "inline-block",
            marginTop: "44px",
            background: "#D4AF37",
            color: "#000",
            textDecoration: "none",
            padding: "18px 55px",
            borderRadius: "999px",
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "4px",
            fontFamily: "'Montserrat', sans-serif",
            transition: "all 0.35s ease",
          }}
        >
          ORDER ON WHATSAPP
        </a>
      </div>
    </section>
  );
}
