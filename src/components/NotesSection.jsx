import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

const NOTES = [
  {
    tier: "Top Notes",
    subtitle: "First Impression",
    icon: "◎",
    color: "rgba(255,220,120,0.8)",
    items: ["Bergamot", "Lemon", "Apple", "Citrus Accord"],
    desc: "The opening act — bright, fresh, and immediate.",
  },
  {
    tier: "Heart Notes",
    subtitle: "The Soul",
    icon: "❋",
    color: "rgba(212,175,55,1)",
    items: ["Jasmine", "Rose", "Lavender", "Spice Accord"],
    desc: "The character of the fragrance — warm, rich, and complex.",
  },
  {
    tier: "Base Notes",
    subtitle: "The Memory",
    icon: "◈",
    color: "rgba(180,130,30,0.9)",
    items: ["Amber", "Musk", "Vanilla", "Sandalwood"],
    desc: "The lasting impression — deep, sensual, and unforgettable.",
  },
];

function NoteCard({ note, cardRef }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(212,175,55,0.04)" : "#0a0a0a",
        border: `1px solid ${hovered ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.1)"}`,
        borderRadius: "28px",
        padding: "55px 45px",
        textAlign: "center",
        transition: "all 0.4s ease",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered ? "0 24px 60px rgba(212,175,55,0.07)" : "none",
        cursor: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow orb behind icon */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${note.color.replace("1)", "0.12)")} 0%, transparent 70%)`,
          filter: "blur(20px)",
          transition: "opacity 0.4s ease",
          opacity: hovered ? 1 : 0.4,
        }}
      />

      {/* Icon */}
      <div
        style={{
          fontSize: "2.4rem",
          color: note.color,
          marginBottom: "22px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {note.icon}
      </div>

      <div
        style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "9px",
          letterSpacing: "5px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          marginBottom: "8px",
        }}
      >
        {note.subtitle.toUpperCase()}
      </div>

      <h3
        style={{
          color: "#D4AF37",
          fontSize: "1.9rem",
          marginBottom: "14px",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
        }}
      >
        {note.tier}
      </h3>

      <p
        style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "11px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          lineHeight: "1.8",
          marginBottom: "28px",
          letterSpacing: "0.5px",
        }}
      >
        {note.desc}
      </p>

      <div
        style={{
          width: "30px",
          height: "1px",
          background: "rgba(212,175,55,0.3)",
          margin: "0 auto 24px",
        }}
      />

      {note.items.map((item) => (
        <div
          key={item}
          style={{
            color: "rgba(255,255,255,0.5)",
            marginBottom: "10px",
            fontSize: "12px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            letterSpacing: "2px",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default function NotesSection() {
  const isMobile   = useIsMobile();
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const cardsRef   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerChildren = Array.from(headerRef.current.children);
      const cards = cardsRef.current.filter(Boolean);

      gsap.fromTo(
        headerChildren,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.14,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        cards,
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.17,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );
    }, sectionRef);

    // Recalculate trigger positions after React finishes rendering
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      ctx.revert();
      clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#050505",
        padding: isMobile ? "80px 5%" : "140px 8%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative diagonal line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "8%",
          width: "1px",
          height: "100%",
          background:
            "linear-gradient(to bottom, transparent, rgba(212,175,55,0.15), transparent)",
          pointerEvents: "none",
        }}
      />

      <div ref={headerRef} style={{ textAlign: "center", marginBottom: "90px" }}>
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
          FRAGRANCE EXPERIENCE
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
          Discover The Notes
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            maxWidth: "480px",
            margin: "20px auto 0",
            lineHeight: "2",
            fontSize: "12px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
          }}
        >
          Every great fragrance unfolds in three acts.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "28px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {NOTES.map((note, i) => (
          <NoteCard
            key={note.tier}
            note={note}
            cardRef={(el) => (cardsRef.current[i] = el)}
          />
        ))}
      </div>
    </section>
  );
}
